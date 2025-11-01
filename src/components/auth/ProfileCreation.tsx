// @ts-nocheck
/**
 * Profile Creation Component
 * Allows users to optionally set up their profile after email verification
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, School, Calendar, Briefcase, UserCircle, Skip } from 'lucide-react';

const profileSchema = z.object({
  avatarUrl: z.string().optional(),
  age: z.number().min(1).max(150).optional().or(z.literal('')),
  institution: z.string().optional(),
  userRole: z.enum(['student', 'teacher', 'admin']).optional(),
});

interface ProfileCreationProps {
  email: string;
  onComplete: (profileData: {
    avatarUrl?: string;
    age?: number;
    institution?: string;
    userRole?: 'student' | 'teacher' | 'admin';
  }) => void;
  onSkip: () => void;
}

const AVATAR_OPTIONS = [
  { emoji: '👤', value: '👤', label: 'Default' },
  { emoji: '👨', value: '👨', label: 'Male' },
  { emoji: '👩', value: '👩', label: 'Female' },
  { emoji: '🧑', value: '🧑', label: 'Person' },
  { emoji: '🧒', value: '🧒', label: 'Child' },
  { emoji: '👨‍🎓', value: '👨‍🎓', label: 'Student' },
  { emoji: '👩‍🏫', value: '👩‍🏫', label: 'Teacher' },
  { emoji: '🎓', value: '🎓', label: 'Graduate' },
  { emoji: '💼', value: '💼', label: 'Professional' },
  { emoji: '🤖', value: '🤖', label: 'Robot' },
  { emoji: '🦸', value: '🦸', label: 'Hero' },
  { emoji: '🧙', value: '🧙', label: 'Wizard' },
];

const ProfileCreation = ({ email, onComplete, onSkip }: ProfileCreationProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatarUrl: '',
      age: undefined,
      institution: '',
      userRole: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setLoading(true);
    
    try {
      const profileData = {
        avatarUrl: values.avatarUrl || selectedAvatar || undefined,
        age: values.age || undefined,
        institution: values.institution || undefined,
        userRole: values.userRole || undefined,
      };
      
      toast({
        title: "Profile Created",
        description: "Your profile has been set up successfully!",
      });
      
      onComplete(profileData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. You can update it later in settings.",
        variant: "destructive"
      });
      // Still continue even if profile creation fails
      onComplete({});
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    form.setValue('avatarUrl', avatar);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <UserCircle className="h-5 w-5" />
          Create Your Profile
        </CardTitle>
        <CardDescription>
          Set up your profile (all fields are optional - you can update them later)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium leading-none">Avatar</label>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-gray-300">
                  <AvatarFallback className="text-3xl bg-gray-100">
                    {selectedAvatar || '👤'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <button
                        key={avatar.value}
                        type="button"
                        onClick={() => handleAvatarSelect(avatar.value)}
                        className={`
                          w-10 h-10 rounded-full border-2 transition-all
                          flex items-center justify-center text-xl
                          hover:scale-110 hover:border-indigo-500
                          ${selectedAvatar === avatar.value 
                            ? 'border-indigo-600 bg-indigo-50 scale-110' 
                            : 'border-gray-300 bg-white'
                          }
                        `}
                        title={avatar.label}
                      >
                        {avatar.emoji}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Click to select an avatar</p>
                </div>
              </div>
            </div>

            {/* Age */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Age (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      min={1}
                      max={150}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : parseInt(value, 10));
                      }}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>Your age helps us personalize your experience</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Institution */}
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Institution (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your school, university, or organization"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Your school, university, or organization name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="userRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Role (Optional)
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select your primary role on the platform</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 gradient-indigo text-white"
              >
                {loading ? 'Creating Profile...' : 'Complete Profile'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onSkip}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Skip className="h-4 w-4" />
                Skip for Now
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileCreation;

