-- Migration to add age and institution fields to users table
-- Run this migration to add the new profile fields

-- Add age column (nullable, as profile fields are optional)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age IS NULL OR (age >= 1 AND age <= 150));

-- Add institution column (nullable, as profile fields are optional)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS institution TEXT;

-- Add speech_level column (nullable, as it's set through the test)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS speech_level TEXT CHECK (speech_level IS NULL OR speech_level IN ('beginner', 'amateur', 'expert'));

-- Update the register_user function to accept optional profile fields
CREATE OR REPLACE FUNCTION public.register_user(
    p_email TEXT,
    p_password TEXT,
    p_full_name TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_age INTEGER DEFAULT NULL,
    p_institution TEXT DEFAULT NULL,
    p_user_role TEXT DEFAULT 'student'
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
    -- Validate user_role
    IF p_user_role NOT IN ('student', 'teacher', 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Invalid user role');
    END IF;
    
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM public.users WHERE email = p_email) THEN
        RETURN json_build_object('success', false, 'error', 'Email already registered');
    END IF;
    
    -- Create user with optional profile fields
    INSERT INTO public.users (
        email, 
        password_hash, 
        full_name, 
        avatar_url,
        age,
        institution,
        user_role,
        email_verified
    )
    VALUES (
        p_email, 
        public.hash_password(p_password), 
        p_full_name, 
        p_avatar_url,
        p_age,
        p_institution,
        p_user_role,
        false
    )
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

-- Update login_user function to return all profile fields
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
            'avatar_url', v_user.avatar_url,
            'age', v_user.age,
            'institution', v_user.institution,
            'user_role', v_user.user_role,
            'speech_level', v_user.speech_level,
            'tokens', v_user.tokens,
            'email_verified', v_user.email_verified
        ),
        'session_token', v_session_token,
        'expires_at', now() + interval '7 days'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Update validate_session function to return all profile fields
CREATE OR REPLACE FUNCTION public.validate_session(
    p_session_token TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_session RECORD;
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
            'avatar_url', v_session.avatar_url,
            'age', v_session.age,
            'institution', v_session.institution,
            'user_role', v_session.user_role,
            'speech_level', v_session.speech_level,
            'tokens', v_session.tokens,
            'email_verified', v_session.email_verified
        )
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Function to update user profile
CREATE OR REPLACE FUNCTION public.update_user_profile(
    p_user_id UUID,
    p_full_name TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL,
    p_age INTEGER DEFAULT NULL,
    p_institution TEXT DEFAULT NULL,
    p_user_role TEXT DEFAULT NULL,
    p_speech_level TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_updated_user RECORD;
BEGIN
    -- Validate user_role if provided
    IF p_user_role IS NOT NULL AND p_user_role NOT IN ('student', 'teacher', 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'Invalid user role');
    END IF;
    
    -- Validate speech_level if provided
    IF p_speech_level IS NOT NULL AND p_speech_level NOT IN ('beginner', 'amateur', 'expert') THEN
        RETURN json_build_object('success', false, 'error', 'Invalid speech level');
    END IF;
    
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = p_user_id) THEN
        RETURN json_build_object('success', false, 'error', 'User not found');
    END IF;
    
    -- Update user profile fields (only update provided fields)
    UPDATE public.users
    SET 
        full_name = COALESCE(p_full_name, full_name),
        avatar_url = COALESCE(p_avatar_url, avatar_url),
        age = COALESCE(p_age, age),
        institution = COALESCE(p_institution, institution),
        user_role = COALESCE(p_user_role, user_role),
        speech_level = COALESCE(p_speech_level, speech_level),
        updated_at = now()
    WHERE id = p_user_id
    RETURNING * INTO v_updated_user;
    
    -- Return updated user data
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', v_updated_user.id,
            'email', v_updated_user.email,
            'full_name', v_updated_user.full_name,
            'avatar_url', v_updated_user.avatar_url,
            'age', v_updated_user.age,
            'institution', v_updated_user.institution,
            'user_role', v_updated_user.user_role,
            'speech_level', v_updated_user.speech_level,
            'tokens', v_updated_user.tokens,
            'email_verified', v_updated_user.email_verified
        ),
        'message', 'Profile updated successfully'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

