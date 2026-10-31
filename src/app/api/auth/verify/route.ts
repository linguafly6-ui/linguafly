import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  getLearningEnv,
  randomToken,
  sha256,
} from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") || "";
  const fail = () => NextResponse.redirect(new URL("https://linguafly.app/crear-cuenta?error=enlace-invalido"), 303);
  if (!/^[a-f0-9]{64}$/.test(token)) return fail();

  try {
    const env = await getLearningEnv();
    const tokenHash = await sha256(token);
    const now = new Date().toISOString();
    const tokenRow = await env.COURSE_DB!.prepare(
      "SELECT email FROM learning_auth_tokens WHERE token_hash = ? AND consumed_at IS NULL AND expires_at > ? LIMIT 1"
    ).bind(tokenHash, now).first<{ email: string }>();
    if (!tokenRow) return fail();

    const subscription = await env.COURSE_DB!.prepare(
      "SELECT id FROM linguafly_stripe_subscriptions WHERE email = ? AND status IN ('active', 'trialing') AND (current_period_end IS NULL OR current_period_end > ?) LIMIT 1"
    ).bind(tokenRow.email.toLowerCase(), now).first<{ id: string }>();
    if (!subscription) {
      return NextResponse.redirect(new URL("https://linguafly.app/crear-cuenta?error=suscripcion-requerida"), 303);
    }

    // Consume once only; concurrent requests cannot redeem the same link twice.
    const consumed = await env.COURSE_DB!.prepare(
      "UPDATE learning_auth_tokens SET consumed_at = ? WHERE token_hash = ? AND consumed_at IS NULL AND expires_at > ?"
    ).bind(now, tokenHash, now).run();
    if (!consumed.meta.changes) return fail();

    const email = tokenRow.email.toLowerCase();
    const existing = await env.COURSE_DB!.prepare("SELECT id FROM learning_users WHERE email = ? LIMIT 1")
      .bind(email).first<{ id: string }>();
    const userId = existing?.id || crypto.randomUUID();
    if (!existing) {
      await env.COURSE_DB!.prepare(
        "INSERT INTO learning_users (id, email, email_verified_at, last_login_at) VALUES (?, ?, ?, ?)"
      ).bind(userId, email, now, now).run();
    } else {
      await env.COURSE_DB!.prepare("UPDATE learning_users SET last_login_at = ? WHERE id = ?")
        .bind(now, userId).run();
    }

    const sessionToken = randomToken();
    const sessionHash = await sha256(sessionToken);
    const sessionExpires = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString();
    await env.COURSE_DB!.prepare("INSERT INTO learning_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
      .bind(sessionHash, userId, sessionExpires).run();

    const response = NextResponse.redirect(new URL("https://linguafly.app/crear-cuenta?login=success"), 303);
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
    response.headers.set("Cache-Control", "no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  } catch (error) {
    console.error("[auth/verify] failed:", error);
    return NextResponse.redirect(new URL("https://linguafly.app/crear-cuenta?error=temporal"), 303);
  }
}
