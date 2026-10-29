-- Temporarily disable the update guard while legacy duplicate prompts are realigned across migrations 066–069.
-- The guard is restored at the end of migration 069.
DROP TRIGGER IF EXISTS trg_learning_exercises_no_duplicate_prompt_update;

-- Replace repeated vocabulary prompts with lesson-specific calendar and date practice.
-- All existing exercise IDs remain unchanged.

UPDATE learning_exercises SET
 prompt = 'Elige el número en inglés que corresponde a «veintiuno».',
 options_json = '["twenty-one","twenty-two","thirty-one","forty-one"]',
 answer_json = '{"correct":"twenty-one"}',
 explanation = '«Twenty-one» significa «veintiuno».'
WHERE id = 'a1-u11-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige el número en inglés que corresponde a «treinta y cuatro».',
 options_json = '["thirty-four","thirty-five","forty-four","twenty-four"]',
 answer_json = '{"correct":"thirty-four"}',
 explanation = '«Thirty-four» significa «treinta y cuatro».'
WHERE id = 'a1-u11-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige el número en inglés que corresponde a «cuarenta y seis».',
 options_json = '["forty-five","forty-six","fifty-six","forty-seven"]',
 answer_json = '{"correct":"forty-six"}',
 explanation = '«Forty-six» significa «cuarenta y seis».'
WHERE id = 'a1-u11-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige el número en inglés que corresponde a «cincuenta y ocho».',
 options_json = '["fifty-six","sixty-eight","fifty-eight","fifty-nine"]',
 answer_json = '{"correct":"fifty-eight"}',
 explanation = '«Fifty-eight» significa «cincuenta y ocho».'
WHERE id = 'a1-u11-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Cuántos años tienes?»?',
 options_json = '["How old are you?","How are you?","What day is it?","What is your name?"]',
 answer_json = '{"correct":"How old are you?"}',
 explanation = '«How old are you?» pregunta la edad.'
WHERE id = 'a1-u12-voc-11';

UPDATE learning_exercises SET
 prompt = 'Completa la expresión que indica la edad: «I am ten ___ old».',
 options_json = '["days","years","months","weeks"]',
 answer_json = '{"correct":"years"}',
 explanation = 'La expresión habitual es «years old».'
WHERE id = 'a1-u12-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «número de teléfono»?',
 options_json = '["phone number","first name","house number","email address"]',
 answer_json = '{"correct":"phone number"}',
 explanation = '«Phone number» significa «número de teléfono».'
WHERE id = 'a1-u12-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta sirve para pedir el teléfono de alguien?',
 options_json = '["What is your phone number?","How old is your phone?","What day is your birthday?","Where is your school?"]',
 answer_json = '{"correct":"What is your phone number?"}',
 explanation = '«What is your phone number?» pide un número de teléfono.'
WHERE id = 'a1-u12-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Lunes».',
 options_json = '["Monday","Tuesday","Wednesday","Thursday"]',
 answer_json = '{"correct":"Monday"}',
 explanation = '«Monday» significa «lunes».'
WHERE id = 'a1-u13-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Martes».',
 options_json = '["Thursday","Monday","Tuesday","Wednesday"]',
 answer_json = '{"correct":"Tuesday"}',
 explanation = '«Tuesday» significa «martes».'
WHERE id = 'a1-u13-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Miércoles».',
 options_json = '["Tuesday","Wednesday","Friday","Monday"]',
 answer_json = '{"correct":"Wednesday"}',
 explanation = '«Wednesday» significa «miércoles».'
WHERE id = 'a1-u13-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Jueves».',
 options_json = '["Sunday","Wednesday","Friday","Thursday"]',
 answer_json = '{"correct":"Thursday"}',
 explanation = '«Thursday» significa «jueves».'
WHERE id = 'a1-u13-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Viernes».',
 options_json = '["Friday","Saturday","Sunday","Monday"]',
 answer_json = '{"correct":"Friday"}',
 explanation = '«Friday» significa «viernes».'
WHERE id = 'a1-u14-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Sábado».',
 options_json = '["Sunday","Saturday","Thursday","Friday"]',
 answer_json = '{"correct":"Saturday"}',
 explanation = '«Saturday» significa «sábado».'
WHERE id = 'a1-u14-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige la palabra en inglés que corresponde a «Domingo».',
 options_json = '["Tuesday","Friday","Sunday","Saturday"]',
 answer_json = '{"correct":"Sunday"}',
 explanation = '«Sunday» significa «domingo».'
WHERE id = 'a1-u14-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «fin de semana»?',
 options_json = '["weekday","weekend","week","holiday"]',
 answer_json = '{"correct":"weekend"}',
 explanation = '«Weekend» significa «fin de semana».'
