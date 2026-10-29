-- Replace repeated grammar prompts in units 38–40 with distinct A1 examples.
-- Rows are updated in place, preserving exercise counts and learner progress.
UPDATE learning_exercises
SET prompt = CASE id
  WHEN 'a1-u38-gra-07' THEN 'Completa la frase: They ______ play tennis after school.'
  WHEN 'a1-u38-gra-10' THEN 'Completa la frase: My friends ______ eat meat.'
  WHEN 'a1-u38-gra-13' THEN 'Completa la frase: We ______ go to bed late.'
  WHEN 'a1-u38-gra-15' THEN 'Completa la frase: I ______ drink coffee at night.'
  WHEN 'a1-u39-gra-07' THEN 'Completa la frase: My sister ______ drive to work.'
  WHEN 'a1-u39-gra-10' THEN 'Completa la frase: Peter ______ cook on weekdays.'
  WHEN 'a1-u39-gra-13' THEN 'Completa la frase: The shop ______ open on Sundays.'
  WHEN 'a1-u39-gra-15' THEN 'Completa la frase: Anna ______ speak French at home.'
  WHEN 'a1-u40-gra-07' THEN 'Completa la frase: Our teacher ______ work on Saturdays.'
  WHEN 'a1-u40-gra-10' THEN 'Completa la frase: Mark ______ watch television in the morning.'
  WHEN 'a1-u40-gra-13' THEN 'Completa la frase: The children ______ walk to school.'
  WHEN 'a1-u40-gra-15' THEN 'Completa la frase: Julia ______ study late at night.'
  ELSE prompt
END
WHERE id IN (
  'a1-u38-gra-07','a1-u38-gra-10','a1-u38-gra-13','a1-u38-gra-15',
  'a1-u39-gra-07','a1-u39-gra-10','a1-u39-gra-13','a1-u39-gra-15',
  'a1-u40-gra-07','a1-u40-gra-10','a1-u40-gra-13','a1-u40-gra-15'
);

-- Answers depend on the subject in each replacement sentence.
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
  WHEN 'a1-u40-gra-13' THEN '{"correct":"don't","accepted":["do not"]}'
  WHEN 'a1-u40-gra-15' THEN '{"correct":"doesn't","accepted":["does not"]}'
  ELSE answer_json
END
WHERE id IN (
  'a1-u38-gra-07','a1-u38-gra-10','a1-u38-gra-13','a1-u38-gra-15',
  'a1-u39-gra-07','a1-u39-gra-10','a1-u39-gra-13','a1-u39-gra-15',
  'a1-u40-gra-07','a1-u40-gra-10','a1-u40-gra-13','a1-u40-gra-15'
);

-- Keep the choices relevant and eliminate duplicate choices in these rows.
UPDATE learning_exercises
SET options_json = '["don''t","doesn''t"]'
WHERE id IN (
  'a1-u38-gra-07','a1-u38-gra-10','a1-u38-gra-13','a1-u38-gra-15',
  'a1-u39-gra-07','a1-u39-gra-10','a1-u39-gra-13','a1-u39-gra-15',
  'a1-u40-gra-07','a1-u40-gra-10','a1-u40-gra-13','a1-u40-gra-15'
);

-- Reject future duplicate prompts on inserts.
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

-- Reject edits that would introduce duplicate prompts.
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
