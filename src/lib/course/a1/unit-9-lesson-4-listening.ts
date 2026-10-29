/**
 * Unidad 9 — Lección 4: Comprensión auditiva
 * 15 ejercicios (1 pregunta cada uno): 8 MC, 4 V/F, 3 síntesis. Diálogo sobre profesiones y trabajo.
 */

import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = 'Comprensión auditiva';
const TOPIC = 'Jobs & Occupations';

const LISTENING_TRANSCRIPT = `[[Interviewer: What do you do?|Entrevistador: ¿A qué te dedicas?]] [[Tom: I am a teacher.|Tom: Soy profesor.]] [[I work in a primary school.|Trabajo en una escuela primaria.]] [[Interviewer: Where is the school?|Entrevistador: ¿Dónde está la escuela?]] [[Tom: It is in the centre of town.|Tom: Está en el centro de la ciudad.]] [[Interviewer: Do you like your job?|Entrevistador: ¿Te gusta tu trabajo?]] [[Tom: Yes, I love it.|Tom: Sí, me encanta.]] [[My sister is a nurse.|Mi hermana es enfermera.]] [[She works in a hospital.|Trabaja en un hospital.]] [[We both like our jobs.|A los dos nos gustan nuestros trabajos.]]`;

const INSTRUCTIONS = 'Escucha el audio. Después contesta cada pregunta.';

export const UNIT_9_LESSON_4_LISTENING: Exercise[] = [
  {
    id: 'a1-u9-l4-listening-1',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[is|es]] [[Tom\'s|de Tom]] [[job|trabajo]]?',
        options: ['[[Doctor|Médico]]', '[[Teacher|Profesor]]', '[[Engineer|Ingeniero]]'],
        correctAnswer: 1,
        explanation: 'I am a teacher.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-2',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Where|Dónde]] [[does|trabaja]] [[Tom|Tom]] [[work|trabajar]]?',
        options: ['[[In a hospital|En un hospital]]', '[[In a primary school|En una escuela primaria]]', '[[In an office|En una oficina]]'],
        correctAnswer: 1,
        explanation: 'I work in a primary school.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-3',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Where|Dónde]] [[is|está]] [[the|la]] [[school|escuela]]?',
        options: ['[[In the centre of town|En el centro de la ciudad]]', '[[In a village|En un pueblo]]', '[[Near the hospital|Cerca del hospital]]'],
        correctAnswer: 0,
        explanation: 'It is in the centre of town.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-4',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Does|Le]] [[Tom|a Tom]] [[like|gusta]] [[his|su]] [[job|trabajo]]?',
        options: ['[[Yes|Sí]]', '[[No|No]]', '[[He doesn\'t say|No lo dice]]'],
        correctAnswer: 0,
        explanation: 'Yes, I love (it).',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-5',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[is|es]] [[Tom\'s|de Tom]] [[sister\'s|hermana]] [[job|trabajo]]?',
        options: ['[[Teacher|Profesora]]', '[[Nurse|Enfermera]]', '[[Doctor|Médica]]'],
        correctAnswer: 1,
        explanation: 'My sister is a nurse.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-6',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Where|Dónde]] [[does|trabaja]] [[Tom\'s|la]] [[sister|hermana]] [[work|trabajar]]?',
        options: ['[[In a school|En una escuela]]', '[[In a hospital|En un hospital]]', '[[In an office|En una oficina]]'],
        correctAnswer: 1,
        explanation: 'She works in a hospital.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-7',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Tom|Tom]] [[is|es]] [[a|un]] [[secondary|secundaria]] [[school|colegio]] [[teacher|profesor]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'He works in a primary school.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-8',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Tom|Tom]] [[and|y]] [[his|su]] [[sister|hermana]] [[like|les gustan]] [[their|sus]] [[jobs|trabajos]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'We both like our jobs.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-9',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[The|El]] [[interviewer|entrevistador]] [[asks|pregunta]] "[[What do you do?|¿A qué te dedicas?]]".',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'What do you do?',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-10',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Tom\'s|La]] [[sister|hermana]] [[works|trabaja]] [[in|en]] [[a|una]] [[school|escuela]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'She works in a hospital.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-11',
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
        options: ['[[Food|Comida]].', '[[A|Una]] [[person|persona]] [[talks|habla]] [[about|de]] [[his|su]] [[job|trabajo]] [[and|y]] [[his|su]] [[sister\'s|hermana]] [[job|trabajo]].', '[[Sports|Deportes]].'],
        correctAnswer: 1,
        explanation: 'Tom habla de su trabajo y del de su hermana.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-12',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Cuál]] [[is|es]] [[Tom\'s|el]] [[job|trabajo]] [[of|de]] [[Tom|Tom]] [[in|en]] [[the|el]] [[audio|audio]]?',
        options: ['[[Teacher.|Profesor.]]', '[[Nurse.|Enfermero.]]', '[[Doctor.|Médico.]]'],
        correctAnswer: 0,
        explanation: 'Tom es profesor; su hermana es enfermera.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-13',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Which|Qué]] [[questions|preguntas]] [[does|hace]] [[the|el]] [[interviewer|entrevistador]] [[ask|preguntar]]?',
        options: ['[[Only|Solo]] [[Where do you work?|¿Dónde trabajas?]]', '[[What do you do?|¿A qué te dedicas?]], [[Where is the school?|¿Dónde está la escuela?]], [[Do you like your job?|¿Te gusta tu trabajo?]]', '[[How old are you?|¿Cuántos años tienes?]]'],
        correctAnswer: 1,
        explanation: 'What do you do? Where is the school? Do you like your job?',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-14',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[type|tipo]] [[of|de]] [[school|escuela]] [[does|es]] [[Tom|Tom]] [[work|trabajar]] [[in|en]]?',
        options: ['[[Secondary|Secundaria]]', '[[Primary|Primaria]]', '[[University|Universidad]]'],
        correctAnswer: 1,
        explanation: 'I work in a primary school.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u9-l4-listening-15',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Does|Le]] [[Tom|a Tom]] [[mention|menciona]] [[his|su]] [[sister|hermana]]?',
        options: ['[[No|No]]', '[[Yes|Sí]], [[she|ella]] [[is|es]] [[a|una]] [[nurse|enfermera]].', '[[Yes|Sí]], [[she|ella]] [[is|es]] [[a|una]] [[teacher|profesora]].'],
        correctAnswer: 1,
        explanation: 'My sister is a nurse.',
      }],
    },
    topicName: 'Listening',
  },
];
