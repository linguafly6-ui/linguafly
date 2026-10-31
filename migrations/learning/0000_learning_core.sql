-- Reproducible baseline for the dedicated LinguaFly learning D1 database.
-- All objects are idempotent so this can initialize a fresh preview database
-- and safely record the already-provisioned production schema in migrations.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  language_code TEXT NOT NULL DEFAULT 'en',
  cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language_code, cefr_level)
);

CREATE TABLE IF NOT EXISTS competencies (
  id TEXT PRIMARY KEY,
  language_code TEXT NOT NULL DEFAULT 'en',
  cefr_level TEXT NOT NULL CHECK (cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  skill TEXT NOT NULL CHECK (skill IN ('grammar','listening','vocabulary','reading','writing','speaking')),
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assessment_criteria_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published')),
  UNIQUE(language_code, cefr_level, code)
);

CREATE TABLE IF NOT EXISTS units (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  unit_number INTEGER NOT NULL CHECK (unit_number BETWEEN 1 AND 100),
  title TEXT NOT NULL,
  learning_objectives_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  UNIQUE(course_id, unit_number)
);

CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  unit_id TEXT NOT NULL,
  section_type TEXT NOT NULL CHECK (section_type IN ('grammar','listening','vocabulary','reading')),
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 4),
  title TEXT NOT NULL,
  instructions TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published')),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  UNIQUE(unit_id, section_type),
  UNIQUE(unit_id, position)
);

CREATE TABLE IF NOT EXISTS unit_competencies (
  unit_id TEXT NOT NULL,
  competency_id TEXT NOT NULL,
  importance INTEGER NOT NULL DEFAULT 1 CHECK (importance BETWEEN 1 AND 5),
  is_introduced INTEGER NOT NULL DEFAULT 0 CHECK (is_introduced IN (0,1)),
  PRIMARY KEY (unit_id, competency_id),
  FOREIGN KEY (unit_id) REFERENCES units(id),
  FOREIGN KEY (competency_id) REFERENCES competencies(id)
);

CREATE TABLE IF NOT EXISTS exercise_type_registry (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  interaction_mode TEXT NOT NULL,
  response_format TEXT NOT NULL,
  grading_strategy TEXT NOT NULL,
  supports_auto_grading INTEGER NOT NULL DEFAULT 1 CHECK (supports_auto_grading IN (0,1)),
  schema_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','deprecated')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercise_templates (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  exercise_type_id TEXT NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'en',
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  usage_scope TEXT NOT NULL DEFAULT 'both' CHECK (usage_scope IN ('core','practice','both')),
  practice_category TEXT CHECK (practice_category IS NULL OR practice_category IN ('grammar','vocabulary')),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_type_id) REFERENCES exercise_type_registry(id),
  UNIQUE(language_code, code)
);

CREATE TABLE IF NOT EXISTS exercise_template_versions (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  version_number INTEGER NOT NULL CHECK (version_number >= 1),
  prompt_template TEXT NOT NULL,
  instructions_template TEXT,
  slots_schema_json TEXT NOT NULL DEFAULT '{}',
  generation_config_json TEXT NOT NULL DEFAULT '{}',
  validation_config_json TEXT NOT NULL DEFAULT '{}',
  answer_key_config_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT,
  FOREIGN KEY (template_id) REFERENCES exercise_templates(id),
  UNIQUE(template_id, version_number)
);

CREATE TABLE IF NOT EXISTS template_slots (
  id TEXT PRIMARY KEY,
  template_version_id TEXT NOT NULL,
  slot_key TEXT NOT NULL,
  slot_type TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_config_json TEXT NOT NULL DEFAULT '{}',
  validation_config_json TEXT NOT NULL DEFAULT '{}',
  is_required INTEGER NOT NULL DEFAULT 1 CHECK (is_required IN (0,1)),
  position INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_version_id) REFERENCES exercise_template_versions(id),
  UNIQUE(template_version_id, slot_key),
  UNIQUE(template_version_id, position)
);

CREATE TABLE IF NOT EXISTS template_constraints (
  id TEXT PRIMARY KEY,
  template_version_id TEXT NOT NULL,
  constraint_code TEXT NOT NULL,
  constraint_type TEXT NOT NULL CHECK (constraint_type IN ('grammar','semantic','lexical','contextual','structural')),
  severity TEXT NOT NULL DEFAULT 'error' CHECK (severity IN ('error','warning')),
  constraint_config_json TEXT NOT NULL DEFAULT '{}',
  error_message TEXT,
  position INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_version_id) REFERENCES exercise_template_versions(id),
  UNIQUE(template_version_id, constraint_code),
  UNIQUE(template_version_id, position)
);

