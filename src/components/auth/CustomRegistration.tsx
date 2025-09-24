// @ts-nocheck
/**
 * Custom Registration Component
 * Handles user registration with email verification
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useCustomAuth } from '@/hooks/useCustomAuth';

const registrationSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
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

const verificationSchema = z.object({
  verificationCode: z.string().length(6, { message: "Verification code must be 6 digits." }),
});

interface CustomRegistrationProps {
  onSwitchToLogin: () => void;
  onRegistrationSuccess: () => void;
}

const CustomRegistration = ({ onSwitchToLogin, onRegistrationSuccess }: CustomRegistrationProps) => {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, verifyEmail } = useCustomAuth();

  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { verificationCode: "" },
  });

  // Clear verification form when switching to verification step
  useEffect(() => {
    if (step === 'verify') {
      setVerificationCode('');
      verificationForm.reset({ verificationCode: "" });
      verificationForm.clearErrors();
    }
  }, [step, verificationForm]);

  const onRegisterSubmit = async (values: z.infer<typeof registrationSchema>) => {
    setLoading(true);
    
    try {
      const response = await register(values.email, values.password, values.fullName);
      
      if (response.success) {
        setRegistrationEmail(values.email);
        // Clear the verification form before switching
        verificationForm.reset({ verificationCode: "" });
        setStep('verify');
        toast({
          title: "Registration Successful",
          description: "Please check your email for the verification code."
        });
      } else {
        toast({
          title: "Registration Failed",
          description: response.error || "Failed to register. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Submitting verification code:', verificationCode);
    
    try {
      const response = await verifyEmail(registrationEmail, verificationCode);
      
      if (response.success) {
        toast({
          title: "Email Verified",
          description: "Your account has been verified successfully!"
        });
        onRegistrationSuccess();
      } else {
        toast({
          title: "Verification Failed",
          description: response.error || "Invalid verification code. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    console.log('Verification step - registrationEmail:', registrationEmail);
    console.log('Verification form values:', verificationForm.getValues());
    
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to <strong>{registrationEmail}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onVerifySubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Verification Code
              </label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => {
                  console.log('Direct input onChange:', e.target.value);
                  // Only allow numeric input and limit to 6 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  console.log('Setting verification code to:', value);
                  setVerificationCode(value);
                }}
                className="text-center text-lg tracking-widest"
                maxLength={6}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>

            <Button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full gradient-indigo text-white"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('register')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Registration
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Sign up for DebateWorld AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...registrationForm}>
          <form onSubmit={registrationForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
            <FormField
              control={registrationForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
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
              control={registrationForm.control}
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

            <FormField
              control={registrationForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Create password"
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
              control={registrationForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Confirm password"
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onSwitchToLogin}
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

export default CustomRegistration;