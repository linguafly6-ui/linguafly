/**
 * Unidad 1 B2 — Lección 3: Comprensión lectora (Health & Fitness)
 * 13 preguntas con texto y casos distintos
 */

import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = '[[Reading|Comprensión lectora]]';
const READING_TRANSCRIPT = `[[When|Cuando]] [[I|yo]] [[was|era]] [[younger|más joven]], [[I|yo]] [[never|nunca]] [[exercised|hacía ejercicio]] [[regularly|regularmente]]. [[I|yo]] [[spent|pasaba]] [[hours|horas]] [[sitting|sentado]] [[at|en]] [[a desk|un escritorio]] [[and|y]] [[ignored|ignoraba]] [[my|mi]] [[health|salud]]. [[One day|Un día]] [[I|yo]] [[decided|decidí]] [[to|a]] [[change|cambiar]]: [[I|yo]] [[joined|me uní]] [[a gym|un gimnasio]] [[and|y]] [[started|empecé]] [[running|a correr]] [[three|tres]] [[times|veces]] [[a week|a la semana]]. [[I|yo]] [[regret|me arrepiento de]] [[not having|no haber]] [[started|empezado]] [[earlier|antes]]. [[Now|Ahora]] [[I|yo]] [[feel|me siento]] [[much|mucho]] [[more|más]] [[energetic|enérgico]] [[and|y]] [[I|yo]] [[know|sé]] [[that|que]] [[staying active|mantenerse activo]] [[is|es]] [[the best|la mejor]] [[way|forma]] [[to|de]] [[stay healthy|mantenerse sano]]. [[It|es]] [[is never|nunca es]] [[too late|demasiado tarde]] [[to|para]] [[begin|empezar]].`;

const INSTRUCTIONS = 'Lee el texto. Después responde las preguntas.';

