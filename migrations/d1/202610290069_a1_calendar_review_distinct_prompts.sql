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
