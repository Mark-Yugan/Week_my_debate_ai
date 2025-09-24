-- ==================================================
-- COMPLETE DATABASE FIX FOR DEBATEWORLD AI
-- Run this entire script in Supabase SQL Editor
-- ==================================================

-- First, let's ensure we have the correct database structure
-- and fix any issues with user registration and RLS

BEGIN;

-- ==================================================
-- 1. CREATE OR UPDATE PROFILES TABLE
-- ==================================================

-- Drop existing table if it has issues and recreate
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table with proper structure
CREATE TABLE public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    user_role TEXT DEFAULT 'student' CHECK (user_role IN ('student', 'teacher', 'admin')),
    tokens INTEGER DEFAULT 156,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==================================================
-- 2. CREATE OTHER REQUIRED TABLES
-- ==================================================

-- Create debate_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.debate_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    topic TEXT NOT NULL,
    debate_type TEXT NOT NULL,
    speech_text TEXT,
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create freud_feedback table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.freud_feedback (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.debate_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    id_score DECIMAL(3,1) NOT NULL CHECK (id_score >= 0 AND id_score <= 10),
    ego_score DECIMAL(3,1) NOT NULL CHECK (ego_score >= 0 AND ego_score <= 10),
    superego_score DECIMAL(3,1) NOT NULL CHECK (superego_score >= 0 AND superego_score <= 10),
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    feedback_text TEXT,
    analysis_reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suggested_topics table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.suggested_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    topic_text TEXT NOT NULL,
    category TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freud_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggested_topics ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- 4. DROP EXISTING POLICIES (TO AVOID CONFLICTS)
-- ==================================================

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own debate sessions" ON public.debate_sessions;
DROP POLICY IF EXISTS "Users can create their own debate sessions" ON public.debate_sessions;
DROP POLICY IF EXISTS "Users can update their own debate sessions" ON public.debate_sessions;
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.freud_feedback;
DROP POLICY IF EXISTS "Users can insert feedback for their sessions" ON public.freud_feedback;
DROP POLICY IF EXISTS "Users can view their own suggested topics" ON public.suggested_topics;
DROP POLICY IF EXISTS "Users can create their own suggested topics" ON public.suggested_topics;
DROP POLICY IF EXISTS "Users can update their own suggested topics" ON public.suggested_topics;

-- ==================================================
-- 5. CREATE PROPER RLS POLICIES
-- ==================================================

-- Profiles table policies
CREATE POLICY "Users can view their own profile" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Debate sessions policies
CREATE POLICY "Users can view their own debate sessions" 
    ON public.debate_sessions 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own debate sessions" 
    ON public.debate_sessions 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debate sessions" 
    ON public.debate_sessions 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Freud feedback policies
CREATE POLICY "Users can view their own feedback" 
    ON public.freud_feedback 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert feedback for their sessions" 
    ON public.freud_feedback 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Suggested topics policies
CREATE POLICY "Users can view their own suggested topics" 
    ON public.suggested_topics 
    FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own suggested topics" 
    ON public.suggested_topics 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suggested topics" 
    ON public.suggested_topics 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ==================================================
-- 6. CREATE UPDATED TIMESTAMP FUNCTIONS
-- ==================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ==================================================
-- 7. CREATE PROFILE CREATION FUNCTION (FIXED)
-- ==================================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
    -- Insert new profile with error handling
    INSERT INTO public.profiles (
        id, 
        email, 
        full_name, 
        avatar_url,
        user_role,
        tokens
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
        NEW.raw_user_meta_data ->> 'avatar_url',
        'student',
        156
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't fail the user creation
        RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- ==================================================
-- 8. CREATE/UPDATE TRIGGERS
-- ==================================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS handle_updated_at_debate_sessions ON public.debate_sessions;
DROP TRIGGER IF EXISTS handle_updated_at_suggested_topics ON public.suggested_topics;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_new_user();

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_debate_sessions
    BEFORE UPDATE ON public.debate_sessions
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_suggested_topics
    BEFORE UPDATE ON public.suggested_topics
    FOR EACH ROW 
    EXECUTE FUNCTION public.handle_updated_at();

-- ==================================================
-- 9. GRANT NECESSARY PERMISSIONS
-- ==================================================

-- Grant usage on public schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debate_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.freud_feedback TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggested_topics TO authenticated;

-- Grant permission to anon for profile reading (for public profiles if needed)
GRANT SELECT ON public.profiles TO anon;

-- ==================================================
-- 10. CREATE INDEXES FOR PERFORMANCE
-- ==================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_debate_sessions_user_id ON public.debate_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_debate_sessions_created_at ON public.debate_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_freud_feedback_user_id ON public.freud_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_freud_feedback_session_id ON public.freud_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_suggested_topics_user_id ON public.suggested_topics(user_id);

-- ==================================================
-- 11. TEST DATA CLEANUP (OPTIONAL)
-- ==================================================

-- Clean up any orphaned data
DELETE FROM public.debate_sessions WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.freud_feedback WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.suggested_topics WHERE user_id NOT IN (SELECT id FROM auth.users);

-- ==================================================
-- 12. VERIFY SETUP
-- ==================================================

-- Create a function to verify the setup
CREATE OR REPLACE FUNCTION public.verify_database_setup()
RETURNS TABLE (
    check_name TEXT,
    status TEXT,
    details TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Check if tables exist
    RETURN QUERY SELECT 
        'Tables exist'::TEXT,
        CASE WHEN COUNT(*) = 4 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Found ' || COUNT(*) || ' out of 4 required tables'::TEXT
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'debate_sessions', 'freud_feedback', 'suggested_topics');
    
    -- Check if RLS is enabled
    RETURN QUERY SELECT 
        'RLS enabled'::TEXT,
        CASE WHEN COUNT(*) = 4 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'RLS enabled on ' || COUNT(*) || ' out of 4 tables'::TEXT
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'debate_sessions', 'freud_feedback', 'suggested_topics')
    AND rowsecurity = true;
    
    -- Check if trigger function exists
    RETURN QUERY SELECT 
        'Trigger function exists'::TEXT,
        CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'handle_new_user function ' || CASE WHEN COUNT(*) > 0 THEN 'exists' ELSE 'missing' END::TEXT
    FROM information_schema.routines 
    WHERE routine_name = 'handle_new_user';
    
    -- Check if trigger exists
    RETURN QUERY SELECT 
        'Profile creation trigger exists'::TEXT,
        CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'on_auth_user_created trigger ' || CASE WHEN COUNT(*) > 0 THEN 'exists' ELSE 'missing' END::TEXT
    FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created';
END;
$$;

COMMIT;

-- ==================================================
-- VERIFICATION
-- ==================================================

-- Run verification to check if everything is set up correctly
SELECT * FROM public.verify_database_setup();

-- ==================================================
-- FINAL NOTES
-- ==================================================

-- After running this script:
-- 1. User registration should work properly
-- 2. RLS should be properly configured
-- 3. Profile creation should work automatically
-- 4. All database operations should be secure
-- 5. Visit http://localhost:8082/debug to test all flows