import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { user } = await getSessionUser(request);
    return NextResponse.json(
      { authenticated: Boolean(user), user: user ? { id: user.id, email: user.email } : null },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("[auth/me] failed:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
