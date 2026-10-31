import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_EMAIL_COOLDOWN_SECONDS,
  AUTH_EMAIL_FROM,
  MAGIC_LINK_TTL_MINUTES,
  getLearningEnv,
  normalizeEmail,
  randomToken,
  sha256,
} from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = normalizeEmail(body?.email);
    // Avoid revealing whether an account exists or whether input is valid.
    const generic = { ok: true, message: "Si la dirección es válida, recibirás un enlace de acceso en unos minutos." };
    if (!email) return NextResponse.json(generic, { headers: { "Cache-Control": "no-store" } });

    const env = await getLearningEnv();
    if (!env.EMAIL) {
      return NextResponse.json({ error: "El servicio de correo no está disponible temporalmente." }, { status: 503, headers: { "Cache-Control": "no-store" } });
    }

    const subscription = await env.COURSE_DB!.prepare(
      "SELECT status FROM linguafly_stripe_subscriptions WHERE email = ? AND status IN ('active', 'trialing') AND (current_period_end IS NULL OR current_period_end > ?) ORDER BY updated_at DESC LIMIT 1"
    ).bind(email, new Date().toISOString()).first<{ status: string }>();
    if (!subscription) {
      return NextResponse.json(
        { error: "No encontramos una suscripción activa para este correo. Completa primero el pago o espera unos segundos a que se confirme." },
        { status: 403, headers: { "Cache-Control": "no-store" } }
      );
    }

    const now = new Date();
    const nowIso = now.toISOString();
    const cooldownCutoff = new Date(now.getTime() - AUTH_EMAIL_COOLDOWN_SECONDS * 1000).toISOString();
    // Atomic per-address cooldown; never issue more than one link per minute per address.
    const reservation = await env.COURSE_DB!.prepare(
      `INSERT INTO learning_auth_email_limits (email, last_sent_at)
       VALUES (?, ?)
       ON CONFLICT(email) DO UPDATE SET last_sent_at = excluded.last_sent_at
       WHERE learning_auth_email_limits.last_sent_at <= ?`
    ).bind(email, nowIso, cooldownCutoff).run();
    if (!reservation.meta.changes) return NextResponse.json(generic, { headers: { "Cache-Control": "no-store" } });

    const rawToken = randomToken();
    const tokenHash = await sha256(rawToken);
    const expiresAt = new Date(now.getTime() + MAGIC_LINK_TTL_MINUTES * 60 * 1000).toISOString();
    await env.COURSE_DB!.prepare("DELETE FROM learning_auth_tokens WHERE email = ? OR expires_at <= ?")
      .bind(email, nowIso).run();
    await env.COURSE_DB!.prepare(
      "INSERT INTO learning_auth_tokens (token_hash, email, expires_at) VALUES (?, ?, ?)"
    ).bind(tokenHash, email, expiresAt).run();

    const link = `https://linguafly.app/api/auth/verify?token=${rawToken}`;
    try {
      await env.EMAIL.send({
        to: email,
        from: AUTH_EMAIL_FROM,
        subject: "Tu enlace para entrar en Linguafly",
        text: `Hola. Usa este enlace para entrar en Linguafly: ${link}\n\nEl enlace caduca en ${MAGIC_LINK_TTL_MINUTES} minutos y solo se puede utilizar una vez. Si no has solicitado el acceso, ignora este mensaje.`,
        html: `<p>Hola.</p><p>Pulsa el siguiente enlace para entrar en Linguafly:</p><p><a href="${link}">Entrar en Linguafly</a></p><p>El enlace caduca en ${MAGIC_LINK_TTL_MINUTES} minutos y solo se puede utilizar una vez. Si no has solicitado el acceso, ignora este mensaje.</p>`,
      });
    } catch (error) {
      console.error("[auth/request-link] email send failed:", error);
      await env.COURSE_DB!.prepare("DELETE FROM learning_auth_tokens WHERE token_hash = ?").bind(tokenHash).run();
      return NextResponse.json({ error: "No se pudo enviar el correo. Inténtalo más tarde." }, { status: 502, headers: { "Cache-Control": "no-store" } });
    }
    return NextResponse.json(generic, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[auth/request-link] failed:", error);
    return NextResponse.json({ error: "No se pudo procesar la solicitud." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
