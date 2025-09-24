-- ==================================================
-- CUSTOM AUTHENTICATION FUNCTIONS
-- Run this AFTER running database-quick-fix.sql
-- ==================================================

-- ==================================================
-- FUNCTION 1: REGISTER USER
-- ==================================================
CREATE OR REPLACE FUNCTION register_user(
    p_email TEXT,
    p_password TEXT,
    p_full_name TEXT DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_password_hash TEXT;
    v_verification_code TEXT;
    v_result JSON;
BEGIN
    -- Generate password hash (using crypt with salt)
    v_password_hash := crypt(p_password, gen_salt('bf'));
    
    -- Generate 6-digit verification code
    v_verification_code := LPAD(floor(random() * 1000000)::TEXT, 6, '0');
    
    -- Insert user
    INSERT INTO public.users (email, password_hash, full_name, email_verified)
    VALUES (p_email, v_password_hash, p_full_name, false)
    RETURNING id INTO v_user_id;
    
    -- Insert email verification record
    INSERT INTO public.email_verifications (user_id, email, verification_code, verification_type, expires_at)
    VALUES (v_user_id, p_email, v_verification_code, 'registration', now() + INTERVAL '1 hour');
    
    -- Return success with verification code
    v_result := json_build_object(
        'success', true,
        'user_id', v_user_id,
        'verification_code', v_verification_code,
        'message', 'User registered successfully. Please verify your email.'
    );
    
    RETURN v_result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- FUNCTION 2: VERIFY EMAIL
-- ==================================================
CREATE OR REPLACE FUNCTION verify_email(
    p_email TEXT,
    p_verification_code TEXT
) RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_verification_record RECORD;
    v_result JSON;
BEGIN
    -- Find verification record
    SELECT * INTO v_verification_record
    FROM public.email_verifications
    WHERE email = p_email 
    AND verification_code = p_verification_code
    AND verification_type = 'registration'
    AND expires_at > now()
    AND verified_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid or expired verification code'
        );
    END IF;
    
    -- Mark email as verified
    UPDATE public.users 
    SET email_verified = true, updated_at = now()
    WHERE id = v_verification_record.user_id;
    
    -- Mark verification as used
    UPDATE public.email_verifications
    SET verified_at = now()
    WHERE id = v_verification_record.id;
    
    -- Return success
    v_result := json_build_object(
        'success', true,
        'user_id', v_verification_record.user_id,
        'message', 'Email verified successfully'
    );
    
    RETURN v_result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- FUNCTION 3: LOGIN USER
-- ==================================================
CREATE OR REPLACE FUNCTION login_user(
    p_email TEXT,
    p_password TEXT
) RETURNS JSON AS $$
DECLARE
    v_user_record RECORD;
    v_session_token TEXT;
    v_result JSON;
BEGIN
    -- Find user and verify password
    SELECT * INTO v_user_record
    FROM public.users
    WHERE email = p_email 
    AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid email or password'
        );
    END IF;
    
    -- Check if email is verified
    IF v_user_record.email_verified = false THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Please verify your email address before logging in'
        );
    END IF;
    
    -- Verify password
    IF v_user_record.password_hash != crypt(p_password, v_user_record.password_hash) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid email or password'
        );
    END IF;
    
    -- Generate session token
    v_session_token := encode(gen_random_bytes(32), 'base64');
    
    -- Create session
    INSERT INTO public.user_sessions (user_id, session_token, expires_at)
    VALUES (v_user_record.id, v_session_token, now() + INTERVAL '7 days');
    
    -- Update last login
    UPDATE public.users 
    SET last_login_at = now(), updated_at = now()
    WHERE id = v_user_record.id;
    
    -- Return success with user data and session
    v_result := json_build_object(
        'success', true,
        'session_token', v_session_token,
        'user', json_build_object(
            'id', v_user_record.id,
            'email', v_user_record.email,
            'full_name', v_user_record.full_name,
            'user_role', v_user_record.user_role,
            'tokens', v_user_record.tokens,
            'avatar_url', v_user_record.avatar_url
        ),
        'message', 'Login successful'
    );
    
    RETURN v_result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- FUNCTION 4: REQUEST PASSWORD RESET
