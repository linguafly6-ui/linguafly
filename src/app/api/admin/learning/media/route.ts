import { NextRequest, NextResponse } from "next/server";
import { getLearningEnv } from "@/lib/learning/auth";
import { storeLearningMedia, type LearningMediaType } from "@/lib/learning/media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_UPLOAD_BYTES = 30 * 1024 * 1024;
const noStore = { "Cache-Control": "no-store" };

function isAuthorized(request: NextRequest, secret: string | undefined): boolean {
  const supplied = request.headers.get("x-support-admin-key");
  return Boolean(secret && supplied && supplied === secret);
}

export async function GET(request: NextRequest) {
  try {
    const env = await getLearningEnv();
    if (!isAuthorized(request, env.SUPPORT_ADMIN_KEY)) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401, headers: noStore });
    }
    if (!env.LEARNING_DB) {
      return NextResponse.json({ error: "Learning database unavailable." }, { status: 503, headers: noStore });
    }

    const status = request.nextUrl.searchParams.get("status");
    const validStatus = ["draft", "review", "published", "archived"];
    const query = status && validStatus.includes(status)
      ? env.LEARNING_DB.prepare(
          `SELECT id, language_code, media_type, mime_type, file_name, title, description,
                  alt_text, duration_seconds, metadata_json, status, created_at, updated_at
           FROM learning_media WHERE status = ? ORDER BY created_at DESC LIMIT 100`
        ).bind(status)
      : env.LEARNING_DB.prepare(
          `SELECT id, language_code, media_type, mime_type, file_name, title, description,
                  alt_text, duration_seconds, metadata_json, status, created_at, updated_at
           FROM learning_media ORDER BY created_at DESC LIMIT 100`
        );
    const { results } = await query.all();
    return NextResponse.json({ media: results ?? [] }, { headers: noStore });
  } catch (error) {
    console.error("[admin/learning/media] GET failed", error);
    return NextResponse.json({ error: "No se pudo cargar la biblioteca multimedia." }, { status: 500, headers: noStore });
  }
}

export async function POST(request: NextRequest) {
  try {
    const env = await getLearningEnv();
    if (!isAuthorized(request, env.SUPPORT_ADMIN_KEY)) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401, headers: noStore });
    }
    if (!env.LEARNING_DB || !env.MEDIA_BUCKET) {
      return NextResponse.json({ error: "Learning media storage unavailable." }, { status: 503, headers: noStore });
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_UPLOAD_BYTES + 64 * 1024) {
      return NextResponse.json({ error: "El archivo supera el límite de 30 MiB." }, { status: 413, headers: noStore });
    }

    const form = await request.formData();
    const file = form.get("file");
    const mediaType = form.get("mediaType");
    if (!(file instanceof File) || !["audio", "image", "document"].includes(String(mediaType))) {
      return NextResponse.json({ error: "Se requiere un archivo y un tipo válido." }, { status: 400, headers: noStore });
    }
    if (file.size < 1 || file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "El archivo debe ocupar entre 1 byte y 30 MiB." }, { status: 413, headers: noStore });
    }

    const languageCode = String(form.get("languageCode") ?? "en").trim().toLowerCase();
    const durationRaw = form.get("durationSeconds");
    const durationSeconds = durationRaw == null || durationRaw === "" ? undefined : Number(durationRaw);
    if (durationSeconds !== undefined && (!Number.isFinite(durationSeconds) || durationSeconds < 0)) {
      return NextResponse.json({ error: "Duración no válida." }, { status: 400, headers: noStore });
    }

    const stored = await storeLearningMedia(env, {
      mediaType: mediaType as LearningMediaType,
      mimeType: file.type,
      fileName: file.name,
      title: String(form.get("title") ?? "").trim() || undefined,
      description: String(form.get("description") ?? "").trim() || undefined,
      altText: String(form.get("altText") ?? "").trim() || undefined,
      languageCode,
      durationSeconds,
    }, await file.arrayBuffer());

    return NextResponse.json({ media: stored, status: "draft" }, { status: 201, headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown upload error";
    const clientError = /Unsupported media MIME type|Media type does not match|Invalid media duration|Invalid language code|Media file must be/.test(message);
    if (!clientError) console.error("[admin/learning/media] POST failed", error);
    return NextResponse.json(
      { error: clientError ? message : "No se pudo guardar el recurso multimedia." },
      { status: clientError ? 400 : 500, headers: noStore }
    );
  }
}
