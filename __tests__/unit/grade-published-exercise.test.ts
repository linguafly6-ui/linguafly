import { gradePublishedExercise } from "@/lib/learning/grade-published-exercise";

function databaseReturning(row: unknown): D1Database {
  const first = jest.fn().mockResolvedValue(row);
  const bind = jest.fn(() => ({ first }));
  const prepare = jest.fn(() => ({ bind }));
  return { prepare } as unknown as D1Database;
}

const validRow = {
  exercise_id: "ex_1",
  points: 2,
  grading_strategy: "accepted_answers",
  supports_auto_grading: 1,
  answer_config_json: JSON.stringify({ correct: "colour", acceptableAnswers: ["color"] }),
  normalization_config_json: JSON.stringify({}),
  scoring_config_json: JSON.stringify({}),
  correct_feedback: "Correct",
  incorrect_feedback: "Try again",
};

describe("gradePublishedExercise", () => {
  it("loads the private key and registry strategy and applies exercise points", async () => {
    const result = await gradePublishedExercise(
      databaseReturning(validRow),
      "ex_1",
      "COLOR"
    );

    expect(result).toEqual({
      exerciseId: "ex_1",
      gradingStrategy: "accepted_answers",
      isCorrect: true,
      score: 2,
      maxScore: 2,
      feedback: "Correct",
    });
  });

  it("does not grade exercises without an eligible published key", async () => {
    expect(await gradePublishedExercise(databaseReturning(null), "missing", "x")).toBeNull();
    expect(await gradePublishedExercise(
      databaseReturning({ ...validRow, supports_auto_grading: 0 }),
      "ex_1",
      "colour"
    )).toBeNull();
  });

  it("rejects malformed private grading configuration", async () => {
    await expect(gradePublishedExercise(
      databaseReturning({ ...validRow, answer_config_json: "not-json" }),
      "ex_1",
      "colour"
    )).rejects.toThrow("Malformed answer configuration");
  });
});