WHERE id = 'a1-u14-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué día viene después del lunes?',
 options_json = '["Tuesday","Thursday","Saturday","Sunday"]',
 answer_json = '{"correct":"Tuesday"}',
 explanation = 'Tuesday es el día siguiente a Monday.'
WHERE id = 'a1-u15-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué día viene antes del viernes?',
 options_json = '["Monday","Thursday","Saturday","Wednesday"]',
 answer_json = '{"correct":"Thursday"}',
 explanation = 'Thursday es el día anterior a Friday.'
WHERE id = 'a1-u15-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué día está entre Tuesday y Thursday?',
 options_json = '["Monday","Wednesday","Friday","Sunday"]',
 answer_json = '{"correct":"Wednesday"}',
 explanation = 'Wednesday está entre Tuesday y Thursday.'
WHERE id = 'a1-u15-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué día viene justo antes del domingo?',
 options_json = '["Friday","Monday","Saturday","Tuesday"]',
 answer_json = '{"correct":"Saturday"}',
 explanation = 'Saturday es el día anterior a Sunday.'
WHERE id = 'a1-u15-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «ayer»?',
 options_json = '["today","tomorrow","yesterday","weekday"]',
 answer_json = '{"correct":"yesterday"}',
 explanation = '«Yesterday» significa «ayer».'
WHERE id = 'a1-u16-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «hoy»?',
 options_json = '["tomorrow","today","yesterday","weekend"]',
 answer_json = '{"correct":"today"}',
 explanation = '«Today» significa «hoy».'
WHERE id = 'a1-u16-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «mañana»?',
 options_json = '["yesterday","today","Monday","tomorrow"]',
 answer_json = '{"correct":"tomorrow"}',
 explanation = '«Tomorrow» significa «mañana».'
WHERE id = 'a1-u16-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «el día siguiente»?',
 options_json = '["the day before","the next day","last week","this month"]',
 answer_json = '{"correct":"the next day"}',
 explanation = '«The next day» significa «el día siguiente».'
WHERE id = 'a1-u16-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Qué día es hoy?»?',
 options_json = '["What day is it?","What month is it?","How old are you?","What time is it?"]',
 answer_json = '{"correct":"What day is it?"}',
 explanation = '«What day is it?» pregunta qué día es.'
WHERE id = 'a1-u17-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige la pregunta que pide el día siguiente a hoy.',
 options_json = '["What day was yesterday?","What day is tomorrow?","What month is it?","How are you?"]',
 answer_json = '{"correct":"What day is tomorrow?"}',
 explanation = '«What day is tomorrow?» pregunta qué día será mañana.'
WHERE id = 'a1-u17-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «día laborable»?',
 options_json = '["weekend","weekday","month","date"]',
 answer_json = '{"correct":"weekday"}',
 explanation = '«Weekday» significa un día laborable de lunes a viernes.'
WHERE id = 'a1-u17-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta pide el día anterior?',
 options_json = '["What day comes next?","What day was yesterday?","What month comes next?","What is your birthday?"]',
 answer_json = '{"correct":"What day was yesterday?"}',
 explanation = '«What day was yesterday?» pregunta qué día fue ayer.'
WHERE id = 'a1-u17-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Enero».',
 options_json = '["January","February","March","April"]',
 answer_json = '{"correct":"January"}',
 explanation = '«January» significa «enero».'
WHERE id = 'a1-u19-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Febrero».',
 options_json = '["April","March","February","January"]',
 answer_json = '{"correct":"February"}',
 explanation = '«February» significa «febrero».'
WHERE id = 'a1-u19-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Marzo».',
 options_json = '["February","May","March","April"]',
 answer_json = '{"correct":"March"}',
 explanation = '«March» significa «marzo».'
WHERE id = 'a1-u19-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Abril».',
 options_json = '["June","April","January","March"]',
 answer_json = '{"correct":"April"}',
 explanation = '«April» significa «abril».'
WHERE id = 'a1-u19-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Mayo».',
 options_json = '["May","June","July","August"]',
 answer_json = '{"correct":"May"}',
 explanation = '«May» significa «mayo».'
WHERE id = 'a1-u20-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Junio».',
 options_json = '["August","July","June","May"]',
 answer_json = '{"correct":"June"}',
 explanation = '«June» significa «junio».'
WHERE id = 'a1-u20-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Julio».',
 options_json = '["May","July","August","June"]',
 answer_json = '{"correct":"July"}',
 explanation = '«July» significa «julio».'
WHERE id = 'a1-u20-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Agosto».',
 options_json = '["June","September","August","July"]',
 answer_json = '{"correct":"August"}',
 explanation = '«August» significa «agosto».'
