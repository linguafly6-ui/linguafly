/**
 * Unidad 10 — Lección 4: Comprensión auditiva
 * 15 ejercicios: diálogo sobre rutinas diarias y horarios.
 */

import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = 'Comprensión auditiva';
const TOPIC = 'Daily Routines & Time';

const LISTENING_TRANSCRIPT = `[[Interviewer: What time do you get up?|Entrevistador: ¿A qué hora te levantas?]] [[Anna: I get up at six o'clock.|Anna: Me levanto a las seis en punto.]] [[Interviewer: What time do you have breakfast?|Entrevistador: ¿A qué hora desayunas?]] [[Anna: At half past six.|Anna: A las seis y media.]] [[I go to work at eight o'clock.|Voy al trabajo a las ocho en punto.]] [[Interviewer: When do you have lunch?|Entrevistador: ¿Cuándo almuerzas?]] [[Anna: At one o'clock.|Anna: A la una en punto.]] [[I finish work at half past five.|Termino de trabajar a las cinco y media.]] [[I have dinner at eight o'clock and I go to bed at ten o'clock.|Ceno a las ocho en punto y me acuesto a las diez en punto.]]`;

const INSTRUCTIONS = 'Escucha el audio. Después contesta cada pregunta.';

export const UNIT_10_LESSON_4_LISTENING: Exercise[] = [
  {
    id: 'a1-u10-l4-listening-1',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|A]] [[time|qué]] [[does|se]] [[Anna|Anna]] [[get|levanta]] [[up|levantar]]?',
        options: ['[[At six o\'clock|A las seis en punto]]', '[[At half past six|A las seis y media]]', '[[At eight o\'clock|A las ocho en punto]]'],
        correctAnswer: 0,
        explanation: 'I get up at six o\'clock.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-2',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|A]] [[time|qué]] [[does|toma]] [[she|ella]] [[have|desayuno]] [[breakfast|desayuno]]?',
        options: ['[[At six o\'clock|A las seis]]', '[[At half past six|A las seis y media]]', '[[At eight o\'clock|A las ocho]]'],
        correctAnswer: 1,
        explanation: 'At half past six.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-3',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|A]] [[time|qué]] [[does|va]] [[Anna|Anna]] [[go|ir]] [[to|a]] [[work|trabajo]]?',
        options: ['[[At six o\'clock|A las seis]]', '[[At half past six|A las seis y media]]', '[[At eight o\'clock|A las ocho]]'],
        correctAnswer: 2,
        explanation: 'I go to work at eight o\'clock.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-4',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|A]] [[time|qué]] [[does|almuerza]] [[she|ella]] [[have|almorzar]] [[lunch|comida]]?',
        options: ['[[At twelve o\'clock|A las doce]]', '[[At one o\'clock|A la una]]', '[[At half past five|A las cinco y media]]'],
        correctAnswer: 1,
        explanation: 'At one o\'clock.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-5',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|A]] [[time|qué]] [[does|termina]] [[Anna|Anna]] [[finish|trabajo]] [[work|trabajar]]?',
        options: ['[[At five o\'clock|A las cinco en punto]]', '[[At half past five|A las cinco y media]]', '[[At eight o\'clock|A las ocho]]'],
        correctAnswer: 1,
        explanation: 'I finish work at half past five.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-6',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Anna|Anna]] [[gets|se]] [[up|levanta]] [[at|a]] [[seven|siete]] [[o\'clock|en punto]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'She gets up at six o\'clock.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-7',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[She|Ella]] [[goes|va]] [[to|a]] [[bed|cama]] [[at|a]] [[ten|diez]] [[o\'clock|en punto]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'I go to bed at ten o\'clock.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-8',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Anna|Anna]] [[has|cena]] [[dinner|cena]] [[at|a]] [[seven|siete]] [[o\'clock|en punto]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'I have dinner at eight o\'clock.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-9',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[The|El]] [[interviewer|entrevistador]] [[asks|pregunta]] [[about|sobre]] [[her|su]] [[routine|rutina]] [[and|y]] [[times|horarios]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'Pregunta qué hora se levanta, desayuna, etc.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-10',
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
        options: ['[[Anna\'s|La]] [[job|trabajo]] [[only|solo]].', '[[Anna\'s|La]] [[daily|rutina]] [[routine|diaria]] [[and|y]] [[times|horarios]].', '[[Food|Comida]] [[only|solo]].'],
        correctAnswer: 1,
        explanation: 'Hablan de la rutina diaria y los horarios de Anna.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-11',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Which|Qué]] [[question|pregunta]] [[does|hace]] [[the|el]] [[interviewer|entrevistador]] [[NOT|NO]] [[ask|preguntar]]?',
        options: ['[[What time do you get up?|¿A qué hora te levantas?]]', '[[What time do you have breakfast?|¿A qué hora desayunas?]]', '[[How old are you?|¿Cuántos años tienes?]]'],
        correctAnswer: 2,
        explanation: 'No preguntan la edad.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-12',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Sobre]] [[does|qué]] [[Anna|Anna]] [[talk|habla]] [[about|habla]] [[in|en]] [[the|el]] [[audio|audio]]?',
        options: ['[[Her daily routine and times.|Su rutina diaria y horarios.]]', '[[Only work.|Solo trabajo.]]', '[[Only food.|Solo comida.]]'],
        correctAnswer: 0,
        explanation: 'Anna describe su día y los horarios.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-13',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|A]] [[time|qué]] [[does|cena]] [[Anna|Anna]] [[have|cenar]] [[dinner|cena]]?',
        options: ['[[At seven o\'clock|A las siete]]', '[[At eight o\'clock|A las ocho]]', '[[At ten o\'clock|A las diez]]'],
        correctAnswer: 1,
        explanation: 'I have dinner at eight o\'clock.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-14',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Does|Va]] [[Anna|Anna]] [[go|ir]] [[to|a]] [[work|trabajo]] [[before|antes]] [[or|o]] [[after|después]] [[breakfast|desayuno]]?',
        options: ['[[Before|Antes]]', '[[After|Después]]', '[[At the same time|A la vez]]'],
        correctAnswer: 1,
        explanation: 'Desayuna a las 6:30, va a trabajar a las 8.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u10-l4-listening-15',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[How|Cuántas]] [[many|horas]] [[hours|horas]] [[between|entre]] [[dinner|cena]] [[and|y]] [[going|ir]] [[to|a]] [[bed|cama]] [[for|para]] [[Anna|Anna]]?',
        options: ['[[One|Una]] [[hour|hora]]', '[[Two|Dos]] [[hours|horas]]', '[[Three|Tres]] [[hours|horas]]'],
        correctAnswer: 1,
        explanation: 'Cena a las 8, se acuesta a las 10 = 2 horas.',
      }],
    },
    topicName: 'Listening',
  },
];
