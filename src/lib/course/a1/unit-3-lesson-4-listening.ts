/**
 * Unidad 3 — Lección 4: Comprensión auditiva
 * 15 ejercicios individuales (8 elección múltiple, 4 verdadero/falso, 3 síntesis)
 * audioUrl se puede añadir cuando exista el archivo de audio
 */

import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = 'Comprensión auditiva';
const LISTENING_TRANSCRIPT = `[[Receptionist: Good morning! How are you today?|Recepcionista: ¡Buenos días! ¿Cómo estás hoy?]] [[Ben: Hi! I am not great, actually. I am very tired.|Ben: ¡Hola! La verdad es que no estoy muy bien. Estoy muy cansado.]] [[Receptionist: Oh, I am sorry. Is your friend Ana here with you today?|Recepcionista: Vaya, lo siento. ¿Está aquí contigo tu amiga Ana hoy?]] [[Ben: Yes, she is over there. She is excited; she is not tired at all.|Ben: Sí, está allí. Está emocionada; no está nada cansada.]] [[Receptionist: Is she hungry? We have snacks here.|Recepcionista: ¿Tiene hambre? Tenemos aperitivos aquí.]] [[Ben: Actually, she isn't hungry, but she is thirsty. Are there any drinks here?|Ben: En realidad, no tiene hambre, pero tiene sed. ¿Hay bebidas aquí?]] [[Receptionist: Of course! And what about you, Ben? Are you hungry?|Recepcionista: ¡Por supuesto! ¿Y tú, Ben? ¿Tienes hambre?]] [[Ben: Yes, I am a little hungry. I am not angry or sad — just tired and hungry.|Ben: Sí, tengo un poco de hambre. No estoy enfadado ni triste: solo estoy cansado y tengo hambre.]]`;

const INST_MC = 'Escucha el audio y elige la respuesta correcta.';
const INST_TF = 'Escucha el audio. Indica si la afirmación es verdadera o falsa.';
const INST_SYN = 'Escucha el audio. Elige la mejor respuesta.';

