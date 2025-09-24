// @ts-nocheck
/**
 * Custom Authentication Service
 * Handles all authentication operations using custom database functions
 */

import { supabase } from '@/integrations/supabase/client';
import { EmailService } from './emailService';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  user_role: 'student' | 'teacher' | 'admin';
  tokens: number;
  email_verified: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session_token?: string;
  expires_at?: string;
  message?: string;
  error?: string;
  verification_code?: string;
}

export interface SessionData {
  user: User;
  session_token: string;
  expires_at: string;
}

export class CustomAuthService {
  private static readonly SESSION_KEY = 'debateworld_session';

  /**
   * Register a new user
   */
  static async register(
    email: string, 
    password: string, 
    fullName?: string
  ): Promise<AuthResponse> {
    try {
      console.log('Registering user:', email);

      // Call the database function to register user
      const { data, error } = await supabase.rpc('register_user', {
        p_email: email,
        p_password: password,
        p_full_name: fullName || null
      });

      if (error) {
        console.error('Registration error:', error);
        return {
          success: false,
          error: error.message || 'Registration failed'
        };
      }

      const result = data as any;
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Registration failed'
        };
      }

      // Send verification email
      try {
        await EmailService.sendRegistrationVerification(
          email,
          fullName || '',
          result.verification_code
        );
        console.log('Verification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }

      return {
        success: true,
        message: result.message,
        verification_code: result.verification_code // For testing purposes
      };

    } catch (error) {
      console.error('Registration exception:', error);
      return {
        success: false,
        error: error.message || 'Registration failed'
      };
    }
  }

  /**
   * Verify email with verification code
   */
  static async verifyEmail(
    email: string, 
    verificationCode: string
  ): Promise<AuthResponse> {
    try {
      console.log('Verifying email:', email);

      const { data, error } = await supabase.rpc('verify_email', {
        p_email: email,
        p_verification_code: verificationCode
      });

      if (error) {
        console.error('Email verification error:', error);
        return {
          success: false,
          error: error.message || 'Email verification failed'
        };
      }

      const result = data as any;
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Email verification failed'
        };
      }

      // Send welcome email
      try {
        await EmailService.sendWelcomeEmail(email, '');
        console.log('Welcome email sent successfully');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail verification if welcome email fails
      }

      return {
        success: true,
        message: result.message
      };

    } catch (error) {
      console.error('Email verification exception:', error);
      return {
        success: false,
        error: error.message || 'Email verification failed'
      };
    }
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('Logging in user:', email);

      const { data, error } = await supabase.rpc('login_user', {
        p_email: email,
        p_password: password
      });

      if (error) {
        console.error('Login error:', error);
        return {
          success: false,
          error: error.message || 'Login failed'
        };
      }

      const result = data as any;
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Login failed'
        };
      }

      // Store session data
      const sessionData: SessionData = {
        user: result.user,
        session_token: result.session_token,
        expires_at: result.expires_at
      };

      this.setSessionData(sessionData);

      return {
        success: true,
        user: result.user,
        session_token: result.session_token,
        expires_at: result.expires_at
      };

    } catch (error) {
      console.error('Login exception:', error);
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      console.log('Requesting password reset for:', email);

      const { data, error } = await supabase.rpc('request_password_reset', {
        p_email: email
      });

      if (error) {
        console.error('Password reset request error:', error);
        return {
          success: false,
          error: error.message || 'Password reset request failed'
        };
      }

      const result = data as any;
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Password reset request failed'
        };
      }

      // Send password reset email
      try {
        await EmailService.sendPasswordResetVerification(
          email,
          '',
          result.verification_code
        );
        console.log('Password reset email sent successfully');
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Don't fail the request if email fails
      }

      return {
        success: true,
        message: result.message,
        verification_code: result.verification_code // For testing purposes
      };

    } catch (error) {
      console.error('Password reset request exception:', error);
      return {
        success: false,
        error: error.message || 'Password reset request failed'
      };
    }
  }

  /**
   * Reset password with verification code
   */
  static async resetPassword(
    email: string, 
    verificationCode: string, 
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      console.log('Resetting password for:', email);

      const { data, error } = await supabase.rpc('reset_password', {
        p_email: email,
        p_verification_code: verificationCode,
        p_new_password: newPassword
      });

      if (error) {
        console.error('Password reset error:', error);
        return {
          success: false,
          error: error.message || 'Password reset failed'
        };
      }

      const result = data as any;
      
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Password reset failed'
        };
      }

      return {
        success: true,
        message: result.message
      };

    } catch (error) {
      console.error('Password reset exception:', error);
      return {
        success: false,
        error: error.message || 'Password reset failed'
      };
    }
  }

  /**
   * Validate current session
   */
  static async validateSession(): Promise<AuthResponse> {
    try {
      const sessionData = this.getSessionData();
      
      if (!sessionData) {
        return {
          success: false,
          error: 'No session found'
        };
      }

      // Check if session is expired
      if (new Date(sessionData.expires_at) < new Date()) {
        this.clearSession();
        return {
          success: false,
          error: 'Session expired'
        };
      }

      const { data, error } = await supabase.rpc('validate_session', {
        p_session_token: sessionData.session_token
      });

      if (error) {
        console.error('Session validation error:', error);
        this.clearSession();
        return {
          success: false,
          error: error.message || 'Session validation failed'
        };
      }

      const result = data as any;
      
      if (!result.success) {
        this.clearSession();
        return {
          success: false,
          error: result.error || 'Session validation failed'
        };
      }

      return {
        success: true,
        user: result.user
      };

    } catch (error) {
      console.error('Session validation exception:', error);
      this.clearSession();
      return {
        success: false,
        error: error.message || 'Session validation failed'
      };
    }
  }

  /**
   * Logout user
   */
  static async logout(): Promise<AuthResponse> {
    try {
      const sessionData = this.getSessionData();
      
      if (sessionData) {
        const { error } = await supabase.rpc('logout_user', {
          p_session_token: sessionData.session_token
        });

        if (error) {
          console.error('Logout error:', error);
        }
      }

      this.clearSession();

      return {
        success: true,
        message: 'Logged out successfully'
      };

    } catch (error) {
      console.error('Logout exception:', error);
      this.clearSession();
      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  }

  /**
   * Get current user from session
   */
  static getCurrentUser(): User | null {
    const sessionData = this.getSessionData();
    return sessionData?.user || null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const sessionData = this.getSessionData();
    
    if (!sessionData) {
      return false;
    }

    // Check if session is expired
    if (new Date(sessionData.expires_at) < new Date()) {
      this.clearSession();
      return false;
    }

    return true;
  }

  /**
   * Store session data
   */
  private static setSessionData(sessionData: SessionData): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to store session data:', error);
    }
  }

  /**
   * Get session data
   */
  private static getSessionData(): SessionData | null {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get session data:', error);
      return null;
    }
  }

  /**
   * Clear session data
   */
  private static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session data:', error);
    }
  }
}