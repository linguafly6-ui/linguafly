# Auditoría del catálogo académico — 2026-10-31

## Alcance y fuente

Auditoría de solo lectura sobre la base D1 de aprendizaje de producción `linguafly-learning` (`COURSE_DB`). Se consultaron las tablas reales `courses`, `units`, `sections`, `exercises`, `exercise_type_registry`, `exercise_options`, `exercise_answer_keys`, `exercise_media`, `learning_media`, `competencies` y `unit_competencies`.

No se han creado ejercicios ni se han cambiado estados durante esta auditoría. Los datos de progreso del alumnado no se han tocado.
La tabla `courses` de esta base contiene solo A2, B1, B2 y C1; no hay registros A1 ni C2 en `linguafly-learning`. Por tanto, los hallazgos de este documento cubren las 400 unidades de esos cuatro niveles, no certifican el estado de posibles catálogos A1/C2 que vivan en otros sistemas.

## Criterio editorial aplicado

Fuentes del propio repositorio:
- `docs/normas-items-curriculum.md`: respuesta cerrada verificable, opciones no solapadas, explicación que enseña, lectura/escucha basada en un mismo texto o transcripción y clave curada; la IA no decide la respuesta correcta.
- `docs/editorial-guide-b1-cambridge.md`: progresión controlada a contextual, distractores plausibles, no duplicar prompts, lectura respondible desde el texto, escucha con audio/transcripción real, producción oral/escrita con propósito y rúbrica, y publicación solo tras comprobación.
- `docs/pr-checklist-pedagogia.md` y `src/lib/validation/pedagogy-quality-rules.ts`: validaciones automáticas existentes.
- `docs/EDITORIAL_QUALITY_GATE.md`: estímulo completo, objetivo observable, respuesta defendible, nivel MCER, feedback y revisión humana.

La guía C1 define además una matriz objetivo de 100 unidades, seis lecciones y 18 ejercicios por lección. Esa matriz no coincide con la estructura actual de cuatro secciones de la Academia; debe armonizarse antes de usarla como cuota de generación.

## 1. Estructura del catálogo

| Nivel | Unidades | Secciones creadas | Ejercicios | Unidades publicadas |
|---|---:|---:|---:|---:|
| A2 | 100 | 400 | 15 | 0 |
| B1 | 100 | 400 | 584 | 51 |
| B2 | 100 | 400 | 15 | 0 |
| C1 | 100 | 400 | 15 | 0 |
| **Total** | **400** | **1.600** | **629** | **51** |

Las cuatro filas de sección (grammar, vocabulary, reading, listening) existen en cada unidad. La cobertura real de ejercicios es muy distinta:

| Nivel | Sin Grammar | Sin Vocabulary | Sin Reading | Sin Listening | Unidades con las 4 secciones con ejercicios |
|---|---:|---:|---:|---:|---:|
| A2 | 99 | 99 | 99 | 100 | 0 |
| B1 | 60 | 68 | 91 | 91 | 1 |
| B2 | 99 | 99 | 99 | 100 | 0 |
| C1 | 99 | 99 | 99 | 100 | 0 |

Solo B1 Unidad 1 tiene ejercicios en las cuatro secciones. En B1, de las 51 unidades marcadas como publicadas, 22 tienen ejercicios en una sola sección, 22 en dos, 6 en tres y solo 1 en las cuatro. La existencia de una fila de sección no equivale a que la sección esté desarrollada.

## 2. Distribución y publicación por nivel

- A2, B2 y C1 tienen únicamente 15 ejercicios cada uno, todos en la Unidad 1, distribuidos entre Grammar (5), Vocabulary (5) y Reading (5). No hay ejercicios de Listening en ninguno de los 300 bloques de esos tres niveles.
- Los 15 ejercicios de cada uno de esos niveles están en borrador. Las 100 unidades de cada nivel siguen en borrador.
- B1 concentra 584 ejercicios: Grammar 269, Vocabulary 195, Reading 65 y Listening 55. Solo 51 unidades están publicadas; las unidades 61–100 están vacías y en borrador. También hay unidades publicadas con secciones incompletas.
- B1 unidades 4–10 tienen títulos genéricos como “Unit 4”, “Unit 5”, etc. y objetivos que solo dicen “Cambridge B1 Preliminary: Unit N”; no describen un resultado de aprendizaje medible.

## 3. Hallazgos de calidad didáctica

### P0 — Listening no es todavía una práctica auditiva válida
- Los 55 ejercicios de Listening de B1 no tienen ningún audio asociado en `exercise_media`/`learning_media`.
- 24 de los 55 ni siquiera tienen transcripción no vacía.
- Los demás son preguntas de opción múltiple sobre texto transcrito, sin fuente de audio vinculada. No deben presentarse como “Listen to…” hasta que exista audio reproducible y asociado al bloque.
- A2, B2 y C1 tienen cero ejercicios de Listening.

