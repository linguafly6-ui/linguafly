import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = 'Comprensión auditiva';
const LISTENING_TRANSCRIPT = `[[David: Hi, Sara! What time do you wake up every day?|David: ¡Hola, Sara! ¿A qué hora te despiertas cada día?]] [[Sara: I wake up at seven. Then I get up and eat. What about you?|Sara: Me despierto a las siete. Luego me levanto y como algo. ¿Y tú?]] [[David: I wake up at six. I go to work early. I work in a school.|David: Me despierto a las seis. Voy temprano al trabajo. Trabajo en una escuela.]] [[Sara: Do you eat breakfast before work?|Sara: ¿Desayunas antes de trabajar?]] [[David: Yes, I eat breakfast at home. I drink coffee every morning.|David: Sí, desayuno en casa. Bebo café todas las mañanas.]] [[Sara: I go to the gym after breakfast. Then I study English at home.|Sara: Voy al gimnasio después de desayunar. Luego estudio inglés en casa.]] [[David: What time do you come home in the evening?|David: ¿A qué hora vuelves a casa por la tarde?]] [[Sara: I come home at five. I eat dinner and then I go to sleep at ten.|Sara: Vuelvo a casa a las cinco. Ceno y luego me voy a dormir a las diez.]] [[David: I come home at four. I play football with my friends. Then I eat dinner and sleep at eleven.|David: Vuelvo a casa a las cuatro. Juego al fútbol con mis amigos. Luego ceno y me duermo a las once.]]`;

const INST_MC = 'Escucha el audio y elige la respuesta correcta.';
const INST_TF = 'Escucha el audio. Indica si la afirmación es verdadera o falsa.';
const INST_SYN = 'Escucha el audio. Elige la mejor respuesta.';

