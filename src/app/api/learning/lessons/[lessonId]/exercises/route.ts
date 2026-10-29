import { NextRequest, NextResponse } from "next/server";
import { a2QuestionSets, a2Units } from "@/lib/learning/a2-units";
import { scheduleNextReview, type ReviewState } from "@/lib/learning/spaced-repetition";
import { getSessionUser } from "@/lib/learning/auth";
import { resolveCloudflareEnv } from "@/lib/db/client";
import { getA1LegacyUnit, type A1LegacyItem as LegacyItem, type A1LegacyUnit as LegacyUnit } from "@/lib/learning/a1-legacy-units";

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
    return plainEnglish(text);
  }
  if (item.type === "sentence-building" && Array.isArray(item.correct_answer)) {
    const byId = new Map(options.map((option) => [option.id, plainEnglish(option.text)]));
    return item.correct_answer.map((id) => byId.get(String(id)) ?? String(id)).join(" ");
  }
  if (item.type === "true-false") return item.correct_answer === true ? "True" : "False";
  return String(item.correct_answer);
}

function legacyExercise(item: LegacyItem, index: number) {
  const options = (item.options ?? []).map((option) => plainEnglish(option.text));
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
  if (item.type === "reading-comprehension" || item.type === "listening-comprehension") return question || stimulus || instruction;
  if (item.type === "true-false") return `${instruction} ${stimulus}`.trim();
  if (item.type === "sentence-building") return `${instruction} ${stimulus}`.trim();
  return `${stimulus} ${question} ${instruction}`.trim();
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

export async function GET(request: NextRequest, context: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await context.params;
  const section = request.nextUrl.searchParams.get("section") ?? "grammar";
  if (!sectionNames.has(section)) return NextResponse.json({ error: "Sección no válida." }, { status: 400 });

  const a1Items = await getA1Items(lessonId);
  if (a1Items !== null) {
    const selected = a1Items.filter((item) => getLegacySection(item) === section);
    return NextResponse.json({ exercises: selected.map((item, index) => legacyExercise(item, index)) });
  }

  if (/^a2-\d{2}$/.test(lessonId)) {
  const match = /^a2-(\d{2})$/.exec(lessonId);
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
    const result = await env.DB.prepare(
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
      ? await env.DB.prepare("SELECT progress_json FROM learning_progress WHERE user_id = ? AND lesson_id = ?").bind(user.id, lessonId).first<{ progress_json: string | null }>()
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
      await env.DB.prepare(
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
    const { unit, question } = found;
    const correct = payload.answer === question.answer;
    const { env, user } = await getSessionUser(request);
    const now = new Date().toISOString();
    const existingProgress = user ? await env.DB.prepare(
      "SELECT review_json FROM learning_exercise_progress WHERE user_id = ? AND exercise_id = ? LIMIT 1"
    ).bind(user.id, payload.exerciseId).first<{ review_json: string | null }>() : null;
    let previous: ReviewState = { intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };

try { if (existingProgress?.review_json) previous = JSON.parse(existingProgress.review_json) as ReviewState; } catch { /* default */ }
    const review = scheduleNextReview(previous, correct ? 4 : 1);
    if (user) {
      await env.DB.prepare(
        `INSERT INTO learning_exercise_progress (user_id, lesson_id, exercise_id, answer_text, correct, explanation, review_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, exercise_id) DO UPDATE SET answer_text = excluded.answer_text, correct = excluded.correct, explanation = excluded.explanation, review_json = excluded.review_json, updated_at = excluded.updated_at`
      ).bind(user.id, lessonId, payload.exerciseId, payload.answer, correct ? 1 : 0, question.explanation, JSON.stringify(review), now).run();
    }
    return NextResponse.json({ correct, explanation: question.explanation, review, authenticated: Boolean(user) });
  }

  try {
    const { env } = await resolveCloudflareEnv();
    const row = await env.DB.prepare(
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
}function plainText(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/\[([^\]|]+)\|([^\]]+)\]/g, "$2").replace(/\s+/g, " ").trim();
}

function getLegacySection(item: LegacyItem): string | null {
  if (item.mastery_tag === "grammar" || item.mastery_tag === "vocabulary" || item.mastery_tag === "reading" || item.mastery_tag === "listening") {
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
    return plainText(text);
  }
  if (item.type === "sentence-building" && Array.isArray(item.correct_answer)) {
    const byId = new Map(options.map((option) => [option.id, plainText(option.text)]));
    return item.correct_answer.map((id) => byId.get(String(id)) ?? String(id)).join(" ");
  }
  if (item.type === "true-false") return item.correct_answer === true ? "True" : "False";
  return String(item.correct_answer);
}

function legacyExercise(item: LegacyItem, index: number) {
  const options = (item.options ?? []).map((option) => plainText(option.text));
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
    passageText: item.transcript ? plainText(item.transcript) : null,
    audioText: item.mastery_tag === "listening" && item.transcript ? plainText(item.transcript) : null
  };
}

function getPrompt(item: LegacyItem): string {
  const stimulus = plainText(item.stimulus_en);
  const question = plainText(item.question_en);
  const instruction = plainText(item.prompt_es);
  if (item.type === "reading-comprehension" || item.type === "listening-comprehension") return question || stimulus || instruction;
  if (item.type === "true-false") return `${instruction} ${stimulus}`.trim();
  if (item.type === "sentence-building") return `${instruction} ${stimulus}`.trim();
  return `${stimulus} ${question} ${instruction}`.trim();
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

export async function GET(request: NextRequest, context: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await context.params;
  const section = request.nextUrl.searchParams.get("section") ?? "grammar";
  if (!sectionNames.has(section)) return NextResponse.json({ error: "Sección no válida." }, { status: 400 });

  const a1Items = await getA1Items(lessonId);
  if (a1Items !== null) {
    const selected = a1Items.filter((item) => getLegacySection(item) === section);
    return NextResponse.json({ exercises: selected.map((item, index) => legacyExercise(item, index)) });
  }

  if (/^a2-\d{2}$/.test(lessonId)) {
  const match = /^a2-(\d{2})$/.exec(lessonId);
    const unitNumber = Number(match[1]);
    const unit = a2Units.find((item) => item.n === unitNumber);
    const questions = a2QuestionSets[unitNumber]?.[section as keyof typeof a2QuestionSets[number]] ?? [];
    if (!unit || questions.length !== 15) return NextResponse.json({ error: "Unidad A2 no disponible." }, { status: 404 });
    return NextResponse.json({ exercises: questions.map((item) => ({
      id: item.id, number: item.number, type: "multiple_choice", prompt: item.prompt, options: item.options,
      audioText: section === "listening" ? unit.passage : null,
      passageText: section === "reading" ? unit.passage : null
    })) });
  }

  try {
    const { env } = await resolveCloudflareEnv();
    const result = await env.DB.prepare(
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
      ? await env.DB.prepare("SELECT progress_json FROM learning_progress WHERE user_id = ? AND lesson_id = ?").bind(user.id, lessonId).first<{ progress_json: string | null }>()
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
      await env.DB.prepare(
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
    const { unit, question } = found;
    const correct = payload.answer === question.answer;
    const { env, user } = await getSessionUser(request);
    const now = new Date().toISOString();
    const existingProgress = user ? await env.DB.prepare(
      "SELECT review_json FROM learning_exercise_progress WHERE user_id = ? AND exercise_id = ? LIMIT 1"
    ).bind(user.id, payload.exerciseId).first<{ review_json: string | null }>() : null;
    let previous: ReviewState = { intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };
    try { if (existingProgress?.review_json) previous = JSON.parse(existingProgress.review_json) as ReviewState; } catch { /* default */ }
    const review = scheduleNextReview(previous, correct ? 4 : 1);
    if (user) {
      await env.DB.prepare(
        `INSERT INTO learning_exercise_progress (user_id, lesson_id, exercise_id, answer_text, correct, explanation, review_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, exercise_id) DO UPDATE SET answer_text = excluded.answer_text, correct = excluded.correct, explanation = excluded.explanation, review_json = excluded.review_json, updated_at = excluded.updated_at`
      ).bind(user.id, lessonId, payload.exerciseId, payload.answer, correct ? 1 : 0, question.explanation, JSON.stringify(review), now).run();
    }
    return NextResponse.json({ correct, explanation: question.explanation, review, authenticated: Boolean(user) });
  }

  try {
    const { env } = await resolveCloudflareEnv();
    const row = await env.DB.prepare(
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
}
