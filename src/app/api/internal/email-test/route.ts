import { NextRequest, NextResponse } from "next/server";
import { resolveCloudflareEnv } from "@/lib/db/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEST_RECIPIENT = "lramlo2026@gmail.com";
const SENDER = "noreply@linguafly.app";

/**
 * One-off, secret-protected smoke test for Cloudflare Email Service.
 * Recipient is fixed in code; callers cannot turn this into a mail relay.
 * Configure EMAIL_TEST_TOKEN as a Worker secret before deployment.
 */
export async function POST(request: NextRequest) {
  try {
    const { env } = await resolveCloudflareEnv();
    const secret = env.EMAIL_TEST_TOKEN;
    if (!secret || !env.EMAIL) {
      return NextResponse.json({ error: "Email test is not configured" }, {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const authorization = request.headers.get("authorization") || "";
    const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (supplied.length !== secret.length || supplied !== secret) {
      return NextResponse.json({ error: "Not found" }, {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const response = await env.EMAIL.send({
      to: TEST_RECIPIENT,
      from: SENDER,
      subject: "Linguafly: prueba de correo",
      text: "Esta es una prueba del servicio de correo de Linguafly en Cloudflare. Si has recibido este mensaje, el envío desde el Worker funciona.",
      html: "<p>Esta es una prueba del servicio de correo de <strong>Linguafly</strong> en Cloudflare.</p><p>Si has recibido este mensaje, el envío desde el Worker funciona.</p>",
    });

    return NextResponse.json(
      { ok: true, messageId: response.messageId, recipient: TEST_RECIPIENT },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[api/internal/email-test] Cloudflare email test failed:", error);
    return NextResponse.json(
      { error: "Email test failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
