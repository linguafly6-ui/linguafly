import { NextRequest, NextResponse } from "next/server";
import { getLearningDatabase } from "@/lib/learning/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SECTION_TYPES = new Set(["grammar", "listening", "vocabulary", "reading"]);

function parseJson(value: unknown, fallback: unknown) {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// Defence in depth: editorial prompt data must never expose answer-key fields.
const PRIVATE_CONTENT_KEYS = new Set([
  "answer", "answers", "answerkey", "answer_key", "correctanswer",
  "correct_answer", "correctanswers", "correct_answers", "solution",
  "solutions", "acceptedanswers", "acceptableanswers", "is_correct",
  "iscorrect", "grading", "gradingconfig", "grading_config",
]);

function publicContent(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(publicContent);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !PRIVATE_CONTENT_KEYS.has(key.toLowerCase().replace(/[^a-z0-9]/g, "")))
      .map(([key, item]) => [key, publicContent(item)])
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ unitId: string }> }
) {
  const { unitId } = await context.params;
  const sectionType = request.nextUrl.searchParams.get("section");

  if (!unitId || unitId.length > 128) {
    return NextResponse.json({ error: "Invalid unit identifier." }, { status: 400 });
  }
  if (sectionType && !SECTION_TYPES.has(sectionType)) {
    return NextResponse.json({ error: "Invalid section type." }, { status: 400 });
  }

  try {
    const db = await getLearningDatabase();
    const unit = await db.prepare(
      `SELECT u.id, u.unit_number, u.title, c.language_code, c.cefr_level
       FROM units u
       INNER JOIN courses c ON c.id = u.course_id
       WHERE u.id = ? AND u.status = 'published' AND c.status = 'published'
       LIMIT 1`
    ).bind(unitId).first<{
      id: string; unit_number: number; title: string;
      language_code: string; cefr_level: string;
    }>();

    if (!unit) {
      return NextResponse.json({ error: "Unit not found." }, { status: 404 });
    }

    const sectionQuery = sectionType
      ? db.prepare(
          `SELECT id, section_type, position, title, instructions
           FROM sections
           WHERE unit_id = ? AND status = 'published' AND section_type = ?
           ORDER BY position ASC`
        ).bind(unitId, sectionType)
      : db.prepare(
          `SELECT id, section_type, position, title, instructions
           FROM sections
           WHERE unit_id = ? AND status = 'published'
           ORDER BY position ASC`
        ).bind(unitId);

    const { results: sectionRows } = await sectionQuery.all();
    const sections = [];

    for (const rawSection of sectionRows ?? []) {
      const section = rawSection as {
        id: string; section_type: string; position: number;
        title: string; instructions: string | null;
      };

      const { results: exerciseRows } = await db.prepare(
        `SELECT
           e.id, e.exercise_code, e.title, e.instructions, e.content_json,
           e.position, e.points, t.code AS exercise_type, t.name AS exercise_type_name,
           t.interaction_mode, t.response_format
         FROM exercises e
         INNER JOIN exercise_type_registry t ON t.id = e.exercise_type_id
         WHERE e.section_id = ? AND e.status = 'published' AND t.status = 'active'
         ORDER BY e.position ASC`
      ).bind(section.id).all();

      const exercises = [];
      for (const rawExercise of exerciseRows ?? []) {
        const exercise = rawExercise as Record<string, unknown> & { id: string };
        const { results: optionRows } = await db.prepare(
          `SELECT option_key, content, content_json, position
           FROM exercise_options
           WHERE exercise_id = ?
           ORDER BY position ASC`
        ).bind(exercise.id).all();

        exercises.push({
          id: exercise.id,
          code: exercise.exercise_code,
          title: exercise.title,
          instructions: exercise.instructions,
          content: publicContent(parseJson(exercise.content_json, {})),
          position: exercise.position,
          points: exercise.points,
          type: {
            code: exercise.exercise_type,
            name: exercise.exercise_type_name,
            interactionMode: exercise.interaction_mode,
            responseFormat: exercise.response_format,
          },
          options: (optionRows ?? []).map((rawOption) => {
            const option = rawOption as Record<string, unknown>;
            return {
              key: option.option_key,
              content: option.content,
              data: publicContent(parseJson(option.content_json, {})),
              position: option.position,
            };
          }),
        });
      }

      sections.push({
        id: section.id,
        type: section.section_type,
        position: section.position,
        title: section.title,
        instructions: section.instructions,
        exercises,
      });
    }

    return NextResponse.json(
      { unit, sections },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (error) {
    console.error("[learning/v2/unit-exercises] Failed to load exercises:", error);
    return NextResponse.json(
      { error: "Unit exercises are temporarily unavailable." },
      { status: 503 }
    );
  }
}
