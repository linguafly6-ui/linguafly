-- Replace free-writing tasks in grammar with closed A1 practice and remove duplicate answer choices.
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas tardes».', explanation = '«Good afternoon» significa «Buenas tardes».' WHERE id = 'a1-u01-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (saludo)».', explanation = '«Good evening» significa «Buenas noches (saludo)».' WHERE id = 'a1-u01-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (despedida)».', explanation = '«Good night» significa «Buenas noches (despedida)».' WHERE id = 'a1-u01-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Adiós».', explanation = '«Goodbye» significa «Adiós».' WHERE id = 'a1-u01-voc-14';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u01-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u01-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u01-gra-10';
UPDATE learning_exercises SET options_json = '["am","is","are"]' WHERE id = 'a1-u01-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas tardes».', explanation = '«Good afternoon» significa «Buenas tardes».' WHERE id = 'a1-u02-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (saludo)».', explanation = '«Good evening» significa «Buenas noches (saludo)».' WHERE id = 'a1-u02-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (despedida)».', explanation = '«Good night» significa «Buenas noches (despedida)».' WHERE id = 'a1-u02-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Adiós».', explanation = '«Goodbye» significa «Adiós».' WHERE id = 'a1-u02-voc-14';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u02-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u02-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u02-gra-10';
UPDATE learning_exercises SET options_json = '["am","is","are"]' WHERE id = 'a1-u02-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas tardes».', explanation = '«Good afternoon» significa «Buenas tardes».' WHERE id = 'a1-u03-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (saludo)».', explanation = '«Good evening» significa «Buenas noches (saludo)».' WHERE id = 'a1-u03-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (despedida)».', explanation = '«Good night» significa «Buenas noches (despedida)».' WHERE id = 'a1-u03-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Adiós».', explanation = '«Goodbye» significa «Adiós».' WHERE id = 'a1-u03-voc-14';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u03-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u03-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u03-gra-10';
UPDATE learning_exercises SET options_json = '["am","is","are"]' WHERE id = 'a1-u03-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas tardes».', explanation = '«Good afternoon» significa «Buenas tardes».' WHERE id = 'a1-u04-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (saludo)».', explanation = '«Good evening» significa «Buenas noches (saludo)».' WHERE id = 'a1-u04-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (despedida)».', explanation = '«Good night» significa «Buenas noches (despedida)».' WHERE id = 'a1-u04-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Adiós».', explanation = '«Goodbye» significa «Adiós».' WHERE id = 'a1-u04-voc-14';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u04-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u04-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u04-gra-10';
UPDATE learning_exercises SET options_json = '["am","is","are"]' WHERE id = 'a1-u04-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hambriento/a».', explanation = '«Hungry» significa «Hambriento/a».' WHERE id = 'a1-u05-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sediento/a».', explanation = '«Thirsty» significa «Sediento/a».' WHERE id = 'a1-u05-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Enfadado/a».', explanation = '«Angry» significa «Enfadado/a».' WHERE id = 'a1-u05-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Enfermo/a».', explanation = '«Sick» significa «Enfermo/a».' WHERE id = 'a1-u05-voc-14';
UPDATE learning_exercises SET options_json = '["Are","am","is"]' WHERE id = 'a1-u05-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ you sick? (______ tú enfermo?)', options_json = '[]', answer_json = '{"correct":"Are"}', explanation = 'La palabra que completa la frase es “Are”. Léela dentro de la oración completa.' WHERE id = 'a1-u05-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ he sad? (______ él triste?)', options_json = '[]', answer_json = '{"correct":"Is"}', explanation = 'La palabra que completa la frase es “Is”. Léela dentro de la oración completa.' WHERE id = 'a1-u05-gra-10';
UPDATE learning_exercises SET options_json = '["am","Is","are"]' WHERE id = 'a1-u05-gra-13';
UPDATE learning_exercises SET options_json = '["are","am","is"]' WHERE id = 'a1-u05-gra-14';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u05-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas tardes».', explanation = '«Good afternoon» significa «Buenas tardes».' WHERE id = 'a1-u06-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (saludo)».', explanation = '«Good evening» significa «Buenas noches (saludo)».' WHERE id = 'a1-u06-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (despedida)».', explanation = '«Good night» significa «Buenas noches (despedida)».' WHERE id = 'a1-u06-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Adiós».', explanation = '«Goodbye» significa «Adiós».' WHERE id = 'a1-u06-voc-14';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u06-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u06-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u06-gra-10';
UPDATE learning_exercises SET options_json = '["am","is","are"]' WHERE id = 'a1-u06-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cuatro».', explanation = '«Four» significa «Cuatro».' WHERE id = 'a1-u07-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cinco».', explanation = '«Five» significa «Cinco».' WHERE id = 'a1-u07-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Bolígrafo».', explanation = '«Pen» significa «Bolígrafo».' WHERE id = 'a1-u07-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Libro».', explanation = '«Book» significa «Libro».' WHERE id = 'a1-u07-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There are ______ chairs. (Hay están ______ sillas.)', options_json = '[]', answer_json = '{"correct":"three"}', explanation = 'La palabra que completa la frase es “three”. Léela dentro de la oración completa.' WHERE id = 'a1-u07-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
That ______ is a red pen. (Ese ______ es un rojo bolígrafo.)', options_json = '[]', answer_json = '{"correct":"one"}', explanation = 'La palabra que completa la frase es “one”. Léela dentro de la oración completa.' WHERE id = 'a1-u07-gra-10';
UPDATE learning_exercises SET options_json = '["a","the","an"]' WHERE id = 'a1-u07-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cuatro».', explanation = '«Four» significa «Cuatro».' WHERE id = 'a1-u08-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cinco».', explanation = '«Five» significa «Cinco».' WHERE id = 'a1-u08-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Bolígrafo».', explanation = '«Pen» significa «Bolígrafo».' WHERE id = 'a1-u08-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Libro».', explanation = '«Book» significa «Libro».' WHERE id = 'a1-u08-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There are ______ chairs. (Hay están ______ sillas.)', options_json = '[]', answer_json = '{"correct":"three"}', explanation = 'La palabra que completa la frase es “three”. Léela dentro de la oración completa.' WHERE id = 'a1-u08-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
That ______ is a red pen. (Ese ______ es un rojo bolígrafo.)', options_json = '[]', answer_json = '{"correct":"one"}', explanation = 'La palabra que completa la frase es “one”. Léela dentro de la oración completa.' WHERE id = 'a1-u08-gra-10';
UPDATE learning_exercises SET options_json = '["a","the","an"]' WHERE id = 'a1-u08-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cincuenta».', explanation = '«Fifty» significa «Cincuenta».' WHERE id = 'a1-u09-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sesenta».', explanation = '«Sixty» significa «Sesenta».' WHERE id = 'a1-u09-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Setenta».', explanation = '«Seventy» significa «Setenta».' WHERE id = 'a1-u09-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ochenta».', explanation = '«Eighty» significa «Ochenta».' WHERE id = 'a1-u09-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u09-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u09-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cincuenta».', explanation = '«Fifty» significa «Cincuenta».' WHERE id = 'a1-u10-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sesenta».', explanation = '«Sixty» significa «Sesenta».' WHERE id = 'a1-u10-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Setenta».', explanation = '«Seventy» significa «Setenta».' WHERE id = 'a1-u10-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ochenta».', explanation = '«Eighty» significa «Ochenta».' WHERE id = 'a1-u10-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u10-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u10-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cincuenta».', explanation = '«Fifty» significa «Cincuenta».' WHERE id = 'a1-u11-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sesenta».', explanation = '«Sixty» significa «Sesenta».' WHERE id = 'a1-u11-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Setenta».', explanation = '«Seventy» significa «Setenta».' WHERE id = 'a1-u11-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ochenta».', explanation = '«Eighty» significa «Ochenta».' WHERE id = 'a1-u11-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u11-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u11-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cincuenta».', explanation = '«Fifty» significa «Cincuenta».' WHERE id = 'a1-u12-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sesenta».', explanation = '«Sixty» significa «Sesenta».' WHERE id = 'a1-u12-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Setenta».', explanation = '«Seventy» significa «Setenta».' WHERE id = 'a1-u12-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ochenta».', explanation = '«Eighty» significa «Ochenta».' WHERE id = 'a1-u12-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u12-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u12-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Jueves».', explanation = '«Thursday» significa «Jueves».' WHERE id = 'a1-u13-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Viernes».', explanation = '«Friday» significa «Viernes».' WHERE id = 'a1-u13-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sábado».', explanation = '«Saturday» significa «Sábado».' WHERE id = 'a1-u13-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Domingo».', explanation = '«Sunday» significa «Domingo».' WHERE id = 'a1-u13-voc-14';
UPDATE learning_exercises SET options_json = '["on","is","in"]' WHERE id = 'a1-u13-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you work ______ weekends? (Trabajas tú trabajas ______ fines de semana?)', options_json = '[]', answer_json = '{"correct":"on"}', explanation = 'La palabra que completa la frase es “on”. Léela dentro de la oración completa.' WHERE id = 'a1-u13-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Today ______ Wednesday. (Hoy ______ miércoles.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u13-gra-10';
UPDATE learning_exercises SET options_json = '["on","is","am"]' WHERE id = 'a1-u13-gra-13';
UPDATE learning_exercises SET options_json = '["in","from","on"]' WHERE id = 'a1-u13-gra-14';
UPDATE learning_exercises SET options_json = '["on","from","in"]' WHERE id = 'a1-u13-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Jueves».', explanation = '«Thursday» significa «Jueves».' WHERE id = 'a1-u14-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Viernes».', explanation = '«Friday» significa «Viernes».' WHERE id = 'a1-u14-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sábado».', explanation = '«Saturday» significa «Sábado».' WHERE id = 'a1-u14-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Domingo».', explanation = '«Sunday» significa «Domingo».' WHERE id = 'a1-u14-voc-14';
UPDATE learning_exercises SET options_json = '["on","is","in"]' WHERE id = 'a1-u14-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you work ______ weekends? (Trabajas tú trabajas ______ fines de semana?)', options_json = '[]', answer_json = '{"correct":"on"}', explanation = 'La palabra que completa la frase es “on”. Léela dentro de la oración completa.' WHERE id = 'a1-u14-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Today ______ Wednesday. (Hoy ______ miércoles.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u14-gra-10';
UPDATE learning_exercises SET options_json = '["on","is","am"]' WHERE id = 'a1-u14-gra-13';
UPDATE learning_exercises SET options_json = '["in","from","on"]' WHERE id = 'a1-u14-gra-14';
UPDATE learning_exercises SET options_json = '["on","from","in"]' WHERE id = 'a1-u14-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Jueves».', explanation = '«Thursday» significa «Jueves».' WHERE id = 'a1-u15-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Viernes».', explanation = '«Friday» significa «Viernes».' WHERE id = 'a1-u15-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sábado».', explanation = '«Saturday» significa «Sábado».' WHERE id = 'a1-u15-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Domingo».', explanation = '«Sunday» significa «Domingo».' WHERE id = 'a1-u15-voc-14';
UPDATE learning_exercises SET options_json = '["on","is","in"]' WHERE id = 'a1-u15-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you work ______ weekends? (Trabajas tú trabajas ______ fines de semana?)', options_json = '[]', answer_json = '{"correct":"on"}', explanation = 'La palabra que completa la frase es “on”. Léela dentro de la oración completa.' WHERE id = 'a1-u15-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Today ______ Wednesday. (Hoy ______ miércoles.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u15-gra-10';
UPDATE learning_exercises SET options_json = '["on","is","am"]' WHERE id = 'a1-u15-gra-13';
UPDATE learning_exercises SET options_json = '["in","from","on"]' WHERE id = 'a1-u15-gra-14';
UPDATE learning_exercises SET options_json = '["on","from","in"]' WHERE id = 'a1-u15-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Recuerdo».', explanation = '«Souvenir» significa «Recuerdo».' WHERE id = 'a1-u16-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Vacaciones».', explanation = '«Holiday» significa «Vacaciones».' WHERE id = 'a1-u16-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Relajación».', explanation = '«Relaxation» significa «Relajación».' WHERE id = 'a1-u16-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Aventura».', explanation = '«Adventure» significa «Aventura».' WHERE id = 'a1-u16-voc-14';
UPDATE learning_exercises SET options_json = '["were","was","is"]' WHERE id = 'a1-u16-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The people ______ very friendly and welcoming. (Los habitantes ______ muy amables y acogedores.)', options_json = '[]', answer_json = '{"correct":"were"}', explanation = 'La palabra que completa la frase es “were”. Léela dentro de la oración completa.' WHERE id = 'a1-u16-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The food ______ amazing — we ate fresh seafood every day! (La comida ______ increíble — comimos comimos mariscos frescos mariscos cada día!)', options_json = '[]', answer_json = '{"correct":"was"}', explanation = 'La palabra que completa la frase es “was”. Léela dentro de la oración completa.' WHERE id = 'a1-u16-gra-10';
UPDATE learning_exercises SET options_json = '["was","is","were"]' WHERE id = 'a1-u16-gra-13';
UPDATE learning_exercises SET options_json = '["were","was","are"]' WHERE id = 'a1-u16-gra-14';
UPDATE learning_exercises SET options_json = '["was","is","were"]' WHERE id = 'a1-u16-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Jueves».', explanation = '«Thursday» significa «Jueves».' WHERE id = 'a1-u17-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Viernes».', explanation = '«Friday» significa «Viernes».' WHERE id = 'a1-u17-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sábado».', explanation = '«Saturday» significa «Sábado».' WHERE id = 'a1-u17-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Domingo».', explanation = '«Sunday» significa «Domingo».' WHERE id = 'a1-u17-voc-14';
UPDATE learning_exercises SET options_json = '["on","is","in"]' WHERE id = 'a1-u17-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you work ______ weekends? (Trabajas tú trabajas ______ fines de semana?)', options_json = '[]', answer_json = '{"correct":"on"}', explanation = 'La palabra que completa la frase es “on”. Léela dentro de la oración completa.' WHERE id = 'a1-u17-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Today ______ Wednesday. (Hoy ______ miércoles.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u17-gra-10';
UPDATE learning_exercises SET options_json = '["on","is","am"]' WHERE id = 'a1-u17-gra-13';
UPDATE learning_exercises SET options_json = '["in","from","on"]' WHERE id = 'a1-u17-gra-14';
UPDATE learning_exercises SET options_json = '["on","from","in"]' WHERE id = 'a1-u17-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ir al trabajo».', explanation = '«Go to work» significa «Ir al trabajo».' WHERE id = 'a1-u18-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Almorzar».', explanation = '«Have lunch» significa «Almorzar».' WHERE id = 'a1-u18-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cenar».', explanation = '«Have dinner» significa «Cenar».' WHERE id = 'a1-u18-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Irse a la cama».', explanation = '«Go to bed» significa «Irse a la cama».' WHERE id = 'a1-u18-voc-14';
UPDATE learning_exercises SET options_json = '["go","Then","First"]' WHERE id = 'a1-u18-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ to work at nine. (Yo ______ al trabajo a las nueve.)', options_json = '[]', answer_json = '{"correct":"go"}', explanation = 'La palabra que completa la frase es “go”. Léela dentro de la oración completa.' WHERE id = 'a1-u18-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Finally, I ______ to bed at eleven. (Finalmente, yo ______ a la cama a las once.)', options_json = '[]', answer_json = '{"correct":"go"}', explanation = 'La palabra que completa la frase es “go”. Léela dentro de la oración completa.' WHERE id = 'a1-u18-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abril».', explanation = '«April» significa «Abril».' WHERE id = 'a1-u19-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Mayo».', explanation = '«May» significa «Mayo».' WHERE id = 'a1-u19-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Junio».', explanation = '«June» significa «Junio».' WHERE id = 'a1-u19-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Julio».', explanation = '«July» significa «Julio».' WHERE id = 'a1-u19-voc-14';
UPDATE learning_exercises SET options_json = '["When","in","on"]' WHERE id = 'a1-u19-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u19-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u19-gra-10';
UPDATE learning_exercises SET options_json = '["in","at","on"]' WHERE id = 'a1-u19-gra-13';
UPDATE learning_exercises SET options_json = '["on","in","at"]' WHERE id = 'a1-u19-gra-14';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abril».', explanation = '«April» significa «Abril».' WHERE id = 'a1-u20-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Mayo».', explanation = '«May» significa «Mayo».' WHERE id = 'a1-u20-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Junio».', explanation = '«June» significa «Junio».' WHERE id = 'a1-u20-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Julio».', explanation = '«July» significa «Julio».' WHERE id = 'a1-u20-voc-14';
UPDATE learning_exercises SET options_json = '["When","in","on"]' WHERE id = 'a1-u20-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u20-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u20-gra-10';
UPDATE learning_exercises SET options_json = '["in","at","on"]' WHERE id = 'a1-u20-gra-13';
UPDATE learning_exercises SET options_json = '["on","in","at"]' WHERE id = 'a1-u20-gra-14';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abril».', explanation = '«April» significa «Abril».' WHERE id = 'a1-u21-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Mayo».', explanation = '«May» significa «Mayo».' WHERE id = 'a1-u21-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Junio».', explanation = '«June» significa «Junio».' WHERE id = 'a1-u21-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Julio».', explanation = '«July» significa «Julio».' WHERE id = 'a1-u21-voc-14';
UPDATE learning_exercises SET options_json = '["When","in","on"]' WHERE id = 'a1-u21-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u21-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u21-gra-10';
UPDATE learning_exercises SET options_json = '["in","at","on"]' WHERE id = 'a1-u21-gra-13';
UPDATE learning_exercises SET options_json = '["on","in","at"]' WHERE id = 'a1-u21-gra-14';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abril».', explanation = '«April» significa «Abril».' WHERE id = 'a1-u22-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Mayo».', explanation = '«May» significa «Mayo».' WHERE id = 'a1-u22-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Junio».', explanation = '«June» significa «Junio».' WHERE id = 'a1-u22-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Julio».', explanation = '«July» significa «Julio».' WHERE id = 'a1-u22-voc-14';
UPDATE learning_exercises SET options_json = '["When","in","on"]' WHERE id = 'a1-u22-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u22-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u22-gra-10';
UPDATE learning_exercises SET options_json = '["in","at","on"]' WHERE id = 'a1-u22-gra-13';
UPDATE learning_exercises SET options_json = '["on","in","at"]' WHERE id = 'a1-u22-gra-14';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abril».', explanation = '«April» significa «Abril».' WHERE id = 'a1-u23-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Mayo».', explanation = '«May» significa «Mayo».' WHERE id = 'a1-u23-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Junio».', explanation = '«June» significa «Junio».' WHERE id = 'a1-u23-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Julio».', explanation = '«July» significa «Julio».' WHERE id = 'a1-u23-voc-14';
UPDATE learning_exercises SET options_json = '["When","in","on"]' WHERE id = 'a1-u23-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u23-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u23-gra-10';
UPDATE learning_exercises SET options_json = '["in","at","on"]' WHERE id = 'a1-u23-gra-13';
UPDATE learning_exercises SET options_json = '["on","in","at"]' WHERE id = 'a1-u23-gra-14';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abril».', explanation = '«April» significa «Abril».' WHERE id = 'a1-u24-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Mayo».', explanation = '«May» significa «Mayo».' WHERE id = 'a1-u24-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Junio».', explanation = '«June» significa «Junio».' WHERE id = 'a1-u24-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Julio».', explanation = '«July» significa «Julio».' WHERE id = 'a1-u24-voc-14';
UPDATE learning_exercises SET options_json = '["When","in","on"]' WHERE id = 'a1-u24-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u24-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u24-gra-10';
UPDATE learning_exercises SET options_json = '["in","at","on"]' WHERE id = 'a1-u24-gra-13';
UPDATE learning_exercises SET options_json = '["on","in","at"]' WHERE id = 'a1-u24-gra-14';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Nosotros».', explanation = '«We» significa «Nosotros».' WHERE id = 'a1-u25-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ellos/Ellas».', explanation = '«They» significa «Ellos/Ellas».' WHERE id = 'a1-u25-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «País».', explanation = '«Country» significa «País».' WHERE id = 'a1-u25-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «España».', explanation = '«Spain» significa «España».' WHERE id = 'a1-u25-voc-14';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u25-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ from Italy. (Ellos ______ de Italia.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u25-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It ______ a book. (Eso ______ un libro.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u25-gra-10';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u25-gra-13';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u25-gra-14';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u25-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Nosotros».', explanation = '«We» significa «Nosotros».' WHERE id = 'a1-u26-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ellos/Ellas».', explanation = '«They» significa «Ellos/Ellas».' WHERE id = 'a1-u26-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «País».', explanation = '«Country» significa «País».' WHERE id = 'a1-u26-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «España».', explanation = '«Spain» significa «España».' WHERE id = 'a1-u26-voc-14';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u26-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ from Italy. (Ellos ______ de Italia.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u26-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It ______ a book. (Eso ______ un libro.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u26-gra-10';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u26-gra-13';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u26-gra-14';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u26-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Nosotros».', explanation = '«We» significa «Nosotros».' WHERE id = 'a1-u27-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ellos/Ellas».', explanation = '«They» significa «Ellos/Ellas».' WHERE id = 'a1-u27-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «País».', explanation = '«Country» significa «País».' WHERE id = 'a1-u27-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «España».', explanation = '«Spain» significa «España».' WHERE id = 'a1-u27-voc-14';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u27-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ from Italy. (Ellos ______ de Italia.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u27-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It ______ a book. (Eso ______ un libro.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u27-gra-10';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u27-gra-13';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u27-gra-14';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u27-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hambriento/a».', explanation = '«Hungry» significa «Hambriento/a».' WHERE id = 'a1-u28-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sediento/a».', explanation = '«Thirsty» significa «Sediento/a».' WHERE id = 'a1-u28-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Enfadado/a».', explanation = '«Angry» significa «Enfadado/a».' WHERE id = 'a1-u28-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Enfermo/a».', explanation = '«Sick» significa «Enfermo/a».' WHERE id = 'a1-u28-voc-14';
UPDATE learning_exercises SET options_json = '["Are","am","is"]' WHERE id = 'a1-u28-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ you sick? (______ tú enfermo?)', options_json = '[]', answer_json = '{"correct":"Are"}', explanation = 'La palabra que completa la frase es “Are”. Léela dentro de la oración completa.' WHERE id = 'a1-u28-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ he sad? (______ él triste?)', options_json = '[]', answer_json = '{"correct":"Is"}', explanation = 'La palabra que completa la frase es “Is”. Léela dentro de la oración completa.' WHERE id = 'a1-u28-gra-10';
UPDATE learning_exercises SET options_json = '["am","Is","are"]' WHERE id = 'a1-u28-gra-13';
UPDATE learning_exercises SET options_json = '["are","am","is"]' WHERE id = 'a1-u28-gra-14';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u28-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hambriento/a».', explanation = '«Hungry» significa «Hambriento/a».' WHERE id = 'a1-u29-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sediento/a».', explanation = '«Thirsty» significa «Sediento/a».' WHERE id = 'a1-u29-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Enfadado/a».', explanation = '«Angry» significa «Enfadado/a».' WHERE id = 'a1-u29-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Enfermo/a».', explanation = '«Sick» significa «Enfermo/a».' WHERE id = 'a1-u29-voc-14';
UPDATE learning_exercises SET options_json = '["Are","am","is"]' WHERE id = 'a1-u29-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ you sick? (______ tú enfermo?)', options_json = '[]', answer_json = '{"correct":"Are"}', explanation = 'La palabra que completa la frase es “Are”. Léela dentro de la oración completa.' WHERE id = 'a1-u29-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ he sad? (______ él triste?)', options_json = '[]', answer_json = '{"correct":"Is"}', explanation = 'La palabra que completa la frase es “Is”. Léela dentro de la oración completa.' WHERE id = 'a1-u29-gra-10';
UPDATE learning_exercises SET options_json = '["am","Is","are"]' WHERE id = 'a1-u29-gra-13';
UPDATE learning_exercises SET options_json = '["are","am","is"]' WHERE id = 'a1-u29-gra-14';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u29-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas tardes».', explanation = '«Good afternoon» significa «Buenas tardes».' WHERE id = 'a1-u30-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (saludo)».', explanation = '«Good evening» significa «Buenas noches (saludo)».' WHERE id = 'a1-u30-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (despedida)».', explanation = '«Good night» significa «Buenas noches (despedida)».' WHERE id = 'a1-u30-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Adiós».', explanation = '«Goodbye» significa «Adiós».' WHERE id = 'a1-u30-voc-14';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u30-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u30-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u30-gra-10';
UPDATE learning_exercises SET options_json = '["am","is","are"]' WHERE id = 'a1-u30-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hermana».', explanation = '«Sister» significa «Hermana».' WHERE id = 'a1-u31-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hijo».', explanation = '«Son» significa «Hijo».' WHERE id = 'a1-u31-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hija».', explanation = '«Daughter» significa «Hija».' WHERE id = 'a1-u31-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abuela».', explanation = '«Grandmother» significa «Abuela».' WHERE id = 'a1-u31-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ family is big. (______ familia es grande.)', options_json = '[]', answer_json = '{"correct":"Our"}', explanation = 'La palabra que completa la frase es “Our”. Léela dentro de la oración completa.' WHERE id = 'a1-u31-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They are ______ children. (Ellos son ______ hijos.)', options_json = '[]', answer_json = '{"correct":"their"}', explanation = 'La palabra que completa la frase es “their”. Léela dentro de la oración completa.' WHERE id = 'a1-u31-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hermana».', explanation = '«Sister» significa «Hermana».' WHERE id = 'a1-u32-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hijo».', explanation = '«Son» significa «Hijo».' WHERE id = 'a1-u32-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hija».', explanation = '«Daughter» significa «Hija».' WHERE id = 'a1-u32-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abuela».', explanation = '«Grandmother» significa «Abuela».' WHERE id = 'a1-u32-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ family is big. (______ familia es grande.)', options_json = '[]', answer_json = '{"correct":"Our"}', explanation = 'La palabra que completa la frase es “Our”. Léela dentro de la oración completa.' WHERE id = 'a1-u32-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They are ______ children. (Ellos son ______ hijos.)', options_json = '[]', answer_json = '{"correct":"their"}', explanation = 'La palabra que completa la frase es “their”. Léela dentro de la oración completa.' WHERE id = 'a1-u32-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Estudiante».', explanation = '«Student» significa «Estudiante».' WHERE id = 'a1-u33-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Camarero/a».', explanation = '«Waiter» significa «Camarero/a».' WHERE id = 'a1-u33-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Enfermero/a».', explanation = '«Nurse» significa «Enfermero/a».' WHERE id = 'a1-u33-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Policía».', explanation = '«Police officer» significa «Policía».' WHERE id = 'a1-u33-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Where do you ______? (Dónde trabajas tú ______?)', options_json = '[]', answer_json = '{"correct":"work"}', explanation = 'La palabra que completa la frase es “work”. Léela dentro de la oración completa.' WHERE id = 'a1-u33-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They are ______ police officers. (Ellos son ______ policías.)', options_json = '[]', answer_json = '{"correct":"very good"}', explanation = 'La palabra que completa la frase es “very good”. Léela dentro de la oración completa.' WHERE id = 'a1-u33-gra-10';
UPDATE learning_exercises SET options_json = '["a","an","the"]' WHERE id = 'a1-u33-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Nosotros».', explanation = '«We» significa «Nosotros».' WHERE id = 'a1-u34-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ellos/Ellas».', explanation = '«They» significa «Ellos/Ellas».' WHERE id = 'a1-u34-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «País».', explanation = '«Country» significa «País».' WHERE id = 'a1-u34-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «España».', explanation = '«Spain» significa «España».' WHERE id = 'a1-u34-voc-14';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u34-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ from Italy. (Ellos ______ de Italia.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u34-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It ______ a book. (Eso ______ un libro.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u34-gra-10';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u34-gra-13';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u34-gra-14';
UPDATE learning_exercises SET options_json = '["is","am","are"]' WHERE id = 'a1-u34-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Amarillo».', explanation = '«Yellow» significa «Amarillo».' WHERE id = 'a1-u35-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Negro».', explanation = '«Black» significa «Negro».' WHERE id = 'a1-u35-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Blanco».', explanation = '«White» significa «Blanco».' WHERE id = 'a1-u35-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Alto/a».', explanation = '«Tall» significa «Alto/a».' WHERE id = 'a1-u35-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They have ______ eyes. (Ellos tienen ______ ojos.)', options_json = '[]', answer_json = '{"correct":"blue"}', explanation = 'La palabra que completa la frase es “blue”. Léela dentro de la oración completa.' WHERE id = 'a1-u35-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It is ______ old building. (Eso es ______ antiguo edificio.)', options_json = '[]', answer_json = '{"correct":"an"}', explanation = 'La palabra que completa la frase es “an”. Léela dentro de la oración completa.' WHERE id = 'a1-u35-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hermana».', explanation = '«Sister» significa «Hermana».' WHERE id = 'a1-u36-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hijo».', explanation = '«Son» significa «Hijo».' WHERE id = 'a1-u36-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hija».', explanation = '«Daughter» significa «Hija».' WHERE id = 'a1-u36-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abuela».', explanation = '«Grandmother» significa «Abuela».' WHERE id = 'a1-u36-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ family is big. (______ familia es grande.)', options_json = '[]', answer_json = '{"correct":"Our"}', explanation = 'La palabra que completa la frase es “Our”. Léela dentro de la oración completa.' WHERE id = 'a1-u36-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They are ______ children. (Ellos son ______ hijos.)', options_json = '[]', answer_json = '{"correct":"their"}', explanation = 'La palabra que completa la frase es “their”. Léela dentro de la oración completa.' WHERE id = 'a1-u36-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Beber».', explanation = '«Drink» significa «Beber».' WHERE id = 'a1-u37-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Dormir».', explanation = '«Sleep» significa «Dormir».' WHERE id = 'a1-u37-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Jugar».', explanation = '«Play» significa «Jugar».' WHERE id = 'a1-u37-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Leer».', explanation = '«Read» significa «Leer».' WHERE id = 'a1-u37-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ football on Saturdays. (Ellos ______ fútbol los sábados.)', options_json = '[]', answer_json = '{"correct":"play"}', explanation = 'La palabra que completa la frase es “play”. Léela dentro de la oración completa.' WHERE id = 'a1-u37-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ coffee in the morning. (Yo ______ café en la mañana.)', options_json = '[]', answer_json = '{"correct":"drink"}', explanation = 'La palabra que completa la frase es “drink”. Léela dentro de la oración completa.' WHERE id = 'a1-u37-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hacer los deberes».', explanation = '«Do homework» significa «Hacer los deberes».' WHERE id = 'a1-u38-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ir de compras».', explanation = '«Go shopping» significa «Ir de compras».' WHERE id = 'a1-u38-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hacer ejercicio».', explanation = '«Exercise» significa «Hacer ejercicio».' WHERE id = 'a1-u38-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Llamar a un amigo».', explanation = '«Call a friend» significa «Llamar a un amigo».' WHERE id = 'a1-u38-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ they go shopping together? (______ ellos van de compras juntos?)', options_json = '[]', answer_json = '{"correct":"Do"}', explanation = 'La palabra que completa la frase es “Do”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I don''t ______ the house on weekdays. (Yo no ______ la casa los días de semana.)', options_json = '[]', answer_json = '{"correct":"clean"}', explanation = 'La palabra que completa la frase es “clean”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-10';
UPDATE learning_exercises SET options_json = '["don''t","doesn''t","Do"]' WHERE id = 'a1-u38-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ve (televisión)».', explanation = '«Watches» significa «Ve (televisión)».' WHERE id = 'a1-u39-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Vuela».', explanation = '«Flies» significa «Vuela».' WHERE id = 'a1-u39-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ladra».', explanation = '«Barks» significa «Ladra».' WHERE id = 'a1-u39-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Conduce».', explanation = '«Drives» significa «Conduce».' WHERE id = 'a1-u39-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
She ______ to work by car. (Ella ______ al trabajo en coche.)', options_json = '[]', answer_json = '{"correct":"drives"}', explanation = 'La palabra que completa la frase es “drives”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
He doesn''t ______ early on weekends. (Él no ______ temprano los fines de semana.)', options_json = '[]', answer_json = '{"correct":"wake"}', explanation = 'La palabra que completa la frase es “wake”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-10';
UPDATE learning_exercises SET options_json = '["Does","sleeps","do"]' WHERE id = 'a1-u39-gra-14';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ve (televisión)».', explanation = '«Watches» significa «Ve (televisión)».' WHERE id = 'a1-u40-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Vuela».', explanation = '«Flies» significa «Vuela».' WHERE id = 'a1-u40-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ladra».', explanation = '«Barks» significa «Ladra».' WHERE id = 'a1-u40-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Conduce».', explanation = '«Drives» significa «Conduce».' WHERE id = 'a1-u40-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
She ______ to work by car. (Ella ______ al trabajo en coche.)', options_json = '[]', answer_json = '{"correct":"drives"}', explanation = 'La palabra que completa la frase es “drives”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
He doesn''t ______ early on weekends. (Él no ______ temprano los fines de semana.)', options_json = '[]', answer_json = '{"correct":"wake"}', explanation = 'La palabra que completa la frase es “wake”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-10';
UPDATE learning_exercises SET options_json = '["Does","sleeps","do"]' WHERE id = 'a1-u40-gra-14';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Menos cuarto».', explanation = '«Quarter to» significa «Menos cuarto».' WHERE id = 'a1-u41-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Minuto».', explanation = '«Minute» significa «Minuto».' WHERE id = 'a1-u41-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Hora».', explanation = '«Hour» significa «Hora».' WHERE id = 'a1-u41-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Mañana (parte del día)».', explanation = '«Morning» significa «Mañana (parte del día)».' WHERE id = 'a1-u41-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The party is ______ half past seven. (La fiesta es ______ y media las siete.)', options_json = '[]', answer_json = '{"correct":"at"}', explanation = 'La palabra que completa la frase es “at”. Léela dentro de la oración completa.' WHERE id = 'a1-u41-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It quarter ______ ten. (Son un cuarto ______ las diez.)', options_json = '[]', answer_json = '{"correct":"past"}', explanation = 'La palabra que completa la frase es “past”. Léela dentro de la oración completa.' WHERE id = 'a1-u41-gra-10';
UPDATE learning_exercises SET options_json = '["is","at","in"]' WHERE id = 'a1-u41-gra-14';
UPDATE learning_exercises SET options_json = '["What","at","Where"]' WHERE id = 'a1-u41-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ir al trabajo».', explanation = '«Go to work» significa «Ir al trabajo».' WHERE id = 'a1-u42-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Almorzar».', explanation = '«Have lunch» significa «Almorzar».' WHERE id = 'a1-u42-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cenar».', explanation = '«Have dinner» significa «Cenar».' WHERE id = 'a1-u42-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Irse a la cama».', explanation = '«Go to bed» significa «Irse a la cama».' WHERE id = 'a1-u42-voc-14';
UPDATE learning_exercises SET options_json = '["go","Then","First"]' WHERE id = 'a1-u42-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ to work at nine. (Yo ______ al trabajo a las nueve.)', options_json = '[]', answer_json = '{"correct":"go"}', explanation = 'La palabra que completa la frase es “go”. Léela dentro de la oración completa.' WHERE id = 'a1-u42-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Finally, I ______ to bed at eleven. (Finalmente, yo ______ a la cama a las once.)', options_json = '[]', answer_json = '{"correct":"go"}', explanation = 'La palabra que completa la frase es “go”. Léela dentro de la oración completa.' WHERE id = 'a1-u42-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cuatro».', explanation = '«Four» significa «Cuatro».' WHERE id = 'a1-u43-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cinco».', explanation = '«Five» significa «Cinco».' WHERE id = 'a1-u43-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Bolígrafo».', explanation = '«Pen» significa «Bolígrafo».' WHERE id = 'a1-u43-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Libro».', explanation = '«Book» significa «Libro».' WHERE id = 'a1-u43-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There are ______ chairs. (Hay están ______ sillas.)', options_json = '[]', answer_json = '{"correct":"three"}', explanation = 'La palabra que completa la frase es “three”. Léela dentro de la oración completa.' WHERE id = 'a1-u43-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
That ______ is a red pen. (Ese ______ es un rojo bolígrafo.)', options_json = '[]', answer_json = '{"correct":"one"}', explanation = 'La palabra que completa la frase es “one”. Léela dentro de la oración completa.' WHERE id = 'a1-u43-gra-10';
UPDATE learning_exercises SET options_json = '["a","the","an"]' WHERE id = 'a1-u43-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cuatro».', explanation = '«Four» significa «Cuatro».' WHERE id = 'a1-u44-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cinco».', explanation = '«Five» significa «Cinco».' WHERE id = 'a1-u44-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Bolígrafo».', explanation = '«Pen» significa «Bolígrafo».' WHERE id = 'a1-u44-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Libro».', explanation = '«Book» significa «Libro».' WHERE id = 'a1-u44-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There are ______ chairs. (Hay están ______ sillas.)', options_json = '[]', answer_json = '{"correct":"three"}', explanation = 'La palabra que completa la frase es “three”. Léela dentro de la oración completa.' WHERE id = 'a1-u44-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
That ______ is a red pen. (Ese ______ es un rojo bolígrafo.)', options_json = '[]', answer_json = '{"correct":"one"}', explanation = 'La palabra que completa la frase es “one”. Léela dentro de la oración completa.' WHERE id = 'a1-u44-gra-10';
UPDATE learning_exercises SET options_json = '["a","the","an"]' WHERE id = 'a1-u44-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Baño».', explanation = '«Bathroom» significa «Baño».' WHERE id = 'a1-u45-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Jardín».', explanation = '«Garden» significa «Jardín».' WHERE id = 'a1-u45-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Pasillo/Recibidor».', explanation = '«Hall» significa «Pasillo/Recibidor».' WHERE id = 'a1-u45-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Comedor».', explanation = '«Dining room» significa «Comedor».' WHERE id = 'a1-u45-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
My bedroom ______ a big balcony. (Mi dormitorio ______ una gran terraza.)', options_json = '[]', answer_json = '{"correct":"has"}', explanation = 'La palabra que completa la frase es “has”. Léela dentro de la oración completa.' WHERE id = 'a1-u45-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The bathroom ______ small but clean. (El baño ______ pequeño pero limpio.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u45-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Silla».', explanation = '«Chair» significa «Silla».' WHERE id = 'a1-u46-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Nevera».', explanation = '«Fridge» significa «Nevera».' WHERE id = 'a1-u46-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Armario».', explanation = '«Wardrobe» significa «Armario».' WHERE id = 'a1-u46-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Estantería».', explanation = '«Shelf» significa «Estantería».' WHERE id = 'a1-u46-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It''s his bed. The blue one is ______. (Es su cama. La azul una es ______.)', options_json = '[]', answer_json = '{"correct":"hers"}', explanation = 'La palabra que completa la frase es “hers”. Léela dentro de la oración completa.' WHERE id = 'a1-u46-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The wardrobe in my bedroom ______ very old. (La armario en mi dormitorio ______ muy viejo.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u46-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Frente a».', explanation = '«Opposite» significa «Frente a».' WHERE id = 'a1-u47-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Encima de».', explanation = '«Above» significa «Encima de».' WHERE id = 'a1-u47-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Debajo de».', explanation = '«Below» significa «Debajo de».' WHERE id = 'a1-u47-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cerca de».', explanation = '«Near» significa «Cerca de».' WHERE id = 'a1-u47-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The cat is ______ the sofa. (El gato está ______ la sofá.)', options_json = '[]', answer_json = '{"correct":"next to"}', explanation = 'La palabra que completa la frase es “next to”. Léela dentro de la oración completa.' WHERE id = 'a1-u47-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Is the library far ______ here? (Está la biblioteca lejos ______ aquí?)', options_json = '[]', answer_json = '{"correct":"from"}', explanation = 'La palabra que completa la frase es “from”. Léela dentro de la oración completa.' WHERE id = 'a1-u47-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «No hay (pl.)».', explanation = '«There aren''t» significa «No hay (pl.)».' WHERE id = 'a1-u48-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «¿Hay? (sing.)».', explanation = '«Is there» significa «¿Hay? (sing.)».' WHERE id = 'a1-u48-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «¿Hay? (pl.)».', explanation = '«Are there» significa «¿Hay? (pl.)».' WHERE id = 'a1-u48-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «En (interior)».', explanation = '«In» significa «En (interior)».' WHERE id = 'a1-u48-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There aren''t ______ windows in the bathroom. (Hay no ______ ventanas en el baño.)', options_json = '[]', answer_json = '{"correct":"any"}', explanation = 'La palabra que completa la frase es “any”. Léela dentro de la oración completa.' WHERE id = 'a1-u48-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ a garden in your house? (______ un jardín en tu casa?)', options_json = '[]', answer_json = '{"correct":"Is there"}', explanation = 'La palabra que completa la frase es “Is there”. Léela dentro de la oración completa.' WHERE id = 'a1-u48-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Leche».', explanation = '«Milk» significa «Leche».' WHERE id = 'a1-u49-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Arroz».', explanation = '«Rice» significa «Arroz».' WHERE id = 'a1-u49-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Pasta».', explanation = '«Pasta» significa «Pasta».' WHERE id = 'a1-u49-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Pollo».', explanation = '«Chicken» significa «Pollo».' WHERE id = 'a1-u49-voc-14';
UPDATE learning_exercises SET options_json = '["like","doesn''t eat","likes"]' WHERE id = 'a1-u49-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you ______ salad? (Te gusta tú ______ ensalada?)', options_json = '[]', answer_json = '{"correct":"like"}', explanation = 'La palabra que completa la frase es “like”. Léela dentro de la oración completa.' WHERE id = 'a1-u49-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
He ______ meat. He is vegetarian. (Él ______ carne. Él es vegetariano.)', options_json = '[]', answer_json = '{"correct":"doesn''t eat"}', explanation = 'La palabra que completa la frase es “doesn''t eat”. Léela dentro de la oración completa.' WHERE id = 'a1-u49-gra-10';
UPDATE learning_exercises SET options_json = '["like","eat","likes"]' WHERE id = 'a1-u49-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Agua».', explanation = '«Water» significa «Agua».' WHERE id = 'a1-u50-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sándwich».', explanation = '«Sandwich» significa «Sándwich».' WHERE id = 'a1-u50-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Tarta».', explanation = '«Cake» significa «Tarta».' WHERE id = 'a1-u50-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Menú».', explanation = '«Menu» significa «Menú».' WHERE id = 'a1-u50-voc-14';
UPDATE learning_exercises SET options_json = '["would","have","has"]' WHERE id = 'a1-u50-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ like a large tea. (Yo ______ me gustaría un grande té.)', options_json = '[]', answer_json = '{"correct":"would"}', explanation = 'La palabra que completa la frase es “would”. Léela dentro de la oración completa.' WHERE id = 'a1-u50-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Can we ______ the bill, please? (Puede nosotros ______ la cuenta, por favor?)', options_json = '[]', answer_json = '{"correct":"have"}', explanation = 'La palabra que completa la frase es “have”. Léela dentro de la oración completa.' WHERE id = 'a1-u50-gra-10';
UPDATE learning_exercises SET options_json = '["have","has","I''d"]' WHERE id = 'a1-u50-gra-13';
UPDATE learning_exercises SET options_json = '["have","has","would"]' WHERE id = 'a1-u50-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cincuenta».', explanation = '«Fifty» significa «Cincuenta».' WHERE id = 'a1-u51-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sesenta».', explanation = '«Sixty» significa «Sesenta».' WHERE id = 'a1-u51-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Setenta».', explanation = '«Seventy» significa «Setenta».' WHERE id = 'a1-u51-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ochenta».', explanation = '«Eighty» significa «Ochenta».' WHERE id = 'a1-u51-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u51-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u51-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Pescado».', explanation = '«Fish» significa «Pescado».' WHERE id = 'a1-u52-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Pasillo».', explanation = '«Aisle» significa «Pasillo».' WHERE id = 'a1-u52-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Estante».', explanation = '«Shelf» significa «Estante».' WHERE id = 'a1-u52-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cesta».', explanation = '«Basket» significa «Cesta».' WHERE id = 'a1-u52-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I need to buy some ______ for the salad. (Yo necesito comprar comprar algunas ______ para la ensalada.)', options_json = '[]', answer_json = '{"correct":"vegetables"}', explanation = 'La palabra que completa la frase es “vegetables”. Léela dentro de la oración completa.' WHERE id = 'a1-u52-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Can I ______ a bag, please? (¿Puedo yo ______ una bolsa, por favor?)', options_json = '[]', answer_json = '{"correct":"have"}', explanation = 'La palabra que completa la frase es “have”. Léela dentro de la oración completa.' WHERE id = 'a1-u52-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Pasar por delante».', explanation = '«Past» significa «Pasar por delante».' WHERE id = 'a1-u53-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «En la esquina».', explanation = '«At the corner» significa «En la esquina».' WHERE id = 'a1-u53-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Semáforo».', explanation = '«Traffic lights» significa «Semáforo».' WHERE id = 'a1-u53-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Puente».', explanation = '«Bridge» significa «Puente».' WHERE id = 'a1-u53-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Go past the ______ and then turn right. (Ve por delante de el ______ y luego gira a la derecha.)', options_json = '[]', answer_json = '{"correct":"bank"}', explanation = 'La palabra que completa la frase es “bank”. Léela dentro de la oración completa.' WHERE id = 'a1-u53-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Is it ______ from here? (Está está ______ de aquí?)', options_json = '[]', answer_json = '{"correct":"far"}', explanation = 'La palabra que completa la frase es “far”. Léela dentro de la oración completa.' WHERE id = 'a1-u53-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Agua».', explanation = '«Water» significa «Agua».' WHERE id = 'a1-u54-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sándwich».', explanation = '«Sandwich» significa «Sándwich».' WHERE id = 'a1-u54-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Tarta».', explanation = '«Cake» significa «Tarta».' WHERE id = 'a1-u54-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Menú».', explanation = '«Menu» significa «Menú».' WHERE id = 'a1-u54-voc-14';
UPDATE learning_exercises SET options_json = '["would","have","has"]' WHERE id = 'a1-u54-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ like a large tea. (Yo ______ me gustaría un grande té.)', options_json = '[]', answer_json = '{"correct":"would"}', explanation = 'La palabra que completa la frase es “would”. Léela dentro de la oración completa.' WHERE id = 'a1-u54-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Can we ______ the bill, please? (Puede nosotros ______ la cuenta, por favor?)', options_json = '[]', answer_json = '{"correct":"have"}', explanation = 'La palabra que completa la frase es “have”. Léela dentro de la oración completa.' WHERE id = 'a1-u54-gra-10';
UPDATE learning_exercises SET options_json = '["have","has","I''d"]' WHERE id = 'a1-u54-gra-13';
UPDATE learning_exercises SET options_json = '["have","has","would"]' WHERE id = 'a1-u54-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cincuenta».', explanation = '«Fifty» significa «Cincuenta».' WHERE id = 'a1-u55-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Sesenta».', explanation = '«Sixty» significa «Sesenta».' WHERE id = 'a1-u55-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Setenta».', explanation = '«Seventy» significa «Setenta».' WHERE id = 'a1-u55-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Ochenta».', explanation = '«Eighty» significa «Ochenta».' WHERE id = 'a1-u55-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u55-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u55-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Abril».', explanation = '«April» significa «Abril».' WHERE id = 'a1-u56-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Mayo».', explanation = '«May» significa «Mayo».' WHERE id = 'a1-u56-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Junio».', explanation = '«June» significa «Junio».' WHERE id = 'a1-u56-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Julio».', explanation = '«July» significa «Julio».' WHERE id = 'a1-u56-voc-14';
UPDATE learning_exercises SET options_json = '["When","in","on"]' WHERE id = 'a1-u56-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u56-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u56-gra-10';
UPDATE learning_exercises SET options_json = '["in","at","on"]' WHERE id = 'a1-u56-gra-13';
UPDATE learning_exercises SET options_json = '["on","in","at"]' WHERE id = 'a1-u56-gra-14';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Incorrecto/a».', explanation = '«Wrong» significa «Incorrecto/a».' WHERE id = 'a1-u57-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Presentar».', explanation = '«Introduce» significa «Presentar».' WHERE id = 'a1-u57-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Describir».', explanation = '«Describe» significa «Describir».' WHERE id = 'a1-u57-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Completar».', explanation = '«Complete» significa «Completar».' WHERE id = 'a1-u57-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u57-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
This ______ my family. (Esto ______ mi familia.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u57-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas tardes».', explanation = '«Good afternoon» significa «Buenas tardes».' WHERE id = 'a1-u58-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (saludo)».', explanation = '«Good evening» significa «Buenas noches (saludo)».' WHERE id = 'a1-u58-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Buenas noches (despedida)».', explanation = '«Good night» significa «Buenas noches (despedida)».' WHERE id = 'a1-u58-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Adiós».', explanation = '«Goodbye» significa «Adiós».' WHERE id = 'a1-u58-voc-14';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u58-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u58-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u58-gra-10';
UPDATE learning_exercises SET options_json = '["am","is","are"]' WHERE id = 'a1-u58-gra-15';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Algo/Ningún».', explanation = '«Some/Any» significa «Algo/Ningún».' WHERE id = 'a1-u59-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cuánto/Cuántos».', explanation = '«How much/many» significa «Cuánto/Cuántos».' WHERE id = 'a1-u59-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Tienda de ropa».', explanation = '«Clothing store» significa «Tienda de ropa».' WHERE id = 'a1-u59-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Restaurante».', explanation = '«Restaurant» significa «Restaurante».' WHERE id = 'a1-u59-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ rest and drink plenty of water. (Deberías ______ descansar y beber mucha de agua.)', options_json = '[]', answer_json = '{"correct":"should"}', explanation = 'La palabra que completa la frase es “should”. Léela dentro de la oración completa.' WHERE id = 'a1-u59-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ a lot of money ______ food every week. (Yo ______ mucho mucho en dinero ______ comida cada semana.)', options_json = '[]', answer_json = '{"correct":"spend, on"}', explanation = 'La palabra que completa la frase es “spend, on”. Léela dentro de la oración completa.' WHERE id = 'a1-u59-gra-10';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Algo/Ningún».', explanation = '«Some/Any» significa «Algo/Ningún».' WHERE id = 'a1-u60-voc-11';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Cuánto/Cuántos».', explanation = '«How much/many» significa «Cuánto/Cuántos».' WHERE id = 'a1-u60-voc-12';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Tienda de ropa».', explanation = '«Clothing store» significa «Tienda de ropa».' WHERE id = 'a1-u60-voc-13';
UPDATE learning_exercises SET prompt = 'Elige la palabra en inglés que corresponde a «Restaurante».', explanation = '«Restaurant» significa «Restaurante».' WHERE id = 'a1-u60-voc-14';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ rest and drink plenty of water. (Deberías ______ descansar y beber mucha de agua.)', options_json = '[]', answer_json = '{"correct":"should"}', explanation = 'La palabra que completa la frase es “should”. Léela dentro de la oración completa.' WHERE id = 'a1-u60-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ a lot of money ______ food every week. (Yo ______ mucho mucho en dinero ______ comida cada semana.)', options_json = '[]', answer_json = '{"correct":"spend, on"}', explanation = 'La palabra que completa la frase es “spend, on”. Léela dentro de la oración completa.' WHERE id = 'a1-u60-gra-10';

