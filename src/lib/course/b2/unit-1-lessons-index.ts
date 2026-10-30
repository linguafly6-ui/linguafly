/**
 * Índice de las 4 secciones de la Unidad 1 (B2).
 */

import { Exercise } from '@/lib/exercise-generator';
import { UNIT_1_LESSON_1_GRAMMAR } from './unit-1-lesson-1-grammar';
import { UNIT_1_LESSON_2_VOCABULARY } from './unit-1-lesson-2-vocabulary';
import { UNIT_1_LESSON_3_READING } from './unit-1-lesson-3-reading';
import { UNIT_1_LESSON_4_LISTENING } from './unit-1-lesson-4-listening';

export const UNIT_1_LESSONS = {
  grammar: UNIT_1_LESSON_1_GRAMMAR,
  vocabulary: UNIT_1_LESSON_2_VOCABULARY,
  reading: UNIT_1_LESSON_3_READING,
  listening: UNIT_1_LESSON_4_LISTENING,
} as const;

export const UNIT_1_ALL_LESSONS: Exercise[][] = [
  UNIT_1_LESSON_1_GRAMMAR.slice(0, 15),
  UNIT_1_LESSON_2_VOCABULARY.slice(0, 15),
  UNIT_1_LESSON_3_READING,
  UNIT_1_LESSON_4_LISTENING,
];

export const UNIT_1_ALL_EXERCISES: Exercise[] = UNIT_1_ALL_LESSONS.flat();
