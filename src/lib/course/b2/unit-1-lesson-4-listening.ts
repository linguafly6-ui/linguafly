/**
 * Unidad 1 B2 — Lección 4: Comprensión auditiva (Health & Fitness)
 * 13 preguntas con audio y casos distintos
 */

import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = '[[Listening|Comprensión auditiva]]';
const LISTENING_TRANSCRIPT = `[[My name|Mi nombre]] [[is|es]] [[Sarah|Sarah]] [[and|y]] [[I|yo]] [[work|trabajo]] [[as|como]] [[a|una]] [[nutritionist|nutricionista]]. [[I|yo]] [[used to|solía]] [[be|ser]] [[terrified|aterrorizada]] [[of|de]] [[cooking healthy meals|cocinar comidas saludables]] [[and|y]] [[I|yo]] [[would|solía]] [[avoid|evitar]] [[any|cualquier]] [[vegetable|verdura]]. [[Then|Entonces]] [[I|yo]] [[set|me establecí]] [[myself|me]] [[a challenge|un reto]]: [[to|a]] [[complete|completar]] [[a marathon|un maratón]]. [[Having|Habiendo]] [[trained|entrenado]] [[for|durante]] [[months|meses]], [[I|yo]] [[finally|finalmente]] [[did it|lo hice]]. [[I|yo]] [[wish|ojalá]] [[I|yo]] [[had|hubiera]] [[faced|enfrentado]] [[my|mi]] [[fear|miedo]] [[sooner|antes]]. [[Now|Ahora]] [[I|yo]] [[feel|me siento]] [[proud|orgullosa]] [[of|de]] [[my|mi]] [[progress|progreso]] [[and|y]] [[I|yo]] [[am|estoy]] [[much|mucho]] [[more|más]] [[confident|segura]] [[about|sobre]] [[my|mi]] [[health|salud]].`;

const INSTRUCTIONS = 'Escucha el audio. Puedes leer la transcripción. Después responde.';

