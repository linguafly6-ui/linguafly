/**
 * Unidad 31 B1 — Lección 3: Comprensión lectora (Defining relative clauses, Natural world)
 * 15 actividades
 */

import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = '[[Reading|Comprensión lectora]]';
const READING_TRANSCRIPT = `[[The|El]] [[park|parque]] [[that|que]] [[we|nosotros]] [[visited|visitamos]] [[last|el pasado]] [[summer|verano]] [[is|es]] [[home|hogar]] [[to|a]] [[many|muchos]] [[animals|animales]] [[that|que]] [[live|viven]] [[in the wild|en libertad]]. [[The|Los]] [[bears|osos]] [[that|que]] [[we|nosotros]] [[saw|vimos]] [[were|eran]] [[in|en]] [[the|el]] [[valley|valle]] [[which|que]] [[runs|recorre]] [[through|a través de]] [[the|el]] [[forest|bosque]]. [[The|Los]] [[eagles|águilas]] [[that|que]] [[fly|vuelan]] [[over|sobre]] [[the|las]] [[mountains|montañas]] [[are|son]] [[magnificent|magníficas]]. [[The|Los]] [[plants|plantas]] [[which|que]] [[grow|crecen]] [[in|en]] [[this|esta]] [[landscape|paisaje]] [[include|incluyen]] [[rare|raras]] [[wildflowers|flores silvestres]]. [[Anyone|Cualquiera]] [[who|que]] [[loves|ama]] [[wildlife|vida silvestre]] [[should|debería]] [[visit|visitar]] [[this|este]] [[place|lugar]].`;

const INSTRUCTIONS = 'Lee el texto completo con atención. Puedes consultarlo mientras respondes las preguntas.';

