"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type SessionUser = { id: string; email: string };

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => { if (alive) setUser(data.user || null); })
      .catch(() => { if (alive) setUser(null); })
      .finally(() => { if (alive) setChecking(false); });
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") setMessage("¡Pago completado! Introduce el mismo correo que usaste en Stripe para recibir tu enlace seguro de acceso. Si el pago acaba de realizarse, espera unos segundos a que se confirme.");
    if (params.get("checkout") === "cancelled") setMessage("El pago se ha cancelado. No se ha activado ninguna suscripción.");
    if (params.get("login") === "success") setMessage("Has iniciado sesión correctamente.");
    if (params.get("error") === "enlace-invalido") setMessage("El enlace no es válido o ha caducado. Solicita uno nuevo.");
    if (params.get("error") === "temporal") setMessage("No hemos podido completar el acceso. Inténtalo de nuevo.");
    return () => { alive = false; };
  }, []);

  async function requestLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No se pudo solicitar el enlace.");
      setMessage(data.message || "Si la dirección es válida, recibirás un enlace por correo.");
      setEmail("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error al solicitar el enlace.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setMessage("Has cerrado sesión.");
    } catch {
      setMessage("No se pudo cerrar la sesión. Inténtalo otra vez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-16">
      <Link href="/" className="text-sm font-semibold text-[#b75d3b]">← Linguafly</Link>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Tu cuenta de Linguafly</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        Entra con un enlace seguro enviado a tu correo. No necesitas contraseña.
      </p>

      {checking ? (
        <p className="mt-8 text-sm text-neutral-500">Comprobando tu sesión…</p>
      ) : user ? (
        <section className="mt-8 rounded-2xl border border-neutral-200 p-6">
          <p className="text-sm text-neutral-500">Has iniciado sesión como</p>
          <p className="mt-1 font-semibold">{user.email}</p>
          <Link href="/aprender/a1" className="mt-5 inline-block rounded-lg bg-[#b75d3b] px-4 py-2.5 font-semibold text-white">
            Continuar aprendiendo
          </Link>
          <button type="button" onClick={logout} disabled={busy} className="ml-3 rounded-lg border border-neutral-300 px-4 py-2.5 font-semibold disabled:opacity-50">
            Cerrar sesión
          </button>
        </section>
      ) : (
        <form onSubmit={requestLink} className="mt-8 rounded-2xl border border-neutral-200 p-6">
          <label htmlFor="email" className="block text-sm font-semibold">Tu correo electrónico</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@correo.com"
            className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base"
          />
          <button type="submit" disabled={busy} className="mt-4 w-full rounded-lg bg-[#b75d3b] px-4 py-3 font-semibold text-white disabled:opacity-50">
            {busy ? "Enviando…" : "Enviarme un enlace de acceso"}
          </button>
          <p className="mt-3 text-xs leading-5 text-neutral-500">
            El enlace caduca en 15 minutos y solo se puede utilizar una vez.
          </p>
        </form>
      )}

      {message && <p role="status" className="mt-5 rounded-lg bg-neutral-50 p-4 text-sm text-neutral-700">{message}</p>}
    </main>
  );
}
