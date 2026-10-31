import { NextRequest, NextResponse } from "next/server";
import { getLearningEnv } from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ mediaId: string }> }
) {
  try {
    const { mediaId } = await context.params;
    if (!/^med_[a-f0-9]{32}$/.test(mediaId)) {
      return NextResponse.json({ error: "Recurso no encontrado." }, { status: 404 });
    }

    const env = await getLearningEnv();
    if (!env.LEARNING_DB || !env.MEDIA_BUCKET) {
      return NextResponse.json({ error: "Media unavailable." }, { status: 503 });
    }

    const media = await env.LEARNING_DB.prepare(
      `SELECT storage_key, storage_provider, mime_type, file_name
       FROM learning_media WHERE id = ? AND status = 'published' LIMIT 1`
    ).bind(mediaId).first<{
      storage_key: string;
      storage_provider: string;
      mime_type: string;
      file_name: string | null;
    }>();

    if (!media || media.storage_provider !== "r2") {
      return NextResponse.json({ error: "Recurso no encontrado." }, { status: 404 });
    }

    const object = await env.MEDIA_BUCKET.get(media.storage_key);
    if (!object) {
      return NextResponse.json({ error: "Recurso no encontrado." }, { status: 404 });
    }

    const headers = new Headers({
      "Content-Type": media.mime_type,
      "Content-Length": String(object.size),
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    });
    return new Response(object.body, { status: 200, headers });
  } catch (error) {
    console.error("[learning/v2/media] GET failed", error);
    return NextResponse.json({ error: "No se pudo recuperar el recurso." }, { status: 500 });
  }
}
