"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Plan = "monthly" | "annual";

export default function SubscriptionPage() {
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<Plan>("annual");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function startCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "No se pudo abrir el pago.");
      window.location.assign(data.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo iniciar el pago.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-14">
      <Link href="/" className="text-sm font-semibold text-[#b75d3b]">← Linguafly</Link>
      <div className="mx-auto mt-8 max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b75d3b]">Linguafly Premium</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Tu inglés, a tu ritmo.</h1>
        <p className="mt-4 leading-7 text-neutral-600">Elige una suscripción para acceder a tu zona de aprendizaje. Después del pago, te enviaremos un enlace seguro a tu correo.</p>

        <form onSubmit={startCheckout} className="mt-8 space-y-5 rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="mb-3 text-sm font-semibold">Elige cómo quieres continuar después del lanzamiento</legend>
            <label className={`cursor-pointer rounded-xl border p-4 ${plan === "monthly" ? "border-[#b75d3b] bg-orange-50" : "border-neutral-200"}`}>
              <input type="radio" name="plan" value="monthly" checked={plan === "monthly"} onChange={() => setPlan("monthly")} className="mr-2 accent-[#b75d3b]" />
              <span className="font-semibold">Mensual</span>
              <p className="mt-2 text-2xl font-bold">0,99 €<span className="text-sm font-normal text-neutral-500">/mes</span></p>
              <p className="mt-1 text-xs leading-5 text-neutral-600">Durante los 3 primeros meses. Después, 19,99 €/mes.</p>
            </label>
            <label className={`cursor-pointer rounded-xl border p-4 ${plan === "annual" ? "border-[#b75d3b] bg-orange-50" : "border-neutral-200"}`}>
              <input type="radio" name="plan" value="annual" checked={plan === "annual"} onChange={() => setPlan("annual")} className="mr-2 accent-[#b75d3b]" />
              <span className="font-semibold">Después, anual</span>
              <p className="mt-2 text-2xl font-bold">0,99 €<span className="text-sm font-normal text-neutral-500">/mes</span></p>
              <p className="mt-1 text-xs leading-5 text-neutral-600">Durante los 3 primeros meses. Después, 199,99 €/año.</p>
            </label>
          </fieldset>

          <div>
            <label htmlFor="billing-email" className="block text-sm font-semibold">Correo para tu cuenta</label>
            <input id="billing-email" type="email" required autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-3" />
            <p className="mt-2 text-xs leading-5 text-neutral-500">Usaremos este correo para asociar el pago y enviarte el enlace de acceso.</p>
          </div>
          <button type="submit" disabled={busy} className="w-full rounded-lg bg-[#b75d3b] px-4 py-3 font-semibold text-white disabled:opacity-50">
            {busy ? "Conectando con Stripe…" : "Continuar al pago seguro"}
          </button>
          <p className="text-center text-xs leading-5 text-neutral-500">Hoy pagarás 0,99 €. Se cobrarán 0,99 € al mes durante los 3 primeros pagos; después se aplicará el precio indicado para el plan que has elegido. La renovación es automática y puedes solicitar la cancelación antes del siguiente cobro.</p>
        </form>
        {message && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{message}</p>}
      </div>
    </main>
  );
}

