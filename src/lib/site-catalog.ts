/**
 * Catálogo público de la revista.
 *
 * Temática propia (idiomas: aprender inglés)
 * más el archivo de artículos para aprender inglés, servido desde
 * D1 en las URLs originales `/blog/{categoria}/{slug}` para no romper SEO.
 */

import {
  getArticleCanonicalPath,
  getExerciseArticlePath,
  getWorkbookPathForCourseUnit,
} from "@/lib/seo/article-paths";
import {
  htmlPathFromMarkdownTwin,
  htmlToMarkdownPath,
} from "@/lib/seo/canonical";

export { getArticleCanonicalPath };

export const MAGAZINE_ARTICLE_CATEGORIES = [
  "idiomas",
] as const;

export const ENGLISH_LEARNING_CATEGORIES = [
  "idiomas",
  "actualidad",
  "gramatica",
  "viajes",
  "trabajo",
  "examenes",
  "metodos",
  "habilidades",
  "curso-a1",
  "curso-a2",
  "curso-b1",
  "curso-b2",
  "curso-c1",
  "curso-c2",
] as const;

export const PUBLIC_ARTICLE_CATEGORIES = [
  ...MAGAZINE_ARTICLE_CATEGORIES,
  "actualidad",
  "gramatica",
  "viajes",
  "trabajo",
  "examenes",
  "metodos",
  "habilidades",
  "curso-a1",
  "curso-a2",
  "curso-b1",
  "curso-b2",
  "curso-c1",
  "curso-c2",
] as const;

export type PublicArticleCategory = (typeof PUBLIC_ARTICLE_CATEGORIES)[number];
export type MagazineArticleCategory = (typeof MAGAZINE_ARTICLE_CATEGORIES)[number];

export type VerticalTone = {
  badge: string;
  gradient: string;
  text: string;
  soft: string;
  border: string;
};

export type SiteVertical = {
  slug: MagazineArticleCategory;
  href: string;
  blogHref: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string;
  tone: VerticalTone;
};

export type EnglishLearningSection = {
  slug: PublicArticleCategory;
  href: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  tone: VerticalTone;
};

export const SITE_TAGLINE =
  "Aprende inglés con guías claras y cursos gratuitos por nivel.";

/** Title de portada: cabe en la SERP (~50–60 caracteres). Google ya muestra Linguafly como nombre del sitio. */
export const SITE_SERP_TITLE = "Aprende inglés gratis: guías y cursos por nivel";

export const SITE_DESCRIPTION =
  "Aprende inglés con guías prácticas y cursos gratuitos por nivel: gramática, inglés para viajar y para trabajar, y preparación de exámenes oficiales.";

const CORAL: VerticalTone = {
  badge: "bg-coral-100 text-coral-800",
  gradient: "from-coral-500 to-peach-500",
  text: "text-coral-700",
  soft: "bg-coral-50",
  border: "border-coral-100",
};

export const SITE_VERTICALS: readonly SiteVertical[] = [
  {
    slug: "idiomas",
    href: "/idiomas",
    blogHref: "/blog/idiomas",
    name: "Idiomas",
    shortName: "Idiomas",
    tagline: "Aprender con método, no con mil listas sueltas",
    description:
      "Más de 700 guías para aprender inglés, clasificadas por temática (gramática, viajes, trabajo, exámenes) y por nivel A1–C2.",
    icon: "🗣️",
    tone: CORAL,
  },
] as const;

/** Temáticas que aparecen en el menú de navegación público. */
export const NAV_VERTICALS = SITE_VERTICALS.filter((vertical) => vertical.slug === "idiomas");

