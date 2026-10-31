import { NextRequest, NextResponse } from "next/server";
import { a2QuestionSets, a2Units } from "@/lib/learning/a2-units";
import { scheduleNextReview, type ReviewState } from "@/lib/learning/spaced-repetition";
import { getSessionUser } from "@/lib/learning/auth";
import { resolveCloudflareEnv } from "@/lib/db/client";
import { getA1LegacyUnit, type A1LegacyItem as LegacyItem, type A1LegacyUnit as LegacyUnit } from "@/lib/learning/a1-legacy-units";
import { getLegacyAdvancedUnit, getLegacyAdvancedItem, getLegacyAdvancedSection, type LegacyAdvancedItem } from "@/lib/learning/legacy-advanced-units";
import { B1_COURSE } from "@/lib/course/b1";

const sectionNames = new Set(["grammar", "vocabulary", "listening", "reading", "production"]);

function bilingualPart(value: string, preferred: "english" | "spanish"): string {
  const [left, right] = value.split("|", 2);
  if (right === undefined) return value;
  const first = left.replace(/^\[/, "");
  const second = right.replace(/\]$/, "");
  if (first === second) return first;

  // The data contains both [[English|Spanish]] and [[Spanish|English]] pairs.
  const englishPattern = /^(Hello|Hi|Good |Bye|Goodbye|Name|Surname|My|Your|I|You|We|They|He|She|It|What|Where|How|Are|Is|Am|Do|Does|This|That|The|A |An |Choose|Complete|Build|Read|True|False)/i;
  const englishFirst = englishPattern.test(first);
  const englishSecond = englishPattern.test(second);
  if (englishFirst !== englishSecond) {
    if (preferred === "english") return englishFirst ? first : second;
    return englishFirst ? second : first;
  }
  return preferred === "english" ? first : second;
}

function plainText(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_whole, left: string, right: string) => bilingualPart(left + "|" + right, "spanish")).replace(/\s+/g, " ").trim();
}

function plainEnglish(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (_whole, left: string, right: string) => bilingualPart(left + "|" + right, "english")).replace(/\s+/g, " ").trim();
}


function advancedExpectedAnswer(item: LegacyAdvancedItem): string {
  const answer = item.correct_answer;
  if (typeof answer === "string" && item.options?.length) {
    const option = item.options.find((candidate) => candidate.id === answer);
    if (option) return option.text;
  }
  if (Array.isArray(answer)) return answer.map(String).join(" ");
  if (answer == null && item.pairs?.length) return item.pairs.map((pair) => pair.left + " — " + pair.right).join("; ");
  return answer == null ? "" : String(answer);
}
function advancedPlainText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}
function advancedPrompt(item: LegacyAdvancedItem): string {
  // Prefer the actual question, then the stimulus, and use the instruction only
  // as a fallback. Concatenating all fields caused repeated/conflicting prompts.
  return [item.question_en, item.stimulus_en, item.prompt_es].map(advancedPlainText).find(Boolean) ?? "";
}

function getLegacySection(item: LegacyItem): string | null {
  if (item.mastery_tag === "grammar" || item.mastery_tag === "vocabulary" || item.mastery_tag === "reading" || item.mastery_tag === "listening" || item.mastery_tag === "production") {
    return item.mastery_tag;
  }
  if (item.type === "reading-comprehension") return "reading";
  if (item.type === "listening-comprehension") return "listening";
  return null;
}

function normalizedLegacyAnswer(item: LegacyItem): string {
  const options = item.options ?? [];
  if (item.type === "multiple-choice" || item.type === "reading-comprehension" || item.type === "listening-comprehension") {
    const correctId = String(item.correct_answer);
    const text = options.find((option) => option.id === correctId)?.text;
    if (!text) return "";
    return item.mastery_tag === "vocabulary" ? plainText(text) : plainEnglish(text);
  }
  if (item.type === "sentence-building" && Array.isArray(item.correct_answer)) {
    const byId = new Map(options.map((option) => [option.id, item.mastery_tag === "vocabulary" ? plainText(option.text) : plainEnglish(option.text)]));
    return item.correct_answer.map((id) => byId.get(String(id)) ?? String(id)).join(" ");
  }
  if (item.type === "true-false") return item.correct_answer === true ? "True" : "False";
  return String(item.correct_answer);
}

function legacyExercise(item: LegacyItem, index: number) {
  const options = (item.options ?? []).map((option) => item.mastery_tag === "vocabulary" ? plainText(option.text) : plainEnglish(option.text));
  if (item.type === "true-false") options.splice(0, options.length, "True", "False");
  return {
    id: item.interaction_id,
    number: index + 1,
    type: item.type === "multiple-choice" || item.type === "reading-comprehension" || item.type === "listening-comprehension"
      ? "multiple_choice"
      : item.type === "sentence-building" ? "sentence_building"
      : item.type === "fill-blank" ? "fill_blank"
      : item.type === "true-false" ? "multiple_choice" : "free_text",
    prompt: getPrompt(item),
    options,
    passageText: item.transcript ? plainEnglish(item.transcript) : null,
    audioText: item.mastery_tag === "listening" && item.transcript ? plainEnglish(item.transcript) : null
  };
}

function getPrompt(item: LegacyItem): string {
  const stimulus = plainEnglish(item.stimulus_en);
  const question = plainEnglish(item.question_en);
  const instruction = plainText(item.prompt_es);
  if (item.mastery_tag === "vocabulary" && item.type === "multiple-choice") return `${stimulus} ${instruction}`.trim();
  if (item.mastery_tag === "vocabulary" && item.type === "fill-blank") return `${plainText(item.stimulus_en)} ${instruction}`.trim();
  if (item.type === "reading-comprehension" || item.type === "listening-comprehension") return question || stimulus || instruction;
  if (item.type === "true-false") return `${instruction} ${stimulus}`.trim();
  if (item.type === "sentence-building") return `${instruction} ${stimulus}`.trim();
  return `${stimulus} ${question} ${instruction}`.trim();
}

