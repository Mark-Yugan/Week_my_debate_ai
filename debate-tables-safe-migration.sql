-- ==================================================
-- DEBATE TABLES FOR CUSTOM AUTH - SAFE VERSION
-- Create debate-related tables and views for custom authentication
-- This version checks existing schema and handles conflicts gracefully
-- ==================================================

-- Step 1: Check and create debate_sessions table
DO $$
BEGIN
    -- Check if debate_sessions table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'debate_sessions') THEN
        -- Create new table
        CREATE TABLE public.debate_sessions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            topic TEXT NOT NULL,
            topic_type TEXT DEFAULT 'general',
            user_position TEXT CHECK (user_position IN ('for', 'against')),
            first_speaker TEXT CHECK (first_speaker IN ('user', 'ai')) DEFAULT 'user',
            difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
            status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now(),
            completed_at TIMESTAMPTZ,
            total_turns INTEGER DEFAULT 0,
            session_duration INTEGER,
            metadata JSONB DEFAULT '{}'::jsonb
        );
        
        RAISE NOTICE 'Created new debate_sessions table';
    ELSE
        RAISE NOTICE 'debate_sessions table already exists, checking columns...';
        
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'status') THEN
            ALTER TABLE public.debate_sessions ADD COLUMN status TEXT CHECK (status IN ('active', 'completed', 'abandoned')) DEFAULT 'active';
            RAISE NOTICE 'Added status column to debate_sessions';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'difficulty') THEN
            ALTER TABLE public.debate_sessions ADD COLUMN difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium';
            RAISE NOTICE 'Added difficulty column to debate_sessions';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'topic_type') THEN
            ALTER TABLE public.debate_sessions ADD COLUMN topic_type TEXT DEFAULT 'general';
            RAISE NOTICE 'Added topic_type column to debate_sessions';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'user_position') THEN
            ALTER TABLE public.debate_sessions ADD COLUMN user_position TEXT CHECK (user_position IN ('for', 'against'));
            RAISE NOTICE 'Added user_position column to debate_sessions';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'first_speaker') THEN
            ALTER TABLE public.debate_sessions ADD COLUMN first_speaker TEXT CHECK (first_speaker IN ('user', 'ai')) DEFAULT 'user';
            RAISE NOTICE 'Added first_speaker column to debate_sessions';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'total_turns') THEN
            ALTER TABLE public.debate_sessions ADD COLUMN total_turns INTEGER DEFAULT 0;
            RAISE NOTICE 'Added total_turns column to debate_sessions';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'session_duration') THEN
            ALTER TABLE public.debate_sessions ADD COLUMN session_duration INTEGER;
            RAISE NOTICE 'Added session_duration column to debate_sessions';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'completed_at') THEN
            ALTER TABLE public.debate_sessions ADD COLUMN completed_at TIMESTAMPTZ;
            RAISE NOTICE 'Added completed_at column to debate_sessions';
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'debate_sessions' AND column_name = 'metadata') THEN
            ALTER TABLE public.debate_sessions ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
            RAISE NOTICE 'Added metadata column to debate_sessions';
        END IF;
    END IF;
    
    -- Ensure foreign key constraint exists (add reference to users table)
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE table_name = 'debate_sessions' 
        AND constraint_type = 'FOREIGN KEY'
        AND constraint_name LIKE '%user_id%'
    ) THEN
        -- Check if users table exists before adding foreign key
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
            ALTER TABLE public.debate_sessions 
            ADD CONSTRAINT fk_debate_sessions_user_id 
            FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
            RAISE NOTICE 'Added foreign key constraint to users table';
        ELSE
            RAISE NOTICE 'Users table not found - skipping foreign key constraint';
        END IF;
    END IF;
END $$;

-- Step 2: Check and create debate_messages table
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'debate_messages') THEN
        CREATE TABLE public.debate_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            debate_session_id UUID NOT NULL,
            speaker TEXT NOT NULL CHECK (speaker IN ('user', 'ai')),
            message_text TEXT NOT NULL,
            turn_number INTEGER NOT NULL,
            timestamp TIMESTAMPTZ DEFAULT now(),
            processing_time INTEGER,
            confidence_score DECIMAL(3,2),
            relevance_score DECIMAL(3,2),
            message_type TEXT DEFAULT 'debate_turn',
            metadata JSONB DEFAULT '{}'::jsonb
        );
        
        -- Add foreign key constraint
        ALTER TABLE public.debate_messages 
        ADD CONSTRAINT fk_debate_messages_session_id 
        FOREIGN KEY (debate_session_id) REFERENCES public.debate_sessions(id) ON DELETE CASCADE;
        
        RAISE NOTICE 'Created new debate_messages table';
    ELSE
        RAISE NOTICE 'debate_messages table already exists';
    END IF;