WHERE id = 'a1-u20-voc-14';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Septiembre».',
 options_json = '["October","September","November","December"]',
 answer_json = '{"correct":"September"}',
 explanation = '«September» significa «septiembre».'
WHERE id = 'a1-u21-voc-11';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Octubre».',
 options_json = '["December","November","October","September"]',
 answer_json = '{"correct":"October"}',
 explanation = '«October» significa «octubre».'
WHERE id = 'a1-u21-voc-12';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Noviembre».',
 options_json = '["September","October","November","December"]',
 answer_json = '{"correct":"November"}',
 explanation = '«November» significa «noviembre».'
WHERE id = 'a1-u21-voc-13';

UPDATE learning_exercises SET
 prompt = 'Elige el mes en inglés que corresponde a «Diciembre».',
 options_json = '["November","August","October","December"]',
 answer_json = '{"correct":"December"}',
 explanation = '«December» significa «diciembre».'
WHERE id = 'a1-u21-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «primero» al expresar una fecha?',
 options_json = '["first","second","third","last"]',
 answer_json = '{"correct":"first"}',
 explanation = '«First» se usa para el primer día de un mes.'
WHERE id = 'a1-u22-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «segundo» al expresar una fecha?',
 options_json = '["third","second","fourth","first"]',
 answer_json = '{"correct":"second"}',
 explanation = '«Second» se usa para el segundo día de un mes.'
WHERE id = 'a1-u22-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «tercero» al expresar una fecha?',
 options_json = '["first","fourth","third","second"]',
 answer_json = '{"correct":"third"}',
 explanation = '«Third» se usa para el tercer día de un mes.'
WHERE id = 'a1-u22-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «fecha»?',
 options_json = '["date","daytime","season","weekend"]',
 answer_json = '{"correct":"date"}',
 explanation = '«Date» significa «fecha».'
WHERE id = 'a1-u22-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué palabra significa «cumpleaños»?',
 options_json = '["birthday","holiday","weekday","calendar"]',
 answer_json = '{"correct":"birthday"}',
 explanation = '«Birthday» significa «cumpleaños».'
WHERE id = 'a1-u23-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «pastel de cumpleaños»?',
 options_json = '["birthday card","birthday cake","birthday date","birthday month"]',
 answer_json = '{"correct":"birthday cake"}',
 explanation = '«Birthday cake» significa «pastel de cumpleaños».'
WHERE id = 'a1-u23-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué verbo se usa en «I was ___ in May» para decir «nací»?',
 options_json = '["born","birthday","age","date"]',
 answer_json = '{"correct":"born"}',
 explanation = 'La expresión «was born» significa «nació/nací».'
WHERE id = 'a1-u23-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué pregunta significa «¿Cuándo es tu cumpleaños?»?',
 options_json = '["When is your birthday?","How old are you?","What day is it?","What is your phone number?"]',
 answer_json = '{"correct":"When is your birthday?"}',
 explanation = '«When is your birthday?» pregunta la fecha del cumpleaños.'
WHERE id = 'a1-u23-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «este mes»?',
 options_json = '["last month","next month","this month","every month"]',
 answer_json = '{"correct":"this month"}',
 explanation = '«This month» significa «este mes».'
WHERE id = 'a1-u24-voc-11';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «el mes pasado»?',
 options_json = '["next month","last month","this year","today"]',
 answer_json = '{"correct":"last month"}',
 explanation = '«Last month» significa «el mes pasado».'
WHERE id = 'a1-u24-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «el mes que viene»?',
 options_json = '["last month","this month","next month","last year"]',
 answer_json = '{"correct":"next month"}',
 explanation = '«Next month» significa «el mes que viene».'
WHERE id = 'a1-u24-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «cada año»?',
 options_json = '["every week","every day","every year","next year"]',
 answer_json = '{"correct":"every year"}',
 explanation = '«Every year» significa «cada año».'
WHERE id = 'a1-u24-voc-14';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «en junio»?',
 options_json = '["on June","at June","in June","by June"]',
 answer_json = '{"correct":"in June"}',
 explanation = 'Usamos «in» con los meses.'
WHERE id = 'a1-u56-voc-12';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «el cinco de mayo»?',
 options_json = '["on the fifth of May","in the fifth May","at five May","on May fifths"]',
 answer_json = '{"correct":"on the fifth of May"}',
 explanation = '«On the fifth of May» expresa una fecha.'
WHERE id = 'a1-u56-voc-13';

UPDATE learning_exercises SET
 prompt = '¿Qué expresión significa «el martes»?',
 options_json = '["on Tuesday","in Tuesday","at Tuesday","by Tuesday"]',
 answer_json = '{"correct":"on Tuesday"}',
 explanation = 'Usamos «on» con los días de la semana.'
WHERE id = 'a1-u56-voc-14';
