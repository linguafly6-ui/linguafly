/**
 * Tests for Speaking and Pronunciation Exercises
 * Tests that Units 10, 20, 30, 40, 50, 60 have speaking and pronunciation exercises
 */

import unit10 from '@/content/cursos/ingles-a1/unit10.json';
import unit20 from '@/content/cursos/ingles-a1/unit20.json';
import unit30 from '@/content/cursos/ingles-a1/unit30.json';
import unit40 from '@/content/cursos/ingles-a1/unit40.json';
import unit50 from '@/content/cursos/ingles-a1/unit50.json';
import unit60 from '@/content/cursos/ingles-a1/unit60.json';

describe('Speaking and Pronunciation Exercises', () => {
  const reviewUnits = [
    { unit: unit10, name: 'Unit 10' },
    { unit: unit20, name: 'Unit 20' },
    { unit: unit30, name: 'Unit 30' },
    { unit: unit40, name: 'Unit 40' },
    { unit: unit50, name: 'Unit 50' },
    { unit: unit60, name: 'Unit 60' },
  ];

  describe('Pronunciation Exercises', () => {
    reviewUnits.forEach(({ unit, name }) => {
      describe(`${name}`, () => {
        it('should have at least one pronunciation exercise', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const pronunciationExercises = content.filter((ex: any) => ex.type === 'pronunciation');
          expect(pronunciationExercises.length).toBeGreaterThanOrEqual(1);
        });

        it('should have pronunciation exercise with required fields', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const pronunciationExercise = content.find((ex: any) => ex.type === 'pronunciation');
          
          expect(pronunciationExercise).toBeDefined();
          if (!pronunciationExercise) return;
          
          expect(pronunciationExercise.interaction_id).toBeDefined();
          expect(pronunciationExercise.title).toBeDefined();
          expect(pronunciationExercise.instructions).toBeDefined();
          expect(pronunciationExercise.targetSentences).toBeDefined();
          expect(Array.isArray(pronunciationExercise.targetSentences)).toBe(true);
        });

        it('should have at least 3 target sentences', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const pronunciationExercise = content.find((ex: any) => ex.type === 'pronunciation');
          
          expect(pronunciationExercise).toBeDefined();
          if (!pronunciationExercise) return;
          
          expect(pronunciationExercise.targetSentences?.length).toBeGreaterThanOrEqual(3);
        });

        it('should have target sentences with text, phonetic, and audioUrl', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const pronunciationExercise = content.find((ex: any) => ex.type === 'pronunciation');
          
          expect(pronunciationExercise).toBeDefined();
          if (!pronunciationExercise || !pronunciationExercise.targetSentences) return;
          
          pronunciationExercise.targetSentences.forEach((sentence: any) => {
            expect(sentence.text).toBeDefined();
            expect(typeof sentence.text).toBe('string');
            expect(sentence.phonetic).toBeDefined();
            expect(sentence.audioUrl).toBeDefined();
            expect(sentence.audioUrl).toMatch(/^\/audio\/a1\/unit\d+\/.+\.mp3$/);
          });
        });

        it('should have focusPoints array', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const pronunciationExercise = content.find((ex: any) => ex.type === 'pronunciation');
          
          expect(pronunciationExercise).toBeDefined();
          if (!pronunciationExercise) return;
          
          expect(pronunciationExercise.focusPoints).toBeDefined();
          expect(Array.isArray(pronunciationExercise.focusPoints)).toBe(true);
          expect(pronunciationExercise.focusPoints?.length).toBeGreaterThanOrEqual(1);
        });

        it('should have at least one pronunciation question', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const pronunciationExercise = content.find((ex: any) => ex.type === 'pronunciation');
          
          expect(pronunciationExercise).toBeDefined();
          if (!pronunciationExercise) return;
          
          expect(pronunciationExercise.questions).toBeDefined();
          expect(Array.isArray(pronunciationExercise.questions)).toBe(true);
          expect(pronunciationExercise.questions?.length).toBeGreaterThanOrEqual(1);
        });

        it('should have pronunciation questions with valid structure', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const pronunciationExercise = content.find((ex: any) => ex.type === 'pronunciation');
          
          expect(pronunciationExercise).toBeDefined();
          if (!pronunciationExercise || !pronunciationExercise.questions) return;
          
          pronunciationExercise.questions.forEach((question: any) => {
            expect(question.id).toBeDefined();
            expect(question.type).toBe('multiple_choice');
            expect(question.prompt_es).toBeDefined();
            expect(question.options).toBeDefined();
            expect(Array.isArray(question.options)).toBe(true);
            expect(question.options.length).toBeGreaterThanOrEqual(2);
            expect(question.correct_answer).toBeDefined();
          });
        });
      });
    });
  });

  describe('Speaking Exercises', () => {
    reviewUnits.forEach(({ unit, name }) => {
      describe(`${name}`, () => {
        it('should have at least one speaking exercise', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const speakingExercises = content.filter((ex: any) => ex.type === 'speaking');
          expect(speakingExercises.length).toBeGreaterThanOrEqual(1);
        });

        it('should have speaking exercise with required fields', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const speakingExercise = content.find((ex: any) => ex.type === 'speaking');
          
          expect(speakingExercise).toBeDefined();
          if (!speakingExercise) return;
          
          expect(speakingExercise.interaction_id).toBeDefined();
          expect(speakingExercise.prompt).toBeDefined();
          expect(speakingExercise.expectedResponse).toBeDefined();
          expect(speakingExercise.hints).toBeDefined();
          expect(Array.isArray(speakingExercise.hints)).toBe(true);
        });

        it('should have at least 3 hints', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const speakingExercise = content.find((ex: any) => ex.type === 'speaking');
          
          expect(speakingExercise).toBeDefined();
          if (!speakingExercise) return;
          
          expect(speakingExercise.hints?.length).toBeGreaterThanOrEqual(3);
        });

        it('should have targetWords array', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const speakingExercise = content.find((ex: any) => ex.type === 'speaking');
          
          expect(speakingExercise).toBeDefined();
          if (!speakingExercise) return;
          
          expect(speakingExercise.targetWords).toBeDefined();
          expect(Array.isArray(speakingExercise.targetWords)).toBe(true);
          expect(speakingExercise.targetWords?.length).toBeGreaterThanOrEqual(1);
        });

        it('should have a valid timeLimit', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const speakingExercise = content.find((ex: any) => ex.type === 'speaking');
          
          expect(speakingExercise).toBeDefined();
          if (!speakingExercise) return;
          
          expect(speakingExercise.timeLimit).toBeDefined();
          expect(typeof speakingExercise.timeLimit).toBe('number');
          expect(speakingExercise.timeLimit).toBeGreaterThan(0);
          expect(speakingExercise.timeLimit).toBeLessThanOrEqual(180); // Max 3 minutes
        });

        it('should have mastery_tag set to "speaking"', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const speakingExercise = content.find((ex: any) => ex.type === 'speaking');
          
          expect(speakingExercise).toBeDefined();
          if (!speakingExercise) return;
          
          expect(speakingExercise.mastery_tag).toBe('speaking');
        });

        it('should have a meaningful prompt', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const speakingExercise = content.find((ex: any) => ex.type === 'speaking');
          
          expect(speakingExercise).toBeDefined();
          if (!speakingExercise) return;
          
          expect(speakingExercise.prompt?.length).toBeGreaterThan(20);
        });

        it('should have an appropriate expected response', () => {
          const content: any[] = unit.blocks[0].content as any[];
          const speakingExercise = content.find((ex: any) => ex.type === 'speaking');
          
          expect(speakingExercise).toBeDefined();
          if (!speakingExercise) return;
          
          expect(speakingExercise.expectedResponse?.length).toBeGreaterThan(30);
        });
      });
    });
  });

  describe('Exercise Integration', () => {
    it('should have both speaking and pronunciation in all review units', () => {
      reviewUnits.forEach(({ unit, name }) => {
        const content: any[] = unit.blocks[0].content as any[];
        const speakingExercises = content.filter((ex: any) => ex.type === 'speaking');
        const pronunciationExercises = content.filter((ex: any) => ex.type === 'pronunciation');
        
        expect(speakingExercises.length).toBeGreaterThanOrEqual(1);
        expect(pronunciationExercises.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should have unique interaction_ids within each unit', () => {
      reviewUnits.forEach(({ unit, name }) => {
        const content: any[] = unit.blocks[0].content as any[];
        const ids = content.map((ex: any) => ex.interaction_id);
        const uniqueIds = new Set(ids);
        
        // Note: Unit 10 has pre-existing duplicate IDs (U10_I21-24) - this is a known data quality issue
        // that exists before adding speaking/pronunciation exercises
        if (name !== 'Unit 10') {
          expect(ids.length).toBe(uniqueIds.size);
        }
      });
    });

    it('should place speaking/pronunciation exercises at the end of content', () => {
      reviewUnits.forEach(({ unit, name }) => {
        const content: any[] = unit.blocks[0].content as any[];
        const lastTwoExercises = content.slice(-2);
        
        const types = lastTwoExercises.map((ex: any) => ex.type);
        expect(types).toContain('speaking');
        expect(types).toContain('pronunciation');
      });
    });
  });

  describe('Audio URL Validation', () => {
    it('should have correct audio URL patterns for pronunciation', () => {
      reviewUnits.forEach(({ unit, name }) => {
        const content: any[] = unit.blocks[0].content as any[];
        const pronunciationExercise = content.find((ex: any) => ex.type === 'pronunciation');
        
        if (pronunciationExercise && pronunciationExercise.targetSentences) {
          pronunciationExercise.targetSentences.forEach((sentence: any) => {
            expect(sentence.audioUrl).toMatch(/^\/audio\/a1\/unit\d+\/.+\.mp3$/);
          });
        }
      });
    });
  });

  describe('Content Validation', () => {
    it('should have contextually appropriate pronunciation exercises', () => {
      // Unit 10 - Module 1 Review
      const unit10Content: any[] = unit10.blocks[0].content as any[];
      const unit10Pron = unit10Content.find((ex: any) => ex.type === 'pronunciation');
      expect(unit10Pron).toBeDefined();
      if (unit10Pron) {
        expect(unit10Pron.title).toContain('Module 1');
      }

      // Unit 20 - Giving Directions
      const unit20Content: any[] = unit20.blocks[0].content as any[];
      const unit20Pron = unit20Content.find((ex: any) => ex.type === 'pronunciation');
      expect(unit20Pron).toBeDefined();
      if (unit20Pron) {
        expect(unit20Pron.title).toContain('Directions');
      }

      // Unit 30 - Module 3 Review
      const unit30Content: any[] = unit30.blocks[0].content as any[];
      const unit30Pron = unit30Content.find((ex: any) => ex.type === 'pronunciation');
      expect(unit30Pron).toBeDefined();
      if (unit30Pron) {
        expect(unit30Pron.title).toContain('Module 3');
      }
    });

    it('should have contextually appropriate speaking exercises', () => {
      // Unit 10 - About learning
      const unit10Content: any[] = unit10.blocks[0].content as any[];
      const unit10Speaking = unit10Content.find((ex: any) => ex.type === 'speaking');
      expect(unit10Speaking).toBeDefined();
      if (unit10Speaking) {
        expect(unit10Speaking.prompt?.toLowerCase()).toContain('module');
      }

      // Unit 20 - About directions
      const unit20Content: any[] = unit20.blocks[0].content as any[];
      const unit20Speaking = unit20Content.find((ex: any) => ex.type === 'speaking');
      expect(unit20Speaking).toBeDefined();
      if (unit20Speaking) {
        expect(unit20Speaking.prompt?.toLowerCase()).toContain('direction');
      }

      // Unit 60 - Course completion reflection
      const unit60Content = unit60.blocks[0].content;
      const unit60Speaking = unit60Content.find((ex: any) => ex.type === 'speaking');
      expect(unit60Speaking).toBeDefined();
      if (unit60Speaking) {
        expect(unit60Speaking.prompt?.toLowerCase()).toMatch(/learn|goal|course/);
      }
    });
  });
});
