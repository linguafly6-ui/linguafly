import { gradeExercise, type GradeResult } from "@/lib/learning/grading";

type JsonRecord = Record<string, unknown>;

function parseConfig(value: unknown, field: string): JsonRecord {
  if (typeof value !== "string") {
    throw new Error(`Invalid ${field} configuration.`);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`Malformed ${field} configuration.`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`Invalid ${field} configuration.`);
  }
  return parsed as JsonRecord;
}

export type PublishedExerciseGrade = GradeResult & {
  exerciseId: string;
  gradingStrategy: string;
};

/**
 * Loads the private answer key and registry strategy inside the server boundary,
 * then grades a published exercise. Never return the loaded answer-key record.
 */
export async function gradePublishedExercise(
  db: D1Database,
  exerciseId: string,
  submitted: unknown
): Promise<PublishedExerciseGrade | null> {
  const row = await db.prepare(
    `SELECT
       e.id AS exercise_id,
       e.points,
       t.grading_strategy,
       t.supports_auto_grading,
       ak.answer_config_json,
       ak.normalization_config_json,
       ak.scoring_config_json,
       ak.correct_feedback,
       ak.incorrect_feedback
     FROM exercises e
     INNER JOIN exercise_type_registry t ON t.id = e.exercise_type_id
     INNER JOIN exercise_answer_keys ak ON ak.exercise_id = e.id
     WHERE e.id = ?
       AND e.status = 'published'
       AND t.status = 'active'
     LIMIT 1`
  ).bind(exerciseId).first<{
    exercise_id: string;
    points: number;
    grading_strategy: string;
    supports_auto_grading: number;
    answer_config_json: string;
    normalization_config_json: string;
    scoring_config_json: string;
    correct_feedback: string | null;
    incorrect_feedback: string | null;
  }>();

  if (!row || row.supports_auto_grading !== 1) return null;

  const scoring = parseConfig(row.scoring_config_json, "scoring");
  if (typeof scoring.maxScore !== "number") {
    scoring.maxScore = row.points;
  }

  const result = gradeExercise({
    strategy: row.grading_strategy,
    submitted,
    answerConfig: parseConfig(row.answer_config_json, "answer"),
    normalizationConfig: parseConfig(row.normalization_config_json, "normalization"),
    scoringConfig: scoring,
    correctFeedback: row.correct_feedback,
    incorrectFeedback: row.incorrect_feedback,
  });

  return {
    exerciseId: row.exercise_id,
    gradingStrategy: row.grading_strategy,
    ...result,
  };
}
