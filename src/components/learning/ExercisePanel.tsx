"use client";

import { useEffect, useState } from "react";
import { scheduleNextReview, type ReviewState, type ReviewResult } from "@/lib/learning/spaced-repetition";

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
  const [reviews, setReviews] = useState<Record<string, ReviewResult>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [hydratedLesson, setHydratedLesson] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setHydratedLesson(null);
    setAnswers({}); setFeedback({}); setReviews({}); setAuthenticated(false);
    fetch("/api/learning/progress", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("No se pudo cargar tu progreso.");
        return response.json() as Promise<{ authenticated: boolean; exercises?: Record<string, Record<string, { answer?: string; feedback?: Feedback; review?: ReviewResult }>> }>;
      })
      .then((progress) => {
        if (!active) return;
        setAuthenticated(progress.authenticated);
        let saved: string | null = null;
        if (progress.authenticated) {
          const states = progress.exercises?.[lessonId] ?? {};
          setAnswers(Object.fromEntries(Object.entries(states).filter(([, value]) => typeof value.answer === "string").map(([id, value]) => [id, value.answer as string])));
          setFeedback(Object.fromEntries(Object.entries(states).filter(([, value]) => value.feedback).map(([id, value]) => [id, value.feedback as Feedback])));
          setReviews(Object.fromEntries(Object.entries(states).filter(([, value]) => value.review).map(([id, value]) => [id, value.review as ReviewResult])));
          setHydratedLesson(lessonId);
          return;
        }
        try { saved = window.localStorage.getItem(`linguafly:a1:guest:exercise:${lessonId}`); } catch { /* Guest storage is optional. */ }
        if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const state = parsed as { answers?: unknown; feedback?: unknown; reviews?: unknown };
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
          if (state.reviews && typeof state.reviews === "object" && !Array.isArray(state.reviews)) {
            setReviews(state.reviews as Record<string, ReviewResult>);
          } else {
            setReviews({});
          }
        } else {
          setAnswers({});
          setFeedback({});
          setReviews({});
        }
      } else {
        setAnswers({});
        setFeedback({});
        setReviews({});
        }
        setHydratedLesson(lessonId);
      })
      .catch(() => { if (active) setError("No se ha podido cargar tu progreso. Inténtalo de nuevo."); });
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
      if (!authenticated) window.localStorage.setItem(`linguafly:a1:guest:exercise:${lessonId}`, JSON.stringify({ answers, feedback, reviews }));
    } catch {
      // Exercise state is a convenience; storage failures must not block practice.
    }
  }, [answers, feedback, reviews, hydratedLesson, lessonId, authenticated]);

  async function chooseAnswer(exerciseId: string, answer: string) {
    setAnswers((current) => ({ ...current, [exerciseId]: answer }));
    if (!authenticated) return;
    try {
      await fetch("/api/learning/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "answer", lessonId, exerciseId, answer }) });
    } catch { /* The selected answer remains available in the current session. */ }
  }

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
      const result = await response.json() as Feedback & { error?: string; review?: ReviewResult };
      if (!response.ok) throw new Error(result.error || "No se ha podido corregir la respuesta.");
      setFeedback((current) => ({ ...current, [exercise.id]: result }));
      if (result.review) {
        setReviews((current) => ({ ...current, [exercise.id]: result.review as ReviewResult }));
        return;
      }
      const previous: ReviewState = reviews[exercise.id] ?? {
        intervalDays: 0,
        easeFactor: 2.5,
        repetitions: 0,
        lapses: 0,
      };
      const scheduled = scheduleNextReview(previous, result.correct ? 4 : 1);
      setReviews((current) => ({ ...current, [exercise.id]: scheduled }));
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
                  onClick={() => void chooseAnswer(exercise.id, option)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-default ${correctOption ? "border-[#8ba58a] bg-[#eaf2e7] text-[#355a37]" : chosen ? "border-[#b75d3b] bg-[#f8e8df] text-[#87452e]" : "border-[#e5dfd3] bg-[#fbf9f4] text-[#56584f] hover:border-[#c6a18e]"}`}
                >{option}</button>;
              })}
            </div>
            {!result ? <button type="button" disabled={!answers[exercise.id] || submitting === exercise.id} onClick={() => checkAnswer(exercise)} className="mt-4 rounded-xl bg-[#252a24] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#41483e] disabled:cursor-not-allowed disabled:opacity-40">{submitting === exercise.id ? "Corrigiendo…" : "Comprobar respuesta"}</button> : <div className={`mt-4 rounded-xl p-4 ${result.correct ? "bg-[#eaf2e7]" : "bg-[#fff2ec]"}`}><p className={`text-sm font-extrabold ${result.correct ? "text-[#355a37]" : "text-[#8f432c]"}`}>{result.correct ? "¡Muy bien! Respuesta correcta." : "Aún no. Revisa la explicación."}</p><p className="mt-1 text-sm leading-6 text-[#56584f]">{result.explanation}</p>{reviews[exercise.id] && <p className="mt-2 text-xs leading-5 text-[#65665b]">Próximo repaso: {new Date(reviews[exercise.id].dueAt).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}</p>}</div>}
          </article>;
        })}
      </div>
    </section>
  );
}

