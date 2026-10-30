/**
 * Organiza B1 en cuatro secciones: Grammar, Vocabulary, Reading y Listening.
 * Writing y Speaking quedan fuera del recorrido B1.
 */

import type { Exercise } from '@/lib/exercise-generator';

export const SIX_LESSON_KEYS = ['grammar', 'vocabulary', 'reading', 'listening'] as const;

export type SixLessonKey = (typeof SIX_LESSON_KEYS)[number];

/** Número de lecciones pedagógicas (sin speaking). */
export const PEDAGOGICAL_LESSON_COUNT = SIX_LESSON_KEYS.length;

/** Etiquetas UI (español), alineadas con el producto: lección 2 incluye gramática en contexto. */
export const SIX_LESSON_LABEL_ES: Record<SixLessonKey, string> = {
  grammar: 'Gramática',
  vocabulary: 'Vocabulario / contexto',
  reading: 'Reading',
  listening: 'Listening',
};

/** Etiquetas UI para curso C1: 5 lecciones fijas (ids `c1-uN-g|v|r|l|w`…). */
export const SIX_LESSON_LABEL_ES_C1: Record<SixLessonKey, string> = {
  grammar: 'Gramática',
  vocabulary: 'Vocabulario',
  reading: 'Comprensión lectora',
  listening: 'Listening',
};

export interface SixLessonLayout {
  /** Ejercicios reordenados por franja (0→4) y, al final, cola no clasificada. */
  orderedExercises: Exercise[];
  lessonCounts: [number, number, number, number];
  lessonStarts: [number, number, number, number];
  /** Ítems no clasificados; se omiten para no contaminar las cuatro secciones. */
  tailCount: number;
}

const SLOT_BY_C1_LETTER: Record<string, number> = { g: 0, v: 1, r: 2, l: 3 };

function isSpeakingExercise(ex: Exercise): boolean {
  const id = (ex.id ?? '').trim();
  if (/^c1-u\d+-s\d+$/i.test(id)) return true;
  const tn = (ex.topicName || '').trim().toLowerCase();
  if (tn === 'speaking') return true;
  const ty = (ex.type || '').toLowerCase();
  if (ty.includes('speaking') || ty === 'pronunciation' || ty === 'pronunciation-practice') {
    return true;
  }
  return false;
}

/** Orden dentro de franja C1: `c1-u3-g12` → 12 (para unidades con >9 ítems por lección). */
export function getC1LessonItemOrder(id: string | undefined): number | null {
  const m = (id ?? '').trim().match(/^c1-u\d+-[gvrwl](\d+)$/i);
  return m ? parseInt(m[1], 10) : null;
}

function detectLessonSlot(ex: Exercise): number | null {
  if (isSpeakingExercise(ex)) return null;

  const id = (ex.id ?? '').trim();
  if (/^c1-u\d+-[gvrlw]\d+$/i.test(id)) {
    const m = id.match(/^c1-u\d+-([gvrlw])\d+$/i);
    if (m) return SLOT_BY_C1_LETTER[m[1].toLowerCase()] ?? null;
  }

  // Preferir ids -lN- (A1–C2) para no mezclar grammar_context (-l2-) con Grammar.
  const mL = id.match(/-l([1-6])-/i);
  if (mL) {
    const n = parseInt(mL[1], 10);
    if (n >= 1 && n <= 4) return n - 1;
    return null;
  }

  const tn = (ex.topicName || '').trim().toLowerCase();
  if (tn === 'grammar') return 0;
  if (tn === 'vocabulary' || tn === 'grammar_context' || tn === 'grammar context') return 1;
  if (tn === 'reading') return 2;
  if (tn === 'listening') return 3;
  if (tn === 'writing') return null;

  const ty = (ex.type || '').toLowerCase();
  if (ty.includes('reading')) return 2;
  if (ty.includes('listening')) return 3;
  if (ty === 'writing' || ty.includes('writing')) return null;
  return null;
}

export function buildSixLessonLayout(exercises: Exercise[]): SixLessonLayout {
  const buckets: Exercise[][] = [[], [], [], []];
  const tail: Exercise[] = [];

  for (const ex of exercises) {
    if (isSpeakingExercise(ex)) continue;
    const slot = detectLessonSlot(ex);
    if (slot !== null && slot >= 0 && slot < PEDAGOGICAL_LESSON_COUNT) {
      buckets[slot].push(ex);
    } else {
      tail.push(ex);
    }
  }

  // Los ejercicios sin sección identificable no se mezclan con Listening.

  for (let i = 0; i < PEDAGOGICAL_LESSON_COUNT; i++) {
    buckets[i].sort((a, b) => {
      const oa = getC1LessonItemOrder(a.id);
      const ob = getC1LessonItemOrder(b.id);
      if (oa !== null && ob !== null && oa !== ob) return oa - ob;
      return 0;
    });
  }

  const lessonCounts = buckets.map((b) => b.length) as [number, number, number, number];

  const lessonStarts: [number, number, number, number] = [0, 0, 0, 0];
  let acc = 0;
  for (let i = 0; i < PEDAGOGICAL_LESSON_COUNT; i++) {
    lessonStarts[i] = acc;
    acc += lessonCounts[i];
  }

  return {
    orderedExercises: buckets.flat(),
    lessonCounts,
    lessonStarts,
    tailCount: tail.length,
  };
}

/** Índice de franja 0–4 para un índice global en `orderedExercises`. */
export function getSixLessonSlotAtGlobalIndex(layout: SixLessonLayout, globalIndex: number): number {
  for (let k = 0; k < PEDAGOGICAL_LESSON_COUNT; k++) {
    const start = layout.lessonStarts[k];
    const count = layout.lessonCounts[k];
    if (globalIndex >= start && globalIndex < start + count) {
      return k;
    }
  }
  return 0;
}

export interface SixLessonNavState {
  lessonSlot: number;
  /** 1–4 para el usuario */
  lessonNumber: number;
  lessonLabelEs: string;
  exerciseInLesson: number;
  exercisesInThisLesson: number;
  totalPedagogicalLessons: number;
}

export function getSixLessonNavState(
  layout: SixLessonLayout,
  globalIndex: number,
  labels: Record<SixLessonKey, string> = SIX_LESSON_LABEL_ES
): SixLessonNavState {
  const slot = getSixLessonSlotAtGlobalIndex(layout, globalIndex);
  const start = layout.lessonStarts[slot];
  const count = layout.lessonCounts[slot];
  const exerciseInLesson = globalIndex - start + 1;
  return {
    lessonSlot: slot,
    lessonNumber: slot + 1,
    lessonLabelEs: labels[SIX_LESSON_KEYS[slot]],
    exerciseInLesson,
    exercisesInThisLesson: Math.max(1, count),
    totalPedagogicalLessons: PEDAGOGICAL_LESSON_COUNT,
  };
}

/** Tras completar un ejercicio: ¿cerramos franja (no es el último de la unidad)? */
export function shouldShowSixLessonCompleteInterstitial(
  layout: SixLessonLayout,
  globalIndex: number,
  totalExercises: number
): boolean {
  if (globalIndex < 0 || globalIndex >= totalExercises - 1) return false;
  const slot = getSixLessonSlotAtGlobalIndex(layout, globalIndex);
  const start = layout.lessonStarts[slot];
  const count = layout.lessonCounts[slot];
  if (count === 0) return false;
  return globalIndex === start + count - 1;
}
