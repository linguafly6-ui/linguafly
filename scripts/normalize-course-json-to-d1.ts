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
const levelArgIndex = process.argv.findIndex((arg) => arg === "--level");
const selectedLevel = levelArgIndex >= 0 ? String(process.argv[levelArgIndex + 1] ?? "").toUpperCase() : "";
if (selectedLevel && !["B1", "B2", "C1", "C2"].includes(selectedLevel)) {
  throw new Error("--level must be one of B1, B2, C1 or C2");
}
const selectedLevels = selectedLevel ? LEVELS.filter((level) => level.level === selectedLevel) : LEVELS;

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
  const mastery = String(item.mastery_tag ?? "").toLowerCase();
  if (mastery.startsWith("production:")) return "production";
  for (const section of REQUIRED_B1_SECTIONS) {
    if (mastery.startsWith(section + ":")) return section;
  }
  const text = [...(item.concept_tags ?? []), blockTitle, item.type].join(" ").toLowerCase();
  if (/listening|audio|listen/.test(text)) return "listening";
  if (/reading|comprehension|read/.test(text)) return "reading";
  if (/vocab|idiom|word-formation|word formation|collocation/.test(text)) return "vocabulary";
  if (/production|speaking|writing/.test(text)) return "production";
  return "grammar";
}
function promptFor(item: Interaction): string {
  if (/fill.?blanks?/i.test(item.type) && typeof item.main_text === "string") {
    return englishBilingualText([item.prompt_es, item.main_text].filter((value) => typeof value === "string" && value.trim()).join("\n\n"));
  }
  return englishBilingualText([item.question_en, item.stimulus_en, item.prompt_es]
    .find((value) => typeof value === "string" && value.trim())?.trim() ?? "");
}
function expectedText(answer: unknown, options: Option[]): string {
  if (typeof answer === "string") {
    return englishBilingualText(options.find((option) => option.id === answer)?.text ?? answer);
  }
  if (Array.isArray(answer)) {
    return englishBilingualText(answer.map((part) => {
      const found = options.find((option) => option.id === String(part));
      return found?.text ?? String(part);
    }).join(" "));
  }
  if (typeof answer === "boolean") return answer ? "True" : "False";
  return answer == null ? "" : englishBilingualText(String(answer));
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
  return options.map((option) => englishBilingualText(String(option.text ?? ""))).filter(Boolean);
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
  const values = `(${sqlString(id)}, ${sqlString(lessonId)}, ${number}, ${sqlString(type)}, ${sqlString(prompt)},
   ${sqlString(json(options))}, ${sqlString(json({ correct, source }))}, ${sqlString(explanation)}, 0,
   ${sqlString(section)}, ${audioText ? sqlString(audioText) : "NULL"})`;
  // Avoid INSERT ... ON CONFLICT: D1 has a BEFORE INSERT duplicate-prompt
  // trigger that fires even for a conflicting ID. UPDATE then insert-if-missing
  // makes reruns safe without bypassing the duplicate-prompt guard.
  // Reuse the existing (lesson_id, exercise_number) slot. D1 enforces a
  // UNIQUE constraint on that pair, so an ID-only upsert can fail when a
  // lesson already contains legacy exercises with different IDs.
  return `UPDATE learning_exercises SET
  exercise_type = ${sqlString(type)}, prompt = ${sqlString(prompt)},
  options_json = ${sqlString(json(options))}, answer_json = ${sqlString(json({ correct, source }))},
  explanation = ${sqlString(explanation)}, section_type = ${sqlString(section)},
  audio_text = ${audioText ? sqlString(audioText) : "NULL"}
WHERE lesson_id = ${sqlString(lessonId)} AND exercise_number = ${number};
INSERT INTO learning_exercises
  (id, lesson_id, exercise_number, exercise_type, prompt, options_json, answer_json, explanation, ai_generated, section_type, audio_text)
SELECT ${values.slice(1, -1)}
WHERE NOT EXISTS (SELECT 1 FROM learning_exercises WHERE id = ${sqlString(id)})
  AND NOT EXISTS (SELECT 1 FROM learning_exercises WHERE lesson_id = ${sqlString(lessonId)} AND exercise_number = ${number});`;
}

