// Static imports ensure the original A1 unit data is included in the server/Worker bundle.
import unit1 from "@/content/cursos/ingles-a1/unit1.json";
import unit2 from "@/content/cursos/ingles-a1/unit2.json";
import unit3 from "@/content/cursos/ingles-a1/unit3.json";
import unit4 from "@/content/cursos/ingles-a1/unit4.json";
import unit5 from "@/content/cursos/ingles-a1/unit5.json";
import unit6 from "@/content/cursos/ingles-a1/unit6.json";
import unit7 from "@/content/cursos/ingles-a1/unit7.json";
import unit8 from "@/content/cursos/ingles-a1/unit8.json";
import unit9 from "@/content/cursos/ingles-a1/unit9.json";
import unit10 from "@/content/cursos/ingles-a1/unit10.json";
import unit11 from "@/content/cursos/ingles-a1/unit11.json";
import unit12 from "@/content/cursos/ingles-a1/unit12.json";
import unit13 from "@/content/cursos/ingles-a1/unit13.json";
import unit14 from "@/content/cursos/ingles-a1/unit14.json";
import unit15 from "@/content/cursos/ingles-a1/unit15.json";
import unit16 from "@/content/cursos/ingles-a1/unit16.json";
import unit17 from "@/content/cursos/ingles-a1/unit17.json";
import unit18 from "@/content/cursos/ingles-a1/unit18.json";
import unit19 from "@/content/cursos/ingles-a1/unit19.json";
import unit20 from "@/content/cursos/ingles-a1/unit20.json";
import unit21 from "@/content/cursos/ingles-a1/unit21.json";
import unit22 from "@/content/cursos/ingles-a1/unit22.json";
import unit23 from "@/content/cursos/ingles-a1/unit23.json";
import unit24 from "@/content/cursos/ingles-a1/unit24.json";
import unit25 from "@/content/cursos/ingles-a1/unit25.json";
import unit26 from "@/content/cursos/ingles-a1/unit26.json";
import unit27 from "@/content/cursos/ingles-a1/unit27.json";
import unit28 from "@/content/cursos/ingles-a1/unit28.json";
import unit29 from "@/content/cursos/ingles-a1/unit29.json";
import unit30 from "@/content/cursos/ingles-a1/unit30.json";
import unit31 from "@/content/cursos/ingles-a1/unit31.json";
import unit32 from "@/content/cursos/ingles-a1/unit32.json";
import unit33 from "@/content/cursos/ingles-a1/unit33.json";
import unit34 from "@/content/cursos/ingles-a1/unit34.json";
import unit35 from "@/content/cursos/ingles-a1/unit35.json";
import unit36 from "@/content/cursos/ingles-a1/unit36.json";
import unit37 from "@/content/cursos/ingles-a1/unit37.json";
import unit38 from "@/content/cursos/ingles-a1/unit38.json";
import unit39 from "@/content/cursos/ingles-a1/unit39.json";
import unit40 from "@/content/cursos/ingles-a1/unit40.json";
import unit41 from "@/content/cursos/ingles-a1/unit41.json";
import unit42 from "@/content/cursos/ingles-a1/unit42.json";
import unit43 from "@/content/cursos/ingles-a1/unit43.json";
import unit44 from "@/content/cursos/ingles-a1/unit44.json";
import unit45 from "@/content/cursos/ingles-a1/unit45.json";
import unit46 from "@/content/cursos/ingles-a1/unit46.json";
import unit47 from "@/content/cursos/ingles-a1/unit47.json";
import unit48 from "@/content/cursos/ingles-a1/unit48.json";
import unit49 from "@/content/cursos/ingles-a1/unit49.json";
import unit50 from "@/content/cursos/ingles-a1/unit50.json";
import unit51 from "@/content/cursos/ingles-a1/unit51.json";
import unit52 from "@/content/cursos/ingles-a1/unit52.json";
import unit53 from "@/content/cursos/ingles-a1/unit53.json";
import unit54 from "@/content/cursos/ingles-a1/unit54.json";
import unit55 from "@/content/cursos/ingles-a1/unit55.json";
import unit56 from "@/content/cursos/ingles-a1/unit56.json";
import unit57 from "@/content/cursos/ingles-a1/unit57.json";
import unit58 from "@/content/cursos/ingles-a1/unit58.json";
import unit59 from "@/content/cursos/ingles-a1/unit59.json";
import unit60 from "@/content/cursos/ingles-a1/unit60.json";

