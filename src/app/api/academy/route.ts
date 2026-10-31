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
  const rawUnit = params.get("unit");
  const unitNumber = rawUnit ? Number(rawUnit) : 0;

  try {
    const { env } = await resolveCloudflareEnv();
    const db = env.COURSE_DB;
    if (!db) throw new Error("COURSE_DB binding is not configured; refusing to query the default DB.");

    if (!rawLevel) {
      const result = await db.prepare(`
        SELECT c.id, c.cefr_level, c.title, c.description, c.status,
          COUNT(DISTINCT u.id) AS unit_count,
          COUNT(DISTINCT CASE WHEN e.id IS NOT NULL AND e.status = 'published' AND s.status = 'published' AND u.status = 'published' AND c.status = 'published' THEN u.id END) AS units_with_practice,
          COUNT(DISTINCT CASE WHEN e.status = 'published' AND s.status = 'published' AND u.status = 'published' AND c.status = 'published' THEN e.id END) AS exercise_count
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

    if (!rawUnit) {
      const result = await db.prepare(`
        SELECT u.id, u.unit_number, u.title, u.learning_objectives_json, u.status,
          COUNT(DISTINCT s.id) AS section_count,
          COUNT(DISTINCT CASE WHEN e.status = 'published' AND s.status = 'published' AND u.status = 'published' AND EXISTS (SELECT 1 FROM courses c WHERE c.id = u.course_id AND c.status = 'published') THEN e.id END) AS exercise_count
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
      SELECT s.id, s.section_type, s.position, s.title, s.status,
        COUNT(CASE WHEN e.status = 'published' THEN e.id END) AS exercise_count
      FROM sections s
      LEFT JOIN exercises e ON e.section_id = s.id
      WHERE s.unit_id = ? AND s.status = 'published' AND EXISTS (SELECT 1 FROM units u JOIN courses c ON c.id = u.course_id WHERE u.id = s.unit_id AND u.status = 'published' AND c.status = 'published')
      GROUP BY s.id
      ORDER BY s.position
    `).bind(unit.id as string).all();

    const exerciseResult = await db.prepare(`
      SELECT e.id, e.section_id, e.exercise_code, e.title, e.instructions, e.content_json, e.position
      FROM exercises e
      JOIN sections s ON s.id = e.section_id
      WHERE s.unit_id = ? AND s.status = 'published' AND e.status = 'published' AND EXISTS (SELECT 1 FROM units u JOIN courses c ON c.id = u.course_id WHERE u.id = s.unit_id AND u.status = 'published' AND c.status = 'published')
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

    const optionMap = new Map<string, Array<{ key: string; content: string }>>();
    for (const option of options) {
      const exerciseId = String(option.exercise_id);
      const current = optionMap.get(exerciseId) || [];
      current.push({ key: String(option.option_key), content: String(option.content) });
      optionMap.set(exerciseId, current);
    }

    const answerKeyResult = ids.length
      ? await db.prepare(
          `SELECT exercise_id, answer_config_json FROM exercise_answer_keys WHERE exercise_id IN (${ids.map(() => "?").join(",")})`
        ).bind(...ids).all()
      : { results: [] };
    const answerKeyMap = new Map<string, { correctOptionKeys?: string[] }>();
    for (const row of (answerKeyResult.results || []) as Array<Record<string, unknown>>) {
      answerKeyMap.set(String(row.exercise_id), parseJson(row.answer_config_json as string, {}));
    }

    // A cloze group is one learner-facing task, backed by the existing per-gap
    // records. Keep the underlying IDs intact so existing references/progress
    // are not rewritten. Incomplete groups remain hidden until editorially fixed.
    const clozeGroups = new Map<string, Array<Record<string, unknown>>>();
    const nonClozeExercises: Array<Record<string, unknown>> = [];
    for (const exercise of exercises) {
      const code = String(exercise.exercise_code || "");
      const match = /^(.*)-gap(\\d+)$/.exec(code);
      if (!match) {
        nonClozeExercises.push(exercise);
        continue;
      }
      const group = clozeGroups.get(match[1]) || [];
      group.push(exercise);
      clozeGroups.set(match[1], group);
    }

    const safeExercises: Array<Record<string, unknown>> = nonClozeExercises.map((exercise) => ({
      id: exercise.id,
      section_id: exercise.section_id,
      exercise_code: exercise.exercise_code,
      title: exercise.title,
      instructions: exercise.instructions,
      position: exercise.position,
      type: "multiple_choice",
      content: parseJson(exercise.content_json as string, {} as Record<string, unknown>),
      options: optionMap.get(String(exercise.id)) || [],
    }));

    const gapMarkerCount = (source: string, gapNumber: number): number => {
      const escaped = String(gapNumber);
      const patterns = [
        new RegExp(`\\\\(\\\\s*${escaped}\\\\s*\\\\)`, "g"),
        new RegExp(`\\\\[\\\\s*${escaped}\\\\s*\\\\]`, "g"),
        new RegExp(`\\\\[GAP\\\\s*${escaped}\\\\]`, "gi"),
      ];
      return patterns.reduce((count, pattern) => count + [...source.matchAll(pattern)].length, 0);
    };

    for (const [groupId, rows] of clozeGroups) {
      const ordered = rows.slice().sort((a, b) => Number(a.position) - Number(b.position));
      const gapNumbers = ordered.map((row) => Number(/-gap(\\d+)$/.exec(String(row.exercise_code))?.[1]));
      const expectedNumbers = Array.from({ length: ordered.length }, (_value, index) => index + 1);
      const firstContent = parseJson(ordered[0].content_json as string, {} as Record<string, unknown>);
      const passage = typeof firstContent.passage === "string" ? firstContent.passage : "";
      const gapOptions = ordered.map((row, index) => {
        const rowOptions = optionMap.get(String(row.id)) || [];
        const correctKeys = answerKeyMap.get(String(row.id))?.correctOptionKeys || [];
        const correctKey = correctKeys[0];
        const validKeys = new Set(rowOptions.map((option) => option.key));
        const validOptions = rowOptions.length >= 3 && rowOptions.length <= 4
          && rowOptions.every((option) => /^[A-D]$/.test(option.key)
            && option.content.trim().length > 0
            && !/^(?:o\\d+|option\\s*\\d+|placeholder)$/i.test(option.content.trim()))
          && validKeys.size === rowOptions.length;
        const markerCount = gapMarkerCount(passage, index + 1);
        const rowContent = parseJson(row.content_json as string, {} as Record<string, unknown>);
        const samePassage = rowContent.passage === passage;
        const validAnswer = typeof correctKey === "string" && validKeys.has(correctKey);
        return {
          id: String(index + 1),
          label: String(index + 1),
          options: rowOptions,
          isEditoriallyComplete: validOptions && validAnswer && samePassage && markerCount > 0,
        };
      });

      const consistentGroup = ordered.length >= 2
        && gapNumbers.every((number, index) => number === expectedNumbers[index])
        && ordered.every((row) => row.section_id === ordered[0].section_id
          && row.title === ordered[0].title
          && row.instructions === ordered[0].instructions);
      if (!consistentGroup || gapOptions.some((gap) => !gap.isEditoriallyComplete)) continue;

      const gaps = gapOptions.map(({ isEditoriallyComplete: _complete, ...gap }) => gap);
      const position = Math.min(...ordered.map((row) => Number(row.position)));
      const sectionId = String(ordered[0].section_id);
      safeExercises.push({
        id: groupId,
        section_id: sectionId,
        exercise_code: groupId,
        title: ordered[0].title,
        instructions: ordered[0].instructions,
        position,
        type: "multiple_choice_cloze",
        content: {
          prompt: ordered[0].instructions,
          passage,
          explanation_es: firstContent.explanation_es || null,
        },
        gaps,
      });
    }

    safeExercises.sort((a, b) => Number(a.position) - Number(b.position));
    const safeSections = ((sectionsResult.results || []) as Array<Record<string, unknown>>).map((section) => ({
      ...section,
      exercise_count: safeExercises.filter((exercise) => exercise.section_id === section.id).length,
    }));

    return NextResponse.json({
      course,
      unit: {
        ...unit,
        learning_objectives: parseJson(unit.learning_objectives_json as string, [] as string[]),
      },
      sections: safeSections,
      exercises: safeExercises,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/academy] Failed to load course data:", error);
    return NextResponse.json({ error: "No se pudo cargar el contenido del curso" }, { status: 500 });
  }
}
