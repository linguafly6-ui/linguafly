import { NextRequest, NextResponse } from "@/lib/db/client";
import { resolveCloudflareEnv } from "@/lib/db/client";
import a1LearningSections from "@/content/cursos/ingles-a1/aprender-sections.json";
import a2LearningSections from "@/content/cursos/ingles-a2/aprender-sections.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/learning/lessons?level=A1 or level=A2
 *
 * Public course outline. Deliberately excludes exercise answer keys and
 * learner-specific progress.
 */
export async function GET(request: NextRequest) {
  try {
    const { env } = await resolveCloudflareEnv();
    const level = (new URL(request.url).searchParams.get("level") || "A1")
      .trim()
      .toUpperCase()
      .slice(0, 8);

    const result = await env.DB.prepare(
      `SELECT
         c.id AS course_id,
         c.title AS course_title,
         c.level AS course_level,
         c.description AS course_description,
         l.id AS lesson_id,
         l.lesson_number,
         l.unit_number,
         l.title AS lesson_title,
         l.objective,
         l.estimated_minutes,
         l.content_json
       FROM learning_courses c
       INNER JOIN learning_lessons l ON l.course_id = c.id
       WHERE c.level = ? AND c.published = 1 AND l.published = 1
       ORDER BY l.lesson_number ASC`
    ).bind(level).all<{
      course_id: string;
      course_title: string;
      course_level: string;
      course_description: string;
      lesson_id: string;
      lesson_number: number;
      unit_number: number;
      lesson_title: string;
      objective: string;
      estimated_minutes: number;
      content_json: string;
    }>();

    const rows = result.results || [];
    const first = rows[0];

    return NextResponse.json(
      {
        course: first
          ? {
              id: first.course_id,
              title: first.course_title,
              level: first.course_level,
              description: first.course_description,
              lesson_count: rows.length,
            }
          : null,
        lessons: rows.map((row) => {
          let content: unknown = {};
          try {
            content = JSON.parse(row.content_json || "{}");
          } catch {
            content = {};
          }

          return {
            id: row.lesson_id,
            number: row.lesson_number,
            unit: row.unit_number,
            title: row.lesson_title,
            objective: row.objective,
            estimated_minutes: row.estimated_minutes,
            content: level === "A1"
              ? (a1LearningSections as Record<string, { objective: string; sections: unknown[] }>)[row.lesson_id] ?? content
              : level === "A2"
                ? (a2LearningSections as Record<string, { objective: string; sections: unknown[] }>)[row.lesson_id] ?? content
                : content,
          };
        }),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[api/learning/lessons] Failed to list lessons:", error);
    return NextResponse.json(
      { error: "Unable to load lessons" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
