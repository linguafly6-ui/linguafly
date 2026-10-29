import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src/content/cursos/ingles-a1');
const seedPath = path.join(root, 'migrations/d1/202610280002_seed_a1_course.sql');
const outputPath = path.join(root, 'migrations/d1/202610290005_a1_15_exercises_per_section.sql');

const sourceUnitByLesson = [
  1, 1, 1, 1, 3, 1, 4, 4, 8, 8, 8, 8,
  12, 12, 12, 47, 12, 13, 19, 19, 19, 19, 19, 19,
  2, 2, 2, 3, 3, 1, 6, 6, 9, 2, 7, 6,
  5, 14, 15, 15, 11, 13, 4, 4, 21, 22, 24, 23,
  17, 16, 8, 51, 26, 16, 8, 19, 10, 1, 60, 60,
];

const unmark = (value, side = 0) => String(value ?? '')
  .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_whole, first, second) => side === 0 ? first : second)
  .replace(/\s+([.,?!;:])/g, '$1')
  .replace(/([.,?!;:])(?=[A-Za-zÁÉÍÓÚÑáéíóúñ])/g, '$1 ')
  .replace(/\s+/g, ' ')
  .trim();

const sql = (value) => `'${String(value ?? '').replace(/'/g, "''")}'`;
const toTextOptions = (options, side = 0) => (options ?? []).map((option) => ({
  id: option.id,
  text: unmark(option.text, side),
}));
const sectionBlock = (unit, title) => unit.blocks.find((block) => block.title === title)?.content ?? [];

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

if (lessonMetadata.size !== 60 || sourceUnitByLesson.length !== 60) {
  throw new Error('Expected metadata and source mappings for all 60 A1 units.');
}

function normalizeSourceItem(item, category, lessonNumber, exerciseNumber) {
  const lessonId = `a1-${String(lessonNumber).padStart(2, '0')}`;
  const id = `a1-u${String(lessonNumber).padStart(2, '0')}-${category.slice(0, 3)}-${String(exerciseNumber).padStart(2, '0')}`;
  const promptEs = unmark(item.prompt_es, 1);
  const stimulusEn = unmark(item.stimulus_en, 0);
  const stimulusEs = unmark(item.stimulus_en, 1);
  let type = item.type;
  let prompt = promptEs;
  let options = [];
  let audioText = null;
  let correct;
  let explanation;

  if (category === 'listening' && item.transcript) {
    type = 'multiple-choice';
    audioText = unmark(item.transcript, 0);
    prompt = `Escucha el diálogo y responde: ${unmark(item.question_en, 1)}`;
    options = toTextOptions(item.options, 0).map((option) => option.text);
    correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
    explanation = `Transcripción: ${audioText}`;
  } else if (category === 'listening') {
    if (item.type === 'fill-blank') {
      type = 'fill-blank';
      audioText = stimulusEn.replace(/_{2,}/g, unmark(item.correct_answer, 0));
      prompt = `Escucha la frase completa y escribe la palabra que falta.\n${stimulusEs}`;
      correct = unmark(item.correct_answer, 0);
      explanation = `La frase completa es “${audioText}”. Escúchala otra vez y fíjate en la palabra que faltaba.`;
    } else {
      type = 'multiple-choice';
      audioText = stimulusEn;
      prompt = 'Escucha la expresión y elige su significado en español.';
      options = toTextOptions(item.options, 1).map((option) => option.text);
      correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
      explanation = 'Vuelve a escuchar la expresión y relaciónala con el contexto de esta unidad.';
    }
  } else if (item.type === 'free-text') {
    type = 'free-text';
    prompt = promptEs;
    explanation = 'Revisa tu texto: ¿has usado el vocabulario de la unidad y una frase completa en inglés?';
  } else if (item.type === 'reading-comprehension') {
    throw new Error(`Reading item was assigned to ${category}; expected listening.`);
  } else {
    const isIntroVocab = category === 'vocabulary' && item.mastery_tag === 'vocabulary' && item.prompt_es?.includes('translation');
    const optionSide = isIntroVocab ? 0 : 0;
    options = toTextOptions(item.options, optionSide).map((option) => option.text);
    if (item.type === 'multiple-choice') {
      prompt = isIntroVocab
        ? `Elige la traducción al español de “${stimulusEn}”.`
        : `${promptEs}${stimulusEn ? ` ${stimulusEn}` : ''}`.trim();
      correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
      explanation = correct ? `La respuesta correcta es «${correct}». Comprueba cómo encaja en la frase.` : '';
    } else if (item.type === 'fill-blank') {
      const sentence = stimulusEn ? `${stimulusEn}${stimulusEs && stimulusEs !== stimulusEn ? ` (${stimulusEs})` : ''}` : '';
      prompt = `${promptEs}${sentence ? `\n${sentence}` : ''}`.trim();
      correct = String(item.correct_answer ?? '');
      explanation = `La palabra que completa la frase es “${correct}”. Léela dentro de la oración completa.`;
    } else if (item.type === 'sentence-building') {
      // The legacy source marks topical vocabulary lists as sentence-building items.
      // Never present those lists as a correct sentence or disclose a fabricated key.
      type = 'free-text';
      const words = toTextOptions(item.options, 0).map((option) => option.text).filter(Boolean);
      prompt = `Escribe una frase corta en inglés sobre ${lessonMetadata.get(lessonNumber)?.title ?? 'esta unidad'}. Puedes usar alguna de estas palabras: ${words.join(', ')}.`;
      options = [];
      explanation = 'Comprueba que tu frase tenga sujeto y verbo. Revisa el orden de las palabras y el uso del vocabulario.';
    } else {
      throw new Error(`Unsupported item type '${item.type}' in unit ${lessonNumber}.`);
    }
  }

  if (type === 'multiple-choice' && (!correct || !options.includes(correct))) {
    throw new Error(`Missing correct option for ${id}.`);
  }
  return {
    id,
    lessonId,
    exerciseNumber: 10000 + ({ vocabulary: 0, grammar: 100, listening: 200, writing: 300 }[category]) + exerciseNumber,
    sectionType: category,
    exerciseType: type === 'sentence-building' ? 'sentence_building' : type === 'fill-blank' ? 'fill_blank' : type === 'free-text' ? 'free_text' : 'multiple_choice',
    prompt,
    options,
    answerJson: type === 'free-text' ? JSON.stringify({ selfCheck: true }) : JSON.stringify({ correct }),
    explanation: explanation ?? '',
    audioText,
  };
}

