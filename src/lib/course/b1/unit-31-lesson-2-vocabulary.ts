/**
 * Unidad 31 B1 — Lección 2: Vocabulario (The natural world)
 * 15 ejercicios didácticos: palabra, significado en español y ejemplo contextual.
 */
import { Exercise } from '@/lib/exercise-generator';

const LESSON_TITLE = 'Vocabulary: The Natural World';
const ITEMS = [
  { word:'habitat', meaning:'hábitat; lugar natural donde vive una especie', example:'Wetlands are an important habitat for many birds.', prompt:'Which word means the natural home of an animal or plant?', options:['habitat','weather','harvest'], answer:0 },
  { word:'wildlife', meaning:'vida silvestre; animales y plantas que viven en libertad', example:'The national park protects local wildlife.', prompt:'Which word refers to animals and plants living naturally?', options:['livestock','wildlife','pets'], answer:1 },
  { word:'endangered', meaning:'en peligro de extinción; con riesgo de desaparecer', example:'Several endangered species live in this forest.', prompt:'How do we describe a species at risk of disappearing?', options:['domesticated','common','endangered'], answer:2 },
  { word:'species', meaning:'especie; grupo de seres vivos del mismo tipo', example:'This island is home to a rare species of butterfly.', prompt:'Which word means a group of similar living organisms?', options:['species','scenery','shelter'], answer:0 },
  { word:'shelter', meaning:'refugio; lugar que protege del peligro o del tiempo', example:'The cave provides shelter for bats in winter.', prompt:'What provides protection from danger or bad weather?', options:['branch','shelter','shore'], answer:1 },
  { word:'predator', meaning:'depredador; animal que caza a otros para alimentarse', example:'The eagle is a predator that hunts small mammals.', prompt:'What do we call an animal that hunts other animals?', options:['prey','herbivore','predator'], answer:2 },
  { word:'prey', meaning:'presa; animal cazado por otro', example:'Rabbits are common prey for foxes.', prompt:'Which word describes an animal hunted by another?', options:['prey','predator','species'], answer:0 },
  { word:'conservation', meaning:'conservación; protección del medio natural', example:'Conservation projects help protect sea turtles.', prompt:'Which word means protecting nature and wildlife?', options:['pollution','conservation','deforestation'], answer:1 },
  { word:'deforestation', meaning:'deforestación; eliminación de grandes zonas de bosque', example:'Deforestation destroys the habitats of many species.', prompt:'What is the large-scale removal of forests called?', options:['recycling','flooding','deforestation'], answer:2 },
  { word:'to thrive', meaning:'prosperar; crecer o desarrollarse con éxito', example:'Wild flowers thrive in warm, sunny conditions.', prompt:'Which verb means to grow or develop successfully?', options:['to thrive','to vanish','to damage'], answer:0 },
  { word:'lush', meaning:'frondoso; con vegetación abundante y saludable', example:'The valley is covered in lush green vegetation.', prompt:'Which adjective describes rich, healthy green vegetation?', options:['bare','lush','rocky'], answer:1 },
  { word:'remote', meaning:'remoto; alejado de ciudades o lugares habitados', example:'They studied wildlife in a remote mountain area.', prompt:'Which adjective means far away from towns and cities?', options:['crowded','urban','remote'], answer:2 },
  { word:'drought', meaning:'sequía; largo periodo con muy poca lluvia', example:'The drought caused the lake to almost disappear.', prompt:'What do we call a long period with little or no rain?', options:['drought','flood','storm'], answer:0 },
  { word:'to preserve', meaning:'preservar; mantener algo protegido y en buen estado', example:'We must preserve these forests for future generations.', prompt:'Which verb means to protect something from harm or loss?', options:['to destroy','to preserve','to exploit'], answer:1 },
  { word:'ecosystem', meaning:'ecosistema; comunidad de seres vivos y su entorno', example:'Every species plays a role in a healthy ecosystem.', prompt:'Which word describes living things interacting with their environment?', options:['landmark','climate','ecosystem'], answer:2 },
] as const;

export const UNIT_31_LESSON_2_VOCABULARY: Exercise[] = ITEMS.map((item, index) => ({
  id: `b1-u31-l2-v${index + 1}`,
  type: 'multiple-choice',
  level: 'B1',
  topic: 'The Natural World',
  difficulty: index < 5 ? 'easy' : 'medium',
  topicName: 'Vocabulary',
  content: {
    title: LESSON_TITLE,
    instructions: `Aprende primero la palabra: **${item.word}** = ${item.meaning}. Ejemplo: “${item.example}” Después, comprueba que has entendido su significado.`,
    questions: [{
      id: `b1-u31-l2-v${index + 1}-q1`,
      question: item.prompt,
      options: [...item.options],
      correctAnswer: item.answer,
      answerIndex: item.answer,
      explanation: `**${item.word}**: ${item.meaning}. Ejemplo: “${item.example}”`
    }]
  }
}));
