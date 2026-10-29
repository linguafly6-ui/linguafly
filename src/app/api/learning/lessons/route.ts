import { NextRequest, NextResponse } from "next/server";
import { resolveCloudflareEnv } from "@/lib/db/client";
import a1LearningSections from "@/content/cursos/ingles-a1/aprender-sections.json";
import a2LearningSections from "@/content/cursos/ingles-a2/aprender-sections.json";
import { getLegacyAdvancedUnit, getLegacyAdvancedSection } from "@/lib/learning/legacy-advanced-units";

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

          const advancedLevel = ["B1", "B2", "C1", "C2"].includes(level);
          const unit = advancedLevel ? getLegacyAdvancedUnit(level.toLowerCase(), row.unit_number) : null;
          const advancedSections = unit
            ? ["grammar", "vocabulary", "listening", "reading", "production"].map((type) => {
                const blocks = unit.blocks.filter((block) =>
                  block.content.some((item) => getLegacyAdvancedSection(item, block.title) === type)
                );
                const titles: Record<string, string> = { grammar: "Gramática", vocabulary: "Vocabulario", listening: "Comprensión auditiva", reading: "Comprensión lectora", production: "Producción" };
                const body = type === "grammar"
                  ? ["Teoría para tener en cuenta antes de practicar", ...blocks.map((block) => {
                      const explanations = [...new Set(block.content
                        .filter((item) => getLegacyAdvancedSection(item, block.title) === type)
                        .map((item) => item.explanation?.trim())
                        .filter((explanation): explanation is string => Boolean(explanation)))]
                        .slice(0, 3);
                      return [block.title, ...explanations.map((explanation) => "• " + explanation)].join("\n");
                    })].join("\n\n")
                  : blocks.map((block) => block.title).join("\n");
                const example = type === "grammar"
                  ? blocks.flatMap((block) => block.content
                      .filter((item) => getLegacyAdvancedSection(item, block.title) === type)
                      .map((item) => item.stimulus_en?.split("\n")[0]?.trim())
                      .filter((value): value is string => Boolean(value)))[0] ?? ""
                  : "";
                return { type, title: titles[type], body, example };
              }).filter((section) => section.body)
            : null;
          return {
            id: row.lesson_id, number: row.lesson_number, unit: row.unit_number,
            title: unit?.course?.unit_title || row.lesson_title,
            objective: unit?.learning_outcomes?.join(" · ") || row.objective,
            estimated_minutes: row.estimated_minutes,
            content: advancedSections
              ? { objective: unit?.learning_outcomes?.join(" · ") || row.objective, sections: advancedSections, reviewEnabled: true }
              : level === "A1"
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
