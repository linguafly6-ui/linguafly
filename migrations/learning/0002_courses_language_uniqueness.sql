-- The original UNIQUE(cefr_level) constraint allowed only one language.
-- Safe rebuild: courses is currently empty and child tables reference courses by name.

CREATE TABLE courses_new (
  id TEXT PRIMARY KEY,
  language_code TEXT NOT NULL DEFAULT 'en',
  cefr_level TEXT NOT NULL
    CHECK (cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','review','published')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language_code, cefr_level)
);

INSERT INTO courses_new (
  id, language_code, cefr_level, title, description, sort_order, status, created_at
)
SELECT
  id, language_code, cefr_level, title, description, sort_order, status, created_at
FROM courses;

DROP TABLE courses;
ALTER TABLE courses_new RENAME TO courses;
