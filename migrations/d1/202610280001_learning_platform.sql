-- Linguafly learning platform foundation.
-- Additive migration: leaves the existing articles/CRM tables untouched.
-- User IDs are opaque identifiers supplied by the eventual authentication layer.

CREATE TABLE IF NOT EXISTS learning_courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS learning_lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES learning_courses(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL CHECK (lesson_number > 0),
  unit_number INTEGER NOT NULL CHECK (unit_number > 0),
  title TEXT NOT NULL,
  objective TEXT NOT NULL DEFAULT '',
  estimated_minutes INTEGER NOT NULL DEFAULT 10 CHECK (estimated_minutes BETWEEN 1 AND 60),
  content_json TEXT NOT NULL DEFAULT '{}',
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(course_id, lesson_number)
);

CREATE INDEX IF NOT EXISTS idx_learning_lessons_course_order
  ON learning_lessons(course_id, lesson_number);

CREATE TABLE IF NOT EXISTS learning_exercises (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  exercise_number INTEGER NOT NULL CHECK (exercise_number > 0),
  exercise_type TEXT NOT NULL,
  prompt TEXT NOT NULL,
  options_json TEXT NOT NULL DEFAULT '[]',
  answer_json TEXT NOT NULL DEFAULT '{}',
  explanation TEXT NOT NULL DEFAULT '',
  ai_generated INTEGER NOT NULL DEFAULT 0 CHECK (ai_generated IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(lesson_id, exercise_number)
);

CREATE TABLE IF NOT EXISTS learning_lesson_progress (
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  correct_answers INTEGER NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
  total_answers INTEGER NOT NULL DEFAULT 0 CHECK (total_answers >= 0),
  last_score REAL,
  started_at TEXT,
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user_status
  ON learning_lesson_progress(user_id, status, updated_at);

-- One row per learner/concept. due_at is the scheduling source of truth.
CREATE TABLE IF NOT EXISTS learning_review_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  concept_key TEXT NOT NULL,
  due_at TEXT NOT NULL,
  interval_days REAL NOT NULL DEFAULT 0 CHECK (interval_days >= 0),
  ease_factor REAL NOT NULL DEFAULT 2.5 CHECK (ease_factor >= 1.3),
  repetitions INTEGER NOT NULL DEFAULT 0 CHECK (repetitions >= 0),
  lapses INTEGER NOT NULL DEFAULT 0 CHECK (lapses >= 0),
  last_quality INTEGER CHECK (last_quality BETWEEN 0 AND 5),
  last_reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(user_id, concept_key)
);

CREATE INDEX IF NOT EXISTS idx_learning_reviews_due
  ON learning_review_items(user_id, due_at);

CREATE TABLE IF NOT EXISTS learning_review_history (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  review_item_id TEXT NOT NULL REFERENCES learning_review_items(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES learning_lessons(id) ON DELETE CASCADE,
  quality INTEGER NOT NULL CHECK (quality BETWEEN 0 AND 5),
  was_correct INTEGER NOT NULL CHECK (was_correct IN (0, 1)),
  response_ms INTEGER CHECK (response_ms IS NULL OR response_ms >= 0),
  reviewed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_learning_review_history_user_date
  ON learning_review_history(user_id, reviewed_at);

CREATE TABLE IF NOT EXISTS learning_ai_usage_daily (
  user_id TEXT NOT NULL,
  usage_date TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  input_tokens INTEGER NOT NULL DEFAULT 0 CHECK (input_tokens >= 0),
  output_tokens INTEGER NOT NULL DEFAULT 0 CHECK (output_tokens >= 0),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  PRIMARY KEY(user_id, usage_date)
);

CREATE TABLE IF NOT EXISTS learning_subscriptions (
  user_id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_customer_id TEXT,
  provider_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive'
    CHECK (status IN ('inactive', 'trialing', 'active', 'past_due', 'canceled', 'expired')),
  plan_code TEXT NOT NULL DEFAULT 'monthly_999',
  current_period_end TEXT,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
