export type GradeResult = {
  isCorrect: boolean;
  score: number;
  maxScore: number;
  feedback: string | null;
};

type JsonRecord = Record<string, unknown>;

function record(value: unknown): JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function normalizeText(value: string, config: JsonRecord): string {
  let result = value.normalize("NFKC");
  if (config.trim !== false) result = result.trim();
  if (config.collapseWhitespace !== false) result = result.replace(/\s+/g, " ");
  if (config.caseSensitive !== true) result = result.toLocaleLowerCase("en-GB");
  if (config.ignoreTerminalPunctuation === true) result = result.replace(/[.!?]+$/u, "");
  return result;
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function equalText(actual: unknown, expected: unknown, normalization: JsonRecord): boolean {
  if (typeof actual !== "string" || typeof expected !== "string") return false;
  return normalizeText(actual, normalization) === normalizeText(expected, normalization);
}

function clampScore(value: number, max: number): number {
  return Math.min(max, Math.max(0, Number.isFinite(value) ? value : 0));
}

/**
 * Deterministic server-side grader. Only the caller may load answerConfig from
 * exercise_answer_keys; never pass that record to a client response.
 *
 * Supported strategies deliberately have explicit contracts. Unknown strategies
 * fail closed rather than silently accepting or guessing an answer format.
 */
export function gradeExercise(input: {
  strategy: string;
  submitted: unknown;
  answerConfig: unknown;
  normalizationConfig?: unknown;
  scoringConfig?: unknown;
  correctFeedback?: string | null;
  incorrectFeedback?: string | null;
}): GradeResult {
  const answer = record(input.answerConfig);
  const normalization = record(input.normalizationConfig);
  const scoring = record(input.scoringConfig);
  const maxScore = typeof scoring.maxScore === "number" && scoring.maxScore > 0
    ? scoring.maxScore
    : 1;
  let isCorrect = false;

  switch (input.strategy) {
    case "exact_match":
    case "accepted_answers": {
      const expected = [
        ...strings(answer.correct),
        ...strings(answer.acceptableAnswers),
        ...strings(answer.acceptable_answers),
        ...strings(answer.alternatives),
      ];
      isCorrect = expected.some((candidate) => equalText(input.submitted, candidate, normalization));
      break;
    }
    case "single_choice": {
      const expected = strings(answer.correctOptionKeys ?? answer.correct_option_keys);
      isCorrect = typeof input.submitted === "string" && expected.includes(input.submitted);
      break;
    }
    case "boolean": {
      const expected = answer.correct;
      isCorrect = typeof input.submitted === "boolean" && typeof expected === "boolean" && input.submitted === expected;
      break;
    }
    case "ordered_sequence": {
      const expected = answer.correctSequence ?? answer.correct_sequence;
      if (Array.isArray(input.submitted) && Array.isArray(expected) &&
          input.submitted.length === expected.length) {
        isCorrect = input.submitted.every((item, index) =>
          typeof item === "string" && typeof expected[index] === "string" &&
          equalText(item, expected[index], normalization));
      }
      break;
    }
    case "matching_pairs": {
      const expected = answer.correctPairs ?? answer.correct_pairs;
      if (Array.isArray(input.submitted) && Array.isArray(expected) &&
          input.submitted.length === expected.length) {
        const key = (item: unknown) => {
          const pair = record(item);
          return typeof pair.left === "string" && typeof pair.right === "string"
            ? normalizeText(pair.left, normalization) + "\u0000" + normalizeText(pair.right, normalization)
            : null;
        };
        const expectedKeys = expected.map(key);
        const submittedKeys = input.submitted.map(key);
        isCorrect = expectedKeys.every((value) => value !== null && submittedKeys.includes(value)) &&
          submittedKeys.every((value) => value !== null && expectedKeys.includes(value));
      }
      break;
    }
    default:
      throw new Error(`Unsupported grading strategy: ${input.strategy}`);
  }

  const score = isCorrect ? maxScore : 0;
  return {
    isCorrect,
    score: clampScore(score, maxScore),
    maxScore,
    feedback: isCorrect
      ? (input.correctFeedback ?? null)
      : (input.incorrectFeedback ?? null),
  };
}
