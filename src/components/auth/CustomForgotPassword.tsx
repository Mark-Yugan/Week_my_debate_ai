// @ts-nocheck
/**
 * Custom Forgot Password Component
 * Handles password reset with email verification
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { useCustomAuth } from '@/hooks/useCustomAuth';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const verificationSchema = z.object({
  verificationCode: z.string().length(6, { message: "Verification code must be 6 digits." }),
});

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, { message: "Must be at least 8 characters." })
    .regex(/[a-z]/, { message: "Must contain a lowercase letter." })
    .regex(/[A-Z]/, { message: "Must contain an uppercase letter." })
    .regex(/[0-9]/, { message: "Must contain a number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Must contain a special character." }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface CustomForgotPasswordProps {
  onBackToLogin: () => void;
  onResetSuccess: () => void;
}

const CustomForgotPassword = ({ onBackToLogin, onResetSuccess }: CustomForgotPasswordProps) => {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { requestPasswordReset, resetPassword } = useCustomAuth();

  const emailForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { verificationCode: "" },
  });

  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onEmailSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true);
    
    try {
      const response = await requestPasswordReset(values.email);
      
      if (response.success) {
        setResetEmail(values.email);
        setStep('verify');
        toast({
          title: "Reset Code Sent",
          description: "Please check your email for the verification code."
        });
      } else {
        toast({
          title: "Request Failed",
          description: response.error || "Failed to send reset code. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifySubmit = async (values: z.infer<typeof verificationSchema>) => {
    setVerificationCode(values.verificationCode);
    setStep('reset');
  };

  const onResetSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setLoading(true);
    
    try {
      const response = await resetPassword(resetEmail, verificationCode, values.newPassword);
      
      if (response.success) {
        toast({
          title: "Password Reset Successful",
          description: "Your password has been reset successfully. Please log in with your new password."
        });
        onResetSuccess();
      } else {
        toast({
          title: "Reset Failed",
          description: response.error || "Failed to reset password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />
            Enter Verification Code
          </CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to <strong>{resetEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...verificationForm}>
            <form onSubmit={verificationForm.handleSubmit(onVerifySubmit)} className="space-y-4">
              <FormField
                control={verificationForm.control}
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit code"
                        {...field}
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                      />
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
                Continue
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('email')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  if (step === 'reset') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              <FormField
                control={resetForm.control}
                name="newPassword"
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
                control={resetForm.control}
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('verify')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Mail className="h-5 w-5" />
          Reset Password
        </CardTitle>
        <CardDescription>
          Enter your email address to receive a verification code
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email"
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
              {loading ? 'Sending...' : 'Send Reset Code'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onBackToLogin}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomForgotPassword;