import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, getLearningEnv } from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Plan = "monthly" | "annual";
type StripePrice = {
  id: string;
  active: boolean;
  currency: string;
  unit_amount: number | null;
  product: string | { id: string };
  recurring: { interval: string; interval_count?: number } | null;
};

async function stripeFetch<T>(secret: string, url: string, method: "GET" | "POST", form?: URLSearchParams) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${secret}`,
      ...(form ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    ...(form ? { body: form.toString() } : {}),
  });
  const data = await response.json() as T & { error?: { message?: string } };
  if (!response.ok) throw new Error(data.error?.message || `Stripe API returned ${response.status}`);
  return data;
}

async function getOrCreateStandardPrice(secret: string, productId: string, plan: Plan) {
  const amount = plan === "monthly" ? 1999 : 19999;
  const interval = plan === "monthly" ? "month" : "year";
  const query = new URLSearchParams({ product: productId, active: "true", limit: "100" });
  const listed = await stripeFetch<{ data: StripePrice[] }>(secret, `https://api.stripe.com/v1/prices?${query}`, "GET");
  const existing = listed.data.find((price) =>
    price.active && price.currency === "eur" && price.unit_amount === amount &&
    price.recurring?.interval === interval && (price.recurring.interval_count ?? 1) === 1
  );
  if (existing) return existing.id;

  const form = new URLSearchParams({
    product: productId,
    currency: "eur",
    unit_amount: String(amount),
    "recurring[interval]": interval,
    nickname: plan === "monthly" ? "Linguafly Premium mensual" : "Linguafly Premium anual",
  });
  const created = await stripeFetch<{ id: string }>(secret, "https://api.stripe.com/v1/prices", "POST", form);
  return created.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const plan = body?.plan as Plan;
    const email = normalizeEmail(body?.email);
    if (!email || (plan !== "monthly" && plan !== "annual")) {
      return NextResponse.json({ error: "Introduce un correo válido y elige un plan." }, { status: 400 });
    }

    const env = await getLearningEnv();
    const config = env as typeof env & {
      STRIPE_SECRET_KEY?: string;
      STRIPE_PRICE_PROMO_MONTHLY?: string;
      STRIPE_PRICE_MONTHLY?: string;
    };
    const launchPriceId = config.STRIPE_PRICE_PROMO_MONTHLY || config.STRIPE_PRICE_MONTHLY;
    if (!config.STRIPE_SECRET_KEY || !launchPriceId) {
      return NextResponse.json({ error: "La suscripción todavía no está configurada. Inténtalo más tarde." }, { status: 503 });
    }

    const launchPrice = await stripeFetch<StripePrice>(config.STRIPE_SECRET_KEY, `https://api.stripe.com/v1/prices/${encodeURIComponent(launchPriceId)}`, "GET");
    if (!launchPrice.active || launchPrice.currency !== "eur" || launchPrice.unit_amount !== 99 || launchPrice.recurring?.interval !== "month" || (launchPrice.recurring.interval_count ?? 1) !== 1) {
      console.error("[billing/checkout] Launch price must be active and recurring at EUR 0.99/month.");
      return NextResponse.json({ error: "La oferta de lanzamiento todavía no está configurada correctamente." }, { status: 503 });
    }
    const productId = typeof launchPrice.product === "string" ? launchPrice.product : launchPrice.product.id;
    const standardPriceId = await getOrCreateStandardPrice(config.STRIPE_SECRET_KEY, productId, plan);
    const form = new URLSearchParams({
      mode: "subscription",
      success_url: "https://linguafly.app/crear-cuenta?checkout=success",
      cancel_url: "https://linguafly.app/suscripcion?checkout=cancelled",
      customer_email: email,
      client_reference_id: email,
      "line_items[0][price]": launchPriceId,
      "line_items[0][quantity]": "1",
      "metadata[email]": email,
      "metadata[plan]": plan,
      "metadata[launch_offer]": "three_months_099",
      "metadata[price_after_promo]": standardPriceId,
      "subscription_data[metadata][email]": email,
      "subscription_data[metadata][plan]": plan,
      "subscription_data[metadata][launch_offer]": "three_months_099",
      "subscription_data[metadata][price_after_promo]": standardPriceId,
      "custom_text[submit][message]": plan === "monthly"
        ? "0,99 € al mes durante los 3 primeros pagos; después 19,99 € al mes. Renovación automática, cancelable antes del siguiente cobro."
        : "0,99 € al mes durante los 3 primeros pagos; después 199,99 € al año. Renovación automática, cancelable antes del siguiente cobro.",
    });

    const session = await stripeFetch<{ url?: string }>(config.STRIPE_SECRET_KEY, "https://api.stripe.com/v1/checkout/sessions", "POST", form);
    if (!session.url) {
      console.error("[billing/checkout] Stripe did not return a Checkout URL.");
      return NextResponse.json({ error: "No se pudo iniciar el pago. Revisa la configuración de Stripe." }, { status: 502 });
    }
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[billing/checkout] failed:", error);
    return NextResponse.json({ error: "No se pudo iniciar el proceso de pago." }, { status: 500 });
  }
}

