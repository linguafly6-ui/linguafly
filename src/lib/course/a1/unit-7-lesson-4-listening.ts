/**
 * Unidad 7 — Lección 4: Comprensión auditiva
 * 15 ejercicios (1 pregunta cada uno): 8 MC, 4 V/F, 3 síntesis. Diálogo sobre descripción física.
 */

import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = 'Comprensión auditiva';
const TOPIC = 'Colors & Physical Descriptions';

const LISTENING_TRANSCRIPT = `[[Lisa: Who is that woman with the long red hair?|Lisa: ¿Quién es esa mujer de pelo largo y rojo?]] [[Tom: She is my sister Emma.|Tom: Es mi hermana Emma.]] [[Lisa: She is very tall. How old is she?|Lisa: Es muy alta. ¿Cuántos años tiene?]] [[Tom: She is twenty-five years old. She has blue eyes too.|Tom: Tiene veinticinco años. También tiene los ojos azules.]] [[Lisa: My brother is short and he has brown hair.|Lisa: Mi hermano es bajo y tiene el pelo castaño.]] [[Tom: Is he young?|Tom: ¿Es joven?]] [[Lisa: Yes, he is only eighteen.|Lisa: Sí, solo tiene dieciocho años.]]`;

const INSTRUCTIONS = 'Escucha el audio. Después contesta cada pregunta.';

export const UNIT_7_LESSON_4_LISTENING: Exercise[] = [
  {
    id: 'a1-u7-l4-listening-1',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[color|color]] [[is|es]] [[Emma\'s|de Emma]] [[hair|pelo]]?',
        options: ['[[brown|castaño]]', '[[red|rojo]]', '[[black|negro]]', '[[blonde|rubio]]'],
        correctAnswer: 1,
        explanation: 'Lisa pregunta por the woman with the long red hair. Emma is that woman.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-2',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Who|Quién]] [[is|es]] [[Emma|Emma]]?',
        options: ['[[Tom\'s|De Tom]] [[friend|amiga]].', '[[Tom\'s|De Tom]] [[sister|hermana]].', '[[Tom\'s|De Tom]] [[mother|madre]].', '[[Lisa\'s|De Lisa]] [[sister|hermana]].'],
        correctAnswer: 1,
        explanation: 'She is my sister Emma.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-3',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Is|Es]] [[Emma|Emma]] [[tall|alta]] [[or|o]] [[short|baja]]?',
        options: ['[[short|baja]]', '[[tall|alta]]', '[[medium|mediana]]'],
        correctAnswer: 1,
        explanation: 'She is very tall.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-4',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[How old is Emma?|¿Cuántos años tiene Emma?]]',
        options: ['[[twenty|veinte]]', '[[twenty-five|veinticinco]]', '[[thirty|treinta]]', '[[eighteen|dieciocho]]'],
        correctAnswer: 1,
        explanation: 'She is twenty-five years old.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-5',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[color|color]] [[are|son]] [[Emma\'s|de Emma]] [[eyes|ojos]]?',
        options: ['[[green|verdes]]', '[[brown|marrones]]', '[[blue|azules]]', '[[black|negros]]'],
        correctAnswer: 2,
        explanation: 'She has blue eyes too.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-6',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Lisa\'s|El]] [[brother|hermano]] [[is|es]] ____.',
        options: ['[[tall|alto]]', '[[short|bajo]]', '[[old|mayor]]'],
        correctAnswer: 1,
        explanation: 'My brother is short.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-7',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[color|color]] [[is|es]] [[Lisa\'s|de Lisa]] [[brother\'s|de su hermano]] [[hair|pelo]]?',
        options: ['[[black|negro]]', '[[red|rojo]]', '[[brown|castaño]]', '[[blonde|rubio]]'],
        correctAnswer: 2,
        explanation: 'He has brown hair.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-8',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[How old is Lisa\'s brother?|¿Cuántos años tiene el hermano de Lisa?]]',
        options: ['[[twenty-five|veinticinco]]', '[[twenty|veinte]]', '[[eighteen|dieciocho]]', '[[thirty|treinta]]'],
        correctAnswer: 2,
        explanation: 'He is only eighteen.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-9',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Emma|Emma]] [[has|tiene]] [[black|negro]] [[hair|pelo]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'Falso. Emma has long red hair.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-10',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Tom|Tom]] [[and|y]] [[Lisa|Lisa]] [[talk|hablan]] [[about|de]] [[physical|físicas]] [[descriptions|descripciones]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'Verdadero. Hablan de pelo, altura, ojos, edad.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-11',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Lisa\'s|El]] [[brother|hermano]] [[is|es]] [[tall|alto]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'Falso. My brother is short.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-12',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Emma|Emma]] [[is|es]] [[Tom\'s|de Tom]] [[sister|hermana]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'Verdadero. She is my sister Emma.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-13',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Main|Tema]] [[topic|principal]] [[of|del]] [[dialogue|diálogo]]?',
        options: ['[[School|Escuela]] [[and|y]] [[work|trabajo]].', '[[Two|Dos]] [[people|personas]] [[describe|describen]] [[family|familia]] [[members|miembros]] [[physically|físicamente]].', '[[Sports|Deportes]].'],
        correctAnswer: 1,
        explanation: 'Lisa y Tom describen a Emma y al hermano de Lisa (altura, pelo, ojos, edad).',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-14',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[do|describen]] [[they|ellos]] [[describe|describen]] [[about|sobre]] [[the|las]] [[people|personas]]?',
        options: ['[[Hair, eyes, height (and age).|Pelo, ojos, altura (y edad).]]', '[[Work.|Trabajo.]]', '[[School.|El colegio.]]'],
        correctAnswer: 0,
        explanation: 'Describen pelo, ojos, altura y edad.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u7-l4-listening-15',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Which|Qué]] [[details|detalles]] [[are|se]] [[mentioned|mencionan]] [[for|para]] [[describing|describir]] [[people|personas]]?',
        options: ['[[Only|Solo]] [[names|nombres]].', '[[Height|Altura]], [[hair|pelo]] [[color|color]], [[eyes|ojos]], [[age|edad]].', '[[Job|Trabajo]] [[and|y]] [[city|ciudad]].'],
        correctAnswer: 1,
        explanation: 'Se mencionan tall/short, hair (red, brown), eyes (blue), age (25, 18).',
      }],
    },
    topicName: 'Listening',
  },
];
