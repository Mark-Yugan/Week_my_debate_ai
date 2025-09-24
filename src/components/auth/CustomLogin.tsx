// @ts-nocheck
/**
 * Custom Login Component
 * Handles user login with custom authentication
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
import { Mail, Lock } from 'lucide-react';
import { useCustomAuth } from '@/hooks/useCustomAuth';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

interface CustomLoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

const CustomLogin = ({ onLoginSuccess, onSwitchToRegister, onSwitchToForgotPassword }: CustomLoginProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useCustomAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    
    try {
      const response = await login(values.email, values.password);
      
      if (response.success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to DebateWorld AI!"
        });
        onLoginSuccess();
      } else {
        toast({
          title: "Login Failed",
          description: response.error || "Invalid email or password.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your DebateWorld AI account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right">
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  console.log('CustomLogin: Forgot password button clicked');
                  onSwitchToForgotPassword();
                }}
                className="p-0 text-sm"
              >
                Forgot your password?
              </Button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-indigo text-white"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  console.log('CustomLogin: Sign up button clicked');
                  onSwitchToRegister();
                }}
                className="p-0 text-sm"
              >
                Sign up
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CustomLogin;