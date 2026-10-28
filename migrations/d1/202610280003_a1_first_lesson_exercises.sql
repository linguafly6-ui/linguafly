-- Enrich the first A1 lesson with a complete starter activity and answer keys.
-- Answer keys remain server-side and are never returned by the exercise listing endpoint.
UPDATE learning_lessons
SET content_json = '{"objective":"Reconocer las letras y algunos sonidos frecuentes del inglés y practicar cómo deletrear tu nombre.","sections":[{"type":"learn","title":"1. Las letras en inglés","body":"El alfabeto inglés tiene 26 letras. Algunas se llaman de forma distinta al español: A se pronuncia /eɪ/, E /iː/, I /aɪ/ y J /dʒeɪ/. No necesitas memorizarlo todo hoy: empieza por reconocer las letras de tu nombre."},{"type":"learn","title":"2. Deletrea tu nombre","body":"Para decir cómo se escribe tu nombre, puedes decir: “My name is Ana. A-N-A.” Pregunta “How do you spell it?” para preguntar cómo se deletrea algo."},{"type":"examples","title":"3. En una conversación","body":"A: What’s your name? B: My name is Leo. A: How do you spell it? B: L-E-O."},{"type":"practice","title":"4. Comprueba lo aprendido","body":"Responde a los ejercicios de abajo. Después de cada respuesta verás si has acertado y una breve explicación."}],"reviewEnabled":true}'
WHERE id = 'a1-01';

INSERT OR IGNORE INTO learning_exercises
(id, lesson_id, exercise_number, exercise_type, prompt, options_json, answer_json, explanation)
VALUES
('a1-01-ex-01', 'a1-01', 1, 'multiple_choice',
 '¿Cómo se llama la letra A en inglés?',
 '["Ah","Ei","Ay","Ar"]',
 '{"correct":"Ei"}',
 'La letra A se llama “A” y se pronuncia /eɪ/, parecido a “ei”.'),
('a1-01-ex-02', 'a1-01', 2, 'multiple_choice',
 '¿Qué pregunta significa «¿Cómo se deletrea?»?',
 '["How are you?","How do you spell it?","What is it?","Where are you?"]',
 '{"correct":"How do you spell it?"}',
 '“How do you spell it?” sirve para preguntar cómo se escribe una palabra letra por letra.'),
('a1-01-ex-03', 'a1-01', 3, 'multiple_choice',
 'Completa: “My ___ is Ana.”',
 '["name","spell","letter","hello"]',
 '{"correct":"name"}',
 '“My name is…” significa «Me llamo…» o literalmente «Mi nombre es…».'),
('a1-01-ex-04', 'a1-01', 4, 'multiple_choice',
 '¿Cuál es el deletreo correcto de LEO?',
 '["EL-O","L-E-O","LEO is","E-L-I"]',
 '{"correct":"L-E-O"}',
 'Al deletrear, se dicen los nombres de las letras por separado: L-E-O.'),
('a1-01-ex-05', 'a1-01', 5, 'multiple_choice',
 'Elige la respuesta natural a “What’s your name?”',
 '["I am fine, thanks.","My name is Sara.","Good night.","I am from Spain."]',
 '{"correct":"My name is Sara."}',
 '“What’s your name?” pregunta el nombre. Puedes responder “My name is…” o “I’m…”.');