### P0 — Todas las actividades registradas son opción múltiple
Los 629 ejercicios usan `single-choice`. No hay variedad de interacción registrada en el catálogo: gap-fill, matching, ordered sequence, true/false, ni tareas productivas con rúbrica. La práctica no refleja una progresión suficiente desde reconocimiento hasta uso contextual, ni las tipologías de Reading/Use of English, Writing y Speaking que piden las guías.

### P1 — Reading usa microtextos incrustados en preguntas
En B1 hay 65 ejercicios de Reading; 30 no tienen un campo `passage` compartido. En los ejemplos revisados, el texto aparece incrustado dentro de cada pregunta (“Lee: …”). Eso puede servir para lectura de una frase, pero no equivale a una tarea de comprensión de un texto con preguntas de gist, detalle, propósito, actitud, referencia o inferencia. Deben agruparse preguntas alrededor de un mismo texto auténtico/editorial con evidencia localizable.

### P1 — Reading no está en la lengua objetivo en A2 y es demasiado fragmentario en B2/C1
- En los cinco ítems de Reading de A2 Unidad 1, los textos y preguntas están en español (por ejemplo, “Ella trabaja desde casa…”). Por tanto, no evalúan comprensión lectora en inglés, aunque la sección y el nivel sean de inglés A2.
- En la muestra de B2 y C1 Unidad 1, los ítems de Reading son frases aisladas de una línea, seguidas de una pregunta. En C1 esto no permite evaluar comprensión de textos largos y complejos, cohesión, progresión temática o postura global, que son parte del objetivo de nivel.
- Estos casos necesitan textos en inglés adecuados al nivel, con varias preguntas ligadas al mismo texto y evidencia identificable. No basta con cambiar la lengua de la frase o alargar la pregunta.


### P1 — Objetivos y competencias no trazan la enseñanza real
- A2, B2 y C1 tienen un único objetivo genérico por unidad, repetido por fases (“core concepts”, “controlled use”, etc.), no resultados observables específicos.
- Las 16 competencias (cuatro por nivel: grammar, vocabulary, reading, listening) están en estado `draft`, pero cada una está asignada a las 100 unidades del nivel. La matriz de asignación es idéntica para todas las unidades y no prueba que el contenido enseñe esas competencias.
- En B1, 47 unidades solo tienen un objetivo; en varias unidades publicadas los objetivos son marcadores genéricos de número de unidad.

### P1 — Desajuste entre sección y subdestreza en B1
Los metadatos de subdestreza de B1 no siempre coinciden con la sección en la que se sirve el ejercicio: en Grammar hay 15 registros etiquetados como `speaking` y 50 como `writing`; en Listening solo 40 de 55 tienen subdestreza `listening`; en Vocabulary 175 de 195 llevan etiqueta `vocabulary`; en Reading 45 de 65 llevan etiqueta `reading`. La unidad 3, por ejemplo, contiene preguntas sobre la historia de Clara etiquetadas `writing:b1-stories` dentro de Grammar. Hay que corregir el mapeo de sección y la clasificación curricular, no solo el texto visible.

### P1 — Repetición y feedback
- Se detectaron seis prompts repetidos en B1: dos de Grammar, tres de Listening y uno de Vocabulary.
- El filtro cuantitativo detecta 22 explicaciones de menos de 50 caracteres en B1 (1 Grammar, 10 Vocabulary, 11 Reading). Esto es una señal de revisión, no una sentencia automática: hay que comprobar si explican la regla o la evidencia y no se limitan a señalar la respuesta.
- El campo `editorialReview` aparece en muchos registros, pero su contenido es una etiqueta genérica como “CEFR B1 language; one unambiguous correct answer.” No demuestra que haya existido revisión humana y no debe tratarse como aprobación editorial.

### P1 — Ambigüedad lingüística detectada en muestra real
En los cinco ítems de relative clauses de B1 Unidad 2 que se pasaron a borrador en la intervención anterior, la revisión de enunciados, opciones y clave detecta al menos tres respuestas múltiples:
- “She is the teacher ___ helps me…” admite tanto `who` como `that`, pero solo se marca `who`.
- “I visited the museum ___ has many ancient artifacts” admite `which` y `that`, pero solo se marca `which`.
- “Do you remember the day ___ we met…” admite `when` y también `that` (en una defining relative clause), pero solo se marca `when`.

Esto incumple la regla de respuesta única defendible. Hay que reformular el contexto para evaluar una distinción concreta o aceptar todas las respuestas correctas. No basta con que la clave apunte a una opción.

