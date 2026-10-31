"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, Headphones, Layers3 } from "lucide-react";

type Course = { id: string; cefr_level: string; title: string; description?: string; unit_count: number; units_with_practice: number; exercise_count: number };
type Unit = { id: string; unit_number: number; title: string; status: string; section_count: number; exercise_count: number; has_practice: boolean; learning_objectives: string[] };
type Section = { id: string; section_type: string; title: string; exercise_count: number };
type Exercise = { id: string; section_id: string; title: string; instructions: string; content: { prompt?: string; explanation_es?: string }; options: { key: string; content: string }[] };
type Grade = { correct: boolean; correctOptionKey: string; feedback: string; explanation?: string | null };

const levelNames: Record<string, string> = {
  A2: "Elemental", B1: "Intermedio", B2: "Intermedio alto", C1: "Avanzado",
};
const sectionNames: Record<string, string> = {
  grammar: "Gramática", vocabulary: "Vocabulario", listening: "Comprensión auditiva", reading: "Comprensión lectora",
};
const sectionIcons: Record<string, typeof BookOpen> = {
  grammar: BookOpen, vocabulary: Layers3, listening: Headphones, reading: BookOpen,
};

export default function AcademyClient({ mode }: { mode: "catalog" | "level" | "unit" }) {
  const params = useParams<{ level?: string; unit?: string }>();
  const level = (params.level || "").toUpperCase();
  const unitNumber = params.unit || "";
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [grades, setGrades] = useState<Record<string, Grade>>({});
  const [grading, setGrading] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    if (mode === "catalog") return "/api/academy";
    if (mode === "level") return `/api/academy?level=${encodeURIComponent(level)}`;
    return `/api/academy?level=${encodeURIComponent(level)}&unit=${encodeURIComponent(unitNumber)}`;
  }, [mode, level, unitNumber]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(endpoint, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "No se pudo cargar el curso");
        return payload;
      })
      .then((payload) => { if (active) setData(payload); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Error inesperado"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [endpoint]);

  async function checkAnswer(exerciseId: string) {
    const optionKey = answers[exerciseId];
    if (!optionKey) return;
    setGrading(exerciseId);
    try {
      const response = await fetch("/api/academy/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId, optionKey }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo corregir");
      setGrades((current) => ({ ...current, [exerciseId]: result }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo corregir");
    } finally {
      setGrading(null);
    }
  }

  if (loading) return <main className="min-h-screen bg-slate-50 px-5 py-16"><div className="mx-auto max-w-5xl animate-pulse"><div className="h-8 w-56 rounded bg-slate-200" /><div className="mt-6 h-36 rounded-3xl bg-slate-200" /><div className="mt-5 h-36 rounded-3xl bg-slate-200" /></div></main>;
  if (error && !data) return <main className="min-h-screen bg-slate-50 px-5 py-16"><div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-7 text-center"><p className="font-semibold text-slate-900">No se pudo abrir la academia</p><p className="mt-2 text-sm text-slate-600">{error}</p><Link href="/academia" className="mt-5 inline-flex font-semibold text-indigo-700">Volver al catálogo</Link></div></main>;

  if (mode === "catalog") {
    const courses = (data?.courses || []) as Course[];
    return <main className="min-h-screen bg-slate-50 px-5 py-12"><div className="mx-auto max-w-6xl">
      <p className="text-sm font-bold uppercase tracking-[.18em] text-indigo-700">Linguafly · Learning</p>
      <div className="mt-3 max-w-3xl"><h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Tu academia de inglés</h1><p className="mt-4 text-lg leading-8 text-slate-600">Aprende paso a paso con itinerarios por nivel, objetivos claros y práctica interactiva.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {courses.map((course) => <Link key={course.id} href={`/academia/${course.cefr_level.toLowerCase()}`} className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg">
          <div className="flex items-start justify-between"><span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">Nivel {course.cefr_level}</span><ArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-700" /></div>
          <h2 className="mt-5 text-2xl font-extrabold text-slate-950">{levelNames[course.cefr_level] || course.title}</h2>
          <p className="mt-2 text-sm text-slate-600">{course.title}</p>
          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-slate-100 pt-5">
            <div><p className="text-2xl font-black text-slate-900">{course.unit_count}</p><p className="text-xs text-slate-500">Unidades</p></div>
            <div><p className="text-2xl font-black text-slate-900">{course.exercise_count}</p><p className="text-xs text-slate-500">Ejercicios</p></div>
            <div><p className="text-2xl font-black text-slate-900">{course.units_with_practice}</p><p className="text-xs text-slate-500">Con práctica</p></div>
          </div>
        </Link>)}
      </div>
      <p className="mt-8 text-sm text-slate-500">El catálogo muestra las unidades creadas. Las unidades sin ejercicios aparecen identificadas como contenido en preparación.</p>
    </div></main>;
  }

  if (mode === "level") {
    const course = data?.course as Course | undefined;
    const units = (data?.units || []) as Unit[];
    return <main className="min-h-screen bg-slate-50 px-5 py-10"><div className="mx-auto max-w-6xl">
      <Link href="/academia" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-700"><ArrowLeft size={16}/> Todos los niveles</Link>
      <div className="mt-6 rounded-3xl bg-slate-950 p-8 text-white md:p-10"><span className="text-sm font-bold uppercase tracking-widest text-indigo-300">Nivel {level} · {levelNames[level]}</span><h1 className="mt-3 text-3xl font-black md:text-4xl">{course?.title || `Inglés ${level}`}</h1><p className="mt-3 max-w-2xl text-slate-300">Explora el itinerario y entra en las unidades con práctica disponible.</p><div className="mt-7 flex flex-wrap gap-6 text-sm"><span><b className="text-xl">{units.length}</b><span className="ml-2 text-slate-300">unidades</span></span><span><b className="text-xl">{units.filter((unit) => unit.has_practice).length}</b><span className="ml-2 text-slate-300">con práctica</span></span></div></div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => <Link key={unit.id} href={`/academia/${level.toLowerCase()}/${unit.unit_number}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md">
          <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Unidad {String(unit.unit_number).padStart(2,"0")}</span>{unit.has_practice ? <CheckCircle2 size={18} className="text-emerald-600"/> : <Clock3 size={18} className="text-amber-500"/>}</div>
          <h2 className="mt-3 line-clamp-2 font-bold text-slate-900">{unit.title}</h2>
          <p className="mt-3 text-xs text-slate-500">{unit.section_count} bloques · {unit.exercise_count} ejercicios</p>
          <p className={`mt-4 text-xs font-semibold ${unit.has_practice ? "text-emerald-700" : "text-amber-700"}`}>{unit.has_practice ? "Práctica disponible" : "Contenido en preparación"}</p>
        </Link>)}
      </div>
    </div></main>;
  }

  const course = data?.course;
  const unit = data?.unit;
  const sections = (data?.sections || []) as Section[];
  const exercises = (data?.exercises || []) as Exercise[];
  if (!unit) return <main className="min-h-screen p-10 text-center">Unidad no encontrada</main>;

  return <main className="min-h-screen bg-slate-50 px-5 py-10"><div className="mx-auto max-w-4xl">
    <Link href={`/academia/${level.toLowerCase()}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-700"><ArrowLeft size={16}/> Nivel {level}</Link>
    <div className="mt-6 rounded-3xl bg-white p-7 shadow-sm md:p-9">
      <span className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">{course?.title} · Unidad {unit.unit_number}</span>
      <h1 className="mt-3 text-3xl font-black leading-tight text-slate-950">{unit.title}</h1>
      {(unit.learning_objectives || []).map((objective: string) => <p key={objective} className="mt-4 leading-7 text-slate-600">{objective}</p>)}
      {unit.status !== "published" && <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><b>Unidad en preparación editorial.</b> La estructura ya está creada, pero las lecciones y actividades todavía no se han aprobado para mostrarse al alumnado.</div>}
    </div>
    <div className="mt-7 space-y-4">
      {sections.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600">Los bloques de gramática, vocabulario, lectura y escucha aparecerán aquí cuando su contenido esté publicado.</div>}
      {sections.map((section) => {
        const Icon = sectionIcons[section.section_type] || BookOpen;
        const sectionExercises = exercises.filter((exercise) => exercise.section_id === section.id);
        return <section key={section.id} className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3"><span className="rounded-xl bg-indigo-50 p-3 text-indigo-700"><Icon size={20}/></span><div><h2 className="font-extrabold text-slate-900">{sectionNames[section.section_type] || section.title}</h2><p className="text-xs text-slate-500">{sectionExercises.length} ejercicios</p></div></div>
          {section.section_type === "listening" && sectionExercises.length === 0 && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">El audio y sus actividades todavía no están publicados.</p>}
          {sectionExercises.map((exercise) => {
            const grade = grades[exercise.id];
            return <div key={exercise.id} className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Práctica</p>
              <p className="mt-2 font-semibold leading-6 text-slate-900">{exercise.content?.prompt || exercise.title}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {exercise.options.map((option) => <button key={option.key} type="button" disabled={!!grade} onClick={() => setAnswers((current) => ({...current,[exercise.id]:option.key}))} className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${grade?.correctOptionKey === option.key ? "border-emerald-400 bg-emerald-50 text-emerald-900" : answers[exercise.id] === option.key ? "border-indigo-500 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"}`}>{option.key}. {option.content}</button>)}
              </div>
              {!grade ? <button type="button" disabled={!answers[exercise.id] || grading === exercise.id} onClick={() => checkAnswer(exercise.id)} className="mt-4 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-40">{grading === exercise.id ? "Corrigiendo…" : "Comprobar respuesta"}</button> : <div className={`mt-4 rounded-xl p-4 text-sm ${grade.correct ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}><p className="font-bold">{grade.correct ? "¡Correcto!" : "Sigue practicando"}</p><p className="mt-1">{grade.feedback}</p>{grade.explanation && <p className="mt-2">{grade.explanation}</p>}</div>}
            </div>;
          })}
        </section>;
      })}
    </div>
    {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
    <div className="mt-8 flex justify-between"><Link href={`/academia/${level.toLowerCase()}`} className="text-sm font-semibold text-indigo-700">Volver a unidades</Link><span className="text-xs text-slate-500">Linguafly Learning</span></div>
  </div></main>;
}