const QUESTIONS = [
  { question: '[[What|Qué]] [[does Sarah do|hace Sarah]]?', options: ['[[She is a doctor|Es médica]]', '[[She is a nutritionist|Es nutricionista]]', '[[She is a chef|Es chef]]'], correctAnswer: 1, explanation: '[[She says|Dice]] "[[I work as a nutritionist|trabajo como nutricionista]]".' },
  { question: '[[What|De qué]] [[was Sarah terrified|estaba Sarah aterrorizada]]?', options: ['[[Of writing|De escribir]]', '[[Of cooking healthy meals|De cocinar comidas saludables]]', '[[Of travelling|De viajar]]'], correctAnswer: 1, explanation: '[[She says|Dice]] "[[I used to be terrified of cooking healthy meals|solía estar aterrorizada de cocinar comidas saludables]]".' },
  { question: '[[What|Cuál]] [[was Sarah\'s challenge|era el reto de Sarah]]?', options: ['[[To write a book|Escribir un libro]]', '[[To complete a marathon|Completar un maratón]]', '[[To change jobs|Cambiar de trabajo]]'], correctAnswer: 1, explanation: '[[She says|Dice]] "[[to complete a marathon|completar un maratón]]".' },
  { question: '[[How long|Cuánto tiempo]] [[did Sarah train|entrenó Sarah]]?', options: ['[[Days|Días]]', '[[Weeks|Semanas]]', '[[Months|Meses]]'], correctAnswer: 2, explanation: '[[She says|Dice]] "[[Having trained for months|habiendo entrenado durante meses]]".' },
  { question: '[[What|Qué]] [[does Sarah wish|de qué se arrepiente Sarah]]?', options: ['[[Having tried|Haberlo intentado]]', '[[Having faced her fear sooner|Haber enfrentado su miedo antes]]', '[[Having run the marathon|Haber corrido el maratón]]'], correctAnswer: 1, explanation: '[[She says|Dice]] "[[I wish I had faced my fear sooner|ojalá hubiera enfrentado mi miedo antes]]".' },
  { question: '[[How|Cómo]] [[does Sarah feel now|se siente Sarah ahora]]?', options: ['[[Less confident|Menos segura]]', '[[Proud and more confident|Orgullosa y más segura]]', '[[The same|Igual]]'], correctAnswer: 1, explanation: '[[She says|Dice]] "[[I feel proud of my progress and I am much more confident|me siento orgullosa de mi progreso y estoy mucho más segura]]".' },
  { question: '[[Sarah|Sarah]] [[completed|completó]] [[the marathon|el maratón]] [[successfully|con éxito]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 0, explanation: '[[True|Verdadero]]. [[She says|Dice]] "[[I finally did it|finalmente lo hice]]".' },
  { question: '[[Sarah|Sarah]] [[is proud|está orgullosa]] [[of her progress|de su progreso]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 0, explanation: '[[True|Verdadero]]. [[She says|Dice]] "[[I feel proud of my progress|me siento orgullosa de mi progreso]]".' },
  { question: '[[What|Cuál]] [[is|es]] [[the main topic|el tema principal]]?', options: ['[[Nutrition|Nutrición]]', '[[Overcoming fear|Superar el miedo]] [[through|a través de]] [[health and fitness|salud y fitness]]', '[[Travel|Viajes]]'], correctAnswer: 1, explanation: '[[The listening|La escucha]] [[describes|describe]] [[overcoming|superar]] [[fear of healthy cooking|miedo a cocinar saludable]] [[and|y]] [[completing|completar]] [[a marathon|un maratón]].' },
  { question: '[[What|Qué]] [[detail|detalle]] [[supports|apoya]] [[that|que]] [[Sarah|Sarah]] [[achieved|logró]] [[her challenge|su reto]]?', options: ['[[She trained for months and finally did it|Entrenó durante meses y finalmente lo hizo]]', '[[She gave up|Se rindió]]', '[[She changed jobs|Cambió de trabajo]]'], correctAnswer: 0, explanation: '[[She says|Dice]] "[[Having trained for months, I finally did it|habiendo entrenado durante meses, finalmente lo hice]]".' },
  { question: '[[The listening|La escucha]] [[implies|implica]] [[that|que]] [[facing fears|enfrentar miedos]] [[leads to|conduce a]] [[growth|crecimiento]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 0, explanation: '[[True|Verdadero]]. [[Sarah|Sarah]] [[now feels more confident|ahora se siente más segura]] [[after|después de]] [[completing the marathon|completar el maratón]].' },
  { question: '[[What|Qué]] [[vocabulary|vocabulario]] [[is key|es clave]] [[in|en]] [[this listening|esta escucha]]?', options: ['[[Challenge|Reto]], [[marathon|maratón]], [[progress|progreso]]', '[[Weather|Tiempo]], [[travel|viaje]]', '[[Food|Comida]], [[restaurant|restaurante]]'], correctAnswer: 0, explanation: '[[The listening|La escucha]] [[uses|usa]] [[vocabulary|vocabulario]] [[related to|relacionado con]] [[health and fitness|salud y fitness]].' },
  { question: '[[Sarah|Sarah]] [[used to|solía]] [[avoid|evitar]] [[vegetables|las verduras]].', options: ['[[True|Verdadero]]', '[[False|Falso]]'], correctAnswer: 0, explanation: '[[True|Verdadero]]. [[She says|Dice]] "[[I would avoid any vegetable|solía evitar cualquier verdura]]".' },
  { question: '[[What changed|Qué cambió]] [[after Sarah completed the marathon|después de que Sarah completara el maratón]]?', options: ['[[She became more confident|Se volvió más segura]]', '[[She stopped exercising|Dejó de hacer ejercicio]]', '[[She changed her profession|Cambió de profesión]]'], correctAnswer: 0, explanation: '[[Sarah says|Sarah dice]] [[she is much more confident|que está mucho más segura]].' },
  { question: '[[Which grammar structure|Qué estructura gramatical]] [[does Sarah use|usa Sarah]] [[to describe her training|para describir su entrenamiento]]?', options: ['[[Having + past participle|Having + participio pasado]]', '[[Present perfect continuous|Presente perfecto continuo]]', '[[Second conditional|Segundo condicional]]'], correctAnswer: 0, explanation: '[[Having trained for months|Habiendo entrenado durante meses]] [[is a perfect participle clause|es una cláusula de participio perfecto]].' },
];

export const UNIT_1_LESSON_4_LISTENING: Exercise[] = QUESTIONS.map((q, i) => ({
  id: `b2-u1-l4-l${i + 1}`,
  type: 'listening',
  level: 'B2',
  topic: 'Health & Fitness',
  difficulty: 'medium',
  transcript: LISTENING_TRANSCRIPT,
  content: { title: LESSON_TITLE, instructions: INSTRUCTIONS, questions: [q] },
  topicName: 'Listening',
}));