export const UNIT_5_LESSON_4_LISTENING: Exercise[] = [
  // ─── 1–8: Elección múltiple ────────────────────────────────────────────────
  {
    id: 'a1-u5-l4-listening-1',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[What time does David wake up?|¿A qué hora se despierta David?]]',
          options: [
            '[[At five|A las cinco]]',
            '[[At six|A las seis]]',
            '[[At seven|A las siete]]',
            '[[At eight|A las ocho]]',
          ],
          correctAnswer: 1,
          explanation: 'David dice "I wake up at six".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-2',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[What time does Sara wake up?|¿A qué hora se despierta Sara?]]',
          options: [
            '[[At six|A las seis]]',
            '[[At seven|A las siete]]',
            '[[At eight|A las ocho]]',
            '[[At nine|A las nueve]]',
          ],
          correctAnswer: 1,
          explanation: 'Sara dice "I wake up at seven".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-3',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[Where does David work?|¿Dónde trabaja David?]]',
          options: [
            '[[In an office|En una oficina]]',
            '[[In a hospital|En un hospital]]',
            '[[At home|En casa]]',
            '[[In a school|En una escuela]]',
          ],
          correctAnswer: 3,
          explanation: 'David dice "I work in a school".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-4',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[What does David drink every morning?|¿Qué bebe David cada mañana?]]',
          options: [
            '[[tea|té]]',
            '[[juice|zumo]]',
            '[[water|agua]]',
            '[[coffee|café]]',
          ],
          correctAnswer: 3,
          explanation: 'David dice "I drink coffee every morning".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-5',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[What does Sara do after breakfast?|¿Qué hace Sara después del desayuno?]]',
          options: [
            '[[She goes to work|Va a trabajar]]',
            '[[She goes to the gym|Va al gimnasio]]',
            '[[She studies at school|Estudia en la escuela]]',
            '[[She drinks coffee|Bebe café]]',
          ],
          correctAnswer: 1,
          explanation: 'Sara dice "I go to the gym after breakfast".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-6',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[What time does Sara come home?|¿A qué hora vuelve Sara a casa?]]',
          options: [
            '[[At four|A las cuatro]]',
            '[[At five|A las cinco]]',
            '[[At six|A las seis]]',
            '[[At seven|A las siete]]',
          ],
          correctAnswer: 1,
          explanation: 'Sara dice "I come home at five".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-7',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[What time does Sara go to sleep?|¿A qué hora se va a dormir Sara?]]',
          options: [
            '[[At nine|A las nueve]]',
            '[[At ten|A las diez]]',
            '[[At eleven|A las once]]',
            '[[At midnight|A medianoche]]',
          ],
          correctAnswer: 1,
          explanation: 'Sara dice "I go to sleep at ten".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-8',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_MC,
      questions: [
        {
          question: '[[What does David do in the evening?|¿Qué hace David por la tarde?]]',
          options: [
            '[[He studies English|Estudia inglés]]',
            '[[He goes to the gym|Va al gimnasio]]',
            '[[He plays football|Juega al fútbol]]',
            '[[He goes to sleep|Se va a dormir]]',
          ],
          correctAnswer: 2,
          explanation: 'David dice "I play football with my friends".',
        },
      ],
    },
    topicName: 'Listening',
  },
  // ─── 9–12: Verdadero/Falso ─────────────────────────────────────────────────
  {
    id: 'a1-u5-l4-listening-9',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_TF,
      questions: [
        {
          question: '[[David wakes up at seven.|David se despierta a las siete.]]',
          options: ['[[True|Verdadero]]', '[[False|Falso]]'],
          correctAnswer: 'False',
          explanation: 'Falso. David se despierta a las seis, no a las siete.',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-10',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_TF,
      questions: [
        {
          question: '[[David eats breakfast at home.|David desayuna en casa.]]',
          options: ['[[True|Verdadero]]', '[[False|Falso]]'],
          correctAnswer: 'True',
          explanation: 'Verdadero. David dice "I eat breakfast at home".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-11',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_TF,
      questions: [
        {
          question: '[[Sara studies English at home.|Sara estudia inglés en casa.]]',
          options: ['[[True|Verdadero]]', '[[False|Falso]]'],
          correctAnswer: 'True',
          explanation: 'Verdadero. Sara dice "I study English at home".',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-12',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_TF,
      questions: [
        {
          question: '[[David goes to sleep at ten.|David se va a dormir a las diez.]]',
          options: ['[[True|Verdadero]]', '[[False|Falso]]'],
          correctAnswer: 'False',
          explanation: 'Falso. David duerme a las once; Sara es quien duerme a las diez.',
        },
      ],
    },
    topicName: 'Listening',
  },
  // ─── 13–15: Síntesis ────────────────────────────────────────────────────────
  {
    id: 'a1-u5-l4-listening-13',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_SYN,
      questions: [
        {
          question: '[[What is the main topic of this audio?|¿Cuál es el tema principal de este audio?]]',
          options: [
            '[[A job interview|Una entrevista de trabajo]]',
            '[[Two friends discussing their daily routines|Dos amigos hablando de sus rutinas diarias]]',
            '[[A school lesson about verbs|Una clase sobre verbos]]',
            '[[Two people planning a trip|Dos personas planificando un viaje]]',
          ],
          correctAnswer: 1,
          explanation: 'David y Sara se preguntan y explican sus rutinas diarias usando el presente simple.',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-14',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_SYN,
      questions: [
        {
          question: '[[Who wakes up earlier?|¿Quién se despierta más temprano?]]',
          options: [
            '[[Sara, at six|Sara, a las seis]]',
            '[[David, at seven|David, a las siete]]',
            '[[Both wake up at the same time|Los dos se despiertan a la misma hora]]',
            '[[David, at six|David, a las seis]]',
          ],
          correctAnswer: 3,
          explanation: 'David se despierta a las seis y Sara a las siete, así que David se despierta antes.',
        },
      ],
    },
    topicName: 'Listening',
  },
  {
    id: 'a1-u5-l4-listening-15',
    type: 'listening',
    level: 'A1',
    topic: 'Daily Routines',
    difficulty: 'easy',
    transcript: LISTENING_TRANSCRIPT,
    // audioUrl: '/audio/a1-u5-l4-listening.mp3',
    content: {
      title: LESSON_TITLE,
      instructions: INST_SYN,
      questions: [
        {
          question: '[[Which sentence best describes this dialogue?|¿Qué oración describe mejor este diálogo?]]',
          options: [
            '[[David and Sara have the same routine.|David y Sara tienen la misma rutina.]]',
            '[[David and Sara describe different daily routines.|David y Sara describen rutinas diarias diferentes.]]',
            '[[David and Sara only talk about work.|David y Sara solo hablan del trabajo.]]',
            '[[David and Sara plan their routine together.|David y Sara planifican su rutina juntos.]]',
          ],
          correctAnswer: 1,
          explanation: 'Ambos comparten su rutina pero tienen horarios y actividades diferentes: David trabaja en una escuela y juega al fútbol; Sara va al gimnasio y estudia inglés.',
        },
      ],
    },
    topicName: 'Listening',
  },
];
