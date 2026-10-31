# LinguaFly Learning production readiness

## Dedicated database

- D1 database: `linguafly-learning`
- Database UUID: `0982f4a2-ce92-410a-9e72-e5a34c461612`
- The legacy `DB` binding must remain attached to `blog`.
- The `COURSE_DB` preview binding must remain unchanged.
- This database is the only target for learning content and progress.

## Required next implementation steps

1. Add a dedicated `LEARNING_DB` binding to the production Worker and to preview configuration only when an isolated preview database is provisioned. Do not point preview to production data.
2. Generate Worker environment types and add a dedicated learning database resolver. Do not change legacy authentication or article data access.
3. Rework learning identity so the existing verified session can be validated against the legacy identity store, while all learning records are written only to `LEARNING_DB`. Never copy session tokens or password material.
4. Fix the `courses` uniqueness constraint to be `UNIQUE(language_code, cefr_level)` before adding multiple language tracks. The current schema permits only one row per CEFR level globally.
5. Add server-only grading services and validate that answer keys are never serialized to browser responses.
6. Add content read APIs, attempt submission, progress, and spaced-repetition APIs with schema validation, rate limits, CSRF/origin controls, idempotency, and audit logging.
7. Add migration application and verification to CI with explicit database targeting.
8. Build and test in an isolated preview environment; review a pull request before merging or deploying.

## Progress schema

Migration `migrations/learning/0001_learning_progress.sql` adds:
- learners and linked identities
- immutable learning attempts with idempotency
- per-exercise and per-unit progress
- competency evidence and progress
- error events
- spaced-repetition scheduling

Apply it only to the dedicated learning database after the core content schema is present.

## Current verified state (2026-10-31)

- Core academic, exercise, and lexicon schema exists in the dedicated D1.
- Core content tables are empty.
- Foreign-key check returned no violations.
- No learning-progress tables were present at the time of inspection.
- The production Worker configuration did not yet declare `LEARNING_DB`.
- No learning API integration is ready to deploy.
- Do not mark content as published until authored, reviewed, loaded, and verified.
