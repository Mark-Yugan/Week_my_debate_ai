
// @ts-nocheck
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';
// REMOVED: useEmailValidation import

interface AuthFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  isLogin: boolean;
  loading: boolean;
  onForgotPassword?: () => void;
}

const AuthForm = ({ form, onSubmit, isLogin, loading, onForgotPassword }: AuthFormProps) => {
  // REMOVED: useEmailValidation and related logic
  // REMOVED: getEmailValidationIcon and getEmailValidationMessage

  return (
    <Form {...form}>
      <form key={isLogin ? 'login' : 'signup'} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-50">Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="input-neon pl-10"
                  />
                  {/* REMOVED: Email check indicator */}
                </div>
              </FormControl>
              <FormMessage />
              {/* REMOVED: Email validation message */}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-50">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    className="input-neon pl-10"
                  />
                </div>
              </FormControl>
              {!isLogin && (
                <FormDescription className="text-xs text-gray-400">
                  Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, a number, and a special character.
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {!isLogin && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-50">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                      className="input-neon pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isLogin && onForgotPassword && (
          <div className="text-right">
            <Button
              type="button"
              variant="link"
              onClick={onForgotPassword}
              className="text-sm p-0 h-auto text-cyan-400 hover:text-cyan-300"
            >
              Forgot your password?
            </Button>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full btn-neon-primary"
        >
          {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};

export default AuthForm;
