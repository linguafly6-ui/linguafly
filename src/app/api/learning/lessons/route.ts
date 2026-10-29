import { NextRequest, NextResponse } from "next/server";
import { resolveCloudflareEnv } from "@/lib/db/client";
import a1LearningSections from "@/content/cursos/ingles-a1/aprender-sections.json";
import a2LearningSections from "@/content/cursos/ingles-a2/aprender-sections.json";
import { getLegacyAdvancedUnit, getLegacyAdvancedSection } from "@/lib/learning/legacy-advanced-units";
import { a2Units } from "@/lib/learning/a2-units";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/learning/lessons?level=A1 or level=A2
 *
 * Public course outline. Deliberately excludes exercise answer keys and
 * learner-specific progress.
 */
function normalizeCourseSections(value: unknown): unknown {
  if (!value || typeof value !== "object" || !("sections" in value)) return value;
  const content = value as { sections: unknown[]; [key: string]: unknown };
  const sections = content.sections.filter((section) => {
    if (!section || typeof section !== "object") return true;
    const item = section as { type?: unknown; title?: unknown };
    const title = String(item.title ?? "").toLowerCase();
    return item.type !== "production" && !title.includes("producción") && !title.includes("production");
  });
  if (!sections.some((section) => section && typeof section === "object" && (section as { type?: unknown }).type === "listening")) {
    sections.push({ type: "listening", title: "Comprensión auditiva", body: "Comprensión auditiva" });
  }
  return { ...content, sections };
}

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

    // Keep A2 usable when its database publication rows are missing.
    if (level === "A2" && rows.length === 0) {
      const lessons = a2Units.map((unit) => ({
        id: `a2-${String(unit.n).padStart(2, "0")}`,
        number: unit.n,
        unit: unit.n,
        title: unit.title,
        objective: unit.objective,
        estimated_minutes: 30,
        content: {
          objective: unit.objective,
          sections: [
            { type: "grammar", title: "Gramática", body: unit.grammar },
            { type: "vocabulary", title: "Vocabulario", body: unit.vocabulary },
            { type: "listening", title: "Comprensión auditiva", body: unit.passage },
            { type: "reading", title: "Comprensión lectora", body: unit.passage },
          ],
          reviewEnabled: true,
        },
      }));
      return NextResponse.json({
        course: {
          id: "ingles-a2", title: "Inglés elemental", level: "A2",
          description: "Curso de inglés A2 con práctica de gramática, vocabulario, escucha y lectura.",
          lesson_count: lessons.length,
        },
        lessons,
      }, { headers: { "Cache-Control": "no-store" } });
    }

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
            ? ["grammar", "vocabulary", "listening", "reading"].map((type) => {
                const items = unit.blocks.flatMap((block) => block.content
                  .filter((item) => getLegacyAdvancedSection(item, block.title) === type)
                  .map((item) => ({ item, blockTitle: block.title })));
                const titles: Record<string, string> = { grammar: "Gramática", vocabulary: "Vocabulario", listening: "Comprensión auditiva", reading: "Comprensión lectora", production: "Producción" };
                const firstItem = items[0]?.item;
                return {
                  type, title: titles[type],
                  body: items.map(({ item, blockTitle }) => [blockTitle, item.prompt_es, item.stimulus_en, item.question_en].filter(Boolean).join(" · ")).join("\\n") || (type === "listening" ? "Comprensión auditiva" : ""),
                  example: type === "grammar" ? firstItem?.stimulus_en ?? "" : "",
                  audioText: type === "listening" ? (typeof firstItem?.transcript === "string" ? firstItem.transcript : firstItem?.stimulus_en ?? "") : undefined,
                  transcript: type === "listening" && typeof firstItem?.transcript === "string" ? firstItem.transcript : undefined,
                };
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
                ? normalizeCourseSections((a1LearningSections as Record<string, { objective: string; sections: unknown[] }>)[row.lesson_id] ?? content)
                : level === "A2"
                  ? normalizeCourseSections((a2LearningSections as Record<string, { objective: string; sections: unknown[] }>)[row.lesson_id] ?? content)
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
