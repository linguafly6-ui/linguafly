-- Per-learner answers and feedback for the A1 learning experience.
-- The browser receives only the selected answer and grading result, never answer_json.
CREATE TABLE IF NOT EXISTS learning_exercise_progress (
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES learning_exercises(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL DEFAULT '',
  correct INTEGER CHECK (correct IS NULL OR correct IN (0, 1)),
  explanation TEXT NOT NULL DEFAULT '',
  review_json TEXT,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY(user_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_exercise_progress_user_lesson
  ON learning_exercise_progress(user_id, lesson_id);