function getB1Exercise(lessonId: string, exerciseId: string) {
  const match = /^b1-(\d{2})$/.exec(lessonId);
  if (!match) return null;
  const unit = B1_COURSE.units.find((item) => item.id === Number(match[1]));
  return unit?.exercises.find((exercise) => exercise.id === exerciseId) ?? null;
}
function b1ExpectedAnswer(exercise: (typeof B1_COURSE.units)[number]["exercises"][number]): string {
  const question = exercise.content?.questions?.[0];
  const answer = question?.correctAnswer;
  const options = Array.isArray(question?.options) ? question.options as string[] : [];
  if (typeof answer === "number") return options[answer] ?? String(answer);
  if (typeof answer === "boolean") return answer ? "True" : "False";
  return answer == null ? "" : String(answer);
}
function b1Exercise(exercise: (typeof B1_COURSE.units)[number]["exercises"][number], index: number) {
  const question = exercise.content?.questions?.[0];
  const options = Array.isArray(question?.options) ? question.options as string[] : [];
  return {
    id: exercise.id, number: index + 1,
    type: options.length ? "multiple_choice" : "free_text",
    prompt: plainEnglish(typeof question?.question === "string" ? question.question : ""),
    options: options.map((option) => plainEnglish(option)),
    audioText: exercise.topicName === "Listening" && exercise.transcript ? plainEnglish(exercise.transcript) : null,
    passageText: exercise.topicName === "Reading" && exercise.transcript ? plainEnglish(exercise.transcript) : null,
  };
}

function getA2Question(lessonId: string, exerciseId: string) {
  const match = /^a2-(\d{2})$/.exec(lessonId);
  if (!match) return null;
  const unitNumber = Number(match[1]);
  const unit = a2Units.find((item) => item.n === unitNumber);
  if (!unit) return null;
  const parts = exerciseId.split("-");
  if (parts.length !== 4 || parts[0] !== "a2" || parts[1] !== match[1]) return null;
  const section = parts[2] as "grammar" | "vocabulary" | "listening" | "reading";
  if (!sectionNames.has(section)) return null;
  const index = Number(parts[3]) - 1;
  const question = a2QuestionSets[unitNumber]?.[section]?.[index];
  return question ? { unit, section, question } : null;
}

async function getA1Items(lessonId: string) {
  const match = /^a1-(\d{2})$/.exec(lessonId);
  if (!match) return null;
  const unitNumber = Number(match[1]);
  if (unitNumber < 1 || unitNumber > 60) return null;
  const unit = getA1LegacyUnit(unitNumber);
  if (!unit) return [];
  return unit.blocks.flatMap((block) => block.content).filter((item) => getLegacySection(item) !== null);
}

async function getB1UnitD1Exercises(unitNumber: number, section: string) {
  if (unitNumber === 31) {
    const exercises = await getB1Unit31D1Exercises(section);
    if (!exercises) return null;
    const { env } = await resolveCloudflareEnv();
    const unit = await env.COURSE_DB!.prepare(
      "SELECT title FROM units WHERE id = ? LIMIT 1"
    ).bind("b1-unit-031").first<{ title: string }>();
    return { title: unit?.title ?? "Unidad 31", exercises };
  }

  const { env } = await resolveCloudflareEnv();
  if (!env.COURSE_DB) throw new Error("COURSE_DB binding is not configured.");
  const row = await env.COURSE_DB.prepare(
    "SELECT title, content_json FROM learning_course_json_units WHERE course_key = 'ingles-b1' AND level = 'B1' AND unit_number = ? LIMIT 1"
  ).bind(unitNumber).first<{ title: string; content_json: string }>();
  if (!row) return null;

  const unit = JSON.parse(row.content_json) as {
    blocks?: { title?: string; content?: LegacyAdvancedItem[] }[];
  };
  const selected = (unit.blocks ?? []).flatMap((block) => (block.content ?? [])
    .filter((item) => getLegacyAdvancedSection(item, block.title ?? "") === section)
    .map((item) => ({ item, blockTitle: block.title ?? "" })));

  const exercises = selected.flatMap(({ item, blockTitle }, index) => {
    const topicName = section === "vocabulary" ? "Vocabulary" : section === "reading" ? "Reading"
      : section === "listening" ? "Listening" : "Grammar";
    const gaps = (item as LegacyAdvancedItem & {
      gaps?: { id: string; options: { id: string; text: string }[] }[];
      main_text?: string;
    }).gaps;
    const pairs = (item as LegacyAdvancedItem & { pairs?: { id?: string; left: string; right: string }[] }).pairs;

    if (/matching|match/i.test(item.type) && Array.isArray(pairs) && pairs.length) {
      const matchingOptions = pairs.map((pair) => pair.right);
      return pairs.map((pair, pairIndex) => ({
        id: item.interaction_id + "__match_" + (pair.id || String(pairIndex + 1)),
        number: index * pairs.length + pairIndex + 1,
        type: "multiple_choice", topicName, topic: blockTitle,
        prompt: pair.left, options: matchingOptions,
      }));
    }
    if (/cloze/i.test(item.type) && Array.isArray(gaps) && gaps.length) {
      const mainText = String((item as LegacyAdvancedItem & { main_text?: string }).main_text ?? "");
      return gaps.map((gap, gapIndex) => {
        const gapNumber = Number(gap.id) || gapIndex + 1;
        const line = mainText.split("\n").map((part) => part.trim())
          .find((part) => new RegExp("^" + gapNumber + "\\.").test(part)) || mainText;
        const prompt = line.replace(/^\d+\.\s*/, "").replace(/\[GAP\s*\d+\]/gi, "_____").replace(/\(\d+\)/g, "").trim();
        return {
          id: item.interaction_id + "__gap_" + gap.id,
          number: index * gaps.length + gapIndex + 1,
          type: "multiple_choice", topicName, topic: blockTitle,
          prompt: prompt || advancedPrompt(item), options: (gap.options ?? []).map((option) => option.text),
        };
      });
    }
    const options = (item.options ?? []).map((option) => option.text);
    const type = options.length ? "multiple_choice"
      : /fill.?blank|open.?cloze/i.test(item.type) ? "fill_blank" : "free_text";
    return [{
      id: item.interaction_id, number: index + 1, type, topicName, topic: blockTitle,
      prompt: advancedPrompt(item), options,
      audioText: section === "listening" && item.transcript ? item.transcript : null,
      passageText: section === "reading" && item.transcript ? item.transcript : null,
      transcript: section === "reading" && item.transcript ? item.transcript : null,
    }];
  });
  return { title: row.title, exercises };
}

