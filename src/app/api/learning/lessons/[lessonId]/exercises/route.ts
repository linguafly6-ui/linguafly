import { NextRequest, NextResponse } from "next/server";
import { resolveCloudflareEnv } from "@/lib/db/client";
import { getSessionUser } from "@/lib/learning/auth";
import { scheduleNextReview, type ReviewState } from "@/lib/learning/spaced-repetition";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ExerciseRow = {
  id: string;
  exercise_number: number;
  exercise_type: string;
  prompt: string;
  options_json: string;
};

/** Return prompts and options only; never send answer keys to the browser. */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson id" }, { status: 400 });
    }

    const { env } = await resolveCloudflareEnv();
    const lesson = await env.DB.prepare(
      "SELECT id FROM learning_lessons WHERE id = ? AND published = 1 LIMIT 1"
    ).bind(lessonId).first<{ id: string }>();

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const result = await env.DB.prepare(
      `SELECT id, exercise_number, exercise_type, prompt, options_json
       FROM learning_exercises
       WHERE lesson_id = ?
       ORDER BY exercise_number ASC`
    ).bind(lessonId).all<ExerciseRow>();

    const exercises = (result.results || []).map((row) => {
      let options: unknown = [];
      try {
        options = JSON.parse(row.options_json || "[]");
        if (!Array.isArray(options)) options = [];
      } catch {
        options = [];
      }
      return { id: row.id, number: row.exercise_number, type: row.exercise_type, prompt: row.prompt, options };
    });

    return NextResponse.json(
      { lessonId, exercises },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[api/learning/lesson-exercises] Failed to list exercises:", error);
    return NextResponse.json(
      { error: "Unable to load exercises" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

/**
 * POST /api/learning/lessons/:lessonId/exercises
 * Grades a practice answer. Learner progress is saved only for a verified session.
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await context.params;
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(lessonId)) {
      return NextResponse.json({ error: "Invalid lesson id" }, { status: 400 });
    }

    const body = await request.json().catch(() => null) as { exerciseId?: unknown; answer?: unknown } | null;
    if (
      !body ||
      typeof body.exerciseId !== "string" ||
      !/^[a-zA-Z0-9_-]{1,100}$/.test(body.exerciseId) ||
      typeof body.answer !== "string" ||
      body.answer.length > 500
    ) {
      return NextResponse.json({ error: "Invalid answer payload" }, { status: 400 });
    }

    const { env, user } = await getSessionUser(request);
    const row = await env.DB.prepare(
      `SELECT e.answer_json, e.explanation
       FROM learning_exercises e
       INNER JOIN learning_lessons l ON l.id = e.lesson_id
       WHERE e.id = ? AND e.lesson_id = ? AND l.published = 1
       LIMIT 1`
    ).bind(body.exerciseId, lessonId).first<{ answer_json: string; explanation: string }>();

    if (!row) {
      return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    let answerKey: { correct?: unknown; answer?: unknown };
    try {
      answerKey = JSON.parse(row.answer_json || "{}") as { correct?: unknown };
    } catch {
      return NextResponse.json({ error: "Exercise answer is unavailable" }, { status: 500 });
    }

    const normalize = (value: string) => value.trim().toLocaleLowerCase("en").replace(/\s+/g, " ");
    const correctAnswer = typeof answerKey.correct === "string"
      ? answerKey.correct
      : typeof answerKey.answer === "string"
        ? answerKey.answer
        : "";
    if (!correctAnswer) {
      return NextResponse.json({ error: "Exercise answer is unavailable" }, { status: 500 });
    }

    const correct = normalize(body.answer) === normalize(correctAnswer);
    let review;
    if (user) {
      const previousRow = await env.DB.prepare(
        "SELECT review_json FROM learning_exercise_progress WHERE user_id = ? AND exercise_id = ? LIMIT 1"
      ).bind(user.id, body.exerciseId).first<{ review_json: string | null }>();
      let previous: ReviewState = { intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };
      try {
        if (previousRow?.review_json) {
          const saved = JSON.parse(previousRow.review_json) as Partial<ReviewState>;
          previous = { ...previous, ...saved };
        }
      } catch { /* A malformed prior schedule starts a fresh schedule. */ }
      review = scheduleNextReview(previous, correct ? 4 : 1);
      const now = new Date().toISOString();
      await env.DB.prepare(
        `INSERT INTO learning_exercise_progress (user_id, lesson_id, exercise_id, answer_text, correct, explanation, review_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, exercise_id) DO UPDATE SET answer_text = excluded.answer_text, correct = excluded.correct, explanation = excluded.explanation, review_json = excluded.review_json, updated_at = excluded.updated_at`
      ).bind(user.id, lessonId, body.exerciseId, body.answer, correct ? 1 : 0, row.explanation, JSON.stringify(review), now).run();
      await env.DB.prepare(
        `INSERT INTO learning_lesson_progress (user_id, lesson_id, status, attempts, correct_answers, total_answers, started_at, updated_at)
         VALUES (?, ?, 'in_progress', 1, ?, 1, ?, ?)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET status = CASE WHEN learning_lesson_progress.status = 'completed' THEN 'completed' ELSE 'in_progress' END, attempts = learning_lesson_progress.attempts + 1, correct_answers = learning_lesson_progress.correct_answers + excluded.correct_answers, total_answers = learning_lesson_progress.total_answers + 1, updated_at = excluded.updated_at`
      ).bind(user.id, lessonId, correct ? 1 : 0, now, now).run();
    }

    return NextResponse.json(
      { correct, explanation: row.explanation, ...(review ? { review } : {}) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[api/learning/lesson-exercises] Failed to grade answer:", error);
    return NextResponse.json(
      { error: "Unable to grade answer" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

