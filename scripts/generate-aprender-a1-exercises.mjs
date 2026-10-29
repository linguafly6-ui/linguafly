import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = path.join(root, 'src/content/cursos/ingles-a1');
const seedPath = path.join(root, 'migrations/d1/202610280002_seed_a1_course.sql');
const outputPath = path.join(root, 'migrations/d1/202610290005_a1_15_exercises_per_section.sql');
const migrationDir = path.join(root, 'migrations/d1');

// Each destination unit owns its matching source lesson exactly once.
// Reusing a source lesson was the root cause of repeated exercises.
const sourceUnitByLesson = Array.from({ length: 60 }, (_unused, index) => index + 1);
const curriculumTitles = [
  'Saludos e información personal', 'Verbo to be y pronombres personales', 'Verbo to be: negaciones y preguntas',
  'Números y objetos esenciales', 'Presente simple: acciones cotidianas', 'Familia e información personal',
  'Colores y descripciones físicas', 'Números del 20 al 100: precios y edades', 'Profesiones y ocupaciones',
  'Repaso del módulo 1', 'Decir la hora', 'Días de la semana', 'Rutina diaria',
  'Presente simple: I, you, we, they', 'Presente simple: he, she, it', 'En la cafetería',
  'Desayuno, comida y cena', 'Gustos y preferencias', 'Meses y fechas', 'Repaso del módulo 2',
  'Habitaciones de la casa', 'Muebles y objetos del hogar', 'There is / There are', 'Preposiciones de lugar',
  'Mi barrio', 'Dar indicaciones', 'Mascotas y animales', 'Partes del cuerpo', 'Ropa', 'Repaso del módulo 3',
  'Can para expresar habilidades', 'Deportes y aficiones', 'Adverbios de frecuencia', 'And, but y because',
  'Actividades de tiempo libre', 'Instrumentos musicales', 'Talentos y habilidades', 'Pedir permiso',
  'Actividades al aire libre', 'Repaso del módulo 4', 'En el aeropuerto', 'Medios de transporte',
  'Verbos de viaje', 'El tiempo y el clima', 'Las estaciones', 'En el hotel', 'Vacaciones y viajes',
  'Visitas turísticas', 'Preparar la maleta', 'Repaso del módulo 5: lugares y viajes', 'En el supermercado',
  'Sustantivos contables e incontables', 'Some y any', 'How much y how many', 'En una tienda de ropa',
  'En el restaurante', 'Cocinar y seguir recetas', 'Salud y enfermedad', 'Dinero y moneda',
  'Repaso del módulo 6: compras y comida',
];

const unmark = (value, side = 0) => String(value ?? '')
  .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_whole, first, second) => side === 0 ? first : second)
  .replace(/\s+([.,?!;:])/g, '$1')
  .replace(/([.,?!;:])(?=[A-Za-zÁÉÍÓÚÑáéíóúñ])/g, '$1 ')
  .replace(/\s+/g, ' ')
  .trim();

