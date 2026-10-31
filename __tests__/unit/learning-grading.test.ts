import { gradeExercise } from "@/lib/learning/grading";

describe("gradeExercise", () => {
  it("grades accepted text variants with British English normalization", () => {
    expect(gradeExercise({
      strategy: "accepted_answers",
      submitted: "  Colour. ",
      answerConfig: { correct: "color", acceptableAnswers: ["colour"] },
      normalizationConfig: { ignoreTerminalPunctuation: true },
    }).isCorrect).toBe(true);
  });

  it("grades option keys, not client-supplied option labels", () => {
    expect(gradeExercise({
      strategy: "single_choice",
      submitted: "opt_b",
      answerConfig: { correctOptionKeys: ["opt_b"] },
    }).isCorrect).toBe(true);
    expect(gradeExercise({
      strategy: "single_choice",
      submitted: "The correct answer",
      answerConfig: { correctOptionKeys: ["opt_b"] },
    }).isCorrect).toBe(false);
  });

  it("requires a boolean response for boolean strategy", () => {
    expect(gradeExercise({ strategy: "boolean", submitted: true, answerConfig: { correct: true } }).isCorrect).toBe(true);
    expect(gradeExercise({ strategy: "boolean", submitted: "true", answerConfig: { correct: true } }).isCorrect).toBe(false);
  });

  it("checks ordered sequences positionally", () => {
    expect(gradeExercise({
      strategy: "ordered_sequence", submitted: ["I", "am", "ready"],
      answerConfig: { correctSequence: ["I", "am", "ready"] },
    }).isCorrect).toBe(true);
    expect(gradeExercise({
      strategy: "ordered_sequence", submitted: ["am", "I", "ready"],
      answerConfig: { correctSequence: ["I", "am", "ready"] },
    }).isCorrect).toBe(false);
  });

  it("grades matching pairs without depending on pair order", () => {
    expect(gradeExercise({
      strategy: "matching_pairs",
      submitted: [{ left: "cat", right: "gato" }, { left: "dog", right: "perro" }],
      answerConfig: { correctPairs: [{ left: "dog", right: "perro" }, { left: "cat", right: "gato" }] },
    }).isCorrect).toBe(true);
  });

  it("returns configured score and feedback", () => {
    expect(gradeExercise({
      strategy: "exact_match", submitted: "hello", answerConfig: { correct: "hello" },
      scoringConfig: { maxScore: 2.5 }, correctFeedback: "¡Correcto!",
    })).toEqual({ isCorrect: true, score: 2.5, maxScore: 2.5, feedback: "¡Correcto!" });
  });

  it("fails closed for unknown strategies", () => {
    expect(() => gradeExercise({
      strategy: "ai_judge", submitted: "anything", answerConfig: { correct: "anything" },
    })).toThrow("Unsupported grading strategy");
  });

  it("does not accept an answer from source metadata", () => {
    expect(gradeExercise({
      strategy: "accepted_answers", submitted: "metadata",
      answerConfig: { correct: "working", source: { explanation: "metadata" } },
    }).isCorrect).toBe(false);
  });
});
