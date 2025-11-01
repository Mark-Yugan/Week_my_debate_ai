// @ts-nocheck
/**
 * Settings Page Component
 * Allows users to view and update their profile
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { CustomAuthService } from '@/services/customAuthService';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, School, Calendar, Briefcase, ArrowLeft, Settings as SettingsIcon, UserCircle, Mic, Trophy, RotateCcw } from 'lucide-react';
import SpeechTest from '@/components/settings/SpeechTest';
import { Badge } from '@/components/ui/badge';

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).optional().or(z.literal('')),
  email: z.string().email({ message: "Please enter a valid email address." }),
  avatarUrl: z.string().optional(),
  age: z.number().min(1).max(150).optional().or(z.literal('')),
  institution: z.string().optional(),
  userRole: z.enum(['student', 'teacher', 'admin']).optional(),
});

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

const Settings = () => {
  const { user, loading: authLoading, isAuthenticated, refreshAuth } = useCustomAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [showSpeechTest, setShowSpeechTest] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      avatarUrl: '',
      age: undefined,
      institution: '',
      userRole: undefined,
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { returnTo: '/settings' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.full_name || '',
        email: user.email || '',
        avatarUrl: user.avatar_url || '',
        age: user.age || undefined,
        institution: user.institution || '',
        userRole: user.user_role || 'student',
      });
      setSelectedAvatar(user.avatar_url || '👤');
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;

    setLoading(true);
    
    try {
      const response = await CustomAuthService.updateProfile(
        user.id,
        values.fullName || undefined,
        values.avatarUrl || selectedAvatar || undefined,
        values.age || undefined,
        values.institution || undefined,
        values.userRole || undefined
      );

      if (response.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully!",
        });
        
        // Refresh auth to get updated user data
        await refreshAuth();
      } else {
        toast({
          title: "Update Failed",
          description: response.error || "Failed to update profile. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    form.setValue('avatarUrl', avatar);
  };

  const handleSpeechTestComplete = async (level: 'beginner' | 'amateur' | 'expert') => {
    if (!user) return;

    setLoading(true);
    
    try {
      const response = await CustomAuthService.updateProfile(
        user.id,
        undefined, // fullName
        undefined, // avatarUrl
        undefined, // age
        undefined, // institution
        undefined, // userRole
        level // speechLevel
      );

      if (response.success) {
        toast({
          title: "Speech Level Updated",
          description: `Your speech level has been set to ${level.charAt(0).toUpperCase() + level.slice(1)}`,
        });
        
        await refreshAuth();
        setShowSpeechTest(false);
      } else {
        toast({
          title: "Update Failed",
          description: response.error || "Failed to update speech level. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSpeechLevelColor = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'amateur':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'expert':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {showSpeechTest ? (
          <SpeechTest
            onComplete={handleSpeechTestComplete}
            onCancel={() => setShowSpeechTest(false)}
          />
        ) : (
          <>
            <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your profile information and preferences
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
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="text-3xl bg-gray-100">
                        {selectedAvatar || user.avatar_url || '👤'}
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

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email (Read-only) */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          disabled
                          className="bg-gray-50"
                        />
                      </FormControl>
                      <FormDescription>Email cannot be changed</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        Role
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
                    {loading ? 'Updating Profile...' : 'Update Profile'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Speech Skills Test Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Speech Skills Assessment
            </CardTitle>
            <CardDescription>
              Take a test to determine your speech skills level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.speech_level ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-indigo-600" />
                    <div>
                      <p className="text-sm text-gray-600">Your Current Level</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 text-base px-4 py-2 ${getSpeechLevelColor(user.speech_level)}`}
                      >
                        {user.speech_level.charAt(0).toUpperCase() + user.speech_level.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setShowSpeechTest(true)}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Test
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-3">
                    <strong>Take the Speech Skills Test</strong>
                  </p>
                  <p className="text-xs text-blue-700 mb-4">
                    Record a 1-minute video speech on a suggested topic. Our system will analyze your speech 
                    to determine your skill level: Beginner, Amateur, or Expert.
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li>Choose from suggested topics</li>
                    <li>Record a 1-minute video</li>
                    <li>Get instant analysis</li>
                    <li>Update your profile level</li>
                  </ul>
                </div>
                <Button
                  onClick={() => setShowSpeechTest(true)}
                  className="w-full gradient-indigo text-white"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Start Speech Test
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;

