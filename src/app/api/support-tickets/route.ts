import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  try {
    const { env, user } = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "Inicia sesión con una cuenta activa para consultar soporte." }, { status: 401, headers: noStore });
    const ticketId = request.nextUrl.searchParams.get("id");
    if (ticketId) {
      const ticket = await env.DB.prepare("SELECT id, subject, category, status, priority, created_at, updated_at FROM support_tickets WHERE id = ? AND user_id = ? LIMIT 1")
        .bind(ticketId, user.id).first<Record<string, unknown>>();
      if (!ticket) return NextResponse.json({ error: "Ticket no encontrado." }, { status: 404, headers: noStore });
      const messages = await env.DB.prepare("SELECT id, sender_type, sender_name, message, created_at FROM support_ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC")
        .bind(ticketId).all();
      return NextResponse.json({ ticket, messages: messages.results ?? [] }, { headers: noStore });
    }
    const tickets = await env.DB.prepare(
      "SELECT t.id, t.subject, t.category, t.status, t.priority, t.created_at, t.updated_at, t.last_message_at, (SELECT message FROM support_ticket_messages m WHERE m.ticket_id=t.id ORDER BY m.created_at DESC LIMIT 1) AS last_message FROM support_tickets t WHERE t.user_id = ? ORDER BY t.last_message_at DESC LIMIT 100"
    ).bind(user.id).all();
    return NextResponse.json({ tickets: tickets.results ?? [] }, { headers: noStore });
  } catch (error) {
    console.error("[support-tickets] GET failed", error);
    return NextResponse.json({ error: "No se pudo cargar soporte." }, { status: 500, headers: noStore });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { env, user } = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: "Inicia sesión con una cuenta activa para escribir a soporte." }, { status: 401, headers: noStore });
    const body = await request.json().catch(() => null) as { subject?: unknown; category?: unknown; message?: unknown; ticketId?: unknown } | null;
    if (!body || typeof body.message !== "string" || body.message.trim().length < 5 || body.message.length > 5000) {
      return NextResponse.json({ error: "El mensaje debe tener entre 5 y 5000 caracteres." }, { status: 400 });
    }
    const now = new Date().toISOString();
    const messageId = crypto.randomUUID();
    if (typeof body.ticketId === "string" && body.ticketId) {
      const ticket = await env.DB.prepare("SELECT id, status FROM support_tickets WHERE id = ? AND user_id = ? LIMIT 1").bind(body.ticketId, user.id).first<{id:string;status:string}>();
      if (!ticket) return NextResponse.json({ error: "Ticket no encontrado." }, { status: 404 });
      if (ticket.status === "resolved") return NextResponse.json({ error: "Este ticket está resuelto. Abre uno nuevo si necesitas más ayuda." }, { status: 409 });
      await env.DB.prepare("INSERT INTO support_ticket_messages (id, ticket_id, sender_type, sender_name, message, created_at) VALUES (?, ?, 'student', ?, ?, ?)")
        .bind(messageId, ticket.id, user.email, body.message.trim(), now).run();
      await env.DB.prepare("UPDATE support_tickets SET status = 'open', updated_at = ?, last_message_at = ? WHERE id = ?")
        .bind(now, now, ticket.id).run();
      return NextResponse.json({ ok: true, ticketId: ticket.id }, { headers: noStore });
    }
    const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 140) : "";
    const categories = ["course", "billing", "technical", "general"];
    const category = typeof body.category === "string" && categories.includes(body.category) ? body.category : "general";
    if (subject.length < 4) return NextResponse.json({ error: "Añade un asunto de al menos 4 caracteres." }, { status: 400 });
    const ticketId = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO support_tickets (id, user_id, user_email, subject, category, status, priority, created_at, updated_at, last_message_at) VALUES (?, ?, ?, ?, ?, 'open', 'normal', ?, ?, ?)")
      .bind(ticketId, user.id, user.email, subject, category, now, now, now).run();
    await env.DB.prepare("INSERT INTO support_ticket_messages (id, ticket_id, sender_type, sender_name, message, created_at) VALUES (?, ?, 'student', ?, ?, ?)")
      .bind(messageId, ticketId, user.email, body.message.trim(), now).run();
    return NextResponse.json({ ok: true, ticketId }, { status: 201, headers: noStore });
  } catch (error) {
    console.error("[support-tickets] POST failed", error);
    return NextResponse.json({ error: "No se pudo enviar el mensaje. Inténtalo de nuevo." }, { status: 500, headers: noStore });
  }
}