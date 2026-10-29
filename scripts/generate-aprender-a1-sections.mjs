import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'src/content/cursos/ingles-a1');
const seedPath = path.join(root, 'migrations/d1/202610280002_seed_a1_course.sql');
const outputPath = path.join(dataDir, 'aprender-sections.json');

// These source units follow the corresponding themes in the public 60-unit A1 syllabus.
const sourceUnitByLesson = [
  1, 1, 1, 1, 3, 1, 4, 4, 8, 8, 8, 8,
  12, 12, 12, 47, 12, 13, 19, 19, 19, 19, 19, 19,
  2, 2, 2, 3, 3, 1, 6, 6, 9, 2, 7, 6,
  5, 14, 15, 15, 11, 13, 4, 4, 21, 22, 24, 23,
  17, 16, 8, 51, 26, 16, 8, 19, 10, 1, 60, 60,
];

function parseAnnotated(value, languageIndex) {
  return String(value || '')
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_match, english, spanish) => languageIndex === 0 ? english : spanish)
    .replace(/\s+([.,?!;:])/g, '$1')
    .replace(/([.,?!;:])(?=[A-Za-zÁÉÍÓÚÑáéíóúñ])/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSourceUnit(number) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, `unit${number}.json`), 'utf8'));
}

const beginnerOverrides = {
  1: {
    grammar: 'Usa “I am” o “I’m” para decir tu nombre. “Hello” y “Hi” sirven para iniciar una conversación.',
    example: 'My name is Ana.', exampleTranslation: 'Me llamo Ana.',
    vocabulary: ['Hello — Hola', 'Hi — Hola (informal)', 'My name — Mi nombre', 'I am / I’m — Soy', 'What’s your name? — ¿Cómo te llamas?', 'Goodbye — Adiós'],
    listening: 'A: Hi! My name is Ana. B: Hello, Ana. I’m Leo. How do you spell your name? A: A-N-A.',
    listeningEs: 'A: ¡Hola! Me llamo Ana. B: Hola, Ana. Soy Leo. ¿Cómo se escribe tu nombre? A: A-N-A.',
  },
  2: {
    grammar: 'Responde a un saludo con otro saludo. “Good morning” se usa por la mañana; “Good evening”, al llegar por la tarde-noche.',
    example: 'Good morning, Sara!', exampleTranslation: '¡Buenos días, Sara!',
    vocabulary: ['Hello — Hola', 'Hi — Hola (informal)', 'Good morning — Buenos días', 'Good afternoon — Buenas tardes', 'Good evening — Buenas noches (saludo)', 'Nice to meet you — Encantado/a de conocerte'],
    listening: 'A: Good morning, Tom. B: Good morning, Sara. A: How are you? B: I’m fine, thanks.',
    listeningEs: 'A: Buenos días, Tom. B: Buenos días, Sara. A: ¿Cómo estás? B: Estoy bien, gracias.',
  },
  3: {
    grammar: '“Please” hace más cortés una petición. Di “Thank you” al recibir algo; “You’re welcome” responde a las gracias. “Bye” y “Goodbye” sirven para despedirse.',
    example: 'A coffee, please. Thank you!', exampleTranslation: 'Un café, por favor. ¡Gracias!',
    vocabulary: ['Please — Por favor', 'Thank you — Gracias', 'Thanks — Gracias (informal)', 'You’re welcome — De nada', 'Goodbye — Adiós', 'See you later — Hasta luego'],
    listening: 'A: Here you are. B: Thank you. A: You’re welcome. B: Goodbye! A: See you later!',
    listeningEs: 'A: Aquí tienes. B: Gracias. A: De nada. B: ¡Adiós! A: ¡Hasta luego!',
  },
  4: {
    grammar: 'Preséntate con “I’m + nombre” o “My name is + nombre”. Para preguntar, usa “What’s your name?”.',
    example: 'I’m Ana. My name is Leo.', exampleTranslation: 'Soy Ana. Me llamo Leo.',
    vocabulary: ['Name — Nombre', 'First name — Nombre', 'Surname — Apellido', 'I’m — Soy / Me llamo', 'My name is — Me llamo', 'How do you spell it? — ¿Cómo se deletrea?'],
    listening: 'A: What’s your name? B: My name is Leo Martin. A: How do you spell Leo? B: L-E-O.',
    listeningEs: 'A: ¿Cómo te llamas? B: Me llamo Leo Martin. A: ¿Cómo se deletrea Leo? B: L-E-O.',
  },
  5: {
    grammar: '“How are you?” pregunta cómo está la persona. Responde “I’m fine”, “I’m good” o “I’m OK”, y puedes añadir “thanks”.',
    example: 'I’m fine, thanks.', exampleTranslation: 'Estoy bien, gracias.',
    vocabulary: ['How are you? — ¿Cómo estás?', 'Fine — Bien', 'Good — Bien', 'OK — Bien / Vale', 'Tired — Cansado/a', 'Thanks — Gracias'],
    listening: 'A: Hi, Laura. How are you? B: I’m not very well. I’m tired. A: I’m sorry. B: Thanks.',
    listeningEs: 'A: Hola, Laura. ¿Cómo estás? B: No estoy muy bien. Estoy cansada. A: Lo siento. B: Gracias.',
  },
  6: {
    grammar: 'Ordena una presentación así: saludo + nombre + “Nice to meet you”. “Nice to meet you, too” responde a esa frase.',
    example: 'Nice to meet you, too.', exampleTranslation: 'Encantado/a de conocerte también.',
    vocabulary: ['Hello — Hola', 'I’m — Soy / Me llamo', 'What’s your name? — ¿Cómo te llamas?', 'Nice to meet you — Encantado/a de conocerte', 'And you? — ¿Y tú?', 'Bye — Chao'],
    listening: 'A: Hi! I’m Ana. What’s your name? B: I’m Leo. Nice to meet you. A: Nice to meet you, too. Goodbye!',
    listeningEs: 'A: ¡Hola! Soy Ana. ¿Cómo te llamas? B: Soy Leo. Encantado de conocerte. A: Encantada de conocerte también. ¡Adiós!',
  },
  16: {
    grammar: '“Yesterday” habla del día anterior, “today” del presente y “tomorrow” del día siguiente. Usa “Yesterday was…”, “Today is…” y “Tomorrow is…”.',
    example: 'Yesterday was Monday. Today is Tuesday.', exampleTranslation: 'Ayer fue lunes. Hoy es martes.',
    vocabulary: ['Yesterday — Ayer', 'Today — Hoy', 'Tomorrow — Mañana', 'Day — Día', 'Monday — Lunes', 'Tuesday — Martes'],
    listening: 'A: What day is it today? B: It’s Tuesday. A: What day was it yesterday? B: It was Monday. A: What day is it tomorrow? B: It’s Wednesday.',
    listeningEs: 'A: ¿Qué día es hoy? B: Es martes. A: ¿Qué día fue ayer? B: Fue lunes. A: ¿Qué día es mañana? B: Es miércoles.',
  },
  44: {
    grammar: 'Usa “a” ante sonido consonántico (“a pen”) y “an” ante sonido vocálico (“an apple”). Añade -s a la mayoría de los sustantivos para formar el plural: “one book”, “two books”.',
    example: 'This is a pen. These are two books.', exampleTranslation: 'Esto es un bolígrafo. Estos son dos libros.',
    vocabulary: ['Pen — Bolígrafo', 'Book — Libro', 'Apple — Manzana', 'A — Un / una', 'An — Un / una (antes de sonido vocálico)', 'Books — Libros'],
    listening: 'A: What is this? B: It’s a pen. A: What are those? B: They’re two books and an apple.',
    listeningEs: 'A: ¿Qué es esto? B: Es un bolígrafo. A: ¿Qué son esos? B: Son dos libros y una manzana.',
  },
};