CREATE TABLE IF NOT EXISTS grammar_rules (
  id TEXT PRIMARY KEY,
  language_code TEXT NOT NULL DEFAULT 'en',
  rule_code TEXT NOT NULL,
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  explanation TEXT NOT NULL,
  validator_key TEXT,
  rule_config_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language_code, rule_code)
);

CREATE TABLE IF NOT EXISTS template_grammar_rules (
  id TEXT PRIMARY KEY,
  template_version_id TEXT NOT NULL,
  grammar_rule_id TEXT NOT NULL,
  is_required INTEGER NOT NULL DEFAULT 1 CHECK (is_required IN (0,1)),
  position INTEGER NOT NULL DEFAULT 1,
  config_override_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_version_id) REFERENCES exercise_template_versions(id),
  FOREIGN KEY (grammar_rule_id) REFERENCES grammar_rules(id),
  UNIQUE(template_version_id, grammar_rule_id),
  UNIQUE(template_version_id, position)
);

CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL,
  exercise_type_id TEXT NOT NULL,
  template_version_id TEXT,
  exercise_code TEXT NOT NULL,
  creation_mode TEXT NOT NULL DEFAULT 'manual' CHECK (creation_mode IN ('manual','template')),
  title TEXT,
  instructions TEXT,
  content_json TEXT NOT NULL DEFAULT '{}',
  generation_seed TEXT,
  generation_snapshot_json TEXT,
  position INTEGER NOT NULL,
  points REAL NOT NULL DEFAULT 1 CHECK (points > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES sections(id),
  FOREIGN KEY (exercise_type_id) REFERENCES exercise_type_registry(id),
  FOREIGN KEY (template_version_id) REFERENCES exercise_template_versions(id),
  UNIQUE(section_id, exercise_code),
  UNIQUE(section_id, position),
  CHECK ((creation_mode = 'manual' AND template_version_id IS NULL) OR (creation_mode = 'template' AND template_version_id IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS exercise_options (
  id TEXT PRIMARY KEY,
  exercise_id TEXT NOT NULL,
  option_key TEXT NOT NULL,
  content TEXT NOT NULL,
  content_json TEXT NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  UNIQUE(exercise_id, option_key),
  UNIQUE(exercise_id, position)
);

CREATE TABLE IF NOT EXISTS exercise_answer_keys (
  id TEXT PRIMARY KEY,
  exercise_id TEXT NOT NULL UNIQUE,
  grading_strategy TEXT NOT NULL,
  answer_config_json TEXT NOT NULL DEFAULT '{}',
  normalization_config_json TEXT NOT NULL DEFAULT '{}',
  scoring_config_json TEXT NOT NULL DEFAULT '{}',
  correct_feedback TEXT,
  incorrect_feedback TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

CREATE TABLE IF NOT EXISTS learning_media (
  id TEXT PRIMARY KEY,
  language_code TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('audio','image','video','document')),
  storage_provider TEXT NOT NULL DEFAULT 'r2' CHECK (storage_provider IN ('r2','external')),
  storage_key TEXT NOT NULL,
  external_url TEXT,
  mime_type TEXT NOT NULL,
  file_name TEXT,
  title TEXT,
  description TEXT,
  alt_text TEXT,
  duration_seconds REAL CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  metadata_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK ((storage_provider = 'r2' AND external_url IS NULL) OR (storage_provider = 'external' AND external_url IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS exercise_media (
  id TEXT PRIMARY KEY,
  exercise_id TEXT NOT NULL,
  media_id TEXT NOT NULL,
  usage_role TEXT NOT NULL CHECK (usage_role IN ('prompt','audio','image','video','support','transcript')),
  position INTEGER NOT NULL DEFAULT 1,
  config_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id),
  FOREIGN KEY (media_id) REFERENCES learning_media(id),
  UNIQUE(exercise_id, media_id, usage_role),
  UNIQUE(exercise_id, usage_role, position)
);

CREATE TABLE IF NOT EXISTS lexical_entries (
  id TEXT PRIMARY KEY,
  language_code TEXT NOT NULL DEFAULT 'en',
  lemma TEXT NOT NULL,
  normalized_lemma TEXT NOT NULL,
  part_of_speech TEXT NOT NULL CHECK (part_of_speech IN ('noun','verb','adjective','adverb','pronoun','determiner','preposition','conjunction','interjection','auxiliary','modal','particle','phrase','other')),
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  register TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language_code, normalized_lemma, part_of_speech)
);

CREATE TABLE IF NOT EXISTS lexical_senses (
  id TEXT PRIMARY KEY,
  lexical_entry_id TEXT NOT NULL,
  sense_number INTEGER NOT NULL CHECK (sense_number >= 1),
  definition TEXT NOT NULL,
  definition_translation TEXT,
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  domain TEXT,
  usage_context TEXT,
  register TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0 CHECK (is_primary IN (0,1)),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lexical_entry_id, sense_number),
  FOREIGN KEY (lexical_entry_id) REFERENCES lexical_entries(id)
);

CREATE TABLE IF NOT EXISTS lexical_forms (
  id TEXT PRIMARY KEY,
  lexical_entry_id TEXT NOT NULL,
  form TEXT NOT NULL,
  normalized_form TEXT NOT NULL,
  form_type TEXT NOT NULL CHECK (form_type IN ('base','plural','singular','third_person','past','past_participle','present_participle','gerund','infinitive','comparative','superlative','past_simple','other')),
  grammatical_features_json TEXT NOT NULL DEFAULT '{}',
  is_irregular INTEGER NOT NULL DEFAULT 0 CHECK (is_irregular IN (0,1)),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lexical_entry_id, normalized_form, form_type),
  FOREIGN KEY (lexical_entry_id) REFERENCES lexical_entries(id)
);

CREATE TABLE IF NOT EXISTS lexical_pronunciations (
  id TEXT PRIMARY KEY,
  lexical_entry_id TEXT NOT NULL,
  accent TEXT NOT NULL,
  ipa TEXT,
  audio_media_id TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lexical_entry_id, accent),
  FOREIGN KEY (lexical_entry_id) REFERENCES lexical_entries(id),
  FOREIGN KEY (audio_media_id) REFERENCES learning_media(id)
);

CREATE TABLE IF NOT EXISTS lexical_examples (
  id TEXT PRIMARY KEY,
  lexical_entry_id TEXT NOT NULL,
  lexical_sense_id TEXT,
  example_text TEXT NOT NULL,
  example_translation TEXT,
  context TEXT,
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  register TEXT,
  source_type TEXT NOT NULL DEFAULT 'editorial' CHECK (source_type IN ('editorial','course','corpus')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lexical_entry_id) REFERENCES lexical_entries(id),
  FOREIGN KEY (lexical_sense_id, lexical_entry_id) REFERENCES lexical_senses(id, lexical_entry_id)
);

CREATE TABLE IF NOT EXISTS lexical_collocations (
  id TEXT PRIMARY KEY,
  lexical_entry_id TEXT NOT NULL,
  lexical_sense_id TEXT,
  collocation_text TEXT NOT NULL,
  normalized_collocation TEXT NOT NULL,
  grammatical_pattern TEXT,
  meaning TEXT,
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  register TEXT,
  usage_context TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lexical_entry_id) REFERENCES lexical_entries(id),
  FOREIGN KEY (lexical_sense_id, lexical_entry_id) REFERENCES lexical_senses(id, lexical_entry_id)
);