### P1 — Distractores artificiales en B2/C1
En la muestra completa de las 30 actividades de B2 y C1 Unidad 1, aparecen distractores manifiestamente mal formados, por ejemplo “we had hear”, “did not went” y “they had realises”. Aunque son incorrectos, no son distractores de calidad: el alumno puede descartarlos por errores superficiales sin demostrar que domina el contraste evaluado. La guía exige opciones plausibles y paralelas; deben sustituirse por errores típicos del nivel y del punto gramatical, sin crear ambigüedad.

### P0 — Ejercicios publicados dentro de unidades en borrador
B1 Unidad 3 (Technology and Innovation) y Unidad 6 tienen estado de unidad `draft`, pero contienen 10 ejercicios cada una con estado `published`. Esto rompe la coherencia de publicación: el estado de la unidad no representa la disponibilidad real de sus ejercicios. Hay que revisar cómo Academy consulta y filtra unidades y ejercicios antes de corregir estados en producción.

### P0 — Opciones corruptas y feedback literal “undefined” en B1
- El recuento de opciones de B1 identifica 12 opciones sospechosas entre 2.286 filas. Aparecen en B1 Unidades 3, 4, 14 y 59: placeholders `o2`/`o3`, palabras ajenas al ejercicio como `MUSICAL`/`CREATION` y distractores sin relación como `fake`/`long`. Están en ejercicios publicados, no solo en borradores.
- Los cinco huecos de Reading de B1 Unidad 5 tienen explicaciones que contienen literalmente `(1) undefined` hasta `(5) undefined`. También presentan opciones de relleno como `o1`, `o2` y `o3`. Los cinco registros están publicados.
- El control automático de “cuatro opciones” no detecta esto: las filas existen, pero el contenido no es una opción lingüística válida. Debe comprobarse el contenido semántico y prohibirse la publicación de placeholders.

### P2 — Datos técnicos completos no garantizan calidad
Los 629 ejercicios tienen título, instrucciones, contenido no vacío y una clave registrada; las opciones MC inspeccionadas tienen al menos dos opciones distintas y claves estructuralmente válidas. Esto solo confirma integridad básica. No valida que la pregunta evalúe el objetivo, que la clave sea lingüísticamente correcta, que los distractores sean plausibles ni que el feedback enseñe.

## 4. Riesgo de publicación

No se recomienda ampliar publicación a otras unidades con el estado actual. Tampoco se recomienda marcar como completas las secciones que solo contienen preguntas aisladas, ni convertir transcripciones en “audio” por etiqueta.

No se han despublicado en bloque las 50 unidades B1 incompletas: hacerlo podría alterar el acceso del alumnado. La decisión de retirarlas o mantenerlas temporalmente requiere una migración controlada, preservando intentos y progreso. La corrección inmediata de B1 Unidad 2 (pasar a borrador los cinco ejercicios defectuosos de relativas) se hizo en una intervención anterior y no forma parte de los cambios de esta auditoría.

## 5. Plan de corrección propuesto

1. **Congelar nuevas publicaciones** de unidades que no superen la puerta editorial.
2. **Resolver primero B1**, porque es el único nivel publicado: auditar y rehacer las 50 unidades incompletas, empezando por unidades 2–60; completar Reading/Listening con texto/audio común por bloque, preguntas ancladas a evidencia y claves verificadas.
3. **Completar A2, B2 y C1 desde el syllabus correspondiente**, no copiando el mismo lote de cinco preguntas. A2 requiere comprensión explícita y lenguaje concreto; B2 requiere matiz, inferencia y rango; C1 requiere textos complejos, registro, cohesión, postura y producción con rúbricas.
4. **Diseñar variedad de tareas por objetivo**: práctica controlada, recuperación, discriminación, aplicación contextual y producción. No fijar una cuota artificial de MC.
5. **Alinear cuatro secciones con objetivos/competencias** por unidad. La matriz genérica de cuatro competencias debe convertirse en asignaciones justificadas y verificables.
6. **Añadir validación al pipeline de Academy/D1**: texto de estímulo separado de instrucciones, claves y opciones comprobables, texto compartido en Reading, audio real en Listening, no duplicados, explicación formativa, adecuación MCER y recuento de cobertura por unidad.
7. **Revisión humana y comprobación en vista de alumno** antes de cambiar estados a `published`.

## 6. Consultas reproducibles usadas

