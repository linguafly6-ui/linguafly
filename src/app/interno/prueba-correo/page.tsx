"use client";

import { FormEvent, useState } from "react";

export default function EmailTestPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function sendTest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/internal/email-test", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No se pudo enviar el correo de prueba.");
      }
      setStatus("success");
      setMessage(`Cloudflare ha aceptado el correo para ${data.recipient}. ID: ${data.messageId}`);
      setToken("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Error al enviar la prueba.");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-16">
      <a href="/" className="text-sm font-semibold text-[#b75d3b]">← Linguafly</a>
      <h1 className="mt-8 text-3xl font-bold tracking-tight">Prueba de correo</h1>
      <p className="mt-3 text-sm leading-6 text-neutral-600">
        Esta herramienta envía un único correo de prueba a la dirección fija de administración.
        El secreto se envía por HTTPS y no se guarda en esta página.
      </p>
      <div className="mt-6 rounded-xl border border-neutral-200 p-5">
        <p className="text-sm"><strong>Destinatario:</strong> lramlo2026@gmail.com</p>
        <p className="mt-1 text-sm"><strong>Remitente:</strong> noreply@linguafly.app</p>
        <form onSubmit={sendTest} className="mt-5 space-y-4">
          <label className="block text-sm font-medium" htmlFor="email-test-token">
            Secreto EMAIL_TEST_TOKEN
          </label>
          <input
            id="email-test-token"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-base"
            placeholder="Pega aquí el secreto que guardaste en Cloudflare"
          />
          <button
            type="submit"
            disabled={status === "sending" || !token}
            className="rounded-lg bg-[#b75d3b] px-4 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            {status === "sending" ? "Enviando…" : "Enviar correo de prueba"}
          </button>
        </form>
        {message && (
          <p role="status" className={`mt-4 break-words text-sm ${status === "success" ? "text-green-700" : "text-red-700"}`}>
            {message}
          </p>
        )}
        <p className="mt-4 text-xs leading-5 text-neutral-500">
          Un resultado correcto confirma que Cloudflare aceptó el envío; revisa también la bandeja
          de entrada y spam para confirmar la entrega.
        </p>
      </div>
    </main>
  );
}