CREATE TABLE IF NOT EXISTS lexical_relations (
  id TEXT PRIMARY KEY,
  source_entry_id TEXT NOT NULL,
  target_entry_id TEXT NOT NULL,
  relation_type TEXT NOT NULL CHECK (relation_type IN ('synonym','antonym','derived_from','word_family','collocation','related_expression','hyponym','hypernym')),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source_entry_id, target_entry_id, relation_type),
  CHECK (source_entry_id <> target_entry_id),
  FOREIGN KEY (source_entry_id) REFERENCES lexical_entries(id),
  FOREIGN KEY (target_entry_id) REFERENCES lexical_entries(id)
);

CREATE TABLE IF NOT EXISTS lexical_phrases (
  id TEXT PRIMARY KEY,
  lexical_entry_id TEXT NOT NULL UNIQUE,
  phrase_type TEXT NOT NULL CHECK (phrase_type IN ('idiom','fixed_expression','discourse_marker','proverb','formulaic_expression','other')),
  syntactic_pattern TEXT,
  is_compositional INTEGER NOT NULL DEFAULT 0 CHECK (is_compositional IN (0,1)),
  usage_context TEXT,
  register TEXT,
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lexical_entry_id) REFERENCES lexical_entries(id)
);

CREATE TABLE IF NOT EXISTS lexical_phrasal_verbs (
  id TEXT PRIMARY KEY,
  lexical_entry_id TEXT NOT NULL UNIQUE,
  verb_lemma TEXT NOT NULL,
  particle TEXT NOT NULL,
  transitivity TEXT NOT NULL CHECK (transitivity IN ('transitive','intransitive','both')),
  separability TEXT NOT NULL CHECK (separability IN ('separable','inseparable','not_applicable','variable')),
  object_position TEXT CHECK (object_position IS NULL OR object_position IN ('before_particle','after_particle','either','not_applicable','variable')),
  grammar_notes TEXT,
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  register TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lexical_entry_id) REFERENCES lexical_entries(id)
);