function distinctPrompt(prompt: string, section: string, seen: Map<string, number>): string {
  const normalized = `${section}:${prompt.trim().toLocaleLowerCase("en")}`;
  const count = (seen.get(normalized) ?? 0) + 1;
  seen.set(normalized, count);
  return count === 1 ? prompt : `${prompt} (Actividad ${count})`;
}

const REQUIRED_B1_SECTIONS = ["grammar", "vocabulary", "listening", "reading"] as const;

function englishBilingualText(value: string): string {
  return value.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_whole, left: string, right: string) => {
    const first = left.trim(), second = right.trim();
    if (first === second) return first;
    const pattern = /^(Hello|Hi|Good |Bye|Goodbye|Name|Surname|My|Your|I|You|We|They|He|She|It|What|Where|How|Are|Is|Am|Do|Does|This|That|The|A |An |Choose|Complete|Build|Read|True|False)/i;
    const a = pattern.test(first), b = pattern.test(second);
    return a !== b ? (a ? first : second) : first;
  });
}

function generatedTopic(unit: Unit): string {
  const grammarTitles = /relative clauses|conditionals|passive voice|reported speech|past continuous|present perfect|articles and reviews|word formation/i;
  const named = unit.blocks.map((block) => block.title)
    .find((title) => title && !/^unit\s*\d+$/i.test(title) && !grammarTitles.test(title));
  const title = named ?? (unit.course.unit_title && !/^unit\s*\d+$/i.test(unit.course.unit_title)
    ? unit.course.unit_title : "Everyday decisions and communication");
  return title.replace(/[:–—]/g, " ").trim();
}

function generatedReading(unit: Unit, n: number): Interaction[] {
  const topic = generatedTopic(unit);
  const passage = [
    "A closer look at " + topic,
    "People often think that " + topic.toLowerCase() + " is mainly about individual choices. However, a recent community project showed that small changes can make a real difference. The organisers invited local residents to share their experiences, explain the difficulties they faced and suggest practical improvements.",
    "At first, not everyone agreed with the plan. Some people were worried about the time it would take, while others wanted to see clear results before getting involved. The team listened carefully and changed the schedule so that more people could take part. They also shared regular updates, which helped build trust.",
    "After a few months, the project had become part of the local routine. The most useful lesson was not that every idea worked perfectly, but that people made better decisions when they compared information, discussed different points of view and learned from mistakes. The organisers now recommend starting with one realistic goal and reviewing progress regularly."
  ].join("\n\n");
  const qs: [string, string[], string, string][] = [
    ["What is the main purpose of the text?", ["To describe how a community project developed", "To advertise a new business", "To explain how to apply for a job", "To compare two holiday destinations"], "o1", "The text follows a community project from its beginning to its results."],
    ["Why did some people hesitate at first?", ["They did not understand the language", "They were concerned about the time and wanted evidence", "They had already completed the project", "They preferred to work alone"], "o2", "The text says people worried about the time and wanted clear results."],
    ["What did the organisers do after listening to residents?", ["Cancelled the project", "Ignored the suggestions", "Changed the schedule and shared updates", "Moved the project to another town"], "o3", "They adapted the schedule and communicated progress."],
    ["The phrase 'build trust' is closest in meaning to…", ["Make people feel confident", "Make people work faster", "Avoid making decisions", "Win a competition"], "o1", "Regular updates helped people feel confident in the organisers."],
    ["What do the organisers recommend?", ["Changing every plan immediately", "Waiting until there are no risks", "Starting with a realistic goal and checking progress", "Avoiding other people's opinions"], "o3", "The final sentence recommends one realistic goal and regular reviews."]
  ];
  return qs.map((q, i) => ({
    interaction_id: "B1_U" + n + "_AUTO_READING_Q" + (i + 1),
    type: "multiple_choice", prompt_es: "Read the text and choose the best answer.",
    question_en: q[0], main_text: passage, correct_answer: q[2],
    options: (q[1] as string[]).map((text, j) => ({ id: "o" + (j + 1), text })),
    explanation: q[3], mastery_tag: "reading:b1-" + topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    concept_tags: ["reading", "comprehension", "b1", topic.toLowerCase()]
  }));
}

