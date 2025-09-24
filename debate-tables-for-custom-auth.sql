-- ==================================================
-- DEBATE TABLES FOR CUSTOM AUTH
-- Create debate-related tables and views for custom authentication
-- Run this in Supabase SQL Editor after running database-quick-fix.sql
-- ==================================================

-- Drop existing objects first to avoid conflicts
DROP VIEW IF EXISTS public.debate_session_summaries;
DROP TABLE IF EXISTS public.debate_messages;
DROP TABLE IF EXISTS public.debate_sessions;

-- Create debate_sessions table
CREATE TABLE public.debate_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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
    session_duration INTEGER, -- in seconds
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create debate_messages table
CREATE TABLE public.debate_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debate_session_id UUID NOT NULL REFERENCES public.debate_sessions(id) ON DELETE CASCADE,
    speaker TEXT NOT NULL CHECK (speaker IN ('user', 'ai')),
    message_text TEXT NOT NULL,
    turn_number INTEGER NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now(),
    processing_time INTEGER, -- in milliseconds
    confidence_score DECIMAL(3,2),
    relevance_score DECIMAL(3,2),
    message_type TEXT DEFAULT 'debate_turn',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_debate_sessions_user_id ON public.debate_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_debate_sessions_created_at ON public.debate_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_debate_sessions_status ON public.debate_sessions(status);
CREATE INDEX IF NOT EXISTS idx_debate_messages_session_id ON public.debate_messages(debate_session_id);
CREATE INDEX IF NOT EXISTS idx_debate_messages_turn_number ON public.debate_messages(turn_number);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at_debate_sessions ON public.debate_sessions;
CREATE TRIGGER handle_updated_at_debate_sessions
    BEFORE UPDATE ON public.debate_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for debate session summaries (compatible with custom auth)
CREATE OR REPLACE VIEW public.debate_session_summaries AS
SELECT 
    ds.id,
    ds.user_id,
    ds.topic,
    ds.topic_type,
    ds.user_position,
    ds.difficulty,
    ds.status,
    ds.created_at,
    ds.completed_at,
    ds.total_turns,
    ds.session_duration,
    COUNT(dm.id) as message_count,
    MAX(dm.timestamp) as last_message_at,
    ds.metadata
FROM public.debate_sessions ds
LEFT JOIN public.debate_messages dm ON ds.id = dm.debate_session_id
GROUP BY ds.id, ds.user_id, ds.topic, ds.topic_type, ds.user_position, 
         ds.difficulty, ds.status, ds.created_at, ds.completed_at, 
         ds.total_turns, ds.session_duration, ds.metadata
ORDER BY ds.created_at DESC;

-- Enable Row Level Security
ALTER TABLE public.debate_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for debate_sessions
DROP POLICY IF EXISTS "Users can view their own debate sessions" ON public.debate_sessions;
CREATE POLICY "Users can view their own debate sessions"
    ON public.debate_sessions FOR SELECT
    TO authenticated
    USING (user_id = (SELECT id FROM public.users WHERE id = auth.uid() OR id = current_setting('app.current_user_id', true)::uuid));

DROP POLICY IF EXISTS "Users can create their own debate sessions" ON public.debate_sessions;
CREATE POLICY "Users can create their own debate sessions"
    ON public.debate_sessions FOR INSERT
    TO authenticated
    WITH CHECK (user_id = (SELECT id FROM public.users WHERE id = auth.uid() OR id = current_setting('app.current_user_id', true)::uuid));

DROP POLICY IF EXISTS "Users can update their own debate sessions" ON public.debate_sessions;
CREATE POLICY "Users can update their own debate sessions"
    ON public.debate_sessions FOR UPDATE
    TO authenticated
    USING (user_id = (SELECT id FROM public.users WHERE id = auth.uid() OR id = current_setting('app.current_user_id', true)::uuid));

-- Create RLS policies for debate_messages
DROP POLICY IF EXISTS "Users can view messages from their debates" ON public.debate_messages;
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

DROP POLICY IF EXISTS "Users can insert messages to their debates" ON public.debate_messages;
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

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debate_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debate_messages TO authenticated;
GRANT SELECT ON public.debate_session_summaries TO authenticated;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Add helpful functions for custom auth
CREATE OR REPLACE FUNCTION set_current_user_id(user_id UUID)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_user_id', user_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute on helper function
GRANT EXECUTE ON FUNCTION set_current_user_id(UUID) TO authenticated;

-- Summary
DO $$
BEGIN
    RAISE NOTICE 'Debate tables and views created successfully!';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  - debate_sessions (stores debate session information)';
    RAISE NOTICE '  - debate_messages (stores debate messages)';
    RAISE NOTICE 'Views created:';
    RAISE NOTICE '  - debate_session_summaries (view for session summaries)';
    RAISE NOTICE 'Helper functions:';
    RAISE NOTICE '  - set_current_user_id() (for custom auth support)';
    RAISE NOTICE '';
    RAISE NOTICE 'RLS policies created for secure access with custom authentication.';
END $$;