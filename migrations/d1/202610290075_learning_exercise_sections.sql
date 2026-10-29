-- Add the section and shared media fields consumed by the learning API.
-- Existing exercises default to grammar until their section is explicitly assigned.
ALTER TABLE learning_exercises
  ADD COLUMN section_type TEXT NOT NULL DEFAULT 'grammar';

ALTER TABLE learning_exercises
  ADD COLUMN audio_text TEXT;

CREATE INDEX IF NOT EXISTS idx_learning_exercises_lesson_section_number
  ON learning_exercises(lesson_id, section_type, exercise_number);