const sql = (value) => `'${String(value ?? '').replace(/'/g, "''")}'`;
const toTextOptions = (options, side = 0) => (options ?? []).map((option) => ({
  id: option.id,
  text: unmark(option.text, side),
}));
const sectionBlock = (unit, title) => unit.blocks.find((block) => block.title === title)?.content ?? [];
const relatedGrammarSources = {
  1: [1, 2, 3, 6, 10, 20], 2: [2, 1, 3, 6, 9, 10], 3: [3, 1, 2, 10, 20],
  4: [4, 8, 11, 51, 9], 5: [5, 13, 14, 15], 6: [6, 2, 9, 1, 10],
  7: [7, 6, 2, 9], 8: [8, 4, 11, 51, 60], 9: [9, 6, 2, 10, 5],
  10: [10, 1, 2, 3, 20], 11: [11, 12, 19, 8], 12: [12, 19, 11, 13],
  13: [13, 5, 14, 15, 12], 14: [14, 15, 5, 13], 15: [15, 14, 5, 13],
  16: [16, 17, 18, 60], 17: [17, 16, 18, 51], 18: [18, 17, 16, 13],
  19: [19, 12, 11, 8], 20: [20, 10, 19, 12], 21: [21, 22, 23, 24],
  22: [22, 21, 23, 24], 23: [23, 21, 22, 24, 4], 24: [24, 21, 22, 23, 26],
  25: [25, 23, 24, 26, 21], 27: [27, 7, 6, 31], 28: [28, 6, 7, 31], 29: [29, 55, 21, 22],
  30: [30, 21, 22, 23, 24], 31: [31, 32, 35, 37, 38], 32: [32, 35, 36, 37, 31],
  33: [33, 5, 13, 14, 15], 34: [34, 18, 5, 13, 17], 35: [35, 13, 5, 14, 15, 18],
  36: [36, 32, 35, 31, 37], 37: [37, 31, 32, 7, 5], 38: [38, 31, 16, 26, 39],
  39: [39, 43, 47, 5, 13],
  26: [26, 24, 21, 22], 47: [47, 20, 10, 60], 51: [51, 8, 4, 60, 17],
  40: [40, 31, 32, 33, 34, 35, 36, 37, 38, 39],
  41: [41, 46, 49, 58, 50], 42: [42, 26, 43, 41, 47], 43: [43, 47, 13, 5, 42],
  44: [44, 45, 7, 47, 48], 45: [45, 19, 12, 44, 47], 46: [46, 21, 16, 41, 49],
  48: [48, 44, 45, 47, 41], 49: [49, 58, 51, 55, 41], 50: [50, 41, 42, 43, 44, 45, 46, 47, 48, 49],
  52: [52, 51, 54, 4, 8], 53: [53, 52, 54, 17, 23], 54: [54, 52, 51, 8, 59],
  55: [55, 29, 51, 54, 22], 56: [56, 16, 17, 18, 51], 57: [57, 17, 13, 14, 18],
  58: [58, 31, 7, 5, 49], 59: [59, 8, 51, 52, 54], 60: [60, 51, 52, 53, 54, 55, 56, 57, 58, 59],
};
const sourceLessonCache = new Map();
function loadSourceLesson(sourceNumber) {
  if (!sourceLessonCache.has(sourceNumber)) {
    sourceLessonCache.set(sourceNumber, JSON.parse(fs.readFileSync(path.join(contentDir, `unit${sourceNumber}.json`), 'utf8')));
  }
  return sourceLessonCache.get(sourceNumber);
}
function relatedGrammarItems(sourceNumber) {
  return (relatedGrammarSources[sourceNumber] ?? [sourceNumber]).flatMap((source) => {
    const candidateUnit = loadSourceLesson(source);
    return [
      ...sectionBlock(candidateUnit, 'Grammar — Affirmative'),
      ...sectionBlock(candidateUnit, 'Grammar — Negative & Questions'),
    ];
  });
}
function allGrammarItems() {
  return Array.from({ length: 60 }, (_unused, index) => index + 1).flatMap((source) => {
    const unit = loadSourceLesson(source);
    return [...sectionBlock(unit, 'Grammar — Affirmative'), ...sectionBlock(unit, 'Grammar — Negative & Questions')];
  });
}
function grammarStimulusKey(item) {
  const answer = grammarAnswerKey(item);
  return `${unmark(item.stimulus_en, 0).replace(/_{2,}/g, '______').replace(/\s+/g, ' ').trim().toLocaleLowerCase('en')}\u0000${answer}`;
}
const usedCourseGrammarStimuli = new Set();
function grammarContextsFor(stimulus) {
  const text = unmark(stimulus, 0).toLocaleLowerCase('en');
  const contexts = [];
  const add = (...values) => contexts.push(...values);
  if (/\b(?:camp|cycle|play|swim|dance|sing|walk|run|ride|travel|visit|go|watch|clean|cook|exercise|relax|shop|work|study|read|listen|teach|wake|sleep|eat|drink)\w*\b/.test(text)) {
    add(['with my friends', 'con mis amigos'], ['after school', 'después de clase'], ['at the weekend', 'el fin de semana'], ['with my family', 'con mi familia']);
  }
  if (/\b(?:house|home|bedroom|bathroom|kitchen|living room|flat|apartment|room)\b/.test(text)) {
    add(['in our house', 'en nuestra casa'], ['at home', 'en casa']);
  }
  if (/\b(?:student|teacher|class|school|lesson|classmate)\w*\b/.test(text)) {
    add(['at school', 'en la escuela'], ['in class', 'en clase']);
  }
  if (/\b(?:doctor|nurse|engineer|lawyer|chef|police officer|hospital|office|job|work)\w*\b/.test(text)) {
    add(['at work', 'en el trabajo'], ['in a hospital', 'en un hospital']);
  }
  if (/\b(?:happy|sad|fine|angry|hungry|thirsty|tired|cold|hot|ill|sick|ready)\b/.test(text)) {
    add(['today', 'hoy']);
  }
  return contexts;
}
function addGrammarContextVariant(item, lessonNumber, exerciseNumber) {
  const original = String(item.stimulus_en ?? '');
  const punctuation = original.match(/([.!?])\s*$/)?.[1] ?? '';
  const body = punctuation ? original.slice(0, -punctuation.length).trimEnd() : original.trimEnd();
  const contexts = grammarContextsFor(original);
  for (let offset = 0; offset < contexts.length; offset += 1) {
    const index = (lessonNumber * 7 + exerciseNumber * 11 + offset) % contexts.length;
    const [english, spanish] = contexts[index];
    if (unmark(original, 0).toLocaleLowerCase('en').includes(english.toLocaleLowerCase('en'))) continue;
    if (/\b(?:summer|winter|spring|autumn|today|every day|every morning|every evening|at night|on monday|on tuesday|on wednesday|on thursday|on friday|on saturday|on sunday|at weekends?)\b/i.test(original)
      && /\b(?:after school|at the weekend|today)\b/i.test(english)) continue;
    if (/\b(?:hospital|office|work)\b/i.test(original) && /\bat work\b/i.test(english)) continue;
    const candidate = { ...item, stimulus_en: `${body} [[${english}|${spanish}]]${punctuation}`, duplicate_stimulus_replaced: true, contextual_stimulus_replaced: true };
    const key = grammarStimulusKey(candidate);
    if (usedCourseGrammarStimuli.has(key)) continue;
    usedCourseGrammarStimuli.add(key);
    return candidate;
  }
  return null;
}
function grammarAnswerKey(item) {
  const negative = normalizeNegativeGrammarItem(item);
  if (negative) return String(negative.answer).trim().toLocaleLowerCase('en');
  const answer = item.type === 'multiple-choice'
    ? item.options?.find((option) => option.id === item.correct_answer)?.text ?? item.correct_answer
    : item.correct_answer;
  return unmark(answer, 0).trim().toLocaleLowerCase('en');
}
const originalGrammarLexicalSwaps = [
  ['London','Madrid','Londres','Madrid'], ['Spain','Italy','España','Italia'], ['France','Canada','Francia','Canadá'],
  ['Monday','Friday','lunes','viernes'], ['Tuesday','Saturday','martes','sábado'], ['summer','winter','verano','invierno'],
  ['teacher','doctor','profesor','médico'], ['doctor','nurse','médico','enfermera'], ['nurse','teacher','enfermera','profesora'],
  ['brother','sister','hermano','hermana'], ['sister','cousin','hermana','prima'], ['grandmother','grandfather','abuela','abuelo'],
  ['father','mother','padre','madre'], ['mother','aunt','madre','tía'], ['family','class','familia','clase'],
  ['car','bike','coche','bicicleta'], ['bike','bus','bicicleta','autobús'], ['bus','train','autobús','tren'],
  ['station','museum','estación','museo'], ['museum','library','museo','biblioteca'], ['bank','shop','banco','tienda'],
  ['shop','market','tienda','mercado'], ['hotel','restaurant','hotel','restaurante'], ['restaurant','café','restaurante','cafetería'],
  ['airport','station','aeropuerto','estación'], ['park','garden','parque','jardín'], ['school','hospital','escuela','hospital'],
  ['road','street','carretera','calle'], ['street','road','calle','carretera'], ['end','start','final','principio'],
  ['bedroom','bathroom','dormitorio','baño'], ['kitchen','living room','cocina','salón'], ['house','flat','casa','piso'],
  ['table','chair','mesa','silla'], ['chair','sofa','silla','sofá'], ['book','bag','libro','bolsa'],
  ['coffee','tea','café','té'], ['tea','water','té','agua'], ['rice','pasta','arroz','pasta'],
  ['apple','orange','manzana','naranja'], ['bread','cheese','pan','queso'], ['chicken','fish','pollo','pescado'],
  ['dog','cat','perro','gato'], ['cat','rabbit','gato','conejo'], ['rabbit','bird','conejo','pájaro'],
  ['eyes','hands','ojos','manos'], ['hands','feet','manos','pies'], ['hair','eyes','pelo','ojos'],
  ['blue','green','azul','verde'], ['green','brown','verde','marrón'], ['red','black','rojo','negro'],
  ['big','small','grande','pequeño'], ['small','large','pequeño','grande'], ['tall','short','alto','bajo'],
  ['happy','tired','contento','cansado'], ['tired','ready','cansado','preparado'], ['friendly','quiet','amable','tranquilo'],
  ['cheap','expensive','barato','caro'], ['clean','dirty','limpio','sucio'], ['hot','cold','caliente','frío'],
  ['cycling','swimming','montar en bicicleta','nadar'], ['football','tennis','fútbol','tenis'], ['piano','guitar','piano','guitarra'],
  ['Max','Luna','Max','Luna'], ['Luna','Bobby','Luna','Bobby'], ['Tom','Ben','Tom','Ben'], ['Anna','Maria','Anna','María'],
  ['cute','small','mono','pequeño'], ['white','brown','blanco','marrón'], ['friendly','quiet','amable','tranquilo'],
  ['called','named','llamado','llamado'], ['small','young','pequeño','joven'], ['long','short','largo','corto'],
  ['breakfast','lunch','desayuno','comida'], ['lunch','dinner','comida','cena'], ['morning','evening','mañana','tarde'],
  ['jacket','coat','chaqueta','abrigo'], ['coat','sweater','abrigo','suéter'], ['shirt','T-shirt','camisa','camiseta'],
  ['dress','skirt','vestido','falda'], ['shoes','boots','zapatos','botas'], ['today','now','hoy','ahora'],
  ['skiing','skating','esquiar','patinar'], ['skating','cycling','patinar','montar en bicicleta'], ['winter','spring','invierno','primavera'],
  ['tennis','basketball','tenis','baloncesto'], ['basketball','volleyball','baloncesto','voleibol'], ['football','basketball','fútbol','baloncesto'],
  ['well','badly','bien','mal'], ['badly','well','mal','bien'],
  ['London','Paris','Londres','París'], ['Madrid','Rome','Madrid','Roma'], ['Spain','Brazil','España','Brasil'],
];
function originalLexicalGrammarVariant(item, usedStimuli) {
  const answer = grammarAnswerKey(item);
  const source = String(item.stimulus_en ?? '');
  const replacementAt = (text, swap) => {
    const [english, replacement, _spanish, translatedReplacement] = swap;
    if (english.toLocaleLowerCase('en') === answer || replacement.toLocaleLowerCase('en') === answer) return null;
    const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\[\\[${escaped}\\|[^\\]]+\\]\\]`, 'i');
    if (!pattern.test(text)) return null;
    return text.replace(pattern, `[[${replacement}|${translatedReplacement}]]`);
  };
  for (const [english, replacement, spanish, translatedReplacement] of originalGrammarLexicalSwaps) {
    if (english.toLocaleLowerCase('en') === answer || replacement.toLocaleLowerCase('en') === answer) continue;
    const escaped = english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\[\\[${escaped}\\|[^\\]]+\\]\\]`, 'i');
    if (!pattern.test(source)) continue;
    const candidate = { ...item, stimulus_en: source.replace(pattern, `[[${replacement}|${translatedReplacement}]]`), duplicate_stimulus_replaced: true };
    const key = grammarStimulusKey(candidate);
    if (!usedStimuli.has(key)) {
      usedStimuli.add(key);
      return candidate;
    }
    // Try the inverse variation too; it is useful when both words occur across the source bank.
    const inverseEscaped = replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const inversePattern = new RegExp(`\\[\\[${inverseEscaped}\\|[^\\]]+\\]\\]`, 'i');
    if (inversePattern.test(source) && english.toLocaleLowerCase('en') !== answer) {
      const inverse = { ...item, stimulus_en: source.replace(inversePattern, `[[${english}|${spanish}]]`), duplicate_stimulus_replaced: true };
      const inverseKey = grammarStimulusKey(inverse);
      if (!usedStimuli.has(inverseKey)) {
        usedStimuli.add(inverseKey);
        return inverse;
      }
    }
  }
  for (let first = 0; first < originalGrammarLexicalSwaps.length; first += 1) {
    // Keep city/country and date pairs separate so a name change cannot create an inconsistent place or date.
    if (first < 6) continue;
    const once = replacementAt(source, originalGrammarLexicalSwaps[first]);
    if (!once) continue;
    for (let second = first + 1; second < originalGrammarLexicalSwaps.length; second += 1) {
      if (second < 6) continue;
      const twice = replacementAt(once, originalGrammarLexicalSwaps[second]);
      if (!twice) continue;
      const candidate = { ...item, stimulus_en: twice, duplicate_stimulus_replaced: true };
      const key = grammarStimulusKey(candidate);
      if (!usedStimuli.has(key)) {
        usedStimuli.add(key);
        return candidate;
      }
    }
  }
  return null;
}
function naturalGrammarVariant(item, lessonNumber, exerciseNumber, usedStimuli) {
  if (!['multiple-choice', 'fill-blank'].includes(item.type)) return null;
  const markedSubject = String(item.stimulus_en ?? '').match(/^\s*\[\[([^|]+)\|([^\]]+)\]\]/);
  if (markedSubject) {
    const firstSubject = markedSubject[1].toLocaleLowerCase('en');
    const tail = String(item.stimulus_en).slice(markedSubject[0].length);
    const finiteVerb = unmark(tail, 0).match(/^\s*(is|are|am|has|have|does|do|likes|like|works|work|lives|live|goes|go|plays|play|can)\b/i)?.[1]?.toLocaleLowerCase('en');
    const singularThirdPerson = ['is','has','does','likes','works','lives','goes','plays'].includes(finiteVerb);
    const sameAgreementSubjects = singularThirdPerson
      ? ({ she: [['He','Él'],['Anna','Anna'],['My sister','Mi hermana']], he: [['She','Ella'],['Tom','Tom'],['My brother','Mi hermano']], my: [['His','Su'],['Her','Su'],['Our','Nuestro']], his: [['Her','Su'],['My','Mi']], her: [['His','Su'],['My','Mi']] }[firstSubject] ?? [])
      : (['am','are','have','do','like','work','live','go','play','can'].includes(finiteVerb)
        ? ({ i: [['We','Nosotros'],['You','Tú']], we: [['They','Ellos'],['You','Vosotros']], they: [['We','Nosotros'],['You','Vosotros']], you: [['We','Nosotros'],['They','Ellos']], my: [['Our','Nuestro']], our: [['My','Mi']] }[firstSubject] ?? [])
        : []);
    for (const [english, spanish] of sameAgreementSubjects) {
      const variant = { ...item, stimulus_en: String(item.stimulus_en).replace(markedSubject[0], `[[${english}|${spanish}]]`), duplicate_stimulus_replaced: true };
      const key = grammarStimulusKey(variant);
      if (!usedStimuli.has(key)) return variant;
    }
  }
  const lexicalVariant = originalLexicalGrammarVariant(item, usedStimuli);
  if (lexicalVariant) return lexicalVariant;
  if (item.type === 'fill-blank') {
    const answer = unmark(item.correct_answer, 0).toLocaleLowerCase('en');
    if (/street|road|traffic lights/.test(answer)) {
      const directionVariants = [
        ['Go straight to the ______.', 'Sigue recto hasta los ______.'],
        ['Turn left at the ______.', 'Gira a la izquierda en los ______.'],
        ['The bus stop is next to the ______.', 'La parada de autobús está junto a los ______.'],
      ];
      for (const [english, spanish] of directionVariants) {
        const variant = { ...item, correct_answer: 'traffic lights', stimulus_en: `[[${english}|${spanish}]]`, duplicate_stimulus_replaced: true };
        if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
      }
    }
    const grammarVariants = {
      am: [['I ______ from Madrid.', 'Yo soy de Madrid.'], ['I ______ at home today.', 'Estoy en casa hoy.'], ['I ______ a student.', 'Soy estudiante.']],
      was: [['I ______ at home all day yesterday.', 'Estuve en casa todo el día ayer.'], ['She ______ in Rome last summer.', 'Estuvo en Roma el verano pasado.'], ['The hotel ______ very quiet last night.', 'El hotel estuvo muy tranquilo anoche.'], ['It ______ very windy yesterday.', 'Ayer hizo mucho viento.'], ['The weather ______ sunny last weekend.', 'El tiempo estuvo soleado el fin de semana pasado.'], ['It ______ cold in the mountains last night.', 'Anoche hizo frío en las montañas.']],
      were: [['We ______ on holiday in June.', 'Estuvimos de vacaciones en junio.'], ['They ______ at the station at eight.', 'Estuvieron en la estación a las ocho.'], ['You ______ very early this morning.', 'Llegaste muy temprano esta mañana.']],
      is: [['The bus ______ late.', 'El autobús llega tarde.'], ['My sister ______ tall.', 'Mi hermana es alta.'], ['The shop ______ open.', 'La tienda está abierta.'], ['It ______ a sunny day.', 'Hace un día soleado.']],
      are: [['The shops ______ open.', 'Las tiendas están abiertas.'], ['You ______ my friend.', 'Tú eres mi amigo.'], ['The children ______ at school.', 'Los niños están en la escuela.'], ['We ______ ready.', 'Estamos preparados.']],
      have: [['I ______ two cousins.', 'Tengo dos primos.'], ['We ______ a small garden.', 'Tenemos un jardín pequeño.'], ['They ______ lunch at one.', 'Comen a la una.'], ['Could I ______ some water, please?', '¿Podría tomar un poco de agua, por favor?'], ['Can we ______ the menu, please?', '¿Podemos ver el menú, por favor?']],
      departs: [['The 10:30 train ______ from platform five.', 'El tren de las 10:30 sale del andén cinco.'], ['Our flight ______ from gate 12.', 'Nuestro vuelo sale de la puerta 12.'], ['The ferry ______ at six in the morning.', 'El ferry sale a las seis de la mañana.']],
      arrives: [['The bus ______ at the station at half past ten.', 'El autobús llega a la estación a las diez y media.'], ['Our flight ______ in Madrid at noon.', 'Nuestro vuelo llega a Madrid al mediodía.'], ['She ______ at work before nine.', 'Ella llega al trabajo antes de las nueve.']],
      has: [['My brother ______ a bike.', 'Mi hermano tiene una bicicleta.'], ['Anna ______ two cats.', 'Anna tiene dos gatos.'], ['The hotel ______ a swimming pool.', 'El hotel tiene una piscina.']],
      plays: [['She ______ football after school.', 'Ella ______ al fútbol después de clase.'], ['My brother ______ the guitar in a band.', 'Mi hermano ______ la guitarra en un grupo.'], ['Anna ______ tennis on Saturdays.', 'Anna ______ al tenis los sábados.'], ['He ______ basketball with his friends.', 'Él ______ al baloncesto con sus amigos.']],
      watch: [['Do you ______ films at the weekend?', '¿Ves películas el fin de semana?'], ['I ______ the news after dinner.', 'Veo las noticias después de cenar.'], ['They ______ football on TV.', 'Ven el fútbol en la televisión.'], ['She ______ a film with her family.', 'Ve una película con su familia.']],
      do: [['______ you speak English?', '¿Hablas inglés?'], ['______ they live near here?', '¿Viven cerca de aquí?'], ['______ we need a ticket?', '¿Necesitamos un billete?']],
      ask: [['May I ______ a question?', '¿Puedo hacer una pregunta?'], ['Can I ______ you for directions?', '¿Puedo preguntarte cómo se va?'], ['Please ______ the teacher for help.', 'Pide ayuda al profesor, por favor.']],
      does: [['______ your sister play tennis?', '¿Tu hermana juega al tenis?'], ['______ he work here?', '¿Él trabaja aquí?'], ['______ the bus stop here?', '¿El autobús para aquí?']],
      "don't": [['I ______ eat meat.', 'No como carne.'], ["We ______ work on Sundays.", 'No trabajamos los domingos.'], ["They ______ live in London.", 'No viven en Londres.']],
      "doesn't": [['He ______ like coffee.', 'A él no le gusta el café.'], ["My sister ______ work on Saturdays.", 'Mi hermana no trabaja los sábados.'], ["The shop ______ open early.", 'La tienda no abre temprano.']],
      "shouldn't": [['You ______ leave your passport in your hotel room.', 'No deberías dejar el pasaporte en la habitación del hotel.'], ['Passengers ______ run inside the airport.', 'Los pasajeros no deberían correr dentro del aeropuerto.'], ['We ______ travel without checking the train times.', 'No deberíamos viajar sin comprobar los horarios del tren.']],
      can: [['I ______ swim.', 'Sé nadar.'], ['She ______ play the piano.', 'Ella sabe tocar el piano.'], ['We ______ take the bus.', 'Podemos coger el autobús.']],
      may: [['______ I open the window, please?', '¿Puedo abrir la ventana, por favor?'], ['______ we sit here?', '¿Podemos sentarnos aquí?'], ['______ I borrow your pen?', '¿Puedo tomar prestado tu bolígrafo?']],
      must: [['Passengers ______ show their tickets before boarding.', 'Los pasajeros deben mostrar sus billetes antes de embarcar.'], ['You ______ wear a seat belt in the car.', 'Debes llevar cinturón de seguridad en el coche.'], ['We ______ be at the airport by six.', 'Debemos estar en el aeropuerto a las seis.']],
      'need to': [['I ______ buy a ticket before I get on the train.', 'Tengo que comprar un billete antes de subir al tren.'], ['She ______ check the hotel address.', 'Tiene que comprobar la dirección del hotel.'], ['We ______ leave early to catch the bus.', 'Tenemos que salir pronto para coger el autobús.']],
      need: [['Do you ______ a visa to visit this country?', '¿Necesitas visado para visitar este país?'], ['Does he ______ a map for the walk?', '¿Necesita un mapa para el paseo?'], ['They ______ more time to pack.', 'Necesitan más tiempo para hacer la maleta.']],
      'do need to': [['What ______ we take on the train?', '¿Qué necesitamos llevar en el tren?'], ['When ______ you leave for the airport?', '¿Cuándo necesitas salir hacia el aeropuerto?'], ['Why ______ they book a room now?', '¿Por qué necesitan reservar una habitación ahora?']],
      sit: [['Please ______ next to your partner.', 'Siéntate junto a tu compañero, por favor.'], ['Can we ______ near the window?', '¿Podemos sentarnos cerca de la ventana?'], ['Do you mind if I ______ here?', '¿Te importa si me siento aquí?']],
      "can't": [['He ______ drive a car.', 'Él no sabe conducir.'], ["I ______ come today.", 'No puedo venir hoy.'], ['They ______ speak French.', 'No saben hablar francés.']],
      'listening to': [['I enjoy ______ music while I cook.', 'Disfruto ______ música mientras cocino.'], ['She loves ______ the radio in the morning.', 'Le encanta ______ la radio por la mañana.'], ['We spend the evening ______ our favourite songs.', 'Pasamos la tarde ______ nuestras canciones favoritas.']],
      meet: [['Let us ______ at the café after class.', 'Quedemos en la cafetería después de clase.'], ['We can ______ our friends at the station.', 'Podemos quedar con nuestros amigos en la estación.']],
      in: [['The keys are ______ my bag.', 'Las llaves están en mi bolso.'], ['We live ______ Spain.', 'Vivimos en España.'], ['The milk is ______ the fridge.', 'La leche está en la nevera.']],
      on: [['The book is ______ the table.', 'El libro está sobre la mesa.'], ['We meet ______ Monday.', 'Nos vemos el lunes.'], ['There is a picture ______ the wall.', 'Hay un cuadro en la pared.']],
      at: [['The lesson starts ______ nine.', 'La clase empieza a las nueve.'], ['She is ______ the bus stop.', 'Ella está en la parada del autobús.'], ['I work ______ a school.', 'Trabajo en una escuela.']],
      the: [['She plays ______ piano after school.', 'Ella toca el piano después de clase.'], ['We go to ______ park on Sundays.', 'Vamos al parque los domingos.'], ['He reads ______ newspaper in the morning.', 'Él lee el periódico por la mañana.']],
      "there is": [['______ a bank near here.', 'Hay un banco cerca de aquí.'], ['______ one bedroom in the flat.', 'Hay un dormitorio en el piso.']],
      "there are": [['______ two parks in my town.', 'Hay dos parques en mi ciudad.'], ['______ four chairs in the kitchen.', 'Hay cuatro sillas en la cocina.']],
      turn: [['______ right at the next street.', '______ a la derecha en la siguiente calle.'], ['______ left at the corner.', '______ a la izquierda en la esquina.'], ['______ right after the bank.', '______ a la derecha después del banco.'], ['Is it OK if I ______ the radio on?', '¿Está bien si enciendo la radio?'], ['Can you ______ the television off, please?', '¿Puedes apagar la televisión, por favor?']],
      visit: [['We ______ our grandparents at Christmas.', 'Visitamos a nuestros abuelos en Navidad.'], ['I want to ______ the museum this afternoon.', 'Quiero visitar el museo esta tarde.'], ['They ______ a different city every year.', 'Visitan una ciudad diferente cada año.']],
      take: [['We ______ the number 12 bus to the centre.', 'Cogemos el autobús número 12 hasta el centro.'], ['Please ______ a seat near the window.', 'Toma un asiento junto a la ventana, por favor.'], ['I ______ my passport out of my bag.', 'Saco el pasaporte de la bolsa.']],
    sleeps: [['The cat ______ on the sofa.', 'El gato ______ en el sofá.'], ['My dog ______ in its bed.', 'Mi perro ______ en su cama.'], ['The baby ______ for ten hours.', 'El bebé ______ durante diez horas.']],
    finger: [['Can you touch your nose with one ______?', '¿Puedes tocarte la nariz con un ______?'], ['I point with my ______.', 'Señalo con el ______.'], ['She has a ring on one ______.', 'Lleva un anillo en un ______.'], ['He hurt his ______ playing basketball.', 'Se hizo daño en un ______ jugando al baloncesto.']],
    live: [['Lions ______ in Africa.', 'Los leones ______ en África.'], ['My grandparents ______ in Madrid.', 'Mis abuelos ______ en Madrid.'], ['We ______ near the city centre.', 'Vivimos cerca del centro.']],
    friendly: [['My cat is ______.', 'Mi gato es ______.'], ['Our dog is ______.', 'Nuestro perro es ______.'], ['Her rabbit is ______.', 'Su conejo es ______.']],
    dangerous: [['A tiger is ______.', 'Un tigre es ______.'], ['Some snakes are ______.', 'Algunas serpientes son ______.'], ['This dog is not ______.', 'Este perro no es ______.']],
    rabbit: [['I have a pet ______.', 'Tengo un ______ de mascota.'], ['The ______ is white and small.', 'El ______ es blanco y pequeño.'], ['My friend has a ______ called Max.', 'Mi amigo tiene un ______ llamado Max.']],
    dog: [['The ______ is in the garden.', 'El ______ está en el jardín.'], ['My family has a ______.', 'Mi familia tiene un ______.'], ['The ______ likes playing with a ball.', 'Al ______ le gusta jugar con una pelota.']],
    cat: [['The ______ is asleep on the sofa.', 'El ______ está dormido en el sofá.'], ['My neighbour has a ______.', 'Mi vecino tiene un ______.'], ['The ______ is black and white.', 'El ______ es blanco y negro.']],
      friendly: [['My cat is ______.', 'Mi gato es ______.'], ['Our dog is ______.', 'Nuestro perro es ______.'], ['Her rabbit is ______.', 'Su conejo es ______.'], ['The horse is ______.', 'El caballo es ______.']],
      'most famous': [['The Eiffel Tower is the ______ landmark in Paris.', 'La Torre Eiffel es el monumento más famoso de París.'], ['This is the ______ museum in the city.', 'Este es el museo más famoso de la ciudad.'], ['The old bridge is the ______ place in town.', 'El puente antiguo es el lugar más famoso del pueblo.'], ['What is the ______ painting in the gallery?', '¿Cuál es el cuadro más famoso de la galería?'], ['That square is the ______ place in the village.', 'Esa plaza es el lugar más famoso del pueblo.'], ['She visited the ______ church in the region.', 'Visitó la iglesia más famosa de la región.']],
      oldest: [['This is the ______ building in our town.', 'Este es el edificio más antiguo de nuestro pueblo.'], ['My grandmother is the ______ person in our family.', 'Mi abuela es la persona más mayor de nuestra familia.'], ['That is the ______ hotel in the city.', 'Ese es el hotel más antiguo de la ciudad.']],
      largest: [['This is the ______ park in the city.', 'Este es el parque más grande de la ciudad.'], ['The blue whale is the ______ animal in the world.', 'La ballena azul es el animal más grande del mundo.'], ['That is the ______ room in the house.', 'Esa es la habitación más grande de la casa.']],
    best: [['The train is the ______ way to travel to the city centre.', 'El tren es la mejor manera de llegar al centro.'], ['For me, spring is the ______ time to visit the island.', 'Para mí, la primavera es la mejor época para visitar la isla.'], ['This map is the ______ one for walking around town.', 'Este mapa es el mejor para pasear por la ciudad.']],
    'most visited': [['The Colosseum is one of the ______ places in Rome.', 'El Coliseo es uno de los lugares más visitados de Roma.'], ['This museum is the ______ attraction in the town.', 'Este museo es la atracción más visitada del pueblo.'], ['The old castle is the ______ site on the island.', 'El castillo antiguo es el lugar más visitado de la isla.']],
      dangerous: [['A tiger is ______.', 'Un tigre es ______.'], ['Some snakes are ______.', 'Algunas serpientes son ______.'], ['This dog is not ______.', 'Este perro no es ______.']],
      rabbit: [['I have a pet ______.', 'Tengo un ______ de mascota.'], ['The ______ is white and small.', 'El ______ es blanco y pequeño.'], ['My friend has a ______ called Max.', 'Mi amigo tiene un ______ llamado Max.']],
      sleeps: [['The cat ______ on the sofa.', 'El gato ______ en el sofá.'], ['My dog ______ in its bed.', 'Mi perro ______ en su cama.'], ['The baby ______ for ten hours.', 'El bebé ______ durante diez horas.']],
      stay: [['We ______ in a small hotel near the station.', 'Nos alojamos en un hotel pequeño cerca de la estación.'], ['How long does she ______ in London?', '¿Cuánto tiempo se queda en Londres?'], ['They ______ with friends when they visit Madrid.', 'Se alojan con amigos cuando visitan Madrid.']],
      two: [['A person has ______ hands.', 'Una persona tiene ______ manos.'], ['A bicycle has ______ wheels.', 'Una bicicleta tiene ______ ruedas.'], ['We have ______ eyes.', 'Tenemos ______ ojos.'], ['There are ______ shoes by the door.', 'Hay ______ zapatos junto a la puerta.']],
      many: [['How ______ apples do we need?', '¿Cuántas manzanas necesitamos?'], ['There are ______ people in the market.', 'Hay mucha gente en el mercado.'], ['How ______ eggs are in the box?', '¿Cuántos huevos hay en la caja?']],
      much: [['How ______ is this bottle of water?', '¿Cuánto cuesta esta botella de agua?'], ['How ______ milk do we need?', '¿Cuánta leche necesitamos?'], ['How ______ is a kilo of apples?', '¿Cuánto cuesta un kilo de manzanas?']],
      some: [['We need ______ rice for dinner.', 'Necesitamos arroz para cenar.'], ['There is ______ cheese in the fridge.', 'Hay queso en la nevera.'], ['I would like ______ water, please.', 'Quisiera agua, por favor.']],
      any: [['There are not ______ pears in the bowl.', 'No hay peras en el cuenco.'], ['Do you have ______ coffee at home?', '¿Tienes café en casa?'], ['There is not ______ bread left.', 'No queda pan.']],
      number: [['The milk is in aisle ______ four.', 'La leche está en el pasillo número cuatro.'], ['Go to till ______ two to pay.', 'Ve a la caja número dos para pagar.'], ['The apples are in box ______ five.', 'Las manzanas están en la caja número cinco.']],
      this: [['The apples are on offer ______ week.', 'Las manzanas están de oferta esta semana.'], ['We have fresh bread ______ morning.', 'Tenemos pan fresco esta mañana.'], ['The shop is open late ______ Saturday.', 'La tienda abre hasta tarde este sábado.']],
      vegetables: [['We buy fresh ______ at the market.', 'Compramos verduras frescas en el mercado.'], ['Carrots and onions are ______.', 'Las zanahorias y las cebollas son verduras.'], ['Wash the ______ before you make the soup.', 'Lava las verduras antes de hacer la sopa.']],
    loyalty: [['Do you have a ______ card for this shop?', '¿Tienes una tarjeta de fidelidad para esta tienda?'], ['She uses her ______ card at the supermarket.', 'Usa su tarjeta de fidelidad en el supermercado.'], ['Ask the cashier for a ______ card.', 'Pide una tarjeta de fidelidad en la caja.']],
      neck: [['A giraffe has a long ______.', 'Una jirafa tiene un ______ largo.'], ['The giraffe has a very long ______.', 'La jirafa tiene un ______ muy largo.'], ['He has a scarf around his ______.', 'Lleva una bufanda alrededor del ______.']],
      back: [['My ______ hurts after football.', 'Me duele la ______ después del fútbol.'], ['Her ______ hurts today.', 'Le duele la ______ hoy.'], ['I have pain in my ______.', 'Tengo dolor en la ______.'], ['He carries a heavy bag on his ______.', 'Lleva una bolsa pesada en la ______.']],
      breakfast: [['We have ______ at the hotel at seven.', 'Desayunamos en el hotel a las siete.'], ['I eat eggs for ______ on Sundays.', 'Como huevos en el desayuno los domingos.'], ['She makes ______ before work.', 'Ella prepara el desayuno antes del trabajo.']],
      book: [['We ______ a room at a small hotel.', 'Reservamos una habitación en un hotel pequeño.'], ['She wants to ______ a table for dinner.', 'Quiere reservar una mesa para cenar.'], ['I ______ my train tickets online.', 'Reservo mis billetes de tren por internet.']],
      season: [['Winter is my favourite ______ because I like snow.', 'El invierno es mi estación favorita porque me gusta la nieve.'], ['Which ______ do you like best, spring or summer?', '¿Qué estación te gusta más, la primavera o el verano?'], ['Autumn is a beautiful ______ in this country.', 'El otoño es una estación bonita en este país.']],
      salt: [['Please add a little ______ to the soup.', 'Añade un poco de sal a la sopa, por favor.'], ['This bread has no ______ in it.', 'Este pan no tiene sal.'], ['There is some ______ on the table.', 'Hay sal en la mesa.']],
      fingers: [['I have ten ______.', 'Tengo diez ______.'], ['Each hand has five ______.', 'Cada mano tiene cinco ______.'], ['The baby has small ______.', 'El bebé tiene ______ pequeños.']],
      dog: [['The ______ is in the garden.', 'El ______ está en el jardín.'], ['My family has a ______.', 'Mi familia tiene un ______.'], ['The ______ likes playing with a ball.', 'Al ______ le gusta jugar con una pelota.']],
      cat: [['The ______ is asleep on the sofa.', 'El ______ está dormido en el sofá.'], ['My neighbour has a ______.', 'Mi vecino tiene un ______.'], ['The ______ is black and white.', 'El ______ es blanco y negro.']],
      far: [['The station is ______ from here.', 'La estación está ______ de aquí.'], ['Is the park ______ from your house?', '¿Está el parque ______ de tu casa?'], ['The hotel is ______ from the airport.', 'El hotel está ______ del aeropuerto.'], ['Is the museum ______ from the hotel?', '¿Está el museo ______ del hotel?'], ['The beach is ______ from the city centre.', 'La playa está ______ del centro.'], ['Is the school ______ from your home?', '¿Está la escuela ______ de tu casa?'], ['The supermarket is ______ from the station.', 'El supermercado está ______ de la estación.'], ['Is the bus stop ______ from here?', '¿Está la parada de autobús ______ de aquí?']],
      right: [['Turn ______ at the next street.', 'Gira a la ______ en la siguiente calle.'], ['The bank is on the ______.', 'El banco está a la ______.'], ['Go ______ at the traffic lights.', 'Ve a la ______ en el semáforo.']],
      left: [['Turn ______ at the next street.', 'Gira a la ______ en la siguiente calle.'], ['The café is on the ______.', 'La cafetería está a la ______.'], ['Go ______ at the traffic lights.', 'Ve a la ______ en el semáforo.']],
      go: [['______ straight for two minutes.', 'Sigue recto durante dos minutos.'], ['______ past the bank and turn left.', 'Pasa el banco y gira a la izquierda.'], ['______ along this road.', 'Sigue por esta calle.']],
      going: [['Are they ______ to the museum tomorrow?', '¿Van al museo mañana?'], ['We are ______ to visit my aunt on Sunday.', 'Vamos a visitar a mi tía el domingo.'], ['Is she ______ to travel by train?', '¿Va a viajar en tren?']],
      wearing: [['What is he ______ today?', '¿Qué lleva él hoy?'], ['What is she ______ to the party?', '¿Qué lleva ella a la fiesta?'], ['What are they ______ for the trip?', '¿Qué llevan ellos para el viaje?'], ['What are you ______ to school?', '¿Qué llevas a la escuela?']],
    }[answer];
    for (const [english, spanish] of grammarVariants ?? []) {
      const variant = { ...item, stimulus_en: `[[${english}|${spanish}]]`, duplicate_stimulus_replaced: true };
      if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
    }
    if (answer === 'a' || answer === 'an') {
      const variants = answer === 'an'
        ? [['She is an artist.', 'Ella es una artista.'], ['This is an apple.', 'Esto es una manzana.'], ['I have an old book.', 'Tengo un libro viejo.'], ['He eats an orange.', 'Él come una naranja.']]
        : [['He is a teacher.', 'Él es profesor.'], ['This is a new house.', 'Esta es una casa nueva.'], ['I have a blue bag.', 'Tengo una bolsa azul.'], ['She has a small dog.', 'Ella tiene un perro pequeño.']];
      const start = (lessonNumber * 7 + exerciseNumber * 3) % variants.length;
      for (let offset = 0; offset < variants.length; offset += 1) {
        const [english, spanish] = variants[(start + offset) % variants.length];
        const variant = { ...item, stimulus_en: `[[${english}|${spanish}]]`, duplicate_stimulus_replaced: true };
        if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
      }
    }
    const colorVariants = { blue: ['brown', 'green', 'black'], brown: ['blue', 'green', 'black'], green: ['blue', 'brown', 'black'], black: ['blue', 'brown', 'green'] };
    for (const next of colorVariants[answer] ?? []) {
      const variant = {
        ...item,
        correct_answer: next,
        stimulus_en: item.stimulus_en.replace(new RegExp(`\\b${answer}\\b`, 'i'), `[[${next}|${next}]]`),
        duplicate_stimulus_replaced: true,
      };
      if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
    }
    return null;
  }
  const correct = item.options?.find((option) => option.id === item.correct_answer);
  if (!correct) return null;
  const answer = unmark(correct.text, 0).toLocaleLowerCase('en');
  const contextualVariants = {
    'do need to': [
      ['I ______ pack my passport for the trip.', 'Tengo que meter el pasaporte en la maleta para el viaje.'],
      ['We ______ buy our train tickets today.', 'Tenemos que comprar hoy los billetes de tren.'],
      ['She ______ check the hotel booking.', 'Tiene que revisar la reserva del hotel.'],
    ],
    'need to': [
      ['We ______ book the hotel before Friday.', 'Tenemos que reservar el hotel antes del viernes.'],
      ['I ______ take my passport to the airport.', 'Tengo que llevar el pasaporte al aeropuerto.'],
      ['They ______ leave early to catch the train.', 'Tienen que salir pronto para coger el tren.'],
    ],
    meet: [
      ["Let's ______ at the café after class.", 'Quedemos en la cafetería después de clase.'],
      ["Let's ______ our friends at the station.", 'Quedemos con nuestros amigos en la estación.'],
      ["Let's ______ Anna outside the cinema.", 'Quedemos con Anna fuera del cine.'],
    ],
    ask: [
      ['May I ______ you a question about the lesson?', '¿Puedo hacerte una pregunta sobre la clase?'],
      ['Can I ______ the teacher for help?', '¿Puedo pedir ayuda al profesor?'],
      ['Please ______ your partner the time.', 'Pregunta la hora a tu compañero, por favor.'],
    ],
    may: [
      ['______ I leave my bag here?', '¿Puedo dejar aquí mi bolsa?'],
      ['______ I have a glass of water?', '¿Puedo tomar un vaso de agua?'],
      ['______ we start the exercise now?', '¿Podemos empezar el ejercicio ahora?'],
    ],
    have: [
      ['Could we ______ a table for two, please?', '¿Podríamos tener una mesa para dos, por favor?'],
      ['Can I ______ the bill, please?', '¿Puedo pedir la cuenta, por favor?'],
      ['May I ______ a glass of water?', '¿Puedo tomar un vaso de agua?'],
    ],
    turn: [
      ['Please ______ your phone off in the cinema.', 'Apaga el móvil en el cine, por favor.'],
      ['Can you ______ the music down, please?', '¿Puedes bajar la música, por favor?'],
      ['Remember to ______ the lights off before you leave.', 'Recuerda apagar las luces antes de salir.'],
    ],
    going: [
      ['Where are you ______ on holiday this year?', '¿Adónde vas de vacaciones este año?'],
      ['Is your family ______ to the mountains in winter?', '¿Va tu familia a la montaña en invierno?'],
      ['They are ______ to London by train tomorrow.', 'Mañana van a Londres en tren.'],
    ],
    "shouldn't": [
      ["You ______ stay up all night before an early flight.", 'No deberías quedarte despierto toda la noche antes de un vuelo temprano.'],
      ["Passengers ______ leave their bags unattended at the airport.", 'Los pasajeros no deberían dejar su equipaje sin vigilancia en el aeropuerto.'],
      ["You ______ forget to check your departure time.", 'No deberías olvidar comprobar la hora de salida.'],
    ],
    must: [
      ['Travellers ______ arrive at the gate before it closes.', 'Los viajeros deben llegar a la puerta antes de que cierre.'],
      ['You ______ keep your passport in a safe place.', 'Debes guardar el pasaporte en un lugar seguro.'],
      ['We ______ buy our train tickets before we travel.', 'Debemos comprar los billetes de tren antes de viajar.'],
      ['Passengers ______ show their boarding passes at the gate.', 'Los pasajeros deben mostrar la tarjeta de embarque en la puerta.'],
      ['You ______ keep your ticket until the end of the journey.', 'Debes guardar el billete hasta el final del viaje.'],
      ['Visitors ______ follow the signs inside the museum.', 'Los visitantes deben seguir las señales dentro del museo.'],
    ],
    should: [
      ['You ______ check the departure board when you arrive.', 'Deberías consultar el panel de salidas cuando llegues.'],
      ['Passengers ______ keep their boarding passes ready.', 'Los pasajeros deberían tener preparada la tarjeta de embarque.'],
      ['We ______ book a hotel before the trip.', 'Deberíamos reservar un hotel antes del viaje.'],
    ],
    departs: [
      ['Our train ______ from the city station at 8:15.', 'Nuestro tren sale de la estación central a las 8:15.'],
      ['The bus ______ every thirty minutes.', 'El autobús sale cada treinta minutos.'],
      ['What time ______ the ferry leave?', '¿A qué hora sale el ferry?'],
    ],
    take: [
      ['We need to ______ a taxi from the station to the hotel.', 'Tenemos que coger un taxi desde la estación hasta el hotel.'],
      ['You can ______ the next train to Oxford.', 'Puedes coger el próximo tren a Oxford.'],
      ['They ______ a bus to the airport every morning.', 'Cogen un autobús al aeropuerto todas las mañanas.'],
    ],
    explore: [
      ['We want to ______ the old town on foot.', 'Queremos explorar el casco antiguo a pie.'],
      ['They like to ______ a new city by bus.', 'Les gusta explorar una ciudad nueva en autobús.'],
      ['She plans to ______ the market this morning.', 'Tiene pensado explorar el mercado esta mañana.'],
    ],
    arrives: [
      ['What time ______ the bus at the hotel?', '¿A qué hora llega el autobús al hotel?'],
      ['Our ferry ______ in Dover before lunch.', 'Nuestro ferry llega a Dover antes de comer.'],
      ['The plane ______ at the airport at 7 p.m.', 'El avión llega al aeropuerto a las siete de la tarde.'],
    ],
    book: [
      ['They want to ______ a room near the station.', 'Quieren reservar una habitación cerca de la estación.'],
      ['Can I ______ two seats on the morning train?', '¿Puedo reservar dos asientos en el tren de la mañana?'],
      ['We ______ our flights online last week.', 'Reservamos los vuelos por internet la semana pasada.'],
    ],
    season: [
      ['Which ______ is warmest in your country?', '¿Qué estación es la más cálida en tu país?'],
      ['We often go hiking in this ______.', 'A menudo vamos de excursión en esta estación.'],
      ['The days are short in this ______.', 'Los días son cortos en esta estación.'],
    ],
    in: [
      ['We visit our family ______ summer.', 'Visitamos a nuestra familia en verano.'],
      ['The days are very short ______ winter.', 'Los días son muy cortos en invierno.'],
      ['She goes swimming ______ August.', 'Va a nadar en agosto.'],
    ],
    visit: [
      ['Do you want to ______ the old castle today?', '¿Quieres visitar el castillo antiguo hoy?'],
      ['We ______ our friends in the next town every month.', 'Visitamos a nuestros amigos del pueblo de al lado cada mes.'],
      ['She plans to ______ the art gallery tomorrow.', 'Tiene pensado visitar la galería de arte mañana.'],
    ],
    stay: [
      ['Where do you ______ when you visit Paris?', '¿Dónde te alojas cuando visitas París?'],
      ['We ______ in a family hotel near the beach.', 'Nos alojamos en un hotel familiar cerca de la playa.'],
      ['How long does Tom ______ in Rome?', '¿Cuánto tiempo se queda Tom en Roma?'],
    ],
    'is sunny': [
      ['It ______ and warm in Barcelona this afternoon.', 'Esta tarde hace sol y calor en Barcelona.'],
      ['It ______ in the south of Spain in July.', 'En el sur de España hace sol en julio.'],
      ['It ______ today, so we can eat outside.', 'Hoy hace sol, así que podemos comer fuera.'],
    ],
    is: [
      ['The weather ______ cold and wet today.', 'Hoy hace frío y llueve.'],
      ['The sky ______ grey this morning.', 'El cielo está gris esta mañana.'],
      ['The temperature ______ ten degrees now.', 'La temperatura está ahora a diez grados.'],
    ],
    high: [
      ['This mountain is very ______.', 'Esta montaña es muy alta.'],
      ['The temperature is ______ today: thirty degrees.', 'La temperatura está alta hoy: treinta grados.'],
      ['Our hotel is on a ______ hill above the town.', 'Nuestro hotel está en una colina alta sobre el pueblo.'],
    ],
    spend: [
      ['How much do you ______ on lunch each day?', '¿Cuánto gastas en la comida cada día?'],
      ['We ______ very little on coffee at home.', 'Gastamos muy poco en café en casa.'],
      ['She does not ______ much money on clothes.', 'No gasta mucho dinero en ropa.'],
    ],
    was: [
      ['The beach ______ quiet early in the morning.', 'La playa estaba tranquila temprano por la mañana.'],
      ['Our room ______ small but comfortable.', 'Nuestra habitación era pequeña pero cómoda.'],
      ['The food ______ delicious at that restaurant.', 'La comida estaba deliciosa en ese restaurante.'],
      ['We ______ on the island for a week last year.', 'Estuvimos en la isla una semana el año pasado.'],
      ['My parents ______ in a hotel near the sea.', 'Mis padres estuvieron en un hotel cerca del mar.'],
      ['The trip ______ very exciting.', 'El viaje fue muy emocionante.'],
    ],
    were: [
      ['The streets ______ quiet after the festival.', 'Las calles estaban tranquilas después del festival.'],
      ['Our friends ______ at the beach all afternoon.', 'Nuestros amigos estuvieron en la playa toda la tarde.'],
      ['The museums ______ closed on Monday.', 'Los museos estaban cerrados el lunes.'],
    ],
    towels: [
      ['Could we have two clean ______ for the bathroom?', '¿Podríamos tener dos toallas limpias para el baño?'],
      ['There are fresh ______ in the wardrobe.', 'Hay toallas limpias en el armario.'],
      ['The hotel gives guests clean ______ every day.', 'El hotel da toallas limpias a los huéspedes todos los días.'],
    ],
    breakfast: [
      ['Does the hotel serve ______ from seven to ten?', '¿Sirve el hotel el desayuno de siete a diez?'],
      ['We usually have ______ before our journey.', 'Normalmente desayunamos antes del viaje.'],
      ['What do you eat for ______ at the guest house?', '¿Qué desayunas en el alojamiento?'],
    ],
    third: [
      ['The lift stops on the ______ floor.', 'El ascensor para en la tercera planta.'],
      ['Our room is on the ______ floor, next to the stairs.', 'Nuestra habitación está en la tercera planta, junto a las escaleras.'],
      ['The restaurant is on the ______ floor of the hotel.', 'El restaurante está en la tercera planta del hotel.'],
    ],
    shopping: [
      ["Let's go ______ after lunch.", 'Vamos de compras después de comer.'],
      ["They enjoy ______ in the town centre.", 'Disfrutan ir de compras en el centro.'],
    ],
    'listening to': [
      ['She enjoys ______ music on the bus.', 'Le gusta ______ música en el autobús.'],
      ['I like ______ podcasts in the evening.', 'Me gusta ______ pódcast por la tarde.'],
      ['They spend their free time ______ the radio.', 'Pasan su tiempo libre ______ la radio.'],
      ['We love ______ songs in English.', 'Nos encanta ______ canciones en inglés.'],
    ],
    'going swimming': [
      ['I like ______ at the weekend.', 'Me gusta ______ el fin de semana.'],
      ['They enjoy ______ in the summer.', 'Disfrutan ______ en verano.'],
      ['We spend Saturday ______ at the pool.', 'Pasamos el sábado ______ en la piscina.'],
    ],
    'going camping': [
      ['We are ______ by the lake this weekend.', 'Vamos de acampada junto al lago este fin de semana.'],
      ['They are ______ in the mountains in August.', 'Van de acampada a la montaña en agosto.'],
      ['Are you ______ with your friends next month?', '¿Te vas de acampada con tus amigos el mes que viene?'],
    ],
    watch: [
      ['How often do you ______ films at home?', '¿Con qué frecuencia ves películas en casa?'],
      ['Does your family ______ the news together?', '¿Ve tu familia las noticias junta?'],
      ['What do they ______ after dinner?', '¿Qué ven después de cenar?'],
    ],
  };
  for (const [english, spanish] of contextualVariants[answer] ?? []) {
    const variant = answer === 'do need to'
      ? { ...item, type: 'fill-blank', options: [], correct_answer: 'need to', stimulus_en: `[[${english}|${spanish}]]`, duplicate_stimulus_replaced: true }
      : { ...item, stimulus_en: `[[${english}|${spanish}]]`, duplicate_stimulus_replaced: true };
    if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
  }
  if (['right', 'left'].includes(answer) && /\b(?:road|street)\b/i.test(unmark(item.stimulus_en, 0))) {
    const direction = answer === 'right' ? 'right' : 'left';
    const opposite = answer === 'right' ? 'left' : 'right';
    const candidates = [
      [`The museum is on the ______ at the end of the street.`, `El museo está a la ______ al final de la calle.`],
      [`The bank is on the ______ at the end of the road.`, `El banco está a la ______ al final de la carretera.`],
      [`The hotel is on the ______ at the start of the street.`, `El hotel está a la ______ al principio de la calle.`],
      [`The school is on the ______ side of the road.`, `La escuela está en el lado ______ de la carretera.`],
      [`Turn ______ at the end of the street.`, `Gira a la ______ al final de la calle.`],
      [`The café is on the ______ side of the street.`, `La cafetería está en el lado ______ de la calle.`],
      [`The library is on the ______ side of the square.`, `La biblioteca está en el lado ______ de la plaza.`],
      [`The bus stop is on the ______ side of the road.`, `La parada de autobús está en el lado ______ de la carretera.`],
      [`Turn ______ after the supermarket.`, `Gira a la ______ después del supermercado.`],
      [`Turn ______ before the traffic lights.`, `Gira a la ______ antes del semáforo.`],
      [`The museum is on your ______ after the bridge.`, `El museo queda a tu ______ después del puente.`],
      [`The hotel is on your ______ before the station.`, `El hotel queda a tu ______ antes de la estación.`],
      [`The restaurant is on the ______ of the square.`, `El restaurante está en el lado ______ de la plaza.`],
      [`The park is on the ______ side of the street.`, `El parque está en el lado ______ de la calle.`],
      [`Turn ______ at the second street.`, `Gira a la ______ en la segunda calle.`],
      [`The school is on your ______ after the bank.`, `La escuela queda a tu ______ después del banco.`],
      [`The café is on your ______ before the hotel.`, `La cafetería queda a tu ______ antes del hotel.`],
    ];
    for (const [english, spanish] of candidates) {
      const variant = { ...item, type: 'fill-blank', options: [], correct_answer: direction, stimulus_en: `[[${english}|${spanish}]]`, duplicate_stimulus_replaced: true };
      if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
    }
    const places = [['museum','el museo'],['bank','el banco'],['hotel','el hotel'],['school','la escuela'],['café','la cafetería'],['library','la biblioteca'],['station','la estación'],['shop','la tienda'],['park','el parque'],['restaurant','el restaurante'],['hospital','el hospital']];
    const sides = [['road','carretera'],['street','calle'],['square','plaza']];
    for (const [place, placeEs] of places) for (const [side, sideEs] of sides) {
      const english = `The ${place} is on the ______ side of the ${side}.`;
      const spanish = `${placeEs} está en el lado ______ de la ${sideEs}.`;
      const variant = { ...item, type: 'fill-blank', options: [], correct_answer: direction, stimulus_en: `[[${english}|${spanish}]]`, duplicate_stimulus_replaced: true };
      if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
    }
    void opposite;
  }
  const c1ozeVariants = {
    spend: [['How much do you ______ on lunch each day?', '¿Cuánto gastas en la comida cada día?'], ['We ______ very little on coffee at home.', 'Gastamos muy poco en café en casa.'], ['She does not ______ much money on clothes.', 'No gasta mucho dinero en ropa.']],
    some: [['Would you like ______ tea with your breakfast?', '¿Quieres té con el desayuno?'], ['Can I have ______ more rice, please?', '¿Me puedes dar un poco más de arroz, por favor?'], ['We need ______ fruit for the picnic.', 'Necesitamos fruta para el pícnic.'], ['There is ______ cheese in the fridge.', 'Hay queso en la nevera.'], ['Can I have ______ water, please?', '¿Me das agua, por favor?'], ['We bought ______ apples at the market.', 'Compramos manzanas en el mercado.']],
    any: [['There are not ______ tomatoes in the fridge.', 'No hay tomates en la nevera.'], ['Do we have ______ eggs at home?', '¿Tenemos huevos en casa?'], ['There is not ______ milk left.', 'No queda leche.']],
    many: [['How ______ bananas do we need?', '¿Cuántos plátanos necesitamos?'], ['There are too ______ people in the queue.', 'Hay demasiada gente en la cola.'], ['How ______ potatoes are in the bag?', '¿Cuántas patatas hay en la bolsa?']],
    apples: [['There are three ______ in the fruit bowl.', 'Hay tres manzanas en el frutero.'], ['We need some ______ for the pie.', 'Necesitamos manzanas para la tarta.'], ['These ______ are fresh and red.', 'Estas manzanas están frescas y rojas.']],
    have: [['Could I ______ a receipt, please?', '¿Me puede dar un recibo, por favor?'], ['Can we ______ a bag for these apples?', '¿Podemos tener una bolsa para estas manzanas?'], ['May I ______ a shopping basket?', '¿Puedo coger una cesta de la compra?'], ['Could you ______ a smaller bag?', '¿Podría darme una bolsa más pequeña?']],
    vegetables: [['We buy fresh ______ at the market.', 'Compramos verduras frescas en el mercado.'], ['Carrots and onions are ______.', 'Las zanahorias y las cebollas son verduras.'], ['Wash the ______ before you make the soup.', 'Lava las verduras antes de hacer la sopa.'], ['You can find fresh ______ in aisle five.', 'Puedes encontrar verduras frescas en el pasillo cinco.']],
    number: [['The milk is in aisle ______ four.', 'La leche está en el pasillo número cuatro.'], ['Go to till ______ two to pay.', 'Ve a la caja número dos para pagar.'], ['The apples are in box ______ five.', 'Las manzanas están en la caja número cinco.'], ['We are looking for shelf ______ three.', 'Buscamos el estante número tres.']],
    loyalty: [['Do you have a ______ card for this shop?', '¿Tienes una tarjeta de fidelidad para esta tienda?'], ['She uses her ______ card at the supermarket.', 'Usa su tarjeta de fidelidad en el supermercado.'], ['Ask the cashier for a ______ card.', 'Pide una tarjeta de fidelidad en la caja.']],
    'most famous': [
      ['The Eiffel Tower is the ______ landmark in Paris.', 'La Torre Eiffel es el monumento más famoso de París.'], ['This is the ______ museum in the city.', 'Este es el museo más famoso de la ciudad.'], ['The old bridge is the ______ place in town.', 'El puente antiguo es el lugar más famoso del pueblo.'], ['That is the ______ building in the village.', 'Ese es el edificio más famoso del pueblo.'], ['The Sagrada Familia is the ______ church in Barcelona.', 'La Sagrada Familia es la iglesia más famosa de Barcelona.'], ['This square is the ______ place in the old town.', 'Esta plaza es el lugar más famoso del casco antiguo.'],
      ['Big Ben is the ______ clock in London.', 'El Big Ben es el reloj más famoso de Londres.'], ['The Colosseum is the ______ monument in Rome.', 'El Coliseo es el monumento más famoso de Roma.'], ['The Taj Mahal is the ______ building in Agra.', 'El Taj Mahal es el edificio más famoso de Agra.'], ['The Louvre is the ______ art museum in Paris.', 'El Louvre es el museo de arte más famoso de París.'], ['The canals are the ______ feature of Venice.', 'Los canales son lo más famoso de Venecia.'], ['The old castle is the ______ place in this town.', 'El castillo antiguo es el lugar más famoso de este pueblo.'],
      ['This tower is the ______ building near the river.', 'Esta torre es el edificio más famoso cerca del río.'], ['The central market is the ______ market in the region.', 'El mercado central es el mercado más famoso de la región.'], ['That beach is the ______ place on the island.', 'Esa playa es el lugar más famoso de la isla.'], ['The cathedral is the ______ church in the north.', 'La catedral es la iglesia más famosa del norte.'], ['This gallery is the ______ art gallery in the city.', 'Esta galería es la galería de arte más famosa de la ciudad.'], ['The harbour is the ______ place in the port town.', 'El puerto es el lugar más famoso de la ciudad portuaria.'],
      ['The old theatre is the ______ theatre in the country.', 'El teatro antiguo es el teatro más famoso del país.'], ['This monument is the ______ sight in the capital.', 'Este monumento es el lugar más famoso de la capital.'], ['The city walls are the ______ attraction in the old town.', 'Las murallas son la atracción más famosa del casco antiguo.'], ['The main square is the ______ meeting place in town.', 'La plaza mayor es el lugar de encuentro más famoso del pueblo.'], ['This palace is the ______ building in the capital.', 'Este palacio es el edificio más famoso de la capital.'], ['The mountain is the ______ landmark in the area.', 'La montaña es el monumento más famoso de la zona.'],
    ],
    oldest: [['This is the ______ building in our town.', 'Este es el edificio más antiguo de nuestro pueblo.'], ['My grandmother is the ______ person in our family.', 'Mi abuela es la persona más mayor de nuestra familia.'], ['That is the ______ hotel in the city.', 'Ese es el hotel más antiguo de la ciudad.'], ['The old castle is the ______ monument in the region.', 'El castillo antiguo es el monumento más antiguo de la región.']],
    'most visited': [['The Colosseum is one of the ______ places in Rome.', 'El Coliseo es uno de los lugares más visitados de Roma.'], ['This museum is the ______ attraction in the town.', 'Este museo es la atracción más visitada del pueblo.'], ['The old castle is the ______ site on the island.', 'El castillo antiguo es el lugar más visitado de la isla.']],
    best: [['The train is the ______ way to travel to the city centre.', 'El tren es la mejor manera de llegar al centro.'], ['For me, spring is the ______ time to visit the island.', 'Para mí, la primavera es la mejor época para visitar la isla.'], ['This map is the ______ one for walking around town.', 'Este mapa es el mejor para pasear por la ciudad.']],
    the: [
      ['We visit ______ museum on Saturdays.', 'Visitamos el museo los sábados.'], ['She listens to ______ radio in the kitchen.', 'Escucha la radio en la cocina.'], ['They go to ______ beach in July.', 'Van a la playa en julio.'],
      ['He takes ______ bus to work every morning.', 'Va al trabajo en autobús todas las mañanas.'], ['I wait for ______ train at platform two.', 'Espero el tren en el andén dos.'], ['She walks to ______ station with her brother.', 'Va andando a la estación con su hermano.'],
      ['We have lunch at ______ café near the office.', 'Comemos en la cafetería que hay cerca de la oficina.'], ['They are staying at ______ hotel by the sea.', 'Se alojan en el hotel junto al mar.'], ['Please open ______ window in the kitchen.', 'Abre la ventana de la cocina, por favor.'],
      ['My keys are on ______ table next to the door.', 'Mis llaves están en la mesa junto a la puerta.'], ['The children are playing in ______ garden.', 'Los niños están jugando en el jardín.'], ['Can you close ______ door, please?', '¿Puedes cerrar la puerta, por favor?'],
      ['We have a view of ______ mountains from our room.', 'Desde nuestra habitación vemos las montañas.'], ['She goes to ______ supermarket after work.', 'Va al supermercado después del trabajo.'], ['He is at ______ airport with his family.', 'Está en el aeropuerto con su familia.'],
      ['I read ______ book you gave me.', 'Leo el libro que me diste.'], ['They are watching ______ film we talked about.', 'Están viendo la película de la que hablamos.'], ['The bus stops outside ______ school.', 'El autobús para delante de la escuela.'],
      ['We are having dinner at ______ restaurant on the corner.', 'Vamos a cenar en el restaurante de la esquina.'], ['She leaves ______ office at five o’clock.', 'Sale de la oficina a las cinco.'], ['The cat is sleeping under ______ chair.', 'El gato está durmiendo debajo de la silla.'],
      ['He plays ______ guitar in a small band.', 'Toca la guitarra en un grupo pequeño.'], ['Please put the milk in ______ fridge.', 'Pon la leche en la nevera, por favor.'], ['They are walking along ______ river.', 'Están caminando junto al río.'],
      ['I can see ______ moon tonight.', 'Esta noche puedo ver la luna.'], ['We visited ______ castle near the town.', 'Visitamos el castillo cerca del pueblo.'], ['She is reading ______ menu now.', 'Está leyendo el menú ahora.'],
      ['He left his coat on ______ chair by the door.', 'Dejó el abrigo en la silla junto a la puerta.'], ['The children are at ______ library after school.', 'Los niños están en la biblioteca después de clase.'], ['We are crossing ______ bridge into the town.', 'Estamos cruzando el puente para entrar en el pueblo.'],
      ['Please turn off ______ television before bed.', 'Apaga la televisión antes de acostarte, por favor.'], ['I met her at ______ bus stop near my house.', 'La conocí en la parada de autobús cerca de mi casa.'], ['They are sitting in ______ front row.', 'Están sentados en la primera fila.'],
    ],
    blue: [['My eyes are ______.', 'Mis ojos son ______.'], ['Her eyes are ______.', 'Sus ojos son ______.'], ['His eyes are ______.', 'Sus ojos son ______.']],
    brown: [['My eyes are ______.', 'Mis ojos son ______.'], ['Her eyes are ______.', 'Sus ojos son ______.'], ['His eyes are ______.', 'Sus ojos son ______.']],
    green: [['My eyes are ______.', 'Mis ojos son ______.'], ['Her eyes are ______.', 'Sus ojos son ______.'], ['His eyes are ______.', 'Sus ojos son ______.']],
    black: [['My eyes are ______.', 'Mis ojos son ______.'], ['Her eyes are ______.', 'Sus ojos son ______.'], ['His eyes are ______.', 'Sus ojos son ______.']],
    far: [
      ['The station is ______ from here.', 'La estación está ______ de aquí.'], ['Is the park ______ from your house?', '¿Está el parque ______ de tu casa?'], ['The hotel is ______ from the airport.', 'El hotel está ______ del aeropuerto.'],
      ['Is the museum ______ from the hotel?', '¿Está el museo ______ del hotel?'], ['The beach is ______ from the city centre.', 'La playa está ______ del centro.'],
      ['Is the school ______ from your home?', '¿Está la escuela ______ de tu casa?'], ['The supermarket is ______ from the station.', 'El supermercado está ______ de la estación.'],
      ['Is the bus stop ______ from here?', '¿Está la parada de autobús ______ de aquí?'], ['The airport is ______ from the town.', 'El aeropuerto está ______ del pueblo.'],
      ['Is the café ______ from the bank?', '¿Está la cafetería ______ del banco?'], ['The hotel is ______ from the beach.', 'El hotel está ______ de la playa.'],
      ['Is the park ______ from the station?', '¿Está el parque ______ de la estación?'], ['The library is ______ from my house.', 'La biblioteca está ______ de mi casa.'],
      ['Is the restaurant ______ from here?', '¿Está el restaurante ______ de aquí?'], ['The shop is ______ from the school.', 'La tienda está ______ de la escuela.'],
    ],
    am: [['I ______ from Madrid.', 'Yo soy de Madrid.'], ['I ______ at home today.', 'Estoy en casa hoy.'], ['I ______ a student.', 'Soy estudiante.']],
    is: [['The bus ______ late.', 'El autobús llega tarde.'], ['My sister ______ tall.', 'Mi hermana es alta.'], ['The shop ______ open.', 'La tienda está abierta.'], ['It ______ a sunny day.', 'Hace un día soleado.']],
    are: [['The shops ______ open.', 'Las tiendas están abiertas.'], ['You ______ my friend.', 'Tú eres mi amigo.'], ['The children ______ at school.', 'Los niños están en la escuela.'], ['We ______ ready.', 'Estamos preparados.']],
    a: [['He is ______ teacher.', 'Él es profesor.'], ['This is ______ new house.', 'Esta es una casa nueva.'], ['I have ______ blue bag.', 'Tengo una bolsa azul.']],
    an: [['She is ______ artist.', 'Ella es una artista.'], ['This is ______ apple.', 'Esto es una manzana.'], ['I have ______ old book.', 'Tengo un libro viejo.']],
    right: [['Turn ______ at the next street.', 'Gira a la ______ en la siguiente calle.'], ['The bank is on the ______.', 'El banco está a la ______.'], ['Go ______ at the traffic lights.', 'Ve a la ______ en el semáforo.']],
    left: [['Turn ______ at the next street.', 'Gira a la ______ en la siguiente calle.'], ['The café is on the ______.', 'La cafetería está a la ______.'], ['Go ______ at the traffic lights.', 'Ve a la ______ en el semáforo.']],
    go: [['______ straight for two minutes.', 'Sigue recto durante dos minutos.'], ['______ past the bank and turn left.', 'Pasa el banco y gira a la izquierda.'], ['______ along this road.', 'Sigue por esta calle.']],
    turn: [['______ right at the next street.', 'Gira a la derecha en la siguiente calle.'], ['______ left at the corner.', 'Gira a la izquierda en la esquina.'], ['______ right after the bank.', 'Gira a la derecha después del banco.']],
    live: [['Lions ______ in Africa.', 'Los leones ______ en África.'], ['My grandparents ______ in Madrid.', 'Mis abuelos ______ en Madrid.'], ['We ______ near the city centre.', 'Vivimos cerca del centro.']],
    friendly: [['My cat is ______.', 'Mi gato es ______.'], ['Our dog is ______.', 'Nuestro perro es ______.'], ['Her rabbit is ______.', 'Su conejo es ______.']],
    dangerous: [['A tiger is ______.', 'Un tigre es ______.'], ['Some snakes are ______.', 'Algunas serpientes son ______.'], ['This dog is not ______.', 'Este perro no es ______.']],
    rabbit: [['I have a pet ______.', 'Tengo un ______ de mascota.'], ['The ______ is white and small.', 'El ______ es blanco y pequeño.'], ['My friend has a ______ called Max.', 'Mi amigo tiene un ______ llamado Max.']],
    dog: [['The ______ is in the garden.', 'El ______ está en el jardín.'], ['My family has a ______.', 'Mi familia tiene un ______.'], ['The ______ likes playing with a ball.', 'Al ______ le gusta jugar con una pelota.']],
    cat: [['The ______ is asleep on the sofa.', 'El ______ está dormido en el sofá.'], ['My neighbour has a ______.', 'Mi vecino tiene un ______.'], ['The ______ is black and white.', 'El ______ es blanco y negro.']],
    sleeps: [['The cat ______ on the sofa.', 'El gato ______ en el sofá.'], ['My dog ______ in its bed.', 'Mi perro ______ en su cama.'], ['The baby ______ for ten hours.', 'El bebé ______ durante diez horas.']],
    finger: [['Can you touch your nose with one ______?', '¿Puedes tocarte la nariz con un ______?'], ['I point with my ______.', 'Señalo con el ______.'], ['She has a ring on one ______.', 'Lleva un anillo en un ______.'], ['He hurt his ______ playing basketball.', 'Se hizo daño en un ______ jugando al baloncesto.']],
    two: [['A person has ______ hands.', 'Una persona tiene ______ manos.'], ['A bicycle has ______ wheels.', 'Una bicicleta tiene ______ ruedas.'], ['We have ______ eyes.', 'Tenemos ______ ojos.'], ['There are ______ shoes by the door.', 'Hay ______ zapatos junto a la puerta.']],
    back: [['My ______ hurts after football.', 'Me duele la ______ después del fútbol.'], ['Her ______ hurts today.', 'Le duele la ______ hoy.'], ['I have pain in my ______.', 'Tengo dolor en la ______.'], ['He carries a heavy bag on his ______.', 'Lleva una bolsa pesada en la ______.']],
    wearing: [['What is he ______ today?', '¿Qué lleva él hoy?'], ['What is she ______ to the party?', '¿Qué lleva ella a la fiesta?'], ['What are they ______ for the trip?', '¿Qué llevan ellos para el viaje?'], ['What are you ______ to school?', '¿Qué llevas a la escuela?']],
    can: [['______ you swim?', '¿Sabes nadar?'], ['______ she play tennis?', '¿Sabe jugar al tenis?'], ['______ he speak English?', '¿Sabe hablar inglés?'], ['______ they ride a bike?', '¿Saben montar en bicicleta?'], ['______ we use the computer?', '¿Podemos usar el ordenador?'], ['______ your brother play football?', '¿Sabe jugar al fútbol tu hermano?'], ['______ Anna sing?', '¿Sabe cantar Anna?'], ['______ the dog run fast?', '¿Puede correr rápido el perro?'], ['______ your friends come today?', '¿Pueden venir hoy tus amigos?'], ['______ I open the window?', '¿Puedo abrir la ventana?']],
    sometimes: [['I ______ go running after work.', 'A veces salgo a correr después del trabajo.'], ['She ______ watches films at home.', 'A veces ve películas en casa.'], ['We ______ have pizza on Fridays.', 'A veces comemos pizza los viernes.'], ['They ______ visit their grandparents.', 'A veces visitan a sus abuelos.'], ['My brother ______ plays tennis at weekends.', 'Mi hermano a veces juega al tenis los fines de semana.'], ['He ______ takes the bus to school.', 'A veces va en autobús a la escuela.']],
    play: [['I ______ basketball after school.', 'Juego al baloncesto después de clase.'], ['We ______ tennis on Fridays.', 'Jugamos al tenis los viernes.'], ['They ______ volleyball at the beach.', 'Juegan al voleibol en la playa.'], ['Do you ______ football with your friends?', '¿Juegas al fútbol con tus amigos?'], ['The children ______ in the park.', 'Los niños juegan en el parque.'], ['My cousins ______ chess at home.', 'Mis primos juegan al ajedrez en casa.']],
    "can't": [['I ______ drive a car; I do not have a licence.', 'No puedo conducir un coche; no tengo carné.'], ['He ______ swim very well.', 'Él no sabe nadar muy bien.'], ['She ______ play the piano yet.', 'Todavía no sabe tocar el piano.'], ['They ______ come to the party today.', 'No pueden venir hoy a la fiesta.'], ['We ______ buy the tickets online.', 'No podemos comprar las entradas por internet.'], ['My brother ______ ride a motorbike.', 'Mi hermano no sabe montar en moto.'], ['The baby ______ walk yet.', 'El bebé todavía no puede caminar.'], ['You ______ park here.', 'No puedes aparcar aquí.']],
  }[answer];
  if (c1ozeVariants) {
    const start = (lessonNumber * 7 + exerciseNumber * 3) % c1ozeVariants.length;
    for (let offset = 0; offset < c1ozeVariants.length; offset += 1) {
      const [english, spanish] = c1ozeVariants[(start + offset) % c1ozeVariants.length];
      const variant = { ...item, type: 'fill-blank', options: [], correct_answer: answer, stimulus_en: `[[${english}|${spanish}]]`, duplicate_stimulus_replaced: true };
      if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
    }
    return null;
  }
  if (/\b(?:grandmother|grandfather|mother|father|aunt|uncle)\b/i.test(answer) && /\byears old\b/i.test(unmark(item.stimulus_en, 0))) {
    const variants = [
      ['My grandfather is seventy years old.', 'Mi abuelo tiene setenta años.', 'grandfather'],
      ['Her mother is sixty years old.', 'Su madre tiene sesenta años.', 'mother'],
      ['His aunt is forty-five years old.', 'Su tía tiene cuarenta y cinco años.', 'aunt'],
      ['Our uncle is fifty years old.', 'Nuestro tío tiene cincuenta años.', 'uncle'],
      ['Their grandmother is sixty-eight years old.', 'Su abuela tiene sesenta y ocho años.', 'grandmother'],
    ];
    const start = (lessonNumber * 7 + exerciseNumber * 3) % variants.length;
    for (let offset = 0; offset < variants.length; offset += 1) {
      const [english, spanish, nextAnswer] = variants[(start + offset) % variants.length];
      const variant = {
        ...item,
        stimulus_en: `[[${english}|${spanish}]]`,
        options: item.options.map((option) => option.id === item.correct_answer ? { ...option, text: `[[${nextAnswer}|${nextAnswer}]]` } : option),
        duplicate_stimulus_replaced: true,
      };
      if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
    }
    return null;
  }
  if (/^older$/i.test(answer) && /\bhave\b/i.test(unmark(item.stimulus_en, 0)) && /brother|sister/i.test(unmark(item.stimulus_en, 0))) {
    const variants = [
      ['I have three ______ sisters.', 'Yo tengo tres ______ hermanas.'],
      ['She has two ______ brothers.', 'Ella tiene dos ______ hermanos.'],
      ['We have one ______ cousin.', 'Nosotros tenemos un primo ______.'],
      ['They have four ______ sisters.', 'Ellos tienen cuatro ______ hermanas.'],
      ['He has two ______ cousins.', 'Él tiene dos primos ______.'],
      ['My friend has one ______ brother.', 'Mi amigo tiene un hermano ______.'],
    ];
    const start = (lessonNumber * 7 + exerciseNumber * 3) % variants.length;
    for (let offset = 0; offset < variants.length; offset += 1) {
      const [english, spanish] = variants[(start + offset) % variants.length];
      const variant = { ...item, stimulus_en: `[[${english}|${spanish}]]`, duplicate_stimulus_replaced: true };
      if (!usedStimuli.has(grammarStimulusKey(variant))) return variant;
    }
    return null;
  }
  const replacements = { our: 'their', their: 'our', his: 'her', her: 'his', my: 'your', your: 'my' };
  const next = replacements[answer];
  if (!next) return null;
  let stimulus = item.stimulus_en;
  const subjectPairs = { they: 'we', we: 'they', he: 'she', she: 'he', i: 'you', you: 'i' };
  const subject = unmark(stimulus, 0).match(/^\s*(I|you|he|she|we|they)\b/i)?.[1];
  if (subject && subjectPairs[subject.toLocaleLowerCase('en')]) {
    const expectedPossessive = { i: 'my', you: 'your', he: 'his', she: 'her', we: 'our', they: 'their' }[subject.toLocaleLowerCase('en')];
    const nextSubject = subjectPairs[subject.toLocaleLowerCase('en')];
    const nextPossessive = { i: 'my', you: 'your', he: 'his', she: 'her', we: 'our', they: 'their' }[nextSubject];
    if (answer !== expectedPossessive) return null;
    stimulus = stimulus.replace(new RegExp(`^\\s*${subject}`, 'i'), nextSubject);
    return { ...item, stimulus_en: stimulus, options: item.options.map((option) => option.id === item.correct_answer ? { ...option, text: `[[${nextPossessive}|${nextPossessive}]]` } : option), duplicate_stimulus_replaced: true };
  }
  if (!/\bfamily\b/i.test(unmark(stimulus, 0))) return null;
  return {
    ...item,
    options: item.options.map((option) => option.id === item.correct_answer ? { ...option, text: `[[${next}|${next}]]` } : option),
    duplicate_stimulus_replaced: true,
  };
}
function distinctGrammarExercises(items, sourceNumber, lessonNumber) {
  const candidates = relatedGrammarItems(sourceNumber).filter((item) => ['fill-blank', 'multiple-choice'].includes(item.type) && item.stimulus_en);
  const candidateTypes = (answerKey, item) => candidates.filter((candidate) => candidate.type === item.type && grammarAnswerKey(candidate) === answerKey)
    .concat(candidates.filter((candidate) => candidate.type === item.type && grammarAnswerKey(candidate) !== answerKey));
  return items.map((item) => {
    const key = grammarStimulusKey(item);
    if (!usedCourseGrammarStimuli.has(key)) {
      usedCourseGrammarStimuli.add(key);
      return item;
    }
    const answerKey = grammarAnswerKey(item);
    for (const replacement of candidateTypes(answerKey, item)) {
      const replacementKey = grammarStimulusKey(replacement);
      if (usedCourseGrammarStimuli.has(replacementKey)) continue;
      usedCourseGrammarStimuli.add(replacementKey);
      return { ...replacement, duplicate_stimulus_replaced: true };
    }
    const courseCandidates = allGrammarItems().filter((candidate) => ['fill-blank', 'multiple-choice'].includes(candidate.type) && candidate.stimulus_en);
    for (const replacement of courseCandidates.filter((candidate) => candidate.type === item.type && grammarAnswerKey(candidate) === answerKey)) {
      const replacementKey = grammarStimulusKey(replacement);
      if (usedCourseGrammarStimuli.has(replacementKey)) continue;
      usedCourseGrammarStimuli.add(replacementKey);
      return { ...replacement, duplicate_stimulus_replaced: true };
    }
    for (const replacement of courseCandidates.filter((candidate) => candidate.type === item.type && grammarAnswerKey(candidate) !== answerKey)) {
      const replacementKey = grammarStimulusKey(replacement);
      if (usedCourseGrammarStimuli.has(replacementKey)) continue;
      usedCourseGrammarStimuli.add(replacementKey);
      return { ...replacement, duplicate_stimulus_replaced: true };
    }
    for (const replacement of courseCandidates.filter((candidate) => candidate.type !== item.type && grammarAnswerKey(candidate) === answerKey)) {
      const replacementKey = grammarStimulusKey(replacement);
      if (usedCourseGrammarStimuli.has(replacementKey)) continue;
      usedCourseGrammarStimuli.add(replacementKey);
      return { ...replacement, duplicate_stimulus_replaced: true };
    }
    for (const replacement of courseCandidates.filter((candidate) => candidate.type !== item.type)) {
      const replacementKey = grammarStimulusKey(replacement);
      if (usedCourseGrammarStimuli.has(replacementKey)) continue;
      usedCourseGrammarStimuli.add(replacementKey);
      return { ...replacement, duplicate_stimulus_replaced: true };
    }
    const contextual = addGrammarContextVariant(item, lessonNumber, items.indexOf(item) + 1);
    if (contextual) return contextual;
    const naturalVariant = naturalGrammarVariant(item, lessonNumber, items.indexOf(item) + 1, usedCourseGrammarStimuli);
    if (naturalVariant) {
      usedCourseGrammarStimuli.add(grammarStimulusKey(naturalVariant));
      return naturalVariant;
    }
    throw new Error(`Unit ${lessonNumber}: no distinct grammatical exercise remains for ${item.interaction_id}.`);
  });
}
function makeOptionsUnique(options, correct, contextCandidates = []) {
  const normalizedCorrect = String(correct).trim().toLocaleLowerCase('en');
  const optionFallbacks = {
    am: ['am', 'is', 'are'], is: ['is', 'am', 'are'], are: ['are', 'is', 'am'],
    a: ['a', 'an', 'the'], an: ['an', 'a', 'the'],
    in: ['in', 'on', 'at'], on: ['on', 'in', 'at'], at: ['at', 'in', 'on'],
    was: ['was', 'were', 'is'], were: ['were', 'was', 'are'],
    "don't": ["don't", "doesn't", 'do'], "doesn't": ["doesn't", "don't", 'does'],
    do: ['do', 'does', 'are'], does: ['does', 'do', 'is'],
    have: ['have', 'has', 'do'], has: ['has', 'have', 'is'],
    like: ['like', 'likes', 'love'], likes: ['likes', 'like', 'loves'],
    what: ['What', 'Where', 'When', 'Who'], where: ['Where', 'When', 'What', 'Who'],
    first: ['First', 'Then', 'Next', 'Finally'], would: ['would', 'could', 'should'],
    one: ['one', 'two', 'three', 'four'], two: ['two', 'one', 'three', 'four'],
    three: ['three', 'two', 'four', 'five'], four: ['four', 'three', 'five', 'two'],
    five: ['five', 'four', 'six', 'three'], any: ['any', 'some', 'a', 'many'],
    some: ['some', 'any', 'a', 'many'], many: ['many', 'much', 'some', 'any'],
    much: ['much', 'many', 'some', 'any'], from: ['from', 'in', 'on', 'at'],
    bank: ['bank', 'school', 'park', 'station'], blue: ['blue', 'green', 'brown', 'black'],
    departs: ['departs', 'arrives', 'stops'],
    was: ['was', 'were', 'is'],
    were: ['were', 'was', 'are'],
    season: ['season', 'month', 'weather'],
    'need to': ['need to', 'have to', 'must'],
  }[normalizedCorrect];
  const candidates = [...(optionFallbacks ?? []), ...contextCandidates];
  if (candidates.length === 0) return { options, repaired: false };
  const result = [...options];
  const correctIndex = result.indexOf(correct);
  const seen = new Map();
  let repaired = false;
  for (let index = 0; index < result.length; index += 1) {
    const normalized = result[index].trim().toLocaleLowerCase('en');
    if (!seen.has(normalized)) {
      seen.set(normalized, index);
      continue;
    }
    const earlierIndex = seen.get(normalized);
    const replaceIndex = index === correctIndex ? earlierIndex : index;
    const used = new Set(result.filter((_option, optionIndex) => optionIndex !== replaceIndex).map((option) => option.trim().toLocaleLowerCase('en')));
    const fallback = candidates.find((option) => !used.has(option.toLocaleLowerCase('en')) && option.toLocaleLowerCase('en') !== String(correct).trim().toLocaleLowerCase('en'));
    if (!fallback) throw new Error(`Could not replace duplicate option '${result[replaceIndex]}'`);
    result[replaceIndex] = fallback;
    seen.set(fallback.toLocaleLowerCase('en'), replaceIndex);
    if (replaceIndex === earlierIndex) seen.set(normalized, index);
    repaired = true;
  }
  return { options: result, repaired };
}

