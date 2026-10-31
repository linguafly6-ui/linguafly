import { NextResponse } from "next/server";
import { getLearningDatabase } from "@/lib/learning/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/learning/v2/courses
 *
 * Lists published courses from the dedicated learning database only.
 * This endpoint intentionally returns no exercises, answer keys, or learner data.
 */
export async function GET() {
  try {
    const db = await getLearningDatabase();
    const { results } = await db
      .prepare(
        `SELECT id, language_code, cefr_level, title, description, sort_order
         FROM courses
         WHERE status = 'published'
         ORDER BY language_code ASC, sort_order ASC, cefr_level ASC`
      )
      .all();

    return NextResponse.json(
      { courses: results ?? [] },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[learning/v2/courses] Failed to list courses:", error);
    return NextResponse.json(
      { error: "Learning catalogue is temporarily unavailable." },
      { status: 503 }
    );
  }
}
