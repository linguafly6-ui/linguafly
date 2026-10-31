import { NextRequest, NextResponse } from "next/server";
import { getLearningDatabase } from "@/lib/learning/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const LANGUAGE_CODE = /^[a-z]{2,3}(?:-[A-Z]{2})?$/;

export async function GET(request: NextRequest) {
  const level = (request.nextUrl.searchParams.get("level") ?? "").toUpperCase();
  const language = request.nextUrl.searchParams.get("language") ?? "en";

  if (!LEVELS.has(level) || !LANGUAGE_CODE.test(language)) {
    return NextResponse.json(
      { error: "Provide a valid level (A1–C2) and language code." },
      { status: 400 }
    );
  }

  try {
    const db = await getLearningDatabase();
    const course = await db.prepare(
      `SELECT id, title, language_code, cefr_level
       FROM courses
       WHERE language_code = ? AND cefr_level = ? AND status = 'published'
       LIMIT 1`
    ).bind(language, level).first<{
      id: string; title: string; language_code: string; cefr_level: string;
    }>();

    if (!course) {
      return NextResponse.json({ course: null, units: [] });
    }

    const { results } = await db.prepare(
      `SELECT
         u.id, u.unit_number, u.title, u.learning_objectives_json,
         COUNT(DISTINCT s.id) AS published_sections,
         COUNT(DISTINCT e.id) AS published_exercises
       FROM units u
       LEFT JOIN sections s
         ON s.unit_id = u.id AND s.status = 'published'
       LEFT JOIN exercises e
         ON e.section_id = s.id AND e.status = 'published'
       WHERE u.course_id = ? AND u.status = 'published'
       GROUP BY u.id
       ORDER BY u.unit_number ASC`
    ).bind(course.id).all();

    const units = (results ?? []).map((row) => {
      const item = row as Record<string, unknown>;
      let objectives: unknown = [];
      try {
        objectives = JSON.parse(String(item.learning_objectives_json ?? "[]"));
      } catch {
        objectives = [];
      }
      return {
        id: item.id,
        number: item.unit_number,
        title: item.title,
        learningObjectives: objectives,
        publishedSections: Number(item.published_sections ?? 0),
        publishedExercises: Number(item.published_exercises ?? 0),
      };
    });

    return NextResponse.json(
      { course, units },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (error) {
    console.error("[learning/v2/units] Failed to list units:", error);
    return NextResponse.json(
      { error: "Learning units are temporarily unavailable." },
      { status: 503 }
    );
  }
}