function generatedListening(unit: Unit, n: number): Interaction[] {
  const topic = generatedTopic(unit);
  const transcript = [
    "Presenter: Today we are talking about " + topic.toLowerCase() + " and the way it affects everyday decisions.",
    "Guest: I used to think it was quite straightforward, but my experience has changed my mind. I spoke to several people, read different reports and realised that there is rarely one solution that works for everyone.",
    "Presenter: What would you recommend to someone who wants to make a start?",
    "Guest: First, find reliable information and decide what matters most to you. Then make a small plan. It is easier to keep going when you can see progress, even if the results are not immediate.",
    "Presenter: Have you made any mistakes along the way?",
    "Guest: Certainly. I tried to do too much at once, so I became frustrated. I learned to ask for advice, compare alternatives and change my approach when something was not working.",
    "Presenter: So the most important thing is to stay flexible?",
    "Guest: Exactly. Being prepared is useful, but listening to other people and learning from experience are just as important."
  ].join("\n");
  const qs: [string, string[], string, string][] = [
    ["What is the guest mainly discussing?", ["An experience related to the topic", "A recent sports result", "A problem with public transport", "A plan to move abroad"], "o1", "The guest describes experience and lessons connected with the unit topic."],
    ["How did the guest develop a better understanding?", ["By avoiding other opinions", "By speaking to people and reading reports", "By following one person's advice", "By waiting for someone else to decide"], "o2", "The guest mentions speaking to several people and reading reports."],
    ["What does the guest recommend doing first?", ["Making a large investment", "Finding reliable information", "Changing the plan every day", "Working without help"], "o2", "The guest says to find reliable information before making a small plan."],
    ["Why did the guest become frustrated?", ["The results came too quickly", "There was no information available", "They tried to do too much at once", "Nobody offered an opinion"], "o3", "The guest explains that trying to do too much caused frustration."],
    ["What is the guest's final message?", ["Never change your mind", "Preparation is the only thing that matters", "Avoid asking other people for help", "Stay flexible and learn from experience"], "o4", "The guest emphasises flexibility, listening and learning."]
  ];
  return qs.map((q, i) => ({
    interaction_id: "B1_U" + n + "_AUTO_LISTENING_Q" + (i + 1),
    type: "multiple_choice", prompt_es: "Listen to the recording and choose the best answer.",
    question_en: q[0], transcript, correct_answer: q[2],
    options: (q[1] as string[]).map((text, j) => ({ id: "o" + (j + 1), text })),
    explanation: q[3], mastery_tag: "listening:b1-" + topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    concept_tags: ["listening", "comprehension", "b1", topic.toLowerCase()]
  }));
}

