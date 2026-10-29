-- Remove repeated A1 grammar examples left by earlier bulk-seeding migrations.
-- Keep exercise IDs and section counts unchanged; answers remain the same because
-- each replacement preserves the grammatical target of the original exercise.

-- Units 1–4 previously reused the same am/are examples.
UPDATE learning_exercises SET prompt = 'Completa la frase. I ______ a student in this class.' WHERE id = 'a1-u01-gra-09';
UPDATE learning_exercises SET prompt = 'Completa la frase en negativo. You ______ ready for the test.' WHERE id = 'a1-u01-gra-10';
UPDATE learning_exercises SET prompt = 'Completa la frase. I ______ from Madrid.' WHERE id = 'a1-u02-gra-09';
UPDATE learning_exercises SET prompt = 'Completa la frase en negativo. You ______ late today.' WHERE id = 'a1-u02-gra-10';
UPDATE learning_exercises SET prompt = 'Completa la frase. I ______ happy to meet you.' WHERE id = 'a1-u03-gra-09';
UPDATE learning_exercises SET prompt = 'Completa la frase en negativo. You ______ in the wrong room.' WHERE id = 'a1-u03-gra-10';
UPDATE learning_exercises SET prompt = 'Completa la frase. I ______ twenty years old.' WHERE id = 'a1-u04-gra-09';
UPDATE learning_exercises SET prompt = 'Completa la frase en negativo. You ______ alone; we are here.' WHERE id = 'a1-u04-gra-10';

-- Vary repeated present-simple negative examples in units 38–40.
-- These are distinct from the corrections in migration 060 and preserve answers.
UPDATE learning_exercises SET prompt = 'Completa con do, does, don''t o doesn''t. I ______ eat fish.' WHERE id = 'a1-u38-gra-01';
UPDATE learning_exercises SET prompt = 'Completa con do, does, don''t o doesn''t. We ______ work on Sundays.' WHERE id = 'a1-u38-gra-03';
UPDATE learning_exercises SET prompt = 'Completa con do, does, don''t o doesn''t. I ______ clean my room every day.' WHERE id = 'a1-u38-gra-05';
UPDATE learning_exercises SET prompt = 'Completa con do, does, don''t o doesn''t. She ______ teach on Sundays.' WHERE id = 'a1-u39-gra-01';
UPDATE learning_exercises SET prompt = 'Completa con do, does, don''t o doesn''t. He ______ get up early on weekends.' WHERE id = 'a1-u39-gra-05';
UPDATE learning_exercises SET prompt = 'Completa con do, does, don''t o doesn''t. She ______ drive to work.' WHERE id = 'a1-u40-gra-01';
UPDATE learning_exercises SET prompt = 'Completa con do, does, don''t o doesn''t. He ______ cook dinner every night.' WHERE id = 'a1-u40-gra-05';

-- Remove duplicated example pairs in the later units while retaining answer targets.
UPDATE learning_exercises SET prompt = 'Completa la frase. I ______ like a cup of tea, please.' WHERE id = 'a1-u54-gra-09';
UPDATE learning_exercises SET prompt = 'Completa la frase. Could we ______ the menu, please?' WHERE id = 'a1-u54-gra-10';
UPDATE learning_exercises SET prompt = 'Completa la frase. How ______ is your little brother?' WHERE id = 'a1-u55-gra-09';
UPDATE learning_exercises SET prompt = 'Completa la frase. The ticket ______ fifteen euros.' WHERE id = 'a1-u55-gra-10';
UPDATE learning_exercises SET prompt = 'Completa la frase. How ______ is your cousin?' WHERE id = 'a1-u57-gra-09';
UPDATE learning_exercises SET prompt = 'Completa la frase. This ______ my grandparents' house.' WHERE id = 'a1-u57-gra-10';
UPDATE learning_exercises SET prompt = 'Completa la frase. You ______ drink more water when it is hot.' WHERE id = 'a1-u60-gra-09';
UPDATE learning_exercises SET prompt = 'Completa la frase. We ______ money ______ groceries every Friday.' WHERE id = 'a1-u60-gra-10';

-- Fix repeated options in the first units without changing the accepted answers.
UPDATE learning_exercises
SET options_json = CASE id
  WHEN 'a1-u01-gra-05' THEN '["aren''t","isn''t","am not"]'
  WHEN 'a1-u01-gra-07' THEN '["am not","is not","are not"]'
  WHEN 'a1-u02-gra-05' THEN '["aren''t","isn''t","am not"]'
  WHEN 'a1-u02-gra-07' THEN '["am not","is not","are not"]'
  WHEN 'a1-u03-gra-05' THEN '["aren''t","isn''t","am not"]'
  WHEN 'a1-u03-gra-07' THEN '["am not","is not","are not"]'
  WHEN 'a1-u04-gra-05' THEN '["aren''t","isn''t","am not"]'
  WHEN 'a1-u04-gra-07' THEN '["am not","is not","are not"]'
  ELSE options_json
END
WHERE id IN (
  'a1-u01-gra-05','a1-u01-gra-07','a1-u02-gra-05','a1-u02-gra-07',
  'a1-u03-gra-05','a1-u03-gra-07','a1-u04-gra-05','a1-u04-gra-07'
);
