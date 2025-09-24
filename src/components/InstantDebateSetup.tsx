import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Zap, 
  Brain, 
  Target, 
  MessageSquare, 
  Clock,
  TrendingUp,
  Star,
  Eye,
  Crown,
  Sparkles,
  CheckCircle,
  Users,
  Trophy,
  ArrowRight,
  Lightbulb,
  Settings,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TOPIC_CATEGORIES, DEFAULT_TOPICS, type DebateConfig } from '@/types/debate';

interface InstantDebateSetupProps {
  onStartDebate: (config: DebateConfig) => void;
  onBack: () => void;
}

const InstantDebateSetup = ({ onStartDebate, onBack }: InstantDebateSetupProps) => {
  const { toast } = useToast();
  
  // Debate configuration
  const [topic, setTopic] = useState('');
  const [userPosition, setUserPosition] = useState<'for' | 'against'>('for');
  const [firstSpeaker, setFirstSpeaker] = useState<'user' | 'ai'>('user');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [customTopic, setCustomTopic] = useState('');
  
  // UI state
  const [showCustomTopic, setShowCustomTopic] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleStartDebate = () => {
    const finalTopic = showCustomTopic ? customTopic.trim() : topic.trim();
    
    if (!finalTopic) {
      toast({
        title: 'Topic Required',
        description: 'Please enter or select a debate topic',
        variant: 'destructive',
      });
      return;
    }

    const config: DebateConfig = {
      topic: finalTopic,
      userPosition,
      firstSpeaker,
      difficulty: selectedDifficulty,
      category: selectedCategory || undefined,
      theme: selectedCategory || 'general'
    };
    
    console.log('Starting instant debate with config:', config);
    onStartDebate(config);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCustomTopic(false);
    
    // Set a default topic from the category
    const categoryTopics = DEFAULT_TOPICS[category];
    if (categoryTopics && categoryTopics.length > 0) {
      setTopic(categoryTopics[0]);
    }
  };

  const handleCustomTopicToggle = () => {
    setShowCustomTopic(!showCustomTopic);
    if (!showCustomTopic) {
      setTopic('');
      setSelectedCategory('');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'hard': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPositionColor = (position: string) => {
    return position === 'for' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      : 'bg-rose-100 text-rose-800 border-rose-200';
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🎯';
      case 'medium': return '⚡';
      case 'hard': return '🔥';
      default: return '⭐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Modern Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Title and Branding */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={onBack} className="flex items-center space-x-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    Debate with Chanakya AI
                    <Sparkles className="h-5 w-5 text-purple-500 ml-2" />
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ancient wisdom meets modern debate • Choose your battle wisely
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Quick Stats */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Brain className="h-4 w-4 text-purple-500" />
                <span>AI Powered</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Instant Start</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column - Topic Selection */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Choose Your Battlefield</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select a category or create your own debate topic
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Category Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <span>Topic Category</span>
                  </Label>
                  <Select value={selectedCategory} onValueChange={handleCategorySelect}>
                    <SelectTrigger className="h-12 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                      <SelectValue placeholder="Browse debate categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {TOPIC_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="py-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-base">{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Topic Selection */}
                {selectedCategory && !showCustomTopic && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Select Debate Topic</Label>
                    <Select value={topic} onValueChange={setTopic}>
                      <SelectTrigger className="h-12 bg-white dark:bg-gray-700">
                        <SelectValue placeholder="Choose your debate topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEFAULT_TOPICS[selectedCategory]?.map((topicText, index) => (
                          <SelectItem key={index} value={topicText} className="py-3">
                            {topicText}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Custom Topic Toggle */}
                <div className="flex items-center justify-center">
                  <Button
                    variant={showCustomTopic ? "default" : "outline"}
                    onClick={handleCustomTopicToggle}
                    className="flex items-center space-x-2"
                  >
                    <Brain className="h-4 w-4" />
                    <span>{showCustomTopic ? 'Use Preset Topics' : 'Create Custom Topic'}</span>
                  </Button>
                </div>

                {/* Custom Topic Input */}
                {showCustomTopic && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span>Your Custom Debate Topic</span>
                    </Label>
                    <Textarea
                      placeholder="Enter your debate topic or scenario here... \n\nExample: 'Should artificial intelligence replace human teachers in schools?' or 'A company must choose between profits and environmental protection.'"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      className="min-h-[120px] bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 resize-none"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {customTopic.length}/500 characters
                    </div>
                  </div>
                )}

                {/* Selected Topic Preview */}
                {(topic || customTopic) && (
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                          Selected Topic:
                        </h4>
                        <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                          {showCustomTopic ? customTopic : topic}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Debate Settings */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Battle Configuration</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure your debate preferences and strategy
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Position */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <span>Your Position</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={userPosition === 'for' ? 'default' : 'outline'}
                      onClick={() => setUserPosition('for')}
                      className={`h-14 flex flex-col items-center justify-center space-y-1 ${
                        userPosition === 'for' 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                          : 'hover:bg-emerald-50 hover:border-emerald-300'
                      }`}
                    >
                      <span className="text-2xl">✅</span>
                      <span className="text-sm font-medium">SUPPORTING</span>
                    </Button>
                    <Button
                      variant={userPosition === 'against' ? 'default' : 'outline'}
                      onClick={() => setUserPosition('against')}
                      className={`h-14 flex flex-col items-center justify-center space-y-1 ${
                        userPosition === 'against' 
                          ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                          : 'hover:bg-rose-50 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-2xl">❌</span>
                      <span className="text-sm font-medium">OPPOSING</span>
                    </Button>
                  </div>
                </div>

                {/* First Speaker */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Opening Speaker</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={firstSpeaker === 'user' ? 'default' : 'outline'}
                      onClick={() => setFirstSpeaker('user')}
                      className={`h-14 flex flex-col items-center justify-center space-y-1 ${
                        firstSpeaker === 'user' 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                          : 'hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <span className="text-2xl">👤</span>
                      <span className="text-sm font-medium">YOU START</span>
                    </Button>
                    <Button
                      variant={firstSpeaker === 'ai' ? 'default' : 'outline'}
                      onClick={() => setFirstSpeaker('ai')}
                      className={`h-14 flex flex-col items-center justify-center space-y-1 ${
                        firstSpeaker === 'ai' 
                          ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                          : 'hover:bg-purple-50 hover:border-purple-300'
                      }`}
                    >
                      <span className="text-2xl">🤖</span>
                      <span className="text-sm font-medium">AI STARTS</span>
                    </Button>
                  </div>
                </div>

                {/* Difficulty Level */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span>Chanakya AI Challenge Level</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                      <Button
                        key={difficulty}
                        variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`h-16 flex flex-col items-center justify-center space-y-1 ${
                          selectedDifficulty === difficulty
                            ? difficulty === 'easy' 
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              : difficulty === 'medium'
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-rose-500 hover:bg-rose-600 text-white'
                            : `hover:${difficulty === 'easy' ? 'bg-emerald-50 border-emerald-300' : difficulty === 'medium' ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-300'}`
                        }`}
                      >
                        <span className="text-xl">{getDifficultyIcon(difficulty)}</span>
                        <span className="text-xs font-medium uppercase">{difficulty}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {selectedDifficulty === 'easy' && 'Friendly sparring - Great for beginners'}
                    {selectedDifficulty === 'medium' && 'Balanced challenge - Strategic arguments'}
                    {selectedDifficulty === 'hard' && 'Master strategist - Intense intellectual combat'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview and Launch */}
          <div className="xl:col-span-1 space-y-6">
            {/* Debate Preview */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-700 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-purple-900 dark:text-purple-100">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <span>Battle Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topic || customTopic ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Topic:</span>
                        <Badge variant="secondary" className="text-xs">
                          {showCustomTopic ? 'Custom' : selectedCategory}
                        </Badge>
                      </div>
                      
                      <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <p className="text-sm text-gray-900 dark:text-white font-medium leading-relaxed">
                          {showCustomTopic ? customTopic : topic}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Position:</span>
                          <Badge className={getPositionColor(userPosition)} variant="secondary">
                            {userPosition.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">First:</span>
                          <Badge variant="outline" className="text-xs">
                            {firstSpeaker === 'user' ? '👤 You' : '🤖 AI'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-2">Challenge:</span>
                        <Badge className={getDifficultyColor(selectedDifficulty)} variant="secondary">
                          {getDifficultyIcon(selectedDifficulty)} {selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
                      <Button 
                        onClick={handleStartDebate}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-4 text-base shadow-lg"
                        size="lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Enter the Arena
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mb-4">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      Ready for Battle?
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Select a topic to see your debate preview and challenge Chanakya AI
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chanakya AI Features */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Chanakya AI Powers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Brain className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Strategic ancient wisdom in modern debates</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Lightning-fast AI responses with voice</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Target className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Adaptive difficulty and argument styles</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <MessageSquare className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Real-time conversation and feedback</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <TrendingUp className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Performance analytics and insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantDebateSetup; 