export const UNIT_3_LESSON_4_LISTENING: Exercise[] = [
  // ─── 1–8: Elección múltiple ────────────────────────────────────────────────
  {
    id: 'a1-u3-l4-listening-1',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[How does Ben feel today?|¿Cómo se siente Ben hoy?]]',
          options: [
            '[[excited|emocionado]]',
            '[[happy|feliz]]',
            '[[angry|enfadado]]',
            '[[tired|cansado]]',
          ],
          correctAnswer: 3,
          explanation: 'Ben dice "I am very tired".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-2',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[Is Ana tired?|¿Está Ana cansada?]]',
          options: [
            '[[Yes, she is.|Sí, lo está.]]',
            '[[She is a little tired.|Está un poco cansada.]]',
            '[[No, she isn\'t.|No, no lo está.]]',
            '[[She is very tired.|Está muy cansada.]]',
          ],
          correctAnswer: 2,
          explanation: 'Ben dice "she is not tired at all".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-3',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[How does Ana feel?|¿Cómo se siente Ana?]]',
          options: [
            '[[tired|cansada]]',
            '[[sad|triste]]',
            '[[scared|asustada]]',
            '[[excited|emocionada]]',
          ],
          correctAnswer: 3,
          explanation: 'Ben dice "she is excited".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-4',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[Is Ana hungry?|¿Tiene hambre Ana?]]',
          options: [
            '[[Yes, she is very hungry.|Sí, tiene mucha hambre.]]',
            '[[She is a little hungry.|Tiene un poco de hambre.]]',
            '[[She is not thirsty.|No tiene sed.]]',
            '[[No, she isn\'t hungry.|No, no tiene hambre.]]',
          ],
          correctAnswer: 3,
          explanation: 'Ben dice "she isn\'t hungry".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-5',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[What does Ana want?|¿Qué quiere Ana?]]',
          options: [
            '[[food|comida]]',
            '[[snacks|merienda]]',
            '[[coffee|café]]',
            '[[a drink|una bebida]]',
          ],
          correctAnswer: 3,
          explanation: 'Ben dice "she is thirsty", así que quiere algo para beber.',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-6',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[Is Ben hungry?|¿Tiene hambre Ben?]]',
          options: [
            '[[No, he isn\'t.|No, no tiene hambre.]]',
            '[[He is very hungry.|Tiene mucha hambre.]]',
            '[[He is thirsty, not hungry.|Tiene sed, no hambre.]]',
            '[[Yes, a little.|Sí, un poco.]]',
          ],
          correctAnswer: 3,
          explanation: 'Ben dice "Yes, I am a little hungry".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-7',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[How does Ben feel? (all emotions)|¿Cómo se siente Ben? (todas las emociones)]]',
          options: [
            '[[angry and sad|enfadado y triste]]',
            '[[excited and thirsty|emocionado y sediento]]',
            '[[tired and hungry|cansado y hambriento]]',
            '[[happy and excited|feliz y emocionado]]',
          ],
          correctAnswer: 2,
          explanation: 'Ben dice "just tired and hungry".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-8',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[Who are Ben and Ana talking to?|¿Con quién hablan Ben y Ana?]]',
          options: [
            '[[A friend|Un amigo]]',
            '[[A teacher|Un profesor]]',
            '[[A doctor|Un médico]]',
            '[[A receptionist|Una recepcionista]]',
          ],
          correctAnswer: 3,
          explanation: 'El diálogo empieza con una recepcionista saludando.',
        },
      ],
    },
    topicName: 'Listening',
  },
  // ─── 9–12: Verdadero/Falso ─────────────────────────────────────────────────
  {
    id: 'a1-u3-l4-listening-9',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_TF,
      questions: [
        {
          question: '[[Ben is angry today.|Ben está enfadado hoy.]]',
          options: ['[[True|Verdadero]]', '[[False|Falso]]'],
          correctAnswer: 'False',
          explanation: 'Falso. Ben dice "I am not angry".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-10',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_TF,
      questions: [
        {
          question: '[[Ana is excited.|Ana está emocionada.]]',
          options: ['[[True|Verdadero]]', '[[False|Falso]]'],
          correctAnswer: 'True',
          explanation: 'Verdadero. Ben dice "she is excited".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-11',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_TF,
      questions: [
        {
          question: '[[Both Ben and Ana are hungry.|Tanto Ben como Ana tienen hambre.]]',
          options: ['[[True|Verdadero]]', '[[False|Falso]]'],
          correctAnswer: 'False',
          explanation: 'Falso. Ana no tiene hambre; solo Ben tiene un poco.',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-12',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_TF,
      questions: [
        {
          question: '[[The receptionist offers drinks.|La recepcionista ofrece bebidas.]]',
          options: ['[[True|Verdadero]]', '[[False|Falso]]'],
          correctAnswer: 'True',
          explanation: 'Verdadero. La recepcionista confirma que tienen bebidas.',
        },
      ],
    },
    topicName: 'Listening',
  },
  // ─── 13–15: Síntesis ────────────────────────────────────────────────────────
  {
    id: 'a1-u3-l4-listening-13',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_SYN,
      questions: [
        {
          question: '[[What is the main topic of this audio?|¿Cuál es el tema principal de este audio?]]',
          options: [
            '[[A job interview|Una entrevista de trabajo]]',
            '[[A restaurant order|Un pedido en un restaurante]]',
            '[[A school lesson|Una clase de escuela]]',
            '[[Two people describing their state and emotions|Dos personas describiendo su estado y emociones]]',
          ],
          correctAnswer: 3,
          explanation: 'El audio muestra a Ben y Ana diciendo cómo se sienten usando to be en afirmativa, negativa e interrogativa.',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-14',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_SYN,
      questions: [
        {
          question: '[[Who is the most positive person in this dialogue?|¿Quién es la persona más positiva en este diálogo?]]',
          options: [
            '[[Ben, because he is not angry|Ben, porque no está enfadado]]',
            '[[The receptionist, because she offers help|La recepcionista, porque ofrece ayuda]]',
            '[[Both are equally positive|Ambos están igual de positivos]]',
            '[[Ana, because she is excited and not tired|Ana, porque está emocionada y no cansada]]',
          ],
          correctAnswer: 3,
          explanation: 'Ana está emocionada y no está cansada, lo que la hace la más positiva del diálogo.',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u3-l4-listening-15',
    type: 'listening',
    level: 'A1',
    topic: 'Emotions',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u3-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_SYN,
      questions: [
        {
          question: '[[What structure is "I am not angry or sad"?|¿Qué estructura es "I am not angry or sad"?]]',
          options: [
            '[[Affirmative to be|To be afirmativo]]',
            '[[Past tense|Tiempo pasado]]',
            '[[Negative to be|To be negativo]]',
            '[[Question with to be|Pregunta con to be]]',
          ],
          correctAnswer: 2,
          explanation: '"I am not" es la forma negativa de to be. Ben la usa para negar dos emociones.',
        },
      ],
    },
    topicName: 'Listening',
  },
];
