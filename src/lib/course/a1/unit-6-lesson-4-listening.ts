/**
 * Unidad 6 — Lección 4: Comprensión auditiva
 * 15 ejercicios (1 pregunta cada uno): 8 MC, 4 V/F, 3 síntesis. Diálogo Ana y Pedro sobre sus familias.
 */

import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = 'Comprensión auditiva';
const TOPIC = 'Family & Possessives';

const LISTENING_TRANSCRIPT = `[[Ana: Hi, Pedro! How are you?|Ana: ¡Hola, Pedro! ¿Cómo estás?]] [[Pedro: I am fine, thanks. And you?|Pedro: Estoy bien, gracias. ¿Y tú?]] [[Ana: I am good. I have two sisters and one brother.|Ana: Estoy bien. Tengo dos hermanas y un hermano.]] [[Pedro: Nice! My family is big too. My mother is a teacher. My father works in an office.|Pedro: ¡Qué bien! Mi familia también es grande. Mi madre es profesora. Mi padre trabaja en una oficina.]] [[Ana: Where does your grandmother live?|Ana: ¿Dónde vive tu abuela?]] [[Pedro: She lives in Seville. Our grandfather lives there too.|Pedro: Vive en Sevilla. Nuestro abuelo también vive allí.]] [[Ana: I love my family.|Ana: Quiero mucho a mi familia.]] [[Pedro: Me too. We both love our families.|Pedro: Yo también. Los dos queremos mucho a nuestras familias.]]`;

const INSTRUCTIONS = 'Escucha el audio. Después contesta cada pregunta.';

export const UNIT_6_LESSON_4_LISTENING: Exercise[] = [
  {
    id: 'a1-u6-l4-listening-1',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u6-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[How|Cuántas]] [[sisters|hermanas]] [[does|tiene]] [[Ana|Ana]] [[have|tener]]?',
        options: ['[[one|una]]', '[[two|dos]]', '[[three|tres]]', '[[four|cuatro]]'],
        correctAnswer: 1,
        explanation: 'Ana dice: I have two sisters.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-2',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[is|es]] [[Pedro\'s|de Pedro]] [[mother|madre]]?',
        options: ['[[doctor|médica]]', '[[teacher|profesora]]', '[[nurse|enfermera]]', '[[driver|conductor]]'],
        correctAnswer: 1,
        explanation: 'My mother is a teacher.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-3',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Where|Dónde]] [[does|trabaja]] [[Pedro\'s|de Pedro]] [[father|padre]] [[work|trabajar]]?',
        options: ['[[at|en]] [[school|el colegio]]', '[[in|en]] [[an|una]] [[office|oficina]]', '[[at|en]] [[home|casa]]', '[[in|en]] [[a|un]] [[hospital|hospital]]'],
        correctAnswer: 1,
        explanation: 'My father works in an office.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-4',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Where|Dónde]] [[does|vive]] [[Pedro\'s|de Pedro]] [[grandmother|abuela]] [[live|vivir]]?',
        options: ['[[Madrid|Madrid]]', '[[Barcelona|Barcelona]]', '[[Valencia|Valencia]]', '[[Seville|Sevilla]]'],
        correctAnswer: 3,
        explanation: 'She lives in Seville.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-5',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Where|Dónde]] [[does|vive]] [[his|su]] [[grandfather|abuelo]] [[live|vivir]]?',
        options: ['[[Madrid|Madrid]]', '[[Seville|Sevilla]]', '[[Barcelona|Barcelona]]', '[[Valencia|Valencia]]'],
        correctAnswer: 1,
        explanation: 'Our grandfather lives there too (in Seville).',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-6',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Does|Tiene]] [[Ana|Ana]] [[have|tener]] [[a|un]] [[brother|hermano]]?',
        options: ['[[Yes|Sí]], [[she|ella]] [[does|tiene]].', '[[No|No]], [[she|ella]] [[doesn\'t|no]].', '[[One|Uno]] [[brother|hermano]].', '[[Two|Dos]] [[brothers|hermanos]].'],
        correctAnswer: 0,
        explanation: 'I have two sisters and one brother.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-7',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[do|dicen]] [[they|ellos]] [[say|decir]] [[about|sobre]] [[family|familia]]?',
        options: ['[[They|Ellos]] [[love|aman]] [[their|su]] [[family|familia]].', '[[They|Ellos]] [[don\'t|no]] [[like|gusta]].', '[[Small|Pequeña]] [[family|familia]].', '[[No|No]] [[family|familia]].'],
        correctAnswer: 0,
        explanation: 'I love my family. Me too. We love our family.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-8',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Is|Es]] [[Pedro\'s|de Pedro]] [[family|familia]] [[big|grande]]?',
        options: ['[[No|No]], [[small|pequeña]].', '[[Yes|Sí]], [[big|grande]].', '[[No|No]] [[family|familia]].', '[[Very|Muy]] [[small|pequeña]].'],
        correctAnswer: 1,
        explanation: 'My family is big too.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-9',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Ana|Ana]] [[has|tiene]] [[three|tres]] [[brothers|hermanos]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'Falso. She has two sisters and one brother.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-10',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Pedro\'s|De Pedro]] [[mother|madre]] [[is|es]] [[a|una]] [[teacher|profesora]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'Verdadero. My mother is a teacher.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-11',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[His|Su]] [[grandmother|abuela]] [[lives|vive]] [[in|en]] [[Madrid|Madrid]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'Falso. She lives in Seville.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-12',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Both|Ambos]] [[love|aman]] [[their|su]] [[family|familia]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'Verdadero. Ana y Pedro dicen que aman a su familia.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-13',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Main|Principal]] [[topic|tema]] [[of|del]] [[dialogue|diálogo]]?',
        options: ['[[School|Escuela]] [[and|y]] [[work|trabajo]].', '[[Ana|Ana]] [[and|y]] [[Pedro|Pedro]] [[talk|hablan]] [[about|sobre]] [[family|familia]].', '[[Sports|Deportes]].', '[[Food|Comida]].'],
        correctAnswer: 1,
        explanation: 'Hablan de sus familias.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-14',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Where|Dónde]] [[do|viven]] [[Pedro\'s|de Pedro]] [[grandparents|abuelos]] [[live|vivir]]?',
        options: ['[[In|En]] [[different|diferentes]] [[cities|ciudades]].', '[[Both|Ambos]] [[in|en]] [[Seville|Sevilla]].', '[[In|En]] [[Madrid|Madrid]].', '[[We|No]] [[don\'t|no]] [[know|sabemos]].'],
        correctAnswer: 1,
        explanation: 'La abuela y el abuelo viven en Sevilla.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u6-l4-listening-15',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|De]] [[do|qué]] [[Ana|Ana]] [[and|y]] [[Pedro|Pedro]] [[talk|hablan]] [[about|hablan]]?',
        options: ['[[Their families.|Sus familias.]]', '[[Work.|El trabajo.]]', '[[Shopping.|Las compras.]]'],
        correctAnswer: 0,
        explanation: 'Ana y Pedro hablan de sus familias.',
      }],
    },
    topicName: 'Listening',
  },
];
