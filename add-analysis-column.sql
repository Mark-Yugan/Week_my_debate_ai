
ALTER TABLE debate_sessions 
ADD COLUMN analysis_data JSONB;

COMMENT ON COLUMN debate_sessions.analysis_data IS 'Stores comprehensive debate analysis including scores, metrics, feedback, and improvement plans from AI evaluation';

CREATE INDEX idx_debate_sessions_analysis_data ON debate_sessions USING GIN (analysis_data);

ALTER TABLE debate_sessions 
ADD CONSTRAINT check_analysis_data_is_json 
CHECK (analysis_data IS NULL OR jsonb_typeof(analysis_data) = 'object');
-- Idempotent PostgreSQL migration: add analysis_data (JSONB) to debate_sessions
-- Safe to run multiple times; checks for existing column/index/constraint first.

-- 1) Add column if missing
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.columns
		WHERE table_name = 'debate_sessions' AND column_name = 'analysis_data'
	) THEN
		ALTER TABLE debate_sessions
		ADD COLUMN analysis_data JSONB;
	END IF;
END
$$;

-- 2) Add a comment to document purpose (harmless if run repeatedly)
COMMENT ON COLUMN debate_sessions.analysis_data IS
	'Stores comprehensive debate analysis including scores, metrics, feedback, and improvement plans from AI evaluation';

-- 3) Create a GIN index for JSONB queries if it doesn't exist
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_class c
		JOIN pg_namespace n ON n.oid = c.relnamespace
		WHERE c.relkind = 'i' AND c.relname = 'idx_debate_sessions_analysis_data'
	) THEN
		CREATE INDEX idx_debate_sessions_analysis_data ON debate_sessions USING GIN (analysis_data);
	END IF;
END
$$;

-- 4) Add a check constraint to ensure analysis_data is an object or NULL
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM information_schema.table_constraints tc
		JOIN information_schema.constraint_column_usage ccu
			ON tc.constraint_name = ccu.constraint_name
		WHERE tc.table_name = 'debate_sessions' AND tc.constraint_type = 'CHECK' AND ccu.column_name = 'analysis_data'
	) THEN
		ALTER TABLE debate_sessions
		ADD CONSTRAINT check_analysis_data_is_json
		CHECK (analysis_data IS NULL OR jsonb_typeof(analysis_data) = 'object');
	END IF;
END
$$;

-- End of migration