// @ts-nocheck
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import {
  Users, ArrowLeft, Target, Trophy, Plus, Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
}

interface DatabaseTopic {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  theme: string | null;
  time_estimate: string | null;
  status: string;
  created_at: string;
  created_by: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  updated_at: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  time_estimate: string;
  status: 'approved' | 'pending' | 'rejected';
}

interface LiveDebateRoomProps {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  theme: string;
  onBack: () => void;
  onStartDebate: (topic: Topic, opponent: OnlineUser) => void;
}

interface SuggestTopicFormValues {
  title: string;
  description?: string;
  timeEstimate: string;
}

const LiveDebateRoom = ({
  difficulty,
  theme,
  onBack,
  onStartDebate,
}: LiveDebateRoomProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<OnlineUser | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const { toast } = useToast();

  const fetchTopics = useCallback(async () => {
    setLoadingTopics(true);
    try {
      const { data, error } = await supabase
        .from('debate_topics')
        .select('*')
        .eq('status', 'approved')
        .eq('difficulty', difficulty)
        .eq('theme', theme)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformed: Topic[] = (data || []).map((dbTopic: DatabaseTopic) => ({
        id: dbTopic.id,
        title: dbTopic.title,
        description: dbTopic.description || '',
        difficulty: ['Easy', 'Medium', 'Hard'].includes(dbTopic.difficulty)
          ? (dbTopic.difficulty as 'Easy' | 'Medium' | 'Hard')
          : 'Medium',
        theme: dbTopic.theme || theme,
        time_estimate: dbTopic.time_estimate || '15 min',
        status: dbTopic.status as Topic['status'],
      }));

      setTopics(transformed);
    } catch (err) {
      console.error('Error fetching topics:', err);
    } finally {
      setLoadingTopics(false);
    }
  }, [difficulty, theme]);

  const fetchOnlineUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('online_status')
      .select('user_id, status, profiles (full_name)')
      .eq('status', 'available');

    if (error) return console.error('Error fetching users:', error);

    const users: OnlineUser[] = (data || []).map((entry) => ({
      id: entry.user_id,
      name: entry.profiles?.full_name || 'Unknown',
      status: 'available',
      level: 'Beginner',
      tokens: 0,
      country: 'India',
    }));

    setOnlineUsers(users);
  }, []);

  const handleStartMatchmaking = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('matchmaking_queue').upsert({
      user_id: user.id,
      difficulty,
      theme,
      status: 'searching',
    });

    const { data: opponents } = await supabase
      .from('matchmaking_queue')
      .select('user_id')
      .eq('difficulty', difficulty)
      .eq('theme', theme)
      .eq('status', 'searching')
      .neq('user_id', user.id)
      .limit(1);

    if (opponents?.length) {
      const matchedUserId = opponents[0].user_id;

      await supabase
        .from('matchmaking_queue')
        .update({ status: 'matched' })
        .in('user_id', [user.id, matchedUserId]);

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', matchedUserId)
        .single();

      if (profile) {
        const opponent: OnlineUser = {
          id: matchedUserId,
          name: profile.full_name,
          level: 'Intermediate',
          tokens: 0,
          country: 'India',
          status: 'available',
        };
        setSelectedOpponent(opponent);
        toast({ title: 'Match Found!', description: `You're paired with ${profile.full_name}` });
      }
    } else {
      toast({ title: 'Searching...', description: 'Waiting for an opponent to join...' });
    }
  };

  const suggestForm = useForm<SuggestTopicFormValues>({
    defaultValues: { title: '', description: '', timeEstimate: '' },
  });

  const onSuggestTopic = async (values: SuggestTopicFormValues) => {
    const { data: { user } } = await supabase.auth.getUser();
    try {
      const { error } = await supabase.from('debate_topics').insert({
        title: values.title.trim(),
        description: values.description?.trim() || null,
        time_estimate: values.timeEstimate.trim(),
        difficulty,
        theme,
        created_by: user?.id || null,
        status: 'pending',
      });

      if (error) throw error;

      toast({ title: 'Topic Suggested', description: 'Your topic was submitted for approval.' });
      suggestForm.reset();
    } catch (err) {
      console.error('Error suggesting topic:', err);
      toast({ title: 'Error', description: 'Failed to suggest topic.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchOnlineUsers();

    const subscription = supabase
      .channel('online_status_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'online_status',
      }, fetchOnlineUsers)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchTopics, fetchOnlineUsers]);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-3">Live Debate Arena</h1>
            <p className="text-gray-300 text-lg font-inter">Select your battlefield and opponent for combat</p>
          </div>
          <Button 
            onClick={onBack}
            className="btn-neon-secondary flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Challenge
          </Button>
        </div>

        {/* Suggest a Topic Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-neon-primary mb-6">
              <Plus className="w-4 h-4 mr-2" />
              Suggest a Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-50 font-orbitron text-xl">Suggest a Topic</DialogTitle>
            </DialogHeader>
            <Form {...suggestForm}>
              <form onSubmit={suggestForm.handleSubmit(onSuggestTopic)} className="space-y-4">
                <FormField
                  control={suggestForm.control}
                  name="title"
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-inter">Topic Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-800 border-gray-600 text-gray-50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={suggestForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-inter">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="bg-gray-800 border-gray-600 text-gray-50" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={suggestForm.control}
                  name="timeEstimate"
                  rules={{ required: 'Estimated time is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-inter">Time Estimate</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-800 border-gray-600 text-gray-50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="btn-neon-primary w-full">Submit Suggestion</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Topic Selection */}
        <div className="card-neon">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="h-8 w-8 text-cyan-400" />
              <h2 className="text-2xl font-bold text-gray-50 font-orbitron">Battle Topics</h2>
              <div className="badge-neon bg-cyan-400/20 text-cyan-300 border-cyan-400/30">
                {loadingTopics ? 'Loading...' : `${topics.length} topics`}
              </div>
            </div>
            
            {loadingTopics ? (
              <div className="text-center py-8">
                <div className="animate-pulse text-gray-400 font-inter">Fetching combat scenarios...</div>
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`group p-6 border rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                      selectedTopic?.id === topic.id
                        ? 'border-cyan-400/50 bg-cyan-400/5 shadow-neon'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                    }`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-50 font-orbitron text-lg group-hover:text-cyan-300 transition-colors">
                        {topic.title}
                      </h4>
                      <div className="badge-neon bg-gray-700/50 text-gray-300 border-gray-600">
                        {topic.time_estimate}
                      </div>
                    </div>
                    <p className="text-gray-300 font-inter mb-3">{topic.description}</p>
                    <div className={`badge-neon ${
                      topic.difficulty === 'Easy' ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' :
                      topic.difficulty === 'Medium' ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' :
                      'bg-red-400/20 text-red-300 border-red-400/30'
                    }`}>
                      {topic.difficulty}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Opponent Selection */}
        <div className="card-neon">
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="h-8 w-8 text-fuchsia-400" />
              <h2 className="text-2xl font-bold text-gray-50 font-orbitron">Combat Opponents</h2>
              <div className="badge-neon bg-emerald-400/20 text-emerald-300 border-emerald-400/30">
                {onlineUsers.length} warriors online
              </div>
            </div>
            
            <div className="space-y-4">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className={`group p-6 border rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    selectedOpponent?.id === user.id
                      ? 'border-fuchsia-400/50 bg-fuchsia-400/5 shadow-neon'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                  }`}
                  onClick={() => setSelectedOpponent(user)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-50 font-orbitron text-lg group-hover:text-fuchsia-300 transition-colors">
                        {user.name}
                      </h4>
                      <p className="text-gray-300 font-inter">{user.country}</p>
                    </div>
                    <div className={`badge-neon ${
                      user.level === 'Beginner' ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' :
                      user.level === 'Intermediate' ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' :
                      'bg-red-400/20 text-red-300 border-red-400/30'
                    }`}>
                      {user.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-neon">
          <div className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-amber-400" />
              <h3 className="text-2xl font-bold text-gray-50 font-orbitron">Enter the Arena</h3>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <Button
                className="btn-neon-primary text-lg py-4 px-8 font-orbitron"
                size="lg"
                disabled={!selectedTopic || !selectedOpponent}
                onClick={() =>
                  selectedTopic &&
                  selectedOpponent &&
                  onStartDebate(selectedTopic, selectedOpponent)
                }
              >
                <Trophy className="w-5 h-5 mr-2" />
                Begin Combat
              </Button>
              
              <Button 
                className="btn-neon-secondary text-lg py-4 px-8 font-orbitron" 
                onClick={handleStartMatchmaking}
              >
                <Zap className="w-5 h-5 mr-2" />
                Auto Matchmaking
              </Button>
            </div>
            
            {(!selectedTopic || !selectedOpponent) && (
              <p className="text-gray-400 font-inter">
                {!selectedTopic && !selectedOpponent ? 'Select a topic and opponent to begin' :
                 !selectedTopic ? 'Select a battle topic' : 'Choose your opponent'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDebateRoom;
