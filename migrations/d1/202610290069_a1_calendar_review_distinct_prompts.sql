-- Keep the calendar review unit's day/date examples distinct.
UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «el lunes»?',
 options_json = '["on Monday","in Monday","at Monday","by Monday"]',
 answer_json = '{"correct":"on Monday"}',
 explanation = 'Usamos «on» con los días de la semana.'
WHERE id = 'a1-u56-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «el martes»?',
 options_json = '["on Tuesday","in Tuesday","at Tuesday","by Tuesday"]',
 answer_json = '{"correct":"on Tuesday"}',
 explanation = 'Usamos «on» con los días de la semana.'
WHERE id = 'a1-u56-voc-14';

-- Restore the duplicate-prompt guard after all calendar prompts have been realigned.
CREATE TRIGGER IF NOT EXISTS trg_learning_exercises_no_duplicate_prompt_update
BEFORE UPDATE OF prompt, lesson_id, section_type ON learning_exercises
WHEN EXISTS (
  SELECT 1 FROM learning_exercises existing
  WHERE existing.id <> NEW.id
    AND existing.lesson_id = NEW.lesson_id
    AND existing.section_type = NEW.section_type
    AND lower(trim(existing.prompt)) = lower(trim(NEW.prompt))
)
BEGIN
  SELECT RAISE(ABORT, 'Duplicate exercise prompt in this lesson section');
END;
