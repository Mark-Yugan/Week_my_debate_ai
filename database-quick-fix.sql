-- ==================================================
-- QUICK DATABASE FIX FOR MISSING COLUMNS
-- Run this in Supabase SQL Editor
-- ==================================================

-- Check if the users table exists and what columns it has
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- If the above query returns no results or missing columns, run the full schema:

-- ==================================================
-- STEP 1: DROP EXISTING CUSTOM TABLES (if any)
-- ==================================================
DROP TABLE IF EXISTS public.password_resets CASCADE;
DROP TABLE IF EXISTS public.email_verifications CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- ==================================================
-- STEP 2: CREATE CUSTOM USERS TABLE
-- ==================================================
CREATE TABLE public.users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    user_role TEXT DEFAULT 'student' CHECK (user_role IN ('student', 'teacher', 'admin')),
    tokens INTEGER DEFAULT 156,
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==================================================
-- STEP 3: CREATE EMAIL VERIFICATION TABLE
-- ==================================================
CREATE TABLE public.email_verifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    verification_code TEXT NOT NULL,
    verification_type TEXT NOT NULL CHECK (verification_type IN ('registration', 'password_reset')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==================================================
-- STEP 4: CREATE USER SESSIONS TABLE
-- ==================================================
CREATE TABLE public.user_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==================================================
-- STEP 5: CREATE PASSWORD RESETS TABLE
-- ==================================================
CREATE TABLE public.password_resets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    reset_code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==================================================
-- STEP 6: CREATE INDEXES FOR PERFORMANCE
-- ==================================================
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_email_verified ON public.users(email_verified);
CREATE INDEX idx_email_verifications_user_id ON public.email_verifications(user_id);
CREATE INDEX idx_email_verifications_code ON public.email_verifications(verification_code);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_password_resets_code ON public.password_resets(reset_code);
CREATE INDEX idx_password_resets_email ON public.password_resets(email);

-- ==================================================
-- STEP 7: ENABLE ROW LEVEL SECURITY
-- ==================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- STEP 8: CREATE RLS POLICIES
-- ==================================================

-- Users can read their own data
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (auth.uid() = id OR auth.role() = 'service_role');

-- Users can update their own data
CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id OR auth.role() = 'service_role');

-- Allow service role to insert users (for registration)
CREATE POLICY "users_insert_service" ON public.users
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Email verifications policies
CREATE POLICY "email_verifications_all" ON public.email_verifications
    FOR ALL USING (auth.role() = 'service_role');

-- User sessions policies  
CREATE POLICY "user_sessions_all" ON public.user_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- Password resets policies
CREATE POLICY "password_resets_all" ON public.password_resets
    FOR ALL USING (auth.role() = 'service_role');

-- ==================================================
-- VERIFICATION QUERY
-- ==================================================
-- Run this to verify the tables were created correctly:
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'email_verifications', 'user_sessions', 'password_resets')
ORDER BY tablename;