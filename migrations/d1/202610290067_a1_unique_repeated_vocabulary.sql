-- Replace repeated vocabulary prompts with lesson-specific A1 practice.
-- All updates retain existing exercise IDs and lesson numbering.

UPDATE learning_exercises SET
 prompt = '¿Qué forma negativa significa «no es» con he, she o it?',
 options_json = '["isn''t","aren''t","am not","don''t"]',
 answer_json = '{"correct":"isn''t"}',
 explanation = 'Usamos «isn''t» con he, she e it.'
WHERE id = 'a1-u28-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué forma negativa significa «no son» con they o we?',
 options_json = '["isn''t","aren''t","am not","doesn''t"]',
 answer_json = '{"correct":"aren''t"}',
 explanation = 'Usamos «aren''t» con we, you y they.'
WHERE id = 'a1-u28-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué forma negativa se usa con «I»?',
 options_json = '["isn''t","aren''t","am not","doesn''t"]',
 answer_json = '{"correct":"am not"}',
 explanation = 'La forma negativa de «I am» es «I am not».'
WHERE id = 'a1-u28-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra expresa negación en inglés?',
 options_json = '["not","very","always","there"]',
 answer_json = '{"correct":"not"}',
 explanation = '«Not» se usa para formar una negación.'
WHERE id = 'a1-u28-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Estás listo/a?»?',
 options_json = '["Are you ready?","Is she ready?","Are they ready?","Am I ready?"]',
 answer_json = '{"correct":"Are you ready?"}',
 explanation = '«Are you ready?» pregunta si tú estás listo/a.'
WHERE id = 'a1-u29-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Está ella en casa?»?',
 options_json = '["Are you at home?","Is she at home?","Are they at home?","Is he at home?"]',
 answer_json = '{"correct":"Is she at home?"}',
 explanation = '«Is she at home?» pregunta por ella.'
WHERE id = 'a1-u29-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Están ellos contentos?»?',
 options_json = '["Is he happy?","Are you happy?","Are they happy?","Is she happy?"]',
 answer_json = '{"correct":"Are they happy?"}',
 explanation = '«Are they happy?» pregunta por ellos.'
WHERE id = 'a1-u29-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Llego tarde?»?',
 options_json = '["Am I late?","Are you late?","Is it late?","Are we late?"]',
 answer_json = '{"correct":"Am I late?"}',
 explanation = '«Am I late?» pregunta si yo llego tarde.'
WHERE id = 'a1-u29-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «nombre completo»?',
 options_json = '["full name","surname","first name","phone number"]',
 answer_json = '{"correct":"full name"}',
 explanation = '«Full name» significa «nombre completo».'
WHERE id = 'a1-u30-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «apellido»?',
 options_json = '["address","surname","age","nationality"]',
 answer_json = '{"correct":"surname"}',
 explanation = '«Surname» significa «apellido».'
WHERE id = 'a1-u30-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «nacionalidad»?',
 options_json = '["nationality","birthday","address","occupation"]',
 answer_json = '{"correct":"nationality"}',
 explanation = '«Nationality» significa «nacionalidad».'
WHERE id = 'a1-u30-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «dirección» de una casa?',
 options_json = '["age","address","surname","country"]',
 answer_json = '{"correct":"address"}',
 explanation = '«Address» significa «dirección».'
WHERE id = 'a1-u30-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué adjetivo posesivo significa «mi»?',
 options_json = '["my","your","his","her"]',
 answer_json = '{"correct":"my"}',
 explanation = '«My» significa «mi».'
WHERE id = 'a1-u32-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué adjetivo posesivo significa «tu» o «su» de usted?',
 options_json = '["our","their","your","his"]',
 answer_json = '{"correct":"your"}',
 explanation = '«Your» significa «tu» o «su» de usted.'
WHERE id = 'a1-u32-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué adjetivo posesivo significa «su» de él?',
 options_json = '["her","his","my","our"]',
 answer_json = '{"correct":"his"}',
 explanation = '«His» significa «su» cuando hablamos de un hombre o niño.'
WHERE id = 'a1-u32-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué adjetivo posesivo significa «su» de ella?',
 options_json = '["their","your","his","her"]',
 answer_json = '{"correct":"her"}',
 explanation = '«Her» significa «su» cuando hablamos de una mujer o niña.'