export const ENGLISH_LEARNING_SECTIONS: readonly EnglishLearningSection[] = [
  {
    slug: "actualidad",
    href: "/blog/actualidad",
    name: "Actualidad",
    shortName: "Actualidad",
    description:
      "Novedades de academias, exámenes oficiales y el mercado de aprender inglés.",
    icon: "🗞️",
    tone: {
      badge: "bg-teal-100 text-teal-800",
      gradient: "from-teal-500 to-cyan-500",
      text: "text-teal-700",
      soft: "bg-teal-50",
      border: "border-teal-100",
    },
  },
  {
    slug: "gramatica",
    href: "/blog/gramatica",
    name: "Gramática",
    shortName: "Gramática",
    description: "Tiempos, estructuras y reglas con ejemplos para hispanohablantes.",
    icon: "📚",
    tone: {
      badge: "bg-indigo-100 text-indigo-800",
      gradient: "from-indigo-600 to-blue-700",
      text: "text-indigo-700",
      soft: "bg-indigo-50",
      border: "border-indigo-100",
    },
  },
  {
    slug: "viajes",
    href: "/blog/viajes",
    name: "Inglés para viajar",
    shortName: "Viajes",
    description: "Frases y vocabulario para aeropuertos, hoteles y emergencias.",
    icon: "✈️",
    tone: CORAL,
  },
  {
    slug: "trabajo",
    href: "/blog/trabajo",
    name: "Inglés para trabajar",
    shortName: "Trabajo",
    description: "Emails, entrevistas y vocabulario profesional.",
    icon: "💼",
    tone: CORAL,
  },
  {
    slug: "examenes",
    href: "/blog/examenes",
    name: "Exámenes oficiales",
    shortName: "Exámenes",
    description: "Cambridge, IELTS, TOEFL y certificados: estrategias y guías.",
    icon: "📝",
    tone: {
      badge: "bg-amber-100 text-amber-800",
      gradient: "from-amber-500 to-orange-500",
      text: "text-amber-700",
      soft: "bg-amber-50",
      border: "border-amber-100",
    },
  },
  {
    slug: "metodos",
    href: "/blog/metodos",
    name: "Métodos",
    shortName: "Métodos",
    description: "Técnicas, hábitos y recursos para aprender más rápido.",
    icon: "🎯",
    tone: {
      badge: "bg-pink-100 text-pink-800",
      gradient: "from-pink-500 to-rose-500",
      text: "text-pink-700",
      soft: "bg-pink-50",
      border: "border-pink-100",
    },
  },
  {
    slug: "habilidades",
    href: "/blog/habilidades",
    name: "Speaking y skills",
    shortName: "Skills",
    description: "Speaking, listening, reading y writing con práctica concreta.",
    icon: "🗣️",
    tone: {
      badge: "bg-violet-100 text-violet-800",
      gradient: "from-violet-500 to-purple-600",
      text: "text-violet-700",
      soft: "bg-violet-50",
      border: "border-violet-100",
    },
  },
  {
    slug: "curso-a1",
    href: "/blog/curso-a1",
    name: "Curso A1",
    shortName: "A1",
    description: "Guías por unidad del nivel A1.",
    icon: "📗",
    tone: {
      badge: "bg-emerald-100 text-emerald-800",
      gradient: "from-emerald-600 to-teal-700",
      text: "text-emerald-700",
      soft: "bg-emerald-50",
      border: "border-emerald-100",
    },
  },
  {
    slug: "curso-a2",
    href: "/blog/curso-a2",
    name: "Curso A2",
    shortName: "A2",
    description: "Guías por unidad del nivel A2.",
    icon: "📘",
    tone: {
      badge: "bg-sky-100 text-sky-800",
      gradient: "from-sky-600 to-indigo-700",
      text: "text-sky-700",
      soft: "bg-sky-50",
      border: "border-sky-100",
    },
  },
  {
    slug: "curso-b1",
    href: "/blog/curso-b1",
    name: "Curso B1",
    shortName: "B1",
    description: "Guías por unidad del nivel B1.",
    icon: "📙",
    tone: {
      badge: "bg-amber-100 text-amber-800",
      gradient: "from-amber-600 to-orange-700",
      text: "text-amber-700",
      soft: "bg-amber-50",
      border: "border-amber-100",
    },
  },
  {
    slug: "curso-b2",
    href: "/blog/curso-b2",
    name: "Curso B2",
    shortName: "B2",
    description: "Guías por unidad del nivel B2.",
    icon: "📕",
    tone: {
      badge: "bg-rose-100 text-rose-800",
      gradient: "from-rose-600 to-red-700",
      text: "text-rose-700",
      soft: "bg-rose-50",
      border: "border-rose-100",
    },
  },
  {
    slug: "curso-c1",
    href: "/blog/curso-c1",
    name: "Curso C1",
    shortName: "C1",
    description: "Guías por unidad del nivel C1.",
    icon: "📓",
    tone: {
      badge: "bg-slate-200 text-slate-800",
      gradient: "from-slate-600 to-slate-800",
      text: "text-slate-700",
      soft: "bg-slate-50",
      border: "border-slate-200",
    },
  },
  {
    slug: "curso-c2",
    href: "/blog/curso-c2",
    name: "Curso C2",
    shortName: "C2",
    description: "Guías por unidad del nivel C2.",
    icon: "📔",
    tone: {
      badge: "bg-violet-100 text-violet-800",
      gradient: "from-violet-700 to-slate-800",
      text: "text-violet-700",
      soft: "bg-violet-50",
      border: "border-violet-100",
    },
  },
] as const;