CREATE TABLE IF NOT EXISTS lexical_false_friends (
  id TEXT PRIMARY KEY,
  source_entry_id TEXT NOT NULL,
  comparison_entry_id TEXT NOT NULL,
  source_language_code TEXT NOT NULL,
  comparison_language_code TEXT NOT NULL,
  false_friend_type TEXT NOT NULL CHECK (false_friend_type IN ('total','partial')),
  misleading_meaning TEXT NOT NULL,
  actual_meaning TEXT NOT NULL,
  comparison_actual_meaning TEXT,
  explanation TEXT,
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (source_language_code <> comparison_language_code),
  CHECK (source_entry_id <> comparison_entry_id),
  FOREIGN KEY (source_entry_id) REFERENCES lexical_entries(id),
  FOREIGN KEY (comparison_entry_id) REFERENCES lexical_entries(id)
);

CREATE TABLE IF NOT EXISTS lexical_compatibility_rules (
  id TEXT PRIMARY KEY,
  source_entry_id TEXT NOT NULL,
  source_sense_id TEXT,
  target_entry_id TEXT,
  target_sense_id TEXT,
  rule_code TEXT NOT NULL,
  compatibility TEXT NOT NULL CHECK (compatibility IN ('natural','contextual','invalid')),
  rule_category TEXT NOT NULL CHECK (rule_category IN ('grammatical','semantic','contextual','register','collocational')),
  explanation TEXT NOT NULL,
  example_text TEXT,
  counterexample_text TEXT,
  cefr_level TEXT CHECK (cefr_level IS NULL OR cefr_level IN ('A1','A2','B1','B2','C1','C2')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source_entry_id, source_sense_id, target_entry_id, target_sense_id, rule_code),
  FOREIGN KEY (source_entry_id) REFERENCES lexical_entries(id),
  FOREIGN KEY (source_sense_id, source_entry_id) REFERENCES lexical_senses(id, lexical_entry_id),
  FOREIGN KEY (target_entry_id) REFERENCES lexical_entries(id),
  FOREIGN KEY (target_sense_id, target_entry_id) REFERENCES lexical_senses(id, lexical_entry_id)
);

CREATE INDEX IF NOT EXISTS idx_lexical_collocations_entry_status ON lexical_collocations(lexical_entry_id, status);
CREATE INDEX IF NOT EXISTS idx_lexical_compatibility_source_sense ON lexical_compatibility_rules(source_sense_id);
CREATE INDEX IF NOT EXISTS idx_lexical_compatibility_target ON lexical_compatibility_rules(target_entry_id);
CREATE INDEX IF NOT EXISTS idx_lexical_compatibility_target_sense ON lexical_compatibility_rules(target_sense_id);
CREATE INDEX IF NOT EXISTS idx_lexical_entries_language_lemma ON lexical_entries(language_code, normalized_lemma);
CREATE INDEX IF NOT EXISTS idx_lexical_examples_entry_status ON lexical_examples(lexical_entry_id, status);
CREATE INDEX IF NOT EXISTS idx_lexical_false_friends_comparison ON lexical_false_friends(comparison_entry_id);
CREATE INDEX IF NOT EXISTS idx_lexical_false_friends_source ON lexical_false_friends(source_entry_id);
CREATE INDEX IF NOT EXISTS idx_lexical_forms_language_form ON lexical_forms(normalized_form);
CREATE INDEX IF NOT EXISTS idx_lexical_phrasal_verbs_entry_status ON lexical_phrasal_verbs(lexical_entry_id, status);
CREATE INDEX IF NOT EXISTS idx_lexical_phrases_entry_status ON lexical_phrases(lexical_entry_id, status);
CREATE INDEX IF NOT EXISTS idx_lexical_relations_target ON lexical_relations(target_entry_id);
CREATE INDEX IF NOT EXISTS idx_lexical_senses_entry_status ON lexical_senses(lexical_entry_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_lexical_senses_id_entry ON lexical_senses(id, lexical_entry_id);

CREATE VIEW IF NOT EXISTS lexical_search_index AS
SELECT e.id AS entry_id, e.language_code, e.lemma, e.normalized_lemma,
       e.part_of_speech, e.cefr_level AS entry_cefr_level,
       e.lemma AS matched_term, e.normalized_lemma AS normalized_term,
       NULL AS form_type, 'lemma' AS match_type
FROM lexical_entries e
WHERE e.status = 'published'
UNION ALL
SELECT e.id AS entry_id, e.language_code, e.lemma, e.normalized_lemma,
       e.part_of_speech, e.cefr_level AS entry_cefr_level,
       f.form AS matched_term, f.normalized_form AS normalized_term,
       f.form_type, 'inflected_form' AS match_type
FROM lexical_forms f
JOIN lexical_entries e ON e.id = f.lexical_entry_id
WHERE e.status = 'published' AND f.status = 'published';
