-- One dialogue is shared by the ten comprehension questions in each unit.
-- Keep its playback control on the first question instead of repeating it on all ten.
UPDATE learning_exercises
SET audio_text = NULL,
    prompt = replace(prompt, 'Escucha el diálogo y responde:', 'Según el diálogo del ejercicio 1, responde:')
WHERE section_type = 'listening'
  AND exercise_number BETWEEN 10202 AND 10210;

