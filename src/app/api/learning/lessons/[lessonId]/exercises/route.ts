import { NextRequest, NextResponse } from "next/server";
import { resolveCloudflareEnv } from "@/lib/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/learning/lessons/:lessonId/exercises
 *
 * Returns learner-facing exercise prompts only. Correct answers stay on the
 * server and must be evaluated by an authenticated submission endpoint.
 */
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
    ).bind(lessonId).all<{
      id: string;
      exercise_number: number;
      exercise_type: string;
      prompt: string;
      options_json: string;
    }>();

    const exercises = (result.results || []).map((row) => {
      let options: unknown = [];
      try {
        options = JSON.parse(row.options_json || "[]");
        if (!Array.isArray(options)) options = [];
      } catch {
        options = [];
      }

      return {
        id: row.id,
        number: row.exercise_number,
        type: row.exercise_type,
        prompt: row.prompt,
        options,
      };
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
