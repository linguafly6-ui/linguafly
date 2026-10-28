"use client";

import { useEffect, useState } from "react";

type Exercise = {
  id: string;
  number: number;
  type: string;
  prompt: string;
  options: string[];
};

type Feedback = { correct: boolean; explanation: string };

export function ExercisePanel({ lessonId }: { lessonId: string }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [hydratedLesson, setHydratedLesson] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setHydratedLesson(null);
    try {
      const saved = window.localStorage.getItem(`linguafly:a1:exercise:${lessonId}`);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const state = parsed as { answers?: unknown; feedback?: unknown };
          if (state.answers && typeof state.answers === "object" && !Array.isArray(state.answers)) {
            setAnswers(state.answers as Record<string, string>);
          } else {
            setAnswers({});
          }
          if (state.feedback && typeof state.feedback === "object" && !Array.isArray(state.feedback)) {
            setFeedback(state.feedback as Record<string, Feedback>);
          } else {
            setFeedback({});
          }
        } else {
          setAnswers({});
          setFeedback({});
        }
      } else {
        setAnswers({});
        setFeedback({});
      }
    } catch {
      setAnswers({});
      setFeedback({});
    }
    setHydratedLesson(lessonId);
    fetch(`/api/learning/lessons/${encodeURIComponent(lessonId)}/exercises`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("No se han podido cargar los ejercicios.");
        return response.json() as Promise<{ exercises: Exercise[] }>;
      })
      .then((data) => { if (active) setExercises(data.exercises ?? []); })
      .catch(() => { if (active) setError("Los ejercicios estarán disponibles cuando la base de datos del curso esté actualizada."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [lessonId]);

  useEffect(() => {
    if (hydratedLesson !== lessonId) return;
    try {
      window.localStorage.setItem(
        `linguafly:a1:exercise:${lessonId}`,
        JSON.stringify({ answers, feedback })
      );
    } catch {
      // Exercise state is a convenience; storage failures must not block practice.
    }
  }, [answers, feedback, hydratedLesson, lessonId]);

  async function checkAnswer(exercise: Exercise) {
    const answer = answers[exercise.id];
    if (!answer || submitting) return;
    setSubmitting(exercise.id);
    setError("");
    try {
      const response = await fetch(`/api/learning/lessons/${encodeURIComponent(lessonId)}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId: exercise.id, answer }),
      });
      const result = await response.json() as Feedback & { error?: string };
      if (!response.ok) throw new Error(result.error || "No se ha podido corregir la respuesta.");
      setFeedback((current) => ({ ...current, [exercise.id]: result }));
    } catch {
      setError("No se ha podido corregir la respuesta. Comprueba la conexión e inténtalo otra vez.");
    } finally {
      setSubmitting(null);
    }
  }

  const answeredCorrectly = exercises.filter((exercise) => feedback[exercise.id]?.correct).length;

  return (
    <section className="mt-8 rounded-3xl border border-[#ded8ca] bg-[#fbf9f4] p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b75d3b]">Ahora te toca a ti</p>
          <h3 className="mt-2 text-2xl font-extrabold text-[#22251f]">Ponlo en práctica</h3>
          <p className="mt-2 text-sm text-[#65665b]">Elige una respuesta y compruébala para ver la explicación.</p>
        </div>
        {exercises.length > 0 && <div className="rounded-xl bg-[#e9e3d7] px-3 py-2 text-sm font-bold text-[#56584f]">{answeredCorrectly}/{exercises.length} correctas</div>}
      </div>

      {loading && <p className="mt-6 rounded-xl bg-[#f0ece3] p-4 text-sm text-[#65665b]">Cargando ejercicios…</p>}
      {error && <p role="alert" className="mt-5 rounded-xl border border-[#e4c6b9] bg-[#fff2ec] p-4 text-sm text-[#8f432c]">{error}</p>}
      {!loading && !error && exercises.length === 0 && <p className="mt-6 rounded-xl bg-[#f0ece3] p-4 text-sm leading-6 text-[#65665b]">Todavía no hay ejercicios publicados para esta lección. Estamos preparando el contenido.</p>}

      <div className="mt-6 space-y-5">
        {exercises.map((exercise) => {
          const result = feedback[exercise.id];
          return <article key={exercise.id} className="rounded-2xl border border-[#e5dfd3] bg-white/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#898779]">Ejercicio {exercise.number}</p>
            <h4 className="mt-2 text-base font-bold leading-6 text-[#30352d]">{exercise.prompt}</h4>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {exercise.options.map((option) => {
                const chosen = answers[exercise.id] === option;
                const correctOption = result && result.correct && chosen;
                return <button
                  key={option}
                  type="button"
                  disabled={Boolean(result) || Boolean(submitting)}
                  onClick={() => setAnswers((current) => ({ ...current, [exercise.id]: option }))}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-default ${correctOption ? "border-[#8ba58a] bg-[#eaf2e7] text-[#355a37]" : chosen ? "border-[#b75d3b] bg-[#f8e8df] text-[#87452e]" : "border-[#e5dfd3] bg-[#fbf9f4] text-[#56584f] hover:border-[#c6a18e]"}`}
                >{option}</button>;
              })}
            </div>
            {!result ? <button type="button" disabled={!answers[exercise.id] || submitting === exercise.id} onClick={() => checkAnswer(exercise)} className="mt-4 rounded-xl bg-[#252a24] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#41483e] disabled:cursor-not-allowed disabled:opacity-40">{submitting === exercise.id ? "Corrigiendo…" : "Comprobar respuesta"}</button> : <div className={`mt-4 rounded-xl p-4 ${result.correct ? "bg-[#eaf2e7]" : "bg-[#fff2ec]"}`}><p className={`text-sm font-extrabold ${result.correct ? "text-[#355a37]" : "text-[#8f432c]"}`}>{result.correct ? "¡Muy bien! Respuesta correcta." : "Aún no. Revisa la explicación."}</p><p className="mt-1 text-sm leading-6 text-[#56584f]">{result.explanation}</p></div>}
          </article>;
        })}
      </div>
    </section>
  );
}
