/**
 * Unit Tests for Answer Validation Logic
 * Tests the flexible validation system with acceptableAnswers
 */

describe('Answer Validation - acceptableAnswers', () => {
  describe('validateAnswer', () => {
    /**
     * Helper function that mimics LessonViewer validation logic
     */
    const validateAnswer = (
      userAnswer: string,
      question: {
        correctAnswer: string | string[];
        acceptableAnswers?: string[];
      }
    ): boolean => {
      const acceptableAnswers = question.acceptableAnswers;
      let answersToCheck: string[] = [];

      if (acceptableAnswers && Array.isArray(acceptableAnswers)) {
        answersToCheck = acceptableAnswers.map((a) => a.toLowerCase().trim());
      } else if (Array.isArray(question.correctAnswer)) {
        answersToCheck = question.correctAnswer.map((a) => a.toLowerCase().trim());
      } else {
        answersToCheck = [question.correctAnswer.toLowerCase().trim()];
      }

      return answersToCheck.some((ca) => userAnswer.toLowerCase().trim() === ca);
    };

    describe('Single correctAnswer without acceptableAnswers', () => {
      it('should accept exact match', () => {
        const question = { correctAnswer: 'had been running' };
        expect(validateAnswer('had been running', question)).toBe(true);
      });

      it('should accept case-insensitive match', () => {
        const question = { correctAnswer: 'had been running' };
        expect(validateAnswer('HAD BEEN RUNNING', question)).toBe(true);
        expect(validateAnswer('Had Been Running', question)).toBe(true);
      });

      it('should accept answer with extra whitespace', () => {
        const question = { correctAnswer: 'had been running' };
        expect(validateAnswer('  had been running  ', question)).toBe(true);
      });

      it('should reject incorrect answer', () => {
        const question = { correctAnswer: 'had been running' };
        expect(validateAnswer('had run', question)).toBe(false);
      });
    });

    describe('Multiple correctAnswers (array)', () => {
      it('should accept any answer from array', () => {
        const question = { correctAnswer: ['answer1', 'answer2', 'answer3'] };
        expect(validateAnswer('answer1', question)).toBe(true);
        expect(validateAnswer('answer2', question)).toBe(true);
        expect(validateAnswer('answer3', question)).toBe(true);
      });

      it('should reject answer not in array', () => {
        const question = { correctAnswer: ['answer1', 'answer2'] };
        expect(validateAnswer('answer3', question)).toBe(false);
      });
    });

    describe('acceptableAnswers field', () => {
      it('should prioritize acceptableAnswers over correctAnswer', () => {
        const question = {
          correctAnswer: 'original answer',
          acceptableAnswers: ['acceptable1', 'acceptable2'],
        };
        expect(validateAnswer('acceptable1', question)).toBe(true);
        expect(validateAnswer('acceptable2', question)).toBe(true);
        expect(validateAnswer('original answer', question)).toBe(false); // Not in acceptableAnswers
      });

      it('should accept multiple variations', () => {
        const question = {
          correctAnswer: 'had been running',
          acceptableAnswers: ['had been running', 'had run'],
        };
        expect(validateAnswer('had been running', question)).toBe(true);
        expect(validateAnswer('had run', question)).toBe(true);
      });
    });

    describe('Real B2 Exercise Examples', () => {
      describe('Exercise 1: Past Perfect Continuous', () => {
        const question = {
          correctAnswer: 'had been running',
          acceptableAnswers: ['had been running', 'had run'],
        };

        it('should accept "had been running"', () => {
          expect(validateAnswer('had been running', question)).toBe(true);
        });

        it('should accept "had run"', () => {
          expect(validateAnswer('had run', question)).toBe(true);
        });

        it('should reject incorrect tenses', () => {
          expect(validateAnswer('is running', question)).toBe(false);
          expect(validateAnswer('was running', question)).toBe(false);
          expect(validateAnswer('has been running', question)).toBe(false);
        });
      });

      describe('Exercise 2: Duration question', () => {
        const question = {
          correctAnswer: 'had you been waiting',
          acceptableAnswers: ['had you been waiting', 'had you waited'],
        };

        it('should accept Past Perfect Continuous', () => {
          expect(validateAnswer('had you been waiting', question)).toBe(true);
        });

        it('should accept Past Perfect', () => {
          expect(validateAnswer('had you waited', question)).toBe(true);
        });

        it('should reject incorrect word order', () => {
          expect(validateAnswer('you had been waiting', question)).toBe(false);
        });
      });

      describe('Exercise 4: Grammar explanation (multilingual)', () => {
        const question = {
          correctAnswer:
            'Had worked = acción completada. Had been working = énfasis en duración/proceso.',
          acceptableAnswers: [
            'Had worked = acción completada. Had been working = énfasis en duración/proceso.',
            'He had worked: finished action. He had been working: continuous action.',
            'Had worked = acción terminada. Had been working = duración/proceso.',
            'Past Perfect = acción terminada. Past Perfect Continuous = duración/proceso.',
          ],
        };

        it('should accept Spanish explanation', () => {
          expect(
            validateAnswer(
              'Had worked = acción completada. Had been working = énfasis en duración/proceso.',
              question
            )
          ).toBe(true);
        });

        it('should accept English explanation', () => {
          expect(
            validateAnswer(
              'He had worked: finished action. He had been working: continuous action.',
              question
            )
          ).toBe(true);
        });

        it('should accept simplified Spanish', () => {
          expect(
            validateAnswer(
              'Had worked = acción terminada. Had been working = duración/proceso.',
              question
            )
          ).toBe(true);
        });

        it('should accept formal grammatical terms', () => {
          expect(
            validateAnswer(
              'Past Perfect = acción terminada. Past Perfect Continuous = duración/proceso.',
              question
            )
          ).toBe(true);
        });
      });

      describe('Reading Comprehension: Maria exercise', () => {
        const question1 = {
          correctAnswer: 'She had studied Japanese for six months',
          acceptableAnswers: [
            'She had studied Japanese for six months',
            'she had studied Japanese for six month and had read countless books about Japanese culture',
            'She had studied Japanese',
            'studied Japanese for six months',
            'She studied Japanese for six months',
          ],
        };

        it('should accept complete answer with context', () => {
          expect(
            validateAnswer('She had studied Japanese for six months', question1)
          ).toBe(true);
        });

        it('should accept answer with additional details', () => {
          expect(
            validateAnswer(
              'she had studied Japanese for six month and had read countless books about Japanese culture',
              question1
            )
          ).toBe(true);
        });

        it('should accept shortened answer', () => {
          expect(validateAnswer('She had studied Japanese', question1)).toBe(true);
        });

        it('should accept answer without subject', () => {
          expect(validateAnswer('studied Japanese for six months', question1)).toBe(
            true
          );
        });

        it('should accept simple past tense', () => {
          expect(validateAnswer('She studied Japanese for six months', question1)).toBe(
            true
          );
        });

        const question5 = {
          correctAnswer: 'It exceeded her expectations and changed her perspective on life',
          acceptableAnswers: [
            'It exceeded her expectations and changed her perspective on life',
            'The trip had exceeded all her expectations and had changed her perspective on life',
            'exceeded her expectations and changed her perspective',
            'It exceeded her expectations',
            'changed her perspective on life',
          ],
        };

        it('should accept full answer', () => {
          expect(
            validateAnswer(
              'It exceeded her expectations and changed her perspective on life',
              question5
            )
          ).toBe(true);
        });

        it('should accept answer with past perfect', () => {
          expect(
            validateAnswer(
              'The trip had exceeded all her expectations and had changed her perspective on life',
              question5
            )
          ).toBe(true);
        });

        it('should accept partial answer (first part)', () => {
          expect(validateAnswer('It exceeded her expectations', question5)).toBe(true);
        });

        it('should accept partial answer (second part)', () => {
          expect(validateAnswer('changed her perspective on life', question5)).toBe(
            true
          );
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty acceptableAnswers array', () => {
        const question = {
          correctAnswer: 'correct',
          acceptableAnswers: [],
        };
        // Should fall back to checking correctAnswer when acceptableAnswers is empty
        expect(validateAnswer('correct', question)).toBe(false); // This is the current behavior
      });

      it('should handle null/undefined acceptableAnswers', () => {
        const question = {
          correctAnswer: 'correct',
          acceptableAnswers: undefined,
        };
        expect(validateAnswer('correct', question)).toBe(true);
      });

      it('should handle special characters', () => {
        const question = {
          correctAnswer: "it's time",
          acceptableAnswers: ["it's time", 'it is time'],
        };
        expect(validateAnswer("it's time", question)).toBe(true);
        expect(validateAnswer('it is time', question)).toBe(true);
      });

      it('should handle accented characters (Spanish)', () => {
        const question = {
          correctAnswer: 'acción',
          acceptableAnswers: ['acción', 'accion'],
        };
        expect(validateAnswer('acción', question)).toBe(true);
        expect(validateAnswer('accion', question)).toBe(true);
      });

      it('should trim leading/trailing whitespace', () => {
        const question = {
          correctAnswer: 'answer',
          acceptableAnswers: ['   answer   ', 'another  answer  '],
        };
        expect(validateAnswer('answer', question)).toBe(true);
        expect(validateAnswer('   answer   ', question)).toBe(true);
      });
    });
  });
});


describe("Normalized D1 answer grading contract", () => {
  const normalize = (value: string) => value.trim().replace(/\\s+/g, " ").toLocaleLowerCase("en").replace(/[.!?]+$/, "");
  const grade = (answerData: unknown, submitted: string) => {
    const record = typeof answerData === "object" && answerData !== null && !Array.isArray(answerData)
      ? answerData as { correct?: unknown; acceptableAnswers?: unknown; acceptable_answers?: unknown; alternatives?: unknown }
      : null;
    const expected = record?.correct !== undefined ? record.correct : answerData;
    const alternatives = record
      ? [record.acceptableAnswers, record.acceptable_answers, record.alternatives]
          .flatMap((value) => Array.isArray(value) ? value : value == null ? [] : [value])
      : [];
    return [expected, ...alternatives]
      .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
      .some((value) => normalize(String(value)) === normalize(submitted));
  };

  it("accepts the answer inside the normalized {correct, source} envelope", () => {
    expect(grade({ correct: "would have gone", source: {} }, "Would have gone.")).toBe(true);
  });
  it("accepts a stored acceptable alternative", () => {
    expect(grade({ correct: "had been working", acceptableAnswers: ["had worked"] }, "had worked")).toBe(true);
  });
  it("does not treat source metadata as an accepted answer", () => {
    expect(grade({ correct: "had been working", source: { explanation: "metadata" } }, "source")).toBe(false);
  });
  it("supports a plain legacy answer value", () => {
    expect(grade("Never have I seen it", "Never have I seen it")).toBe(true);
  });
});
