-- Keep duplicate-prompt prevention for both inserts and edits to existing exercises.
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
