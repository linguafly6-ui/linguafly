"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Lesson = { id: string; title: string; number: number; unit: number };
type Review = { dueAt: string; intervalDays: number; quality: number };
type ReviewRow = { key: string; lessonId: string; lessonTitle: string; dueAt: string };

export default function ReviewQueuePage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/learning/lessons?level=A1", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("No se pudo cargar el curso");
        return r.json() as Promise<{ lessons: Lesson[] }>;
      })
      .then((data) => {
        if (!active) return;
        const list = data.lessons ?? [];
        setLessons(list);
        const rows: ReviewRow[] = [];
        return fetch("/api/learning/progress", { cache: "no-store" }).then(async (response) => {
          if (!response.ok) throw new Error("No se pudo cargar tu progreso");
          return response.json() as Promise<{ authenticated: boolean; exercises?: Record<string, Record<string, { review?: Review }>> }>;
        }).then((progress) => {
          if (!active) return;
          setAuthenticated(progress.authenticated);
          for (const lesson of list) {
            let exerciseStates = progress.exercises?.[lesson.id];
            if (!progress.authenticated) {
              try {
                const raw = localStorage.getItem(`linguafly:a1:guest:exercise:${lesson.id}`);
                exerciseStates = raw ? JSON.parse(raw).reviews && Object.fromEntries(Object.entries(JSON.parse(raw).reviews).map(([id, review]) => [id, { review }])) : undefined;
              } catch { exerciseStates = undefined; }
            }
            for (const [exerciseId, state] of Object.entries(exerciseStates ?? {})) {
              const review = state.review;
              if (!review || typeof review.dueAt !== "string" || !Number.isFinite(Date.parse(review.dueAt))) continue;
              rows.push({ key: lesson.id + ":" + exerciseId, lessonId: lesson.id, lessonTitle: lesson.title, dueAt: review.dueAt });
            }
          }
          setReviews(rows.sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt)));
        });
      })
      .catch(() => { if (active) setError("No se ha podido cargar la lista de repasos. Inténtalo de nuevo."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const due = useMemo(() => reviews.filter((r) => Date.parse(r.dueAt) <= now), [reviews, now]);
  const upcoming = useMemo(() => reviews.filter((r) => Date.parse(r.dueAt) > now), [reviews, now]);
  const formatDate = (value: string) => new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#22251f]">
      <header className="border-b border-[#ded8ca]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="text-lg font-extrabold">lingua<span className="text-[#b75d3b]">fly</span><span className="ml-2 text-xs font-medium uppercase tracking-[0.2em] text-[#77776c]">academy</span></Link>
          <Link href="/aprender/a1" className="text-sm font-semibold text-[#66675d] hover:text-[#b75d3b]">← Volver al curso</Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b75d3b]">Memoria a largo plazo</p>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">Tus repasos inteligentes</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#65665b]">Vuelve a practicar en el momento adecuado. Aquí verás los repasos calculados después de corregir tus ejercicios.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#ded8ca] bg-[#fbf9f4] p-5"><p className="text-sm text-[#77776c]">Pendientes ahora</p><p className="mt-2 text-3xl font-extrabold">{loading ? "—" : due.length}</p></div>
          <div className="rounded-2xl border border-[#ded8ca] bg-[#fbf9f4] p-5"><p className="text-sm text-[#77776c]">Programados</p><p className="mt-2 text-3xl font-extrabold">{loading ? "—" : upcoming.length}</p></div>
          <div className="rounded-2xl border border-[#ded8ca] bg-[#fbf9f4] p-5"><p className="text-sm text-[#77776c]">Lecciones A1</p><p className="mt-2 text-3xl font-extrabold">{loading ? "—" : lessons.length}</p></div>
        </div>
        {loading && <p className="mt-8 rounded-2xl bg-white/70 p-5 text-sm text-[#65665b]">Preparando tus repasos…</p>}
        {error && <p role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">{error}</p>}
        {!loading && !error && <>
          <section className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-extrabold">Para repasar ahora</h2><button onClick={() => setNow(Date.now())} className="rounded-xl border border-[#ded8ca] bg-[#fbf9f4] px-4 py-2 text-sm font-bold hover:bg-white">Actualizar</button></div>
            {due.length === 0 ? <div className="mt-4 rounded-2xl border border-[#ded8ca] bg-[#fbf9f4] p-6"><p className="font-bold">¡Estás al día!</p><p className="mt-2 text-sm leading-6 text-[#65665b]">Cuando corrijas ejercicios, Linguafly programará aquí los repasos. Las respuestas incorrectas vuelven a aparecer antes.</p><Link href="/aprender/a1" className="mt-4 inline-flex rounded-xl bg-[#b75d3b] px-5 py-3 text-sm font-bold text-white hover:bg-[#99492d]">Continuar aprendiendo →</Link></div> : <div className="mt-4 space-y-3">{due.map((r) => <article key={r.key} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#ded8ca] bg-[#fbf9f4] p-5 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a15b40]">Repaso pendiente</p><h3 className="mt-1 font-bold">{r.lessonTitle}</h3><p className="mt-1 text-sm text-[#65665b]">Programado: {formatDate(r.dueAt)}</p></div><Link href={`/aprender/a1?lesson=${encodeURIComponent(r.lessonId)}`} className="rounded-xl bg-[#252a24] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#41483e]">Repasar lección →</Link></article>)}</div>}
          </section>
          <section className="mt-10"><h2 className="text-xl font-extrabold">Próximos repasos</h2>{upcoming.length === 0 ? <p className="mt-3 text-sm text-[#77776c]">Todavía no hay repasos futuros programados.</p> : <div className="mt-4 space-y-3">{upcoming.map((r) => <article key={r.key} className="rounded-2xl border border-[#ded8ca] bg-white/50 p-4 sm:flex sm:items-center sm:justify-between"><p className="font-semibold">{r.lessonTitle}</p><p className="mt-1 text-sm text-[#77776c] sm:mt-0">{formatDate(r.dueAt)}</p></article>)}</div>}</section>
        </>}
        <p className="mt-10 border-t border-[#ded8ca] pt-5 text-xs leading-5 text-[#898779]">{authenticated ? "Tus repasos se guardan en tu cuenta." : "Los repasos de invitado solo se guardan en este navegador. Inicia sesión para sincronizarlos con tu cuenta."}</p>
      </div>
    </main>
  );
}

