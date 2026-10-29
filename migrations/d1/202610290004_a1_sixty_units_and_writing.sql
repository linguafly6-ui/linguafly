-- Present the complete A1 course as 60 numbered units rather than ten groups of lessons.
UPDATE learning_lessons
SET unit_number = lesson_number,
    estimated_minutes = 20
WHERE course_id = 'english-a1' AND published = 1;

UPDATE learning_courses
SET description = 'Curso A1 desde cero con 60 unidades y apartados de gramática, vocabulario, listening y writing.',
    updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
WHERE id = 'english-a1';

UPDATE learning_lessons
SET title = 'Saludos, sonidos y presentaciones',
    objective = 'Reconocer sonidos iniciales y usar saludos y frases básicas para presentarte.'
WHERE id = 'a1-01';

CREATE TABLE IF NOT EXISTS learning_writing_drafts (
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  draft TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_writing_drafts_user
  ON learning_writing_drafts(user_id, updated_at);

