import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, cookieValue, getLearningEnv, sha256 } from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawToken = cookieValue(request.headers.get("cookie"), SESSION_COOKIE);
    if (rawToken && /^[a-f0-9]{64}$/.test(rawToken)) {
      const env = await getLearningEnv();
      await env.DB.prepare("DELETE FROM learning_sessions WHERE token_hash = ?")
        .bind(await sha256(rawToken)).run();
    }
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0,
    });
    return response;
  } catch (error) {
    console.error("[auth/logout] failed:", error);
    return NextResponse.json({ error: "No se pudo cerrar la sesión." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
