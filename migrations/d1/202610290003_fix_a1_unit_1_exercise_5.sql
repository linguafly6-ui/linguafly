-- Exercise prompts must not contain the answer before the learner responds.
UPDATE learning_exercises
SET prompt = 'Ana quiere presentarse diciendo su nombre. ¿Qué frase debería elegir?',
    options_json = '["Hello","My name is Ana","Goodbye","How do you spell it?"]',
    answer_json = '{"correct":"My name is Ana"}',
    explanation = '“My name is Ana” sirve para presentarte. “Hello” es el saludo.'
WHERE id = 'a1-01-ex-05';
