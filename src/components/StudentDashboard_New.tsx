import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Trophy, TrendingUp, Users, Star, Award, Target, Zap, Brain, Globe, Mic, BookOpen, Bot, Eye, Settings, History, Calendar, Newspaper, Sparkles, ChevronRight } from 'lucide-react';
import MainMenuCard from '@/components/dashboard/MainMenuCard';
import QuickStatsCard from '@/components/dashboard/QuickStatsCard';
import RecentDebatesCard from '@/components/dashboard/RecentDebatesCard';
import FreudAnalysisCard from '@/components/dashboard/FreudAnalysisCard';

interface StudentDashboardProps {
  userTokens: number;
  onStartDebate: () => void;
  onDebateLive: () => void;
  onJoinMUN: () => void;
  onCreateDebateRoom: () => void;
  onViewEvents: () => void;
  onResources: () => void;
  onViewTokens: () => void;
  onPublicSpeaking: () => void;
  onDebatesHub: () => void;
  onHumanDebate: () => void;
  onDebateHistory: () => void;
  onInstantDebate: () => void;
  onAICoach: () => void;
}

const StudentDashboard = ({ 
  userTokens, 
  onStartDebate, 
  onDebateLive,
  onJoinMUN, 
  onCreateDebateRoom, 
  onViewEvents, 
  onResources, 
  onViewTokens,
  onPublicSpeaking,
  onDebatesHub,
  onHumanDebate,
  onDebateHistory,
  onInstantDebate,
  onAICoach
}: StudentDashboardProps) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2760%22%20height%3D%2760%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2730%22%20cy%3D%2730%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                MyDebate.AI
              </span>
            </h1>
            
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              Master the art of debate with AI-powered coaching and live competitions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Quick Stats Overview */}
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Performance</h2>
                <p className="text-gray-600">Track your debate journey and achievements</p>
              </div>
              <QuickStatsCard 
                userTokens={userTokens} 
                onViewTokens={onViewTokens}
              />
            </div>

            {/* Featured Quick Actions */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Start</h2>
                <p className="text-gray-600">Jump right into your debate journey</p>
              </div>
              
              {/* Home Quick Menu: Four primary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Chanakyas Card */}
                <button onClick={onInstantDebate} className="text-left bg-white rounded-2xl-card shadow-card p-6 hover-glow focus:outline-none focus:ring-4 focus:ring-indigo-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
                      <Brain className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-black text-lg font-semibold">Chanakyas</h3>
                      <p className="text-black text-sm opacity-80">AI debates with Chanakya-style adversary</p>
                    </div>
                  </div>
                </button>

                {/* MUN Card */}
                <button onClick={onJoinMUN} className="text-left bg-white rounded-2xl-card shadow-card p-6 hover-glow focus:outline-none focus:ring-4 focus:ring-indigo-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
                      <Globe className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-black text-lg font-semibold">MUN</h3>
                      <p className="text-black text-sm opacity-80">Model United Nations simulations and committees</p>
                    </div>
                  </div>
                </button>

                {/* Events Card */}
                <button onClick={onViewEvents} className="text-left bg-white rounded-2xl-card shadow-card p-6 hover-glow focus:outline-none focus:ring-4 focus:ring-indigo-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
                      <Calendar className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-black text-lg font-semibold">Events</h3>
                      <p className="text-black text-sm opacity-80">Competitions, tournaments, and schedules</p>
                    </div>
                  </div>
                </button>

                {/* History Card */}
                <button onClick={onDebateHistory} className="text-left bg-white rounded-2xl-card shadow-card p-6 hover-glow focus:outline-none focus:ring-4 focus:ring-indigo-100">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center shadow-soft">
                      <History className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-black text-lg font-semibold">History</h3>
                      <p className="text-black text-sm opacity-80">View past debates and performance analytics</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instant Debate - Featured */}
                <Card 
                  className="group relative overflow-hidden border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-orange-50 to-white hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-opacity-60 hover:scale-105 hover:-translate-y-2 ring-2 ring-yellow-300 ring-opacity-50 animate-pulse shadow-yellow-500/20 hover:shadow-yellow-500/30 backdrop-blur-sm"
                  onClick={onInstantDebate}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                  
                  <CardHeader className="text-center relative z-10 pb-4">
                    <div className="relative mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full w-14 h-14 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                        <Zap className="h-7 w-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    </div>
                    <CardTitle className="text-lg text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      ⚡ Instant Debate
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Quick AI debates with Chanakya AI and voice synthesis
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* AI Coach - Featured */}
                <Card 
                  className="group relative overflow-hidden border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-teal-50 to-white hover:shadow-2xl transition-all duration-500 cursor-pointer hover:border-opacity-60 hover:scale-105 hover:-translate-y-2 ring-2 ring-emerald-300 ring-opacity-50 animate-pulse shadow-emerald-500/20 hover:shadow-emerald-500/30 backdrop-blur-sm"
                  onClick={onAICoach}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                  
                  <CardHeader className="text-center relative z-10 pb-4">
                    <div className="relative mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-full w-14 h-14 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                        <Brain className="h-7 w-7 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    </div>
                    <CardTitle className="text-lg text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      🧠 AI Coach
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      Get personalized coaching on speech, grammar, and content analysis
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Call to Action */}
            <Card className="card-shadow-lg border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
              <CardContent className="p-8">
                <div className="max-w-xl mx-auto">
                  <h3 className="text-2xl font-bold mb-3">Ready to Start Your Debate Journey?</h3>
                  <p className="text-indigo-100 mb-6">
                    Choose from AI debates, live competitions, or MUN simulations to enhance your skills.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      className="bg-white text-indigo-600 hover:bg-gray-100 font-medium px-6"
                      onClick={onStartDebate}
                    >
                      Start AI Debate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-indigo-600 font-medium px-6"
                      onClick={onDebateLive}
                    >
                      Join Live Room
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            
            {/* Token Display */}
            <Card className="card-shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={onViewTokens}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3">
                        <Coins className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{userTokens}</p>
                      <p className="text-sm text-gray-600">Your Tokens</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Debate Modes</CardTitle>
                <CardDescription>Choose your competition style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button 
                  onClick={onStartDebate}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-2 rounded-lg">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">🤖 AI Debate</p>
                    <p className="text-xs text-gray-500">Challenge our AI opponent</p>
                  </div>
                </button>
                
                <button 
                  onClick={onDebateLive}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-lg">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">⚡ Live Debate</p>
                    <p className="text-xs text-gray-500">Debate with real people</p>
                  </div>
                </button>
                
                <button 
                  onClick={onJoinMUN}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">🌍 MUN Mode</p>
                    <p className="text-xs text-gray-500">Model United Nations</p>
                  </div>
                </button>
                
                <button 
                  onClick={onHumanDebate}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">👥 Human vs Human</p>
                    <p className="text-xs text-gray-500">Watch live debates</p>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Activities Menu */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Activities & Learning</CardTitle>
                <CardDescription>Expand your skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button 
                  onClick={onPublicSpeaking}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-indigo-400 to-purple-400 p-2 rounded-lg">
                    <Mic className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">🎭 Public Speaking</p>
                    <p className="text-xs text-gray-500">JAM, Group discussions</p>
                  </div>
                </button>
                
                <button 
                  onClick={onResources}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">📚 Resources</p>
                    <p className="text-xs text-gray-500">Rules, techniques, blogs</p>
                  </div>
                </button>
                
                <button 
                  onClick={onDebatesHub}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 rounded-lg">
                    <Newspaper className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">📰 Debates Hub</p>
                    <p className="text-xs text-gray-500">Articles and videos</p>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Management Menu */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Manage & Track</CardTitle>
                <CardDescription>Organize and review</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button 
                  onClick={onCreateDebateRoom}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-lg">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">🏛️ Create Room</p>
                    <p className="text-xs text-gray-500">Custom topics & formats</p>
                  </div>
                </button>
                
                <button 
                  onClick={onDebateHistory}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg">
                    <History className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">📜 Debate History</p>
                    <p className="text-xs text-gray-500">View past debates</p>
                  </div>
                </button>
                
                <button 
                  onClick={onViewEvents}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-2 rounded-lg">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">🎪 Events</p>
                    <p className="text-xs text-gray-500">Competitions & tournaments</p>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Recent Debates */}
            <RecentDebatesCard />

            {/* Freud Analysis */}
            <FreudAnalysisCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