async function getB1CourseJsonAnswer(unitNumber: number, exerciseId: string) {
  const { env } = await resolveCloudflareEnv();
  if (!env.COURSE_DB) throw new Error("COURSE_DB binding is not configured.");
  const row = await env.COURSE_DB.prepare(
    "SELECT content_json FROM learning_course_json_units WHERE course_key = 'ingles-b1' AND level = 'B1' AND unit_number = ? LIMIT 1"
  ).bind(unitNumber).first<{ content_json: string }>();
  if (!row) return null;
  const unit = JSON.parse(row.content_json) as { blocks?: { content?: LegacyAdvancedItem[] }[] };
  const gapMatch = /^(.*)__gap_(.+)$/.exec(exerciseId);
  const pairMatch = /^(.*)__match_(.+)$/.exec(exerciseId);
  const parentId = gapMatch?.[1] ?? pairMatch?.[1] ?? exerciseId;
  const item = (unit.blocks ?? []).flatMap((block) => block.content ?? [])
    .find((candidate) => candidate.interaction_id === parentId);
  if (!item) return null;

  let expected = "";
  if (gapMatch) {
    const gapId = gapMatch[2];
    const gaps = (item as LegacyAdvancedItem & { gaps?: { id: string; options: { id: string; text: string }[] }[] }).gaps ?? [];
    const gap = gaps.find((candidate) => String(candidate.id) === gapId);
    const answerMap = item.correct_answer as Record<string, unknown> | undefined;
    const optionId = answerMap && typeof answerMap === "object" ? String(answerMap[gapId] ?? "") : "";
    expected = gap?.options.find((option) => option.id === optionId)?.text ?? "";
  } else if (pairMatch) {
    const pairs = (item as LegacyAdvancedItem & { pairs?: { id?: string; left: string; right: string }[] }).pairs ?? [];
    expected = pairs.find((pair, index) => String(pair.id || index + 1) === pairMatch[2])?.right ?? "";
  } else {
    expected = advancedExpectedAnswer(item);
  }
  return { expected: expected ? [expected] : [], explanation: advancedPlainText(item.explanation) };
}

async function getB1Unit31D1Exercises(section: string) {
  const { env } = await resolveCloudflareEnv();
  if (!env.COURSE_DB) throw new Error("COURSE_DB binding is not configured.");
  const sectionId = `b1-unit-031-${section}`;
  const rows = await env.COURSE_DB.prepare(
    `SELECT e.id, e.position, e.content_json, et.code AS type_code,
            ak.answer_config_json, ak.correct_feedback, ak.incorrect_feedback
     FROM exercises e
     JOIN sections s ON s.id = e.section_id
     JOIN exercise_type_registry et ON et.id = e.exercise_type_id
     LEFT JOIN exercise_answer_keys ak ON ak.exercise_id = e.id
     WHERE s.id = ? AND e.status = 'published'
     ORDER BY e.position ASC`
  ).bind(sectionId).all<Record<string, unknown>>();
  const items = rows.results ?? [];
  if (!items.length) return null;
  const ids = items.map((item) => String(item.id));
  const placeholders = ids.map(() => "?").join(",");
  const optionRows = await env.COURSE_DB.prepare(
    `SELECT exercise_id, option_key, content, position
     FROM exercise_options WHERE exercise_id IN (${placeholders})
     ORDER BY exercise_id, position`
  ).bind(...ids).all<Record<string, unknown>>();
  const optionsByExercise = new Map<string, { key: string; text: string }[]>();
  for (const option of optionRows.results ?? []) {
    const id = String(option.exercise_id);
    optionsByExercise.set(id, [...(optionsByExercise.get(id) ?? []), { key: String(option.option_key), text: String(option.content) }]);
  }
  return items.map((row) => {
    let content: Record<string, unknown> = {};
    let answerConfig: Record<string, unknown> = {};
    try { content = JSON.parse(String(row.content_json ?? "{}")); } catch { content = {}; }
    try { answerConfig = JSON.parse(String(row.answer_config_json ?? "{}")); } catch { answerConfig = {}; }
    const optionItems = optionsByExercise.get(String(row.id)) ?? [];
    const options = optionItems.map((option) => option.text);
    const correctKeys = Array.isArray(answerConfig.correctOptionKeys) ? answerConfig.correctOptionKeys.map(String) : [];
    const correctAnswer = optionItems.findIndex((option) => correctKeys.includes(option.key));
    const transcript = typeof content.transcript === "string" ? content.transcript : "";
    const prompt = String(content.prompt ?? "");
    const explanation = String(content.explanation_es ?? row.correct_feedback ?? "");
    const isReading = section === "reading";
    return {
      id: String(row.id), number: Number(row.position),
      type: isReading ? "reading" : "multiple_choice",
      topic: "The Natural World",
      topicName: isReading ? "Reading" : section === "vocabulary" ? "Vocabulary" : section,
      prompt, options, transcript: isReading ? transcript : null, passageText: isReading ? transcript : null,
      content: isReading ? { text: transcript, questions: [{ id: String(row.id) + "-question", question: prompt, options, correctAnswer: correctAnswer >= 0 ? correctAnswer : 0, explanation }] } : undefined,
      audioText: section === "listening" && transcript ? transcript : null,
      vocabularyEntry: section === "vocabulary" ? { word: String(content.vocabularyWord ?? ""), meaning: String(content.meaning_es ?? ""), definition: String(content.definition_en ?? ""), example: String(content.example ?? "") } : null,
      explanation,
    };
  });
}