-- ==================================================
CREATE OR REPLACE FUNCTION request_password_reset(
    p_email TEXT
) RETURNS JSON AS $$
DECLARE
    v_user_record RECORD;
    v_reset_code TEXT;
    v_result JSON;
BEGIN
    -- Find user
    SELECT * INTO v_user_record
    FROM public.users
    WHERE email = p_email AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;
    
    -- Generate 6-digit reset code
    v_reset_code := LPAD(floor(random() * 1000000)::TEXT, 6, '0');
    
    -- Insert password reset record
    INSERT INTO public.password_resets (user_id, email, reset_code, expires_at)
    VALUES (v_user_record.id, p_email, v_reset_code, now() + INTERVAL '1 hour');
    
    -- Return success with reset code
    v_result := json_build_object(
        'success', true,
        'reset_code', v_reset_code,
        'message', 'Password reset code generated'
    );
    
    RETURN v_result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- FUNCTION 5: RESET PASSWORD
-- ==================================================
CREATE OR REPLACE FUNCTION reset_password(
    p_email TEXT,
    p_reset_code TEXT,
    p_new_password TEXT
) RETURNS JSON AS $$
DECLARE
    v_reset_record RECORD;
    v_password_hash TEXT;
    v_result JSON;
BEGIN
    -- Find valid reset record
    SELECT * INTO v_reset_record
    FROM public.password_resets
    WHERE email = p_email 
    AND reset_code = p_reset_code
    AND expires_at > now()
    AND used_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid or expired reset code'
        );
    END IF;
    
    -- Generate new password hash
    v_password_hash := crypt(p_new_password, gen_salt('bf'));
    
    -- Update user password
    UPDATE public.users 
    SET password_hash = v_password_hash, updated_at = now()
    WHERE id = v_reset_record.user_id;
    
    -- Mark reset code as used
    UPDATE public.password_resets
    SET used_at = now()
    WHERE id = v_reset_record.id;
    
    -- Invalidate all existing sessions for this user
    DELETE FROM public.user_sessions WHERE user_id = v_reset_record.user_id;
    
    -- Return success
    v_result := json_build_object(
        'success', true,
        'message', 'Password reset successfully'
    );
    
    RETURN v_result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- FUNCTION 6: VALIDATE SESSION
-- ==================================================
CREATE OR REPLACE FUNCTION validate_session(
    p_session_token TEXT
) RETURNS JSON AS $$
DECLARE
    v_session_record RECORD;
    v_user_record RECORD;
    v_result JSON;
BEGIN
    -- Find valid session
    SELECT * INTO v_session_record
    FROM public.user_sessions
    WHERE session_token = p_session_token
    AND expires_at > now();
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid or expired session'
        );
    END IF;
    
    -- Get user data
    SELECT * INTO v_user_record
    FROM public.users
    WHERE id = v_session_record.user_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found or inactive'
        );
    END IF;
    
    -- Update session last accessed time
    UPDATE public.user_sessions
    SET last_accessed_at = now()
    WHERE id = v_session_record.id;
    
    -- Return user data
    v_result := json_build_object(
        'success', true,
        'user', json_build_object(
            'id', v_user_record.id,
            'email', v_user_record.email,
            'full_name', v_user_record.full_name,
            'user_role', v_user_record.user_role,
            'tokens', v_user_record.tokens,
            'avatar_url', v_user_record.avatar_url,
            'email_verified', v_user_record.email_verified
        ),
        'session_expires_at', v_session_record.expires_at
    );
    
    RETURN v_result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==================================================
-- FUNCTION 7: INVALIDATE SESSION (LOGOUT)
-- ==================================================
CREATE OR REPLACE FUNCTION invalidate_session(
    p_session_token TEXT
) RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    -- Delete the session
    DELETE FROM public.user_sessions
    WHERE session_token = p_session_token;
    
    -- Return success
    v_result := json_build_object(
        'success', true,
        'message', 'Session invalidated successfully'
    );
    
    RETURN v_result;
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
        'success', false,
        'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;