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

  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'easy': return '🌱';
      case 'medium': return '⚡';
      case 'hard': return '🔥';
      default: return '⭐';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-gray-950 to-fuchsia-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.1),transparent_50%)]"></div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={onBack}
              className="btn-neon-secondary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            
            <div className="text-right">
              <h1 className="text-4xl font-bold font-orbitron neon-text">
                Debate Arena
              </h1>
              <p className="text-gray-300 mt-1 font-inter">Challenge Chanakya AI</p>
            </div>
          </div>
        </div>
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full blur-xl opacity-25 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-fuchsia-500 p-4 rounded-full shadow-neon">
                <Swords className="h-12 w-12 text-gray-950" />
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4 font-orbitron">
            Challenge the{' '}
            <span className="neon-text">
              Master Strategist
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Present your topic or scenario, choose your stance, and engage in strategic debate with Chanakya AI.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Setup Panel - Takes 3 columns */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Topic Selection Arena */}
            <div className="card-neon">
              <div className="p-6 border-b border-cyan-400/20">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl shadow-neon">
                    <Target className="h-6 w-6 text-gray-950" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-orbitron">Choose Your Battlefield</h2>
                    <p className="text-gray-400 mt-1">Select your weapon of choice: a focused topic or complex scenario</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <Tabs value={topicType} onValueChange={(value: string) => setTopicType(value as 'custom' | 'scenario')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-800/50 border border-cyan-400/20">
                    <TabsTrigger value="custom" className="flex items-center space-x-3 h-12 text-base data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 text-gray-400 hover:text-cyan-300">
                      <Lightbulb className="h-5 w-5" />
                      <span>Topic Debate</span>
                    </TabsTrigger>
                    <TabsTrigger value="scenario" className="flex items-center space-x-3 h-12 text-base data-[state=active]:bg-cyan-400/20 data-[state=active]:text-cyan-400 text-gray-400 hover:text-cyan-300">
                      <BookOpen className="h-5 w-5" />
                      <span>Scenario Challenge</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="custom" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Wand2 className="h-5 w-5 text-cyan-400" />
                        <Label className="text-lg font-semibold text-white">Craft Your Debate Topic</Label>
                      </div>
                      <div className="input-neon">
                        <Input
                          placeholder="Enter a clear, debatable statement (e.g., 'Artificial intelligence will replace human creativity in the next decade')"
                          value={customTopic}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTopic(e.target.value)}
                          className="h-14 text-base bg-gray-800/50 border-cyan-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                      </div>
                      <div className="text-sm text-gray-400">
                        {customTopic.length}/200 characters • Make it clear and specific for better debates
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-fuchsia-400" />
                        <Label className="text-base font-medium text-gray-300">
                          Or choose from these compelling topics:
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {sampleTopics.map((topic, index) => (
                          <button
                            key={index}
                            onClick={() => fillSampleTopic(topic)}
                            className="group text-left p-4 bg-gray-800/30 hover:bg-gray-800/60 rounded-xl border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-neon"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="p-1 bg-cyan-400/20 rounded-lg group-hover:bg-cyan-400/30 transition-colors">
                                <Trophy className="h-4 w-4 text-cyan-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
                                  {topic}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="scenario" className="space-y-6 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-cyan-400" />
                        <Label className="text-lg font-semibold text-white">Describe Your Complex Scenario</Label>
                      </div>
                      <div className="input-neon">
                        <Textarea
                          placeholder="Present a complex situation, dilemma, or decision-making scenario that involves multiple perspectives and stakeholders. Be detailed and specific about the context, constraints, and stakes involved."
                          value={scenario}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setScenario(e.target.value)}
                          className="min-h-[140px] text-base bg-gray-800/50 border-cyan-400/30 text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20 resize-none"
                        />
                      </div>
                      <div className="text-sm text-gray-400">
                        {scenario.length}/800 characters • Provide context, stakeholders, and constraints for richer debates
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-fuchsia-400" />
                        <Label className="text-base font-medium text-gray-300">
                          Or explore these strategic scenarios:
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {sampleScenarios.map((scenarioText, index) => (
                          <button
                            key={index}
                            onClick={() => fillSampleScenario(scenarioText)}
                            className="group text-left p-4 bg-gray-800/30 hover:bg-gray-800/60 rounded-xl border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-neon"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="p-1 bg-cyan-400/20 rounded-lg group-hover:bg-cyan-400/30 transition-colors">
                                <Swords className="h-4 w-4 text-cyan-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors leading-relaxed">
                                  {scenarioText}
                                </p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Battle Configuration */}
            <div className="card-neon">
              <div className="p-6 border-b border-cyan-400/20">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-xl shadow-neon">
                    <Settings className="h-5 w-5 text-gray-950" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-orbitron">Strategic Configuration</h3>
                    <p className="text-sm text-gray-400 mt-1">Define your battle stance and parameters</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Your Position */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-cyan-400" />
                    <Label className="text-sm font-medium text-white">Choose Your Position</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setUserPosition('for')}
                      className={`h-12 flex items-center justify-center space-x-2 text-sm rounded-lg border transition-all ${
                        userPosition === 'for' 
                          ? 'btn-neon-primary' 
                          : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-300'
                      }`}
                    >
                      <span className="text-sm">⚔️</span>
                      <span className="font-medium">Supporting</span>
                    </button>
                    <button
                      onClick={() => setUserPosition('against')}
                      className={`h-12 flex items-center justify-center space-x-2 text-sm rounded-lg border transition-all ${
                        userPosition === 'against' 
                          ? 'btn-neon-secondary' 
                          : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-fuchsia-400/50 hover:text-fuchsia-300'
                      }`}
                    >
                      <span className="text-sm">🛡️</span>
                      <span className="font-medium">Opposing</span>
                    </button>
                  </div>
                </div>

                {/* First Speaker */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-cyan-400" />
                    <Label className="text-sm font-medium text-white">Opening Move</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFirstSpeaker('user')}
                      className={`h-12 flex items-center justify-center space-x-2 text-sm rounded-lg border transition-all ${
                        firstSpeaker === 'user' 
                          ? 'btn-neon-primary' 
                          : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-300'
                      }`}
                    >
                      <span className="text-sm">👤</span>
                      <span className="font-medium">You Start</span>
                    </button>
                    <button
                      onClick={() => setFirstSpeaker('ai')}
                      className={`h-12 flex items-center justify-center space-x-2 text-sm rounded-lg border transition-all ${
                        firstSpeaker === 'ai' 
                          ? 'btn-neon-secondary' 
                          : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-fuchsia-400/50 hover:text-fuchsia-300'
                      }`}
                    >
                      <span className="text-sm">👑</span>
                      <span className="font-medium">Chanakya Opens</span>
                    </button>
                  </div>
                </div>

                {/* Difficulty Level */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <Label className="text-sm font-medium text-white">Combat Intensity</Label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`h-12 flex items-center justify-center space-x-1 text-sm rounded-lg border transition-all ${
                          difficulty === level
                            ? level === 'easy' 
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-emerald-400/20 shadow-lg'
                              : level === 'medium'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-amber-400/20 shadow-lg'
                              : 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-rose-400/20 shadow-lg'
                            : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-300'
                        }`}
                      >
                        <span className="text-sm">{getDifficultyIcon(level)}</span>
                        <span className="font-medium capitalize">{level}</span>
                      </button>
                    ))}
                  </div>
                  <div className="text-center text-xs text-gray-400">
                    {difficulty === 'easy' && '🌱 Gentle approach with thoughtful responses'}
                    {difficulty === 'medium' && '⚡ Balanced challenge with strategic depth'}
                    {difficulty === 'hard' && '🔥 Intense intellectual combat experience'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel - Takes 1 column */}
          <div className="xl:col-span-1 space-y-6">
            {/* Battle Preview */}
            <div className="card-neon bg-gradient-to-br from-cyan-950/30 to-fuchsia-950/30 border-cyan-400/30">
              <div className="p-6 border-b border-cyan-400/20">
                <h3 className="flex items-center space-x-3 text-cyan-300 font-orbitron">
                  <div className="p-2 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-lg shadow-neon">
                    <Eye className="h-5 w-5 text-gray-950" />
                  </div>
                  <span>Battle Preview</span>
                </h3>
              </div>
              <div className="p-6">
                {(customTopic || scenario) ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-800/70 rounded-lg border border-gray-700/50">
                        <div className="text-xs font-medium text-gray-400 mb-1">BATTLEFIELD:</div>
                        <p className="text-sm text-white font-medium leading-relaxed">
                          {topicType === 'custom' ? customTopic : scenario}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg border border-gray-700/30">
                          <span className="text-xs font-medium text-gray-400">Position:</span>
                          <div className={`badge-neon ${userPosition === 'for' ? 'text-emerald-300 border-emerald-400/50 bg-emerald-400/10' : 'text-rose-300 border-rose-400/50 bg-rose-400/10'}`}>
                            {userPosition === 'for' ? '⚔️ SUPPORT' : '🛡️ OPPOSE'}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg border border-gray-700/30">
                          <span className="text-xs font-medium text-gray-400">First Move:</span>
                          <div className="badge-neon">
                            {firstSpeaker === 'user' ? '👤 You' : '👑 Chanakya'}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg border border-gray-700/30">
                          <span className="text-xs font-medium text-gray-400">Intensity:</span>
                          <div className={`badge-neon ${
                            difficulty === 'easy' ? 'text-emerald-300 border-emerald-400/50 bg-emerald-400/10' : 
                            difficulty === 'medium' ? 'text-amber-300 border-amber-400/50 bg-amber-400/10' : 
                            'text-rose-300 border-rose-400/50 bg-rose-400/10'
                          }`}>
                            {getDifficultyIcon(difficulty)} {difficulty.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-cyan-400/20">
                      <button 
                        onClick={handleStartDebate}
                        className="btn-neon-primary w-full py-4 text-base font-bold"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Enter Battle Arena
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full flex items-center justify-center mb-4 shadow-neon">
                      <Crown className="h-8 w-8 text-gray-950" />
                    </div>
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2 font-orbitron">
                      Prepare for Battle
                    </h3>
                    <p className="text-sm text-gray-400">
                      Choose your topic or scenario to challenge the master strategist
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chanakya's Arsenal */}
            <div className="card-neon">
              <div className="p-6 border-b border-cyan-400/20">
                <h3 className="flex items-center space-x-3 font-orbitron">
                  <div className="p-2 bg-gradient-to-r from-fuchsia-500 to-amber-500 rounded-lg shadow-neon">
                    <Crown className="h-5 w-5 text-gray-950" />
                  </div>
                  <span className="text-white">Chanakya's Arsenal</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/30 hover:border-cyan-400/30">
                    <Brain className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Ancient wisdom meets modern logic</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/30 hover:border-cyan-400/30">
                    <Zap className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Lightning-fast strategic responses</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/30 hover:border-cyan-400/30">
                    <Target className="h-4 w-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Adaptive combat difficulty scaling</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/30 hover:border-cyan-400/30">
                    <MessageSquare className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Voice synthesis & real-time responses</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/30 hover:border-cyan-400/30">
                    <TrendingUp className="h-4 w-4 text-orange-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Performance analytics & growth insights</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors border border-gray-700/30 hover:border-cyan-400/30">
                    <Swords className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <span className="text-sm text-gray-300">Strategic counter-argument mastery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChanakyaDebateSetup;