END $$;

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_debate_sessions_user_id ON public.debate_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_debate_sessions_created_at ON public.debate_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_debate_sessions_status ON public.debate_sessions(status);
CREATE INDEX IF NOT EXISTS idx_debate_messages_session_id ON public.debate_messages(debate_session_id);
CREATE INDEX IF NOT EXISTS idx_debate_messages_turn_number ON public.debate_messages(turn_number);

-- Step 4: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 5: Create triggers
DROP TRIGGER IF EXISTS handle_updated_at_debate_sessions ON public.debate_sessions;
CREATE TRIGGER handle_updated_at_debate_sessions
    BEFORE UPDATE ON public.debate_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Create debate_session_summaries view
DROP VIEW IF EXISTS public.debate_session_summaries;
CREATE VIEW public.debate_session_summaries AS
SELECT 
    ds.id,
    ds.user_id,
    ds.topic,
    COALESCE(ds.topic_type, 'general') as topic_type,
    ds.user_position,
    COALESCE(ds.difficulty, 'medium') as difficulty,
    COALESCE(ds.status, 'active') as status,
    ds.created_at,
    ds.completed_at,
    COALESCE(ds.total_turns, 0) as total_turns,
    ds.session_duration,
    COUNT(dm.id) as message_count,
    MAX(dm.timestamp) as last_message_at,
    COALESCE(ds.metadata, '{}'::jsonb) as metadata
FROM public.debate_sessions ds
LEFT JOIN public.debate_messages dm ON ds.id = dm.debate_session_id
GROUP BY ds.id, ds.user_id, ds.topic, ds.topic_type, ds.user_position, 
         ds.difficulty, ds.status, ds.created_at, ds.completed_at, 
         ds.total_turns, ds.session_duration, ds.metadata
ORDER BY ds.created_at DESC;

-- Step 7: Enable Row Level Security
ALTER TABLE public.debate_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_messages ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies (only if they don't exist)
DO $$
BEGIN
    -- Debate sessions policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'debate_sessions' AND policyname = 'Users can view their own debate sessions') THEN
        CREATE POLICY "Users can view their own debate sessions"
            ON public.debate_sessions FOR SELECT
            TO authenticated
            USING (user_id = (SELECT id FROM public.users WHERE id = auth.uid() OR id = current_setting('app.current_user_id', true)::uuid));
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'debate_sessions' AND policyname = 'Users can create their own debate sessions') THEN
        CREATE POLICY "Users can create their own debate sessions"
            ON public.debate_sessions FOR INSERT
            TO authenticated
            WITH CHECK (user_id = (SELECT id FROM public.users WHERE id = auth.uid() OR id = current_setting('app.current_user_id', true)::uuid));
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'debate_sessions' AND policyname = 'Users can update their own debate sessions') THEN
        CREATE POLICY "Users can update their own debate sessions"
            ON public.debate_sessions FOR UPDATE
            TO authenticated
            USING (user_id = (SELECT id FROM public.users WHERE id = auth.uid() OR id = current_setting('app.current_user_id', true)::uuid));
    END IF;

    -- Debate messages policies
    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'debate_messages' AND policyname = 'Users can view messages from their debates') THEN
        CREATE POLICY "Users can view messages from their debates"
            ON public.debate_messages FOR SELECT
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.debate_sessions 
                    WHERE id = debate_session_id 
                    AND user_id = (SELECT id FROM public.users WHERE id = auth.uid() OR id = current_setting('app.current_user_id', true)::uuid)
                )
            );
    END IF;

    IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'debate_messages' AND policyname = 'Users can insert messages to their debates') THEN
        CREATE POLICY "Users can insert messages to their debates"
            ON public.debate_messages FOR INSERT
            TO authenticated
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.debate_sessions 
                    WHERE id = debate_session_id 
                    AND user_id = (SELECT id FROM public.users WHERE id = auth.uid() OR id = current_setting('app.current_user_id', true)::uuid)
                )
            );
    END IF;
END $$;

-- Step 9: Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debate_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debate_messages TO authenticated;
GRANT SELECT ON public.debate_session_summaries TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Step 10: Helper function for custom auth
CREATE OR REPLACE FUNCTION set_current_user_id(user_id UUID)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION set_current_user_id(UUID) TO authenticated;

-- Final summary
DO $$
BEGIN
    RAISE NOTICE '=== DEBATE TABLES SETUP COMPLETE ===';
    RAISE NOTICE 'Tables configured:';
    RAISE NOTICE '  ✓ debate_sessions (with all required columns)';
    RAISE NOTICE '  ✓ debate_messages (linked to debate_sessions)';
    RAISE NOTICE 'Views created:';
    RAISE NOTICE '  ✓ debate_session_summaries (summary view)';
    RAISE NOTICE 'Security configured:';
    RAISE NOTICE '  ✓ RLS policies for custom authentication';
    RAISE NOTICE '  ✓ Helper functions for auth support';
    RAISE NOTICE '';
    RAISE NOTICE 'The database is now ready for custom authentication with debates!';
END $$;