const QUESTIONS = [
  { question: '[[What|Qué]] [[did the person avoid when younger|evitaba la persona cuando era joven]]?', options: ['[[Exercising regularly|Hacer ejercicio regularmente]]', '[[Sitting at a desk|Estar sentado en un escritorio]]', '[[Ignoring health|Ignorar la salud]]'], correctAnswer: 0, explanation: '[[The text says|El texto dice]] "[[I never exercised regularly|nunca hacía ejercicio regularmente]]".' },
  { question: '[[What|Qué]] [[did the person decide|decidió la persona]]?', options: ['[[To travel|Viajar]]', '[[To change|Cambiar]]', '[[To quit|Dejar]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[I decided to change|decidí cambiar]]".' },
  { question: '[[How many|Cuántas]] [[times a week|veces a la semana]] [[does the person run|corre la persona]]?', options: ['[[One|Una]]', '[[Two|Dos]]', '[[Three|Tres]]'], correctAnswer: 2, explanation: '[[The text says|El texto dice]] "[[running three times a week|correr tres veces a la semana]]".' },
  { question: '[[What|Qué]] [[does the person regret|de qué se arrepiente la persona]]?', options: ['[[Having started|Haber empezado]]', '[[Not having started earlier|No haber empezado antes]]', '[[Not joining the gym|No haberse unido al gimnasio]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[I regret not having started earlier|me arrepiento de no haber empezado antes]]".' },
  { question: '[[How|Cómo]] [[does the person feel now|se siente la persona ahora]]?', options: ['[[Less energetic|Menos enérgico]]', '[[More energetic|Más enérgico]]', '[[The same|Igual]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[I now feel much more energetic|ahora me siento mucho más enérgico]]".' },
  { question: '[[What|Qué]] [[has the person learned|ha aprendido la persona]]?', options: ['[[That|Que]] [[sitting is best|estar sentado es mejor]]', '[[That|Que]] [[staying active is the best way to stay healthy|mantenerse activo es la mejor forma de mantenerse sano]]', '[[That|Que]] [[gyms are useless|los gimnasios son inútiles]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[staying active is the best way to stay healthy|mantenerse activo es la mejor forma de mantenerse sano]]".' },
  { question: '[[The person|La persona]] [[joined|se unió]] [[a gym|a un gimnasio]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 0, explanation: '[[True|Verdadero]]. [[The text says|El texto dice]] "[[I joined a gym|me uní a un gimnasio]]".' },
  { question: '[[The person|La persona]] [[thinks|cree]] [[it is too late|que es demasiado tarde]] [[to begin|para empezar]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 1, explanation: '[[False|Falso]]. [[The text says|El texto dice]] "[[it is never too late to begin|nunca es demasiado tarde para empezar]]".' },
  { question: '[[What|Cuál]] [[is|es]] [[the main topic|el tema principal]] [[of|del]] [[this text|este texto]]?', options: ['[[A|Un]] [[holiday|vacaciones]]', '[[Health and fitness|Salud y fitness]] [[through|a través de]] [[lifestyle change|cambio de estilo de vida]]', '[[Work|Trabajo]] [[skills|habilidades]]'], correctAnswer: 1, explanation: '[[The text|El texto]] [[describes|describe]] [[joining|unirse a]] [[a gym|un gimnasio]] [[and|y]] [[starting|empezar]] [[to run|a correr]].' },
  { question: '[[What|Qué]] [[detail|detalle]] [[supports|apoya]] [[the idea|la idea]] [[that|que]] [[staying active|mantenerse activo]] [[helps|ayuda]] [[health|la salud]]?', options: ['[[The person learned|La persona aprendió]] [[that staying active is the best way to stay healthy|que mantenerse activo es la mejor forma de mantenerse sano]]', '[[The person ignored health|La persona ignoró la salud]]', '[[The person had no goals|La persona no tenía metas]]'], correctAnswer: 0, explanation: '[[The text says|El texto dice]] "[[staying active is the best way to stay healthy|mantenerse activo es la mejor forma de mantenerse sano]]".' },
  { question: '[[The text|El texto]] [[implies|implica]] [[that|que]] [[it is never too late|nunca es demasiado tarde]] [[to begin|para empezar]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 0, explanation: '[[True|Verdadero]]. [[The text says|El texto dice]] "[[it is never too late to begin|nunca es demasiado tarde para empezar]]".' },
  { question: '[[What|Qué]] [[vocabulary|vocabulario]] [[is key|es clave]] [[in|en]] [[this text|este texto]]?', options: ['[[Gym|Gimnasio]], [[exercise|ejercicio]], [[regret|arrepentirse]]', '[[Weather|Tiempo]], [[travel|viaje]]', '[[Food|Comida]], [[restaurant|restaurante]]'], correctAnswer: 0, explanation: '[[The text|El texto]] [[uses|usa]] [[vocabulary|vocabulario]] [[related to|relacionado con]] [[health and fitness|salud y fitness]].' },
  { question: '[[The person|La persona]] [[used to|solía]] [[spend|pasar]] [[hours sitting|horas sentado]] [[at a desk|en un escritorio]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 0, explanation: '[[True|Verdadero]]. [[The text says|El texto dice]] "[[I spent hours sitting at a desk|pasaba horas sentado en un escritorio]]".' },
  { question: '[[How often|Con qué frecuencia]] [[does the person exercise now|hace ejercicio ahora la persona]]?', options: ['[[Every day|Cada día]]', '[[Three times a week|Tres veces a la semana]]', '[[Once a month|Una vez al mes]]'], correctAnswer: 1, explanation: '[[The text says|El texto dice]] "[[three times a week|tres veces a la semana]]".' },
  { question: '[[Which statement|Qué afirmación]] [[best summarises|resume mejor]] [[the person’s experience|la experiencia de la persona]]?', options: ['[[A small lifestyle change improved their energy|Un pequeño cambio de estilo de vida mejoró su energía]]', '[[Exercise made no difference|El ejercicio no supuso ninguna diferencia]]', '[[They stopped caring about health|Dejó de preocuparse por la salud]]'], correctAnswer: 0, explanation: '[[The person|La persona]] [[feels more energetic|se siente con más energía]] [[after becoming active|después de mantenerse activa]].' },
];

export const UNIT_1_LESSON_3_READING: Exercise[] = QUESTIONS.map((q, i) => ({
  id: `b2-u1-l3-r${i + 1}`,
  type: 'reading',
  level: 'B2',
  topic: 'Health & Fitness',
  difficulty: 'medium',
  transcript: READING_TRANSCRIPT,
  content: { title: LESSON_TITLE, instructions: INSTRUCTIONS, questions: [q] },
  topicName: 'Reading',
}));
