/**
 * Synchronizes all C2 units in the D1 JSON mirror from the authored C2 catalog.
 * Existing C2 rows are updated so Preview cannot retain stale lesson content.
 *
 * Usage:
 *   npx tsx scripts/sync-c2-catalog-to-d1.ts --sql-out-dir /tmp/c2-catalog-seed
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { C2_COURSE } from "../src/lib/course/c2";

const outputArg = process.argv.findIndex((arg) => arg === "--sql-out-dir");
if (outputArg < 0 || !process.argv[outputArg + 1]) {
  console.error("Usage: sync-c2-catalog-to-d1.ts --sql-out-dir <directory>");
  process.exit(1);
}
const OUT = path.resolve(process.argv[outputArg + 1]);

function sqlString(value: string): string {
  return "'" + value.replace(/'/g, "''") + "'";
}

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function optionRecords(value: unknown): { id: string; text: string }[] {
  return asArray(value).map((option, index) => {
    if (typeof option === "string") return { id: "o" + (index + 1), text: option };
    const item = option && typeof option === "object" ? option as Record<string, unknown> : {};
    return {
      id: String(item.id ?? ("o" + (index + 1))),
      text: String(item.text ?? item.label ?? item.value ?? ""),
    };
  }).filter((option) => option.text.length > 0);
}

function normalizeAnswer(value: unknown, options: { id: string; text: string }[]): unknown {
  if (typeof value === "number") return options[value]?.id ?? String(value);
  if (Array.isArray(value)) return value.map((item) => normalizeAnswer(item, options));
  if (typeof value === "string") {
    const byId = options.find((option) => option.id === value);
    if (byId) return byId.id;
    const byText = options.find((option) => option.text.trim().toLowerCase() === value.trim().toLowerCase());
    return byText?.id ?? value;
  }
  return value;
}

function toInteractions(exercise: any): any[] {
  const content = exercise.content && typeof exercise.content === "object" ? exercise.content : {};
  const questions = asArray(content.questions);
  const questionList = questions.length ? questions : [{
    question: content.prompt ?? content.text ?? content.instructions ?? "",
    correctAnswer: content.correctAnswer ?? content.correct_answer,
    options: content.options,
    explanation: content.explanation,
    pairs: content.pairs,
    gaps: content.gaps,
  }];

  return questionList.map((question: any, index: number) => {
    const options = optionRecords(question.options ?? content.options);
    const pairs = asArray(question.pairs ?? content.pairs).map((pair: any) => ({
      id: String(pair.id ?? ""),
      left: String(pair.left ?? pair.prompt ?? ""),
      right: String(pair.right ?? pair.match ?? ""),
    })).filter((pair: any) => pair.left && pair.right);
    const gaps = asArray(question.gaps ?? content.gaps).map((gap: any, gapIndex: number) => ({
      id: String(gap.id ?? (gapIndex + 1)),
      options: optionRecords(gap.options),
    }));
    const rawAnswer = question.correctAnswer ?? question.correct_answer ?? question.answer
      ?? question.expectedAnswer ?? question.expectedResponse;
    const exerciseType = String(exercise.type ?? "").toLowerCase();
    const type = pairs.length ? "matching"
      : /true.?false/.test(exerciseType) ? "true_false"
      : options.length ? "multiple_choice" : "fill_blanks";
    const questionText = String(question.question ?? question.sentence ?? question.prompt
      ?? question.text ?? question.statement ?? "");
    const mainText = String(content.text ?? content.passage ?? content.main_text
      ?? exercise.transcript ?? question.main_text ?? question.passage ?? "");

    return {
      interaction_id: questions.length > 1 ? String(exercise.id) + "__q" + (index + 1) : String(exercise.id),
      type,
      prompt_es: String(content.instructions ?? question.instructions ?? ""),
      question_en: questionText,
      stimulus_en: String(question.stimulus_en ?? question.sentence ?? questionText),
      mastery_tag: String(exercise.topicName ?? exercise.topic ?? "grammar") + ":" + String(exercise.topic ?? ""),
      concept_tags: [String(exercise.topicName ?? ""), String(exercise.topic ?? "")].filter(Boolean),
      options,
      correct_answer: normalizeAnswer(rawAnswer, options),
      acceptable_answers: asArray(question.acceptableAnswers ?? question.acceptable_answers).map(String),
      explanation: String(question.explanation ?? content.explanation ?? ""),
      ...(mainText ? { main_text: mainText } : {}),
      ...(exercise.transcript ? { transcript: String(exercise.transcript) } : {}),
      ...(pairs.length ? { pairs } : {}),
      ...(gaps.length ? { gaps } : {}),
    };
  });
}

function main() {
  const units = [...C2_COURSE.units].sort((a, b) => a.id - b.id);
  if (!units.length) throw new Error("C2 catalog is empty; refusing to create an empty D1 seed.");

  const records = units.map((unit) => {
    const blocksByTitle = new Map<string, any[]>();
    for (const exercise of unit.exercises) {
      const title = String(exercise.content?.title ?? exercise.topicName ?? "C2 Practice");
      const current = blocksByTitle.get(title) ?? [];
      current.push(...toInteractions(exercise));
      blocksByTitle.set(title, current);
    }
    const content = {
      course: {
        unit_id: "c2-unit-" + unit.id,
        unit_title: unit.title,
        level: "C2",
        total_duration_minutes: 45,
      },
      learning_outcomes: [],
      blocks: [...blocksByTitle.entries()].map(([title, blockContent]) => ({ title, content: blockContent })),
    };
    const json = JSON.stringify(content);
    return {
      courseKey: "ingles-c2",
      level: "C2",
      unitNumber: unit.id,
      unitId: "c2-unit-" + unit.id,
      title: unit.title,
      sourcePath: "src/lib/course/c2/catalog/unit-" + unit.id,
      hash: createHash("sha256").update(json).digest("hex"),
      content: json,
    };
  });

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const statements = records.map((record) =>
    "INSERT INTO learning_course_json_units\n" +
    "  (course_key, level, unit_number, unit_id, title, source_path, content_hash, content_json, updated_at)\n" +
    "VALUES\n" +
    "  (" + sqlString(record.courseKey) + ", " + sqlString(record.level) + ", " + record.unitNumber + ",\n" +
    "   " + sqlString(record.unitId) + ", " + sqlString(record.title) + ", " + sqlString(record.sourcePath) + ",\n" +
    "   " + sqlString(record.hash) + ", " + sqlString(record.content) + ", strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))\n" +
    "ON CONFLICT(course_key, unit_number) DO UPDATE SET\n" +
    "  unit_id = excluded.unit_id,\n" +
    "  title = excluded.title,\n" +
    "  source_path = excluded.source_path,\n" +
    "  content_hash = excluded.content_hash,\n" +
    "  content_json = excluded.content_json,\n" +
    "  updated_at = excluded.updated_at;";
  );

  for (let start = 0; start < statements.length; start += 10) {
    const filename = "batch-" + String(Math.floor(start / 10) + 1).padStart(3, "0") + ".sql";
    fs.writeFileSync(path.join(OUT, filename), statements.slice(start, start + 10).join("\n"));
  }

  console.log("[c2-catalog-sync] Prepared " + records.length + " canonical C2 unit rows for insert/update.");
  console.log("[c2-catalog-sync] Generated " + Math.ceil(records.length / 10) + " SQL batches in " + OUT);
}

main();
