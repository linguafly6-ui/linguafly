-- Give the greeting, farewell and introduction lessons vocabulary that matches their objectives.
-- Preserve exercise IDs and lesson structure while replacing the repeated vocabulary block.

UPDATE learning_exercises SET
 prompt = 'Elige la expresión en inglés que corresponde a «Gracias».',
 options_json = '["Please","Thank you","Goodbye","Good morning"]',
 answer_json = '{"correct":"Thank you"}',
 explanation = '«Thank you» significa «Gracias».'
WHERE id = 'a1-u03-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige la expresión en inglés que corresponde a «Por favor».',
 options_json = '["Please","Sorry","Hello","Good night"]',
 answer_json = '{"correct":"Please"}',
 explanation = '«Please» significa «Por favor» y se usa para pedir algo con cortesía.'
WHERE id = 'a1-u03-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige la expresión en inglés que corresponde a «Lo siento».',
 options_json = '["You''re welcome","Good afternoon","Sorry","See you"]',
 answer_json = '{"correct":"Sorry"}',
 explanation = '«Sorry» significa «Lo siento» o «Perdón».'
WHERE id = 'a1-u03-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige la respuesta natural a «Thank you».',
 options_json = '["My name is Ana","You''re welcome","Good morning","See you tomorrow"]',
 answer_json = '{"correct":"You''re welcome"}',
 explanation = '«You’re welcome» es una respuesta habitual a «Thank you»: «De nada».'
WHERE id = 'a1-u03-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige la expresión en inglés que significa «Me llamo Ana».',
 options_json = '["I am fine","My name is Ana","I am from Ana","Good night"]',
 answer_json = '{"correct":"My name is Ana"}',
 explanation = '«My name is Ana» significa «Me llamo Ana».'
WHERE id = 'a1-u04-voc-11';

UPDATE learning_exercises SET
 prompt = 'Completa la presentación: «Hello, ___ name is Leo».',
 options_json = '["my","your","his","her"]',
 answer_json = '{"correct":"my"}',
 explanation = 'Usamos «my name» para decir «mi nombre».'
WHERE id = 'a1-u04-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Cómo te llamas?»?',
 options_json = '["How old are you?","What is your name?","Where are you?","How are you?"]',
 answer_json = '{"correct":"What is your name?"}',
 explanation = '«What is your name?» pregunta el nombre de una persona.'
WHERE id = 'a1-u04-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige la expresión que significa «Encantado/a de conocerte».',
 options_json = '["Nice to meet you","See you later","I am sorry","Good night"]',
 answer_json = '{"correct":"Nice to meet you"}',
 explanation = '«Nice to meet you» se usa al conocer a alguien por primera vez.'
WHERE id = 'a1-u04-voc-14';