async function getB1Unit31D1Answer(exerciseId: string) {
  const { env } = await resolveCloudflareEnv();
  if (!env.COURSE_DB) throw new Error("COURSE_DB binding is not configured.");
  const row = await env.COURSE_DB.prepare(
    `SELECT e.content_json, ak.answer_config_json, ak.correct_feedback
     FROM exercises e
     JOIN sections s ON s.id = e.section_id
     LEFT JOIN exercise_answer_keys ak ON ak.exercise_id = e.id
     WHERE s.unit_id = 'b1-unit-031' AND e.id = ? AND e.status = 'published'`
  ).bind(exerciseId).first<Record<string, unknown>>();
  if (!row) return null;
  let content: Record<string, unknown> = {};
  let config: Record<string, unknown> = {};
  try { content = JSON.parse(String(row.content_json ?? "{}")); } catch { content = {}; }
  try { config = JSON.parse(String(row.answer_config_json ?? "{}")); } catch { config = {}; }
  const keys = Array.isArray(config.correctOptionKeys) ? config.correctOptionKeys.map(String) : [];
  const { results } = await env.COURSE_DB.prepare(
    "SELECT option_key, content FROM exercise_options WHERE exercise_id = ? ORDER BY position"
  ).bind(exerciseId).all<Record<string, unknown>>();
  const correctOptions = (results ?? []).filter((option) => keys.includes(String(option.option_key))).map((option) => String(option.content));
  return {
    expected: correctOptions,
    explanation: String(content.explanation_es ?? row.correct_feedback ?? ""),
  };
}

