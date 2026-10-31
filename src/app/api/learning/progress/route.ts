import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Read only the authenticated learner's A1 completion and exercise state. */
export async function GET(request: NextRequest) {
  try {
    const { env, user } = await getSessionUser(request);
    if (!user) return NextResponse.json({ authenticated: false, completed: [], exercises: {}, writing: {} }, { headers: { "Cache-Control": "no-store" } });

    const rows = await env.COURSE_DB!.prepare(
      `SELECT lesson_id, status FROM learning_lesson_progress WHERE user_id = ? AND status = 'completed'`
    ).bind(user.id).all<{ lesson_id: string; status: string }>();
    const exerciseRows = await env.COURSE_DB!.prepare(
      `SELECT lesson_id, exercise_id, answer_text, correct, explanation, review_json
       FROM learning_exercise_progress WHERE user_id = ?`
    ).bind(user.id).all<{ lesson_id: string; exercise_id: string; answer_text: string; correct: number | null; explanation: string; review_json: string | null }>();
    const writingRows = await env.COURSE_DB!.prepare(
      "SELECT lesson_id, draft FROM learning_writing_drafts WHERE user_id = ?"
    ).bind(user.id).all<{ lesson_id: string; draft: string }>();

    const exercises: Record<string, Record<string, unknown>> = {};
    for (const row of exerciseRows.results ?? []) {
      let review: unknown;
      try { review = row.review_json ? JSON.parse(row.review_json) : undefined; } catch { review = undefined; }
      (exercises[row.lesson_id] ??= {})[row.exercise_id] = {
        answer: row.answer_text,
        ...(row.correct === null ? {} : { feedback: { correct: row.correct === 1, explanation: row.explanation } }),
        ...(review ? { review } : {}),
      };
    }
    const writing = Object.fromEntries((writingRows.results ?? []).map((row) => [row.lesson_id, row.draft]));
    return NextResponse.json({ authenticated: true, completed: (rows.results ?? []).map((row) => row.lesson_id), exercises, writing }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/learning/progress] Failed to load learner progress:", error);
    return NextResponse.json({ error: "Unable to load learner progress" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

/** Store a selected answer or explicit lesson completion for the verified session. */
export async function POST(request: NextRequest) {
  try {
    const { env, user } = await getSessionUser(request);
    if (!user) return NextResponse.json({ authenticated: false }, { status: 401, headers: { "Cache-Control": "no-store" } });
    const body = await request.json().catch(() => null) as { action?: unknown; lessonId?: unknown; exerciseId?: unknown; answer?: unknown; draft?: unknown } | null;
    if (!body || typeof body.lessonId !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(body.lessonId) || !["answer", "complete", "writing"].includes(String(body.action))) {
      return NextResponse.json({ error: "Invalid progress payload" }, { status: 400 });
    }
    const lesson = await env.COURSE_DB!.prepare("SELECT id FROM learning_lessons WHERE id = ? AND published = 1 LIMIT 1").bind(body.lessonId).first<{ id: string }>();
    if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    const now = new Date().toISOString();
    if (body.action === "writing") {
      if (typeof body.draft !== "string" || body.draft.length > 5000) {
        return NextResponse.json({ error: "Invalid writing draft" }, { status: 400 });
      }
      await env.COURSE_DB!.prepare(
        `INSERT INTO learning_writing_drafts (user_id, lesson_id, draft, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET draft = excluded.draft, updated_at = excluded.updated_at`
      ).bind(user.id, body.lessonId, body.draft, now).run();
      return NextResponse.json({ authenticated: true, saved: true }, { headers: { "Cache-Control": "no-store" } });
    }
    if (body.action === "complete") {
      await env.COURSE_DB!.prepare(
        `INSERT INTO learning_lesson_progress (user_id, lesson_id, status, started_at, completed_at, updated_at)
         VALUES (?, ?, 'completed', ?, ?, ?)
         ON CONFLICT(user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = COALESCE(learning_lesson_progress.completed_at, excluded.completed_at), updated_at = excluded.updated_at`
      ).bind(user.id, body.lessonId, now, now, now).run();
      return NextResponse.json({ authenticated: true, completed: true }, { headers: { "Cache-Control": "no-store" } });
    }
    if (typeof body.exerciseId !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(body.exerciseId) || typeof body.answer !== "string" || body.answer.length > 500) {
      return NextResponse.json({ error: "Invalid answer payload" }, { status: 400 });
    }
    const exercise = await env.COURSE_DB!.prepare("SELECT id, options_json, exercise_type FROM learning_exercises WHERE id = ? AND lesson_id = ? LIMIT 1").bind(body.exerciseId, body.lessonId).first<{ id: string; options_json: string; exercise_type: string }>();
    if (!exercise) return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    let options: unknown;
    try { options = JSON.parse(exercise.options_json || "[]"); } catch { options = []; }
    if (!Array.isArray(options)) options = [];
    if (exercise.exercise_type === "multiple_choice" && !options.includes(body.answer)) return NextResponse.json({ error: "Answer is not an available option" }, { status: 400 });
    if (exercise.exercise_type === "sentence_building") {
      let words: unknown;
      try { words = JSON.parse(body.answer); } catch { words = null; }
      if (!Array.isArray(words) || words.length > 40 || !words.every((word) => typeof word === "string" && options.includes(word))) {
        return NextResponse.json({ error: "Answer is not a valid word order" }, { status: 400 });
      }
    }
    await env.COURSE_DB!.prepare(
      `INSERT INTO learning_exercise_progress (user_id, lesson_id, exercise_id, answer_text, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(user_id, exercise_id) DO UPDATE SET answer_text = excluded.answer_text, updated_at = excluded.updated_at`
    ).bind(user.id, body.lessonId, body.exerciseId, body.answer, now).run();
    return NextResponse.json({ authenticated: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/learning/progress] Failed to save learner progress:", error);
    return NextResponse.json({ error: "Unable to save learner progress" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}

