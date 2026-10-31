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


type Lesson = {
  id: string;
  number: number;
  unit: number;
  title: string;
  objective: string;
  estimated_minutes: number;
  content?: { sections?: unknown[]; objective?: string; reviewEnabled?: boolean };
};
type CourseResponse = {
  course: { id: string; title: string; level: string; description: string; lesson_count: number } | null;
  lessons: Lesson[];
};

const ADVANCED_LEVELS = ["B1", "B2", "C1", "C2"] as const;

function buildStaticAdvancedLessons(level: (typeof ADVANCED_LEVELS)[number]): CourseResponse {
  const levelKey = level.toLowerCase();
  const lessons: Lesson[] = [];
  for (let unitNumber = 1; unitNumber <= 60; unitNumber += 1) {
    const unit = getLegacyAdvancedUnit(levelKey, unitNumber);
    if (!unit) continue;
    const sectionTypes = ["grammar", "vocabulary", "listening", "reading"] as const;
    const titles: Record<(typeof sectionTypes)[number], string> = {
      grammar: "Gramática",
      vocabulary: "Vocabulario",
      listening: "Comprensión auditiva",
      reading: "Comprensión lectora",
    };
    const sections = sectionTypes.map((type) => {
      const items = unit.blocks.flatMap((block) => block.content
        .filter((item) => getLegacyAdvancedSection(item, block.title) === type)
        .map((item) => ({ item, blockTitle: block.title })));
      const firstItem = items[0]?.item;
      return {
        type,
        title: titles[type],
        body: items.map(({ item, blockTitle }) =>
          [blockTitle, item.prompt_es, item.stimulus_en, item.question_en, item.main_text, item.transcript]
            .filter(Boolean).join(" · ")
        ).join("\\n") || (type === "listening" ? "Comprensión auditiva" : ""),
        example: type === "grammar" ? firstItem?.stimulus_en ?? "" : "",
        audioText: type === "listening"
          ? (typeof firstItem?.transcript === "string" ? firstItem.transcript : firstItem?.stimulus_en ?? "")
          : undefined,
        transcript: type === "listening" && typeof firstItem?.transcript === "string"
          ? firstItem.transcript
          : undefined,
      };
    }).filter((section) => section.body);
    const objective = unit.learning_outcomes?.join(" · ") || `Practicar inglés de nivel ${level}.`;
    lessons.push({
      id: `${levelKey}-${String(unitNumber).padStart(2, "0")}`,
      number: unitNumber,
      unit: unitNumber,
      title: unit.course.unit_title,
      objective,
      estimated_minutes: unit.course.total_duration_minutes ?? 30,
      content: { objective, sections, reviewEnabled: true },
    });
  }
  const titles: Record<(typeof ADVANCED_LEVELS)[number], string> = {
    B1: "English B1: Independent User",
    B2: "English B2: Upper Intermediate",
    C1: "English C1: Advanced",
    C2: "English C2: Proficiency",
  };
  return {
    course: {
      id: `english-${levelKey}`,
      title: titles[level],
      level,
      description: `Curso ${level} con unidades completas y práctica por destreza.`,
      lesson_count: lessons.length,
    },
    lessons,
  };
}

async function buildB1D1Lessons(): Promise<CourseResponse> {
  const { env } = await resolveCloudflareEnv();
  if (!env.COURSE_DB) throw new Error("COURSE_DB binding is not configured.");
  const result = await env.COURSE_DB.prepare(
    `SELECT unit_number, unit_id, title, content_json
     FROM learning_course_json_units
     WHERE course_key = 'ingles-b1' AND level = 'B1'
     ORDER BY unit_number ASC`
  ).all<{ unit_number: number; unit_id: string; title: string; content_json: string }>();

  const sectionTypes = ["grammar", "vocabulary", "listening", "reading"] as const;
  const titles: Record<(typeof sectionTypes)[number], string> = {
    grammar: "Gramática",
    vocabulary: "Vocabulario",
    listening: "Comprensión auditiva",
    reading: "Comprensión lectora",
  };
  const lessons: Lesson[] = (result.results ?? []).map((row) => {
    const unit = JSON.parse(row.content_json) as {
      course?: { unit_title?: string; total_duration_minutes?: number };
      learning_outcomes?: string[];
      blocks?: { title?: string; content?: any[] }[];
    };
    const blocks = unit.blocks ?? [];
    const sections = sectionTypes.map((type) => {
      const items = blocks.flatMap((block) => (block.content ?? [])
        .filter((item) => getLegacyAdvancedSection(item, block.title ?? "") === type)
        .map((item) => ({ item, blockTitle: block.title ?? "" })));
      const firstItem = items[0]?.item;
      const passage = items.map(({ item }) => item.transcript || item.main_text)
        .find((value) => typeof value === "string" && value.trim()) ?? "";
      return {
        type,
        title: titles[type],
        body: items.map(({ item, blockTitle }) =>
          [blockTitle, item.prompt_es, item.stimulus_en, item.question_en, item.main_text, item.transcript]
            .filter(Boolean).join(" · ")
        ).join("\\n") || (type === "listening" ? "Comprensión auditiva" : ""),
        example: type === "grammar" ? firstItem?.stimulus_en ?? "" : "",
        audioText: type === "listening" ? passage : undefined,
        transcript: type === "listening" ? passage : undefined,
      };
    }).filter((section) => section.body);
    const objective = unit.learning_outcomes?.join(" · ") || `Practicar inglés de nivel B1.`;
    return {
      id: `b1-${String(row.unit_number).padStart(2, "0")}`,
      number: row.unit_number,
      unit: row.unit_number,
      title: unit.course?.unit_title || row.title,
      objective,
      estimated_minutes: unit.course?.total_duration_minutes ?? 30,
      content: { objective, sections, reviewEnabled: true },
    };
  });

  return {
    course: {
      id: "course-en-b1",
      title: "English B1: Independent User",
      level: "B1",
      description: "Curso B1 con unidades y práctica por destreza.",
      lesson_count: lessons.length,
    },
    lessons,
  };
}

export async function GET(request: NextRequest) {
  const level = (new URL(request.url).searchParams.get("level") || "A1")
    .trim()
    .toUpperCase()
    .slice(0, 8);

  if (level === "B1") {
    try {
      const data = await buildB1D1Lessons();
      return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      console.error("[api/learning/lessons] B1 D1 catalogue read failed:", error);
      return NextResponse.json({ error: "No se pudo cargar el catálogo B1 desde COURSE_DB." }, { status: 500 });
    }
  }

  // Other advanced levels retain their existing source until their own migration.
  if ((ADVANCED_LEVELS as readonly string[]).includes(level)) {
    return NextResponse.json(buildStaticAdvancedLessons(level as (typeof ADVANCED_LEVELS)[number]), {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600" },
    });
  }

  try {

    const { env } = await resolveCloudflareEnv();
    const courseDb = env.COURSE_DB;
    if (!courseDb) throw new Error("COURSE_DB binding is not configured; refusing to query blog.");
    const result = await courseDb.prepare(
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
                  body: items.map(({ item, blockTitle }) => [blockTitle, item.prompt_es, item.stimulus_en, item.question_en, item.main_text, item.transcript].filter(Boolean).join(" · ")).join("\\n") || (type === "listening" ? "Comprensión auditiva" : ""),
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