WHERE id = 'a1-u32-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué nacionalidad corresponde a Spain?',
 options_json = '["Spanish","Italian","French","German"]',
 answer_json = '{"correct":"Spanish"}',
 explanation = 'La nacionalidad de Spain es «Spanish».'
WHERE id = 'a1-u34-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué nacionalidad corresponde a Italy?',
 options_json = '["French","German","Italian","Spanish"]',
 answer_json = '{"correct":"Italian"}',
 explanation = 'La nacionalidad de Italy es «Italian».'
WHERE id = 'a1-u34-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué nacionalidad corresponde a France?',
 options_json = '["German","French","Spanish","Italian"]',
 answer_json = '{"correct":"French"}',
 explanation = 'La nacionalidad de France es «French».'
WHERE id = 'a1-u34-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué nacionalidad corresponde a Germany?',
 options_json = '["Italian","Spanish","German","French"]',
 answer_json = '{"correct":"German"}',
 explanation = 'La nacionalidad de Germany es «German».'
WHERE id = 'a1-u34-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «mis padres»?',
 options_json = '["my parents","my cousins","my friends","my teachers"]',
 answer_json = '{"correct":"my parents"}',
 explanation = '«My parents» significa «mis padres».'
WHERE id = 'a1-u36-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «mi hermano mayor»?',
 options_json = '["my younger brother","my older brother","my older sister","my uncle"]',
 answer_json = '{"correct":"my older brother"}',
 explanation = '«My older brother» significa «mi hermano mayor».'
WHERE id = 'a1-u36-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «mi hermana pequeña»?',
 options_json = '["my older sister","my younger sister","my aunt","my daughter"]',
 answer_json = '{"correct":"my younger sister"}',
 explanation = '«My younger sister» significa «mi hermana pequeña».'
WHERE id = 'a1-u36-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué frase significa «Esta es mi familia»?',
 options_json = '["This is my family","These are my friends","That is my house","Here is my school"]',
 answer_json = '{"correct":"This is my family"}',
 explanation = '«This is my family» significa «Esta es mi familia».'
WHERE id = 'a1-u36-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Te gusta el café?»?',
 options_json = '["Do you like coffee?","Does she like coffee?","Are you coffee?","What coffee is it?"]',
 answer_json = '{"correct":"Do you like coffee?"}',
 explanation = 'Usamos «do» para preguntar por hábitos con «you».'
WHERE id = 'a1-u40-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Trabaja ella aquí?»?',
 options_json = '["Do they work here?","Does she work here?","Is she work here?","Does she works here?"]',
 answer_json = '{"correct":"Does she work here?"}',
 explanation = 'Con «she», usamos «does» y el verbo base «work».'
WHERE id = 'a1-u40-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué auxiliar usamos para negar un hábito con «I»?',
 options_json = '["doesn''t","don''t","isn''t","aren''t"]',
 answer_json = '{"correct":"don''t"}',
 explanation = 'Usamos «don''t» para negar hábitos con I, you, we y they.'
WHERE id = 'a1-u40-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué auxiliar usamos para negar un hábito con «he»?',
 options_json = '["don''t","aren''t","doesn''t","am not"]',
 answer_json = '{"correct":"doesn''t"}',
 explanation = 'Usamos «doesn''t» para negar hábitos con he, she e it.'
WHERE id = 'a1-u40-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «despertarse»?',
 options_json = '["wake up","get dressed","have breakfast","go home"]',
 answer_json = '{"correct":"wake up"}',
 explanation = '«Wake up» significa «despertarse».'
WHERE id = 'a1-u42-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «vestirse»?',
 options_json = '["go home","wake up","get dressed","go to bed"]',
 answer_json = '{"correct":"get dressed"}',
 explanation = '«Get dressed» significa «vestirse».'
WHERE id = 'a1-u42-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «desayunar»?',
 options_json = '["have dinner","have breakfast","get dressed","go to work"]',
 answer_json = '{"correct":"have breakfast"}',
 explanation = '«Have breakfast» significa «desayunar».'
WHERE id = 'a1-u42-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «volver a casa»?',
 options_json = '["go to bed","go to work","have lunch","go home"]',
 answer_json = '{"correct":"go home"}',
 explanation = '«Go home» significa «ir o volver a casa».'
WHERE id = 'a1-u42-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra describe un sustantivo que se refiere a una sola cosa?',
 options_json = '["singular","plural","verb","adjective"]',
 answer_json = '{"correct":"singular"}',
 explanation = '«Singular» se refiere a una sola persona o cosa.'
