-- Audit published A1 exercises for exact duplicate prompts within the same section.
-- The report query is intentionally read-only; content substitutions are scoped by known IDs.
-- Prevent further duplicate prompts being inserted for the A1 course via a validation trigger.
CREATE INDEX IF NOT EXISTS idx_learning_exercises_lesson_section_number
  ON learning_exercises(lesson_id, section_type, exercise_number);

-- Replace repeated grammar prompts in units 38–40 with distinct A1 examples.
-- No exercise rows are deleted, so each section retains its existing exercise count.
UPDATE learning_exercises
SET prompt = CASE id
  WHEN 'a1-u38-gra-07' THEN 'Completa con don''t o doesn''t: They ______ play tennis after school.'
  WHEN 'a1-u38-gra-10' THEN 'Completa con don''t o doesn''t: My friends ______ eat meat.'
  WHEN 'a1-u38-gra-13' THEN 'Completa con don''t o doesn''t: We ______ go to bed late.'
  WHEN 'a1-u38-gra-15' THEN 'Completa con don''t o doesn''t: I ______ drink coffee at night.'
  WHEN 'a1-u39-gra-07' THEN 'Completa con don''t o doesn''t: My sister ______ drive to work.'
  WHEN 'a1-u39-gra-10' THEN 'Completa con don''t o doesn''t: Peter ______ cook on weekdays.'
  WHEN 'a1-u39-gra-13' THEN 'Completa con don''t o doesn''t: The shop ______ open on Sundays.'
  WHEN 'a1-u39-gra-15' THEN 'Completa con don''t o doesn''t: Anna ______ speak French at home.'
  WHEN 'a1-u40-gra-07' THEN 'Completa con don''t o doesn''t: Our teacher ______ work on Saturdays.'
  WHEN 'a1-u40-gra-10' THEN 'Completa con don''t o doesn''t: Mark ______ watch television in the morning.'
  WHEN 'a1-u40-gra-13' THEN 'Completa con don''t o doesn''t: The children ______ walk to school.'
  WHEN 'a1-u40-gra-15' THEN 'Completa con don''t o doesn''t: Julia ______ study late at night.'
  ELSE prompt
END
WHERE id IN (
  'a1-u38-gra-07','a1-u38-gra-10','a1-u38-gra-13','a1-u38-gra-15',
  'a1-u39-gra-07','a1-u39-gra-10','a1-u39-gra-13','a1-u39-gra-15',
  'a1-u40-gra-07','a1-u40-gra-10','a1-u40-gra-13','a1-u40-gra-15'
);

UPDATE learning_exercises
SET answer_json = CASE id
  WHEN 'a1-u38-gra-07' THEN '{"correct":"don''t","accepted":["do not"]}'
  WHEN 'a1-u38-gra-10' THEN '{"correct":"don''t","accepted":["do not"]}'
  WHEN 'a1-u38-gra-13' THEN '{"correct":"don''t","accepted":["do not"]}'
  WHEN 'a1-u38-gra-15' THEN '{"correct":"don''t","accepted":["do not"]}'
  WHEN 'a1-u39-gra-07' THEN '{"correct":"doesn''t","accepted":["does not"]}'
  WHEN 'a1-u39-gra-10' THEN '{"correct":"doesn''t","accepted":["does not"]}'
  WHEN 'a1-u39-gra-13' THEN '{"correct":"doesn''t","accepted":["does not"]}'
  WHEN 'a1-u39-gra-15' THEN '{"correct":"doesn''t","accepted":["does not"]}'
  WHEN 'a1-u40-gra-07' THEN '{"correct":"doesn''t","accepted":["does not"]}'
  WHEN 'a1-u40-gra-10' THEN '{"correct":"doesn''t","accepted":["does not"]}'
  WHEN 'a1-u40-gra-13' THEN '{"correct":"don''t","accepted":["do not"]}'
  WHEN 'a1-u40-gra-15' THEN '{"correct":"doesn''t","accepted":["does not"]}'
  ELSE answer_json
END
WHERE id IN (
  'a1-u38-gra-07','a1-u38-gra-10','a1-u38-gra-13','a1-u38-gra-15',
  'a1-u39-gra-07','a1-u39-gra-10','a1-u39-gra-13','a1-u39-gra-15',
  'a1-u40-gra-07','a1-u40-gra-10','a1-u40-gra-13','a1-u40-gra-15'
);

-- Normalize repeated answer choices in the same affected rows to a consistent set.
UPDATE learning_exercises
SET options_json = CASE
  WHEN id LIKE 'a1-u38-%' THEN '["don''t","doesn''t"]'
  ELSE '["don''t","doesn''t"]'
END
WHERE id IN (
  'a1-u38-gra-07','a1-u38-gra-10','a1-u38-gra-13','a1-u38-gra-15',
  'a1-u39-gra-07','a1-u39-gra-10','a1-u39-gra-13','a1-u39-gra-15',
  'a1-u40-gra-07','a1-u40-gra-10','a1-u40-gra-13','a1-u40-gra-15'
);

-- Reject future duplicate prompts in a lesson and section. Intentional repeated
-- grammar forms are allowed only when the sentence/prompt differs.
CREATE TRIGGER IF NOT EXISTS trg_learning_exercises_no_duplicate_prompt
BEFORE INSERT ON learning_exercises
WHEN EXISTS (
  SELECT 1 FROM learning_exercises existing
  WHERE existing.lesson_id = NEW.lesson_id
    AND existing.section_type = NEW.section_type
    AND lower(trim(existing.prompt)) = lower(trim(NEW.prompt))
)
BEGIN
  SELECT RAISE(ABORT, 'Duplicate exercise prompt in this lesson section');
END;
