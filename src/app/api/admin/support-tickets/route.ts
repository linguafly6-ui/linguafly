import { NextRequest, NextResponse } from "next/server";
import { getLearningEnv } from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };

function authorized(request: NextRequest, secret: string | undefined) {
  return Boolean(secret && request.headers.get("x-support-admin-key") && request.headers.get("x-support-admin-key") === secret);
}

export async function GET(request: NextRequest) {
  const env = await getLearningEnv();
  const secret = (env as typeof env & { SUPPORT_ADMIN_KEY?: string }).SUPPORT_ADMIN_KEY;
  if (!authorized(request, secret)) return NextResponse.json({ error: "No autorizado." }, { status: 401, headers: noStore });
  try {
    const status = request.nextUrl.searchParams.get("status");
    const ticketId = request.nextUrl.searchParams.get("id");
    if (ticketId) {
      const ticket = await env.DB.prepare("SELECT * FROM support_tickets WHERE id = ? LIMIT 1").bind(ticketId).first();
      if (!ticket) return NextResponse.json({ error: "Ticket no encontrado." }, { status: 404, headers: noStore });
      const messages = await env.DB.prepare("SELECT id, sender_type, sender_name, message, created_at FROM support_ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC").bind(ticketId).all();
      return NextResponse.json({ ticket, messages: messages.results ?? [] }, { headers: noStore });
    }
    const validStatuses = ["open", "in_progress", "waiting_student", "resolved"];
    const query = status && validStatuses.includes(status)
      ? env.DB.prepare("SELECT t.*, (SELECT message FROM support_ticket_messages m WHERE m.ticket_id=t.id ORDER BY m.created_at DESC LIMIT 1) AS last_message FROM support_tickets t WHERE t.status = ? ORDER BY CASE t.priority WHEN 'high' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END, t.last_message_at DESC LIMIT 200").bind(status)
      : env.DB.prepare("SELECT t.*, (SELECT message FROM support_ticket_messages m WHERE m.ticket_id=t.id ORDER BY m.created_at DESC LIMIT 1) AS last_message FROM support_tickets t ORDER BY CASE t.status WHEN 'open' THEN 0 WHEN 'in_progress' THEN 1 WHEN 'waiting_student' THEN 2 ELSE 3 END, CASE t.priority WHEN 'high' THEN 0 WHEN 'normal' THEN 1 ELSE 2 END, t.last_message_at DESC LIMIT 200");
    const tickets = await query.all();
    return NextResponse.json({ tickets: tickets.results ?? [] }, { headers: noStore });
  } catch (error) {
    console.error("[admin/support-tickets] GET failed", error);
    return NextResponse.json({ error: "No se pudo cargar la bandeja." }, { status: 500, headers: noStore });
  }
}

export async function POST(request: NextRequest) {
  const env = await getLearningEnv();
  const secret = (env as typeof env & { SUPPORT_ADMIN_KEY?: string }).SUPPORT_ADMIN_KEY;
  if (!authorized(request, secret)) return NextResponse.json({ error: "No autorizado." }, { status: 401, headers: noStore });
  try {
    const body = await request.json().catch(() => null) as { ticketId?: unknown; message?: unknown; status?: unknown; priority?: unknown } | null;
    if (!body || typeof body.ticketId !== "string") return NextResponse.json({ error: "Ticket inválido." }, { status: 400 });
    const ticket = await env.DB.prepare("SELECT id FROM support_tickets WHERE id = ? LIMIT 1").bind(body.ticketId).first<{id:string}>();
    if (!ticket) return NextResponse.json({ error: "Ticket no encontrado." }, { status: 404 });
    const now = new Date().toISOString();
    if (typeof body.message === "string" && body.message.trim()) {
      if (body.message.length > 5000) return NextResponse.json({ error: "La respuesta supera el límite de 5000 caracteres." }, { status: 400 });
      await env.DB.prepare("INSERT INTO support_ticket_messages (id, ticket_id, sender_type, sender_name, message, created_at) VALUES (?, ?, 'support', 'Equipo Linguafly', ?, ?)")
        .bind(crypto.randomUUID(), ticket.id, body.message.trim(), now).run();
      await env.DB.prepare("UPDATE support_tickets SET status = 'waiting_student', updated_at = ?, last_message_at = ? WHERE id = ?").bind(now, now, ticket.id).run();
    }
    const statuses = ["open", "in_progress", "waiting_student", "resolved"];
    const priorities = ["low", "normal", "high"];
    if (typeof body.status === "string" && statuses.includes(body.status) && !(typeof body.message === "string" && body.message.trim())) {
      await env.DB.prepare("UPDATE support_tickets SET status = ?, updated_at = ? WHERE id = ?").bind(body.status, now, ticket.id).run();
    }
    if (typeof body.priority === "string" && priorities.includes(body.priority)) {
      await env.DB.prepare("UPDATE support_tickets SET priority = ?, updated_at = ? WHERE id = ?").bind(body.priority, now, ticket.id).run();
    }
    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch (error) {
    console.error("[admin/support-tickets] POST failed", error);
    return NextResponse.json({ error: "No se pudo guardar la respuesta." }, { status: 500 });
  }
}