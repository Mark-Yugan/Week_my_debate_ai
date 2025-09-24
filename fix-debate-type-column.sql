-- ==================================================
-- FIX DEBATE_TYPE COLUMN ISSUE
-- This script fixes the not-null constraint issue with debate_type column
-- Run this in Supabase SQL Editor to fix the column constraint
-- ==================================================

-- Option 1: Make debate_type column nullable (RECOMMENDED)
-- This allows existing code to work without modification
ALTER TABLE public.debate_sessions ALTER COLUMN debate_type DROP NOT NULL;

-- Set a default value for the column if it doesn't have one
ALTER TABLE public.debate_sessions ALTER COLUMN debate_type SET DEFAULT 'chanakya';

-- Update any existing rows that have null debate_type
UPDATE public.debate_sessions 
SET debate_type = 'chanakya' 
WHERE debate_type IS NULL;

-- Summary
DO $$
BEGIN
    RAISE NOTICE '=== DEBATE_TYPE COLUMN FIX COMPLETE ===';
    RAISE NOTICE 'Changes made:';
    RAISE NOTICE '  ✓ Made debate_type column nullable';
    RAISE NOTICE '  ✓ Set default value to "chanakya"';
    RAISE NOTICE '  ✓ Updated existing null values';
    RAISE NOTICE '';
    RAISE NOTICE 'Debate creation should now work without the not-null constraint error!';
END $$;