function generatedSection(unit: Unit, n: number, section: typeof REQUIRED_B1_SECTIONS[number]): Unit["blocks"][number] {
  const topic = generatedTopic(unit);
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const titles = {
    grammar: "Grammar practice: " + topic,
    vocabulary: "Vocabulary in context: " + topic,
    listening: "Listening: " + topic,
    reading: "Reading: " + topic,
  };
  if (section === "reading") return { block_id: "AUTO_READING", title: titles.reading, duration_minutes: 20, content: generatedReading(unit, n) };
  if (section === "listening") return { block_id: "AUTO_LISTENING", title: titles.listening, duration_minutes: 15, content: generatedListening(unit, n) };
  const tasks: [string, string[], string][] = section === "grammar"
    ? [
      ["Choose the correct form: If people plan carefully, they ___ better decisions.", ["make", "makes", "making", "made"], "o1"],
      ["Choose the correct sentence.", ["She has worked here since 2022.", "She work here since 2022.", "She is work here since 2022.", "She working here since 2022."], "o1"],
      ["Complete the sentence: The report ___ yesterday.", ["published", "was published", "is publish", "has publish"], "o2"],
      ["Choose the correct option: I ___ dinner when the phone rang.", ["cooked", "was cooking", "have cooked", "am cooking"], "o2"],
      ["Choose the correct relative pronoun: The colleague ___ helped me was very kind.", ["who", "where", "when", "whose"], "o1"]
    ]
    : [
      ["What does 'reliable' mean?", ["Can be trusted", "Very expensive", "Difficult to find", "No longer useful"], "o1"],
      ["Choose the best word: We need to ___ the advantages and disadvantages.", ["compare", "borrow", "avoid", "repair"], "o1"],
      ["Which word is closest in meaning to 'improve'?", ["Develop", "Forget", "Refuse", "Delay"], "o1"],
      ["Choose the best collocation: ___ a decision.", ["Do", "Make", "Take up", "Put"], "o2"],
      ["Which phrase means 'to find information'?", ["Look up", "Give away", "Turn down", "Run out"], "o1"]
    ];
  return {
    block_id: "AUTO_" + section.toUpperCase(), title: titles[section], duration_minutes: 15,
    content: tasks.map((task, i) => ({
      interaction_id: "B1_U" + n + "_AUTO_" + section.toUpperCase() + "_Q" + (i + 1),
      type: "multiple_choice",
      prompt_es: "Choose the correct answer.",
      question_en: task[0],
      options: task[1].map((text, j) => ({ id: "o" + (j + 1), text })),
      correct_answer: task[2], explanation: "This option is the correct answer in this B1 context.",
      mastery_tag: section + ":b1-" + slug, concept_tags: [section, "b1", slug]
    }))
  };
}

function countSectionExercises(items: Interaction[]): number {
  return items.reduce((total, item) => {
    if (Array.isArray(item.correct_answer) && item.correct_answer.length > 1) return total + item.correct_answer.length;
    if (Array.isArray(item.gaps) && item.gaps.length > 0) return total + item.gaps.length;
    if (Array.isArray(item.pairs) && item.pairs.length > 0) return total + item.pairs.length;
    return total + 1;
  }, 0);
}

function ensureB1Sections(unit: Unit, n: number, file: string): void {
  if (unit.course.level?.toUpperCase() !== "B1") return;
  // Production/writing/speaking is not part of the B1 web course curriculum.
  // Remove those source activities before building public lesson content or exercises.
  unit.blocks = unit.blocks
    .filter((block) => !/production|speaking|writing/i.test(block.title))
    .map((block) => ({ ...block, content: block.content.filter((item) => sectionFor(item, block.title) !== "production") }))
    .filter((block) => block.content.length > 0);
  for (const section of REQUIRED_B1_SECTIONS) {
    const items = unit.blocks
      .filter((block) => block.content.some((item) => sectionFor(item, block.title) === section))
      .flatMap((block) => block.content.filter((item) => sectionFor(item, block.title) === section));
    const exerciseCount = countSectionExercises(items);
    const hasRequiredText = section === "reading"
      ? items.some((item) => Boolean(item.main_text || item.transcript)) && items.filter((item) => item.options?.length).length >= 5
      : section === "listening"
      ? items.some((item) => Boolean(item.transcript)) && items.filter((item) => item.options?.length).length >= 5
      : true;
    if (exerciseCount < 5 || !hasRequiredText) {
      unit.blocks.push(generatedSection(unit, n, section));
    }
  }
  const finalItems = unit.blocks.flatMap((block) => block.content.map((item) => ({ item, section: sectionFor(item, block.title) })));
  if (unit.blocks.some((block) => /production|speaking|writing/i.test(block.title))) {
    throw new Error("B1 production content must not be published in " + file);
  }
  const missing = REQUIRED_B1_SECTIONS.filter((section) => {
    const items = finalItems.filter((entry) => entry.section === section).map((entry) => entry.item);
    return countSectionExercises(items) < 5;
  });
  if (missing.length) throw new Error("B1 section completion failed in " + file + ": " + missing.join(", "));
}