async function getNormalizedD1Exercises(lessonId: string, section: string) {
  try {
    const { env } = await resolveCloudflareEnv();
    const courseDb = env.COURSE_DB;
    if (!courseDb) throw new Error("COURSE_DB binding is not configured; refusing to query blog.");
    if (!courseDb) throw new Error("COURSE_DB binding is not configured; refusing to query blog.");
    const result = await courseDb.prepare(
      `SELECT id, exercise_number, exercise_type, prompt, options_json, section_type, audio_text
       FROM learning_exercises WHERE lesson_id = ? AND section_type = ? ORDER BY exercise_number ASC`
    ).bind(lessonId, section).all<Record<string, unknown>>();
    const rows = result.results ?? [];
    if (!rows.length) return null;
    return rows.map((row) => {
      let options: unknown = [];
      try { options = JSON.parse(String(row.options_json ?? "[]")); } catch { options = []; }
      return {
        id: String(row.id),
        number: Number(row.exercise_number),
        type: String(row.exercise_type),
        prompt: String(row.prompt ?? ""),
        options: Array.isArray(options) ? options : [],
        audioText: row.section_type === "listening" && row.audio_text ? String(row.audio_text) : null,
        passageText: row.section_type === "reading" && row.audio_text ? String(row.audio_text) : null,
      };
    });
  } catch (error) {
    console.error("[learning/exercises] D1 normalized read failed; using legacy source:", error);
    return null;
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await context.params;
  const section = request.nextUrl.searchParams.get("section") ?? "grammar";
  if (!sectionNames.has(section)) return NextResponse.json({ error: "Sección no válida." }, { status: 400 });


  const b1Match = /^b1-(\d{2})$/.exec(lessonId);
  if (b1Match) {
    try {
      const result = await getB1UnitD1Exercises(Number(b1Match[1]), section);
      if (!result) return NextResponse.json({ error: "La unidad B1 no existe en COURSE_DB." }, { status: 404 });
      return NextResponse.json(result);
    } catch (error) {
      console.error("[learning/exercises] B1 D1 read failed:", error);
      return NextResponse.json({ error: "No se pudo leer el contenido de B1 desde COURSE_DB." }, { status: 500 });
    }
  }

  const advancedMatch = /^(b1|b2|c1|c2)-(\d{2})$/.exec(lessonId);
  if (advancedMatch) {
    const normalizedExercises = await getNormalizedD1Exercises(lessonId, section);
    if (normalizedExercises) return NextResponse.json({ exercises: normalizedExercises });
    const unit = getLegacyAdvancedUnit(advancedMatch[1], Number(advancedMatch[2]));
    if (!unit) return NextResponse.json({ error: "Unidad no disponible." }, { status: 404 });
    const selected = unit.blocks.flatMap((block) => block.content
      .filter((item) => getLegacyAdvancedSection(item, block.title) === section)
      .map((item) => ({ item, blockTitle: block.title })));
    return NextResponse.json({ exercises: selected.flatMap(({ item }, index) => {
      // Legacy cloze items store one option set and one answer per numbered gap.
      // Render each numbered item as its own multiple-choice exercise so it uses
      // the same interaction and correction path as the original course.
      const gaps = (item as LegacyAdvancedItem & {
        gaps?: { id: string; options: { id: string; text: string }[] }[];
        main_text?: string;
      }).gaps;
      const pairs = (item as LegacyAdvancedItem & {
        pairs?: { id?: string; left: string; right: string }[];
      }).pairs;
      if (/matching|match/i.test(item.type) && Array.isArray(pairs) && pairs.length) {
        const matchingOptions = pairs.map((pair) => pair.right);
        return pairs.map((pair, pairIndex) => ({
          id: item.interaction_id + "__match_" + (pair.id || String(pairIndex + 1)),
          number: index * pairs.length + pairIndex + 1,
          type: "multiple_choice",
          prompt: pair.left,
          options: matchingOptions,
        }));
      }
      if (/cloze/i.test(item.type) && Array.isArray(gaps) && gaps.length) {
        const mainText = String((item as LegacyAdvancedItem & { main_text?: string }).main_text ?? "");
        return gaps.map((gap, gapIndex) => {
          const gapNumber = Number(gap.id) || gapIndex + 1;
          const line = mainText.split("\n").map((part) => part.trim())
            .find((part) => new RegExp("^" + gapNumber + "\\.").test(part))
            || mainText;
          const prompt = line.replace(/^\d+\.\s*/, "").replace(/\[GAP\s*\d+\]/gi, "_____").replace(/\(\d+\)/g, "").trim();
          return {
            id: item.interaction_id + "__gap_" + gap.id,
            number: index * gaps.length + gapIndex + 1,
            type: "multiple_choice",
            prompt: prompt || advancedPrompt(item),
            options: (gap.options ?? []).map((option) => option.text),
          };
        });
      }
      const options = (item.options ?? []).map((option) => option.text);
      const type = options.length ? "multiple_choice"
        : /fill.?blank|open.?cloze/i.test(item.type) ? "fill_blank" : "free_text";
      return [{
        id: item.interaction_id, number: index + 1, type,
        prompt: advancedPrompt(item), options,
        audioText: section === "listening" && item.transcript ? item.transcript : null,
        passageText: section === "reading" && item.transcript ? item.transcript : null
      }];
    }) });
  }

  const a1Items = await getA1Items(lessonId);
  if (a1Items !== null) {
    const selected = a1Items.filter((item) => getLegacySection(item) === section);
    return NextResponse.json({ exercises: selected.map((item, index) => legacyExercise(item, index)) });
  }

  if (/^a2-\d{2}$/.test(lessonId)) {
    const match = /^a2-(\d{2})$/.exec(lessonId);
    if (!match) return NextResponse.json({ error: "Unidad A2 no disponible." }, { status: 404 });
    const unitNumber = Number(match[1]);
    const unit = a2Units.find((item) => item.n === unitNumber);
    const questions = section === "production" ? [] : a2QuestionSets[unitNumber]?.[section as keyof typeof a2QuestionSets[number]] ?? [];
    if (!unit || questions.length !== 15) return NextResponse.json({ error: "Unidad A2 no disponible." }, { status: 404 });
    return NextResponse.json({ exercises: questions.map((item) => ({
      id: item.id, number: item.number, type: "multiple_choice", prompt: item.prompt, options: item.options,
      audioText: section === "listening" ? unit.passage : null,
      passageText: section === "reading" ? unit.passage : null
    })) });
  }

  try {
    const { env } = await resolveCloudflareEnv();
    const result = await env.COURSE_DB!.prepare(
      `SELECT id, exercise_number, exercise_type, prompt, options_json, section_type, audio_text
       FROM learning_exercises WHERE lesson_id = ? AND section_type = ? ORDER BY exercise_number ASC`
    ).bind(lessonId, section).all<Record<string, unknown>>();
    return NextResponse.json({ exercises: (result.results ?? []).map((row) => ({
      id: String(row.id), number: Number(row.exercise_number), type: String(row.exercise_type),
      prompt: String(row.prompt), options: JSON.parse(String(row.options_json ?? "[]")),
      audioText: row.audio_text ? String(row.audio_text) : null,
      passageText: row.section_type === "reading" && row.audio_text ? String(row.audio_text) : null
    })) });
  } catch {
    return NextResponse.json({ error: "No se pudieron cargar los ejercicios." }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await context.params;
  const payload = await request.json().catch(() => null) as { exerciseId?: string; answer?: unknown } | null;
  if (!payload?.exerciseId || typeof payload.answer !== "string" || payload.answer.length > 500) {
    return NextResponse.json({ error: "Respuesta no válida." }, { status: 400 });
  }

  const b2Match = /^b2-(\d{2})$/.exec(lessonId);
  if (b2Match) {
    const unit = B2_COURSE.units.find((candidate) => candidate.id === Number(b2Match[1]));
    const exercise = unit?.exercises.find((candidate) => candidate.id === payload.exerciseId);
    const question = exercise?.content?.questions?.[0];
    if (!question) return NextResponse.json({ error: "Ejercicio B2 no encontrado." }, { status: 404 });
    const normalize = (value: string) => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en").replace(/[.!?]+$/, "");
    const expectedValues = Array.isArray(question.acceptableAnswers) ? question.acceptableAnswers.map(String) : [];
    if (question.correctAnswer !== undefined) {
      if (typeof question.correctAnswer === "number" && Array.isArray(question.options)) expectedValues.push(plainEnglish(String(question.options[question.correctAnswer] ?? "")));
      else if (typeof question.correctAnswer === "string" && Array.isArray(question.options)) {
        const matchingOption = question.options.find((option) => typeof option !== "string" && option.id === question.correctAnswer);
        if (matchingOption) expectedValues.push(plainEnglish(matchingOption.text));
        else expectedValues.push(plainEnglish(question.correctAnswer));
      } else expectedValues.push(plainEnglish(String(question.correctAnswer)));
    }
    const correct = expectedValues.some((expected) => normalize(expected) === normalize(payload.answer as string));
    const explanation = plainText(question.explanation ?? (expectedValues[0] ? "Respuesta correcta: " + expectedValues[0] : ""));
    return NextResponse.json({ correct, explanation, authenticated: false });
  }
  const a1Match = /^a1-(\d{2})$/.exec(lessonId);
  if (a1Match) {
    const unitNumber = Number(a1Match[1]);
    const unit = unitNumber >= 1 && unitNumber <= 60 ? getA1LegacyUnit(unitNumber) : null;
    const item = unit?.blocks.flatMap((block) => block.content).find((question) => question.interaction_id === payload.exerciseId);
    if (!item) return NextResponse.json({ error: "Ejercicio A1 no encontrado." }, { status: 404 });
    const expected = normalizedLegacyAnswer(item);
    const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en");
    const correct = item.type === "sentence-building"
      ? normalize(payload.answer) === normalize(expected)
      : normalize(payload.answer) === normalize(expected);

    const explanation = item.explanation ? plainText(item.explanation) : `Respuesta correcta: ${expected}`;
    const { env, user } = await getSessionUser(request);
    const now = new Date().toISOString();
    const previousRow = user
      ? await env.COURSE_DB!.prepare("SELECT progress_json FROM learning_progress WHERE user_id = ? AND lesson_id = ?").bind(user.id, lessonId).first<{ progress_json: string | null }>()
      : null;
    let progress: Record<string, unknown> = {};
    try { if (previousRow?.progress_json) progress = JSON.parse(previousRow.progress_json); } catch { progress = {}; }
    const previousReview = (progress[payload.exerciseId] as { review?: ReviewState } | undefined)?.review
      ?? { intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };
    const review = scheduleNextReview(previousReview, correct ? 4 : 1);
    if (user) {
      progress[payload.exerciseId] = {
        ...(progress[payload.exerciseId] as Record<string, unknown> | undefined),
        answer: payload.answer, feedback: { correct, explanation }, review
      };
      await env.COURSE_DB!.prepare(
        `INSERT INTO learning_progress (user_id, lesson_id, progress_json, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET progress_json = excluded.progress_json, updated_at = CURRENT_TIMESTAMP`
      ).bind(user.id, lessonId, JSON.stringify(progress)).run();
    }
    return NextResponse.json({ correct, explanation, review, authenticated: Boolean(user) });
  }


  const b1Match = /^b1-(\d{2})$/.exec(lessonId);
  if (b1Match) {
    try {
      const unitNumber = Number(b1Match[1]);
      const stored = unitNumber === 31
        ? await getB1Unit31D1Answer(payload.exerciseId)
        : await getB1CourseJsonAnswer(unitNumber, payload.exerciseId);
      if (!stored || !stored.expected.length) {
        return NextResponse.json({ error: "Ejercicio B1 no encontrado en COURSE_DB." }, { status: 404 });
      }
      const normalize = (value: string) => value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en").replace(/[.!?]+$/, "");
      const correct = stored.expected.some((expected) => normalize(expected) === normalize(payload.answer as string));
      const expected = stored.expected[0] ?? "";
      const explanation = stored.explanation || `Respuesta correcta: ${expected}`;
      let authenticated = false;
      let review: ReturnType<typeof scheduleNextReview> | null = null;
      try {
        const { env, user } = await getSessionUser(request);
        authenticated = Boolean(user);
        if (user) {
          const previousRow = await env.COURSE_DB!.prepare("SELECT progress_json FROM learning_progress WHERE user_id = ? AND lesson_id = ?")
            .bind(user.id, lessonId).first<{ progress_json: string | null }>();
          let progress: Record<string, unknown> = {};
          try { if (previousRow?.progress_json) progress = JSON.parse(previousRow.progress_json); } catch { progress = {}; }
          const previousReview = (progress[payload.exerciseId] as { review?: ReviewState } | undefined)?.review
            ?? { intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };
          review = scheduleNextReview(previousReview, correct ? 4 : 1);
          progress[payload.exerciseId] = { answer: payload.answer, feedback: { correct, explanation }, review };
          await env.COURSE_DB!.prepare(`INSERT INTO learning_progress (user_id, lesson_id, progress_json, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, lesson_id) DO UPDATE SET progress_json = excluded.progress_json, updated_at = CURRENT_TIMESTAMP`)
            .bind(user.id, lessonId, JSON.stringify(progress)).run();
        }
      } catch (error) {
        console.warn("[learning/exercises] B1 grading succeeded; progress persistence unavailable:", error);
      }
      return NextResponse.json({ correct, explanation, review, authenticated });
    } catch (error) {
      console.error("[learning/exercises] B1 D1 grading failed:", error);
      return NextResponse.json({ error: "No se pudo corregir el ejercicio desde COURSE_DB." }, { status: 500 });
    }
  }

  if (/^(b1|b2|c1|c2)-\d{2}$/.test(lessonId)) {
    // Prefer the normalized D1 record. If the unit has not yet been imported,
    // retain the existing JSON-backed fallback without breaking the lesson.
    try {
      const { env, user } = await getSessionUser(request);
      const row = await env.COURSE_DB!.prepare(
        "SELECT id, answer_json, explanation, exercise_type FROM learning_exercises WHERE id = ? AND lesson_id = ? LIMIT 1"
      ).bind(payload.exerciseId, lessonId).first<{ id: string; answer_json: string | null; explanation: string | null; exercise_type: string }>();
      if (row) {
        let answerData: unknown = {};
        try { answerData = JSON.parse(String(row.answer_json ?? "{}")); } catch { answerData = {}; }
        const answerRecord = typeof answerData === "object" && answerData !== null && !Array.isArray(answerData)
          ? answerData as { correct?: unknown; acceptableAnswers?: unknown; acceptable_answers?: unknown; alternatives?: unknown }
          : null;
        const expected = answerRecord?.correct !== undefined ? answerRecord.correct : answerData;
        const alternatives = answerRecord
          ? [answerRecord.acceptableAnswers, answerRecord.acceptable_answers, answerRecord.alternatives]
              .flatMap((value) => Array.isArray(value) ? value : value == null ? [] : [value])
          : [];
        const acceptedAnswers = [expected, ...alternatives]
          .filter((value) => value !== null && value !== undefined && String(value).trim() !== "");
        let submitted = payload.answer;
        if (row.exercise_type === "sentence_building") {
          try {
            const parsed = JSON.parse(submitted);
            if (Array.isArray(parsed)) submitted = parsed.map(String).join(" ");
          } catch { /* submitted as plain text */ }
        }
        const normalize = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en").replace(/[.!?]+$/, "");
        const correct = acceptedAnswers.some((candidate) => normalize(String(candidate)) === normalize(submitted));
        const explanation = String(row.explanation ?? "");
        const now = new Date().toISOString();
        let review: ReturnType<typeof scheduleNextReview> | null = null;
        if (user) {
          const existing = await env.COURSE_DB!.prepare(
            "SELECT review_json FROM learning_exercise_progress WHERE user_id = ? AND exercise_id = ? LIMIT 1"
          ).bind(user.id, payload.exerciseId).first<{ review_json: string | null }>();
          let previous: ReviewState = { intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };
          try { if (existing?.review_json) previous = JSON.parse(existing.review_json) as ReviewState; } catch { /* use default */ }
          review = scheduleNextReview(previous, correct ? 4 : 1, now);
          await env.COURSE_DB!.prepare(
            `INSERT INTO learning_exercise_progress
              (user_id, lesson_id, exercise_id, answer_text, correct, explanation, review_json, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(user_id, exercise_id) DO UPDATE SET
               lesson_id = excluded.lesson_id, answer_text = excluded.answer_text,
               correct = excluded.correct, explanation = excluded.explanation,
               review_json = excluded.review_json, updated_at = excluded.updated_at`
          ).bind(user.id, lessonId, payload.exerciseId, submitted, correct ? 1 : 0, explanation, JSON.stringify(review), now).run();

          const conceptKey = `exercise:${payload.exerciseId}`;
          const priorItem = await env.COURSE_DB!.prepare(
            "SELECT id FROM learning_review_items WHERE user_id = ? AND concept_key = ? LIMIT 1"
          ).bind(user.id, conceptKey).first<{ id: string }>();
          const reviewItemId = priorItem?.id ?? `review-${user.id}-${payload.exerciseId}`;
          await env.COURSE_DB!.prepare(
            `INSERT INTO learning_review_items
              (id, user_id, lesson_id, concept_key, due_at, interval_days, ease_factor, repetitions, lapses, last_quality, last_reviewed_at, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(user_id, concept_key) DO UPDATE SET
               due_at = excluded.due_at, interval_days = excluded.interval_days,
               ease_factor = excluded.ease_factor, repetitions = excluded.repetitions,
               lapses = excluded.lapses, last_quality = excluded.last_quality,
               last_reviewed_at = excluded.last_reviewed_at, updated_at = excluded.updated_at`
          ).bind(reviewItemId, user.id, lessonId, conceptKey, review.dueAt, review.intervalDays,
            review.easeFactor, review.repetitions, review.lapses, review.quality, review.reviewedAt, now, now).run();
          const historyId = `review-history-${user.id}-${payload.exerciseId}-${Date.now()}`;
          await env.COURSE_DB!.prepare(
            `INSERT INTO learning_review_history
              (id, user_id, review_item_id, lesson_id, quality, was_correct, reviewed_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).bind(historyId, user.id, reviewItemId, lessonId, review.quality, correct ? 1 : 0, review.reviewedAt).run();
          await env.COURSE_DB!.prepare(
            `INSERT INTO learning_lesson_progress
              (user_id, lesson_id, status, attempts, correct_answers, total_answers, last_score, started_at, updated_at)
             VALUES (?, ?, 'in_progress', 1, ?, 1, ?, ?, ?)
             ON CONFLICT(user_id, lesson_id) DO UPDATE SET
               status = CASE WHEN learning_lesson_progress.status = 'completed' THEN 'completed' ELSE 'in_progress' END, attempts = learning_lesson_progress.attempts + 1,
               correct_answers = learning_lesson_progress.correct_answers + excluded.correct_answers,
               total_answers = learning_lesson_progress.total_answers + 1,
               last_score = CAST(learning_lesson_progress.correct_answers + excluded.correct_answers AS REAL) * 100
                 / (learning_lesson_progress.total_answers + 1),
               started_at = COALESCE(learning_lesson_progress.started_at, excluded.started_at),
               updated_at = excluded.updated_at`
          ).bind(user.id, lessonId, correct ? 1 : 0, correct ? 100 : 0, now, now).run();
        }
        return NextResponse.json({ correct, explanation, review, authenticated: Boolean(user) });
      }
    } catch (error) {
      console.error("[learning/exercises] D1 normalized grading failed; using legacy source:", error);
    }
    const specialMatch = /^(.*)__(gap|match)_([^_]+)$/.exec(payload.exerciseId);
    const item = getLegacyAdvancedItem(lessonId, specialMatch ? specialMatch[1] : payload.exerciseId);
    if (!item) return NextResponse.json({ error: "Ejercicio no encontrado." }, { status: 404 });
    let expected: string[] = [];
    if (specialMatch?.[2] === "gap") {
      const gapId = specialMatch[3];
      const gapItem = item as LegacyAdvancedItem & {
        gaps?: { id: string; options: { id: string; text: string }[] }[];
        correct_answer?: Record<string, string>;
      };
      const gap = gapItem.gaps?.find((candidate) => candidate.id === gapId);
      const correctOptionId = gapItem.correct_answer && typeof gapItem.correct_answer === "object"
        ? gapItem.correct_answer[gapId] : undefined;
      const correctOption = gap?.options.find((option) => option.id === correctOptionId);
      expected = correctOption ? [correctOption.text] : [];
    } else if (specialMatch?.[2] === "match") {
      const pairId = specialMatch[3];
      const pairs = (item as LegacyAdvancedItem & { pairs?: { id?: string; left: string; right: string }[] }).pairs ?? [];
      const correctPair = pairs.find((pair, index) => (pair.id || String(index + 1)) === pairId);
      expected = correctPair ? [correctPair.right] : [];
    } else {
      const correct = advancedExpectedAnswer(item);
      expected = correct ? [correct] : [];
      const acceptable = (item as LegacyAdvancedItem & { acceptable_answers?: unknown; acceptableAnswers?: unknown }).acceptable_answers
        ?? (item as LegacyAdvancedItem & { acceptableAnswers?: unknown }).acceptableAnswers;
      expected.push(...(Array.isArray(acceptable) ? acceptable.map(String) : acceptable == null ? [] : [String(acceptable)]));
    }
    const normalize = (value: string) => value.trim().replace(/\\s+/g, " ").toLocaleLowerCase("en").replace(/[.!?]+$/, "");
    const correct = expected.filter(Boolean).some((candidate) => normalize(payload.answer) === normalize(candidate));
    const explanation = advancedPlainText(item.explanation) || (expected ? "Respuesta correcta: " + expected : "Revisa la explicación del ejercicio.");
    const { env, user } = await getSessionUser(request);
    const previousRow = user
      ? await env.COURSE_DB!.prepare("SELECT progress_json FROM learning_progress WHERE user_id = ? AND lesson_id = ?").bind(user.id, lessonId).first<{ progress_json: string | null }>()
      : null;
    let progress: Record<string, unknown> = {};
    try { if (previousRow?.progress_json) progress = JSON.parse(previousRow.progress_json); } catch { progress = {}; }
    const previousReview = (progress[payload.exerciseId] as { review?: ReviewState } | undefined)?.review
      ?? { intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };
    const review = scheduleNextReview(previousReview, correct ? 4 : 1);
    if (user) {
      progress[payload.exerciseId] = {
        ...(progress[payload.exerciseId] as Record<string, unknown> | undefined),
        answer: payload.answer, feedback: { correct, explanation }, review
      };
      await env.COURSE_DB!.prepare(
        `INSERT INTO learning_progress (user_id, lesson_id, progress_json, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET progress_json = excluded.progress_json, updated_at = CURRENT_TIMESTAMP`
      ).bind(user.id, lessonId, JSON.stringify(progress)).run();
    }
    return NextResponse.json({ correct, explanation, review, authenticated: Boolean(user) });
  }

  if (/^a2-\d{2}$/.test(lessonId)) {
    const found = getA2Question(lessonId, payload.exerciseId);
    if (!found) return NextResponse.json({ error: "Ejercicio A2 no encontrado." }, { status: 404 });
    const { question } = found;
    const normalize = (value: string) => value
      .normalize("NFKC")
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleLowerCase("en")
      .replace(/[.!?]+$/, "");
    // The A2 interaction submits option text; accept the stored answer key
    // and the matching canonical option text.
    const correct = normalize(payload.answer) === normalize(question.answer)
      || question.options.some((option) => normalize(option) === normalize(question.answer)
        && normalize(payload.answer) === normalize(option));
    const { env, user } = await getSessionUser(request);
    const now = new Date().toISOString();
    const existingProgress = user ? await env.COURSE_DB!.prepare(
      "SELECT review_json FROM learning_exercise_progress WHERE user_id = ? AND exercise_id = ? LIMIT 1"
    ).bind(user.id, payload.exerciseId).first<{ review_json: string | null }>() : null;
    let previous: ReviewState = { intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };

try { if (existingProgress?.review_json) previous = JSON.parse(existingProgress.review_json) as ReviewState; } catch { /* default */ }
    const review = scheduleNextReview(previous, correct ? 4 : 1);
    if (user) {
      await env.COURSE_DB!.prepare(
        `INSERT INTO learning_exercise_progress (user_id, lesson_id, exercise_id, answer_text, correct, explanation, review_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, exercise_id) DO UPDATE SET answer_text = excluded.answer_text, correct = excluded.correct, explanation = excluded.explanation, review_json = excluded.review_json, updated_at = excluded.updated_at`
      ).bind(user.id, lessonId, payload.exerciseId, payload.answer, correct ? 1 : 0, question.explanation, JSON.stringify(review), now).run();
    }
    return NextResponse.json({ correct, explanation: question.explanation, review, authenticated: Boolean(user) });
  }

  try {
    const { env } = await resolveCloudflareEnv();
    const row = await env.COURSE_DB!.prepare(
      "SELECT id, answer_json, explanation FROM learning_exercises WHERE id = ? AND lesson_id = ? LIMIT 1"
    ).bind(payload.exerciseId, lessonId).first<{ id: string; answer_json: string | null; explanation: string | null }>();
    if (!row) return NextResponse.json({ error: "Ejercicio no encontrado." }, { status: 404 });
    let answerData: unknown;
    try { answerData = JSON.parse(String(row.answer_json ?? "{}")); } catch { answerData = {}; }
    const expected = typeof answerData === "object" && answerData !== null && "correct" in answerData
      ? (answerData as { correct: unknown }).correct
      : answerData;
    const correct = payload.answer === expected;
    return NextResponse.json({ correct, explanation: String(row.explanation ?? ""), review: null });
  } catch {
    return NextResponse.json({ error: "No se pudo corregir la respuesta." }, { status: 500 });
  }
}
