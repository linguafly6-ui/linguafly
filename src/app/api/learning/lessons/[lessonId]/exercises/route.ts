import { NextRequest, NextResponse } from "next/server";
import { a2QuestionSets, a2Units } from "@/lib/learning/a2-units";
import { scheduleNextReview, type ReviewState } from "@/lib/learning/spaced-repetition";
import { getLearningSession } from "@/lib/learning/session";
import { db } from "@/lib/db";

const sectionNames = new Set(["grammar", "vocabulary", "listening", "reading"]);

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

export async function GET(request: NextRequest, context: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await context.params;
  if (/^a2-\d{2}$/.test(lessonId)) {
    const section = request.nextUrl.searchParams.get("section") ?? "grammar";
    if (!sectionNames.has(section)) return NextResponse.json({ error: "Sección no válida." }, { status: 400 });
    const match = /^a2-(\d{2})$/.exec(lessonId)!;
    const unitNumber = Number(match[1]);
    const unit = a2Units.find((item) => item.n === unitNumber);
    const questions = a2QuestionSets[unitNumber]?.[section as keyof typeof a2QuestionSets[number]] ?? [];
    if (!unit || questions.length !== 15) return NextResponse.json({ error: "Unidad A2 no disponible." }, { status: 404 });
    return NextResponse.json({ exercises: questions.map((item) => ({
      id: item.id,
      number: item.number,
      type: "multiple_choice",
      prompt: item.prompt,
      options: item.options,
      audioText: section === "listening" ? unit.passage : null,
      passageText: section === "reading" ? unit.passage : null
    })) });
  }

  const dbResult = await db.query(
    `SELECT id, exercise_number, exercise_type, prompt, options_json, section_type, audio_text
     FROM learning_exercises WHERE lesson_id = ? AND section_type = ? ORDER BY exercise_number ASC`,
    [lessonId, request.nextUrl.searchParams.get("section") ?? "grammar"]
  );
  if (dbResult.error) return NextResponse.json({ error: "No se pudieron cargar los ejercicios." }, { status: 500 });
  return NextResponse.json({ exercises: (dbResult.data ?? []).map((row: Record<string, unknown>) => ({
    id: String(row.id), number: Number(row.exercise_number), type: String(row.exercise_type),
    prompt: String(row.prompt), options: JSON.parse(String(row.options_json ?? "[]")),
    audioText: row.audio_text ? String(row.audio_text) : null,
    passageText: row.section_type === "reading" && row.audio_text ? String(row.audio_text) : null
  })) });
}

export async function POST(request: NextRequest, context: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await context.params;
  const payload = await request.json().catch(() => null) as { exerciseId?: string; answer?: unknown } | null;
  if (!payload?.exerciseId || typeof payload.answer !== "string" || payload.answer.length > 500) {
    return NextResponse.json({ error: "Respuesta no válida." }, { status: 400 });
  }

  if (/^a2-\d{2}$/.test(lessonId)) {
    const found = getA2Question(lessonId, payload.exerciseId);
    if (!found) return NextResponse.json({ error: "Ejercicio A2 no encontrado." }, { status: 404 });
    const { unit, question } = found;
    const correct = payload.answer === question.answer;
    const session = await getLearningSession();
    const userId = session?.userId ?? null;
    const previousResult = userId
      ? await db.query(
          `SELECT progress_json FROM learning_progress WHERE user_id = ? AND lesson_id = ?`,
          [userId, lessonId]
        )
      : { data: [], error: null };
    let progress: Record<string, unknown> = {};
    if (previousResult.data?.[0]?.progress_json) {
      try { progress = JSON.parse(String(previousResult.data[0].progress_json)); } catch { progress = {}; }
    }
    const previous = (progress[payload.exerciseId] as { review?: ReviewState } | undefined)?.review ?? {
      intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0
    };
    const review = scheduleNextReview(previous, correct ? 4 : 1);
    if (userId) {
      progress[payload.exerciseId] = {
        ...(progress[payload.exerciseId] as Record<string, unknown> | undefined),
        answer: payload.answer,
        feedback: { correct, explanation: question.explanation },
        review
      };
      await db.query(
        `INSERT INTO learning_progress (user_id, lesson_id, progress_json, updated_at)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET progress_json = excluded.progress_json, updated_at = CURRENT_TIMESTAMP`,
        [userId, lessonId, JSON.stringify(progress)]
      );
    }
    return NextResponse.json({ correct, explanation: question.explanation, review, authenticated: Boolean(userId) });
  }

  const existing = await db.query(
    `SELECT id, answer_json, explanation, lesson_id FROM learning_exercises WHERE id = ? AND lesson_id = ?`,
    [payload.exerciseId, lessonId]
  );
  const row = existing.data?.[0] as Record<string, unknown> | undefined;
  if (!row) return NextResponse.json({ error: "Ejercicio no encontrado." }, { status: 404 });
  let answerData: unknown;
  try { answerData = JSON.parse(String(row.answer_json ?? "{}")); } catch { answerData = {}; }
  const expected = typeof answerData === "object" && answerData !== null && "correct" in answerData
    ? (answerData as { correct: unknown }).correct
    : answerData;
  const correct = payload.answer === expected;
  return NextResponse.json({ correct, explanation: String(row.explanation ?? ""), review: null });
}