### Cobertura por nivel
```sql
SELECT c.cefr_level,
  COUNT(DISTINCT u.id) AS units,
  SUM(CASE WHEN (SELECT COUNT(*) FROM exercises e JOIN sections s ON s.id=e.section_id WHERE s.unit_id=u.id AND s.section_type='grammar')=0 THEN 1 ELSE 0 END) AS no_grammar,
  SUM(CASE WHEN (SELECT COUNT(*) FROM exercises e JOIN sections s ON s.id=e.section_id WHERE s.unit_id=u.id AND s.section_type='vocabulary')=0 THEN 1 ELSE 0 END) AS no_vocabulary,
  SUM(CASE WHEN (SELECT COUNT(*) FROM exercises e JOIN sections s ON s.id=e.section_id WHERE s.unit_id=u.id AND s.section_type='reading')=0 THEN 1 ELSE 0 END) AS no_reading,
  SUM(CASE WHEN (SELECT COUNT(*) FROM exercises e JOIN sections s ON s.id=e.section_id WHERE s.unit_id=u.id AND s.section_type='listening')=0 THEN 1 ELSE 0 END) AS no_listening
FROM courses c JOIN units u ON u.course_id=c.id
GROUP BY c.id ORDER BY c.sort_order;
```

### Tipos de actividad
```sql
SELECT c.cefr_level, s.section_type, et.code, COUNT(*) AS n
FROM exercises e
JOIN sections s ON s.id=e.section_id
JOIN units u ON u.id=s.unit_id
JOIN courses c ON c.id=u.course_id
JOIN exercise_type_registry et ON et.id=e.exercise_type_id
GROUP BY c.id, s.section_type, et.code
ORDER BY c.sort_order, s.position, et.code;
```

### Listening sin audio asociado
```sql
SELECT c.cefr_level, COUNT(*) AS exercises,
  SUM(CASE WHEN json_extract(e.content_json,'$.transcript') IS NULL
             OR trim(json_extract(e.content_json,'$.transcript'))=''
      THEN 1 ELSE 0 END) AS missing_transcript,
  SUM(CASE WHEN NOT EXISTS (
    SELECT 1 FROM exercise_media em
    JOIN learning_media lm ON lm.id=em.media_id
    WHERE em.exercise_id=e.id AND lm.media_type='audio'
  ) THEN 1 ELSE 0 END) AS no_audio_media
FROM exercises e
JOIN sections s ON s.id=e.section_id
JOIN units u ON u.id=s.unit_id
JOIN courses c ON c.id=u.course_id
WHERE s.section_type='listening'
GROUP BY c.id ORDER BY c.sort_order;
```

---
**Estado:** auditoría cuantitativa de las 400 unidades y revisión muestral lingüística completadas. Pendiente auditoría lingüística individual de los 629 registros (teniendo en cuenta que los grupos `-gapN` son varios registros de un mismo ejercicio) y reconciliación con los archivos fuente del currículo antes de editar contenido en producción.

## 7. Saneamiento de la fuente B1 — 2026-10-31

Tras la auditoría inicial se aplicaron correcciones en la fuente canónica del repositorio (src/content/cursos/ingles-b1/):

- Se sustituyeron las cinco explicaciones literales undefined de la actividad de formación de palabras de la unidad 5 en una intervención anterior, y se corrigieron otras cinco explicaciones de la unidad 30 y cinco de la unidad 33 con feedback ligado a la forma y al contexto de cada respuesta.
- En la unidad 2 se retiraron los distractores that que hacían válidas dos respuestas en tres preguntas de cláusulas relativas. Se releen las opciones publicadas y queda una única opción defendible por ítem.
- Se corrigió la concordancia española «Los valores» en el feedback de la unidad 4.
- Se reemplazaron los títulos genéricos Unit N y se añadieron objetivos de aprendizaje ligados a los temas de los bloques para las unidades 4–60. Las unidades 1–3 ya tenían título y objetivos específicos.
- Se volvieron a leer los JSON de las unidades 1–60. La comprobación estructural no encuentra errores de parseo, textos de opción iguales a placeholders o1–o4, ni explicaciones que contengan undefined en esos archivos. Las unidades 1–60 tienen ahora título y tres objetivos de aprendizaje.

### Pendiente que impide certificar el catálogo B1 completo

- No existen archivos fuente unit61.json–unit100.json en la ruta auditada. No se han inventado unidades ni objetivos para cubrir ese hueco.
- La corrección de los JSON no equivale a importar los cambios en D1. La importación de producción sigue pendiente de ejecutar mediante el workflow autorizado y de verificar después los registros en la base blog/destino correcto.
- Los 55 ejercicios de Listening continúan sin audio asociado en la auditoría D1; 24 carecen además de transcripción. No se han fabricado audios ni se han etiquetado transcripciones como audio.
- La estructura sigue siendo insuficiente para certificar las cuatro destrezas: persisten unidades y secciones sin ejercicios, predominio de opción múltiple y actividades de Reading fragmentarias. El saneamiento de títulos y objetivos no resuelve esas carencias.
- Sigue pendiente la revisión lingüística individual de los 584 registros y la reconciliación registro a registro entre los JSON y D1. Por tanto, esta actualización acredita correcciones concretas en la fuente, no una certificación editorial integral ni una publicación sincronizada en producción.
