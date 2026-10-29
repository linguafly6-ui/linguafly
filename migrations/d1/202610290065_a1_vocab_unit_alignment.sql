-- Align repeated A1 vocabulary exercises with the objectives of their lessons.
-- Keep existing exercise IDs and lesson structure; make each answer key match its options.

UPDATE learning_exercises SET
 prompt = 'Elige la expresión que sirve para saludar a alguien por primera vez.',
 options_json = '["Goodbye","Nice to meet you","Good night","See you"]',
 answer_json = '{"correct":"Nice to meet you"}',
 explanation = '«Nice to meet you» se usa al conocer a alguien por primera vez.'
WHERE id = 'a1-u06-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Cómo estás?»?',
 options_json = '["What is your name?","How are you?","Where are you?","How old are you?"]',
 answer_json = '{"correct":"How are you?"}',
 explanation = '«How are you?» sirve para preguntar cómo está una persona.'
WHERE id = 'a1-u06-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige una respuesta natural a «How are you?».',
 options_json = '["I am fine, thank you","Good night","My name is Ana","See you tomorrow"]',
 answer_json = '{"correct":"I am fine, thank you"}',
 explanation = '«I am fine, thank you» es una respuesta natural a «How are you?».'
WHERE id = 'a1-u06-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta sirve para pedir el nombre de alguien?',
 options_json = '["What is your name?","How are you?","Where is it?","How old is he?"]',
 answer_json = '{"correct":"What is your name?"}',
 explanation = '«What is your name?» se utiliza para preguntar el nombre.'
WHERE id = 'a1-u06-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Cero».',
 options_json = '["one","zero","three","five"]',
 answer_json = '{"correct":"zero"}',
 explanation = '«Zero» significa «cero».'
WHERE id = 'a1-u07-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Uno».',
 options_json = '["four","two","one","five"]',
 answer_json = '{"correct":"one"}',
 explanation = '«One» significa «uno».'
WHERE id = 'a1-u07-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Dos».',
 options_json = '["zero","three","two","four"]',
 answer_json = '{"correct":"two"}',
 explanation = '«Two» significa «dos».'
WHERE id = 'a1-u07-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Tres».',
 options_json = '["five","one","four","three"]',
 answer_json = '{"correct":"three"}',
 explanation = '«Three» significa «tres».'
WHERE id = 'a1-u07-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Seis».',
 options_json = '["seven","six","nine","ten"]',
 answer_json = '{"correct":"six"}',
 explanation = '«Six» significa «seis».'
WHERE id = 'a1-u08-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Siete».',
 options_json = '["eight","ten","seven","six"]',
 answer_json = '{"correct":"seven"}',
 explanation = '«Seven» significa «siete».'
WHERE id = 'a1-u08-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Ocho».',
 options_json = '["six","nine","eight","ten"]',
 answer_json = '{"correct":"eight"}',
 explanation = '«Eight» significa «ocho».'
WHERE id = 'a1-u08-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Nueve».',
 options_json = '["ten","seven","six","nine"]',
 answer_json = '{"correct":"nine"}',
 explanation = '«Nine» significa «nueve».'
WHERE id = 'a1-u08-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Once».',
 options_json = '["twelve","eleven","fourteen","thirteen"]',
 answer_json = '{"correct":"eleven"}',
 explanation = '«Eleven» significa «once».'
WHERE id = 'a1-u09-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Doce».',
 options_json = '["fifteen","thirteen","twelve","eleven"]',
 answer_json = '{"correct":"twelve"}',
 explanation = '«Twelve» significa «doce».'
WHERE id = 'a1-u09-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Trece».',
 options_json = '["fourteen","eleven","fifteen","thirteen"]',
 answer_json = '{"correct":"thirteen"}',
 explanation = '«Thirteen» significa «trece».'
WHERE id = 'a1-u09-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Catorce».',
 options_json = '["twelve","fourteen","thirteen","eleven"]',
 answer_json = '{"correct":"fourteen"}',
 explanation = '«Fourteen» significa «catorce».'
WHERE id = 'a1-u09-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Veinte».',
 options_json = '["thirty","forty","twenty","fifty"]',
 answer_json = '{"correct":"twenty"}',
 explanation = '«Twenty» significa «veinte».'
WHERE id = 'a1-u10-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Treinta».',
 options_json = '["fifty","thirty","twenty","forty"]',
 answer_json = '{"correct":"thirty"}',
 explanation = '«Thirty» significa «treinta».'
WHERE id = 'a1-u10-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Cuarenta».',
 options_json = '["forty","twenty","fifty","thirty"]',
 answer_json = '{"correct":"forty"}',
 explanation = '«Forty» significa «cuarenta».'
WHERE id = 'a1-u10-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Cincuenta».',
 options_json = '["twenty","fifty","thirty","forty"]',
 answer_json = '{"correct":"fifty"}',
 explanation = '«Fifty» significa «cincuenta».'
WHERE id = 'a1-u10-voc-14';
