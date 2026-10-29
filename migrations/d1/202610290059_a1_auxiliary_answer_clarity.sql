-- Make do/does/don't/doesn't practice ask for the auxiliary only.
DELETE FROM learning_exercise_progress WHERE exercise_id IN ('a1-u38-gra-01', 'a1-u38-gra-03', 'a1-u38-gra-05', 'a1-u38-gra-07', 'a1-u38-gra-10', 'a1-u38-gra-11', 'a1-u38-gra-13', 'a1-u38-gra-15', 'a1-u39-gra-01', 'a1-u39-gra-05', 'a1-u39-gra-07', 'a1-u39-gra-10', 'a1-u39-gra-13', 'a1-u39-gra-15', 'a1-u40-gra-01', 'a1-u40-gra-05', 'a1-u40-gra-07', 'a1-u40-gra-10', 'a1-u40-gra-13', 'a1-u40-gra-15');
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
I ______ watch TV on Mondays.', options_json = '[]', answer_json = '{"correct":"don''t","accepted":["do not"]}', explanation = 'La palabra que completa la frase es “don''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-01';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
We ______ exercise every day.', options_json = '[]', answer_json = '{"correct":"don''t","accepted":["do not"]}', explanation = 'La palabra que completa la frase es “don''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-03';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
I ______ clean the house on weekdays.', options_json = '["clean","do","don''t"]', answer_json = '{"correct":"don''t","accepted":["do not"]}', explanation = 'La palabra que completa la frase es “don''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-05';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
I ______ watch TV on Mondays.', options_json = '["Do","clean","don''t"]', answer_json = '{"correct":"don''t","accepted":["do not"]}', explanation = 'La palabra que completa la frase es “don''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
I ______ clean the house on weekdays.', options_json = '[]', answer_json = '{"correct":"don''t","accepted":["do not"]}', explanation = 'La palabra que completa la frase es “don''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
We ______ exercise every day.', options_json = '[]', answer_json = '{"correct":"don''t","accepted":["do not"]}', explanation = 'La palabra que completa la frase es “don''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-11';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
I ______ clean the house on weekdays.', options_json = '["don''t","clean","do"]', answer_json = '{"correct":"don''t","accepted":["do not"]}', explanation = 'La palabra que completa la frase es “don''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-13';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
I ______ watch TV on Mondays.', options_json = '["don''t","don''t","Do"]', answer_json = '{"correct":"don''t","accepted":["do not"]}', explanation = 'La palabra que completa la frase es “don''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-15';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
She ______ teach on Sundays.', options_json = '[]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-01';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
He ______ wake early on weekends.', options_json = '["wake","Does","sleeps"]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-05';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
She ______ teach on Sundays.', options_json = '["drives","wake","doesn''t"]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
He ______ wake early on weekends.', options_json = '[]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
He ______ wake early on weekends.', options_json = '["doesn''t","wake","Does"]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-13';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
She ______ teach on Sundays.', options_json = '["doesn''t","sleeps","drives"]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-15';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
She ______ teach on Sundays.', options_json = '[]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-01';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
He ______ wake early on weekends.', options_json = '["wake","Does","sleeps"]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-05';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
She ______ teach on Sundays.', options_json = '["drives","wake","doesn''t"]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
He ______ wake early on weekends.', options_json = '[]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
He ______ wake early on weekends.', options_json = '["doesn''t","wake","Does"]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-13';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa con do, does, don''t o doesn''t.
She ______ teach on Sundays.', options_json = '["doesn''t","sleeps","drives"]', answer_json = '{"correct":"doesn''t","accepted":["does not"]}', explanation = 'La palabra que completa la frase es “doesn''t”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-15';

