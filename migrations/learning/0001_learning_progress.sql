-- LinguaFly learning progress schema.
-- Applied only to the dedicated linguafly-learning D1 database.
-- Does not alter the legacy blog DB or preview DB.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS learners (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended','deleted'))
);

CREATE TABLE IF NOT EXISTS learner_identities (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  UNIQUE(provider, provider_subject)
);

CREATE TABLE IF NOT EXISTS learning_attempts (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  response_json TEXT NOT NULL,
  is_correct INTEGER NOT NULL CHECK(is_correct IN (0,1)),
  score REAL NOT NULL DEFAULT 0,
  max_score REAL NOT NULL DEFAULT 1,
  response_time_ms INTEGER CHECK(response_time_ms IS NULL OR response_time_ms >= 0),
  feedback_json TEXT NOT NULL DEFAULT '{}',
  grading_version TEXT NOT NULL,
  attempted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  UNIQUE(learner_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS learner_exercise_state (
  learner_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  attempts_count INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TEXT,
  last_is_correct INTEGER CHECK(last_is_correct IS NULL OR last_is_correct IN (0,1)),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(learner_id, exercise_id),
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE IF NOT EXISTS learner_unit_progress (
  learner_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK(status IN ('not_started','in_progress','completed')),
  exercises_attempted INTEGER NOT NULL DEFAULT 0,
  exercises_correct INTEGER NOT NULL DEFAULT 0,
  started_at TEXT,
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(learner_id, unit_id),
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  FOREIGN KEY (unit_id) REFERENCES units(id)
);

CREATE TABLE IF NOT EXISTS learner_competency_progress (
  learner_id TEXT NOT NULL,
  competency_id TEXT NOT NULL,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  mastery_score REAL NOT NULL DEFAULT 0 CHECK(mastery_score BETWEEN 0 AND 1),
  last_evidence_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(learner_id, competency_id),
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  FOREIGN KEY (competency_id) REFERENCES competencies(id)
);

CREATE TABLE IF NOT EXISTS learner_error_events (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  attempt_id TEXT NOT NULL,
  error_code TEXT,
  error_detail_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (attempt_id) REFERENCES learning_attempts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS spaced_repetition_items (
  learner_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  due_at TEXT NOT NULL,
  interval_days REAL NOT NULL DEFAULT 0,
  ease_factor REAL NOT NULL DEFAULT 2.5 CHECK(ease_factor BETWEEN 1.3 AND 3.0),
  repetitions INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  last_quality INTEGER CHECK(last_quality IS NULL OR last_quality BETWEEN 0 AND 5),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(learner_id, exercise_id),
  FOREIGN KEY (learner_id) REFERENCES learners(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE INDEX IF NOT EXISTS idx_attempts_learner_time
  ON learning_attempts(learner_id, attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_attempts_exercise_time
  ON learning_attempts(exercise_id, attempted_at DESC);
CREATE INDEX IF NOT EXISTS idx_errors_learner_created
  ON learner_error_events(learner_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_srs_due
  ON spaced_repetition_items(learner_id, due_at);
CREATE INDEX IF NOT EXISTS idx_unit_progress_learner_status
  ON learner_unit_progress(learner_id, status);
