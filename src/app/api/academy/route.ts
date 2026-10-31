import { NextRequest, NextResponse } from "next/server";
import { resolveCloudflareEnv } from "@/lib/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LEVELS = ["A2", "B1", "B2", "C1"] as const;
type Level = (typeof LEVELS)[number];

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams;
  const rawLevel = (params.get("level") || "").toUpperCase();
  const unitNumber = Number(params.get("unit") || 0);

  try {
    const { env } = await resolveCloudflareEnv();
    const db = env.COURSE_DB ?? env.DB;

    if (!rawLevel) {
      const result = await db.prepare(`
        SELECT c.id, c.cefr_level, c.title, c.description, c.status,
          COUNT(DISTINCT u.id) AS unit_count,
          COUNT(DISTINCT CASE WHEN e.id IS NOT NULL THEN u.id END) AS units_with_practice,
          COUNT(DISTINCT e.id) AS exercise_count
        FROM courses c
        LEFT JOIN units u ON u.course_id = c.id
        LEFT JOIN sections s ON s.unit_id = u.id
        LEFT JOIN exercises e ON e.section_id = s.id
        WHERE c.cefr_level IN ('A2','B1','B2','C1')
        GROUP BY c.id
        ORDER BY c.sort_order
      `).all();
      return NextResponse.json({ courses: result.results || [] }, {
        headers: { "Cache-Control": "public, max-age=30, s-maxage=60" },
      });
    }

    if (!LEVELS.includes(rawLevel as Level)) {
      return NextResponse.json({ error: "Nivel no disponible" }, { status: 404 });
    }

    const level = rawLevel as Level;
    const course = await db.prepare(
      "SELECT id, cefr_level, title, description FROM courses WHERE cefr_level = ? LIMIT 1"
    ).bind(level).first();

    if (!course) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });

    if (!unitNumber) {
      const result = await db.prepare(`
        SELECT u.id, u.unit_number, u.title, u.learning_objectives_json, u.status,
          COUNT(DISTINCT s.id) AS section_count,
          COUNT(DISTINCT e.id) AS exercise_count
        FROM units u
        LEFT JOIN sections s ON s.unit_id = u.id
        LEFT JOIN exercises e ON e.section_id = s.id
        WHERE u.course_id = ?
        GROUP BY u.id
        ORDER BY u.unit_number
      `).bind((course as { id: string }).id).all();
      const units = (result.results || []).map((row: Record<string, unknown>) => ({
        ...row,
        learning_objectives: parseJson(row.learning_objectives_json as string, [] as string[]),
        has_practice: Number(row.exercise_count || 0) > 0,
      }));
      return NextResponse.json({ course, units }, {
        headers: { "Cache-Control": "public, max-age=30, s-maxage=60" },
      });
    }

    if (!Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > 100) {
      return NextResponse.json({ error: "Unidad no válida" }, { status: 400 });
    }

    const unit = await db.prepare(
      "SELECT id, unit_number, title, learning_objectives_json, status FROM units WHERE course_id = ? AND unit_number = ? LIMIT 1"
    ).bind((course as { id: string }).id, unitNumber).first() as Record<string, unknown> | null;

    if (!unit) return NextResponse.json({ error: "Unidad no encontrada" }, { status: 404 });

    const sectionsResult = await db.prepare(`
      SELECT s.id, s.section_type, s.position, s.title, s.instructions, s.status,
        COUNT(e.id) AS exercise_count
      FROM sections s
      LEFT JOIN exercises e ON e.section_id = s.id
      WHERE s.unit_id = ?
      GROUP BY s.id
      ORDER BY s.position
    `).bind(unit.id as string).all();

    const exerciseResult = await db.prepare(`
      SELECT e.id, e.section_id, e.exercise_code, e.title, e.instructions, e.content_json, e.position
      FROM exercises e
      JOIN sections s ON s.id = e.section_id
      WHERE s.unit_id = ?
      ORDER BY s.position, e.position
    `).bind(unit.id as string).all();

    const exercises = (exerciseResult.results || []) as Array<Record<string, unknown>>;
    const ids = exercises.map((exercise) => String(exercise.id));
    let options: Array<Record<string, unknown>> = [];
    if (ids.length) {
      const placeholders = ids.map(() => "?").join(",");
      const optionResult = await db.prepare(
        `SELECT exercise_id, option_key, content, position FROM exercise_options WHERE exercise_id IN (${placeholders}) ORDER BY position`
      ).bind(...ids).all();
      options = (optionResult.results || []) as Array<Record<string, unknown>>;
    }

    const safeExercises = exercises.map((exercise) => ({
      id: exercise.id,
      section_id: exercise.section_id,
      exercise_code: exercise.exercise_code,
      title: exercise.title,
      instructions: exercise.instructions,
      position: exercise.position,
      content: parseJson(exercise.content_json as string, {} as Record<string, unknown>),
      options: options
        .filter((option) => option.exercise_id === exercise.id)
        .map((option) => ({ key: option.option_key, content: option.content })),
    }));

    return NextResponse.json({
      course,
      unit: {
        ...unit,
        learning_objectives: parseJson(unit.learning_objectives_json as string, [] as string[]),
      },
      sections: sectionsResult.results || [],
      exercises: safeExercises,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/academy] Failed to load course data:", error);
    return NextResponse.json({ error: "No se pudo cargar el contenido del curso" }, { status: 500 });
  }
}
