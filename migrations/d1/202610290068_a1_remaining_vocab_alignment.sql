-- Correct remaining repeated A1 vocabulary prompts and align them with lesson objectives.

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «letra»?',
 options_json = '["letter","word","number","sentence"]',
 answer_json = '{"correct":"letter"}',
 explanation = '«Letter» significa «letra».'
WHERE id = 'a1-u01-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «sonido»?',
 options_json = '["color","sound","month","family"]',
 answer_json = '{"correct":"sound"}',
 explanation = '«Sound» significa «sonido».'
WHERE id = 'a1-u01-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «vocal»?',
 options_json = '["consonant","vowel","syllable","number"]',
 answer_json = '{"correct":"vowel"}',
 explanation = '«Vowel» significa «vocal».'
WHERE id = 'a1-u01-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «consonante»?',
 options_json = '["vowel","letter name","consonant","sentence"]',
 answer_json = '{"correct":"consonant"}',
 explanation = '«Consonant» significa «consonante».'
WHERE id = 'a1-u01-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige el pronombre personal que significa «yo».',
 options_json = '["I","you","he","she"]',
 answer_json = '{"correct":"I"}',
 explanation = '«I» significa «yo».'
WHERE id = 'a1-u25-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige el pronombre personal que significa «tú».',
 options_json = '["we","they","you","it"]',
 answer_json = '{"correct":"you"}',
 explanation = '«You» significa «tú» o «vosotros/ustedes».'
WHERE id = 'a1-u25-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige el pronombre personal que significa «él».',
 options_json = '["she","he","we","you"]',
 answer_json = '{"correct":"he"}',
 explanation = '«He» significa «él».'
WHERE id = 'a1-u25-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige el pronombre personal que significa «ella».',
 options_json = '["they","it","he","she"]',
 answer_json = '{"correct":"she"}',
 explanation = '«She» significa «ella».'
WHERE id = 'a1-u25-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué forma de «to be» se usa con «I»?',
 options_json = '["am","is","are","be"]',
 answer_json = '{"correct":"am"}',
 explanation = 'Usamos «I am».'
WHERE id = 'a1-u26-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué forma de «to be» se usa con «he»?',
 options_json = '["are","am","is","be"]',
 answer_json = '{"correct":"is"}',
 explanation = 'Usamos «he is».'
WHERE id = 'a1-u26-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué forma de «to be» se usa con «we»?',
 options_json = '["is","are","am","be"]',
 answer_json = '{"correct":"are"}',
 explanation = 'Usamos «we are».'
WHERE id = 'a1-u26-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Cuál es el infinitivo del verbo «ser/estar»?',
 options_json = '["am","is","are","be"]',
 answer_json = '{"correct":"be"}',
 explanation = '«Be» es la forma base del verbo «to be».'
WHERE id = 'a1-u26-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige la frase afirmativa correcta para «Yo soy estudiante».',
 options_json = '["I am a student","I are a student","I is a student","I be a student"]',
 answer_json = '{"correct":"I am a student"}',
 explanation = 'Con «I» usamos «am».'
WHERE id = 'a1-u27-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige la frase afirmativa correcta para «Ella es médica».',
 options_json = '["She are a doctor","She is a doctor","She am a doctor","She be a doctor"]',
 answer_json = '{"correct":"She is a doctor"}',
 explanation = 'Con «she» usamos «is».'
WHERE id = 'a1-u27-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige la frase afirmativa correcta para «Ellos son amigos».',
 options_json = '["They is friends","They am friends","They are friends","They be friends"]',
 answer_json = '{"correct":"They are friends"}',
 explanation = 'Con «they» usamos «are».'
WHERE id = 'a1-u27-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige la frase afirmativa correcta para «Nosotros estamos aquí».',
 options_json = '["We is here","We are here","We am here","We be here"]',
 answer_json = '{"correct":"We are here"}',
 explanation = 'Con «we» usamos «are».'
WHERE id = 'a1-u27-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «dígito»?',
 options_json = '["digit","letter","price","date"]',
 answer_json = '{"correct":"digit"}',
 explanation = '«Digit» significa «dígito».'
WHERE id = 'a1-u55-voc-11';

