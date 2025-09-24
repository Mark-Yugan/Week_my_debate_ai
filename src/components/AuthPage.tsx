
// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthCard from './auth/AuthCard';
import GoogleSignInButton from './auth/GoogleSignInButton';
import OrSeparator from './auth/OrSeparator';
import AuthForm from './auth/AuthForm';
import AuthToggle from './auth/AuthToggle';
import ForgotPassword from './auth/ForgotPassword';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(8, { message: "Must be at least 8 characters." })
    .regex(/[a-z]/, { message: "Must contain a lowercase letter." })
    .regex(/[A-Z]/, { message: "Must contain an uppercase letter." })
    .regex(/[0-9]/, { message: "Must contain a number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Must contain a special character." }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const form = isLogin ? loginForm : signupForm;

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        onAuthSuccess();
      }
    };
    checkAuth();

    // Listen for OAuth redirect callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          onAuthSuccess();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const onSubmit = async (values: z.infer<typeof loginSchema> | z.infer<typeof signupSchema>) => {
    setLoading(true);
    const { email, password } = values;

    try {
      const redirectUrl = `${window.location.origin}/`;

      if (isLogin) {
        console.log('Attempting login for:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        console.log('Login result:', { data: !!data.session, error });

        if (error) {
          console.error('Login error:', error);
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          console.log('Login successful');
          onAuthSuccess();
        }
      } else {
        console.log('Attempting user registration for:', email);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        console.log('Registration result:', { data: !!data.user, error });

        if (error) {
          console.error('Registration error:', error);
          toast({
            title: "Registration Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          console.log('Registration successful');
          toast({
            title: "Success",
            description: "Check your email for verification link"
          });
          form.reset();
        }
      }
    } catch (error) {
      console.error('Authentication exception:', error);
      toast({
        title: "Error",
        description: "Authentication failed. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Google Login Failed",
          description: error.message,
          variant: "destructive"
        });
        setGoogleLoading(false);
      }
      // Don't set loading to false here as the page will redirect
    } catch (error) {
      toast({
        title: "Google Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setGoogleLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(prev => !prev);
    setShowForgotPassword(false);
    loginForm.reset();
    signupForm.reset();
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <AuthCard
        title="Welcome to mydebate.ai"
        description={
          showForgotPassword 
            ? 'Reset your password' 
            : isLogin 
              ? 'Sign in to your account' 
              : 'Create your account'
        }
      >
        {showForgotPassword ? (
          <ForgotPassword onBack={handleBackToLogin} />
        ) : (
          <>
            <GoogleSignInButton onClick={handleGoogleLogin} isLoading={googleLoading} />
            <OrSeparator />
            <AuthForm
              form={form}
              onSubmit={onSubmit}
              isLogin={isLogin}
              loading={loading}
              onForgotPassword={handleForgotPassword}
            />
            <AuthToggle isLogin={isLogin} onClick={toggleAuthMode} />
          </>
        )}
      </AuthCard>
    </div>
  );
};

export default AuthPage;
