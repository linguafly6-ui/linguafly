-- Store an exact, versioned mirror of the source course-unit JSON.
-- This is additive: it does not replace curated learning_exercises or learner progress.
CREATE TABLE IF NOT EXISTS learning_course_json_units (
  course_key TEXT NOT NULL,
  level TEXT NOT NULL,
  unit_number INTEGER NOT NULL CHECK (unit_number > 0),
  unit_id TEXT NOT NULL,
  title TEXT NOT NULL,
  source_path TEXT NOT NULL UNIQUE,
  content_hash TEXT NOT NULL,
  content_json TEXT NOT NULL CHECK (json_valid(content_json)),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY (course_key, unit_number)
);

CREATE INDEX IF NOT EXISTS idx_learning_course_json_units_level_order
  ON learning_course_json_units(level, course_key, unit_number);