/** Revista de hábitos (2 piezas) + temáticas del archivo de inglés, sin cursos por nivel. */
export const ENGLISH_STUDY_HABITS_SECTION: EnglishLearningSection = {
  slug: "idiomas",
  href: "/blog/idiomas",
  name: "Hábitos de estudio",
  shortName: "Hábitos",
  description:
    "Cómo empezar un idioma, vocabulario activo y rutinas que se pueden mantener.",
  icon: "🌱",
  tone: CORAL,
};

export function isEnglishLevelCategory(category: string): boolean {
  return /^curso-(a1|a2|b1|b2|c1|c2)$/i.test(category.trim());
}

export function getEnglishLevelSections(): EnglishLearningSection[] {
  return ENGLISH_LEARNING_SECTIONS.filter((section) =>
    isEnglishLevelCategory(section.slug),
  );
}

export function getEnglishTopicSections(): EnglishLearningSection[] {
  return [ENGLISH_STUDY_HABITS_SECTION, ...ENGLISH_LEARNING_SECTIONS.filter(
    (section) => !isEnglishLevelCategory(section.slug),
  )];
}

const PUBLIC_CATEGORY_SET = new Set<string>(PUBLIC_ARTICLE_CATEGORIES);
const MAGAZINE_CATEGORY_SET = new Set<string>(MAGAZINE_ARTICLE_CATEGORIES);
const ENGLISH_CATEGORY_SET = new Set<string>(ENGLISH_LEARNING_CATEGORIES);

export function isPublicArticleCategory(category: string): boolean {
  return PUBLIC_CATEGORY_SET.has(category.toLowerCase());
}

export function isMagazineArticleCategory(category: string): boolean {
  return MAGAZINE_CATEGORY_SET.has(category.toLowerCase());
}

export function isEnglishLearningCategory(category: string): boolean {
  return ENGLISH_CATEGORY_SET.has(category.toLowerCase());
}

export function getVertical(slug: string): SiteVertical | undefined {
  return SITE_VERTICALS.find((vertical) => vertical.slug === slug);
}

export function getEnglishSection(slug: string): EnglishLearningSection | undefined {
  return ENGLISH_LEARNING_SECTIONS.find((section) => section.slug === slug);
}

export function getPublicCategoryLabel(category: string): {
  name: string;
  icon: string;
  tone: VerticalTone;
} {
  const vertical = getVertical(category);
  if (vertical) {
    return { name: vertical.name, icon: vertical.icon, tone: vertical.tone };
  }
  const section = getEnglishSection(category);
  if (section) {
    return { name: section.name, icon: section.icon, tone: section.tone };
  }
  return {
    name: category,
    icon: "📄",
    tone: {
      badge: "bg-slate-100 text-slate-700",
      gradient: "from-slate-500 to-slate-700",
      text: "text-slate-700",
      soft: "bg-slate-50",
      border: "border-slate-200",
    },
  };
}

const EXACT_PUBLIC_PATHS = new Set([
  "/",
  "/blog",
  "/cuenta",
  "/idiomas",
  "/privacidad",
  "/cookies",
  "/terminos",
  "/contacto",
  "/mesas",
  "/sobre-nosotros",
  "/test-nivel",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/ads.txt",
  "/icon.svg",
  "/favicon.ico",
  "/indexnow-key.txt",
]);

const PUBLIC_PREFIXES = [
  ...PUBLIC_ARTICLE_CATEGORIES.map((category) => `/blog/${category}`),
  "/blog/autor",
  "/blog/portada",
  "/sitemaps",
  "/api/articles",
  "/api/indexnow",
] as const;

function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  const stripped = pathname.split("?")[0].split("#")[0];
  if (stripped.length > 1 && stripped.endsWith("/")) {
    return stripped.slice(0, -1);
  }
  return stripped || "/";
}

const COURSE_LEVEL_BLOG: Record<string, string> = {
  a1: "/blog/curso-a1",
  a2: "/blog/curso-a2",
  b1: "/blog/curso-b1",
  b2: "/blog/curso-b2",
  c1: "/blog/curso-c1",
  c2: "/blog/curso-c2",
};

