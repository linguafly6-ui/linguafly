import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src/content/cursos/ingles-a1');
const seedPath = path.join(root, 'migrations/d1/202610280002_seed_a1_course.sql');
const outputPath = path.join(root, 'migrations/d1/202610290005_a1_15_exercises_per_section.sql');
const migrationDir = path.join(root, 'migrations/d1');

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
function makeOptionsUnique(options, correct, contextCandidates = []) {
  const normalizedCorrect = String(correct).trim().toLocaleLowerCase('en');
  const optionFallbacks = {
    am: ['am', 'is', 'are'], is: ['is', 'am', 'are'], are: ['are', 'is', 'am'],
    a: ['a', 'an', 'the'], an: ['an', 'a', 'the'],
    in: ['in', 'on', 'at'], on: ['on', 'in', 'at'], at: ['at', 'in', 'on'],
    was: ['was', 'were', 'is'], were: ['were', 'was', 'are'],
    "don't": ["don't", "doesn't", 'do'], "doesn't": ["doesn't", "don't", 'does'],
    do: ['do', 'does', 'are'], does: ['does', 'do', 'is'],
    have: ['have', 'has', 'do'], has: ['has', 'have', 'is'],
    like: ['like', 'likes', 'love'], likes: ['likes', 'like', 'loves'],
    what: ['What', 'Where', 'When', 'Who'], where: ['Where', 'When', 'What', 'Who'],
    first: ['First', 'Then', 'Next', 'Finally'], would: ['would', 'could', 'should'],
    one: ['one', 'two', 'three', 'four'], two: ['two', 'one', 'three', 'four'],
    three: ['three', 'two', 'four', 'five'], four: ['four', 'three', 'five', 'two'],
    five: ['five', 'four', 'six', 'three'], any: ['any', 'some', 'a', 'many'],
    some: ['some', 'any', 'a', 'many'], many: ['many', 'much', 'some', 'any'],
    much: ['much', 'many', 'some', 'any'], from: ['from', 'in', 'on', 'at'],
    bank: ['bank', 'school', 'park', 'station'], blue: ['blue', 'green', 'brown', 'black'],
  }[normalizedCorrect];
  const candidates = [...(optionFallbacks ?? []), ...contextCandidates];
  if (candidates.length === 0) return { options, repaired: false };
  const result = [...options];
  const correctIndex = result.indexOf(correct);
  const seen = new Map();
  let repaired = false;
  for (let index = 0; index < result.length; index += 1) {
    const normalized = result[index].trim().toLocaleLowerCase('en');
    if (!seen.has(normalized)) {
      seen.set(normalized, index);
      continue;
    }
    const earlierIndex = seen.get(normalized);
    const replaceIndex = index === correctIndex ? earlierIndex : index;
    const used = new Set(result.filter((_option, optionIndex) => optionIndex !== replaceIndex).map((option) => option.trim().toLocaleLowerCase('en')));
    const fallback = candidates.find((option) => !used.has(option.toLocaleLowerCase('en')) && option.toLocaleLowerCase('en') !== String(correct).trim().toLocaleLowerCase('en'));
    if (!fallback) throw new Error(`Could not replace duplicate option '${result[replaceIndex]}'`);
    result[replaceIndex] = fallback;
    seen.set(fallback.toLocaleLowerCase('en'), replaceIndex);
    if (replaceIndex === earlierIndex) seen.set(normalized, index);
    repaired = true;
  }
  return { options: result, repaired };
}

