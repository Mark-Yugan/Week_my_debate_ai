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
    <div className="min-h-screen bg-white relative">
      {/* Floating User Menu - Top Right for Authenticated Users */}
      {isAuthenticated ? (
        <div className="fixed top-6 right-6 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative h-12 w-12 rounded-full bg-gradient-primary hover:bg-gradient-hover shadow-glow hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar_url} className="object-cover" />
                  <AvatarFallback className="bg-white text-black font-bold">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-glow rounded-2xl p-2" align="end" forceMount>
              <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-black">{user?.email || 'User'}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Coins className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{userTokens} tokens</span>
                    </div>
                  </div>
                </div>
              </div>
              <DropdownMenuItem className="rounded-xl hover:bg-gray-50 text-black transition-colors duration-200">
                <Settings className="mr-3 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()} className="rounded-xl hover:bg-red-50 text-red-600 transition-colors duration-200">
                <LogOut className="mr-3 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        /* Floating Auth Pill Card - Top Right for Guests */
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 border border-gray-200 shadow-xl">
            <div className="flex items-center space-x-2">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-6 py-2 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                onClick={() => window.location.href = '/signup'}
              >
                Sign Up
              </Button>
              <Button 
                className="bg-transparent hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300"
                onClick={() => window.location.href = '/login'}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clean Professional Hero Section */}
      <div className="min-h-screen relative overflow-hidden flex flex-col" style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(20, 184, 166, 0.25) 100%)'
      }}>
        {/* Enhanced Highly Visible Professional Background Layer */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.4) 70%, rgba(20, 184, 166, 0.25) 100%)'
        }}></div>
        
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
            
            {/* Professional Brand Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                  <Brain className="h-16 w-16 text-black" />
                </div>
              </div>
            </div>
            
            {/* AI-Powered Header */}
            <div className="space-y-2">
              <p className="text-lg md:text-xl text-gray-600 font-medium tracking-wide uppercase">
                AI-Powered Debate Training
              </p>
            </div>
            
            {/* Professional Brand Name */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">
                <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Mydebate AI
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-teal-500 mx-auto rounded-full"></div>
            </div>
            
            {/* Compelling Tagline */}
            <p className="text-xl md:text-2xl text-black max-w-4xl mx-auto leading-relaxed font-medium">
              {isAuthenticated 
                ? "Master the art of debate with AI-powered coaching and live competitions"
                : "Let Your Debate Skills Rise to Excellence"
              }
            </p>

            {/* Simple Process Flow */}
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto mt-12 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700">Choose Topic</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-teal-600" />
                  <span className="text-sm font-semibold text-gray-700">Select Level</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <Mic className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">Start Debate</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Get AI Feedback</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">View Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Scroll Indicator */}
        <div className="pb-8 flex justify-center relative z-10">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center bg-white/50 backdrop-blur-sm shadow-lg">
              <div className="w-1 h-3 bg-gradient-to-b from-blue-600 to-teal-500 rounded-full mt-2 animate-pulse"></div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                Explore Your Debate Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Discover powerful features designed to elevate your debate skills and connect with a global community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              
              {/* Debate with Chanakya - Modern Card Design */}
              <div className="h-80 group cursor-pointer" onClick={() => requireAuth ? requireAuth(onChanakyaDebate || onInstantDebate) : (onChanakyaDebate ? onChanakyaDebate() : onInstantDebate())}>
                <div className="h-full bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-blue-50/30 flex flex-col relative overflow-hidden">
                  {/* Subtle background gradient matching CTA card */}
                  <div className="absolute inset-0 rounded-xl" style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(20, 184, 166, 0.06) 100%)'
                  }}></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/40 to-transparent rounded-bl-3xl"></div>
                  <div className="flex justify-center mb-4 relative z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 rounded-xl shadow-lg group-hover:shadow-blue-200 group-hover:scale-110 transition-all duration-300">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-3 text-center relative z-10">
                    Debate with Chanakya
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed mb-4 flex-grow relative z-10">
                    Challenge the strategic AI master in instant debates with voice synthesis and advanced reasoning
                  </p>
                  <div className="flex justify-center mt-auto relative z-10">
                    <span className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-4 py-2 rounded-full text-xs font-medium border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-300">
                      AI Powered
                    </span>
                  </div>
                </div>
              </div>

              {/* MUN World - Modern Card Design */}
              <div className="h-80 group cursor-pointer" onClick={() => requireAuth ? requireAuth(onJoinMUN) : onJoinMUN()}>
                <div className="h-full bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-500 hover:-translate-y-2 group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-teal-50/30 flex flex-col relative overflow-hidden">
                  {/* Subtle background gradient matching CTA card */}
                  <div className="absolute inset-0 rounded-xl" style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(20, 184, 166, 0.06) 100%)'
                  }}></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-100/40 to-transparent rounded-bl-3xl"></div>
                  <div className="flex justify-center mb-4 relative z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 rounded-xl shadow-lg group-hover:shadow-teal-200 group-hover:scale-110 transition-all duration-300">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-3 text-center relative z-10">
                    MUN World
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed mb-4 flex-grow relative z-10">
                    Model United Nations simulations with Gavel Bro AI moderator and diplomatic challenges
                  </p>
                  <div className="flex justify-center mt-auto relative z-10">
                    <span className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-4 py-2 rounded-full text-xs font-medium border border-gray-200 group-hover:border-teal-200 group-hover:bg-teal-50 transition-all duration-300">
                      Global Diplomacy
                    </span>
                  </div>
                </div>
              </div>

              {/* Events - Modern Card Design */}
              <div className="h-80 group cursor-pointer" onClick={onViewEvents}>
                <div className="h-full bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-500 hover:-translate-y-2 group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-blue-50/30 flex flex-col relative overflow-hidden">
                  {/* Subtle background gradient matching CTA card */}
                  <div className="absolute inset-0 rounded-xl" style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(20, 184, 166, 0.06) 100%)'
                  }}></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/40 to-transparent rounded-bl-3xl"></div>
                  <div className="flex justify-center mb-4 relative z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 rounded-xl shadow-lg group-hover:shadow-blue-200 group-hover:scale-110 transition-all duration-300">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-3 text-center relative z-10">
                    Events
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed mb-4 flex-grow relative z-10">
                    Discover upcoming debate tournaments, workshops, and community events worldwide
                  </p>
                  <div className="flex justify-center mt-auto relative z-10">
                    <span className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-4 py-2 rounded-full text-xs font-medium border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all duration-300">
                      Live Events
                    </span>
                  </div>
                </div>
              </div>

              {/* My History - Modern Card Design */}
              <div className="h-80 group cursor-pointer" onClick={() => requireAuth ? requireAuth(onDebateHistory) : onDebateHistory()}>
                <div className="h-full bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-200/60 shadow-sm hover:shadow-xl hover:border-teal-200 transition-all duration-500 hover:-translate-y-2 group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-teal-50/30 flex flex-col relative overflow-hidden">
                  {/* Subtle background gradient matching CTA card */}
                  <div className="absolute inset-0 rounded-xl" style={{
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(20, 184, 166, 0.06) 100%)'
                  }}></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-100/40 to-transparent rounded-bl-3xl"></div>
                  <div className="flex justify-center mb-4 relative z-10">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-4 rounded-xl shadow-lg group-hover:shadow-teal-200 group-hover:scale-110 transition-all duration-300">
                      <History className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-3 text-center relative z-10">
                    My History
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed mb-4 flex-grow relative z-10">
                    Review and replay your past debates, track progress and analyze conversation patterns
                  </p>
                  <div className="flex justify-center mt-auto relative z-10">
                    <span className="bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-4 py-2 rounded-full text-xs font-medium border border-gray-200 group-hover:border-teal-200 group-hover:bg-teal-50 transition-all duration-300">
                      Personal Archive
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Track & Analyze Section - Only show when authenticated */}
          {isAuthenticated && (
            <div className="space-y-12">
              <div className="text-center space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                  Track & Analyze Performance
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
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

          {/* Modern Call to Action */}
          <div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
            {/* Subtle background gradient matching hero section */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(20, 184, 166, 0.06) 100%)'
            }}></div>
            
            <div className="relative z-10 p-12 text-center">
              <div className="max-w-4xl mx-auto space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
                  Ready to Start Your Debate Journey?
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Choose from AI debates, live competitions, or MUN simulations to enhance your skills and join a global community of debaters
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-semibold text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-0"
                    onClick={onStartDebate}
                  >
                    Start AI Debate
                  </Button>
                  <Button 
                    className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    onClick={onDebateLive}
                  >
                    Join Live Room
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
