"use client";

import { useEffect, useRef, useState } from "react";

export type LearningSection = {
  type?: string;
  title?: string;
  body?: string;
  example?: string;
  exampleTranslation?: string;
  audioText?: string;
  transcript?: string;
  transcriptTranslation?: string;
  prompt?: string;
};

type Props = {
  lessonId: string;
  section: LearningSection;
  authenticated: boolean;
  initialDraft?: string;
};

const sectionMarks: Record<string, string> = { grammar: "Aa", vocabulary: "Ab", listening: "♫", writing: "✎" };

export function LearningContentSection({ lessonId, section, authenticated, initialDraft }: Props) {
  const [draft, setDraft] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [draftChanged, setDraftChanged] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (section.type !== "writing") return;
    if (authenticated) {
      setDraft(initialDraft ?? "");
    } else {
      try { setDraft(window.localStorage.getItem(`linguafly:a1:guest:writing:${lessonId}`) ?? ""); }
      catch { setDraft(""); }
    }
    setDraftReady(true);
    setDraftChanged(false);
    setSaveState("idle");
  }, [lessonId, authenticated, initialDraft, section.type]);

  useEffect(() => {
    if (section.type !== "writing" || !draftReady || !draftChanged) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(() => {
      if (!authenticated) {
        try {
          window.localStorage.setItem(`linguafly:a1:guest:writing:${lessonId}`, draft);
          setSaveState("saved");
          setDraftChanged(false);
        } catch { setSaveState("error"); }
        return;
      }
      fetch("/api/learning/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "writing", lessonId, draft }),
      }).then((response) => {
        setSaveState(response.ok ? "saved" : "error");
        if (response.ok) setDraftChanged(false);
      }).catch(() => setSaveState("error"));
    }, 700);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [lessonId, authenticated, draft, draftReady, draftChanged, section.type]);

  function playListening() {
    if (!section.audioText || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(section.audioText);
    utterance.lang = "en-GB";
    utterance.rate = 0.86;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <article className="rounded-2xl border border-[#ded8ca] bg-[#fbf9f4] p-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9e3d7] text-sm font-extrabold text-[#a15b40]">{sectionMarks[section.type ?? ""] ?? "01"}</div>
      <h3 className="mt-4 text-xl font-bold text-[#30352d]">{section.title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#65665b]">{section.body}</p>
      {section.example && <div className="mt-4 rounded-xl border border-[#e5dfd3] bg-white/70 p-4">
        <p className="text-sm font-semibold text-[#30352d]">{section.example}</p>
        {section.exampleTranslation && <p className="mt-1 text-sm text-[#77776c]">{section.exampleTranslation}</p>}
      </div>}
      {section.type === "listening" && <div className="mt-4">
        <button type="button" onClick={playListening} disabled={!section.audioText} className="rounded-xl bg-[#252a24] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#41483e] disabled:opacity-50">▶ Escuchar diálogo</button>
        {section.transcript && <details className="mt-4 rounded-xl border border-[#e5dfd3] bg-white/70 p-4">
          <summary className="cursor-pointer text-sm font-bold text-[#56584f]">Ver transcripción en inglés</summary>
          <p className="mt-3 text-sm leading-7 text-[#30352d]">{section.transcript}</p>
          {section.transcriptTranslation && <p className="mt-2 text-sm leading-7 text-[#77776c]">{section.transcriptTranslation}</p>}
        </details>}
      </div>}
      {section.type === "writing" && <div className="mt-4">
        {section.prompt && <p className="mb-3 rounded-xl bg-[#e9e3d7] p-4 text-sm font-semibold leading-6 text-[#30352d]">{section.prompt}</p>}
        <label htmlFor={`writing-${lessonId}`} className="sr-only">Tu texto en inglés</label>
        <textarea id={`writing-${lessonId}`} value={draft} onChange={(event) => { setDraft(event.target.value); setDraftChanged(true); }} maxLength={5000} rows={6}
          placeholder="Escribe aquí tus frases en inglés…"
          className="w-full resize-y rounded-xl border border-[#ded8ca] bg-white/80 p-4 text-sm leading-6 text-[#30352d] outline-none transition placeholder:text-[#a4a091] focus:border-[#b75d3b] focus:ring-2 focus:ring-[#b75d3b]/15" />
        <p aria-live="polite" className="mt-2 text-xs text-[#898779]">
          {saveState === "saving" ? "Guardando borrador…" : saveState === "saved" ? (authenticated ? "Borrador guardado en tu cuenta." : "Borrador guardado en este navegador.") : saveState === "error" ? "No se ha podido guardar el borrador." : "Tu respuesta es para practicar; puedes editarla cuando quieras."}
        </p>
      </div>}
    </article>
  );
}

