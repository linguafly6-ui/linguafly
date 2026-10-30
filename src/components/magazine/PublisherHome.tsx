import Link from "next/link";
import { CompactHeadline } from "@/components/magazine/CompactHeadline";
import { FeaturedStory } from "@/components/magazine/FeaturedStory";
import { MagazineArticleCard } from "@/components/magazine/MagazineArticleCard";
import { buildPublisherHome } from "@/lib/content/publisher-home";
import { ENGLISH_LEARNING_SECTIONS, SITE_TAGLINE } from "@/lib/site-catalog";
import type { BlogPost } from "@/lib/blog";

const COURSE_LEVELS = [
  { level: "A1", name: "Principiante", detail: "Empieza desde cero", units: "60 unidades", tone: "from-emerald-400 to-teal-500", href: "/aprender/a1" },
  { level: "A2", name: "Elemental", detail: "Gana confianza al comunicarte", units: "60 unidades", tone: "from-sky-400 to-blue-500", href: "/aprender/a2" },
  { level: "B1", name: "Intermedio", detail: "Exprésate con soltura", units: "60 unidades", tone: "from-violet-400 to-indigo-500", href: "/aprender/b1" },
  { level: "B2", name: "Intermedio alto", detail: "Comunica con precisión", units: "60 unidades", tone: "from-orange-400 to-rose-500", href: "/aprender/b2" },
  { level: "C1", name: "Avanzado", detail: "Domina matices y fluidez", units: "10 unidades", tone: "from-fuchsia-400 to-purple-500", href: "/aprender/c1" },
  { level: "C2", name: "Maestría", detail: "Alcanza un nivel experto", units: "5 unidades", tone: "from-slate-500 to-slate-800", href: "/aprender/c2" },
];

