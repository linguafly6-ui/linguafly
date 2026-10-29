"use client";

import { useEffect, useMemo, useState } from "react";
import { LearningContentSection, type LearningSection } from "@/components/learning/LearningContentSection";
import Link from "next/link";

type Lesson = {
  id: string;
  number: number;
  unit: number;
  title: string;
  objective: string;
  estimated_minutes: number;
  content?: {
    sections?: LearningSection[];
  };
};

type CourseResponse = {
  course: { id: string; title: string; level: string; description: string; lesson_count: number } | null;
  lessons: Lesson[];
};

export default function A1LearningPage() {
  const [data, setData] = useState<CourseResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/learning/progress", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) throw new Error("Unable to load progress");
      return response.json() as Promise<{ authenticated: boolean; completed: string[] }>;
    }).then((progress) => {
      if (!active) return;
      setAuthenticated(progress.authenticated);
      if (progress.authenticated) setCompleted(progress.completed ?? []);
      else {
        try {
          const saved = window.localStorage.getItem("linguafly:a1:guest:completed");
          const parsed: unknown = saved ? JSON.parse(saved) : [];
          if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) setCompleted(parsed);
        } catch { /* Guest progress is best-effort. */ }
      }
    }).catch(() => { if (active) setError("No se ha podido cargar tu progreso. Inténtalo de nuevo."); })
      .finally(() => { if (active) setProgressLoaded(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;
    try {
      if (!authenticated) window.localStorage.setItem("linguafly:a1:guest:completed", JSON.stringify(completed));
    } catch {
      // Private browsing or storage limits must not block learning.
    }
  }, [completed, progressLoaded, authenticated]);

  useEffect(() => {
    let active = true;
    fetch("/api/learning/lessons?level=A1")
      .then(async (response) => {
        if (!response.ok) throw new Error("No se ha podido cargar el curso.");
        return response.json() as Promise<CourseResponse>;
      })
      .then((result) => {
        if (!active) return;
        setData(result);
        const requestedLesson = new URLSearchParams(window.location.search).get("lesson");
        const requestedExists = requestedLesson && result.lessons.some((lesson) => lesson.id === requestedLesson);
        setSelectedId(requestedExists ? requestedLesson : (result.lessons[0]?.id ?? null));
      })
      .catch(() => {
        if (active) setError("No hemos podido cargar las lecciones. Comprueba la conexión e inténtalo de nuevo.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const selected = data?.lessons.find((lesson) => lesson.id === selectedId) ?? null;
  const units = useMemo(() => {
    const grouped = new Map<number, Lesson[]>();
    for (const lesson of data?.lessons ?? []) {
      grouped.set(lesson.unit, [...(grouped.get(lesson.unit) ?? []), lesson]);
    }
    return [...grouped.entries()].sort(([a], [b]) => a - b);
  }, [data]);

  async function finishLesson() {
    if (!selected || completed.includes(selected.id)) return;
    setCompleted((current) => [...current, selected.id]);
    if (authenticated) {
      try {
        const response = await fetch("/api/learning/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "complete", lessonId: selected.id }) });
        if (!response.ok) throw new Error("Progress save failed");
      } catch { setError("No se ha podido guardar la lección. Vuelve a intentarlo."); }
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#22251f]">
      <header className="border-b border-[#ded8ca] bg-[#f5f1e8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="text-lg font-extrabold tracking-tight text-[#22251f]">lingua<span className="text-[#b75d3b]">fly</span><span className="ml-2 text-xs font-medium uppercase tracking-[0.22em] text-[#77776c]">academy</span></a>
          <div className="flex items-center gap-4"><Link href="/aprender/repasos" className="text-sm font-bold text-[#b75d3b] transition hover:text-[#99492d]">Mis repasos ↗</Link><a href="/" className="text-sm font-semibold text-[#66675d] transition hover:text-[#b75d3b]">← Volver a la web</a></div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:py-12">
        <aside className="order-2 lg:order-1">
          <div className="mb-5 rounded-2xl bg-[#252a24] p-5 text-[#f7f3e9]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d8a58a]">Tu ruta de aprendizaje</p>
            <h1 className="mt-3 text-2xl font-bold text-[#f7f3e9]">Inglés desde cero</h1>
            <p className="mt-2 text-sm leading-6 text-[#c7c9bd]">Nivel A1 · 60 unidades · Repaso inteligente</p>
            <div className="mt-5 flex items-end justify-between">
              <span className="text-sm text-[#c7c9bd]">{authenticated ? "Tu progreso guardado" : "Tu progreso de invitado"}</span>
              <span className="text-xl font-bold">{completed.length}/{data?.lessons.length ?? 60}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#484d45]">
              <div className="h-full rounded-full bg-[#d8a58a] transition-all" style={{ width: `${data?.lessons.length ? completed.length / data.lessons.length * 100 : 0}%` }} />
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.15em] text-[#77776c]">Contenido del curso</h2>
            <span className="text-xs text-[#77776c]">{data?.lessons.length ?? "—"} unidades</span>
          </div>

          {loading && <div className="rounded-xl border border-[#ded8ca] bg-white/60 p-5 text-sm text-[#66675d]">Preparando tu ruta…</div>}
          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}<button onClick={() => window.location.reload()} className="mt-3 block font-bold underline">Reintentar</button></div>}
          {!loading && !error && <section aria-label="60 unidades del curso" className="mb-4 overflow-hidden rounded-2xl border border-[#ded8ca] bg-[#fbf9f4]">
            <nav className="max-h-[76vh] overflow-y-auto p-2" aria-label="Unidades A1">
              {units.map(([unit, lessons]) => lessons.map((lesson) => {
                const active = selectedId === lesson.id;
                const done = completed.includes(lesson.id);
                return <button key={`${unit}-${lesson.id}`} onClick={() => { setSelectedId(lesson.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-[#e9e3d7]" : "hover:bg-[#f0ece3]"}`}>
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${done ? "bg-[#48634a] text-white" : active ? "bg-[#b75d3b] text-white" : "bg-[#e9e3d7] text-[#68695f]"}`}>{done ? "✓" : String(unit).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-sm font-semibold leading-5 ${active ? "text-[#22251f]" : "text-[#56584f]"}`}>{lesson.title}</span>
                    <span className="mt-1 block text-xs text-[#8a897d]">{lesson.estimated_minutes} min · Gramática · Vocabulario · Listening · Writing</span>
                  </span>
                </button>;
              }))}
            </nav>
          </section>}
        </aside>

        <section className="order-1 min-w-0 lg:order-2">
          {loading ? <div className="animate-pulse rounded-3xl border border-[#ded8ca] bg-white/70 p-8 sm:p-12"><div className="h-3 w-24 rounded bg-[#e5dfd3]" /><div className="mt-5 h-9 w-3/4 rounded bg-[#e5dfd3]" /><div className="mt-8 h-24 rounded-2xl bg-[#e5dfd3]" /></div> : selected ? (
            <>
              <div className="mb-7 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#77776c]">
                <span>Nivel A1</span><span>·</span><span>Unidad {String(selected.unit).padStart(2, "0")} de {data?.lessons.length}</span><span>·</span><span>{selected.estimated_minutes} minutos</span>
              </div>
              <div className="rounded-3xl border border-[#ded8ca] bg-[#fbf9f4] p-6 shadow-[0_18px_55px_rgba(48,42,32,0.04)] sm:p-10">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b75d3b]">Tu siguiente pequeño paso</p>
                <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-[#22251f] sm:text-5xl">{selected.title}</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[#65665b]">{selected.objective}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#e9e3d7] px-3 py-1.5 text-xs font-bold text-[#56584f]">✦ Aprendizaje guiado</span>
                  <span className="rounded-full bg-[#e9e3d7] px-3 py-1.5 text-xs font-bold text-[#56584f]">↻ Repaso espaciado</span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {(selected.content?.sections?.length ? selected.content.sections : [
                  { title: "Aprende", body: selected.objective },
                  { title: "Practica", body: "Practica este concepto con ejemplos y vuelve a repasarlo para fijarlo en la memoria." },
                ]).map((section, index) => <LearningContentSection
                  key={`${selected.id}-${section.type ?? index}`}
                  lessonId={selected.id}
                  section={section}
                />)}
              </div>

              <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl bg-[#e9e3d7] p-5 sm:flex-row sm:items-center sm:p-6">
                <div><p className="font-bold text-[#30352d]">¿Has terminado esta unidad?</p><p className="mt-1 text-sm text-[#65665b]">Marca el paso como completado y continúa a tu ritmo.</p></div>
                <button onClick={finishLesson} disabled={completed.includes(selected.id)} className="rounded-xl bg-[#b75d3b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#99492d] disabled:cursor-default disabled:bg-[#48634a]">{completed.includes(selected.id) ? "✓ Completada" : "Marcar como completada →"}</button>
              </div>
              <p className="mt-4 text-xs leading-5 text-[#898779]">{authenticated ? "Tus respuestas y tu progreso se guardan en tu cuenta." : "El progreso de invitado se guarda solo en este navegador. Inicia sesión para sincronizarlo con tu cuenta."}</p>
            </>
          ) : <div className="rounded-3xl border border-[#ded8ca] bg-[#fbf9f4] p-10"><h2 className="text-2xl font-bold">Curso A1</h2><p className="mt-3 text-[#65665b]">{error || "No hay lecciones publicadas todavía."}</p></div>}
        </section>
      </div>
    </main>
  );
}

