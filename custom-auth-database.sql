-- ==================================================
-- CUSTOM AUTHENTICATION SYSTEM DATABASE SCHEMA
-- Complete custom auth system with email verification
-- ==================================================

BEGIN;

-- ==================================================
-- 1. CREATE CUSTOM USERS TABLE
-- ==================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.password_resets CASCADE;
DROP TABLE IF EXISTS public.email_verifications CASCADE;
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create custom users table
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
-- 2. CREATE EMAIL VERIFICATION TABLE
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
-- 3. CREATE USER SESSIONS TABLE
-- ==================================================

CREATE TABLE public.user_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==================================================
-- 4. CREATE PASSWORD RESET TABLE (For tracking reset attempts)
-- ==================================================

CREATE TABLE public.password_resets (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    reset_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==================================================
-- 5. CREATE OTHER REQUIRED TABLES (Updated to reference custom users)
-- ==================================================

-- Update existing tables to reference custom users table

DROP TABLE IF EXISTS public.debate_sessions CASCADE;
DROP TABLE IF EXISTS public.freud_feedback CASCADE;
DROP TABLE IF EXISTS public.suggested_topics CASCADE;

-- Create debate_sessions table
CREATE TABLE public.debate_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    topic TEXT NOT NULL,
    debate_type TEXT NOT NULL,
    speech_text TEXT,
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create freud_feedback table
CREATE TABLE public.freud_feedback (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.debate_sessions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    id_score DECIMAL(3,1) NOT NULL CHECK (id_score >= 0 AND id_score <= 10),
    ego_score DECIMAL(3,1) NOT NULL CHECK (ego_score >= 0 AND ego_score <= 10),
    superego_score DECIMAL(3,1) NOT NULL CHECK (superego_score >= 0 AND superego_score <= 10),
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    feedback_text TEXT,
    analysis_reasoning TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suggested_topics table
CREATE TABLE public.suggested_topics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    topic_text TEXT NOT NULL,
    category TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ==================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freud_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggested_topics ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- 7. CREATE RLS POLICIES
-- ==================================================

-- Users table policies (users can only see/update their own data)
CREATE POLICY "Users can view their own profile" 
    ON public.users 
    FOR SELECT 
    USING (id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "Users can update their own profile" 
    ON public.users 
    FOR UPDATE 
    USING (id = (current_setting('app.current_user_id', true))::uuid);

-- Email verifications policies
CREATE POLICY "Users can view their own email verifications" 
    ON public.email_verifications 
    FOR SELECT 
    USING (user_id = (current_setting('app.current_user_id', true))::uuid);

-- Sessions policies
CREATE POLICY "Users can view their own sessions" 
    ON public.user_sessions 
    FOR SELECT 
    USING (user_id = (current_setting('app.current_user_id', true))::uuid);

-- Password resets policies
CREATE POLICY "Users can view their own password resets" 
    ON public.password_resets 
    FOR SELECT 
    USING (user_id = (current_setting('app.current_user_id', true))::uuid);

-- Debate sessions policies
CREATE POLICY "Users can view their own debate sessions" 
    ON public.debate_sessions 
    FOR SELECT 
    USING (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "Users can create their own debate sessions" 
    ON public.debate_sessions 
    FOR INSERT 
    WITH CHECK (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "Users can update their own debate sessions" 
    ON public.debate_sessions 
    FOR UPDATE 
    USING (user_id = (current_setting('app.current_user_id', true))::uuid);

-- Freud feedback policies
CREATE POLICY "Users can view their own feedback" 
    ON public.freud_feedback 
    FOR SELECT 
    USING (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "Users can insert feedback for their sessions" 
    ON public.freud_feedback 
    FOR INSERT 
    WITH CHECK (user_id = (current_setting('app.current_user_id', true))::uuid);

-- Suggested topics policies
CREATE POLICY "Users can view their own suggested topics" 
    ON public.suggested_topics 
    FOR SELECT 
    USING (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "Users can create their own suggested topics" 
    ON public.suggested_topics 
    FOR INSERT 
    WITH CHECK (user_id = (current_setting('app.current_user_id', true))::uuid);

CREATE POLICY "Users can update their own suggested topics" 
    ON public.suggested_topics 
    FOR UPDATE 
    USING (user_id = (current_setting('app.current_user_id', true))::uuid);

-- ==================================================
-- 8. CREATE UTILITY FUNCTIONS
-- ==================================================

-- Function to generate random verification code
CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$;

-- Function to generate session token
CREATE OR REPLACE FUNCTION public.generate_session_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Function to hash password (basic implementation - in production, use bcrypt from application)
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
    -- Note: This is a simple hash. In production, use bcrypt from your application
    RETURN encode(digest(password || 'salt_here', 'sha256'), 'hex');
END;
$$;

-- Function to verify password
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN hash = encode(digest(password || 'salt_here', 'sha256'), 'hex');
END;
$$;

-- Function to clean up expired records
CREATE OR REPLACE FUNCTION public.cleanup_expired_records()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Clean up expired email verifications
    DELETE FROM public.email_verifications 
    WHERE expires_at < now() AND verified_at IS NULL;
    
    -- Clean up expired sessions
    DELETE FROM public.user_sessions 
    WHERE expires_at < now();
    
    -- Clean up expired password resets
    DELETE FROM public.password_resets 
    WHERE expires_at < now() AND used_at IS NULL;
END;
$$;

-- ==================================================
-- 9. CREATE AUTHENTICATION FUNCTIONS
-- ==================================================

-- Function to register a new user
CREATE OR REPLACE FUNCTION public.register_user(
    p_email TEXT,
    p_password TEXT,
    p_full_name TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_verification_code TEXT;
    v_result JSON;
BEGIN
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM public.users WHERE email = p_email) THEN
        RETURN json_build_object('success', false, 'error', 'Email already registered');
    END IF;
    
    -- Create user
    INSERT INTO public.users (email, password_hash, full_name, email_verified)
    VALUES (p_email, public.hash_password(p_password), p_full_name, false)
    RETURNING id INTO v_user_id;
    
    -- Generate verification code
    v_verification_code := public.generate_verification_code();
    
    -- Insert verification record
    INSERT INTO public.email_verifications (user_id, email, verification_code, verification_type, expires_at)
    VALUES (v_user_id, p_email, v_verification_code, 'registration', now() + interval '15 minutes');
    
    -- Return success with verification code
    RETURN json_build_object(
        'success', true, 
        'user_id', v_user_id,
        'verification_code', v_verification_code,
        'message', 'User registered successfully. Please verify your email.'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to verify email
CREATE OR REPLACE FUNCTION public.verify_email(
    p_email TEXT,
    p_verification_code TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_verification_record RECORD;
    v_user_id UUID;
BEGIN
    -- Find valid verification record
    SELECT * INTO v_verification_record
    FROM public.email_verifications
    WHERE email = p_email 
    AND verification_code = p_verification_code 
    AND expires_at > now() 
    AND verified_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid or expired verification code');
    END IF;
    
    -- Mark email as verified
    UPDATE public.email_verifications
    SET verified_at = now()
    WHERE id = v_verification_record.id;
    
    -- Update user email_verified status
    UPDATE public.users
    SET email_verified = true, updated_at = now()
    WHERE id = v_verification_record.user_id
    RETURNING id INTO v_user_id;
    
    RETURN json_build_object(
        'success', true,
        'user_id', v_user_id,
        'message', 'Email verified successfully'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to login user
CREATE OR REPLACE FUNCTION public.login_user(
    p_email TEXT,
    p_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user RECORD;
    v_session_token TEXT;
    v_session_id UUID;
BEGIN
    -- Find user and verify password
    SELECT * INTO v_user
    FROM public.users
    WHERE email = p_email 
    AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid email or password');
    END IF;
    
    -- Check if email is verified
    IF NOT v_user.email_verified THEN
        RETURN json_build_object('success', false, 'error', 'Please verify your email before logging in');
    END IF;
    
    -- Verify password
    IF NOT public.verify_password(p_password, v_user.password_hash) THEN
        RETURN json_build_object('success', false, 'error', 'Invalid email or password');
    END IF;
    
    -- Generate session token
    v_session_token := public.generate_session_token();
    
    -- Create session
    INSERT INTO public.user_sessions (user_id, session_token, expires_at)
    VALUES (v_user.id, v_session_token, now() + interval '7 days')
    RETURNING id INTO v_session_id;
    
    -- Update last login
    UPDATE public.users 
    SET last_login_at = now(), updated_at = now()
    WHERE id = v_user.id;
    
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', v_user.id,
            'email', v_user.email,
            'full_name', v_user.full_name,
            'user_role', v_user.user_role,
            'tokens', v_user.tokens
        ),
        'session_token', v_session_token,
        'expires_at', now() + interval '7 days'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to request password reset
CREATE OR REPLACE FUNCTION public.request_password_reset(
    p_email TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_verification_code TEXT;
BEGIN
    -- Find user
    SELECT id INTO v_user_id
    FROM public.users
    WHERE email = p_email AND is_active = true;
    
    IF NOT FOUND THEN
        -- Don't reveal if email exists or not for security
        RETURN json_build_object('success', true, 'message', 'If the email exists, you will receive a reset code');
    END IF;
    
    -- Generate verification code
    v_verification_code := public.generate_verification_code();
    
    -- Insert verification record
    INSERT INTO public.email_verifications (user_id, email, verification_code, verification_type, expires_at)
    VALUES (v_user_id, p_email, v_verification_code, 'password_reset', now() + interval '15 minutes');
    
    RETURN json_build_object(
        'success', true,
        'verification_code', v_verification_code,
        'message', 'Password reset code sent to your email'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to reset password
CREATE OR REPLACE FUNCTION public.reset_password(
    p_email TEXT,
    p_verification_code TEXT,
    p_new_password TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_verification_record RECORD;
BEGIN
    -- Find valid verification record
    SELECT * INTO v_verification_record
    FROM public.email_verifications
    WHERE email = p_email 
    AND verification_code = p_verification_code 
    AND verification_type = 'password_reset'
    AND expires_at > now() 
    AND verified_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid or expired verification code');
    END IF;
    
    -- Update password
    UPDATE public.users
    SET password_hash = public.hash_password(p_new_password), updated_at = now()
    WHERE id = v_verification_record.user_id;
    
    -- Mark verification as used
    UPDATE public.email_verifications
    SET verified_at = now()
    WHERE id = v_verification_record.id;
    
    -- Invalidate all existing sessions for this user
    DELETE FROM public.user_sessions
    WHERE user_id = v_verification_record.user_id;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Password reset successfully'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to validate session
CREATE OR REPLACE FUNCTION public.validate_session(
    p_session_token TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session RECORD;
    v_user RECORD;
BEGIN
    -- Find valid session
    SELECT s.*, u.*
    INTO v_session
    FROM public.user_sessions s
    JOIN public.users u ON s.user_id = u.id
    WHERE s.session_token = p_session_token 
    AND s.expires_at > now()
    AND u.is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Invalid or expired session');
    END IF;
    
    -- Update last accessed
    UPDATE public.user_sessions
    SET last_accessed_at = now()
    WHERE session_token = p_session_token;
    
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', v_session.user_id,
            'email', v_session.email,
            'full_name', v_session.full_name,
            'user_role', v_session.user_role,
            'tokens', v_session.tokens,
            'email_verified', v_session.email_verified
        )
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to logout user
CREATE OR REPLACE FUNCTION public.logout_user(
    p_session_token TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.user_sessions
    WHERE session_token = p_session_token;
    
    RETURN json_build_object('success', true, 'message', 'Logged out successfully');
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- ==================================================
-- 10. CREATE INDEXES
-- ==================================================

-- Indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_email_verified ON public.users(email_verified);
CREATE INDEX idx_email_verifications_email ON public.email_verifications(email);
CREATE INDEX idx_email_verifications_code ON public.email_verifications(verification_code);
CREATE INDEX idx_email_verifications_expires ON public.email_verifications(expires_at);
CREATE INDEX idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON public.user_sessions(expires_at);
CREATE INDEX idx_password_resets_token ON public.password_resets(reset_token);
CREATE INDEX idx_debate_sessions_user_id ON public.debate_sessions(user_id);
CREATE INDEX idx_freud_feedback_user_id ON public.freud_feedback(user_id);
CREATE INDEX idx_suggested_topics_user_id ON public.suggested_topics(user_id);

-- ==================================================
-- 11. CREATE TRIGGERS
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

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_updated_at_users
    BEFORE UPDATE ON public.users
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
-- 12. GRANT PERMISSIONS
-- ==================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.register_user(TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.verify_email(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.login_user(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.reset_password(TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.validate_session(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.logout_user(TEXT) TO anon, authenticated;

-- Grant table permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.debate_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.freud_feedback TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suggested_topics TO authenticated;

COMMIT;

-- ==================================================
-- 13. VERIFICATION FUNCTION
-- ==================================================

CREATE OR REPLACE FUNCTION public.verify_custom_auth_setup()
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
        'Custom Auth Tables'::TEXT,
        CASE WHEN COUNT(*) = 7 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Found ' || COUNT(*) || ' out of 7 required tables'::TEXT
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('users', 'email_verifications', 'user_sessions', 'password_resets', 'debate_sessions', 'freud_feedback', 'suggested_topics');
    
    -- Check if functions exist
    RETURN QUERY SELECT 
        'Auth Functions'::TEXT,
        CASE WHEN COUNT(*) >= 6 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Found ' || COUNT(*) || ' auth functions'::TEXT
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
    AND routine_name IN ('register_user', 'verify_email', 'login_user', 'request_password_reset', 'reset_password', 'validate_session');
    
    -- Check if RLS is enabled
    RETURN QUERY SELECT 
        'RLS enabled'::TEXT,
        CASE WHEN COUNT(*) = 7 THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'RLS enabled on ' || COUNT(*) || ' out of 7 tables'::TEXT
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename IN ('users', 'email_verifications', 'user_sessions', 'password_resets', 'debate_sessions', 'freud_feedback', 'suggested_topics')
    AND rowsecurity = true;
END;
$$;

-- Run verification
SELECT * FROM public.verify_custom_auth_setup();