const negativeContractions = { "don't": 'do not', "doesn't": 'does not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "can't": 'cannot', "won't": 'will not' };
function negativeVariants(answer) {
  const expanded = answer.replace(/\b(don't|doesn't|isn't|aren't|wasn't|weren't|can't|won't)\b/gi, (match) => negativeContractions[match.toLocaleLowerCase('en')] ?? match);
  const variants = [expanded];
  if (answer.toLocaleLowerCase('en') === 'am not') variants.push("I'm not");
  return [...new Set(variants.filter((variant) => variant !== answer))];
}

function normalizeNegativeGrammarItem(item) {
  if (!['fill-blank', 'multiple-choice'].includes(item.type)) return null;
  const stimulus = unmark(item.stimulus_en, 0);
  if (!stimulus.includes('_')) return null;
  const rawAnswer = item.type === 'multiple-choice'
    ? item.options?.find((option) => option.id === item.correct_answer)?.text ?? item.correct_answer
    : item.correct_answer;
  const answer = unmark(rawAnswer, 0);
  let nextStimulus = stimulus;
  let negativeAnswer = answer;
  const embeddedNegative = stimulus.match(/\b(don't|doesn't|didn't|do not|does not|did not|isn't|aren't|wasn't|weren't|can't|cannot|won't|will not)\s+_{2,}\s+([A-Za-z]+)\b/i);
  const negativeAuxiliaryOnly = /^(?:don't|doesn't|didn't|isn't|aren't|wasn't|weren't|can't|cannot|won't|do not|does not|did not|is not|are not|was not|were not|will not)$/i.test(answer);
  if (embeddedNegative) {
    // Keep the lexical verb visible and ask for the auxiliary only.
    negativeAnswer = embeddedNegative[1];
    nextStimulus = stimulus.replace(embeddedNegative[0], `______ ${answer} ${embeddedNegative[2]}`);
  } else if (negativeAuxiliaryOnly) {
    const blankAndVerb = stimulus.match(/_{2,}\s+([A-Za-z]+)\b/);
    if (!blankAndVerb) return null;
    // The blank is already for do/does/don't/doesn't; the verb after it is
    // visible context and must not be pulled into the expected answer.
    negativeAnswer = answer;
  } else if (/_{2,}\s+not\b/i.test(stimulus) && /^(am|is|are|was|were)$/i.test(answer)) {
    const subject = stimulus.match(/^\s*(I|you|he|she|it|we|they)\b/i)?.[1]?.toLocaleLowerCase('en');
    const forms = { i: 'am not', you: "aren't", he: "isn't", she: "isn't", it: "isn't", we: "aren't", they: "aren't" };
    if (!subject) return null;
    negativeAnswer = forms[subject];
    nextStimulus = stimulus.replace(/_{2,}\s+not\b/i, '______');
  } else if (item.type !== 'multiple-choice' || !/\b(?:don't|doesn't|didn't|isn't|aren't|wasn't|weren't|can't|cannot|won't|not)\b/i.test(answer)) {
    return null;
  }
  return { stimulus: nextStimulus, answer: negativeAnswer, accepted: negativeVariants(negativeAnswer) };
}

const seed = fs.readFileSync(seedPath, 'utf8');
const lessonMetadata = new Map();
for (const line of seed.split(/\r?\n/)) {
  const match = line.match(/VALUES \('a1-(\d+)', 'english-a1', \d+, \d+, '([^']*)', '([^']*)'/);
  if (match) lessonMetadata.set(Number(match[1]), { title: match[2], objective: match[3] });
}
lessonMetadata.set(1, {
  title: 'Saludos, sonidos y presentaciones',
  objective: 'Reconocer sonidos iniciales y usar saludos y frases básicas para presentarte.',
});

if (lessonMetadata.size !== 60 || sourceUnitByLesson.length !== 60) {
  throw new Error('Expected metadata and source mappings for all 60 A1 units.');
}

function normalizeSourceItem(item, category, lessonNumber, exerciseNumber, optionFallbacks = []) {
  const lessonId = `a1-${String(lessonNumber).padStart(2, '0')}`;
  const idSection = category === 'reading' ? 'wri' : category.slice(0, 3);
  const id = `a1-u${String(lessonNumber).padStart(2, '0')}-${idSection}-${String(exerciseNumber).padStart(2, '0')}`;
  const negativeRepair = category === 'grammar' ? normalizeNegativeGrammarItem(item) : null;
  if (negativeRepair) item = { ...item, type: 'fill-blank', stimulus_en: negativeRepair.stimulus, correct_answer: negativeRepair.answer, accepted_answers: negativeRepair.accepted, negative_form_changed: true };
  const promptEs = unmark(item.prompt_es, 1);
  const stimulusEn = unmark(item.stimulus_en, 0);
  const stimulusEs = unmark(item.stimulus_en, 1);
  let type = item.type;
  let prompt = promptEs;
  let options = [];
  let audioText = null;
  let passageText = null;
  let correct;
  let explanation;

  if (category === 'listening' && item.transcript) {
    type = 'multiple-choice';
    // The ten comprehension questions share one dialogue. Attach its playback
    // control only to the first question so every question does not replay it.
    audioText = exerciseNumber === 1 ? unmark(item.transcript, 0) : null;
    prompt = exerciseNumber === 1
      ? `Escucha el diálogo y responde: ${unmark(item.question_en, 0)}`
      : `Según el diálogo del ejercicio 1, responde: ${unmark(item.question_en, 0)}`;
    options = toTextOptions(item.options, 0).map((option) => option.text);
    correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
    explanation = `Transcripción: ${audioText}`;
  } else if (category === 'reading') {
    type = 'multiple-choice';
    const transcript = unmark(item.transcript, 0);
    options = toTextOptions(item.options, 0).map((option) => option.text);
    correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
    if (item.clozeSentence) {
      prompt = `Lee el texto y completa la frase: ${item.clozeSentence}`;
      explanation = `En el texto, la frase completa es “${item.completedSentence}”.`;
    } else {
      prompt = `Lee el texto y responde: ${unmark(item.question_en, 0)}`;
      passageText = transcript;
      explanation = `Busca en el texto la información que confirma «${correct}».`;
    }
  } else if (category === 'listening') {
    if (item.type === 'fill-blank') {
      type = 'fill-blank';
      audioText = stimulusEn.replace(/_{2,}/g, unmark(item.correct_answer, 0));
      prompt = `Escucha la frase completa y escribe la palabra que falta.\n${stimulusEs}`;
      correct = unmark(item.correct_answer, 0);
      explanation = `La frase completa es “${audioText}”. Escúchala otra vez y fíjate en la palabra que faltaba.`;
    } else {
      type = 'multiple-choice';
      audioText = stimulusEn;
      prompt = 'Escucha la expresión y elige su significado en español.';
      options = toTextOptions(item.options, 1).map((option) => option.text);
      correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
      explanation = 'Vuelve a escuchar la expresión y relaciónala con el contexto de esta unidad.';
    }
  } else if (item.type === 'free-text') {
    type = 'free-text';
    prompt = promptEs;
    explanation = 'Revisa tu texto: ¿has usado el vocabulario de la unidad y una frase completa en inglés?';
  } else if (item.type === 'reading-comprehension') {
    throw new Error(`Reading item was assigned to ${category}; expected listening.`);
  } else {
    const isIntroVocab = category === 'vocabulary' && item.mastery_tag === 'vocabulary' && item.prompt_es?.includes('translation');
    const optionSide = isIntroVocab ? 0 : 0;
    options = toTextOptions(item.options, optionSide).map((option) => option.text);
    if (item.type === 'multiple-choice') {
      prompt = isIntroVocab
        ? `Elige la traducción al español de “${stimulusEn}”.`
        : category === 'vocabulary' && stimulusEs
          ? `Elige la palabra en inglés que corresponde a «${stimulusEs}».`
          : `${promptEs}${stimulusEn ? ` ${stimulusEn}` : ''}`.trim();
      correct = options[(item.options ?? []).findIndex((option) => option.id === item.correct_answer)];
      explanation = correct
        ? category === 'vocabulary' && !isIntroVocab && stimulusEs
          ? `«${correct}» significa «${stimulusEs}».`
          : `La respuesta correcta es «${correct}». Comprueba cómo encaja en la frase.`
        : '';
    } else if (item.type === 'fill-blank') {
      const sentence = stimulusEn ? `${stimulusEn}${stimulusEs && stimulusEs !== stimulusEn ? ` (${stimulusEs})` : ''}` : '';
      const grammarBlankContext = [stimulusEn, String(item.correct_answer ?? '')].join(' ');
      const grammarInstruction = /\?\s*$/.test(stimulusEn)
        ? 'Completa la pregunta.'
        : /^(?:do|does|don't|doesn't)$/i.test(String(item.correct_answer ?? '').trim())
          ? "Completa con do, does, don't o doesn't."
        : /\b(?:not|don't|doesn't|isn't|aren't|wasn't|weren't|can't|won't)\b/i.test(grammarBlankContext)
          ? 'Completa la frase en negativo.'
          : 'Completa la frase.';
      prompt = category === 'grammar'
        ? `${grammarInstruction}${sentence ? `
${sentence}` : ''}`
        : `${promptEs}${sentence ? `
${sentence}` : ''}`.trim();
      correct = String(item.correct_answer ?? '');
      explanation = `La palabra que completa la frase es “${correct}”. Léela dentro de la oración completa.`;
    } else if (item.type === 'sentence-building') {
      // The legacy source marks topical vocabulary lists as sentence-building items.
      // Never present those lists as a correct sentence or disclose a fabricated key.
      type = 'free-text';
      const words = toTextOptions(item.options, 0).map((option) => option.text).filter(Boolean);
      prompt = `Escribe una frase corta en inglés sobre ${lessonMetadata.get(lessonNumber)?.title ?? 'esta unidad'}. Puedes usar alguna de estas palabras: ${words.join(', ')}.`;
      options = [];
      explanation = 'Comprueba que tu frase tenga sujeto y verbo. Revisa el orden de las palabras y el uso del vocabulario.';
    } else {
      throw new Error(`Unsupported item type '${item.type}' in unit ${lessonNumber}.`);
    }
  }

  let optionsRepaired = false;
  if (type === 'multiple-choice' && correct) {
    const result = makeOptionsUnique(options, correct, optionFallbacks);
    options = result.options;
    optionsRepaired = result.repaired;
  }
  if (type === 'multiple-choice' && (!correct || !options.includes(correct))) {
    throw new Error(`Missing correct option for ${id}.`);
  }
  return {
    id,
    lessonId,
    exerciseNumber: 10000 + ({ vocabulary: 0, grammar: 100, listening: 200, reading: 400 }[category]) + exerciseNumber,
    sectionType: category,
    exerciseType: type === 'sentence-building' ? 'sentence_building' : type === 'fill-blank' ? 'fill_blank' : type === 'free-text' ? 'free_text' : 'multiple_choice',
    prompt,
    options,
    optionsRepaired,
    answerJson: type === 'free-text' ? JSON.stringify({ selfCheck: true }) : JSON.stringify({ correct, ...(item.accepted_answers?.length ? { accepted: item.accepted_answers } : {}) }),
    explanation: explanation ?? '',
    audioText,
    passageText,
    negativeFormChanged: Boolean(item.negative_form_changed),
    duplicateStimulusReplaced: Boolean(item.duplicate_stimulus_replaced),
    contextualStimulusReplaced: Boolean(item.contextual_stimulus_replaced),
  };
}

const rows = [];
for (let lessonNumber = 1; lessonNumber <= 60; lessonNumber += 1) {
  const sourceNumber = sourceUnitByLesson[lessonNumber - 1];
  const unit = loadSourceLesson(sourceNumber);
  const vocabularyPool = [
    ...sectionBlock(unit, 'Vocabulary Introduction'),
    ...sectionBlock(unit, 'Vocabulary in Context'),
  ];
  const vocabulary = vocabularyPool.slice(0, 15);
  const listeningVocabulary = vocabularyPool.slice(10, 15);
  const grammarPool = [
    ...sectionBlock(unit, 'Grammar — Affirmative'),
    ...sectionBlock(unit, 'Grammar — Negative & Questions'),
  ];
  const grammarOptionFallbacks = [
    ...[...grammarPool, ...relatedGrammarItems(sourceNumber)].flatMap((item) => toTextOptions(item.options, 0).map((option) => option.text)),
    ...[...grammarPool, ...relatedGrammarItems(sourceNumber)].map((item) => unmark(item.correct_answer, 0)).filter((answer) => answer && answer !== '[object Object]'),
  ];
  const grammarForWriting = grammarPool
    .filter((item) => item.type === 'fill-blank' || item.type === 'sentence-building')
    .slice(-5);
  const grammarForWritingIds = new Set(grammarForWriting.map((item) => item.interaction_id));
  const invalidGrammarItems = grammarPool.filter((item) => !grammarForWritingIds.has(item.interaction_id) && item.type === 'sentence-building');
  const grammarAnswerItems = grammarForWriting.filter((item) => item.type === 'fill-blank').slice(0, invalidGrammarItems.length);
  if (grammarAnswerItems.length !== invalidGrammarItems.length) {
    throw new Error(`Unit ${lessonNumber}: not enough closed grammar exercises to replace free-writing tasks.`);
  }
  const replacementById = new Map(invalidGrammarItems.map((item, index) => [item.interaction_id, grammarAnswerItems[index]]));
  const grammar = grammarPool
    .filter((item) => !grammarForWritingIds.has(item.interaction_id))
    .map((item) => replacementById.get(item.interaction_id) ?? item);
  const distinctGrammar = distinctGrammarExercises(grammar, sourceNumber, lessonNumber);
  const reassignedGrammarIds = new Set(grammarAnswerItems.map((item) => item.interaction_id));
  const listening = [
    ...sectionBlock(unit, 'Reading Comprehension'),
    ...listeningVocabulary,
  ];
  const readingPool = sectionBlock(unit, 'Reading Comprehension');
  if (readingPool.length < 10) throw new Error(`Unit ${lessonNumber}: expected ten reading comprehension questions.`);
  const reading = [...readingPool.slice(0, 10)];
  const passage = unmark(readingPool[0].transcript, 0);
  const usedAnswers = new Set(reading.map((item) => unmark(item.options.find((option) => option.id === item.correct_answer)?.text, 0).toLocaleLowerCase('en')));
  const stopWords = new Set(['the','and','you','your','his','her','she','him','they','their','this','that','with','from','have','has','are','was','were','for','not','but','too','what','where','when','who','how','can','could','would','there','here','then','than','into','very','some','many','much','does','did','will','are','our','its','one']);
  const tokenMatches = [...passage.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g)];
  const candidateWords = [...new Map(tokenMatches.map((match) => match[0]).filter((word) => word.length >= 3 && !stopWords.has(word.toLocaleLowerCase('en'))).map((word) => [word.toLocaleLowerCase('en'), word])).values()];
  for (const answer of candidateWords) {
    if (reading.length === 15) break;
    const answerIndex = tokenMatches.find((match) => match[0].toLocaleLowerCase('en') === answer.toLocaleLowerCase('en'))?.index ?? -1;
    if (answerIndex < 0) continue;
    const left = Math.max(passage.lastIndexOf('.', answerIndex), passage.lastIndexOf('!', answerIndex), passage.lastIndexOf('?', answerIndex)) + 1;
    const ends = ['.', '!', '?'].map((mark) => passage.indexOf(mark, answerIndex)).filter((index) => index >= 0);
    const right = ends.length ? Math.min(...ends) + 1 : passage.length;
    const sentence = passage.slice(left, right).trim();
    const relativeIndex = answerIndex - left;
    if (relativeIndex < 0) continue;
    const clozeSentence = sentence.slice(0, relativeIndex) + '______' + sentence.slice(relativeIndex + answer.length);
    const distractors = candidateWords.filter((word) => word.toLocaleLowerCase('en') !== answer.toLocaleLowerCase('en')).slice(0, 2);
    if (distractors.length < 2) continue;
    reading.push({ transcript: readingPool[0].transcript, question_en: '', options: [{id:'r1',text:`[[${answer}|${answer}]]`},{id:'r2',text:`[[${distractors[0]}|${distractors[0]}]]`},{id:'r3',text:`[[${distractors[1]}|${distractors[1]}]]`}], correct_answer: 'r1', clozeSentence, completedSentence: sentence });
    usedAnswers.add(answer.toLocaleLowerCase('en'));
  }
  if (reading.length !== 15) throw new Error(`Unit ${lessonNumber}: could only build ${reading.length - 10} additional closed reading tasks.`);
  const sections = { vocabulary, grammar: distinctGrammar, listening, reading };
  const optionFallbacksBySection = {
    vocabulary: vocabularyPool.flatMap((item) => toTextOptions(item.options, 0).map((option) => option.text)),
    grammar: grammarOptionFallbacks,
    listening: listening.flatMap((item) => toTextOptions(item.options, item.transcript ? 0 : 1).map((option) => option.text)),
    reading: reading.flatMap((item) => toTextOptions(item.options, 0).map((option) => option.text)),
  };
  for (const [category, items] of Object.entries(sections)) {
    if (items.length !== 15) throw new Error(`Unit ${lessonNumber}: ${category} has ${items.length}, expected 15.`);
    if (category === 'grammar' && items.some((item) => item.type === 'free-text' || item.type === 'sentence-building')) {
      throw new Error(`Unit ${lessonNumber}: grammar must not contain free writing or invalid sentence-building tasks.`);
    }
    if (category === 'grammar' && (items[8].type === 'free-text' || items[9].type === 'free-text' || items[8].type === 'sentence-building' || items[9].type === 'sentence-building')) {
      throw new Error(`Unit ${lessonNumber}: grammar exercises 9 and 10 must not be free writing.`);
    }
    rows.push(...items.map((item, index) => normalizeSourceItem(item, category, lessonNumber, index + 1, optionFallbacksBySection[category])));
  }
}

const statements = [
  '-- Add explicit skill categories and audio stimuli to the A1 exercise bank.',
  'ALTER TABLE learning_exercises ADD COLUMN section_type TEXT NOT NULL DEFAULT \'practice\';',
  'ALTER TABLE learning_exercises ADD COLUMN audio_text TEXT;',
  'CREATE INDEX IF NOT EXISTS idx_learning_exercises_lesson_section ON learning_exercises(lesson_id, section_type, exercise_number);',
  '',
  '-- 15 skill-targeted exercises for each of 60 units: vocabulary, grammar, listening and reading.',
];
for (const row of rows) {
  statements.push(`INSERT INTO learning_exercises (id, lesson_id, exercise_number, exercise_type, prompt, options_json, answer_json, explanation, section_type, audio_text) VALUES (${[
    row.id, row.lessonId, row.exerciseNumber, row.exerciseType, row.prompt, JSON.stringify(row.options), row.answerJson, row.explanation, row.sectionType, row.audioText,
  ].map(sql).join(', ')});`);
}

fs.writeFileSync(outputPath, `${statements.join('\n')}\n`, 'utf8');
const corrections = [];
for (const row of rows) {
  if (row.sectionType === 'grammar' && [10109, 10110].includes(row.exerciseNumber)) {
    corrections.push(`UPDATE learning_exercises SET exercise_type = ${sql(row.exerciseType)}, prompt = ${sql(row.prompt)}, options_json = ${sql(JSON.stringify(row.options))}, answer_json = ${sql(row.answerJson)}, explanation = ${sql(row.explanation)} WHERE id = ${sql(row.id)};`);
  } else if (row.sectionType === 'vocabulary' && [10011, 10012, 10013, 10014].includes(row.exerciseNumber)) {
    corrections.push(`UPDATE learning_exercises SET prompt = ${sql(row.prompt)}, explanation = ${sql(row.explanation)} WHERE id = ${sql(row.id)};`);
  } else if (row.sectionType === 'grammar' && [10107, 10113, 10114, 10115].includes(row.exerciseNumber) && row.optionsRepaired) {
    corrections.push(`UPDATE learning_exercises SET options_json = ${sql(JSON.stringify(row.options))} WHERE id = ${sql(row.id)};`);
  }
}
const readingUpdates = rows.filter((row) => row.sectionType === 'reading').map((row) =>
  `UPDATE learning_exercises SET exercise_number = ${row.exerciseNumber}, exercise_type = ${sql(row.exerciseType)}, prompt = ${sql(row.prompt)}, options_json = ${sql(JSON.stringify(row.options))}, answer_json = ${sql(row.answerJson)}, explanation = ${sql(row.explanation)}, section_type = 'reading', audio_text = ${sql(row.passageText)} WHERE id = ${sql(row.id)};`
);
const descriptionUpdate = `UPDATE learning_courses SET description = 'Curso A1 desde cero con 60 unidades y apartados de gramática, vocabulario, listening y comprensión lectora.', updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = 'english-a1';`;
const readingChunks = [];
for (let index = 0; index < readingUpdates.length; index += 50) readingChunks.push(readingUpdates.slice(index, index + 50));
readingChunks.forEach((chunk, index) => {
  const parts = index === readingChunks.length - 1 && chunk.length > 40 ? [chunk.slice(0, 40), chunk.slice(40)] : [chunk];
  parts.forEach((part, partIndex) => {
    const migrationIndex = index + partIndex;
    const migrationNumber = String(9 + migrationIndex).padStart(3, '0');
    const suffix = migrationIndex === 0 ? '' : `_${String(migrationIndex + 1).padStart(2, '0')}`;
    const migrationPath = path.join(migrationDir, `202610290${migrationNumber}_a1_reading_comprehension${suffix}.sql`);
    const batchCount = readingChunks.length + (parts.length - 1);
    const preamble = migrationIndex === 0 ? `-- Replace the former Writing section with closed A1 reading comprehension.\nDELETE FROM learning_exercise_progress WHERE exercise_id LIKE 'a1-u%-wri-%';\n${descriptionUpdate}\n` : `-- Continue the A1 reading comprehension conversion (batch ${migrationIndex + 1}/${batchCount}).\n`;
    fs.writeFileSync(migrationPath, `${preamble}${part.join('\n')}\n`, 'utf8');
  });
});
const grammarPromptUpdates = rows.filter((row) => row.sectionType === 'grammar' && row.exerciseType === 'fill_blank').map((row) =>
  `UPDATE learning_exercises SET prompt = ${sql(row.prompt)} WHERE id = ${sql(row.id)};`
);
const grammarPromptBatchSize = 40;
for (let index = 0; index < grammarPromptUpdates.length; index += grammarPromptBatchSize) {
  const batch = grammarPromptUpdates.slice(index, index + grammarPromptBatchSize);
  const migrationNumber = String(39 + Math.floor(index / grammarPromptBatchSize)).padStart(3, '0');
  const migrationPath = path.join(migrationDir, `202610290${migrationNumber}_a1_grammar_prompt_alignment.sql`);
  fs.writeFileSync(migrationPath, `-- Align grammar fill-in prompts with statement polarity and questions.\n${batch.join('\n')}\n`, 'utf8');
}
for (const row of rows.filter((item) => item.sectionType === 'grammar' && item.exerciseType === 'fill_blank')) {
  if (/afirmativa|affirmative/i.test(row.prompt)) throw new Error(`Misleading affirmative instruction remains on ${row.id}`);
}
const grammarRepairRows = rows.filter((row) => row.sectionType === 'grammar' && (row.negativeFormChanged || row.optionsRepaired));
const duplicateChoiceRows = rows.filter((row) => row.exerciseType === 'multiple_choice' && new Set(row.options.map((option) => option.trim().toLocaleLowerCase('en'))).size !== row.options.length);
if (duplicateChoiceRows.length) throw new Error(`Found duplicate answer choices in ${duplicateChoiceRows.length} exercises: ${duplicateChoiceRows.slice(0, 5).map((row) => row.id).join(', ')}`);
const grammarRepairBatchSize = 40;
for (let index = 0; index < grammarRepairRows.length; index += grammarRepairBatchSize) {
  const batch = grammarRepairRows.slice(index, index + grammarRepairBatchSize);
  const migrationNumber = String(52 + Math.floor(index / grammarRepairBatchSize)).padStart(3, '0');
  const migrationPath = path.join(migrationDir, `202610290${migrationNumber}_a1_grammar_negative_and_choices.sql`);
  const clearProgress = `DELETE FROM learning_exercise_progress WHERE exercise_id IN (${batch.map((row) => sql(row.id)).join(', ')});`;
  const updates = batch.map((row) => `UPDATE learning_exercises SET exercise_type = ${sql(row.exerciseType)}, prompt = ${sql(row.prompt)}, options_json = ${sql(JSON.stringify(row.options))}, answer_json = ${sql(row.answerJson)}, explanation = ${sql(row.explanation)} WHERE id = ${sql(row.id)};`);
  fs.writeFileSync(migrationPath, `-- Make negative grammar answers learner-produced and remove repeated choices.\n${clearProgress}\n${updates.join('\n')}\n`, 'utf8');
}
const auxiliaryPracticeRows = rows.filter((row) => {
  if (row.sectionType !== 'grammar' || !row.negativeFormChanged) return false;
  try {
    return /^(?:do|does|don't|doesn't)$/i.test(JSON.parse(row.answerJson).correct ?? '');
  } catch {
    return false;
  }
});
for (let index = 0; index < auxiliaryPracticeRows.length; index += grammarRepairBatchSize) {
  const batch = auxiliaryPracticeRows.slice(index, index + grammarRepairBatchSize);
  const migrationNumber = String(59 + Math.floor(index / grammarRepairBatchSize)).padStart(3, '0');
  const migrationPath = path.join(migrationDir, `202610290${migrationNumber}_a1_auxiliary_answer_clarity.sql`);
  const clearProgress = `DELETE FROM learning_exercise_progress WHERE exercise_id IN (${batch.map((row) => sql(row.id)).join(', ')});`;
  const updates = batch.map((row) => `UPDATE learning_exercises SET exercise_type = ${sql(row.exerciseType)}, prompt = ${sql(row.prompt)}, options_json = ${sql(JSON.stringify(row.options))}, answer_json = ${sql(row.answerJson)}, explanation = ${sql(row.explanation)} WHERE id = ${sql(row.id)};`);
  fs.writeFileSync(migrationPath, `-- Make do/does/don't/doesn't practice ask for the auxiliary only.\n${clearProgress}\n${updates.join('\n')}\n`, 'utf8');
}
const exerciseRefreshChunkSize = 25;
const exerciseRefreshMigrationSize = 300;
const exerciseRefreshMigrations = [];
function exerciseRefreshStatement(batch) {
  const fields = {
    lesson_id: (row) => row.lessonId,
    exercise_number: (row) => row.exerciseNumber,
    exercise_type: (row) => row.exerciseType,
    prompt: (row) => row.prompt,
    options_json: (row) => JSON.stringify(row.options),
    answer_json: (row) => row.answerJson,
    explanation: (row) => row.explanation,
    section_type: (row) => row.sectionType,
    audio_text: (row) => row.sectionType === 'reading' ? row.passageText : row.audioText,
  };
  const assignments = Object.entries(fields).map(([field, value]) =>
    `${field} = CASE id ${batch.map((row) => `WHEN ${sql(row.id)} THEN ${sql(value(row))}`).join(' ')} ELSE ${field} END`
  );
  const ids = batch.map((row) => sql(row.id)).join(', ');
  return `UPDATE learning_exercises SET ${assignments.join(', ')} WHERE id IN (${ids});`;
}
for (let start = 0; start < rows.length; start += exerciseRefreshMigrationSize) {
  const migrationIndex = Math.floor(start / exerciseRefreshMigrationSize);
  const migrationNumber = String(60 + migrationIndex).padStart(3, '0');
  const migrationPath = path.join(migrationDir, `202610290${migrationNumber}_a1_unique_exercise_bank.sql`);
  const batch = rows.slice(start, start + exerciseRefreshMigrationSize);
  const statements = [];
  for (let offset = 0; offset < batch.length; offset += exerciseRefreshChunkSize) {
    const chunk = batch.slice(offset, offset + exerciseRefreshChunkSize);
    statements.push(exerciseRefreshStatement(chunk));
    const ids = chunk.map((row) => sql(row.id)).join(', ');
    // Keep learner answers, but recalculate correctness/review feedback against the new prompts.
    statements.push(`UPDATE learning_exercise_progress SET correct = NULL, explanation = '', review_json = NULL, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE exercise_id IN (${ids});`);
  }
  fs.writeFileSync(migrationPath, `-- Refresh each A1 unit from its own non-reused content source (batch ${migrationIndex + 1}).\n${statements.join('\n')}\n`, 'utf8');
  exerciseRefreshMigrations.push(migrationPath);
}
const lessonMetadataUpdates = curriculumTitles.map((title, index) => {
  const lessonNumber = index + 1;
  const objective = `Practicar ${title.toLocaleLowerCase('es')} con vocabulario y estructuras del nivel A1.`;
  const content = JSON.stringify({
    objective,
    sections: [
      { type: 'learn', title: 'Learn', body: objective },
      { type: 'practice', title: 'Practice', body: 'Completa las actividades de vocabulario, gramática, comprensión auditiva y comprensión lectora de esta unidad.' },
    ],
    reviewEnabled: true,
  });
  return `UPDATE learning_lessons SET title = ${sql(title)}, objective = ${sql(objective)}, content_json = ${sql(content)} WHERE id = ${sql(`a1-${String(lessonNumber).padStart(2, '0')}`)};`;
});
const metadataMigrationNumber = String(60 + exerciseRefreshMigrations.length).padStart(3, '0');
const metadataMigrationPath = path.join(migrationDir, `202610290${metadataMigrationNumber}_a1_unique_lesson_content_alignment.sql`);
fs.writeFileSync(metadataMigrationPath, `-- Align each A1 lesson title with its unique exercise source.\n${lessonMetadataUpdates.join('\n')}\n`, 'utf8');
console.log(`Generated ${rows.length} exercises (15 in each of 4 sections across 60 units): ${path.relative(root, outputPath)}`);
console.log(`Regenerated ${grammarPromptUpdates.length} complete grammar fill-in prompts across ${Math.ceil(grammarPromptUpdates.length / grammarPromptBatchSize)} D1-safe migrations.`);
console.log(`Corrected ${grammarRepairRows.length} negative-form or duplicate-choice exercises; ${duplicateChoiceRows.length} duplicate-choice exercises remain.`);
console.log(`Clarified ${auxiliaryPracticeRows.length} auxiliary-only grammar answers in ${Math.ceil(auxiliaryPracticeRows.length / grammarRepairBatchSize)} additional migration(s).`);
console.log(`Prepared ${rows.length} unique-source exercise updates across ${exerciseRefreshMigrations.length} learner-safe migration(s).`);
console.log(`Aligned titles and objectives for ${lessonMetadataUpdates.length} unique lesson sources.`);

