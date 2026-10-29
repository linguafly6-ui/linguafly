/**
 * Unidad 8 — Lección 4: Comprensión auditiva
 * 15 ejercicios (1 pregunta cada uno): 8 MC, 4 V/F, 3 síntesis. Diálogo sobre precios y edades.
 */

import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = 'Comprensión auditiva';
const TOPIC = 'Numbers 20–100 (Prices & Ages)';

const LISTENING_TRANSCRIPT = `[[Maria: How much is this book?|Maria: ¿Cuánto cuesta este libro?]] [[Shop: It is twenty-five euros.|Dependiente: Cuesta veinticinco euros.]] [[Maria: And how much are the notebooks?|Maria: ¿Y cuánto cuestan los cuadernos?]] [[Shop: They are three euros each.|Dependiente: Cuestan tres euros cada uno.]] [[Maria: How old is your daughter?|Maria: ¿Cuántos años tiene tu hija?]] [[Shop: She is twelve years old.|Dependiente: Tiene doce años.]] [[Maria: My son is fifteen.|Maria: Mi hijo tiene quince años.]] [[I need two books and one notebook.|Necesito dos libros y un cuaderno.]] [[Shop: That is fifty-three euros in total.|Dependiente: Son cincuenta y tres euros en total.]]`;

const INSTRUCTIONS = 'Escucha el audio. Después contesta cada pregunta.';

export const UNIT_8_LESSON_4_LISTENING: Exercise[] = [
  {
    id: 'a1-u8-l4-listening-1',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[How|Cuánto]] [[much|cuesta]] [[is|es]] [[the|el]] [[book|libro]]?',
        options: ['[[twenty|veinte]] [[euros|euros]]', '[[twenty-five|veinticinco]] [[euros|euros]]', '[[thirty|treinta]] [[euros|euros]]'],
        correctAnswer: 1,
        explanation: 'It is twenty-five euros.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-2',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[How|Cuánto]] [[much|cuestan]] [[are|son]] [[the|los]] [[notebooks|cuadernos]]?',
        options: ['[[one euro|un euro]] [[each|cada uno]]', '[[three euros|tres euros]] [[each|cada uno]]', '[[five euros|cinco euros]] [[each|cada uno]]'],
        correctAnswer: 1,
        explanation: 'They are three euros each.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-3',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[How old is the shop assistant\'s daughter?|¿Cuántos años tiene la hija del dependiente?]]',
        options: ['[[ten|diez]]', '[[twelve|doce]]', '[[fifteen|quince]]'],
        correctAnswer: 1,
        explanation: 'She is twelve years old.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-4',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[How old is Maria\'s son?|¿Cuántos años tiene el hijo de María?]]',
        options: ['[[twelve|doce]]', '[[fifteen|quince]]', '[[twenty-five|veinticinco]]'],
        correctAnswer: 1,
        explanation: 'My son is fifteen.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-5',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[does|necesita]] [[Maria|María]] [[need|necesitar]]?',
        options: ['[[One|Un]] [[book|libro]] [[and|y]] [[one|un]] [[notebook|cuaderno]].', '[[Two|Dos]] [[books|libros]] [[and|y]] [[one|un]] [[notebook|cuaderno]].', '[[Two|Dos]] [[notebooks|cuadernos]] [[and|y]] [[one|un]] [[book|libro]].'],
        correctAnswer: 1,
        explanation: 'I need two books and one notebook.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-6',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Cuál]] [[is|es]] [[the|el]] [[total|total]] [[for|por]] [[two|dos]] [[books|libros]] [[and|y]] [[one|un]] [[notebook|cuaderno]]?',
        options: ['[[fifty-three euros|cincuenta y tres euros]]', '[[thirty-three euros|treinta y tres euros]]', '[[twenty-eight euros|veintiocho euros]]'],
        correctAnswer: 0,
        explanation: 'That is fifty-three euros in total.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-7',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Maria|María]] [[asks|pregunta]] [[about|por]] [[the|el]] [[price|precio]] [[of|del]] [[the|el]] [[book|libro]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'Verdadero. How much is this book?',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-8',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[The|La]] [[daughter|hija]] [[is|tiene]] [[fifteen|quince]] [[years|años]] [[old|de edad]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'Falso. She is twelve years old.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-9',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[The|Los]] [[notebooks|cuadernos]] [[cost|cuestan]] [[five|cinco]] [[euros|euros]] [[each|cada uno]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'False',
        explanation: 'Falso. They are three euros each.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-10',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[The|El]] [[dialogue|diálogo]] [[is|es]] [[about|sobre]] [[prices|precios]] [[and|y]] [[ages|edades]].',
        options: ['[[True|Verdadero]]', '[[False|Falso]]'],
        correctAnswer: 'True',
        explanation: 'Verdadero. Precios (libro, cuadernos, total) y edades (hija, hijo).',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-11',
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
        options: ['[[Sports|Deportes]].', '[[A|Una]] [[customer|cliente]] [[asks|pregunta]] [[prices|precios]] [[and|y]] [[talks|habla]] [[about|de]] [[ages|edades]] [[with|con]] [[shop|tienda]].', '[[Food|Comida]].'],
        correctAnswer: 1,
        explanation: 'Cliente pregunta precios y habla de edades.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-12',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[What|Qué]] [[does|compra]] [[the|la]] [[woman|mujer]] [[buy|compra]] [[in|en]] [[the|el]] [[audio|audio]]?',
        options: ['[[Books and a notebook.|Libros y un cuaderno.]]', '[[Only a notebook.|Solo un cuaderno.]]', '[[Only books.|Solo libros.]]'],
        correctAnswer: 0,
        explanation: 'Compra libros y un cuaderno.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-13',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[Which|Qué]] [[questions|preguntas]] [[are|se]] [[asked|hacen]] [[in|en]] [[the|el]] [[dialogue|diálogo]]?',
        options: ['[[Only|Solo]] [[How much|Cuánto]].', '[[How much|Cuánto]] [[is the book|cuesta el libro]], [[how much are the notebooks|cuánto cuestan los cuadernos]], [[how old is your daughter|cuántos años tiene tu hija]].', '[[Where|Dónde]] [[is the shop|está la tienda]].'],
        correctAnswer: 1,
        explanation: 'Se preguntan precios y edad.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-14',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[How|Cuántos]] [[many|libros]] [[books|libros]] [[does|compra]] [[Maria|María]] [[buy|comprar]]?',
        options: ['[[one|uno]]', '[[two|dos]]', '[[three|tres]]'],
        correctAnswer: 1,
        explanation: 'I need two books and one notebook.',
      }],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u8-l4-listening-15',
    type: 'listening',
    level: 'A1',
    topic: TOPIC,
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    content: {
      title: LESSON_TITLE,
      instructions: INSTRUCTIONS,
      questions: [{
        question: '[[In|En]] [[what|qué]] [[currency|moneda]] [[are|están]] [[the|los]] [[prices|precios]]?',
        options: ['[[Dollars|Dólares]].', '[[Euros|Euros]].', '[[Pounds|Libras]].'],
        correctAnswer: 1,
        explanation: 'Todos los precios en euros.',
      }],
    },
    topicName: 'Listening',
  },
];
