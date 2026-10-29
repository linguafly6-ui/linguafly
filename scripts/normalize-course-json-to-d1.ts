/**
 * Normalize canonical B1-C2 JSON course units into learning_courses,
 * learning_lessons and learning_exercises. A1/A2 are intentionally excluded:
 * their curated D1 exercise IDs and learner history require a separate mapping.
 *
 * Usage: npx tsx scripts/normalize-course-json-to-d1.ts --sql-out-dir /tmp/d1-normalized-seed
 * This generates idempotent SQL; it does not connect to D1.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const SOURCE_ROOT = path.join(ROOT, "src", "content", "cursos");
const LEVELS = [
  { folder: "ingles-b1", level: "B1", courseId: "english-b1", title: "English B1: Independent User" },
  { folder: "ingles-b2", level: "B2", courseId: "english-b2", title: "English B2: Upper Intermediate" },
  { folder: "ingles-c1", level: "C1", courseId: "english-c1", title: "English C1: Advanced" },
  { folder: "ingles-c2", level: "C2", courseId: "english-c2", title: "English C2: Proficiency" },
] as const;

const argIndex = process.argv.findIndex((arg) => arg === "--sql-out-dir");
if (argIndex < 0 || !process.argv[argIndex + 1]) {
  console.error("Usage: normalize-course-json-to-d1.ts --sql-out-dir <directory>");
  process.exit(1);
}
const OUT = path.resolve(process.argv[argIndex + 1]);

type Option = { id?: string; text?: string };
type Interaction = {
  interaction_id: string;
  type: string;
  mastery_tag?: string;
  concept_tags?: string[];
  prompt_es?: string;
  question_en?: string;
  stimulus_en?: string;
  correct_answer?: unknown;
  options?: Option[];
  explanation?: string;
  transcript?: string;
  main_text?: string;
  gaps?: { id: string; options: Option[] }[];
  pairs?: { id?: string; left: string; right: string }[];
  [key: string]: unknown;
};
type Unit = {
  course: { level: string; unit_id: string; unit_title: string; total_duration_minutes?: number };
  learning_outcomes?: string[];
  mastery_tags?: string[];
  blocks: { block_id?: string; title: string; duration_minutes?: number; content: Interaction[] }[];
};

function sqlString(value: unknown): string {
  return "'" + String(value ?? "").replace(/'/g, "''") + "'";
}
function json(value: unknown): string { return JSON.stringify(value ?? null); }
function validateExerciseId(id: string, file: string): void {
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) {
    throw new Error(`Exercise ID is incompatible with learner-progress API validation in ${file}: ${id}`);
  }
}
function sectionFor(item: Interaction, blockTitle: string): string {
  const text = [item.mastery_tag, ...(item.concept_tags ?? []), blockTitle, item.type].join(" ").toLowerCase();
  if (/listening|audio|listen/.test(text)) return "listening";
  if (/reading|comprehension|read/.test(text)) return "reading";
  if (/vocab|idiom|word-formation|word formation|collocation/.test(text)) return "vocabulary";
  if (/production|speaking|writing|communication/.test(text)) return "production";
  return "grammar";
}
function promptFor(item: Interaction): string {
  if (/fill.?blanks?/i.test(item.type) && typeof item.main_text === "string") {
    return [item.prompt_es, item.main_text].filter((value) => typeof value === "string" && value.trim()).join("\n\n");
  }
  return [item.question_en, item.stimulus_en, item.prompt_es]
    .find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
}
function expectedText(answer: unknown, options: Option[]): string {
  if (typeof answer === "string") {
    return options.find((option) => option.id === answer)?.text ?? answer;
  }
  if (Array.isArray(answer)) {
    return answer.map((part) => {
      const found = options.find((option) => option.id === String(part));
      return found?.text ?? String(part);
    }).join(" ");
  }
  if (typeof answer === "boolean") return answer ? "True" : "False";
  return answer == null ? "" : String(answer);
}
function typeFor(item: Interaction, options: string[]): string {
  const type = item.type.toLowerCase();
  if (/sentence.?building/.test(type)) return "sentence_building";
  if (/true.?false/.test(type)) return "multiple_choice";
  if (options.length || /multiple.?choice|reading.?comprehension|listening.?comprehension/.test(type)) return "multiple_choice";
  if (/fill.?blank|open.?cloze|cloze/.test(type)) return "fill_blank";
  return "free_text";
}
function optionTexts(options: Option[]): string[] {
  return options.map((option) => String(option.text ?? "")).filter(Boolean);
}
function exerciseStatement(
  lessonId: string,
  id: string,
  number: number,
  section: string,
  type: string,
  prompt: string,
  options: string[],
  correct: string,
  explanation: string,
  source: unknown,
  audioText: string
): string {
  return `INSERT INTO learning_exercises
  (id, lesson_id, exercise_number, exercise_type, prompt, options_json, answer_json, explanation, ai_generated, section_type, audio_text)
VALUES
  (${sqlString(id)}, ${sqlString(lessonId)}, ${number}, ${sqlString(type)}, ${sqlString(prompt)},
   ${sqlString(json(options))}, ${sqlString(json({ correct, source }))}, ${sqlString(explanation)}, 0,
   ${sqlString(section)}, ${audioText ? sqlString(audioText) : "NULL"})
ON CONFLICT(id) DO UPDATE SET
  exercise_number = excluded.exercise_number,
  exercise_type = excluded.exercise_type,
  prompt = excluded.prompt,
  options_json = excluded.options_json,
  answer_json = excluded.answer_json,
  explanation = excluded.explanation,
  section_type = excluded.section_type,
  audio_text = excluded.audio_text;`;
}

function main() {
  const statements: string[] = [];
  const summary: Record<string, { units: number; exercises: number; bySection: Record<string, number> }> = {};
  for (const levelConfig of LEVELS) {
    const dir = path.join(SOURCE_ROOT, levelConfig.folder);
    if (!fs.existsSync(dir)) throw new Error(`Missing canonical course folder: ${levelConfig.folder}`);
    const files = fs.readdirSync(dir).map((name) => {
      const match = /^unit(\d+)\.json$/i.exec(name);
      return match ? { name, number: Number(match[1]) } : null;
    }).filter((item): item is { name: string; number: number } => item !== null)
      .sort((a, b) => a.number - b.number);
    if (!files.length) throw new Error(`No unitN.json files found in ${levelConfig.folder}`);

    summary[levelConfig.level] = { units: files.length, exercises: 0, bySection: {} };
    statements.push(`INSERT INTO learning_courses (id, title, level, description, published)
VALUES (${sqlString(levelConfig.courseId)}, ${sqlString(levelConfig.title)}, ${sqlString(levelConfig.level)},
${sqlString(`Curso ${levelConfig.level} con contenido original normalizado y seguimiento individual.`)}, 1)
ON CONFLICT(id) DO UPDATE SET title = excluded.title, level = excluded.level,
description = excluded.description, published = 1, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now');`);

    for (const file of files) {
      const absolute = path.join(dir, file.name);
      let unit: Unit;
      try { unit = JSON.parse(fs.readFileSync(absolute, "utf8")) as Unit; }
      catch (error) { throw new Error(`Invalid JSON in ${path.relative(ROOT, absolute)}: ${String(error)}`); }
      if (!unit.course || unit.course.level?.toUpperCase() !== levelConfig.level ||
          !unit.course.unit_title || !Array.isArray(unit.blocks)) {
        throw new Error(`Invalid course metadata/blocks in ${path.relative(ROOT, absolute)}`);
      }
      const unitNumber = file.number;
      const lessonId = `${levelConfig.level.toLowerCase()}-${String(unitNumber).padStart(2, "0")}`;
      const objective = (unit.learning_outcomes ?? []).join(" · ");
      const safeContent = {
        objective,
        learningOutcomes: unit.learning_outcomes ?? [],
        masteryTags: unit.mastery_tags ?? [],
        sections: unit.blocks.map((block) => ({
          type: "learn", title: block.title,
          body: `${block.content.length} actividades · ${block.duration_minutes ?? 0} min`,
        })),
        reviewEnabled: true,
        source: { courseKey: levelConfig.folder, unitId: unit.course.unit_id, file: path.relative(ROOT, absolute).split(path.sep).join("/") },
      };
      const estimated = Math.min(60, Math.max(1, Math.round((unit.course.total_duration_minutes ?? 20) / 30)));
      statements.push(`INSERT INTO learning_lessons
  (id, course_id, lesson_number, unit_number, title, objective, estimated_minutes, content_json, published)
VALUES (${sqlString(lessonId)}, ${sqlString(levelConfig.courseId)}, ${unitNumber}, ${unitNumber},
  ${sqlString(unit.course.unit_title)}, ${sqlString(objective)}, ${estimated}, ${sqlString(json(safeContent))}, 1)
ON CONFLICT(id) DO UPDATE SET title = excluded.title, objective = excluded.objective,
estimated_minutes = excluded.estimated_minutes, content_json = excluded.content_json, published = 1;`);

      let exerciseNumber = 0;
      const seenIds = new Set<string>();
      for (const block of unit.blocks) {
        if (!Array.isArray(block.content)) throw new Error(`Invalid block content in ${levelConfig.folder}/${file.name}`);
        for (const item of block.content) {
          if (!item || typeof item.interaction_id !== "string" || !item.interaction_id.trim()) {
            throw new Error(`Missing interaction_id in ${levelConfig.folder}/${file.name}`);
          }
          const section = sectionFor(item, block.title);
          const sourceMeta = { blockId: block.block_id ?? "", blockTitle: block.title, masteryTag: item.mastery_tag ?? "", conceptTags: item.concept_tags ?? [] };
          const baseOptions = optionTexts(item.options ?? []);
          const audioText = String(item.transcript ?? (section === "listening" ? item.stimulus_en ?? "" : ""));
          const rawExplanation = String(item.explanation ?? "");
          const explanation = /\bundefined\b/i.test(rawExplanation) ? "" : rawExplanation;

          if (/matching|match/i.test(item.type) && Array.isArray(item.pairs) && item.pairs.length) {
            const matchingOptions = item.pairs.map((pair) => pair.right);
            for (let pairIndex = 0; pairIndex < item.pairs.length; pairIndex++) {
              const pair = item.pairs[pairIndex];
              const id = `${item.interaction_id}__match_${pair.id || String(pairIndex + 1)}`;
              validateExerciseId(id, `${levelConfig.folder}/${file.name}`);
              validateExerciseId(id, `${levelConfig.folder}/${file.name}`);
              validateExerciseId(id, `${levelConfig.folder}/${file.name}`);
          if (seenIds.has(id)) throw new Error(`Duplicate exercise ID ${id} in ${levelConfig.folder}/${file.name}`);
              seenIds.add(id); exerciseNumber++;
              statements.push(exerciseStatement(lessonId, id, exerciseNumber, section, "multiple_choice",
                pair.left, matchingOptions, pair.right, explanation || `Respuesta correcta: ${pair.right}`, { ...sourceMeta, sourceInteractionId: item.interaction_id, sourceType: item.type, variant: "match", pairId: pair.id || String(pairIndex + 1) }, audioText));
              summary[levelConfig.level].exercises++;
              summary[levelConfig.level].bySection[section] = (summary[levelConfig.level].bySection[section] ?? 0) + 1;
            }
            continue;
          }

          if (/cloze/i.test(item.type) && Array.isArray(item.gaps) && item.gaps.length) {
            const mainText = String(item.main_text ?? "");
            for (let gapIndex = 0; gapIndex < item.gaps.length; gapIndex++) {
              const gap = item.gaps[gapIndex];
              const id = `${item.interaction_id}__gap_${gap.id}`;
              if (seenIds.has(id)) throw new Error(`Duplicate exercise ID ${id} in ${levelConfig.folder}/${file.name}`);
              seenIds.add(id);
              const answerId = item.correct_answer && typeof item.correct_answer === "object"
                ? (item.correct_answer as Record<string, unknown>)[gap.id] : undefined;
              const correct = expectedText(answerId, gap.options ?? []);
              const gapNumber = Number(gap.id) || gapIndex + 1;
              const line = mainText.split("\n").map((part) => part.trim()).find((part) => new RegExp("^" + gapNumber + "\\.").test(part)) || mainText;
              const prompt = line.replace(/^\d+\.\s*/, "").replace(/\[GAP\s*\d+\]/gi, "_____").replace(/\(\d+\)/g, "").trim();
              exerciseNumber++;
              statements.push(exerciseStatement(lessonId, id, exerciseNumber, section, "multiple_choice",
                prompt || promptFor(item), optionTexts(gap.options ?? []), correct, explanation || `Respuesta correcta: ${correct}`,
                { ...sourceMeta, sourceInteractionId: item.interaction_id, sourceType: item.type, variant: "gap", gapId: gap.id }, audioText));
              summary[levelConfig.level].exercises++;
              summary[levelConfig.level].bySection[section] = (summary[levelConfig.level].bySection[section] ?? 0) + 1;
            }
            continue;
          }

          const id = item.interaction_id;
          if (seenIds.has(id)) throw new Error(`Duplicate exercise ID ${id} in ${levelConfig.folder}/${file.name}`);
          seenIds.add(id); exerciseNumber++;
          const correct = expectedText(item.correct_answer, item.options ?? []);
          const options = /true.?false/i.test(item.type) ? ["True", "False"] : baseOptions;
          const type = typeFor(item, options);
          statements.push(exerciseStatement(lessonId, id, exerciseNumber, section, type,
            promptFor(item), options, correct, explanation || (correct ? `Respuesta correcta: ${correct}` : ""), { ...sourceMeta, sourceInteractionId: item.interaction_id, sourceType: item.type }, audioText));
          summary[levelConfig.level].exercises++;
          summary[levelConfig.level].bySection[section] = (summary[levelConfig.level].bySection[section] ?? 0) + 1;
        }
      }
      if (!exerciseNumber) throw new Error(`No exercises found in ${levelConfig.folder}/${file.name}`);
    }
  }

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const chunkSize = 20;
  for (let start = 0; start < statements.length; start += chunkSize) {
    const filename = `batch-${String(Math.floor(start / chunkSize) + 1).padStart(3, "0")}.sql`;
    fs.writeFileSync(path.join(OUT, filename), statements.slice(start, start + chunkSize).join("\n"));
  }
  console.log(`[course-normalize] Generated ${statements.length} idempotent SQL statements in ${Math.ceil(statements.length / chunkSize)} batches.`);
  console.log(JSON.stringify(summary, null, 2));
}
main();
