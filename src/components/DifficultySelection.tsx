
// @ts-nocheck
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Target,
  ArrowRight,
  Star
} from 'lucide-react';

interface DifficultySelectionProps {
  onDifficultySelect: (difficulty: 'Easy' | 'Medium' | 'Hard', theme: string) => void;
  onBack: () => void;
}

const DifficultySelection = ({ onDifficultySelect, onBack }: DifficultySelectionProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const difficulties = [
    {
      level: 'Easy' as const,
      icon: <Star className="h-6 w-6" />,
      description: 'Perfect for beginners',
      details: 'Simple topics, basic arguments, friendly AI',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      level: 'Medium' as const,
      icon: <Target className="h-6 w-6" />,
      description: 'Balanced challenge',
      details: 'Complex topics, structured arguments, adaptive AI',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
    },
    {
      level: 'Hard' as const,
      icon: <Brain className="h-6 w-6" />,
      description: 'Advanced debaters',
      details: 'Complex topics, expert-level arguments, challenging AI',
      color: 'bg-red-100 text-red-700 border-red-200'
    }
  ];

  const themes = [
    { name: 'Politics', emoji: '🏛️', description: 'Government, policies, elections' },
    { name: 'Technology', emoji: '💻', description: 'AI, social media, innovation' },
    { name: 'Environment', emoji: '🌍', description: 'Climate change, sustainability' },
    { name: 'Education', emoji: '📚', description: 'School systems, online learning' },
    { name: 'Health', emoji: '🏥', description: 'Healthcare, mental health, fitness' },
    { name: 'Cinema', emoji: '🎬', description: 'Movies, entertainment, culture' },
    { name: 'Sports', emoji: '⚽', description: 'Athletes, competitions, fairness' },
    { name: 'Food', emoji: '🍔', description: 'Nutrition, culture, industry' },
    { name: 'Society', emoji: '👥', description: 'Social issues, relationships' },
    { name: 'Economics', emoji: '💰', description: 'Markets, inequality, trade' }
  ];

  const handleContinue = () => {
    if (selectedDifficulty && selectedTheme) {
      onDifficultySelect(selectedDifficulty, selectedTheme);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-orbitron neon-text mb-3">Choose Your Challenge</h1>
            <p className="text-gray-300 text-lg font-inter">Select difficulty level and theme for your debate arena</p>
          </div>
          <Button 
            onClick={onBack}
            className="btn-neon-secondary flex items-center gap-2"
          >
            Back to Language
          </Button>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-50 font-orbitron flex items-center gap-3">
            <div className="w-2 h-8 gradient-neon-primary rounded-full"></div>
            Difficulty Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {difficulties.map((difficulty) => (
              <div 
                key={difficulty.level}
                className={`card-neon group hover:shadow-neon cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedDifficulty === difficulty.level 
                    ? 'border-cyan-400/50 shadow-neon' 
                    : ''
                }`}
                onClick={() => setSelectedDifficulty(difficulty.level)}
              >
                <div className="p-6 text-center space-y-4">
                  <div className="relative">
                    <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ${
                      difficulty.level === 'Easy' ? 'bg-emerald-400/20' :
                      difficulty.level === 'Medium' ? 'bg-amber-400/20' : 'bg-red-400/20'
                    }`}>
                      <div className={`${
                        difficulty.level === 'Easy' ? 'text-emerald-400' :
                        difficulty.level === 'Medium' ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {difficulty.icon}
                      </div>
                    </div>
                    <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      difficulty.level === 'Easy' ? 'bg-emerald-400/10' :
                      difficulty.level === 'Medium' ? 'bg-amber-400/10' : 'bg-red-400/10'
                    }`}></div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-50 font-orbitron mb-2">{difficulty.level}</h3>
                    <p className="text-gray-300 font-inter mb-2">{difficulty.description}</p>
                    <p className="text-sm text-gray-400 font-inter">{difficulty.details}</p>
                  </div>

                  <div className="flex justify-center">
                    <div className={`badge-neon px-4 py-2 ${
                      difficulty.level === 'Easy' ? 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30' :
                      difficulty.level === 'Medium' ? 'bg-amber-400/20 text-amber-300 border-amber-400/30' :
                      'bg-red-400/20 text-red-300 border-red-400/30'
                    }`}>
                      {difficulty.level}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        {selectedDifficulty && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-50 font-orbitron flex items-center gap-3">
              <div className="w-2 h-8 gradient-neon-secondary rounded-full"></div>
              Choose Your Theme
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {themes.map((theme) => (
                <div 
                  key={theme.name}
                  className={`card-neon group hover:shadow-neon cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedTheme === theme.name 
                      ? 'border-fuchsia-400/50 shadow-neon' 
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedTheme(theme.name);
                    setTimeout(() => {
                      if (selectedDifficulty) {
                        onDifficultySelect(selectedDifficulty, theme.name);
                      }
                    }, 300);
                  }}
                >
                  <div className="p-4 text-center space-y-3">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {theme.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-50 font-orbitron text-sm mb-1">{theme.name}</h3>
                      <p className="text-xs text-gray-400 font-inter">{theme.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DifficultySelection;
