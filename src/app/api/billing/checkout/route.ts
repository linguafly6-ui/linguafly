import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, getLearningEnv } from "@/lib/learning/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Plan = "monthly" | "annual";

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
      STRIPE_PRICE_MONTHLY?: string;
      STRIPE_PRICE_ANNUAL?: string;
    };
    if (!config.STRIPE_SECRET_KEY || !config.STRIPE_PRICE_MONTHLY || !config.STRIPE_PRICE_ANNUAL) {
      return NextResponse.json({ error: "La suscripción todavía no está configurada. Inténtalo más tarde." }, { status: 503 });
    }

    const price = plan === "monthly" ? config.STRIPE_PRICE_MONTHLY : config.STRIPE_PRICE_ANNUAL;
    const form = new URLSearchParams({
      mode: "subscription",
      success_url: "https://linguafly.app/crear-cuenta?checkout=success",
      cancel_url: "https://linguafly.app/suscripcion?checkout=cancelled",
      customer_email: email,
      client_reference_id: email,
      "line_items[0][price]": price,
      "line_items[0][quantity]": "1",
      "metadata[email]": email,
      "metadata[plan]": plan,
      "subscription_data[metadata][email]": email,
      "subscription_data[metadata][plan]": plan,
      allow_promotion_codes: "true",
    });

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    const session = await stripeResponse.json() as { url?: string; error?: { message?: string } };
    if (!stripeResponse.ok || !session.url) {
      console.error("[billing/checkout] Stripe rejected checkout:", session.error?.message || stripeResponse.status);
      return NextResponse.json({ error: "No se pudo iniciar el pago. Revisa la configuración de Stripe." }, { status: 502 });
    }
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[billing/checkout] failed:", error);
    return NextResponse.json({ error: "No se pudo iniciar el proceso de pago." }, { status: 500 });
  }
}
