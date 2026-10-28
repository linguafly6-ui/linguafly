import { resolveCloudflareEnv, type CloudflareEnv } from "@/lib/db/client";

export const SESSION_COOKIE = "linguafly_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
export const MAGIC_LINK_TTL_MINUTES = 15;
export const AUTH_EMAIL_FROM = "noreply@linguafly.app";
export const AUTH_EMAIL_COOLDOWN_SECONDS = 60;

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function randomToken(bytes = 32): string {
  const data = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(data, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function getLearningEnv(): Promise<CloudflareEnv> {
  const { env } = await resolveCloudflareEnv();
  if (!env.DB) throw new Error("D1 binding unavailable");
  return env;
}

export function cookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=") || null;
  }
  return null;
}

export async function getSessionUser(request: Request) {
  const env = await getLearningEnv();
  const rawToken = cookieValue(request.headers.get("cookie"), SESSION_COOKIE);
  if (!rawToken || !/^[a-f0-9]{64}$/.test(rawToken)) return { env, user: null };
  const tokenHash = await sha256(rawToken);
  const row = await env.DB.prepare(
    `SELECT u.id, u.email, u.email_verified_at
     FROM learning_sessions s
     INNER JOIN learning_users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ? LIMIT 1`
  ).bind(tokenHash, new Date().toISOString()).first<{ id: string; email: string; email_verified_at: string }>();
  if (!row) return { env, user: null };
  const subscription = await env.DB.prepare(
    "SELECT id FROM linguafly_stripe_subscriptions WHERE email = ? AND status IN ('active', 'trialing') AND (current_period_end IS NULL OR current_period_end > ?) LIMIT 1"
  ).bind(row.email, new Date().toISOString()).first<{ id: string }>();
  if (!subscription) return { env, user: null };
  await env.DB.prepare("UPDATE learning_sessions SET last_seen_at = ? WHERE token_hash = ?")
    .bind(new Date().toISOString(), tokenHash).run();
  return { env, user: row };
}
