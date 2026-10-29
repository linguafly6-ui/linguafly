-- Replace free-writing tasks in grammar with closed A1 practice and remove duplicate answer choices.
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u01-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u01-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u01-gra-10';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u02-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u02-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u02-gra-10';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u03-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u03-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u03-gra-10';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u04-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u04-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u04-gra-10';
UPDATE learning_exercises SET options_json = '["Are","am","is"]' WHERE id = 'a1-u05-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ you sick? (______ tú enfermo?)', options_json = '[]', answer_json = '{"correct":"Are"}', explanation = 'La palabra que completa la frase es “Are”. Léela dentro de la oración completa.' WHERE id = 'a1-u05-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ he sad? (______ él triste?)', options_json = '[]', answer_json = '{"correct":"Is"}', explanation = 'La palabra que completa la frase es “Is”. Léela dentro de la oración completa.' WHERE id = 'a1-u05-gra-10';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u06-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u06-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u06-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There are ______ chairs. (Hay están ______ sillas.)', options_json = '[]', answer_json = '{"correct":"three"}', explanation = 'La palabra que completa la frase es “three”. Léela dentro de la oración completa.' WHERE id = 'a1-u07-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
That ______ is a red pen. (Ese ______ es un rojo bolígrafo.)', options_json = '[]', answer_json = '{"correct":"one"}', explanation = 'La palabra que completa la frase es “one”. Léela dentro de la oración completa.' WHERE id = 'a1-u07-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There are ______ chairs. (Hay están ______ sillas.)', options_json = '[]', answer_json = '{"correct":"three"}', explanation = 'La palabra que completa la frase es “three”. Léela dentro de la oración completa.' WHERE id = 'a1-u08-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
That ______ is a red pen. (Ese ______ es un rojo bolígrafo.)', options_json = '[]', answer_json = '{"correct":"one"}', explanation = 'La palabra que completa la frase es “one”. Léela dentro de la oración completa.' WHERE id = 'a1-u08-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u09-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u09-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u10-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u10-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u11-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u11-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u12-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u12-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you work ______ weekends? (Trabajas tú trabajas ______ fines de semana?)', options_json = '[]', answer_json = '{"correct":"on"}', explanation = 'La palabra que completa la frase es “on”. Léela dentro de la oración completa.' WHERE id = 'a1-u13-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Today ______ Wednesday. (Hoy ______ miércoles.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u13-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you work ______ weekends? (Trabajas tú trabajas ______ fines de semana?)', options_json = '[]', answer_json = '{"correct":"on"}', explanation = 'La palabra que completa la frase es “on”. Léela dentro de la oración completa.' WHERE id = 'a1-u14-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Today ______ Wednesday. (Hoy ______ miércoles.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u14-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you work ______ weekends? (Trabajas tú trabajas ______ fines de semana?)', options_json = '[]', answer_json = '{"correct":"on"}', explanation = 'La palabra que completa la frase es “on”. Léela dentro de la oración completa.' WHERE id = 'a1-u15-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Today ______ Wednesday. (Hoy ______ miércoles.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u15-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The people ______ very friendly and welcoming. (Los habitantes ______ muy amables y acogedores.)', options_json = '[]', answer_json = '{"correct":"were"}', explanation = 'La palabra que completa la frase es “were”. Léela dentro de la oración completa.' WHERE id = 'a1-u16-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The food ______ amazing — we ate fresh seafood every day! (La comida ______ increíble — comimos comimos mariscos frescos mariscos cada día!)', options_json = '[]', answer_json = '{"correct":"was"}', explanation = 'La palabra que completa la frase es “was”. Léela dentro de la oración completa.' WHERE id = 'a1-u16-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you work ______ weekends? (Trabajas tú trabajas ______ fines de semana?)', options_json = '[]', answer_json = '{"correct":"on"}', explanation = 'La palabra que completa la frase es “on”. Léela dentro de la oración completa.' WHERE id = 'a1-u17-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Today ______ Wednesday. (Hoy ______ miércoles.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u17-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ to work at nine. (Yo ______ al trabajo a las nueve.)', options_json = '[]', answer_json = '{"correct":"go"}', explanation = 'La palabra que completa la frase es “go”. Léela dentro de la oración completa.' WHERE id = 'a1-u18-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Finally, I ______ to bed at eleven. (Finalmente, yo ______ a la cama a las once.)', options_json = '[]', answer_json = '{"correct":"go"}', explanation = 'La palabra que completa la frase es “go”. Léela dentro de la oración completa.' WHERE id = 'a1-u18-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u19-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u19-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u20-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u20-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u21-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u21-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u22-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u22-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u23-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u23-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u24-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u24-gra-10';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u25-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ from Italy. (Ellos ______ de Italia.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u25-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It ______ a book. (Eso ______ un libro.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u25-gra-10';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u26-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ from Italy. (Ellos ______ de Italia.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u26-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It ______ a book. (Eso ______ un libro.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u26-gra-10';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u27-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ from Italy. (Ellos ______ de Italia.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u27-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It ______ a book. (Eso ______ un libro.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u27-gra-10';
UPDATE learning_exercises SET options_json = '["Are","am","is"]' WHERE id = 'a1-u28-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ you sick? (______ tú enfermo?)', options_json = '[]', answer_json = '{"correct":"Are"}', explanation = 'La palabra que completa la frase es “Are”. Léela dentro de la oración completa.' WHERE id = 'a1-u28-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ he sad? (______ él triste?)', options_json = '[]', answer_json = '{"correct":"Is"}', explanation = 'La palabra que completa la frase es “Is”. Léela dentro de la oración completa.' WHERE id = 'a1-u28-gra-10';
UPDATE learning_exercises SET options_json = '["Are","am","is"]' WHERE id = 'a1-u29-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ you sick? (______ tú enfermo?)', options_json = '[]', answer_json = '{"correct":"Are"}', explanation = 'La palabra que completa la frase es “Are”. Léela dentro de la oración completa.' WHERE id = 'a1-u29-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ he sad? (______ él triste?)', options_json = '[]', answer_json = '{"correct":"Is"}', explanation = 'La palabra que completa la frase es “Is”. Léela dentro de la oración completa.' WHERE id = 'a1-u29-gra-10';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u30-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u30-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u30-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ family is big. (______ familia es grande.)', options_json = '[]', answer_json = '{"correct":"Our"}', explanation = 'La palabra que completa la frase es “Our”. Léela dentro de la oración completa.' WHERE id = 'a1-u31-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They are ______ children. (Ellos son ______ hijos.)', options_json = '[]', answer_json = '{"correct":"their"}', explanation = 'La palabra que completa la frase es “their”. Léela dentro de la oración completa.' WHERE id = 'a1-u31-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ family is big. (______ familia es grande.)', options_json = '[]', answer_json = '{"correct":"Our"}', explanation = 'La palabra que completa la frase es “Our”. Léela dentro de la oración completa.' WHERE id = 'a1-u32-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They are ______ children. (Ellos son ______ hijos.)', options_json = '[]', answer_json = '{"correct":"their"}', explanation = 'La palabra que completa la frase es “their”. Léela dentro de la oración completa.' WHERE id = 'a1-u32-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Where do you ______? (Dónde trabajas tú ______?)', options_json = '[]', answer_json = '{"correct":"work"}', explanation = 'La palabra que completa la frase es “work”. Léela dentro de la oración completa.' WHERE id = 'a1-u33-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They are ______ police officers. (Ellos son ______ policías.)', options_json = '[]', answer_json = '{"correct":"very good"}', explanation = 'La palabra que completa la frase es “very good”. Léela dentro de la oración completa.' WHERE id = 'a1-u33-gra-10';
UPDATE learning_exercises SET options_json = '["are","is","am"]' WHERE id = 'a1-u34-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ from Italy. (Ellos ______ de Italia.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u34-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It ______ a book. (Eso ______ un libro.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u34-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They have ______ eyes. (Ellos tienen ______ ojos.)', options_json = '[]', answer_json = '{"correct":"blue"}', explanation = 'La palabra que completa la frase es “blue”. Léela dentro de la oración completa.' WHERE id = 'a1-u35-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It is ______ old building. (Eso es ______ antiguo edificio.)', options_json = '[]', answer_json = '{"correct":"an"}', explanation = 'La palabra que completa la frase es “an”. Léela dentro de la oración completa.' WHERE id = 'a1-u35-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ family is big. (______ familia es grande.)', options_json = '[]', answer_json = '{"correct":"Our"}', explanation = 'La palabra que completa la frase es “Our”. Léela dentro de la oración completa.' WHERE id = 'a1-u36-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They are ______ children. (Ellos son ______ hijos.)', options_json = '[]', answer_json = '{"correct":"their"}', explanation = 'La palabra que completa la frase es “their”. Léela dentro de la oración completa.' WHERE id = 'a1-u36-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
They ______ football on Saturdays. (Ellos ______ fútbol los sábados.)', options_json = '[]', answer_json = '{"correct":"play"}', explanation = 'La palabra que completa la frase es “play”. Léela dentro de la oración completa.' WHERE id = 'a1-u37-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ coffee in the morning. (Yo ______ café en la mañana.)', options_json = '[]', answer_json = '{"correct":"drink"}', explanation = 'La palabra que completa la frase es “drink”. Léela dentro de la oración completa.' WHERE id = 'a1-u37-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ they go shopping together? (______ ellos van de compras juntos?)', options_json = '[]', answer_json = '{"correct":"Do"}', explanation = 'La palabra que completa la frase es “Do”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I don''t ______ the house on weekdays. (Yo no ______ la casa los días de semana.)', options_json = '[]', answer_json = '{"correct":"clean"}', explanation = 'La palabra que completa la frase es “clean”. Léela dentro de la oración completa.' WHERE id = 'a1-u38-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
She ______ to work by car. (Ella ______ al trabajo en coche.)', options_json = '[]', answer_json = '{"correct":"drives"}', explanation = 'La palabra que completa la frase es “drives”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
He doesn''t ______ early on weekends. (Él no ______ temprano los fines de semana.)', options_json = '[]', answer_json = '{"correct":"wake"}', explanation = 'La palabra que completa la frase es “wake”. Léela dentro de la oración completa.' WHERE id = 'a1-u39-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
She ______ to work by car. (Ella ______ al trabajo en coche.)', options_json = '[]', answer_json = '{"correct":"drives"}', explanation = 'La palabra que completa la frase es “drives”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
He doesn''t ______ early on weekends. (Él no ______ temprano los fines de semana.)', options_json = '[]', answer_json = '{"correct":"wake"}', explanation = 'La palabra que completa la frase es “wake”. Léela dentro de la oración completa.' WHERE id = 'a1-u40-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The party is ______ half past seven. (La fiesta es ______ y media las siete.)', options_json = '[]', answer_json = '{"correct":"at"}', explanation = 'La palabra que completa la frase es “at”. Léela dentro de la oración completa.' WHERE id = 'a1-u41-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It quarter ______ ten. (Son un cuarto ______ las diez.)', options_json = '[]', answer_json = '{"correct":"past"}', explanation = 'La palabra que completa la frase es “past”. Léela dentro de la oración completa.' WHERE id = 'a1-u41-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ to work at nine. (Yo ______ al trabajo a las nueve.)', options_json = '[]', answer_json = '{"correct":"go"}', explanation = 'La palabra que completa la frase es “go”. Léela dentro de la oración completa.' WHERE id = 'a1-u42-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Finally, I ______ to bed at eleven. (Finalmente, yo ______ a la cama a las once.)', options_json = '[]', answer_json = '{"correct":"go"}', explanation = 'La palabra que completa la frase es “go”. Léela dentro de la oración completa.' WHERE id = 'a1-u42-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There are ______ chairs. (Hay están ______ sillas.)', options_json = '[]', answer_json = '{"correct":"three"}', explanation = 'La palabra que completa la frase es “three”. Léela dentro de la oración completa.' WHERE id = 'a1-u43-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
That ______ is a red pen. (Ese ______ es un rojo bolígrafo.)', options_json = '[]', answer_json = '{"correct":"one"}', explanation = 'La palabra que completa la frase es “one”. Léela dentro de la oración completa.' WHERE id = 'a1-u43-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There are ______ chairs. (Hay están ______ sillas.)', options_json = '[]', answer_json = '{"correct":"three"}', explanation = 'La palabra que completa la frase es “three”. Léela dentro de la oración completa.' WHERE id = 'a1-u44-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
That ______ is a red pen. (Ese ______ es un rojo bolígrafo.)', options_json = '[]', answer_json = '{"correct":"one"}', explanation = 'La palabra que completa la frase es “one”. Léela dentro de la oración completa.' WHERE id = 'a1-u44-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
My bedroom ______ a big balcony. (Mi dormitorio ______ una gran terraza.)', options_json = '[]', answer_json = '{"correct":"has"}', explanation = 'La palabra que completa la frase es “has”. Léela dentro de la oración completa.' WHERE id = 'a1-u45-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The bathroom ______ small but clean. (El baño ______ pequeño pero limpio.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u45-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
It''s his bed. The blue one is ______. (Es su cama. La azul una es ______.)', options_json = '[]', answer_json = '{"correct":"hers"}', explanation = 'La palabra que completa la frase es “hers”. Léela dentro de la oración completa.' WHERE id = 'a1-u46-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The wardrobe in my bedroom ______ very old. (La armario en mi dormitorio ______ muy viejo.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u46-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The cat is ______ the sofa. (El gato está ______ la sofá.)', options_json = '[]', answer_json = '{"correct":"next to"}', explanation = 'La palabra que completa la frase es “next to”. Léela dentro de la oración completa.' WHERE id = 'a1-u47-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Is the library far ______ here? (Está la biblioteca lejos ______ aquí?)', options_json = '[]', answer_json = '{"correct":"from"}', explanation = 'La palabra que completa la frase es “from”. Léela dentro de la oración completa.' WHERE id = 'a1-u47-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
There aren''t ______ windows in the bathroom. (Hay no ______ ventanas en el baño.)', options_json = '[]', answer_json = '{"correct":"any"}', explanation = 'La palabra que completa la frase es “any”. Léela dentro de la oración completa.' WHERE id = 'a1-u48-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ a garden in your house? (______ un jardín en tu casa?)', options_json = '[]', answer_json = '{"correct":"Is there"}', explanation = 'La palabra que completa la frase es “Is there”. Léela dentro de la oración completa.' WHERE id = 'a1-u48-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Do you ______ salad? (Te gusta tú ______ ensalada?)', options_json = '[]', answer_json = '{"correct":"like"}', explanation = 'La palabra que completa la frase es “like”. Léela dentro de la oración completa.' WHERE id = 'a1-u49-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
He ______ meat. He is vegetarian. (Él ______ carne. Él es vegetariano.)', options_json = '[]', answer_json = '{"correct":"doesn''t eat"}', explanation = 'La palabra que completa la frase es “doesn''t eat”. Léela dentro de la oración completa.' WHERE id = 'a1-u49-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ like a large tea. (Yo ______ me gustaría un grande té.)', options_json = '[]', answer_json = '{"correct":"would"}', explanation = 'La palabra que completa la frase es “would”. Léela dentro de la oración completa.' WHERE id = 'a1-u50-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Can we ______ the bill, please? (Puede nosotros ______ la cuenta, por favor?)', options_json = '[]', answer_json = '{"correct":"have"}', explanation = 'La palabra que completa la frase es “have”. Léela dentro de la oración completa.' WHERE id = 'a1-u50-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u51-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u51-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I need to buy some ______ for the salad. (Yo necesito comprar comprar algunas ______ para la ensalada.)', options_json = '[]', answer_json = '{"correct":"vegetables"}', explanation = 'La palabra que completa la frase es “vegetables”. Léela dentro de la oración completa.' WHERE id = 'a1-u52-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Can I ______ a bag, please? (¿Puedo yo ______ una bolsa, por favor?)', options_json = '[]', answer_json = '{"correct":"have"}', explanation = 'La palabra que completa la frase es “have”. Léela dentro de la oración completa.' WHERE id = 'a1-u52-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Go past the ______ and then turn right. (Ve por delante de el ______ y luego gira a la derecha.)', options_json = '[]', answer_json = '{"correct":"bank"}', explanation = 'La palabra que completa la frase es “bank”. Léela dentro de la oración completa.' WHERE id = 'a1-u53-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Is it ______ from here? (Está está ______ de aquí?)', options_json = '[]', answer_json = '{"correct":"far"}', explanation = 'La palabra que completa la frase es “far”. Léela dentro de la oración completa.' WHERE id = 'a1-u53-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ like a large tea. (Yo ______ me gustaría un grande té.)', options_json = '[]', answer_json = '{"correct":"would"}', explanation = 'La palabra que completa la frase es “would”. Léela dentro de la oración completa.' WHERE id = 'a1-u54-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Can we ______ the bill, please? (Puede nosotros ______ la cuenta, por favor?)', options_json = '[]', answer_json = '{"correct":"have"}', explanation = 'La palabra que completa la frase es “have”. Léela dentro de la oración completa.' WHERE id = 'a1-u54-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u55-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
The book ______ twenty euros. (El libro ______ veinte euros.)', options_json = '[]', answer_json = '{"correct":"costs"}', explanation = 'La palabra que completa la frase es “costs”. Léela dentro de la oración completa.' WHERE id = 'a1-u55-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
______ is your birthday? (______ es tu cumpleaños?)', options_json = '[]', answer_json = '{"correct":"When"}', explanation = 'La palabra que completa la frase es “When”. Léela dentro de la oración completa.' WHERE id = 'a1-u56-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
Summer is ______ June, July and August. (El verano es ______ junio, julio y agosto.)', options_json = '[]', answer_json = '{"correct":"in"}', explanation = 'La palabra que completa la frase es “in”. Léela dentro de la oración completa.' WHERE id = 'a1-u56-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
How ______ are you? (Qué ______ tienes tú?)', options_json = '[]', answer_json = '{"correct":"old"}', explanation = 'La palabra que completa la frase es “old”. Léela dentro de la oración completa.' WHERE id = 'a1-u57-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
This ______ my family. (Esto ______ mi familia.)', options_json = '[]', answer_json = '{"correct":"is"}', explanation = 'La palabra que completa la frase es “is”. Léela dentro de la oración completa.' WHERE id = 'a1-u57-gra-10';
UPDATE learning_exercises SET options_json = '["am","are","is"]' WHERE id = 'a1-u58-gra-07';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ from London. (Yo ______ de Londres.)', options_json = '[]', answer_json = '{"correct":"am"}', explanation = 'La palabra que completa la frase es “am”. Léela dentro de la oración completa.' WHERE id = 'a1-u58-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ not a doctor. (Tú ______ no un médico.)', options_json = '[]', answer_json = '{"correct":"are"}', explanation = 'La palabra que completa la frase es “are”. Léela dentro de la oración completa.' WHERE id = 'a1-u58-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ rest and drink plenty of water. (Deberías ______ descansar y beber mucha de agua.)', options_json = '[]', answer_json = '{"correct":"should"}', explanation = 'La palabra que completa la frase es “should”. Léela dentro de la oración completa.' WHERE id = 'a1-u59-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ a lot of money ______ food every week. (Yo ______ mucho mucho en dinero ______ comida cada semana.)', options_json = '[]', answer_json = '{"correct":"spend, on"}', explanation = 'La palabra que completa la frase es “spend, on”. Léela dentro de la oración completa.' WHERE id = 'a1-u59-gra-10';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
You ______ rest and drink plenty of water. (Deberías ______ descansar y beber mucha de agua.)', options_json = '[]', answer_json = '{"correct":"should"}', explanation = 'La palabra que completa la frase es “should”. Léela dentro de la oración completa.' WHERE id = 'a1-u60-gra-09';
UPDATE learning_exercises SET exercise_type = 'fill_blank', prompt = 'Completa la frase.
I ______ a lot of money ______ food every week. (Yo ______ mucho mucho en dinero ______ comida cada semana.)', options_json = '[]', answer_json = '{"correct":"spend, on"}', explanation = 'La palabra que completa la frase es “spend, on”. Léela dentro de la oración completa.' WHERE id = 'a1-u60-gra-10';

