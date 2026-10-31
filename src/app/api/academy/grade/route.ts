import { NextRequest, NextResponse } from "next/server";
import { resolveCloudflareEnv } from "@/lib/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { exerciseId?: unknown; optionKey?: unknown };
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Solicitud no válida" }, { status: 400 });
  }

  const exerciseId = typeof body.exerciseId === "string" ? body.exerciseId.trim() : "";
  const optionKey = typeof body.optionKey === "string" ? body.optionKey.trim() : "";
  if (!exerciseId || exerciseId.length > 160 || !/^[A-D]$/.test(optionKey)) {
    return NextResponse.json({ error: "Respuesta no válida" }, { status: 400 });
  }

  try {
    const { env } = await resolveCloudflareEnv();
    const db = env.COURSE_DB;
    if (!db) throw new Error("COURSE_DB binding is not configured; refusing to query the default DB.");
    const [key, exercise] = await Promise.all([
      db.prepare(
        `SELECT k.answer_config_json, k.correct_feedback, k.incorrect_feedback FROM exercise_answer_keys k JOIN exercises e ON e.id = k.exercise_id JOIN sections s ON s.id = e.section_id JOIN units u ON u.id = s.unit_id JOIN courses c ON c.id = u.course_id WHERE k.exercise_id = ? AND e.status = 'published' AND s.status = 'published' AND u.status = 'published' AND c.status = 'published' LIMIT 1`
      ).bind(exerciseId).first() as Promise<Record<string, unknown> | null>,
      db.prepare(
        `SELECT e.content_json FROM exercises e JOIN sections s ON s.id = e.section_id JOIN units u ON u.id = s.unit_id JOIN courses c ON c.id = u.course_id WHERE e.id = ? AND e.status = 'published' AND s.status = 'published' AND u.status = 'published' AND c.status = 'published' LIMIT 1`
      ).bind(exerciseId).first() as Promise<Record<string, unknown> | null>,
    ]);

    if (!key || !exercise) return NextResponse.json({ error: "Ejercicio no encontrado" }, { status: 404 });

    let answerConfig: { correctOptionKeys?: string[] } = {};
    let content: { explanation_es?: string } = {};
    try { answerConfig = JSON.parse(String(key.answer_config_json || "{}")); } catch {}
    try { content = JSON.parse(String(exercise.content_json || "{}")); } catch {}

    const correctOptionKey = answerConfig.correctOptionKeys?.[0] || "";
    if (!correctOptionKey) return NextResponse.json({ error: "Ejercicio sin clave de corrección" }, { status: 409 });

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
