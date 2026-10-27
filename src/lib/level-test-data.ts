// Test de Nivel A1-C2 basado en CEFR
// Cada pregunta tiene un nivel asociado y puntos

export type QuestionType = 'multiple-choice' | 'fill-blank' | 'reading-comprehension';
export type SkillType = 'grammar' | 'vocabulary' | 'reading';

export interface Question {
  id: string;
  type: QuestionType;
  skill: SkillType;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  points: number;
  question: string;
  context?: string; // Para reading comprehension
  options: string[];
  correctAnswer: number; // índice de la respuesta correcta
  explanation?: string;
}

export interface LevelResult {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  percentage: number;
  title: string;
  description: string;
  recommendations: string[];
  courseUrl: string;
  color: string;
  gradient: string;
}

export const LEVEL_TEST_QUESTIONS: Question[] = [
  // ===== A1 LEVEL =====
  {
    id: 'a1-1',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'A1',
    points: 1,
    question: 'Hello! My name ___ Maria.',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 1,
  },
  {
    id: 'a1-2',
    type: 'multiple-choice',
    skill: 'vocabulary',
    level: 'A1',
    points: 1,
    question: 'I ___ coffee every morning.',
    options: ['drink', 'drinks', 'drinking', 'to drink'],
    correctAnswer: 0,
  },
  {
    id: 'a1-3',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'A1',
    points: 1,
    question: '___ is your phone number?',
    options: ['Who', 'What', 'Where', 'When'],
    correctAnswer: 1,
  },
  {
    id: 'a1-4',
    type: 'multiple-choice',
    skill: 'vocabulary',
    level: 'A1',
    points: 1,
    question: 'She ___ to school by bus.',
    options: ['go', 'goes', 'going', 'to go'],
    correctAnswer: 1,
  },

  // ===== A2 LEVEL =====
  {
    id: 'a2-1',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'A2',
    points: 2,
    question: 'I ___ to London last year.',
    options: ['go', 'went', 'have gone', 'going'],
    correctAnswer: 1,
  },
  {
    id: 'a2-2',
    type: 'multiple-choice',
    skill: 'vocabulary',
    level: 'A2',
    points: 2,
    question: 'Could you ___ me the time, please?',
    options: ['say', 'tell', 'speak', 'talk'],
    correctAnswer: 1,
  },
  {
    id: 'a2-3',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'A2',
    points: 2,
    question: 'She is ___ than her sister.',
    options: ['tall', 'taller', 'tallest', 'more tall'],
    correctAnswer: 1,
  },
  {
    id: 'a2-4',
    type: 'multiple-choice',
    skill: 'reading',
    level: 'A2',
    points: 2,
    question: 'What does "I\'m looking forward to seeing you" mean?',
    options: [
      'I will see you later',
      'I am excited about seeing you',
      'I want to look at you',
      'I am searching for you'
    ],
    correctAnswer: 1,
  },

  // ===== B1 LEVEL =====
  {
    id: 'b1-1',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'B1',
    points: 3,
    question: 'If I ___ enough money, I would buy a new car.',
    options: ['have', 'had', 'will have', 'would have'],
    correctAnswer: 1,
  },
  {
    id: 'b1-2',
    type: 'multiple-choice',
    skill: 'vocabulary',
    level: 'B1',
    points: 3,
    question: 'The meeting has been ___ until next week.',
    options: ['put off', 'put on', 'put up', 'put down'],
    correctAnswer: 0,
  },
  {
    id: 'b1-3',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'B1',
    points: 3,
    question: 'I ___ my homework when you called me.',
    options: ['do', 'did', 'was doing', 'have done'],
    correctAnswer: 2,
  },
  {
    id: 'b1-4',
    type: 'reading-comprehension',
    skill: 'reading',
    level: 'B1',
    points: 3,
    context: 'The new recycling program has reduced waste by 30% in the past year. City officials are pleased with the results.',
    question: 'What can we infer from this text?',
    options: [
      'The program is expensive',
      'The program is working well',
      'The program needs improvement',
      'The program is temporary'
    ],
    correctAnswer: 1,
  },


  {
    id: 'b1-5',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'B1',
    points: 3,
    question: 'She has lived in Madrid ___ 2020.',
    options: ['for', 'since', 'during', 'from'],
    correctAnswer: 1,
  },

  // ===== B2 LEVEL =====
  {
    id: 'b2-1',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'B2',
    points: 4,
    question: 'By the time you arrive, I ___ the report.',
    options: [
      'finish',
      'will finish',
      'will have finished',
      'am finishing'
    ],
    correctAnswer: 2,
  },
  {
    id: 'b2-2',
    type: 'multiple-choice',
    skill: 'vocabulary',
    level: 'B2',
    points: 4,
    question: 'The company\'s profits have ___ significantly this quarter.',
    options: ['risen', 'raised', 'arose', 'arisen'],
    correctAnswer: 0,
  },
  {
    id: 'b2-3',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'B2',
    points: 4,
    question: 'She suggested ___ early to avoid traffic.',
    options: ['to leave', 'leaving', 'leave', 'left'],
    correctAnswer: 1,
  },
  {
    id: 'b2-4',
    type: 'reading-comprehension',
    skill: 'reading',
    level: 'B2',
    points: 4,
    context: 'Despite initial skepticism, the renewable energy initiative has exceeded expectations, demonstrating that sustainable practices can be economically viable.',
    question: 'What is the main message of this passage?',
    options: [
      'People doubted renewable energy',
      'Sustainable practices are expensive',
      'The initiative proved doubters wrong',
      'The initiative failed to meet goals'
    ],
    correctAnswer: 2,
  },

  // ===== C1 LEVEL =====
  {
    id: 'c1-1',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'C1',
    points: 5,
    question: '___ the circumstances, I believe we made the right decision.',
    options: ['Considering', 'Considered', 'To consider', 'Having considered'],
    correctAnswer: 0,
  },
  {
    id: 'c1-2',
    type: 'multiple-choice',
    skill: 'vocabulary',
    level: 'C1',
    points: 5,
    question: 'The politician\'s speech was so ___ that it swayed public opinion.',
    options: ['persuading', 'persuasive', 'persuaded', 'persuasion'],
    correctAnswer: 1,
  },
  {
    id: 'c1-3',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'C1',
    points: 5,
    question: 'Little ___ that the decision would have such far-reaching consequences.',
    options: [
      'did we know',
      'we knew',
      'we did know',
      'did we knew'
    ],
    correctAnswer: 0,
  },
  {
    id: 'c1-4',
    type: 'reading-comprehension',
    skill: 'reading',
    level: 'C1',
    points: 5,
    context: 'The paradox of contemporary education lies in its simultaneous emphasis on standardization and individualization—a tension that educators must navigate with considerable finesse.',
    question: 'What does the author imply about modern education?',
    options: [
      'It is too standardized',
      'It is too individualized',
      'It contains contradictory goals',
      'It is easy to manage'
    ],
    correctAnswer: 2,
  },

  // ===== C2 LEVEL =====
  {
    id: 'c2-1',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'C2',
    points: 6,
    question: '___ as it may seem, the theory has gained widespread acceptance.',
    options: ['Improbable', 'Improbably', 'More improbable', 'How improbable'],
    correctAnswer: 0,
  },
  {
    id: 'c2-2',
    type: 'multiple-choice',
    skill: 'vocabulary',
    level: 'C2',
    points: 6,
    question: 'Her argument was so ___ that even the opposition conceded defeat.',
    options: ['cogent', 'coherent', 'covert', 'complicit'],
    correctAnswer: 0,
  },
  {
    id: 'c2-3',
    type: 'multiple-choice',
    skill: 'grammar',
    level: 'C2',
    points: 6,
    question: 'Were the proposal ___ earlier, we might have avoided these complications.',
    options: [
      'to be submitted',
      'submitted',
      'to have been submitted',
      'being submitted'
    ],
    correctAnswer: 1,
  },
  {
    id: 'c2-4',
    type: 'reading-comprehension',
    skill: 'reading',
    level: 'C2',
    points: 6,
    context: 'The epistemological implications of quantum mechanics continue to perplex philosophers, suggesting that the relationship between observer and observed may be fundamentally more nuanced than classical physics would have us believe.',
    question: 'What philosophical issue does the passage address?',
    options: [
      'The difficulty of quantum mechanics',
      'The nature of reality and observation',
      'The superiority of classical physics',
      'The simplicity of modern science'
    ],
    correctAnswer: 1,
  },
];