const rows = [];
for (let lessonNumber = 1; lessonNumber <= 60; lessonNumber += 1) {
  const sourceNumber = sourceUnitByLesson[lessonNumber - 1];
  const unit = JSON.parse(fs.readFileSync(path.join(contentDir, `unit${sourceNumber}.json`), 'utf8'));
  const vocabularyPool = [
    ...sectionBlock(unit, 'Vocabulary Introduction'),
    ...sectionBlock(unit, 'Vocabulary in Context'),
  ];
  const vocabulary = vocabularyPool.slice(0, 15);
  const listeningVocabulary = vocabularyPool.slice(10, 15);
  const grammarPool = [
    ...sectionBlock(unit, 'Grammar — Affirmative'),
    ...sectionBlock(unit, 'Grammar — Negative & Questions'),
  ];
  const grammarForWriting = grammarPool
    .filter((item) => item.type === 'fill-blank' || item.type === 'sentence-building')
    .slice(-5);
  const grammarForWritingIds = new Set(grammarForWriting.map((item) => item.interaction_id));
  const grammar = grammarPool.filter((item) => !grammarForWritingIds.has(item.interaction_id));
  const listening = [
    ...sectionBlock(unit, 'Reading Comprehension'),
    ...listeningVocabulary,
  ];
  const production = sectionBlock(unit, 'Production').filter((item) => item.type !== 'true-false');
  const customWriting = [
    {
      type: 'free-text',
      prompt_es: 'Escribe una frase verdadera sobre ti relacionada con el tema de esta unidad. Usa una estructura que acabas de aprender.',
      mastery_tag: 'production',
    },
    {
      type: 'free-text',
      prompt_es: 'Escribe una pregunta corta en inglés que podrías usar en esta situación. Revisa el orden de las palabras.',
      mastery_tag: 'production',
    },
    {
      type: 'free-text',
      prompt_es: 'Escribe un mini diálogo de dos intervenciones sobre el tema de esta unidad. Incluye una expresión de vocabulario.',
      mastery_tag: 'production',
    },
  ];
  const writing = [...production, ...grammarForWriting, ...customWriting];
  const sections = { vocabulary, grammar, listening, writing };
  for (const [category, items] of Object.entries(sections)) {
    if (items.length !== 15) throw new Error(`Unit ${lessonNumber}: ${category} has ${items.length}, expected 15.`);
    rows.push(...items.map((item, index) => normalizeSourceItem(item, category, lessonNumber, index + 1)));
  }
}

const statements = [
  '-- Add explicit skill categories and audio stimuli to the A1 exercise bank.',
  'ALTER TABLE learning_exercises ADD COLUMN section_type TEXT NOT NULL DEFAULT \'practice\';',
  'ALTER TABLE learning_exercises ADD COLUMN audio_text TEXT;',
  'CREATE INDEX IF NOT EXISTS idx_learning_exercises_lesson_section ON learning_exercises(lesson_id, section_type, exercise_number);',
  '',
  '-- 15 skill-targeted exercises for each of 60 units: vocabulary, grammar, listening and writing.',
];
for (const row of rows) {
  statements.push(`INSERT INTO learning_exercises (id, lesson_id, exercise_number, exercise_type, prompt, options_json, answer_json, explanation, section_type, audio_text) VALUES (${[
    row.id, row.lessonId, row.exerciseNumber, row.exerciseType, row.prompt, JSON.stringify(row.options), row.answerJson, row.explanation, row.sectionType, row.audioText,
  ].map(sql).join(', ')});`);
}

fs.writeFileSync(outputPath, `${statements.join('\n')}\n`, 'utf8');
console.log(`Generated ${rows.length} exercises (15 in each of 4 sections across 60 units): ${path.relative(root, outputPath)}`);

