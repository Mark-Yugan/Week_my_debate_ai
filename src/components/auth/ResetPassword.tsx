// @ts-nocheck
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const resetPasswordSchema = z.object({
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

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    // Check if this is a valid password reset session
    const checkResetSession = async () => {
      try {
        console.log('Checking for password reset session...');
        console.log('Current URL:', window.location.href);
        console.log('Hash:', window.location.hash);
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
        if (session && session.user) {
          console.log('Found existing session, setting as valid');
          setIsValidSession(true);
        } else {
          // Check URL hash for access_token and type=recovery
          const hash = window.location.hash.substring(1);
          console.log('Parsing hash:', hash);
          
          const urlParams = new URLSearchParams(hash);
          const accessToken = urlParams.get('access_token');
          const refreshToken = urlParams.get('refresh_token');
          const type = urlParams.get('type');
          
          console.log('Hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
          
          if (accessToken && type === 'recovery') {
            console.log('Found recovery tokens, setting session...');
            // Set the session using the access token
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || ''
            });
            
            console.log('Set session result:', { data: !!data.session, error });
            
            if (!error && data.session) {
              setIsValidSession(true);
              console.log('Session set successfully');
            } else {
              console.error('Failed to set session:', error);
              toast({
                title: "Invalid Reset Link",
                description: "The password reset link is invalid or has expired.",
                variant: "destructive"
              });
              navigate('/');
            }
          } else {
            console.log('No valid recovery parameters found');
            toast({
              title: "Invalid Reset Link",
              description: "No valid password reset session found. Please request a new password reset.",
              variant: "destructive"
            });
            navigate('/');
          }
        }
      } catch (error) {
        console.error('Error checking reset session:', error);
        toast({
          title: "Error",
          description: "An error occurred while validating the reset link.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setSessionLoading(false);
      }
    };

    checkResetSession();
  }, [toast, navigate]);

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Password Updated",
          description: "Your password has been successfully updated"
        });
        
        // Redirect to dashboard after successful password update
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Invalid or expired reset link</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Updated!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated. You will be redirected to the dashboard shortly.
          </p>
          <Button onClick={() => navigate('/')} className="w-full gradient-indigo text-white">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <Lock className="h-12 w-12 mx-auto text-indigo-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your new password below
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Confirm new password"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-indigo text-white"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;