const negativeContractions = { "don't": 'do not', "doesn't": 'does not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "can't": 'cannot', "won't": 'will not' };
function negativeVariants(answer) {
  const expanded = answer.replace(/\b(don't|doesn't|isn't|aren't|wasn't|weren't|can't|won't)\b/gi, (match) => negativeContractions[match.toLocaleLowerCase('en')] ?? match);
  const variants = [expanded];
  if (answer.toLocaleLowerCase('en') === 'am not') variants.push("I'm not");
  return [...new Set(variants.filter((variant) => variant !== answer))];
}

function normalizeNegativeGrammarItem(item) {
  if (!['fill-blank', 'multiple-choice'].includes(item.type)) return null;
  const stimulus = unmark(item.stimulus_en, 0);
  if (!stimulus.includes('_')) return null;
  const rawAnswer = item.type === 'multiple-choice'
    ? item.options?.find((option) => option.id === item.correct_answer)?.text ?? item.correct_answer
    : item.correct_answer;
  const answer = unmark(rawAnswer, 0);
  let nextStimulus = stimulus;
  let negativeAnswer = answer;
  const embeddedNegative = stimulus.match(/\b(don't|doesn't|didn't|do not|does not|did not|isn't|aren't|wasn't|weren't|can't|cannot|won't|will not)\s+_{2,}\s+([A-Za-z]+)\b/i);
  const negativeAuxiliaryOnly = /^(?:don't|doesn't|didn't|isn't|aren't|wasn't|weren't|can't|cannot|won't|do not|does not|did not|is not|are not|was not|were not|will not)$/i.test(answer);
  if (embeddedNegative) {
    // Keep the lexical verb visible and ask for the auxiliary only.
    negativeAnswer = embeddedNegative[1];
    nextStimulus = stimulus.replace(embeddedNegative[0], `______ ${answer} ${embeddedNegative[2]}`);
  } else if (negativeAuxiliaryOnly) {
    const blankAndVerb = stimulus.match(/_{2,}\s+([A-Za-z]+)\b/);
    if (!blankAndVerb) return null;
    // The blank is already for do/does/don't/doesn't; the verb after it is
    // visible context and must not be pulled into the expected answer.
    negativeAnswer = answer;
  } else if (/_{2,}\s+not\b/i.test(stimulus) && /^(am|is|are|was|were)$/i.test(answer)) {
    const subject = stimulus.match(/^\s*(I|you|he|she|it|we|they)\b/i)?.[1]?.toLocaleLowerCase('en');
    const forms = { i: 'am not', you: "aren't", he: "isn't", she: "isn't", it: "isn't", we: "aren't", they: "aren't" };
    if (!subject) return null;
    negativeAnswer = forms[subject];
    nextStimulus = stimulus.replace(/_{2,}\s+not\b/i, '______');
  } else if (item.type !== 'multiple-choice' || !/\b(?:don't|doesn't|didn't|isn't|aren't|wasn't|weren't|can't|cannot|won't|not)\b/i.test(answer)) {
    return null;
  }
  return { stimulus: nextStimulus, answer: negativeAnswer, accepted: negativeVariants(negativeAnswer) };
}

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

function normalizeSourceItem(item, category, lessonNumber, exerciseNumber, optionFallbacks = []) {
  const lessonId = `a1-${String(lessonNumber).padStart(2, '0')}`;
  const idSection = category === 'reading' ? 'wri' : category.slice(0, 3);
  const id = `a1-u${String(lessonNumber).padStart(2, '0')}-${idSection}-${String(exerciseNumber).padStart(2, '0')}`;
  const negativeRepair = category === 'grammar' ? normalizeNegativeGrammarItem(item) : null;
  if (negativeRepair) item = { ...item, type: 'fill-blank', stimulus_en: negativeRepair.stimulus, correct_answer: negativeRepair.answer, accepted_answers: negativeRepair.accepted, negative_form_changed: true };
  const promptEs = unmark(item.prompt_es, 1);
  const stimulusEn = unmark(item.stimulus_en, 0);
  const stimulusEs = unmark(item.stimulus_en, 1);
  let type = item.type;
  let prompt = promptEs;
  let options = [];
  let audioText = null;
  let passageText = null;
  let correct;
  let explanation;

  if (category === 'listening' && item.transcript) {
    type = 'multiple-choice';
    // The ten comprehension questions share one dialogue. Attach its playback
    // control only to the first question so every question does not replay it.
    audioText = exerciseNumber === 1 ? unmark(item.transcript, 0) : null;
    prompt = exerciseNumber === 1
      ? `Escucha el diálogo y responde: ${unmark(item.question_en, 0)}`
      : `Según el diálogo del ejercicio 1, responde: ${unmark(item.question_en, 0)}`;
    options = toTextOptions(item.options, 0).map((option) => option.text);
    correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
    explanation = `Transcripción: ${audioText}`;
  } else if (category === 'reading') {
    type = 'multiple-choice';
    const transcript = unmark(item.transcript, 0);
    options = toTextOptions(item.options, 0).map((option) => option.text);
    correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
    if (item.clozeSentence) {
      prompt = `Lee el texto y completa la frase: ${item.clozeSentence}`;
      explanation = `En el texto, la frase completa es “${item.completedSentence}”.`;
    } else {
      prompt = `Lee el texto y responde: ${unmark(item.question_en, 0)}`;
      passageText = transcript;
      explanation = `Busca en el texto la información que confirma «${correct}».`;
    }
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
        : category === 'vocabulary' && stimulusEs
          ? `Elige la palabra en inglés que corresponde a «${stimulusEs}».`
          : `${promptEs}${stimulusEn ? ` ${stimulusEn}` : ''}`.trim();
      correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
      explanation = correct
        ? category === 'vocabulary' && !isIntroVocab && stimulusEs
          ? `«${correct}» significa «${stimulusEs}».`
          : `La respuesta correcta es «${correct}». Comprueba cómo encaja en la frase.`
        : '';
    } else if (item.type === 'fill-blank') {
      const sentence = stimulusEn ? `${stimulusEn}${stimulusEs && stimulusEs !== stimulusEn ? ` (${stimulusEs})` : ''}` : '';
      const grammarBlankContext = [stimulusEn, String(item.correct_answer ?? '')].join(' ');
      const grammarInstruction = /\?\s*$/.test(stimulusEn)
        ? 'Completa la pregunta.'
        : /^(?:do|does|don't|doesn't)$/i.test(String(item.correct_answer ?? '').trim())
          ? "Completa con do, does, don't o doesn't."
        : /\b(?:not|don't|doesn't|isn't|aren't|wasn't|weren't|can't|won't)\b/i.test(grammarBlankContext)
          ? 'Completa la frase en negativo.'
          : 'Completa la frase.';
      prompt = category === 'grammar'
        ? `${grammarInstruction}${sentence ? `
${sentence}` : ''}`
        : `${promptEs}${sentence ? `
${sentence}` : ''}`.trim();
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

  let optionsRepaired = false;
  if (type === 'multiple-choice' && correct && category === 'grammar') {
    const result = makeOptionsUnique(options, correct, optionFallbacks);
    options = result.options;
    optionsRepaired = result.repaired;
  }
  if (type === 'multiple-choice' && (!correct || !options.includes(correct))) {
    throw new Error(`Missing correct option for ${id}.`);
  }
  return {
    id,
    lessonId,
    exerciseNumber: 10000 + ({ vocabulary: 0, grammar: 100, listening: 200, reading: 400 }[category]) + exerciseNumber,
    sectionType: category,
    exerciseType: type === 'sentence-building' ? 'sentence_building' : type === 'fill-blank' ? 'fill_blank' : type === 'free-text' ? 'free_text' : 'multiple_choice',
    prompt,
    options,
    optionsRepaired,
    answerJson: type === 'free-text' ? JSON.stringify({ selfCheck: true }) : JSON.stringify({ correct, ...(item.accepted_answers?.length ? { accepted: item.accepted_answers } : {}) }),
    explanation: explanation ?? '',
    audioText,
    passageText,
    negativeFormChanged: Boolean(item.negative_form_changed),
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
  const grammarOptionFallbacks = [
    ...grammarPool.flatMap((item) => toTextOptions(item.options, 0).map((option) => option.text)),
    ...grammarPool.map((item) => unmark(item.correct_answer, 0)).filter((answer) => answer && answer !== '[object Object]'),
  ];
  const grammarForWriting = grammarPool
    .filter((item) => item.type === 'fill-blank' || item.type === 'sentence-building')
    .slice(-5);
  const grammarForWritingIds = new Set(grammarForWriting.map((item) => item.interaction_id));
  const invalidGrammarItems = grammarPool.filter((item) => !grammarForWritingIds.has(item.interaction_id) && item.type === 'sentence-building');
  const grammarAnswerItems = grammarForWriting.filter((item) => item.type === 'fill-blank').slice(0, invalidGrammarItems.length);
  if (grammarAnswerItems.length !== invalidGrammarItems.length) {
    throw new Error(`Unit ${lessonNumber}: not enough closed grammar exercises to replace free-writing tasks.`);
  }
  const replacementById = new Map(invalidGrammarItems.map((item, index) => [item.interaction_id, grammarAnswerItems[index]]));
  const grammar = grammarPool
    .filter((item) => !grammarForWritingIds.has(item.interaction_id))
    .map((item) => replacementById.get(item.interaction_id) ?? item);
  const reassignedGrammarIds = new Set(grammarAnswerItems.map((item) => item.interaction_id));
  const listening = [
    ...sectionBlock(unit, 'Reading Comprehension'),
    ...listeningVocabulary,
  ];
  const readingPool = sectionBlock(unit, 'Reading Comprehension');
  if (readingPool.length < 10) throw new Error(`Unit ${lessonNumber}: expected ten reading comprehension questions.`);
  const reading = [...readingPool.slice(0, 10)];
  const passage = unmark(readingPool[0].transcript, 0);
  const usedAnswers = new Set(reading.map((item) => unmark(item.options.find((option) => option.id === item.correct_answer)?.text, 0).toLocaleLowerCase('en')));
  const stopWords = new Set(['the','and','you','your','his','her','she','him','they','their','this','that','with','from','have','has','are','was','were','for','not','but','too','what','where','when','who','how','can','could','would','there','here','then','than','into','very','some','many','much','does','did','will','are','our','its','one']);
  const tokenMatches = [...passage.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g)];
  const candidateWords = [...new Map(tokenMatches.map((match) => match[0]).filter((word) => word.length >= 3 && !stopWords.has(word.toLocaleLowerCase('en'))).map((word) => [word.toLocaleLowerCase('en'), word])).values()];
  for (const answer of candidateWords) {
    if (reading.length === 15) break;
    const answerIndex = tokenMatches.find((match) => match[0].toLocaleLowerCase('en') === answer.toLocaleLowerCase('en'))?.index ?? -1;
    if (answerIndex < 0) continue;
    const left = Math.max(passage.lastIndexOf('.', answerIndex), passage.lastIndexOf('!', answerIndex), passage.lastIndexOf('?', answerIndex)) + 1;
    const ends = ['.', '!', '?'].map((mark) => passage.indexOf(mark, answerIndex)).filter((index) => index >= 0);
    const right = ends.length ? Math.min(...ends) + 1 : passage.length;
    const sentence = passage.slice(left, right).trim();
    const relativeIndex = answerIndex - left;
    if (relativeIndex < 0) continue;
    const clozeSentence = sentence.slice(0, relativeIndex) + '______' + sentence.slice(relativeIndex + answer.length);
    const distractors = candidateWords.filter((word) => word.toLocaleLowerCase('en') !== answer.toLocaleLowerCase('en')).slice(0, 2);
    if (distractors.length < 2) continue;
    reading.push({ transcript: readingPool[0].transcript, question_en: '', options: [{id:'r1',text:`[[${answer}|${answer}]]`},{id:'r2',text:`[[${distractors[0]}|${distractors[0]}]]`},{id:'r3',text:`[[${distractors[1]}|${distractors[1]}]]`}], correct_answer: 'r1', clozeSentence, completedSentence: sentence });
    usedAnswers.add(answer.toLocaleLowerCase('en'));
  }
  if (reading.length !== 15) throw new Error(`Unit ${lessonNumber}: could only build ${reading.length - 10} additional closed reading tasks.`);
  const sections = { vocabulary, grammar, listening, reading };
  for (const [category, items] of Object.entries(sections)) {
    if (items.length !== 15) throw new Error(`Unit ${lessonNumber}: ${category} has ${items.length}, expected 15.`);
    if (category === 'grammar' && items.some((item) => item.type === 'free-text' || item.type === 'sentence-building')) {
      throw new Error(`Unit ${lessonNumber}: grammar must not contain free writing or invalid sentence-building tasks.`);
    }
    if (category === 'grammar' && (items[8].type === 'free-text' || items[9].type === 'free-text' || items[8].type === 'sentence-building' || items[9].type === 'sentence-building')) {
      throw new Error(`Unit ${lessonNumber}: grammar exercises 9 and 10 must not be free writing.`);
    }
    rows.push(...items.map((item, index) => normalizeSourceItem(item, category, lessonNumber, index + 1, category === 'grammar' ? grammarOptionFallbacks : [])));
  }
}

const statements = [
  '-- Add explicit skill categories and audio stimuli to the A1 exercise bank.',
  'ALTER TABLE learning_exercises ADD COLUMN section_type TEXT NOT NULL DEFAULT \'practice\';',
  'ALTER TABLE learning_exercises ADD COLUMN audio_text TEXT;',
  'CREATE INDEX IF NOT EXISTS idx_learning_exercises_lesson_section ON learning_exercises(lesson_id, section_type, exercise_number);',
  '',
  '-- 15 skill-targeted exercises for each of 60 units: vocabulary, grammar, listening and reading.',
];
for (const row of rows) {
  statements.push(`INSERT INTO learning_exercises (id, lesson_id, exercise_number, exercise_type, prompt, options_json, answer_json, explanation, section_type, audio_text) VALUES (${[
    row.id, row.lessonId, row.exerciseNumber, row.exerciseType, row.prompt, JSON.stringify(row.options), row.answerJson, row.explanation, row.sectionType, row.audioText,
  ].map(sql).join(', ')});`);
}

fs.writeFileSync(outputPath, `${statements.join('\n')}\n`, 'utf8');
const corrections = [];
for (const row of rows) {
  if (row.sectionType === 'grammar' && [10109, 10110].includes(row.exerciseNumber)) {
    corrections.push(`UPDATE learning_exercises SET exercise_type = ${sql(row.exerciseType)}, prompt = ${sql(row.prompt)}, options_json = ${sql(JSON.stringify(row.options))}, answer_json = ${sql(row.answerJson)}, explanation = ${sql(row.explanation)} WHERE id = ${sql(row.id)};`);
  } else if (row.sectionType === 'vocabulary' && [10011, 10012, 10013, 10014].includes(row.exerciseNumber)) {
    corrections.push(`UPDATE learning_exercises SET prompt = ${sql(row.prompt)}, explanation = ${sql(row.explanation)} WHERE id = ${sql(row.id)};`);
  } else if (row.sectionType === 'grammar' && [10107, 10113, 10114, 10115].includes(row.exerciseNumber) && row.optionsRepaired) {
    corrections.push(`UPDATE learning_exercises SET options_json = ${sql(JSON.stringify(row.options))} WHERE id = ${sql(row.id)};`);
  }
}
const readingUpdates = rows.filter((row) => row.sectionType === 'reading').map((row) =>
  `UPDATE learning_exercises SET exercise_number = ${row.exerciseNumber}, exercise_type = ${sql(row.exerciseType)}, prompt = ${sql(row.prompt)}, options_json = ${sql(JSON.stringify(row.options))}, answer_json = ${sql(row.answerJson)}, explanation = ${sql(row.explanation)}, section_type = 'reading', audio_text = ${sql(row.passageText)} WHERE id = ${sql(row.id)};`
);
const descriptionUpdate = `UPDATE learning_courses SET description = 'Curso A1 desde cero con 60 unidades y apartados de gramática, vocabulario, listening y comprensión lectora.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = 'english-a1';`;
const readingChunks = [];
for (let index = 0; index < readingUpdates.length; index += 50) readingChunks.push(readingUpdates.slice(index, index + 50));
readingChunks.forEach((chunk, index) => {
  const parts = index === readingChunks.length - 1 && chunk.length > 40 ? [chunk.slice(0, 40), chunk.slice(40)] : [chunk];
  parts.forEach((part, partIndex) => {
    const migrationIndex = index + partIndex;
    const migrationNumber = String(9 + migrationIndex).padStart(3, '0');
    const suffix = migrationIndex === 0 ? '' : `_${String(migrationIndex + 1).padStart(2, '0')}`;
    const migrationPath = path.join(migrationDir, `202610290${migrationNumber}_a1_reading_comprehension${suffix}.sql`);
    const batchCount = readingChunks.length + (parts.length - 1);
    const preamble = migrationIndex === 0 ? `-- Replace the former Writing section with closed A1 reading comprehension.\nDELETE FROM learning_exercise_progress WHERE exercise_id LIKE 'a1-u%-wri-%';\n${descriptionUpdate}\n` : `-- Continue the A1 reading comprehension conversion (batch ${migrationIndex + 1}/${batchCount}).\n`;
    fs.writeFileSync(migrationPath, `${preamble}${part.join('\n')}\n`, 'utf8');
  });
});
const grammarPromptUpdates = rows.filter((row) => row.sectionType === 'grammar' && row.exerciseType === 'fill_blank').map((row) =>
  `UPDATE learning_exercises SET prompt = ${sql(row.prompt)} WHERE id = ${sql(row.id)};`
);
const grammarPromptBatchSize = 40;
for (let index = 0; index < grammarPromptUpdates.length; index += grammarPromptBatchSize) {
  const batch = grammarPromptUpdates.slice(index, index + grammarPromptBatchSize);
  const migrationNumber = String(39 + Math.floor(index / grammarPromptBatchSize)).padStart(3, '0');
  const migrationPath = path.join(migrationDir, `202610290${migrationNumber}_a1_grammar_prompt_alignment.sql`);
  fs.writeFileSync(migrationPath, `-- Align grammar fill-in prompts with statement polarity and questions.\n${batch.join('\n')}\n`, 'utf8');
}
for (const row of rows.filter((item) => item.sectionType === 'grammar' && item.exerciseType === 'fill_blank')) {
  if (/afirmativa|affirmative/i.test(row.prompt)) throw new Error(`Misleading affirmative instruction remains on ${row.id}`);
}
const grammarRepairRows = rows.filter((row) => row.sectionType === 'grammar' && (row.negativeFormChanged || row.optionsRepaired));
const duplicateChoiceRows = rows.filter((row) => row.exerciseType === 'multiple_choice' && new Set(row.options.map((option) => option.trim().toLocaleLowerCase('en'))).size !== row.options.length);
if (duplicateChoiceRows.length) throw new Error(`Found duplicate answer choices in ${duplicateChoiceRows.length} exercises: ${duplicateChoiceRows.slice(0, 5).map((row) => row.id).join(', ')}`);
const grammarRepairBatchSize = 40;
for (let index = 0; index < grammarRepairRows.length; index += grammarRepairBatchSize) {
  const batch = grammarRepairRows.slice(index, index + grammarRepairBatchSize);
  const migrationNumber = String(52 + Math.floor(index / grammarRepairBatchSize)).padStart(3, '0');
  const migrationPath = path.join(migrationDir, `202610290${migrationNumber}_a1_grammar_negative_and_choices.sql`);
  const clearProgress = `DELETE FROM learning_exercise_progress WHERE exercise_id IN (${batch.map((row) => sql(row.id)).join(', ')});`;
  const updates = batch.map((row) => `UPDATE learning_exercises SET exercise_type = ${sql(row.exerciseType)}, prompt = ${sql(row.prompt)}, options_json = ${sql(JSON.stringify(row.options))}, answer_json = ${sql(row.answerJson)}, explanation = ${sql(row.explanation)} WHERE id = ${sql(row.id)};`);
  fs.writeFileSync(migrationPath, `-- Make negative grammar answers learner-produced and remove repeated choices.\n${clearProgress}\n${updates.join('\n')}\n`, 'utf8');
}
const auxiliaryPracticeRows = rows.filter((row) => {
  if (row.sectionType !== 'grammar' || !row.negativeFormChanged) return false;
  try {
    return /^(?:do|does|don't|doesn't)$/i.test(JSON.parse(row.answerJson).correct ?? '');
  } catch {
    return false;
  }
});
for (let index = 0; index < auxiliaryPracticeRows.length; index += grammarRepairBatchSize) {
  const batch = auxiliaryPracticeRows.slice(index, index + grammarRepairBatchSize);
  const migrationNumber = String(59 + Math.floor(index / grammarRepairBatchSize)).padStart(3, '0');
  const migrationPath = path.join(migrationDir, `202610290${migrationNumber}_a1_auxiliary_answer_clarity.sql`);
  const clearProgress = `DELETE FROM learning_exercise_progress WHERE exercise_id IN (${batch.map((row) => sql(row.id)).join(', ')});`;
  const updates = batch.map((row) => `UPDATE learning_exercises SET exercise_type = ${sql(row.exerciseType)}, prompt = ${sql(row.prompt)}, options_json = ${sql(JSON.stringify(row.options))}, answer_json = ${sql(row.answerJson)}, explanation = ${sql(row.explanation)} WHERE id = ${sql(row.id)};`);
  fs.writeFileSync(migrationPath, `-- Make do/does/don't/doesn't practice ask for the auxiliary only.\n${clearProgress}\n${updates.join('\n')}\n`, 'utf8');
}
console.log(`Generated ${rows.length} exercises (15 in each of 4 sections across 60 units): ${path.relative(root, outputPath)}`);
console.log(`Regenerated ${grammarPromptUpdates.length} complete grammar fill-in prompts across ${Math.ceil(grammarPromptUpdates.length / grammarPromptBatchSize)} D1-safe migrations.`);
console.log(`Corrected ${grammarRepairRows.length} negative-form or duplicate-choice exercises; ${duplicateChoiceRows.length} duplicate-choice exercises remain.`);
console.log(`Clarified ${auxiliaryPracticeRows.length} auxiliary-only grammar answers in ${Math.ceil(auxiliaryPracticeRows.length / grammarRepairBatchSize)} additional migration(s).`);

