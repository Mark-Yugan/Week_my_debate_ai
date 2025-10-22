import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Coins, Trophy, TrendingUp, Users, Star, Award, Target, Zap, Brain, Globe, Mic, BookOpen, Bot, Eye, Settings, History, Calendar, Newspaper, Sparkles, ChevronRight, ChevronDown, ChevronUp, Crown, User, LogOut } from 'lucide-react';
import MainMenuCard from '@/components/dashboard/MainMenuCard';
import RecentDebatesCard from '@/components/dashboard/RecentDebatesCard';
import FreudAnalysisCard from '@/components/dashboard/FreudAnalysisCard';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { CT } from '@/lib/content';

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
  onChanakyaDebate?: () => void;
  requireAuth?: (callback: () => void) => void;
  isAuthenticated?: boolean;
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
  onAICoach,
  onChanakyaDebate,
  requireAuth,
  isAuthenticated
}: StudentDashboardProps) => {
  const { user, signOut } = useCustomAuth();

  return (
    <div className="min-h-screen bg-gray-950 relative font-primary">
      {/* Floating User Menu - Top Right for Authenticated Users */}
      {isAuthenticated ? (
        <div className="fixed top-6 right-6 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative h-12 w-12 rounded-full btn-neon-primary hover:btn-neon-secondary shadow-neon-cyan hover:shadow-neon-pink transform hover:scale-105 transition-all duration-300">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar_url} className="object-cover" />
                  <AvatarFallback className="bg-gray-900 text-cyan-400 font-bold">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 card-neon" align="end" forceMount>
              <div className="px-4 py-3 bg-gray-800/50 rounded-xl mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="gradient-neon-primary text-gray-950">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-50">{user?.email || 'User'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Coins className="h-3 w-3 text-cyan-400" />
                      <span className="text-xs text-cyan-400">{userTokens} tokens</span>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenuItem className="rounded-xl hover:bg-gray-800 text-gray-50 transition-colors duration-200">
                <Settings className="mr-3 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="rounded-xl hover:bg-red-900/50 text-red-400 transition-colors duration-200">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        /* Floating Auth Pill Card - Top Right for Guests */
        <div className="fixed top-6 right-6 z-50">
          <div className="card-neon backdrop-dark p-2">
            <div className="flex items-center space-x-2">
              <Button 
                className="btn-neon-primary px-6 py-2 text-sm"
                onClick={() => window.location.href = '/signup'}
              >
                Sign Up
              </Button>
              <Button 
                className="btn-neon-outline px-6 py-2 text-sm"
                onClick={() => window.location.href = '/login'}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Dark Cyberpunk Hero Section */}
      <div className="min-h-screen relative overflow-hidden flex flex-col bg-gray-950">
        {/* Neon Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(217, 70, 239, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 40% 90%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)
            `
          }}></div>
        </div>
        
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            
            {/* Neon Brand Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative group animate-float">
                <div className="absolute inset-0 gradient-neon-primary rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300 animate-neon-pulse"></div>
                <div className="relative card-neon-glow p-6">
                  <img 
                    src="/lovable-uploads/80a86b55-ac06-4e1e-905b-e5574803f537.png" 
                    alt="Speak Your Mind Logo" 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* AI-Powered Header */}
            <div className="space-y-2">
              <p className="text-lg md:text-xl text-gray-300 font-display tracking-wide uppercase">
                Your Ultimate Speaking Coach
              </p>
            </div>
            
            {/* Cyberpunk Brand Name */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight leading-none">
                <span className="text-glow-cyan">
                  MYDEBATE
                </span>
                <span className="text-glow-pink">
                  AI
                </span>
              </h1>
              <div className="w-32 h-1 gradient-neon-mixed mx-auto rounded-full animate-neon-pulse"></div>
            </div>
            
            {/* Compelling Tagline */}
            <p className="text-xl md:text-2xl text-gray-50 max-w-4xl mx-auto leading-relaxed font-medium">
              {isAuthenticated 
                ? "Stop Scrolling. Start Speaking. Master Any Conversation."
                : "Level up your voice! Transform from hesitant speaker to confident force."
              }
            </p>

            {/* Neon Process Flow */}
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto mt-12 mb-12">
              <div className="card-neon backdrop-dark rounded-full px-6 py-3 border-neon hover:border-neon-glow transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm font-semibold text-gray-50">{CT.dashboard.buttons.prepare}</span>
                </div>
              </div>
              <div className="card-neon backdrop-dark rounded-full px-6 py-3 border-neon hover:border-neon-glow transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-fuchsia-500" />
                  <span className="text-sm font-semibold text-gray-50">{CT.dashboard.buttons.practiceAI}</span>
                </div>
              </div>
              <div className="card-neon backdrop-dark rounded-full px-6 py-3 border-neon hover:border-neon-glow transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm font-semibold text-gray-50">{CT.dashboard.buttons.performPeers}</span>
                </div>
              </div>
              <div className="card-neon backdrop-dark rounded-full px-6 py-3 border-neon hover:border-neon-glow transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-fuchsia-500" />
                  <span className="text-sm font-semibold text-gray-50">{CT.dashboard.buttons.feedback}</span>
                </div>
              </div>
              <div className="card-neon backdrop-dark rounded-full px-6 py-3 border-neon hover:border-neon-glow transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <Mic className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm font-semibold text-gray-50">{CT.dashboard.buttons.dropMic}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neon Scroll Indicator */}
        <div className="pb-8 flex justify-center relative z-10">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center card-neon backdrop-dark">
              <div className="w-1 h-3 gradient-neon-primary rounded-full mt-2 animate-neon-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-20">
          
          {/* Main Feature Categories */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-50 tracking-tight">
                {CT.dashboard.features.title}
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {CT.dashboard.features.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              
              {/* Debate with Chanakya - Neon Card Design */}
              <div className="h-80 group cursor-pointer" onClick={() => requireAuth ? requireAuth(onChanakyaDebate || onInstantDebate) : (onChanakyaDebate ? onChanakyaDebate() : onInstantDebate())}>
                <div className="h-full card-neon p-6 hover:card-neon-glow transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-bl-3xl"></div>
                  <div className="flex justify-center mb-4 relative z-10">
                    <div className="gradient-neon-primary p-4 rounded-xl shadow-neon-cyan group-hover:scale-110 transition-all duration-300">
                      <Brain className="h-8 w-8 text-gray-950" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-50 mb-3 text-center relative z-10">
                    {CT.dashboard.features.chanakyaAI.title}
                  </h3>
                  <p className="text-gray-300 text-center text-sm leading-relaxed mb-4 flex-grow relative z-10">
                    {CT.dashboard.features.chanakyaAI.description}
                  </p>
                  <div className="flex justify-center mt-auto relative z-10">
                    <span className="badge-neon font-medium">
                      {CT.dashboard.features.chanakyaAI.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* MUN World - Neon Card Design */}
              <div className="h-80 group cursor-pointer" onClick={() => requireAuth ? requireAuth(onJoinMUN) : onJoinMUN()}>
                <div className="h-full card-neon p-6 hover:card-neon-glow transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-fuchsia-500/20 to-transparent rounded-bl-3xl"></div>
                  <div className="flex justify-center mb-4 relative z-10">
                    <div className="gradient-neon-secondary p-4 rounded-xl shadow-neon-pink group-hover:scale-110 transition-all duration-300">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-50 mb-3 text-center relative z-10">
                    {CT.dashboard.features.munWorld.title}
                  </h3>
                  <p className="text-gray-300 text-center text-sm leading-relaxed mb-4 flex-grow relative z-10">
                    {CT.dashboard.features.munWorld.description}
                  </p>
                  <div className="flex justify-center mt-auto relative z-10">
                    <span className="badge-neon-pink font-medium">
                      {CT.dashboard.features.munWorld.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Events - Neon Card Design */}
              <div className="h-80 group cursor-pointer" onClick={onViewEvents}>
                <div className="h-full card-neon p-6 hover:card-neon-glow transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-bl-3xl"></div>
                  <div className="flex justify-center mb-4 relative z-10">
                    <div className="gradient-neon-primary p-4 rounded-xl shadow-neon-cyan group-hover:scale-110 transition-all duration-300">
                      <Calendar className="h-8 w-8 text-gray-950" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-50 mb-3 text-center relative z-10">
                    {CT.dashboard.features.events.title}
                  </h3>
                  <p className="text-gray-300 text-center text-sm leading-relaxed mb-4 flex-grow relative z-10">
                    {CT.dashboard.features.events.description}
                  </p>
                  <div className="flex justify-center mt-auto relative z-10">
                    <span className="badge-neon font-medium">
                      {CT.dashboard.features.events.badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* My History - Neon Card Design */}
              <div className="h-80 group cursor-pointer" onClick={() => requireAuth ? requireAuth(onDebateHistory) : onDebateHistory()}>
                <div className="h-full card-neon p-6 hover:card-neon-glow transition-all duration-500 hover:-translate-y-2 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-fuchsia-500/20 to-transparent rounded-bl-3xl"></div>
                  <div className="flex justify-center mb-4 relative z-10">
                    <div className="gradient-neon-secondary p-4 rounded-xl shadow-neon-pink group-hover:scale-110 transition-all duration-300">
                      <History className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-50 mb-3 text-center relative z-10">
                    {CT.dashboard.features.history.title}
                  </h3>
                  <p className="text-gray-300 text-center text-sm leading-relaxed mb-4 flex-grow relative z-10">
                    {CT.dashboard.features.history.description}
                  </p>
                  <div className="flex justify-center mt-auto relative z-10">
                    <span className="badge-neon-pink font-medium">
                      {CT.dashboard.features.history.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Neon Call to Action */}
          <div className="relative overflow-hidden rounded-2xl card-neon-glow">
            <div className="relative z-10 p-12 text-center">
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-50 tracking-tight">
                  Stop talking to your screen. <span className="text-glow-cyan">Start debating with it.</span>
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  Transform from a hesitant speaker to a confident, articulate force. Your future voice starts now.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  
                  {/* 
                  <Button 
                    className="btn-neon-primary text-lg px-8 py-3"
                    onClick={onStartDebate}
                  >
                    Start Speaking Coach
                  </Button>
                   */}
                  <Button 
                    className="btn-neon-secondary text-lg px-8 py-3"
                    onClick={onDebateLive}
                  >
                    Practice Live Debates
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Track & Analyze Section - Only show when authenticated */}
          {isAuthenticated && (
            <div className="space-y-12">
              <div className="text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-50 tracking-tight">
                  Track & Analyze Performance
                </h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Monitor your progress and get insights into your debate performance with advanced analytics
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Debates */}
                <RecentDebatesCard isAuthenticated={isAuthenticated} />

                {/* Freud Analysis */}
                <FreudAnalysisCard isAuthenticated={isAuthenticated} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
