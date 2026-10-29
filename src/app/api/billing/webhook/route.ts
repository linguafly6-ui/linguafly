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
  amount_paid?: number;
  currency?: string;
  hosted_invoice_url?: string | null;
  invoice_pdf?: string | null;
  number?: string | null;
  billing_reason?: string | null;
  metadata?: { email?: string; plan?: string; launch_offer?: string; price_after_promo?: string } | null;
  status?: string;
  mode?: string;
  current_period_start?: number;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  schedule?: string | { id?: string } | null;
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

async function stripeRequest<T>(secret: string, url: string, method: "GET" | "POST", form?: URLSearchParams): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${secret}`,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    ...(form ? { body: form.toString() } : {}),
  });
  const payload = await response.json() as T & { error?: { message?: string } };
  if (!response.ok) throw new Error(payload.error?.message || `Stripe API returned ${response.status}`);
  return payload;
}

async function scheduleLaunchPriceChange(
  secret: string,
  subscriptionId: string,
  launchPriceId: string,
  standardPriceId: string,
  plan: "monthly" | "annual",
) {
  const subscription = await stripeRequest<StripeObject>(
    secret,
    `https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}`,
    "GET",
  );
  if (subscription.metadata?.launch_offer !== "three_months_099") {
    throw new Error("The subscription is missing launch-offer metadata.");
  }

  let scheduleId = idOf(subscription.schedule);
  if (!scheduleId) {
    const created = await stripeRequest<{ id: string }>(secret, "https://api.stripe.com/v1/subscription_schedules", "POST", new URLSearchParams({ from_subscription: subscriptionId }));
    scheduleId = created.id;
  }

  const scheduleUrl = `https://api.stripe.com/v1/subscription_schedules/${encodeURIComponent(scheduleId)}`;
  const schedule = await stripeRequest<{
    metadata?: { launch_offer_configured?: string };
    current_phase?: { start_date?: number } | null;
    phases?: Array<{ start_date?: number }>;
  }>(secret, scheduleUrl, "GET");
  if (schedule.metadata?.launch_offer_configured === plan) return;

  const phaseStart = schedule.current_phase?.start_date ?? schedule.phases?.[0]?.start_date ?? subscription.current_period_start;
  if (!phaseStart) throw new Error("Stripe did not return the subscription phase start date.");

  const phases = new URLSearchParams({
    end_behavior: "release",
    proration_behavior: "none",
    "phases[0][start_date]": String(phaseStart),
    "phases[0][duration][interval]": "month",
    "phases[0][duration][interval_count]": "3",
    "phases[0][proration_behavior]": "none",
    "phases[0][items][0][price]": launchPriceId,
    "phases[0][items][0][quantity]": "1",
    "phases[1][proration_behavior]": "none",
    "phases[1][items][0][price]": standardPriceId,
    "phases[1][items][0][quantity]": "1",
    "metadata[launch_offer_configured]": plan,
    "metadata[launch_offer]": "three_months_099",
  });
  await stripeRequest(secret, scheduleUrl, "POST", phases);
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

    if (event.type === "checkout.session.completed" && obj.mode === "subscription" && obj.metadata?.launch_offer === "three_months_099") {
      if (!subscriptionId || !obj.metadata.price_after_promo) {
        return NextResponse.json({ error: "Faltan datos para programar el precio posterior a la oferta." }, { status: 500 });
      }
      const billingConfig = env as typeof env & { STRIPE_SECRET_KEY?: string; STRIPE_PRICE_PROMO_MONTHLY?: string; STRIPE_PRICE_MONTHLY?: string };
      const launchPriceId = billingConfig.STRIPE_PRICE_PROMO_MONTHLY || billingConfig.STRIPE_PRICE_MONTHLY;
      if (!billingConfig.STRIPE_SECRET_KEY || !launchPriceId || (obj.metadata.plan !== "monthly" && obj.metadata.plan !== "annual")) {
        return NextResponse.json({ error: "No se pudo programar la renovación de la oferta." }, { status: 500 });
      }
      await scheduleLaunchPriceChange(billingConfig.STRIPE_SECRET_KEY, subscriptionId, launchPriceId, obj.metadata.price_after_promo, obj.metadata.plan);
    }

    if (event.type === "invoice.paid") {
      // Invoice.paid is the reliable source for both the first and recurring successful payments.
      const invoiceEmail = (obj.customer_email || obj.customer_details?.email || "").trim().toLowerCase();
      if (!invoiceEmail) {
        return NextResponse.json({ error: "La factura pagada no incluye correo de cliente." }, { status: 500 });
      }
      if (!env.EMAIL) {
        return NextResponse.json({ error: "Servicio de correo no configurado." }, { status: 500 });
      }
      const amount = ((obj.amount_paid || 0) / 100).toLocaleString("es-ES", {
        style: "currency",
        currency: (obj.currency || "eur").toUpperCase(),
      });
      const invoiceNumber = obj.number || obj.id || "—";
      const invoiceUrl = obj.hosted_invoice_url || "";
      const pdfUrl = obj.invoice_pdf || "";
      const safeInvoiceNumber = invoiceNumber.replace(/[<>&"]/g, "");
      const linksText = [
        invoiceUrl ? `Ver factura: ${invoiceUrl}` : "",
        pdfUrl ? `Descargar PDF: ${pdfUrl}` : "",
      ].filter(Boolean).join("\\n");
      const linksHtml = [
        invoiceUrl ? `<p><a href="${invoiceUrl}">Ver factura de Stripe</a></p>` : "",
        pdfUrl ? `<p><a href="${pdfUrl}">Descargar factura en PDF</a></p>` : "",
      ].join("");
      await env.EMAIL.send({
        to: invoiceEmail,
        from: "noreply@linguafly.app",
        subject: `Recibo de pago de Linguafly — ${amount}`,
        text: `Hola.\\n\\nHemos recibido tu pago de ${amount} para Linguafly.\\nNúmero de factura: ${safeInvoiceNumber}\\n${linksText}\\n\\nGracias por aprender con Linguafly.`,
        html: `<p>Hola.</p><p>Hemos recibido tu pago de <strong>${amount}</strong> para Linguafly.</p><p>Número de factura: ${safeInvoiceNumber}</p>${linksHtml}<p>Gracias por aprender con Linguafly.</p>`,
      });
    } else if (event.type === "checkout.session.completed" && obj.mode !== "payment") {
      // Checkout subscription status is confirmed again by subscription lifecycle events.
      if (email && subscriptionId) {
        await env.DB.prepare(`
          INSERT INTO linguafly_stripe_subscriptions
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
      const existing = await env.DB.prepare("SELECT email, plan FROM linguafly_stripe_subscriptions WHERE stripe_subscription_id = ?")
        .bind(subscriptionId).first<{ email: string; plan: string }>();
      const resolvedEmail = subscriptionEmail || existing?.email;
      const resolvedPlan = subscription.metadata?.plan === "annual" || existing?.plan === "annual" ? "annual" : "monthly";
      if (resolvedEmail) {
        await env.DB.prepare(`
          INSERT INTO linguafly_stripe_subscriptions
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

