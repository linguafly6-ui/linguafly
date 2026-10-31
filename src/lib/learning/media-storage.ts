import type { CloudflareEnv } from "@/lib/db/client";

const MAX_MEDIA_BYTES = 30 * 1024 * 1024;

const MIME_EXTENSIONS: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export type LearningMediaType = "audio" | "image" | "document";

export interface LearningMediaInput {
  mediaType: LearningMediaType;
  mimeType: string;
  fileName: string;
  title?: string;
  description?: string;
  altText?: string;
  languageCode?: string;
  durationSeconds?: number;
  metadata?: Record<string, unknown>;
}

export interface StoredLearningMedia {
  id: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
}

/**
 * Store an editorial asset in the private R2 bucket and persist its metadata
 * in LEARNING_DB. The caller must enforce editorial/admin authorization.
 */
export async function storeLearningMedia(
  env: CloudflareEnv,
  input: LearningMediaInput,
  bytes: ArrayBuffer
): Promise<StoredLearningMedia> {
  if (!env.LEARNING_DB) throw new Error("LEARNING_DB binding unavailable");
  if (!env.MEDIA_BUCKET) throw new Error("MEDIA_BUCKET binding unavailable");

  const mimeType = input.mimeType.toLowerCase().split(";")[0].trim();
  const extension = MIME_EXTENSIONS[mimeType];
  if (!extension) throw new Error("Unsupported media MIME type");
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_MEDIA_BYTES) {
    throw new Error("Media file must be between 1 byte and 30 MiB");
  }

  const expectedType: Record<string, LearningMediaType> = {
    "audio/mpeg": "audio", "audio/mp4": "audio", "audio/wav": "audio",
    "audio/ogg": "audio", "audio/webm": "audio",
    "image/jpeg": "image", "image/png": "image", "image/webp": "image",
    "application/pdf": "document",
  };
  if (expectedType[mimeType] !== input.mediaType) {
    throw new Error("Media type does not match MIME type");
  }

  if (input.durationSeconds != null &&
      (!Number.isFinite(input.durationSeconds) || input.durationSeconds < 0)) {
    throw new Error("Invalid media duration");
  }

  const id = `med_${crypto.randomUUID().replace(/-/g, "")}`;
  const language = (input.languageCode || "en").toLowerCase();
  if (!/^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/.test(language)) {
    throw new Error("Invalid language code");
  }
  const storageKey = `learning/${language}/${input.mediaType}/${id}.${extension}`;
  const safeFileName = input.fileName.replace(/[\\/\\\\\u0000-\u001f]/g, "_").slice(0, 180);

  await env.MEDIA_BUCKET.put(storageKey, bytes, {
    httpMetadata: { contentType: mimeType },
    customMetadata: { mediaId: id, languageCode: language },
  });

  try {
    await env.LEARNING_DB.prepare(
      `INSERT INTO learning_media
        (id, language_code, media_type, storage_provider, storage_key,
         mime_type, file_name, title, description, alt_text, duration_seconds,
         metadata_json, status)
       VALUES (?, ?, ?, 'r2', ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`
    ).bind(
      id, language, input.mediaType, storageKey, mimeType, safeFileName,
      input.title?.slice(0, 200) ?? null,
      input.description?.slice(0, 2000) ?? null,
      input.altText?.slice(0, 500) ?? null,
      input.durationSeconds ?? null,
      JSON.stringify({ ...(input.metadata ?? {}), sizeBytes: bytes.byteLength })
    ).run();
  } catch (error) {
    await env.MEDIA_BUCKET.delete(storageKey);
    throw error;
  }

  return { id, storageKey, mimeType, sizeBytes: bytes.byteLength };
}

/**
 * Archive an unused draft asset. Published assets and assets referenced by
 * exercises or dictionary pronunciations cannot be removed through this path.
 */
export async function archiveUnusedDraftMedia(
  env: CloudflareEnv,
  mediaId: string
): Promise<boolean> {
  if (!env.LEARNING_DB) throw new Error("LEARNING_DB binding unavailable");
  if (!env.MEDIA_BUCKET) throw new Error("MEDIA_BUCKET binding unavailable");

  const db = env.LEARNING_DB;
  const media = await db.prepare(
    "SELECT storage_key, storage_provider, status FROM learning_media WHERE id = ? LIMIT 1"
  ).bind(mediaId).first<{ storage_key: string; storage_provider: string; status: string }>();

  if (!media || media.status !== "draft") return false;

  const reference = await db.prepare(
    `SELECT 1 AS found FROM exercise_media WHERE media_id = ?
     UNION ALL
     SELECT 1 AS found FROM lexical_pronunciations WHERE audio_media_id = ?
     LIMIT 1`
  ).bind(mediaId, mediaId).first<{ found: number }>();

  if (reference) return false;
  if (media.storage_provider === "r2") {
    await env.MEDIA_BUCKET.delete(media.storage_key);
  }

  await db.prepare(
    "UPDATE learning_media SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'draft'"
  ).bind(mediaId).run();

  return true;
}