WHERE id = 'a1-u44-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra describe un sustantivo que se refiere a más de una cosa?',
 options_json = '["singular","plural","article","pronoun"]',
 answer_json = '{"correct":"plural"}',
 explanation = '«Plural» se refiere a dos o más personas o cosas.'
WHERE id = 'a1-u44-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué opción completa correctamente «___ apple»?',
 options_json = '["a","an","the","some"]',
 answer_json = '{"correct":"an"}',
 explanation = 'Usamos «an» antes de un sonido vocálico, como en «an apple».'
WHERE id = 'a1-u44-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué opción completa correctamente «___ book»?',
 options_json = '["an","some","a","any"]',
 answer_json = '{"correct":"a"}',
 explanation = 'Usamos «a» antes de un sonido consonántico, como en «a book».'
WHERE id = 'a1-u44-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «Me gustaría un café»?',
 options_json = '["I would like a coffee","I have a coffee","I am a coffee","I like coffee yesterday"]',
 answer_json = '{"correct":"I would like a coffee"}',
 explanation = '«I would like…» es una forma educada de pedir algo.'
WHERE id = 'a1-u50-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta sirve para pedir algo en una cafetería?',
 options_json = '["Can I have a tea, please?","Where are you from?","What day is it?","How old are you?"]',
 answer_json = '{"correct":"Can I have a tea, please?"}',
 explanation = '«Can I have…?» es una forma cortés de pedir algo.'
WHERE id = 'a1-u50-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «por favor»?',
 options_json = '["please","sorry","welcome","goodbye"]',
 answer_json = '{"correct":"please"}',
 explanation = '«Please» añade cortesía a una petición.'
WHERE id = 'a1-u50-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «la cuenta, por favor»?',
 options_json = '["the menu, please","the bill, please","a table, please","a glass, please"]',
 answer_json = '{"correct":"the bill, please"}',
 explanation = '«The bill, please» se usa para pedir la cuenta.'
WHERE id = 'a1-u50-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Cuánto cuesta?»?',
 options_json = '["How much is it?","How old is it?","How many is it?","What time is it?"]',
 answer_json = '{"correct":"How much is it?"}',
 explanation = '«How much is it?» pregunta el precio.'
WHERE id = 'a1-u51-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «libra» como moneda?',
 options_json = '["pound","penny","price","change"]',
 answer_json = '{"correct":"pound"}',
 explanation = '«Pound» es la moneda del Reino Unido.'
WHERE id = 'a1-u51-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «barato»?',
 options_json = '["expensive","cheap","large","heavy"]',
 answer_json = '{"correct":"cheap"}',
 explanation = '«Cheap» significa «barato».'
WHERE id = 'a1-u51-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «caro»?',
 options_json = '["cheap","small","expensive","free"]',
 answer_json = '{"correct":"expensive"}',
 explanation = '«Expensive» significa «caro».'
WHERE id = 'a1-u51-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Algo más?» en una cafetería?',
 options_json = '["Anything else?","How old are you?","Where is the station?","What day is it?"]',
 answer_json = '{"correct":"Anything else?"}',
 explanation = '«Anything else?» se usa para preguntar si el cliente quiere algo más.'
WHERE id = 'a1-u54-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué frase significa «Eso es todo, gracias»?',
 options_json = '["That is all, thank you","I am from Spain","Can you repeat that?","See you yesterday"]',
 answer_json = '{"correct":"That is all, thank you"}',
 explanation = '«That is all, thank you» indica que no se desea nada más.'
WHERE id = 'a1-u54-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué petición significa «¿Me trae la carta, por favor?»?',
 options_json = '["Could I have the menu, please?","How much is your name?","What time is the train?","Where do you live?"]',
 answer_json = '{"correct":"Could I have the menu, please?"}',
 explanation = '«Could I have…?» es una petición educada.'
WHERE id = 'a1-u54-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «Aquí tiene su cambio»?',
 options_json = '["Here is your change","Here is your room","This is your birthday","There are your shoes"]',
 answer_json = '{"correct":"Here is your change"}',
 explanation = '«Here is your change» se usa al devolver el cambio.'
WHERE id = 'a1-u54-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «número de teléfono»?',
 options_json = '["phone number","date of birth","home address","first name"]',
 answer_json = '{"correct":"phone number"}',
 explanation = '«Phone number» significa «número de teléfono».'
