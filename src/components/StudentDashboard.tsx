import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Trophy, TrendingUp, Users, Star, Award, Target, Zap, Brain, Globe, Mic, BookOpen, Bot, Eye, Settings, History, Calendar, Newspaper, Sparkles, ChevronRight, ChevronDown, ChevronUp, Crown } from 'lucide-react';
import MainMenuCard from '@/components/dashboard/MainMenuCard';
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
              {isAuthenticated ? 'Welcome back to' : 'Welcome to'}{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                MyDebate.AI
              </span>
            </h1>
            
            <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
              {isAuthenticated 
                ? "Master the art of debate with AI-powered coaching and live competitions."
                : "Get started with AI-powered debate coaching and join live competitions. Sign in to track your progress and earn tokens."
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="space-y-12">
          
          {/* Main Content Area */}
          <div className="space-y-12">

            {/* Modern Feature Categories */}
            <div className="space-y-10">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                  <h2 className="relative text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 bg-clip-text text-transparent tracking-tight">
                    Explore Your Journey
                  </h2>
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                  Discover powerful features designed to elevate your debate skills to the next level
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {/* Debate with Chanakya */}
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-white hover:shadow-2xl transition-all duration-700 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 shadow-lg backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-400/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                  
                  <CardHeader 
                    className="text-center relative z-10 pb-6 cursor-pointer px-6 pt-8" 
                    onClick={() => requireAuth ? requireAuth(onChanakyaDebate || onInstantDebate) : (onChanakyaDebate ? onChanakyaDebate() : onInstantDebate())}
                  >
                    <div className="relative mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-yellow-500 to-orange-500 p-5 rounded-2xl w-20 h-20 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3">
                        <Brain className="h-9 w-9 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg animate-bounce">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-500 mb-3">
                      🧠 Debate with Chanakya
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-500 text-base leading-relaxed">
                      Challenge the strategic AI master in instant debates with voice synthesis
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* MUN World */}
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-white hover:shadow-2xl transition-all duration-700 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 shadow-lg backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-indigo-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                  
                  <CardHeader 
                    className="text-center relative z-10 pb-6 cursor-pointer px-6 pt-8" 
                    onClick={() => requireAuth ? requireAuth(onJoinMUN) : onJoinMUN()}
                  >
                    <div className="relative mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-purple-500 to-indigo-600 p-5 rounded-2xl w-20 h-20 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3">
                        <Globe className="h-9 w-9 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                        <Crown className="h-3 w-3" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-500 mb-3">
                      🌍 MUN World
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-500 text-base leading-relaxed">
                      Model United Nations simulations with Gavel Bro AI moderator
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Events */}
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-rose-50 via-pink-50 to-white hover:shadow-2xl transition-all duration-700 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 shadow-lg backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 via-pink-400/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                  
                  <CardHeader 
                    className="text-center relative z-10 pb-6 cursor-pointer px-6 pt-8" 
                    onClick={() => requireAuth ? requireAuth(onViewEvents) : onViewEvents()}
                  >
                    <div className="relative mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-rose-500 to-pink-600 p-5 rounded-2xl w-20 h-20 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3">
                        <Calendar className="h-9 w-9 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                        <Star className="h-3 w-3" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-500 mb-3">
                      🎭 Events
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-500 text-base leading-relaxed">
                      Discover upcoming debate tournaments, workshops, and community events
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* My History */}
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-white hover:shadow-2xl transition-all duration-700 cursor-pointer hover:scale-[1.02] hover:-translate-y-1 shadow-lg backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-teal-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                  
                  <CardHeader 
                    className="text-center relative z-10 pb-6 cursor-pointer px-6 pt-8" 
                    onClick={() => requireAuth ? requireAuth(onDebateHistory) : onDebateHistory()}
                  >
                    <div className="relative mx-auto mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-5 rounded-2xl w-20 h-20 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-700 transform group-hover:scale-110 group-hover:rotate-3">
                        <History className="h-9 w-9 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                        <Eye className="h-3 w-3" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-500 mb-3">
                      📜 My History
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-500 text-base leading-relaxed">
                      Review and replay your past debates and conversation history
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Track & Analyze Section - Only show when authenticated */}
            {isAuthenticated && (
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-3">Track & Analyze</h2>
                  <p className="text-lg text-gray-600 font-light">Monitor your progress and get insights into your debate performance</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-none">
                  {/* Recent Debates */}
                  <RecentDebatesCard isAuthenticated={isAuthenticated} />

                  {/* Freud Analysis */}
                  <FreudAnalysisCard isAuthenticated={isAuthenticated} />
                </div>
              </div>
            )}

            {/* Call to Action */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white text-center shadow-2xl">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
              </div>
              
              <CardContent className="relative z-10 p-12">
                <div className="max-w-2xl mx-auto space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Ready to Start Your Debate Journey?</h3>
                  <p className="text-xl text-indigo-100 mb-8 font-light leading-relaxed">
                    Choose from AI debates, live competitions, or MUN simulations to enhance your skills and join a global community of debaters.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => requireAuth ? requireAuth(onStartDebate) : onStartDebate()}
                    >
                      Start AI Debate
                    </Button>
                    <Button 
                      className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => requireAuth ? requireAuth(onDebateLive) : onDebateLive()}
                    >
                      Join Live Room
                    </Button>
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

export default StudentDashboard;
