
// @ts-nocheck
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true);
    
    try {
      console.log('Attempting to send password reset email to:', values.email);
      console.log('Redirect URL:', `${window.location.origin}/reset-password`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Error sending reset email",
          description: error.message || "Failed to send password reset email. Please check your email address and try again.",
          variant: "destructive"
        });
      } else {
        console.log('Password reset email sent successfully');
        setEmailSent(true);
        toast({
          title: "Email sent",
          description: "If an account with this email exists, you will receive a password reset link."
        });
      }
    } catch (error) {
      console.error('Password reset exception:', error);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center space-y-4">
        <Mail className="h-12 w-12 mx-auto text-indigo-600" />
        <h3 className="text-lg font-medium">Check your email</h3>
        <p className="text-sm text-gray-600">
          We've sent a password reset link to {form.getValues('email')}
        </p>
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-2">Reset your password</h3>
        <p className="text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

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

          <Button
            type="submit"
            disabled={loading}
            className="w-full gradient-indigo text-white"
          >
            {loading ? 'Sending...' : 'Send reset email'}
          </Button>
        </form>
      </Form>

      <Button
        variant="outline"
        onClick={onBack}
        className="w-full"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to sign in
      </Button>
    </div>
  );
};

export default ForgotPassword;