WHERE id = 'a1-u55-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «fecha de nacimiento»?',
 options_json = '["phone number","date of birth","family name","house number"]',
 answer_json = '{"correct":"date of birth"}',
 explanation = '«Date of birth» significa «fecha de nacimiento».'
WHERE id = 'a1-u55-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «edad»?',
 options_json = '["age","address","price","month"]',
 answer_json = '{"correct":"age"}',
 explanation = '«Age» significa «edad».'
WHERE id = 'a1-u55-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «código postal»?',
 options_json = '["postcode","surname","birthday","phone"]',
 answer_json = '{"correct":"postcode"}',
 explanation = '«Postcode» significa «código postal».'
WHERE id = 'a1-u55-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué frase significa «¿Puedes repetirlo?»?',
 options_json = '["Could you repeat that?","Where are you from?","How much is it?","What day is it?"]',
 answer_json = '{"correct":"Could you repeat that?"}',
 explanation = '«Could you repeat that?» sirve para pedir que repitan algo.'
WHERE id = 'a1-u58-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué frase significa «No lo entiendo»?',
 options_json = '["I do not understand","I am not hungry","I do not live here","I am not a teacher"]',
 answer_json = '{"correct":"I do not understand"}',
 explanation = '«I do not understand» significa «No lo entiendo».'
WHERE id = 'a1-u58-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué petición significa «¿Puedes hablar despacio?»?',
 options_json = '["Can you speak slowly?","Can you drive a car?","Can you open the door?","Can you play tennis?"]',
 answer_json = '{"correct":"Can you speak slowly?"}',
 explanation = '«Can you speak slowly?» pide que alguien hable más despacio.'
WHERE id = 'a1-u58-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué frase significa «Gracias por tu ayuda»?',
 options_json = '["Thank you for your help","See you next week","Good night and goodbye","I am twenty years old"]',
 answer_json = '{"correct":"Thank you for your help"}',
 explanation = '«Thank you for your help» agradece la ayuda recibida.'
WHERE id = 'a1-u58-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión se usa para llamar educadamente la atención?',
 options_json = '["Excuse me","Good night","I am fine","See you later"]',
 answer_json = '{"correct":"Excuse me"}',
 explanation = '«Excuse me» sirve para llamar la atención o pedir paso.'
WHERE id = 'a1-u59-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Dónde está la estación?»?',
 options_json = '["Where is the station?","What is your name?","How much is the ticket?","What time do you eat?"]',
 answer_json = '{"correct":"Where is the station?"}',
 explanation = '«Where is the station?» pide indicaciones para llegar a la estación.'
WHERE id = 'a1-u59-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Puedes ayudarme?»?',
 options_json = '["Can you help me?","Can I help you?","Do you like me?","Are you at home?"]',
 answer_json = '{"correct":"Can you help me?"}',
 explanation = '«Can you help me?» pide ayuda.'
WHERE id = 'a1-u59-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué frase significa «Necesito un billete»?',
 options_json = '["I need a ticket","I have a sandwich","I am a ticket","I need a table"]',
 answer_json = '{"correct":"I need a ticket"}',
 explanation = '«I need a ticket» significa «Necesito un billete».'
WHERE id = 'a1-u59-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué instrucción significa «Preséntate»?',
 options_json = '["Introduce yourself","Ask for directions","Order a drink","Tell the time"]',
 answer_json = '{"correct":"Introduce yourself"}',
 explanation = '«Introduce yourself» significa «preséntate».'
WHERE id = 'a1-u60-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «Pedir indicaciones»?',
 options_json = '["Ask for directions","Introduce yourself","Order a drink","Read the menu"]',
 answer_json = '{"correct":"Ask for directions"}',
 explanation = '«Ask for directions» significa «pedir indicaciones».'
WHERE id = 'a1-u60-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «Pedir una bebida»?',
 options_json = '["Tell the time","Order a drink","Ask for directions","Spell your name"]',
 answer_json = '{"correct":"Order a drink"}',
 explanation = '«Order a drink» significa «pedir una bebida».'
WHERE id = 'a1-u60-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «Decir la hora»?',
 options_json = '["Introduce yourself","Read a book","Tell the time","Buy a ticket"]',
 answer_json = '{"correct":"Tell the time"}',
 explanation = '«Tell the time» significa «decir la hora».'
WHERE id = 'a1-u60-voc-14';