export type A1LegacyItem = {
  interaction_id: string;
  type: string;
  mastery_tag: string;
  stimulus_en?: string;
  prompt_es?: string;
  question_en?: string;
  transcript?: string;
  options?: { id: string; text: string }[];
  correct_answer: string | string[] | boolean;
  explanation?: string;
};
export type A1LegacyUnit = {
  course: { unit_id: string; unit_title: string; level: string };
  blocks: { title: string; content: A1LegacyItem[] }[];
};

const units: Record<number, A1LegacyUnit> = {
  1: unit1 as unknown as LegacyUnit,
  2: unit2 as unknown as LegacyUnit,
  3: unit3 as unknown as LegacyUnit,
  4: unit4 as unknown as LegacyUnit,
  5: unit5 as unknown as LegacyUnit,
  6: unit6 as unknown as LegacyUnit,
  7: unit7 as unknown as LegacyUnit,
  8: unit8 as unknown as LegacyUnit,
  9: unit9 as unknown as LegacyUnit,
  10: unit10 as unknown as LegacyUnit,
  11: unit11 as unknown as LegacyUnit,
  12: unit12 as unknown as LegacyUnit,
  13: unit13 as unknown as LegacyUnit,
  14: unit14 as unknown as LegacyUnit,
  15: unit15 as unknown as LegacyUnit,
  16: unit16 as unknown as LegacyUnit,
  17: unit17 as unknown as LegacyUnit,
  18: unit18 as unknown as LegacyUnit,
  19: unit19 as unknown as LegacyUnit,
  20: unit20 as unknown as LegacyUnit,
  21: unit21 as unknown as LegacyUnit,
  22: unit22 as unknown as LegacyUnit,
  23: unit23 as unknown as LegacyUnit,
  24: unit24 as unknown as LegacyUnit,
  25: unit25 as unknown as LegacyUnit,
  26: unit26 as unknown as LegacyUnit,
  27: unit27 as unknown as LegacyUnit,
  28: unit28 as unknown as LegacyUnit,
  29: unit29 as unknown as LegacyUnit,
  30: unit30 as unknown as LegacyUnit,
  31: unit31 as unknown as LegacyUnit,
  32: unit32 as unknown as LegacyUnit,
  33: unit33 as unknown as LegacyUnit,
  34: unit34 as unknown as LegacyUnit,
  35: unit35 as unknown as LegacyUnit,
  36: unit36 as unknown as LegacyUnit,
  37: unit37 as unknown as LegacyUnit,
  38: unit38 as unknown as LegacyUnit,
  39: unit39 as unknown as LegacyUnit,
  40: unit40 as unknown as LegacyUnit,
  41: unit41 as unknown as LegacyUnit,
  42: unit42 as unknown as LegacyUnit,
  43: unit43 as unknown as LegacyUnit,
  44: unit44 as unknown as LegacyUnit,
  45: unit45 as unknown as LegacyUnit,
  46: unit46 as unknown as LegacyUnit,
  47: unit47 as unknown as LegacyUnit,
  48: unit48 as unknown as LegacyUnit,
  49: unit49 as unknown as LegacyUnit,
  50: unit50 as unknown as LegacyUnit,
  51: unit51 as unknown as LegacyUnit,
  52: unit52 as unknown as LegacyUnit,
  53: unit53 as unknown as LegacyUnit,
  54: unit54 as unknown as LegacyUnit,
  55: unit55 as unknown as LegacyUnit,
  56: unit56 as unknown as LegacyUnit,
  57: unit57 as unknown as LegacyUnit,
  58: unit58 as unknown as LegacyUnit,
  59: unit59 as unknown as LegacyUnit,
  60: unit60 as unknown as LegacyUnit,
};

export function getA1LegacyUnit(unitNumber: number): A1LegacyUnit | null {
  return units[unitNumber] ?? null;
}