const grammarNotesByLesson = [
  beginnerOverrides[1].grammar,
  beginnerOverrides[2].grammar,
  beginnerOverrides[3].grammar,
  beginnerOverrides[4].grammar,
  beginnerOverrides[5].grammar,
  beginnerOverrides[6].grammar,
  'Para contar objetos, el número va antes del sustantivo: “one book”. Con dos o más, el sustantivo suele llevar -s: “two books”.',
  'Los números del 6 al 10 siguen el mismo orden: primero dices el número y después el objeto. “Six pens” significa seis bolígrafos.',
  'Los números del 13 al 19 suelen terminar en -teen. Escucha la sílaba tónica para distinguir “thirteen” de “thirty”.',
  'Las decenas terminan normalmente en -ty: twenty, thirty, forty. “Forty” no lleva la u de “four”.',
  'Forma números como 21 uniendo decena y unidad con guion: “twenty-one”, “thirty-five”.',
  'Pregunta la edad con “How old are you?” y responde “I am … years old”. Para un teléfono, di cada cifra por separado.',
  'Usa “on” delante de un día: “on Monday”. Los nombres de los días empiezan con mayúscula en inglés.',
  'El patrón “on + day” también sirve para planes: “on Friday”. Los días siempre empiezan con mayúscula.',
  'Para decir qué día es: “What day is it?” — “It’s Monday”. “It’s” significa “It is”.',
  '“Yesterday” habla del día anterior, “today” del presente y “tomorrow” del día siguiente. Usa “Yesterday was…”, “Today is…” y “Tomorrow is…”.',
  'Pregunta “What day is it?” y responde “It’s + día”. Para hablar de una actividad habitual, usa “on + día”.',
  'Para una rutina semanal, combina presente simple y “on + day”: “I study on Mondays”.',
  'Usa “in” con meses: “in May”. Usa “on” con un día o una fecha concreta: “on Monday”, “on May 5th”.',
  'El patrón “in + month” indica el mes; “on + date” indica el día concreto.',
  'Los meses llevan mayúscula. Usa “in” para el mes y “on” para una fecha completa.',
  'Las fechas pueden incluir números ordinales: first (1st), second (2nd), third (3rd); después se suele añadir -th.',
  'Pregunta “When is your birthday?” y responde “It’s in + mes” o “It’s on + fecha”.',
  'Repasa la diferencia: “in” + mes, “on” + día o fecha. Los días y meses llevan mayúscula.',
  'El pronombre sustituye al nombre: I (yo), you (tú), he (él), she (ella), it (cosa/animal), we (nosotros) y they (ellos).',
  'El verbo “to be” cambia con el sujeto: I am; he/she/it is; you/we/they are.',
  'Una frase afirmativa básica sigue el orden sujeto + “to be” + información: “She is a student”.',
  'Para negar, añade “not” después de “to be”: “I am not”, “he isn’t”, “they aren’t”.',
  'En preguntas con “to be”, el verbo va delante del sujeto: “Are you…?”, “Is she…?”.',
  'Da datos personales con estos bloques: “My name is…”, “I am … years old” y “I am from…”.',
  'Para presentar a alguien de tu familia, usa “This is my…”: “This is my sister”.',
  'El adjetivo posesivo va antes del familiar: my mother, his brother, her parents, our family.',
  'Los trabajos en singular suelen llevar “a” o “an”: “a teacher”, “an actor”. Usa “an” antes de sonido vocálico.',
  'Di el origen con “I am from…” y la nacionalidad después de “I am”: “I am Spanish”.',
  'Con “to be”, el adjetivo describe a la persona: “He is tall”. Antes del sustantivo: “a tall man”.',
  'Combina “This is my…” para una persona y “These are my…” para varias: “These are my parents”.',
  'En presente simple, I/you/we/they usan el verbo base: “I work”, “we study”.',
  'En negativa usa “don’t + verbo base”: “I don’t work”. Para preguntar: “Do you work?”.',
  'Con he/she/it, añade normalmente -s: “she works”. En negativa usa “doesn’t + verbo base”: “she doesn’t work”.',
  'Las preguntas usan “Do” con I/you/we/they y “Does” con he/she/it. Después va el verbo base.',
  'Pregunta la hora con “What time is it?”. Usa “at” para la hora de una actividad: “at nine o’clock”.',
  'Ordena una rutina con “First”, “Then” y “After that”. Mantén el presente simple para acciones habituales.',
  'Usa “a” ante sonido consonántico (“a pen”) y “an” ante sonido vocálico (“an apple”). “This” está cerca; “that” más lejos.',
  'Para formar el plural regular, añade -s: book/books. Añade -es en palabras como box/boxes.',
  'Usa “There is” con una cosa y “There are” con varias: “There is a kitchen”; “There are two bedrooms”.',
  'Los posesivos “mine” y “yours” sustituyen al sustantivo: “This chair is mine”.',
  'Usa “in” dentro de algo, “on” sobre una superficie y “under” debajo: “The book is on the table”.',
  'Combina “There is/are” con lugar: “There is a lamp next to the bed”.',
  'Los alimentos contables tienen plural (“an apple”, “two apples”); los incontables suelen ir sin plural (“some rice”).',
  'Pide con cortesía usando “I’d like…” o “Can I have…?” y añade “please”.',
  'Pregunta el precio con “How much is it?”. Para contar objetos, usa “How many…?” + sustantivo plural.',
  'En una tienda puedes decir “I’m looking for…” o “I’d like…”. Para preguntar un precio: “How much is this?”.',
  'Da instrucciones con el imperativo, sin sujeto: “Go straight”, “Turn left”, “Turn right”.',
  'En una cafetería, usa “Can I have…?” o “I’d like…”, escucha el precio y responde “Here you are”.',
  'Repasa números en frases: “I am … years old”; “It costs …”; “My phone number is…”.',
  'Repasa “in + mes” y “on + día/fecha”: “in July”, “on Saturday”, “on July 12th”.',
  'Integra pronombres, “to be” y presente simple. En preguntas, comprueba si necesitas “to be” o “do/does”.',
  'Al escuchar, identifica primero quién habla, el tema y las palabras conocidas; después responde con frases breves.',
  'Resuelve una situación cotidiana uniendo saludo, pregunta, respuesta y despedida. Mantén sujeto y verbo en cada frase.',
  'Evaluación final: revisa orden de frase, verbo, artículos y preguntas antes de entregar tu respuesta.',
];

