# LinguaFly Learning production readiness

## Dedicated database and isolation

- Production D1: `linguafly-learning` (`0982f4a2-ce92-410a-9e72-e5a34c461612`).
- Preview D1: `linguafly-learning-preview` (`7e4e332b-6b37-4b4c-905f-390e1ef0f79a`).
- The legacy `DB` binding remains attached to `blog`; `COURSE_DB` remains unchanged.
- Learning content and learner progress belong only in `LEARNING_DB`.
- No production deploy or PR merge is authorised as part of this work.

## Implemented on `feat/learning-db-integration`

- Separate production and preview `LEARNING_DB` bindings and a dedicated database resolver.
- Reproducible core baseline in `migrations/learning/0000_learning_core.sql` for academic, exercise, media, and lexical tables.
- Progress schema in `migrations/learning/0001_learning_progress.sql` (eight tables and supporting indexes).
- `0002_courses_language_uniqueness.sql` retained as a non-destructive no-op: the baseline already defines `UNIQUE(language_code, cefr_level)`.
- Read-only published course, unit, and exercise APIs.
- Exercise read API does not query `exercise_answer_keys`; public exercise JSON receives a defensive key-name filter.
- Deterministic learner identity bridge from the existing authenticated legacy session to opaque learner records. It does not copy session tokens, token hashes, email, or subscription data.

## Database validation completed

- Applied `0000_learning_core.sql` and `0001_learning_progress.sql` to the isolated preview D1.
- Preview contains 37 tables, 19 indexes, and the `lexical_search_index` view.
- Preview `PRAGMA foreign_key_check` returned zero violations.
- Preview content tables are empty; no course, unit, vocabulary, or exercise content has been seeded.
- The preview migration test did not modify production D1.
- Individual preview schema columns for courses, exercise types, exercises, options, answer keys, and attempts have been inspected. A complete production-versus-preview DDL equivalence audit is still outstanding.

## Required before production use

1. Reconcile the exact DDL and migration history of production and preview, including Wrangler's D1 migration ledger. Do not assume manually applied SQL is recorded by Wrangler.
2. Run type-check, unit/integration tests, and an isolated Worker preview build; record actual results.
3. Add and test server-side grading for each supported strategy. Never accept correctness, score, learner ID, or answer keys from the client.
4. Add authenticated, idempotent attempt submission; persist attempts and update exercise/unit/competency progress transactionally where possible.
5. Add spaced-repetition scheduling with separate learner self-rating and correctness signals.
6. Add request schema validation, origin/CSRF protection, rate limiting, audit events, and integration tests for authenticated flows.
7. Configure and test R2 media storage before publishing audio or image-dependent exercises.
8. Author and editorially review course content before loading or publishing it.

## Content model target

- English (British English) first; language-aware schema for later languages.
- Six CEFR levels, A1–C2.
- 100 units per level.
- Four sections per unit: grammar, listening, vocabulary, and reading.
- 15 exercises per section (60 per unit; 36,000 exercises across 600 units).
- Spanish is the support language for learner-facing instructions and explanations: vocabulary prompts may be in English, but answer choices/definitions must be in Spanish when testing English word meaning. Apply consistently across levels.

## Safety boundary

Do not alter the legacy blog database, legacy public learning routes, middleware, or existing preview UI. Do not seed or publish placeholder content. Keep PR #36 in draft and do not merge or deploy until the required validation and runtime flows are complete.
