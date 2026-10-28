import { NextRequest, NextResponse } from "next/server";
import { getLearningEnv } from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StripeObject = {
  id?: string;
  object?: string;
  customer?: string | { id?: string } | null;
  subscription?: string | { id?: string } | null;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: { email?: string; plan?: string } | null;
  status?: string;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
};
type StripeEvent = { id: string; type: string; data: { object: StripeObject } };

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifySignature(rawBody: string, header: string, secret: string) {
  const parts = header.split(",").map((part) => part.trim().split("="));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !/^\d+$/.test(timestamp) || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${rawBody}`));
  const expected = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return signatures.some((signature) => safeEqual(signature, expected));
}

function idOf(value: string | { id?: string } | null | undefined): string | null {
  if (typeof value === "string") return value;
  return value?.id || null;
}

function periodEnd(value?: number) {
  return typeof value === "number" ? new Date(value * 1000).toISOString() : null;
}

export async function POST(request: NextRequest) {
  try {
    const env = await getLearningEnv();
    const config = env as typeof env & { STRIPE_WEBHOOK_SECRET?: string };
    const secret = config.STRIPE_WEBHOOK_SECRET;
    const signature = request.headers.get("stripe-signature");
    if (!secret || !signature) return NextResponse.json({ error: "Webhook no configurado." }, { status: 400 });

    const rawBody = await request.text();
    if (!(await verifySignature(rawBody, signature, secret))) {
      return NextResponse.json({ error: "Firma de Stripe no válida." }, { status: 400 });
    }
    const event = JSON.parse(rawBody) as StripeEvent;
    if (!event.id || !event.type || !event.data?.object) {
      return NextResponse.json({ error: "Evento incompleto." }, { status: 400 });
    }

    const alreadyProcessed = await env.DB.prepare("SELECT event_id FROM stripe_webhook_events WHERE event_id = ?").bind(event.id).first();
    if (alreadyProcessed) return NextResponse.json({ received: true, duplicate: true });

    const obj = event.data.object;
    const customerId = idOf(obj.customer);
    const subscriptionId = obj.object === "subscription" ? obj.id : idOf(obj.subscription);
    const email = (obj.customer_details?.email || obj.customer_email || obj.metadata?.email || "").trim().toLowerCase();
    const plan = obj.metadata?.plan === "annual" ? "annual" : "monthly";
    const status = obj.status || (event.type === "checkout.session.completed" ? "active" : "inactive");
    const currentPeriodEnd = periodEnd(obj.current_period_end);
    const cancelAtPeriodEnd = obj.cancel_at_period_end ? 1 : 0;

    if (event.type === "checkout.session.completed" && obj.mode !== "payment") {
      // Checkout subscription status is confirmed again by subscription lifecycle events.
      if (email && subscriptionId) {
        await env.DB.prepare(`
          INSERT INTO learning_subscriptions
            (id, email, stripe_customer_id, stripe_subscription_id, stripe_checkout_session_id, plan, status, current_period_end, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(stripe_subscription_id) DO UPDATE SET
            email = excluded.email,
            stripe_customer_id = excluded.stripe_customer_id,
            stripe_checkout_session_id = excluded.stripe_checkout_session_id,
            plan = excluded.plan,
            status = excluded.status,
            current_period_end = excluded.current_period_end,
            updated_at = excluded.updated_at
        `).bind(crypto.randomUUID(), email, customerId, subscriptionId, obj.id || null, plan, "active", currentPeriodEnd, new Date().toISOString()).run();
      }
    } else if (event.type.startsWith("customer.subscription.") && subscriptionId) {
      const subscription = obj;
      const subscriptionEmail = (subscription.metadata?.email || "").trim().toLowerCase();
      const existing = await env.DB.prepare("SELECT email, plan FROM learning_subscriptions WHERE stripe_subscription_id = ?")
        .bind(subscriptionId).first<{ email: string; plan: string }>();
      const resolvedEmail = subscriptionEmail || existing?.email;
      const resolvedPlan = subscription.metadata?.plan === "annual" || existing?.plan === "annual" ? "annual" : "monthly";
      if (resolvedEmail) {
        await env.DB.prepare(`
          INSERT INTO learning_subscriptions
            (id, email, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end, cancel_at_period_end, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(stripe_subscription_id) DO UPDATE SET
            email = excluded.email,
            stripe_customer_id = excluded.stripe_customer_id,
            plan = excluded.plan,
            status = excluded.status,
            current_period_end = excluded.current_period_end,
            cancel_at_period_end = excluded.cancel_at_period_end,
            updated_at = excluded.updated_at
        `).bind(crypto.randomUUID(), resolvedEmail, customerId, subscriptionId, resolvedPlan, subscription.status || "inactive", currentPeriodEnd, cancelAtPeriodEnd, new Date().toISOString()).run();
      }
    }

    await env.DB.prepare("INSERT INTO stripe_webhook_events (event_id, event_type) VALUES (?, ?)").bind(event.id, event.type).run();
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[billing/webhook] failed:", error);
    return NextResponse.json({ error: "No se pudo procesar el evento." }, { status: 500 });
  }
}
