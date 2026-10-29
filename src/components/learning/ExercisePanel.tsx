"use client";

import { useEffect, useRef, useState } from "react";
import { scheduleNextReview, type ReviewState, type ReviewResult } from "@/lib/learning/spaced-repetition";

type Exercise = {
  id: string;
  number: number;
  type: string;
  prompt: string;
  options: string[];
  audioText?: string | null;
  passageText?: string | null;
};

type Feedback = { correct: boolean | null; explanation: string };

const sectionTitles: Record<string, string> = { grammar: "Gramática", vocabulary: "Vocabulario", listening: "Comprensión auditiva", reading: "Comprensión lectora", production: "Producción" };

export function ExercisePanel({ lessonId, sectionType }: { lessonId: string; sectionType: string }) {
  const level = lessonId.split("-")[0] || "a1";
  const guestStorageKey = `linguafly:${level}:guest:exercise:${lessonId}`;
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [reviews, setReviews] = useState<Record<string, ReviewResult>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [hydratedLesson, setHydratedLesson] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [sentenceWords, setSentenceWords] = useState<Record<string, string[]>>({});
  const speechTimer = useRef<number | null>(null);
  const speechGeneration = useRef(0);

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
        if (progress.authenticated) {
          const states = progress.exercises?.[lessonId] ?? {};
          setAnswers(Object.fromEntries(Object.entries(states).filter(([, value]) => typeof value.answer === "string").map(([id, value]) => [id, value.answer as string])));
          setFeedback(Object.fromEntries(Object.entries(states).filter(([, value]) => value.feedback).map(([id, value]) => [id, value.feedback as Feedback])));
          setReviews(Object.fromEntries(Object.entries(states).filter(([, value]) => value.review).map(([id, value]) => [id, value.review as ReviewResult])));
          setHydratedLesson(lessonId);
          return;
        }
        let saved: string | null = null;
        try {
          saved = window.localStorage.getItem(guestStorageKey);
          // Keep progress made by the previous A1 implementation.
          if (!saved && level === "a1") saved = window.localStorage.getItem(`linguafly:a1:guest:exercise:${lessonId}`);
        } catch { /* Guest storage is optional. */ }
        try {
          const state = saved ? JSON.parse(saved) as { answers?: unknown; feedback?: unknown; reviews?: unknown } : {};
          setAnswers(state.answers && typeof state.answers === "object" && !Array.isArray(state.answers) ? state.answers as Record<string, string> : {});
          setFeedback(state.feedback && typeof state.feedback === "object" && !Array.isArray(state.feedback) ? state.feedback as Record<string, Feedback> : {});
          setReviews(state.reviews && typeof state.reviews === "object" && !Array.isArray(state.reviews) ? state.reviews as Record<string, ReviewResult> : {});
        } catch {
          setAnswers({}); setFeedback({}); setReviews({});
        }
        setHydratedLesson(lessonId);
      })
      .catch(() => { if (active) setError("No se ha podido cargar tu progreso. Inténtalo de nuevo."); });
    fetch(`/api/learning/lessons/${encodeURIComponent(lessonId)}/exercises?section=${encodeURIComponent(sectionType)}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("No se han podido cargar los ejercicios.");
        return response.json() as Promise<{ exercises: Exercise[] }>;
      })
      .then((data) => { if (active) { setExercises(data.exercises ?? []); setSentenceWords({}); } })
      .catch(() => { if (active) setError("Los ejercicios estarán disponibles cuando la base de datos del curso esté actualizada."); })
      .finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      speechGeneration.current += 1;
      if (speechTimer.current !== null) window.clearTimeout(speechTimer.current);
      window.speechSynthesis?.cancel();
    };
  }, [lessonId, sectionType, guestStorageKey, level]);

  useEffect(() => {
    if (hydratedLesson !== lessonId) return;
    try {
      if (!authenticated) window.localStorage.setItem(guestStorageKey, JSON.stringify({ answers, feedback, reviews }));
    } catch {
      // Exercise state is a convenience; storage failures must not block practice.
    }
  }, [answers, feedback, reviews, hydratedLesson, lessonId, authenticated, guestStorageKey]);

  async function chooseAnswer(exerciseId: string, answer: string) {
    setAnswers((current) => ({ ...current, [exerciseId]: answer }));
    if (!authenticated) return;
    try {
      await fetch("/api/learning/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "answer", lessonId, exerciseId, answer }) });
    } catch { /* The selected answer remains available in the current session. */ }
  }

  function playExerciseAudio(exercise: Exercise) {
    if (!exercise.audioText || !("speechSynthesis" in window)) return;
    const generation = ++speechGeneration.current;
    if (speechTimer.current !== null) window.clearTimeout(speechTimer.current);
    window.speechSynthesis.cancel();
    setPlayingAudioId(exercise.id);
    const utterance = new SpeechSynthesisUtterance(exercise.audioText);
    utterance.lang = "en-GB";
    utterance.rate = 0.84;
    const finish = () => {
      if (speechGeneration.current === generation) setPlayingAudioId(null);
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    speechTimer.current = window.setTimeout(() => {
      speechTimer.current = null;
      if (speechGeneration.current === generation) window.speechSynthesis.speak(utterance);
    }, 100);
  }

  async function checkAnswer(exercise: Exercise) {
    const answer = answers[exercise.id];
    if (!answer || submitting || feedback[exercise.id]) return;
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
      if (result.correct === null) return;
      const previous: ReviewState = reviews[exercise.id] ?? { intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0 };
      const scheduled = scheduleNextReview(previous, result.correct ? 4 : 1);
      setReviews((current) => ({ ...current, [exercise.id]: scheduled }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se ha podido corregir la respuesta. Comprueba la conexión e inténtalo otra vez.");
    } finally {
      setSubmitting(null);
    }
  }

  const answeredCorrectly = exercises.filter((exercise) => feedback[exercise.id]?.correct).length;
  const title = sectionTitles[sectionType] ?? "Práctica";
  const readingPassage = sectionType === "reading" ? exercises.find((exercise) => exercise.passageText)?.passageText : null;

  return (
    <section className="mt-8 rounded-3xl border border-[#ded8ca] bg-[#fbf9f4] p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b75d3b]">{level === "a1" ? "Ejercicios del curso original A1" : level === "a2" ? "15 ejercicios A2" : `Ejercicios del curso original ${level.toUpperCase()}`}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-[#22251f]">Practica {title}</h3>
          <p className="mt-2 text-sm text-[#65665b]">Responde y revisa la explicación. Las respuestas erróneas vuelven antes; las correctas se espacian progresivamente.</p>
        </div>
        {exercises.length > 0 && <div className="rounded-xl bg-[#e9e3d7] px-3 py-2 text-sm font-bold text-[#56584f]">{answeredCorrectly}/{exercises.length} correctas</div>}
      </div>
      {loading && <p className="mt-6 rounded-xl bg-[#f0ece3] p-4 text-sm text-[#65665b]">Cargando ejercicios…</p>}
      {error && <p role="alert" className="mt-5 rounded-xl border border-[#e4c6b9] bg-[#fff2ec] p-4 text-sm text-[#8f432c]">{error}</p>}
      {!loading && !error && exercises.length === 0 && <p className="mt-6 rounded-xl bg-[#f0ece3] p-4 text-sm leading-6 text-[#65665b]">Todavía no hay ejercicios publicados para esta lección. Estamos preparando el contenido.</p>}
      {readingPassage && <div className="mt-6 rounded-2xl border border-[#e5dfd3] bg-[#f5f1e8] p-5"><p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#a15b40]">Texto de lectura</p><p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#56584f]">{readingPassage}</p></div>}
      <div className="mt-6 space-y-5">
        {exercises.map((exercise) => {
          const result = feedback[exercise.id];
          return <article key={exercise.id} className="rounded-2xl border border-[#e5dfd3] bg-white/70 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#898779]">{title} · {exercise.number % 100}</p>
            <h4 className="mt-2 text-base font-bold leading-6 text-[#30352d]">{exercise.prompt}</h4>
            {sectionType === "listening" && exercise.audioText && <button type="button" disabled={Boolean(playingAudioId && playingAudioId !== exercise.id)} onClick={() => playExerciseAudio(exercise)} aria-live="polite" className="mt-3 rounded-xl bg-[#252a24] px-4 py-2.5 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60">{playingAudioId === exercise.id ? "♫ Reproduciendo…" : "▶ Escuchar"}</button>}
            {exercise.type === "free_text" || exercise.type === "fill_blank" ? <label className="mt-4 block"><span className="sr-only">Tu respuesta en inglés</span><input type="text" value={answers[exercise.id] ?? ""} onChange={(event) => void chooseAnswer(exercise.id, event.target.value)} maxLength={500} disabled={Boolean(result) || Boolean(submitting)} placeholder="Escribe tu respuesta en inglés…" className="w-full rounded-xl border border-[#ded8ca] bg-[#fbf9f4] px-4 py-3 text-sm text-[#30352d] outline-none focus:border-[#b75d3b]" /></label> : null}
            {exercise.type === "sentence_building" && <div className="mt-4 rounded-xl bg-[#f0ece3] p-3"><p className="text-xs font-bold uppercase tracking-wide text-[#65665b]">Tu frase</p><p className="mt-1 min-h-6 text-sm font-semibold text-[#30352d]">{(sentenceWords[exercise.id] ?? []).join(" ") || "Selecciona las palabras en orden."}</p><button type="button" disabled={Boolean(result) || !(sentenceWords[exercise.id]?.length)} onClick={() => { setSentenceWords((current) => ({ ...current, [exercise.id]: [] })); void chooseAnswer(exercise.id, ""); }} className="mt-2 text-xs font-bold text-[#8f432c] disabled:opacity-40">Borrar frase</button></div>}
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {exercise.type === "multiple_choice" ? exercise.options.map((option, optionIndex) => {
                const chosen = answers[exercise.id] === option;
                const correctOption = Boolean(result?.correct && chosen);
                return (
                  <button key={`${option}-${optionIndex}`} type="button" disabled={Boolean(result) || Boolean(submitting)} onClick={() => void chooseAnswer(exercise.id, option)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-default ${correctOption ? "border-[#8ba58a] bg-[#eaf2e7] text-[#355a37]" : chosen ? "border-[#b75d3b] bg-[#f8e8df] text-[#87452e]" : "border-[#e5dfd3] bg-[#fbf9f4] text-[#56584f] hover:border-[#c6a18e]"}`}>{option}</button>
                );
              }) : null}
              {exercise.type === "true_false" ? ["True", "False"].map((option) => (
                <button key={option} type="button" disabled={Boolean(result) || Boolean(submitting)} onClick={() => void chooseAnswer(exercise.id, option)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-default ${answers[exercise.id] === option ? "border-[#b75d3b] bg-[#f8e8df] text-[#87452e]" : "border-[#e5dfd3] bg-[#fbf9f4] text-[#56584f] hover:border-[#c6a18e]"}`}>{option}</button>
              )) : null}
              {exercise.type === "sentence_building" ? exercise.options.map((option, optionIndex) => {
                const words = sentenceWords[exercise.id] ?? [];
                const usedCount = words.filter((word) => word === option).length;
                const totalCount = exercise.options.filter((word) => word === option).length;
                const selected = usedCount > 0;
                return <button key={`${option}-${optionIndex}`} type="button" disabled={Boolean(result) || Boolean(submitting) || usedCount >= totalCount} onClick={() => {
                  const next = [...words, option];
                  setSentenceWords((current) => ({ ...current, [exercise.id]: next }));
                  void chooseAnswer(exercise.id, next.join(" "));
                }} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition disabled:cursor-default ${selected ? "border-[#b75d3b] bg-[#f8e8df] text-[#87452e] opacity-80" : "border-[#e5dfd3] bg-[#fbf9f4] text-[#56584f] hover:border-[#c6a18e]"}`}>{option}</button>;
              }) : null}
            </div>
            {!result ? <button type="button" disabled={!answers[exercise.id] || submitting === exercise.id} onClick={() => checkAnswer(exercise)} className="mt-4 rounded-xl bg-[#252a24] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#41483e] disabled:cursor-not-allowed disabled:opacity-40">{submitting === exercise.id ? "Corrigiendo…" : exercise.type === "free_text" ? "Guardar y revisar" : "Comprobar respuesta"}</button> : <div className={`mt-4 rounded-xl p-4 ${result.correct === true ? "bg-[#eaf2e7]" : result.correct === false ? "bg-[#fff2ec]" : "bg-[#f0ece3]"}`}><p className={`text-sm font-extrabold ${result.correct === true ? "text-[#355a37]" : result.correct === false ? "text-[#8f432c]" : "text-[#56584f]"}`}>{result.correct === true ? "¡Muy bien! Respuesta correcta." : result.correct === false ? "Aún no. Revisa la explicación." : "Respuesta guardada. Revisa tu texto."}</p><p className="mt-1 text-sm leading-6 text-[#56584f]">{result.explanation}</p>{reviews[exercise.id] && <p className="mt-2 text-xs leading-5 text-[#65665b]">Próximo repaso: {new Date(reviews[exercise.id].dueAt).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" })}</p>}</div>}
          </article>;
        })}
      </div>
    </section>
  );
}
