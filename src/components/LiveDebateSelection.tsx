// @ts-nocheck
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users, Globe, Shield, ArrowLeft, Target, Trophy
} from 'lucide-react';
import LanguageSelection from './LanguageSelection';
import DifficultySelection from './DifficultySelection';
import LiveDebateRoom from './LiveDebateRoom';

interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
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

interface LiveDebateSelectionProps {
  onFormatSelect: (format: '1v1' | '3v3', language: string) => void;
  onBack: () => void;
}

const LiveDebateSelection = ({
  onFormatSelect,
  onBack,
}: LiveDebateSelectionProps) => {
  const [currentStep, setCurrentStep] = useState<'format' | 'language' | 'difficulty' | 'room'>('format');
  const [selectedFormat, setSelectedFormat] = useState<'1v1' | '3v3' | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedTheme, setSelectedTheme] = useState<string>('');

  const handleFormatSelect = (format: '1v1' | '3v3') => {
    setSelectedFormat(format);
    setCurrentStep('language');
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setCurrentStep('difficulty');
  };

  const handleDifficultySelect = (
    difficulty: 'Easy' | 'Medium' | 'Hard',
    theme: string
  ) => {
    setSelectedDifficulty(difficulty);
    setSelectedTheme(theme);
    setCurrentStep('room');
  };

  const handleStartDebate = (topic: Topic, opponent: OnlineUser) => {
    onFormatSelect(selectedFormat!, selectedLanguage);
  };

  const handleBackToFormats = () => {
    setCurrentStep('format');
    setSelectedFormat(null);
  };

  const handleBackToLanguage = () => {
    setCurrentStep('language');
  };

  const handleBackToDifficulty = () => {
    setCurrentStep('difficulty');
  };

  if (currentStep === 'room') {
    return (
      <LiveDebateRoom
        difficulty={selectedDifficulty}
        theme={selectedTheme}
        onBack={handleBackToDifficulty}
        onStartDebate={handleStartDebate}
      />
    );
  }

  if (currentStep === 'difficulty') {
    return (
      <DifficultySelection
        onDifficultySelect={handleDifficultySelect}
        onBack={handleBackToLanguage}
      />
    );
  }

  if (currentStep === 'language') {
    return (
      <LanguageSelection
        onLanguageSelect={handleLanguageSelect}
        onBack={handleBackToFormats}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-2">
              Choose Live Debate Format
            </h1>
            <p className="text-gray-300 text-lg font-inter">
              Select your debate format and connect with real opponents worldwide
            </p>
          </div>
          <Button 
            onClick={onBack}
            className="btn-neon-secondary flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Format Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 1v1 Format */}
          <div className="card-neon group hover:shadow-neon transition-all duration-500 cursor-pointer">
            <div className="p-8 text-center space-y-6">
              <div className="relative">
                <div className="mx-auto gradient-neon-primary p-6 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-gray-950" />
                </div>
                <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-50 font-orbitron mb-2">1 vs 1 Debate</h3>
                <p className="text-gray-300 font-inter">Classic one-on-one intellectual duel</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-inter">Duration</span>
                  <Badge className="badge-neon bg-cyan-400/20 text-cyan-300 border-cyan-400/30">15-20 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-inter">Participants</span>
                  <Badge className="badge-neon bg-cyan-400/20 text-cyan-300 border-cyan-400/30">2 debaters</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-inter">Token Reward</span>
                  <Badge className="badge-neon bg-amber-400/20 text-amber-300 border-amber-400/30 flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    5-15 tokens
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-inter">AI Moderation</span>
                  <Badge className="badge-neon bg-emerald-400/20 text-emerald-300 border-emerald-400/30 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Enabled
                  </Badge>
                </div>
              </div>

              <Button 
                className="btn-neon-primary w-full text-lg py-4 font-orbitron" 
                onClick={() => handleFormatSelect('1v1')}
              >
                Select 1v1 Format
              </Button>
            </div>
          </div>

          {/* 3v3 Format */}
          <div className="card-neon group hover:shadow-neon transition-all duration-500 cursor-pointer">
            <div className="p-8 text-center space-y-6">
              <div className="relative">
                <div className="mx-auto gradient-neon-secondary p-6 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-fuchsia-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-50 font-orbitron mb-2">3 vs 3 Debate</h3>
                <p className="text-gray-300 font-inter">Team-based strategic warfare</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-inter">Duration</span>
                  <Badge className="badge-neon bg-fuchsia-400/20 text-fuchsia-300 border-fuchsia-400/30">25-35 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-inter">Participants</span>
                  <Badge className="badge-neon bg-fuchsia-400/20 text-fuchsia-300 border-fuchsia-400/30">6 debaters</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-inter">Token Reward</span>
                  <Badge className="badge-neon bg-amber-400/20 text-amber-300 border-amber-400/30 flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    10-20 tokens
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-inter">AI Moderation</span>
                  <Badge className="badge-neon bg-emerald-400/20 text-emerald-300 border-emerald-400/30 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Enhanced
                  </Badge>
                </div>
              </div>

              <Button 
                className="btn-neon-secondary w-full text-lg py-4 font-orbitron"
                onClick={() => handleFormatSelect('3v3')}
              >
                Select 3v3 Format
              </Button>
            </div>
          </div>
        </div>

        {/* AI Moderation Features */}
        <div className="card-neon">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-emerald-400" />
                <h2 className="text-3xl font-bold text-gray-50 font-orbitron">AI Moderation System</h2>
              </div>
              <p className="text-gray-300 text-lg font-inter">
                Advanced AI ensures fair play and optimal learning experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="bg-emerald-400/20 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div className="absolute inset-0 bg-emerald-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="text-xl font-bold text-gray-50 font-orbitron mb-2">Real-time Fact Checking</h4>
                <p className="text-gray-300 font-inter">AI verifies claims and provides instant feedback during debates</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="bg-cyan-400/20 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="text-xl font-bold text-gray-50 font-orbitron mb-2">Fair Time Management</h4>
                <p className="text-gray-300 font-inter">Automatic speaking time allocation ensures equal opportunities</p>
              </div>

              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="bg-fuchsia-400/20 p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-fuchsia-400" />
                  </div>
                  <div className="absolute inset-0 bg-fuchsia-400/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h4 className="text-xl font-bold text-gray-50 font-orbitron mb-2">Performance Analytics</h4>
                <p className="text-gray-300 font-inter">Instant feedback, scoring, and personalized token rewards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Global Language Support */}
        <div className="card-neon">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="h-8 w-8 text-cyan-400" />
              <h3 className="text-2xl font-bold text-gray-50 font-orbitron">Global Language Support</h3>
            </div>
            <p className="text-gray-300 text-lg font-inter mb-6">
              Debate in your preferred language with opponents from around the world
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Hindi'].map((lang) => (
                <Badge key={lang} className="badge-neon bg-cyan-400/20 text-cyan-300 border-cyan-400/30">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDebateSelection;
