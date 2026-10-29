"use client";

import { ExercisePanel } from "@/components/learning/ExercisePanel";

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
};

const sectionMarks: Record<string, string> = { grammar: "Aa", vocabulary: "Ab", listening: "♫", reading: "Aa" };

export function LearningContentSection({ lessonId, section }: Props) {
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
      </div>}
      
      {["grammar", "vocabulary", "listening", "reading"].includes(section.type ?? "") && <ExercisePanel lessonId={lessonId} sectionType={section.type ?? "grammar"} />}
    </article>
  );
}