const QUESTIONS = [
  { question: '[[What|Qué]] [[does the text describe|describe el texto]]?', options: ['[[a city|una ciudad]]', '[[a park with wildlife|un parque con vida silvestre]]', '[[a museum|un museo]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[The park that we visited|el parque que visitamos]]" [[and|y]] "[[animals that live in the wild|animales que viven en libertad]]".' },
  { question: '[[When|Cuándo]] [[did they visit|visitaron]] [[the park|el parque]]?', options: ['[[last winter|el pasado invierno]]', '[[last summer|el pasado verano]]', '[[this year|este año]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[last summer|el pasado verano]]".' },
  { question: '[[Where|Dónde]] [[did they see the bears|vieron los osos]]?', options: ['[[on the mountain|en la montaña]]', '[[in the valley|en el valle]]', '[[by the lake|junto al lago]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[in the valley which runs through the forest|en el valle que recorre el bosque]]".' },
  { question: '[[What|Qué]] [[birds|aves]] [[are mentioned|se mencionan]]?', options: ['[[sparrows|gorriones]]', '[[eagles|águilas]]', '[[pigeons|palomas]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[The eagles that fly over the mountains|las águilas que vuelan sobre las montañas]]".' },
  { question: '[[What|Qué]] [[plants|plantas]] [[grow|crecen]] [[there|allí]]?', options: ['[[trees only|solo árboles]]', '[[rare wildflowers|flores silvestres raras]]', '[[grass only|solo hierba]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[rare wildflowers|flores silvestres raras]]".' },
  { question: '[[Who|Quién]] [[should visit|debería visitar]] [[this place|este lugar]]?', options: ['[[people who love wildlife|personas que aman la vida silvestre]]', '[[people who love cities|personas que aman las ciudades]]', '[[scientists only|solo científicos]]'], correctAnswer: 0, explanation: '[[The text says|El texto dice]] "[[Anyone who loves wildlife should visit|cualquiera que ame la vida silvestre debería visitar]]".' },
  { question: '[[The park|El parque]] [[has|tiene]] [[wildlife|vida silvestre]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 'True', explanation: '[[True|Verdadero]]. [[The text says|El texto dice]] "[[animals that live in the wild|animales que viven en libertad]]".' },
  { question: '[[They|Ellos]] [[saw|vieron]] [[the bears|los osos]] [[on the mountain|en la montaña]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 'False', explanation: '[[False|Falso]]. [[They saw them in the valley|Los vieron en el valle]].' },
  { question: '[[The valley|El valle]] [[runs|recorre]] [[through|a través de]] [[the forest|el bosque]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 'True', explanation: '[[True|Verdadero]]. [[The text says|El texto dice]] "[[the valley which runs through the forest|el valle que recorre el bosque]]".' },
  { question: '[[What|Cuál]] [[is|es]] [[the main topic|el tema principal]] [[of|del]] [[this text|este texto]]?', options: ['[[Shopping|Compras]]', '[[A natural park with wildlife|Un parque natural con vida silvestre]]', '[[Technology|Tecnología]]'], correctAnswer: 1, explanation: '[[The text|El texto]] [[describes|describe]] [[a park with animals and plants|un parque con animales y plantas]].' },
  { question: '[[The eagles|Las águilas]] [[fly|vuelan]] [[over|sobre]] [[the mountains|las montañas]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 'True', explanation: '[[True|Verdadero]]. [[The text says|El texto dice]] "[[The eagles that fly over the mountains|las águilas que vuelan sobre las montañas]]".' },
  { question: '[[The plants|Las plantas]] [[include|incluyen]] [[rare wildflowers|flores silvestres raras]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 'True', explanation: '[[True|Verdadero]]. [[The text says|El texto dice]] "[[include rare wildflowers|incluyen flores silvestres raras]]".' },
  { question: '[[Which relative pronoun|Qué pronombre relativo]] [[is used for animals|se usa para animales]]?', options: ['[[who|quien]]', '[[which/that|que]]', '[[whose|cuyo]]'], correctAnswer: 1, explanation: '[[The text uses|El texto usa]] "[[that|que]]" [[for animals|para animales]] [[e.g. bears that we saw|ej. osos que vimos]].' },
  { question: '[[The landscape|El paisaje]] [[has|tiene]] [[mountains|montañas]] [[and|y]] [[a valley|un valle]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 'True', explanation: '[[True|Verdadero]]. [[The text mentions|El texto menciona]] [[mountains|montañas]] [[and|y]] [[valley|valle]].' },
  { question: '[[The text|El texto]] [[recommends|recomienda]] [[visiting|visitar]] [[this place|este lugar]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 'True', explanation: '[[True|Verdadero]]. [[The text says|El texto dice]] "[[Anyone who loves wildlife should visit|cualquiera que ame la vida silvestre debería visitar]]".' },
];

export const UNIT_31_LESSON_3_READING: Exercise[] = QUESTIONS.map((q, i) => ({
  id: `b1-u31-l3-r${i + 1}`,
  type: 'reading',
  level: 'B1',
  topic: 'The Natural World',
  difficulty: 'easy',
  transcript: READING_TRANSCRIPT,
  // ReadingRenderer reads the passage and questions from the exercise object itself.
  text: READING_TRANSCRIPT,
  title: LESSON_TITLE,
  questions: [{
    ...q,
    id: `b1-u31-l3-r${i + 1}-q1`,
    answerIndex: typeof q.correctAnswer === 'string' ? q.options.indexOf(q.correctAnswer) : q.correctAnswer,
  }],
  content: {
    title: LESSON_TITLE,
    instructions: INSTRUCTIONS,
    text: READING_TRANSCRIPT,
    transcript: READING_TRANSCRIPT,
    questions: [{
      ...q,
      id: `b1-u31-l3-r${i + 1}-q1`,
      answerIndex: typeof q.correctAnswer === 'string' ? q.options.indexOf(q.correctAnswer) : q.correctAnswer,
    }]
  },
  topicName: 'Reading',
}));