function main() {
  const statements: string[] = [];
  const summary: Record<string, { units: number; exercises: number; bySection: Record<string, number> }> = {};
  for (const levelConfig of selectedLevels) {
    const dir = path.join(SOURCE_ROOT, levelConfig.folder);
    if (!fs.existsSync(dir)) throw new Error(`Missing canonical course folder: ${levelConfig.folder}`);
    const files = fs.readdirSync(dir).map((name) => {
      const match = /^unit(\d+)\.json$/i.exec(name);
      return match ? { name, number: Number(match[1]) } : null;
    }).filter((item): item is { name: string; number: number } => item !== null)
      .sort((a, b) => a.number - b.number);
    if (!files.length) throw new Error(`No unitN.json files found in ${levelConfig.folder}`);
    if (levelConfig.level === "B1") {
      const numbers = new Set(files.map((file) => file.number));
      const missingUnits = Array.from({ length: 60 }, (_, index) => index + 1).filter((number) => !numbers.has(number));
      if (files.length !== 60 || missingUnits.length) {
        throw new Error("B1 source audit requires exactly units 1–60; missing: " + (missingUnits.join(", ") || "none") + "; found " + files.length);
      }
    }

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
      ensureB1Sections(unit, unitNumber, path.relative(ROOT, absolute));
      const lessonId = `${levelConfig.level.toLowerCase()}-${String(unitNumber).padStart(2, "0")}`;
      const objective = (unit.learning_outcomes ?? []).join(" · ");
      // Keep public lesson metadata and readable section text here, but never
      // expose answer keys/options through the public lessons endpoint. The
      // full lossless source JSON is stored separately in learning_course_json_units.
      const safeContent = {
        objective,
        learningOutcomes: unit.learning_outcomes ?? [],
        masteryTags: unit.mastery_tags ?? [],
        sections: unit.blocks.map((block) => ({
          type: "learn",
          sectionType: sectionFor(block.content[0] ?? ({} as Interaction), block.title),
          title: block.title,
          body: block.content.map((item) => [item.question_en, item.stimulus_en, item.prompt_es, item.main_text, item.transcript]
            .filter((value) => typeof value === "string" && value.trim()).map((value) => englishBilingualText(String(value))).join(" · ")).join("\n"),
          ...(block.content.some((item) => sectionFor(item, block.title) === "listening")
            ? { audioText: block.content.map((item) => item.transcript || item.main_text || item.stimulus_en || "").filter(Boolean).map(englishBilingualText).join("\n") } : {}),
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
      const seenPrompts = new Map<string, number>();
      for (const block of unit.blocks) {
        if (!Array.isArray(block.content)) throw new Error(`Invalid block content in ${levelConfig.folder}/${file.name}`);
        for (const item of block.content) {
          if (!item || typeof item.interaction_id !== "string" || !item.interaction_id.trim()) {
            throw new Error(`Missing interaction_id in ${levelConfig.folder}/${file.name}`);
          }
          const section = sectionFor(item, block.title);
          if (levelConfig.level === "B1" && section === "production") continue;
          const sourceMeta = { blockId: block.block_id ?? "", blockTitle: block.title, masteryTag: item.mastery_tag ?? "", conceptTags: item.concept_tags ?? [] };
          const baseOptions = optionTexts(item.options ?? []);
          const audioText = englishBilingualText(String(item.transcript || (section === "listening" ? item.main_text || item.stimulus_en || "" : section === "reading" ? item.main_text || item.transcript || item.stimulus_en || "" : "")));
          const rawExplanation = String(item.explanation ?? "");
          const explanation = /\bundefined\b/i.test(rawExplanation) ? "" : rawExplanation;

          if (/matching|match/i.test(item.type) && Array.isArray(item.pairs) && item.pairs.length) {
            const matchingOptions = item.pairs.map((pair) => pair.right);
            for (let pairIndex = 0; pairIndex < item.pairs.length; pairIndex++) {
              const pair = item.pairs[pairIndex];
              const id = `${item.interaction_id}__match_${pair.id || String(pairIndex + 1)}`;
              validateExerciseId(id, `${levelConfig.folder}/${file.name}`);
          if (seenIds.has(id)) throw new Error(`Duplicate exercise ID ${id} in ${levelConfig.folder}/${file.name}`);
              seenIds.add(id); exerciseNumber++;
              statements.push(exerciseStatement(lessonId, id, exerciseNumber, section, "multiple_choice",
                distinctPrompt(pair.left, section, seenPrompts), matchingOptions, pair.right, explanation || `Respuesta correcta: ${pair.right}`, { ...sourceMeta, sourceInteractionId: item.interaction_id, sourceType: item.type, variant: "match", pairId: pair.id || String(pairIndex + 1) }, audioText));
              summary[levelConfig.level].exercises++;
              summary[levelConfig.level].bySection[section] = (summary[levelConfig.level].bySection[section] ?? 0) + 1;
            }
            continue;
          }

          if (/fill.?blanks?/i.test(item.type) && Array.isArray(item.correct_answer) && item.correct_answer.length > 1) {
            const mainText = String(item.main_text ?? item.stimulus_en ?? "");
            for (let gapIndex = 0; gapIndex < item.correct_answer.length; gapIndex++) {
              const gapNumber = gapIndex + 1;
              const id = `${item.interaction_id}__gap_${gapNumber}`;
              validateExerciseId(id, `${levelConfig.folder}/${file.name}`);
              if (seenIds.has(id)) throw new Error(`Duplicate exercise ID ${id} in ${levelConfig.folder}/${file.name}`);
              seenIds.add(id);
              const correct = String(item.correct_answer[gapIndex] ?? "");
              const targetPattern = new RegExp("\\(" + gapNumber + "\\)\\s*_{2,}");
              const visibleText = mainText.replace(targetPattern, "_____");
              const prompt = `${String(item.prompt_es ?? "Complete the text")} — gap ${gapNumber} of ${item.correct_answer.length}\n\n${visibleText}`;
              exerciseNumber++;
              statements.push(exerciseStatement(lessonId, id, exerciseNumber, section, "fill_blank",
                distinctPrompt(prompt, section, seenPrompts), [], correct, explanation || `Respuesta correcta: ${correct}`,
                { ...sourceMeta, sourceInteractionId: item.interaction_id, sourceType: item.type, variant: "fill_blank", gapNumber }, audioText));
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
              validateExerciseId(id, `${levelConfig.folder}/${file.name}`);
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
                distinctPrompt(prompt || promptFor(item), section, seenPrompts), optionTexts(gap.options ?? []), correct, explanation || `Respuesta correcta: ${correct}`,
                { ...sourceMeta, sourceInteractionId: item.interaction_id, sourceType: item.type, variant: "gap", gapId: gap.id }, audioText));
              summary[levelConfig.level].exercises++;
              summary[levelConfig.level].bySection[section] = (summary[levelConfig.level].bySection[section] ?? 0) + 1;
            }
            continue;
          }

          const id = item.interaction_id;
          validateExerciseId(id, `${levelConfig.folder}/${file.name}`);
          if (seenIds.has(id)) throw new Error(`Duplicate exercise ID ${id} in ${levelConfig.folder}/${file.name}`);
          seenIds.add(id); exerciseNumber++;
          const correct = expectedText(item.correct_answer, item.options ?? []);
          const options = /true.?false/i.test(item.type) ? ["True", "False"] : baseOptions;
          const type = typeFor(item, options);
          statements.push(exerciseStatement(lessonId, id, exerciseNumber, section, type,
            distinctPrompt(promptFor(item), section, seenPrompts), options, correct, explanation || (correct ? `Respuesta correcta: ${correct}` : ""), { ...sourceMeta, sourceInteractionId: item.interaction_id, sourceType: item.type }, audioText));
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
