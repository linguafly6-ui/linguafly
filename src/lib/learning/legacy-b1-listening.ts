/**
 * Canonical legacy B1 Listening source.
 *
 * The 60 lesson modules are the authoritative source for the original listening
 * questions and transcripts. Keep this adapter separate from the newer JSON
 * course units so the two curricula can be compared without overwriting either.
 */
import { UNIT_1_LESSON_4_LISTENING } from "@/lib/course/b1/unit-1-lesson-4-listening";
import { UNIT_2_LESSON_4_LISTENING } from "@/lib/course/b1/unit-2-lesson-4-listening";
import { UNIT_3_LESSON_4_LISTENING } from "@/lib/course/b1/unit-3-lesson-4-listening";
import { UNIT_4_LESSON_4_LISTENING } from "@/lib/course/b1/unit-4-lesson-4-listening";
import { UNIT_5_LESSON_4_LISTENING } from "@/lib/course/b1/unit-5-lesson-4-listening";
import { UNIT_6_LESSON_4_LISTENING } from "@/lib/course/b1/unit-6-lesson-4-listening";
import { UNIT_7_LESSON_4_LISTENING } from "@/lib/course/b1/unit-7-lesson-4-listening";
import { UNIT_8_LESSON_4_LISTENING } from "@/lib/course/b1/unit-8-lesson-4-listening";
import { UNIT_9_LESSON_4_LISTENING } from "@/lib/course/b1/unit-9-lesson-4-listening";
import { UNIT_10_LESSON_4_LISTENING } from "@/lib/course/b1/unit-10-lesson-4-listening";
import { UNIT_11_LESSON_4_LISTENING } from "@/lib/course/b1/unit-11-lesson-4-listening";
import { UNIT_12_LESSON_4_LISTENING } from "@/lib/course/b1/unit-12-lesson-4-listening";
import { UNIT_13_LESSON_4_LISTENING } from "@/lib/course/b1/unit-13-lesson-4-listening";
import { UNIT_14_LESSON_4_LISTENING } from "@/lib/course/b1/unit-14-lesson-4-listening";
import { UNIT_15_LESSON_4_LISTENING } from "@/lib/course/b1/unit-15-lesson-4-listening";
import { UNIT_16_LESSON_4_LISTENING } from "@/lib/course/b1/unit-16-lesson-4-listening";
import { UNIT_17_LESSON_4_LISTENING } from "@/lib/course/b1/unit-17-lesson-4-listening";
import { UNIT_18_LESSON_4_LISTENING } from "@/lib/course/b1/unit-18-lesson-4-listening";
import { UNIT_19_LESSON_4_LISTENING } from "@/lib/course/b1/unit-19-lesson-4-listening";
import { UNIT_20_LESSON_4_LISTENING } from "@/lib/course/b1/unit-20-lesson-4-listening";
import { UNIT_21_LESSON_4_LISTENING } from "@/lib/course/b1/unit-21-lesson-4-listening";
import { UNIT_22_LESSON_4_LISTENING } from "@/lib/course/b1/unit-22-lesson-4-listening";
import { UNIT_23_LESSON_4_LISTENING } from "@/lib/course/b1/unit-23-lesson-4-listening";
import { UNIT_24_LESSON_4_LISTENING } from "@/lib/course/b1/unit-24-lesson-4-listening";
import { UNIT_25_LESSON_4_LISTENING } from "@/lib/course/b1/unit-25-lesson-4-listening";
import { UNIT_26_LESSON_4_LISTENING } from "@/lib/course/b1/unit-26-lesson-4-listening";
import { UNIT_27_LESSON_4_LISTENING } from "@/lib/course/b1/unit-27-lesson-4-listening";
import { UNIT_28_LESSON_4_LISTENING } from "@/lib/course/b1/unit-28-lesson-4-listening";
import { UNIT_29_LESSON_4_LISTENING } from "@/lib/course/b1/unit-29-lesson-4-listening";
import { UNIT_30_LESSON_4_LISTENING } from "@/lib/course/b1/unit-30-lesson-4-listening";
import { UNIT_31_LESSON_4_LISTENING } from "@/lib/course/b1/unit-31-lesson-4-listening";
import { UNIT_32_LESSON_4_LISTENING } from "@/lib/course/b1/unit-32-lesson-4-listening";
import { UNIT_33_LESSON_4_LISTENING } from "@/lib/course/b1/unit-33-lesson-4-listening";
import { UNIT_34_LESSON_4_LISTENING } from "@/lib/course/b1/unit-34-lesson-4-listening";
import { UNIT_35_LESSON_4_LISTENING } from "@/lib/course/b1/unit-35-lesson-4-listening";
import { UNIT_36_LESSON_4_LISTENING } from "@/lib/course/b1/unit-36-lesson-4-listening";
import { UNIT_37_LESSON_4_LISTENING } from "@/lib/course/b1/unit-37-lesson-4-listening";
import { UNIT_38_LESSON_4_LISTENING } from "@/lib/course/b1/unit-38-lesson-4-listening";
import { UNIT_39_LESSON_4_LISTENING } from "@/lib/course/b1/unit-39-lesson-4-listening";
import { UNIT_40_LESSON_4_LISTENING } from "@/lib/course/b1/unit-40-lesson-4-listening";
import { UNIT_41_LESSON_4_LISTENING } from "@/lib/course/b1/unit-41-lesson-4-listening";
import { UNIT_42_LESSON_4_LISTENING } from "@/lib/course/b1/unit-42-lesson-4-listening";
import { UNIT_43_LESSON_4_LISTENING } from "@/lib/course/b1/unit-43-lesson-4-listening";
import { UNIT_44_LESSON_4_LISTENING } from "@/lib/course/b1/unit-44-lesson-4-listening";
import { UNIT_45_LESSON_4_LISTENING } from "@/lib/course/b1/unit-45-lesson-4-listening";
import { UNIT_46_LESSON_4_LISTENING } from "@/lib/course/b1/unit-46-lesson-4-listening";
import { UNIT_47_LESSON_4_LISTENING } from "@/lib/course/b1/unit-47-lesson-4-listening";
import { UNIT_48_LESSON_4_LISTENING } from "@/lib/course/b1/unit-48-lesson-4-listening";
import { UNIT_49_LESSON_4_LISTENING } from "@/lib/course/b1/unit-49-lesson-4-listening";
import { UNIT_50_LESSON_4_LISTENING } from "@/lib/course/b1/unit-50-lesson-4-listening";
import { UNIT_51_LESSON_4_LISTENING } from "@/lib/course/b1/unit-51-lesson-4-listening";
import { UNIT_52_LESSON_4_LISTENING } from "@/lib/course/b1/unit-52-lesson-4-listening";
import { UNIT_53_LESSON_4_LISTENING } from "@/lib/course/b1/unit-53-lesson-4-listening";
import { UNIT_54_LESSON_4_LISTENING } from "@/lib/course/b1/unit-54-lesson-4-listening";
import { UNIT_55_LESSON_4_LISTENING } from "@/lib/course/b1/unit-55-lesson-4-listening";
import { UNIT_56_LESSON_4_LISTENING } from "@/lib/course/b1/unit-56-lesson-4-listening";
import { UNIT_57_LESSON_4_LISTENING } from "@/lib/course/b1/unit-57-lesson-4-listening";
import { UNIT_58_LESSON_4_LISTENING } from "@/lib/course/b1/unit-58-lesson-4-listening";
import { UNIT_59_LESSON_4_LISTENING } from "@/lib/course/b1/unit-59-lesson-4-listening";
import { UNIT_60_LESSON_4_LISTENING } from "@/lib/course/b1/unit-60-lesson-4-listening";