const seed = fs.readFileSync(seedPath, 'utf8');
const lessonMetadata = new Map();
for (const line of seed.split(/\r?\n/)) {
  const match = line.match(/VALUES \('a1-(\d+)', 'english-a1', \d+, \d+, '([^']*)', '([^']*)'/);
  if (match) lessonMetadata.set(Number(match[1]), { title: match[2], objective: match[3] });
}
lessonMetadata.set(1, {
  title: 'Saludos, sonidos y presentaciones',
  objective: 'Reconocer sonidos iniciales y usar saludos y frases básicas para presentarte.',
});

if (lessonMetadata.size !== 60 || sourceUnitByLesson.length !== 60 || grammarNotesByLesson.length !== 60) {
  throw new Error(`Expected 60 lessons, mappings and grammar notes; got ${lessonMetadata.size}, ${sourceUnitByLesson.length} and ${grammarNotesByLesson.length}.`);
}

const output = {};
for (let number = 1; number <= 60; number += 1) {
  const lessonId = `a1-${String(number).padStart(2, '0')}`;
  const metadata = lessonMetadata.get(number);
  const source = getSourceUnit(sourceUnitByLesson[number - 1]);
  const readingBlock = source.blocks.find((block) => block.title === 'Reading Comprehension');
  const transcriptMarkup = readingBlock?.content?.find((item) => item.transcript)?.transcript || '';
  const listeningText = parseAnnotated(transcriptMarkup, 0).slice(0, 1400);
  const transcriptSentences = listeningText.match(/[^.!?]+[.!?]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
  const grammarExample = transcriptSentences.find((sentence) => sentence.length > 16 && /\b(am|is|are|do|does|can|have|has|like|likes|there|my|your)\b/i.test(sentence)) ?? transcriptSentences[0] ?? listeningText;
  const vocabularyItems = source.blocks
    .filter((block) => block.title === 'Vocabulary Introduction')
    .flatMap((block) => block.content || [])
    .map((item) => item.stimulus_en)
    .filter((item) => Boolean(item) && !item.includes('_'))
    .map((item) => ({ english: parseAnnotated(item, 0), spanish: parseAnnotated(item, 1) }))
    .filter((item, index, all) => item.english && item.spanish && all.findIndex((other) => other.english === item.english) === index)
    .slice(0, 8);

  if (!listeningText || vocabularyItems.length < 4) {
    throw new Error(`Unit ${number} is missing listening or vocabulary content.`);
  }

  const override = beginnerOverrides[number];
  const vocabList = override?.vocabulary.join('\n') ?? vocabularyItems.map((item) => `${item.english} — ${item.spanish}`).join('\n');
  const audioText = override?.listening ?? listeningText;
  const example = override?.example ?? grammarExample;
  const exampleTranslation = override?.exampleTranslation;
  const writingPrompt = /repaso|evaluación|misión/i.test(metadata.title)
    ? `Redacta un texto corto de 5–6 frases para resolver la situación de «${metadata.title}». Combina lo aprendido y revisa que cada frase tenga sujeto y verbo.`
    : `Escribe 3–5 frases sobre «${metadata.title}». Practica este objetivo: ${metadata.objective} Añade al menos tres palabras de la lista y revisa el orden de la frase y la puntuación.`;

  output[lessonId] = {
    objective: metadata.objective,
    sections: [
      {
        type: 'grammar',
        title: 'Gramática',
        body: override?.grammar ?? `${grammarNotesByLesson[number - 1]}\n\nFíjate en el modelo y repite la estructura en voz alta:`,
        example,
        ...(exampleTranslation ? { exampleTranslation } : {}),
      },
      {
        type: 'vocabulary',
        title: 'Vocabulario',
        body: `Palabras y expresiones útiles para ${metadata.title.toLocaleLowerCase('es')}:\n${vocabList}`,
      },
      {
        type: 'listening',
        title: 'Listening',
        body: 'Escucha el diálogo completo una vez. Después, vuelve a escucharlo e intenta reconocer las expresiones de vocabulario.',
        audioText,
      },
      {
        type: 'writing',
        title: 'Writing',
        body: 'Escribe primero sin traducir palabra por palabra. Usa el modelo de gramática y revisa mayúsculas, orden y puntuación.',
        prompt: writingPrompt,
      },
    ],
  };
}

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Generated ${Object.keys(output).length} A1 units with four learning sections: ${path.relative(root, outputPath)}`);

