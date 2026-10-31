# LinguaFly Learning production readiness

## Dedicated database

- D1 database: `linguafly-learning`
- Database UUID: `0982f4a2-ce92-410a-9e72-e5a34c461612`
- The legacy `DB` binding must remain attached to `blog`.
- The `COURSE_DB` preview binding must remain unchanged.
- This database is the only target for learning content and progress.

## Implementation status

Completed in the current integration branch:
- Dedicated `LEARNING_DB` binding for the production Worker and a separately provisioned, empty preview database.
- Worker environment types and a dedicated learning database resolver.
- Course uniqueness changed to `UNIQUE(language_code, cefr_level)`.
- Published catalogue and unit-list read APIs.
- Published unit exercise read API; answer-key table is never queried and answer-like fields are stripped from public content JSON.
- Eight learner-progress tables and supporting indexes exist in the dedicated production D1; foreign-key check returned no violations.

Still required before deployment:
1. Complete the identity bridge. The current legacy session helper is tied to `DB`; do not copy session tokens or password material into the learning database.
2. Implement server-side graders, attempt submission, progress updates, and spaced-repetition endpoints with schema validation, rate limits, CSRF/origin controls, idempotency, and audit logging.
3. Establish a reproducible baseline migration for the academic, exercise, and lexicon schema. The current production core schema was provisioned separately; a fresh preview D1 must not be migrated until that baseline exists.
4. Run type-check, tests, and a full isolated preview build. No production deploy or PR merge is authorised by this change.
5. Seed editorial content only after the API and editorial review workflow are ready.

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
- Eight learning-progress tables are now present; a fresh foreign-key check returned no violations.
- Production and preview Worker configurations declare separate `LEARNING_DB` bindings; preview has its own empty D1.
- Read-only catalogue, unit, and exercise endpoints are committed on the integration branch but have not been deployed or functionally verified.
- The core academic schema is not yet represented by a reproducible baseline migration, so the empty preview database must not be migrated until that gap is resolved.
- Attempt grading, identity bridging, learner APIs, and content seeding remain incomplete.
- Do not mark content as published until authored, reviewed, loaded, and verified.