export function isPublicSitePath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  const twin = htmlPathFromMarkdownTwin(path);
  if (twin) return isPublicSitePath(twin);
  if (EXACT_PUBLIC_PATHS.has(path)) return true;
  return PUBLIC_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/**
 * Temáticas eliminadas (la web solo trata de aprender inglés). Sus URLs
 * responden 410 Gone para que Google las retire del índice cuanto antes.
 */
export const REMOVED_TOPIC_PREFIXES = [
  "/alimentacion",
  "/entrenamiento",
  "/inteligencia-artificial",
  "/fitness",
  "/blog/alimentacion",
  "/blog/entrenamiento",
  "/blog/inteligencia-artificial",
  "/blog/fitness",
] as const;

export function isRemovedTopicPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  return REMOVED_TOPIC_PREFIXES.some(
    (prefix) => path === prefix || path === `${prefix}.md` || path.startsWith(`${prefix}/`),
  );
}

/**
 * Rutas antiguas que existieron en la web (siguen en src/app pero el Worker no
 * las sirve). Mantienen su 301 a la home. Cualquier otra URL desconocida da 404.
 */
const LEGACY_HOME_REDIRECT_PREFIXES = [
  "/aplicaciones-para-aprender-ingles",
  "/certificaciones-ingles-oficiales",
  "/content",
  "/cursos-por-sector",
  "/demo-course",
  "/frases-en-ingles",
  "/herramientas",
  "/ingles-para-viajar",
  "/juego-ingles",
  "/misiones",
  "/monetag",
  "/practice",
  "/preview",
  "/test-toefl",
  "/test-translation",
  "/tutor-privado",
  "/vocabulario",
] as const;

/**
 * El Worker de Cloudflare sirve artículos y el tutor oral /tutor-ia. Las unidades
 * /curso-* y los hubs /blog/temas no existen ahí. 301 a la URL canónica.
 */
export function getParkedPageRedirect(
  pathname: string,
  searchParams?: URLSearchParams | null,
): string | null {
  const path = normalizePathname(pathname);
  const twin = htmlPathFromMarkdownTwin(path);
  if (twin) {
    const dest = getParkedPageRedirect(twin, searchParams);
    return dest ? htmlToMarkdownPath(dest) : null;
  }
  if (isPublicSitePath(path)) return null;
  if (path.startsWith("/api/")) return null;
  if (path.startsWith("/_next")) return null;

  const temaMatch = path.match(/^\/blog\/temas\/([^/]+)$/);
  if (temaMatch) return getArticleCanonicalPath(temaMatch[1]) || "/blog";

  /**
   * Búsquedas de ejercicios: el 200 indexable es el cuaderno
   * /blog/curso-{nivel}/unidad-N-*-ejercicios-soluciones. Las URLs viejas
   * (?articulo= y /curso-.../unit-N/ejercicio/) redirigen ahí.
   */
  if (path === "/blog/ejercicios-relacionados") {
    const articulo = searchParams?.get("articulo");
    if (articulo) return getExerciseArticlePath(articulo) || "/blog";
    return "/blog";
  }

  if (path.startsWith("/blog")) return "/blog";
  if (path === "/aprender-ingles") return "/idiomas";
  if (path === "/podcasts") return "/blog";

  const exerciseUnit = path.match(
    /^\/curso-(a1|a2|b1|b2|c1|c2)\/unit-(\d+)\/ejercicio(?:\/|$)/,
  );
  if (exerciseUnit) {
    return (
      getWorkbookPathForCourseUnit(exerciseUnit[1], Number(exerciseUnit[2])) ||
      COURSE_LEVEL_BLOG[exerciseUnit[1]] ||
      "/blog"
    );
  }

  const levelMatch = path.match(/^\/curso-(a1|a2|b1|b2|c1|c2)(?:\/|$)/);
  if (levelMatch) return COURSE_LEVEL_BLOG[levelMatch[1]] ?? "/blog";
  if (
    path.startsWith("/curso-camarero") ||
    path.startsWith("/curso-logistica") ||
    path.startsWith("/curso-recepcionista")
  ) {
    return "/blog/trabajo";
  }
  if (path.startsWith("/curso-")) return "/blog";
  if (LEGACY_HOME_REDIRECT_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return "/";
  }
  // URL desconocida: sin redirección, Next devuelve un 404 real (evita soft 404 a la home).
  return null;
}
