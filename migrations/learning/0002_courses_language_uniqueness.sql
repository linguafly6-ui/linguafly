-- The canonical courses schema is created by 0000_learning_core.sql with
-- UNIQUE(language_code, cefr_level). Rebuilding the table here would be
-- redundant and risks invalidating dependent foreign keys on fresh databases.
-- Keep this numbered migration as a no-op for a stable migration sequence.
SELECT 1;