export type LegacyB1ListeningQuestion = {
  question: string;
  options: string[];
  correctAnswer: number | string;
  explanation?: string;
};

export type LegacyB1ListeningExercise = {
  id: string;
  type?: string;
  transcript?: string;
  content?: {
    questions?: LegacyB1ListeningQuestion[];
  };
};

const listeningByUnit: Record<number, LegacyB1ListeningExercise[]> = {
  1: UNIT_1_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  2: UNIT_2_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  3: UNIT_3_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  4: UNIT_4_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  5: UNIT_5_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  6: UNIT_6_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  7: UNIT_7_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  8: UNIT_8_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  9: UNIT_9_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  10: UNIT_10_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  11: UNIT_11_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  12: UNIT_12_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  13: UNIT_13_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  14: UNIT_14_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  15: UNIT_15_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  16: UNIT_16_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  17: UNIT_17_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  18: UNIT_18_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  19: UNIT_19_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  20: UNIT_20_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  21: UNIT_21_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  22: UNIT_22_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  23: UNIT_23_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  24: UNIT_24_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  25: UNIT_25_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  26: UNIT_26_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  27: UNIT_27_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  28: UNIT_28_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  29: UNIT_29_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  30: UNIT_30_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  31: UNIT_31_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  32: UNIT_32_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  33: UNIT_33_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  34: UNIT_34_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  35: UNIT_35_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  36: UNIT_36_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  37: UNIT_37_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  38: UNIT_38_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  39: UNIT_39_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  40: UNIT_40_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  41: UNIT_41_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  42: UNIT_42_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  43: UNIT_43_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  44: UNIT_44_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  45: UNIT_45_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  46: UNIT_46_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  47: UNIT_47_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  48: UNIT_48_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  49: UNIT_49_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  50: UNIT_50_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  51: UNIT_51_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  52: UNIT_52_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  53: UNIT_53_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  54: UNIT_54_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  55: UNIT_55_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  56: UNIT_56_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  57: UNIT_57_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  58: UNIT_58_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  59: UNIT_59_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
  60: UNIT_60_LESSON_4_LISTENING as unknown as LegacyB1ListeningExercise[],
};

export function getLegacyB1ListeningExercises(unitNumber: number): LegacyB1ListeningExercise[] {
  return listeningByUnit[unitNumber] ?? [];
}
