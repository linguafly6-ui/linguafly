import { NextRequest, NextResponse } from "next/server";
import { resolveCloudflareEnv } from "@/lib/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnswerConfig = { correctOptionKeys?: string[] };

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

export async function POST(request: NextRequest) {
  let body: { exerciseId?: unknown; optionKey?: unknown; gapAnswers?: unknown };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  const exerciseId = typeof body.exerciseId === "string" ? body.exerciseId.trim() : "";
  if (!exerciseId || exerciseId.length > 160 || !/^[a-zA-Z0-9_-]+$/.test(exerciseId)) {
    return NextResponse.json({ error: "Respuesta no válida" }, { status: 400 });
  }

  try {
    const { env } = await resolveCloudflareEnv();
    const db = env.COURSE_DB;
    if (!db) throw new Error("COURSE_DB binding is not configured; refusing to query the default DB.");

    // Multi-gap clozes use a logical group ID and keep the original per-gap
    // exercise rows/answer keys in D1. No learner-progress rows are rewritten.
    if (body.gapAnswers !== undefined) {
      if (!/^[a-zA-Z0-9_-]+$/.test(exerciseId) || !body.gapAnswers
        || typeof body.gapAnswers !== "object" || Array.isArray(body.gapAnswers)) {
        return NextResponse.json({ error: "Respuestas de huecos no válidas" }, { status: 400 });
      }

      const submitted = body.gapAnswers as Record<string, unknown>;
      const entries = Object.entries(submitted);
      if (entries.length < 2 || entries.length > 20
        || entries.some(([gapId, key]) => !/^\d{1,2}$/.test(gapId)
          || typeof key !== "string" || !/^[A-D]$/.test(key))) {
        return NextResponse.json({ error: "Respuestas de huecos no válidas" }, { status: 400 });
      }

      const rowsResult = await db.prepare(
        `SELECT e.id, e.exercise_code, e.content_json,
          k.answer_config_json, k.correct_feedback, k.incorrect_feedback
         FROM exercises e
         JOIN exercise_answer_keys k ON k.exercise_id = e.id
         JOIN sections s ON s.id = e.section_id
         JOIN units u ON u.id = s.unit_id
         JOIN courses c ON c.id = u.course_id
         WHERE e.exercise_code LIKE ?
           AND e.status = 'published' AND s.status = 'published'
           AND u.status = 'published' AND c.status = 'published'
           AND c.cefr_level = 'B1'
         ORDER BY e.position`
      ).bind(`${exerciseId}-gap%`).all();

      const rows = (rowsResult.results || []) as Array<Record<string, unknown>>;
      if (rows.length !== entries.length || rows.length < 2) {
        return NextResponse.json({ error: "Actividad de huecos incompleta o no disponible" }, { status: 404 });
      }

      const sortedRows = rows.map((row) => ({
        ...row,
        gapNumber: Number(/-gap(\d+)$/.exec(String(row.exercise_code))?.[1] || 0),
      })).sort((a, b) => a.gapNumber - b.gapNumber);

      const expectedGapNumbers = Array.from({ length: sortedRows.length }, (_value, index) => index + 1);
      if (!sortedRows.every((row, index) => row.gapNumber === expectedGapNumbers[index])) {
        return NextResponse.json({ error: "La actividad no tiene todos sus huecos" }, { status: 409 });
      }

      const gapIds = sortedRows.map((row) => String(row.gapNumber));
      if (entries.some(([gapId]) => !gapIds.includes(gapId))) {
        return NextResponse.json({ error: "Faltan respuestas o hay huecos desconocidos" }, { status: 400 });
      }

      const exerciseIds = sortedRows.map((row) => String(row.id));
      const optionsResult = await db.prepare(
        `SELECT exercise_id, option_key FROM exercise_options
         WHERE exercise_id IN (${exerciseIds.map(() => "?").join(",")})`
      ).bind(...exerciseIds).all();
      const allowedOptions = new Map<string, Set<string>>();
      for (const option of (optionsResult.results || []) as Array<Record<string, unknown>>) {
        const id = String(option.exercise_id);
        const keys = allowedOptions.get(id) || new Set<string>();
        keys.add(String(option.option_key));
        allowedOptions.set(id, keys);
      }

      const gapResults = sortedRows.map((row) => {
        const gapId = String(row.gapNumber);
        const selectedOptionKey = String(submitted[gapId] || "");
        const available = allowedOptions.get(String(row.id)) || new Set<string>();
        const answerConfig = parseJson<AnswerConfig>(row.answer_config_json, {});
        const correctOptionKey = answerConfig.correctOptionKeys?.[0] || "";
        if (!available.has(selectedOptionKey) || !correctOptionKey || !available.has(correctOptionKey)) {
          throw new Error("La clave de corrección u opciones de un hueco no son válidas");
        }
        return {
          id: gapId,
          selectedOptionKey,
          correctOptionKey,
          correct: selectedOptionKey === correctOptionKey,
        };
      });

      const correctCount = gapResults.filter((gap) => gap.correct).length;
      const totalGaps = gapResults.length;
      const allCorrect = correctCount === totalGaps;
      const firstKey = sortedRows[0];
      const explanationContent = parseJson<{ explanation_es?: string }>(firstKey.content_json, {});
      return NextResponse.json({
        type: "multiple_choice_cloze",
        correct: allCorrect,
        gapResults,
        correctCount,
        totalGaps,
        feedback: allCorrect
          ? String(firstKey.correct_feedback || "¡Todos los huecos son correctos!")
          : `${correctCount} de ${totalGaps} respuestas correctas. Revisa los huecos marcados como incorrectos.`,
        explanation: explanationContent.explanation_es || null,
      }, { headers: { "Cache-Control": "no-store" } });
    }

    const optionKey = typeof body.optionKey === "string" ? body.optionKey.trim() : "";
    if (!/^[A-D]$/.test(optionKey)) {
      return NextResponse.json({ error: "Respuesta no válida" }, { status: 400 });
    }

    // Backwards-compatible grading path for ordinary single-choice activities.
    const [key, exercise, option] = await Promise.all([
      db.prepare(
        `SELECT k.answer_config_json, k.correct_feedback, k.incorrect_feedback
         FROM exercise_answer_keys k
         JOIN exercises e ON e.id = k.exercise_id
         JOIN sections s ON s.id = e.section_id
         JOIN units u ON u.id = s.unit_id
         JOIN courses c ON c.id = u.course_id
         WHERE k.exercise_id = ? AND e.status = 'published' AND s.status = 'published'
           AND u.status = 'published' AND c.status = 'published' LIMIT 1`
      ).bind(exerciseId).first() as Promise<Record<string, unknown> | null>,
      db.prepare(
        `SELECT e.content_json FROM exercises e
         JOIN sections s ON s.id = e.section_id
         JOIN units u ON u.id = s.unit_id
         JOIN courses c ON c.id = u.course_id
         WHERE e.id = ? AND e.status = 'published' AND s.status = 'published'
           AND u.status = 'published' AND c.status = 'published' LIMIT 1`
      ).bind(exerciseId).first() as Promise<Record<string, unknown> | null>,
      db.prepare(
        "SELECT 1 AS found FROM exercise_options WHERE exercise_id = ? AND option_key = ? LIMIT 1"
      ).bind(exerciseId, optionKey).first(),
    ]);

    if (!key || !exercise) return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 });
    if (!option) return NextResponse.json({ error: "Opción no disponible para este ejercicio" }, { status: 400 });

    const answerConfig = parseJson<AnswerConfig>(key.answer_config_json, {});
    const correctOptionKey = answerConfig.correctOptionKeys?.[0] || "";
    if (!correctOptionKey) return NextResponse.json({ error: "Ejercicio sin clave de corrección" }, { status: 409 });

    const content = parseJson<{ explanation_es?: string }>(exercise.content_json, {});
    const correct = optionKey === correctOptionKey;
    return NextResponse.json({
      correct,
      correctOptionKey,
      feedback: correct ? key.correct_feedback : key.incorrect_feedback,
      explanation: content.explanation_es || null,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[api/academy/grade] Failed to grade answer:", error);
    return NextResponse.json({ error: "No se pudo corregir la respuesta" }, { status: 500 });
  }
}