export function PublisherHome({ articles }: { articles: BlogPost[] }) {
  const model = buildPublisherHome(articles);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaf7]">
      <section className="relative isolate border-b border-orange-100 bg-gradient-to-br from-[#fff5ec] via-[#fffaf5] to-[#eef8f6]">
        <div className="pointer-events-none absolute -right-24 -top-28 -z-10 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-[-5rem] -z-10 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[.16em] text-orange-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-teal-500" /> Tu inglés, a tu ritmo
            </span>
            <h1 className="mt-6 max-w-2xl text-balance font-display text-4xl font-black leading-[1.06] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Aprende inglés. <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">Abre posibilidades.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Cursos estructurados de A1 a C2, ejercicios prácticos y recursos para avanzar de verdad. Elige tu nivel y empieza hoy, gratis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#cursos" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800">
                Explorar cursos <span className="ml-2">→</span>
              </Link>
              <Link href="/test-nivel" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-7 py-3.5 text-sm font-extrabold text-slate-800 transition hover:border-orange-300 hover:bg-white">
                Descubre tu nivel
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-bold text-slate-600">
              <span>✓ De A1 a C2</span><span>✓ Aprende a tu ritmo</span><span>✓ Práctica guiada</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-5 rounded-[2.5rem] bg-gradient-to-br from-orange-300 to-teal-300 opacity-50 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div><p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Tu camino</p><p className="mt-1 text-lg font-black text-slate-900">Progreso en inglés</p></div>
                <span className="rounded-2xl bg-teal-50 px-3 py-2 text-2xl">✦</span>
              </div>
              <div className="space-y-3 py-5">
                {COURSE_LEVELS.map((course, index) => (
                  <Link key={course.level} href={course.href} className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-3 transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.tone} text-sm font-black text-white shadow-sm`}>{course.level}</span>
                    <span className="min-w-0 flex-1"><span className="block font-extrabold text-slate-900">{course.name}</span><span className="block text-xs text-slate-500">{course.detail}</span></span>
                    <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500">→</span>
                  </Link>
                ))}
              </div>
              <p className="text-center text-xs font-semibold text-slate-400">Seis niveles. Un camino hecho a tu medida.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="cursos" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">Aprendizaje por niveles</p><h2 className="mt-2 font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Encuentra tu punto de partida</h2><p className="mt-3 max-w-2xl text-slate-600">Avanza paso a paso con lecciones y ejercicios adaptados al Marco Común Europeo.</p></div>
            <Link href="/test-nivel" className="text-sm font-extrabold text-orange-700 hover:text-orange-800">No sé qué nivel tengo →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COURSE_LEVELS.map((course) => (
              <Link key={course.level} href={course.href} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${course.tone}`} />
                <div className="flex items-start justify-between"><span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${course.tone} text-lg font-black text-white shadow-md`}>{course.level}</span><span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">{course.units}</span></div>
                <h3 className="mt-5 text-xl font-black text-slate-900">{course.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{course.detail}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-orange-700">Ver curso <span className="transition group-hover:translate-x-1">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-[#f5faf8] p-6"><span className="text-2xl">🧭</span><h3 className="mt-3 font-black">Una ruta clara</h3><p className="mt-2 text-sm text-slate-600">Sigue una progresión desde los fundamentos hasta el dominio avanzado.</p></div>
          <div className="rounded-2xl bg-[#fff7f1] p-6"><span className="text-2xl">✍️</span><h3 className="mt-3 font-black">Aprende practicando</h3><p className="mt-2 text-sm text-slate-600">Consolida vocabulario, gramática y comprensión con ejercicios.</p></div>
          <div className="rounded-2xl bg-[#f5f5fb] p-6"><span className="text-2xl">🚀</span><h3 className="mt-3 font-black">A tu propio ritmo</h3><p className="mt-2 text-sm text-slate-600">Vuelve a tus lecciones y construye el hábito de aprender cada día.</p></div>
        </div>
      </section>

      {model.featured ? <section className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-12"><div className="lg:col-span-8"><FeaturedStory article={model.featured} /></div><div className="flex flex-col divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 lg:col-span-4"><p className="py-4 text-xs font-black uppercase tracking-[.2em] text-orange-600">Destacados</p>{model.secondary.map((article) => <CompactHeadline key={`${article.category}-${article.slug}`} article={article} />)}</div></div></section> : null}

      {model.news.length > 0 ? <section className="px-4 pb-14 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-teal-700">🗞️ Actualidad</p><h2 className="font-display text-2xl font-black text-slate-900">Novedades del inglés y las academias</h2></div><Link href="/blog/actualidad" className="text-sm font-black text-teal-700">Ver actualidad →</Link></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{model.news.map((article) => <MagazineArticleCard key={`${article.category}-${article.slug}`} article={article} />)}</div></div></section> : null}

      {model.latest.length > 0 ? <section className="px-4 pb-14 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-12"><div className="rounded-3xl border border-slate-200 bg-white px-5 py-2 lg:col-span-8"><div className="flex items-end justify-between gap-4 py-4"><div><p className="text-xs font-black uppercase tracking-[.2em] text-orange-600">Lo último</p><h2 className="font-display text-2xl font-black text-slate-900">Para leer ahora</h2></div><Link href="/blog" className="text-sm font-black text-orange-700">Ver todos →</Link></div>{model.latest.map((article) => <CompactHeadline key={`${article.category}-${article.slug}`} article={article} />)}</div><div className="space-y-6 lg:col-span-4"><div className="rounded-3xl border border-slate-200 bg-white p-6"><p className="mb-3 text-xs font-black uppercase tracking-[.2em] text-slate-500">Aprender inglés</p><div className="flex flex-wrap gap-2">{ENGLISH_LEARNING_SECTIONS.map((section) => <Link key={section.slug} href={section.href} className={`rounded-full px-3 py-1.5 text-xs font-bold ${section.tone.badge}`}>{section.icon} {section.shortName}</Link>)}</div></div></div></div></section> : null}

      {model.rails.map((rail) => rail.articles.length > 0 ? <section key={rail.vertical.slug} className="px-4 pb-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><div className="mb-6 flex items-end justify-between gap-4"><div><p className={`text-xs font-black uppercase tracking-[.2em] ${rail.vertical.tone.text}`}>{rail.vertical.icon} {rail.vertical.name}</p><h2 className="font-display text-2xl font-black text-slate-900">{rail.vertical.tagline}</h2></div><Link href={rail.vertical.href} className={`text-sm font-black ${rail.vertical.tone.text}`}>Ver {rail.vertical.shortName} →</Link></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{rail.articles.map((article) => <MagazineArticleCard key={`${article.category}-${article.slug}`} article={article} />)}</div></div></section> : null)}

      {model.more.length > 0 ? <section className="px-4 pb-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><h2 className="mb-6 font-display text-2xl font-black text-slate-900">Más para aprender</h2><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{model.more.map((article) => <MagazineArticleCard key={`${article.category}-${article.slug}`} article={article} />)}</div></div></section> : null}

      {articles.length === 0 ? <section className="px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-slate-500">Aún no hay artículos publicados.</div></section> : null}
    </main>
  );
}