export function calculateLevel(score: number, totalPoints: number): LevelResult {
  const percentage = (score / totalPoints) * 100;
  
  if (percentage >= 95) {
    return {
      level: 'C2',
      percentage,
      title: 'Maestría (C2)',
      description: 'Tienes un dominio excepcional del inglés. Puedes comprender y expresarte con total fluidez en cualquier contexto.',
      recommendations: [
        'Curso C2: Perfeccionamiento y preparación para Cambridge CPE',
        'Clases de conversación avanzada y debate',
        'Preparación para contextos profesionales especializados'
      ],
      courseUrl: '/curso-c2',
      color: 'from-peach-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-peach-500 to-pink-500',
    };
  } else if (percentage >= 80) {
    return {
      level: 'C1',
      percentage,
      title: 'Avanzado (C1)',
      description: 'Tienes un nivel avanzado de inglés. Puedes expresarte con fluidez y usar el idioma de forma flexible.',
      recommendations: [
        'Curso C1: Preparación para Cambridge CAE',
        'Inglés para negocios avanzado',
        'Redacción académica y profesional'
      ],
      courseUrl: '/curso-c1',
      color: 'from-orange-500 to-coral-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-coral-500',
    };
  } else if (percentage >= 65) {
    return {
      level: 'B2',
      percentage,
      title: 'Intermedio Alto (B2)',
      description: 'Tienes un buen dominio del inglés. Puedes interactuar con fluidez y comprender textos complejos.',
      recommendations: [
        'Curso B2: Preparación para Cambridge First (FCE)',
        'Inglés profesional para tu sector',
        'Conversación avanzada'
      ],
      courseUrl: '/curso-b2',
      color: 'from-amber-500 to-amber-500',
      gradient: 'bg-gradient-to-br from-amber-500 to-amber-500',
    };
  } else if (percentage >= 50) {
    return {
      level: 'B1',
      percentage,
      title: 'Intermedio (B1)',
      description: 'Puedes manejar situaciones durante viajes y expresar opiniones sobre temas conocidos.',
      recommendations: [
        'Curso B1: Preparación para Cambridge PET',
        'Inglés para viajes y turismo',
        'Conversación intermedia'
      ],
      courseUrl: '/curso/ingles-b1',
      color: 'from-yellow-500 to-lime-500',
      gradient: 'bg-gradient-to-br from-yellow-500 to-lime-500',
    };
  } else if (percentage >= 35) {
    return {
      level: 'A2',
      percentage,
      title: 'Elemental (A2)',
      description: 'Puedes comunicarte en situaciones cotidianas simples y describir tu entorno.',
      recommendations: [
        'Curso A2: Inglés elemental completo',
        'Conversación básica para viajes',
        'Gramática y vocabulario esencial'
      ],
      courseUrl: '/curso-a2',
      color: 'from-orange-500 to-amber-500',
      gradient: 'bg-gradient-to-br from-orange-500 to-amber-500',
    };
  } else {
    return {
      level: 'A1',
      percentage,
      title: 'Principiante (A1)',
      description: 'Estás comenzando tu viaje con el inglés. Puedes usar expresiones básicas y presentarte.',
      recommendations: [
        'Curso A1: Inglés desde cero',
        'Vocabulario y gramática básica',
        'Introducción a la conversación'
      ],
      courseUrl: '/curso/ingles-a1',
      color: 'from-red-500 to-orange-500',
      gradient: 'bg-gradient-to-br from-red-500 to-orange-500',
    };
  }
}

export const TOTAL_POINTS = LEVEL_TEST_QUESTIONS.reduce((sum, q) => sum + q.points, 0);
