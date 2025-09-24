import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Lightbulb,
  Users,
  Crown,
  Scroll,
  Settings,
  Sparkles,
  Trophy,
  Swords,
  BookOpen,
  Play,
  ArrowRight,
  Wand2,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChanakyaDebateConfig {
  topic: string;
  topicType: 'custom' | 'scenario';
  userPosition: 'for' | 'against';
  firstSpeaker: 'user' | 'ai';
  difficulty: 'easy' | 'medium' | 'hard';
  customTopic?: string;
  scenario?: string;
}

interface ChanakyaDebateSetupProps {
  onStartDebate: (config: ChanakyaDebateConfig) => void;
  onBack: () => void;
}

const ChanakyaDebateSetup = ({ onStartDebate, onBack }: ChanakyaDebateSetupProps) => {
  const { toast } = useToast();
  
  // State management
  const [topicType, setTopicType] = useState<'custom' | 'scenario'>('custom');
  const [customTopic, setCustomTopic] = useState('');
  const [scenario, setScenario] = useState('');
  const [userPosition, setUserPosition] = useState<'for' | 'against'>('for');
  const [firstSpeaker, setFirstSpeaker] = useState<'user' | 'ai'>('user');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Sample topics for inspiration
  const sampleTopics = [
    "Artificial intelligence will replace human creativity in the next decade",
    "Social media platforms should be held responsible for mental health issues",
    "Remote work permanently changes the future of employment",
    "Genetic engineering should enhance human cognitive abilities",
    "Cryptocurrency will replace traditional banking systems"
  ];

  // Sample scenarios for inspiration
  const sampleScenarios = [
    "As CEO of a tech company, you must decide whether to implement AI that could eliminate 40% of jobs but triple profits and fund retraining programs.",
    "You're a university president choosing between accepting a $50M donation from a controversial billionaire or maintaining institutional independence.",
    "As a city mayor, you must choose between building affordable housing or preserving historic neighborhoods in a gentrification crisis.",
    "You lead a medical team deciding whether to use experimental treatment on a terminal patient when standard options are exhausted.",
    "As a startup founder, you must decide whether to accept acquisition by a Big Tech company or remain independent but risk failure."
  ];

  const handleStartDebate = () => {
    const topic = topicType === 'custom' ? customTopic.trim() : scenario.trim();
    
    if (!topic) {
      toast({
        title: 'Topic Required',
        description: `Please enter a ${topicType === 'custom' ? 'topic' : 'scenario'} to debate`,
        variant: 'destructive',
      });
      return;
    }

    if (topic.length < 10) {
      toast({
        title: 'Topic Too Short',
        description: 'Please provide a more detailed topic or scenario (at least 10 characters)',
        variant: 'destructive',
      });
      return;
    }

    const config: ChanakyaDebateConfig = {
      topic,
      topicType,
      userPosition,
      firstSpeaker,
      difficulty,
      ...(topicType === 'custom' ? { customTopic: topic } : { scenario: topic })
    };

    onStartDebate(config);
  };

  const fillSampleTopic = (topic: string) => {
    setCustomTopic(topic);
  };

  const fillSampleScenario = (scenarioText: string) => {
    setScenario(scenarioText);
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
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

  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'easy': return '🌱';
      case 'medium': return '⚡';
      case 'hard': return '🔥';
      default: return '⭐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Royal Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Navigation */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onBack}
              className="flex items-center space-x-2 hover:bg-purple-50 hover:border-purple-300"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
            
            {/* Center - Branding */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  Chanakya AI Challenge
                  <Sparkles className="h-4 w-4 text-purple-500 ml-2" />
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">Ancient Strategy • Modern Intelligence</p>
              </div>
            </div>
            
            {/* Right Side - Status */}
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Ready for Battle
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-xl opacity-25 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-full shadow-2xl">
                <Swords className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Enter the{' '}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Debate Arena
            </span>
          </h1>
          
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Challenge the legendary strategist Chanakya AI in intellectual combat. Present your topic or scenario, 
            choose your stance, and engage in strategic debate.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Setup Panel - Takes 3 columns */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Topic Selection Arena */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">Choose Your Battlefield</CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Select your weapon of choice: a focused topic or complex scenario</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={topicType} onValueChange={(value) => setTopicType(value as 'custom' | 'scenario')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 dark:bg-gray-700">
                    <TabsTrigger value="custom" className="flex items-center space-x-3 h-12 text-base">
                      <Lightbulb className="h-5 w-5" />
                      <span>Topic Debate</span>
                    </TabsTrigger>
                    <TabsTrigger value="scenario" className="flex items-center space-x-3 h-12 text-base">
                      <BookOpen className="h-5 w-5" />
                      <span>Scenario Challenge</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="custom" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Wand2 className="h-5 w-5 text-purple-500" />
                        <Label className="text-lg font-semibold">Craft Your Debate Topic</Label>
                      </div>
                      <Input
                        placeholder="Enter a clear, debatable statement (e.g., 'Artificial intelligence will replace human creativity in the next decade')"
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        className="h-14 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {customTopic.length}/200 characters • Make it clear and specific for better debates
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                          Or choose from these compelling topics:
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {sampleTopics.map((topic, index) => (
                          <button
                            key={index}
                            onClick={() => fillSampleTopic(topic)}
                            className="group text-left p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-purple-50 hover:to-indigo-50 dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="p-1 bg-purple-100 dark:bg-purple-900/50 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                                <Trophy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                                  {topic}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transform group-hover:translate-x-1 transition-all" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="scenario" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-indigo-500" />
                        <Label className="text-lg font-semibold">Describe Your Complex Scenario</Label>
                      </div>
                      <Textarea
                        placeholder="Present a complex situation, dilemma, or decision-making scenario that involves multiple perspectives and stakeholders. Be detailed and specific about the context, constraints, and stakes involved."
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        className="min-h-[140px] text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 resize-none"
                      />
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {scenario.length}/800 characters • Provide context, stakeholders, and constraints for richer debates
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <Label className="text-base font-medium text-gray-700 dark:text-gray-300">
                          Or explore these strategic scenarios:
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {sampleScenarios.map((scenarioText, index) => (
                          <button
                            key={index}
                            onClick={() => fillSampleScenario(scenarioText)}
                            className="group text-left p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:from-indigo-50 hover:to-blue-50 dark:hover:from-indigo-900/30 dark:hover:to-blue-900/30 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-lg"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="p-1 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                                <Swords className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors leading-relaxed">
                                  {scenarioText}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Battle Configuration */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">Strategic Configuration</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Define your battle stance and parameters</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Your Position */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-amber-500" />
                    <Label className="text-sm font-medium">Choose Your Position</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={userPosition === 'for' ? 'default' : 'outline'}
                      onClick={() => setUserPosition('for')}
                      className={`h-10 flex items-center justify-center space-x-2 text-sm ${
                        userPosition === 'for' 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500' 
                          : 'hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-900/20'
                      }`}
                    >
                      <span className="text-sm">⚔️</span>
                      <span className="font-medium">Supporting</span>
                    </Button>
                    <Button
                      variant={userPosition === 'against' ? 'default' : 'outline'}
                      onClick={() => setUserPosition('against')}
                      className={`h-10 flex items-center justify-center space-x-2 text-sm ${
                        userPosition === 'against' 
                          ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500' 
                          : 'hover:bg-rose-50 hover:border-rose-300 dark:hover:bg-rose-900/20'
                      }`}
                    >
                      <span className="text-sm">🛡️</span>
                      <span className="font-medium">Opposing</span>
                    </Button>
                  </div>
                </div>

                {/* First Speaker */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <Label className="text-sm font-medium">Opening Move</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={firstSpeaker === 'user' ? 'default' : 'outline'}
                      onClick={() => setFirstSpeaker('user')}
                      className={`h-10 flex items-center justify-center space-x-2 text-sm ${
                        firstSpeaker === 'user' 
                          ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' 
                          : 'hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20'
                      }`}
                    >
                      <span className="text-sm">👤</span>
                      <span className="font-medium">You Start</span>
                    </Button>
                    <Button
                      variant={firstSpeaker === 'ai' ? 'default' : 'outline'}
                      onClick={() => setFirstSpeaker('ai')}
                      className={`h-10 flex items-center justify-center space-x-2 text-sm ${
                        firstSpeaker === 'ai' 
                          ? 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500' 
                          : 'hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20'
                      }`}
                    >
                      <span className="text-sm">👑</span>
                      <span className="font-medium">Chanakya Opens</span>
                    </Button>
                  </div>
                </div>

                {/* Difficulty Level */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <Label className="text-sm font-medium">Combat Intensity</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <Button
                        key={level}
                        variant={difficulty === level ? 'default' : 'outline'}
                        onClick={() => setDifficulty(level)}
                        className={`h-10 flex items-center justify-center space-x-1 text-sm ${
                          difficulty === level
                            ? level === 'easy' 
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500'
                              : level === 'medium'
                              ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                              : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500'
                            : `hover:${level === 'easy' ? 'bg-emerald-50 border-emerald-300' : level === 'medium' ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-300'} dark:hover:${level === 'easy' ? 'bg-emerald-900/20' : level === 'medium' ? 'bg-amber-900/20' : 'bg-rose-900/20'}`
                        }`}
                      >
                        <span className="text-sm">{getDifficultyIcon(level)}</span>
                        <span className="font-medium capitalize">{level}</span>
                      </Button>
                    ))}
                  </div>
                  <div className="text-center text-xs text-gray-600 dark:text-gray-400">
                    {difficulty === 'easy' && '🌱 Gentle approach with thoughtful responses'}
                    {difficulty === 'medium' && '⚡ Balanced challenge with strategic depth'}
                    {difficulty === 'hard' && '🔥 Intense intellectual combat experience'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel - Takes 1 column */}
          <div className="xl:col-span-1 space-y-6">
            {/* Battle Preview */}
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
                {(customTopic || scenario) ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">BATTLEFIELD:</div>
                        <p className="text-sm text-gray-900 dark:text-white font-medium leading-relaxed">
                          {topicType === 'custom' ? customTopic : scenario}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Position:</span>
                          <Badge className={getPositionColor(userPosition)} variant="secondary">
                            {userPosition === 'for' ? '⚔️ SUPPORT' : '🛡️ OPPOSE'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">First Move:</span>
                          <Badge variant="outline" className="text-xs">
                            {firstSpeaker === 'user' ? '👤 You' : '👑 Chanakya'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Intensity:</span>
                          <Badge className={getDifficultyColor(difficulty)} variant="secondary">
                            {getDifficultyIcon(difficulty)} {difficulty.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
                      <Button 
                        onClick={handleStartDebate}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 text-base shadow-xl"
                        size="lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Enter Battle Arena
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
                      Prepare for Battle
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Choose your topic or scenario to challenge the master strategist
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chanakya's Arsenal */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-900 dark:text-white">Chanakya's Arsenal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Brain className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Ancient wisdom meets modern logic</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Zap className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Lightning-fast strategic responses</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Target className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Adaptive combat difficulty scaling</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <MessageSquare className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Voice synthesis & real-time responses</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <TrendingUp className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Performance analytics & growth insights</span>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <Swords className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Strategic counter-argument mastery</span>
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

export default ChanakyaDebateSetup;
