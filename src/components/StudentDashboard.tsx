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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#009] via-[#0066cc] to-[#004499]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width%3D%22100%22 height%3D%22100%22 viewBox%3D%220 0 100 100%22 xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern id%3D%22grain%22 width%3D%22100%22 height%3D%22100%22 patternUnits%3D%22userSpaceOnUse%22%3E%3Ccircle cx%3D%2250%22 cy%3D%2250%22 r%3D%221%22 fill%3D%22%23ffffff%22 opacity%3D%220.4%22/%3E%3Ccircle cx%3D%2220%22 cy%3D%2220%22 r%3D%220.5%22 fill%3D%22%23ffffff%22 opacity%3D%220.3%22/%3E%3Ccircle cx%3D%2280%22 cy%3D%2230%22 r%3D%220.5%22 fill%3D%22%23ffffff%22 opacity%3D%220.3%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect width%3D%22100%22 height%3D%22100%22 fill%3D%22url(%23grain)%22/%3E%3C/svg%3E')] animate-pulse"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
                  <Brain className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extralight text-white leading-tight tracking-wide">
              {isAuthenticated ? 'Welcome back to' : 'Welcome to'}{' '}
              <span className="font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                MyDebate.AI
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
              {isAuthenticated 
                ? "Master the art of debate with AI-powered coaching and live competitions"
                : "Explore AI-powered debate coaching and competitions. Sign in to unlock personalized features and track your progress"
              }
            </p>
            
            {/* Stats Bar */}
            <div className="flex justify-center mt-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{isAuthenticated ? userTokens : '0'}</div>
                    <div className="text-sm text-blue-100">Tokens</div>
                  </div>
                  <div className="w-px h-8 bg-white/30"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{isAuthenticated ? 'Pro' : 'Guest'}</div>
                    <div className="text-sm text-blue-100">Level</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-16">
          
          {/* Main Content Area */}
          <div className="space-y-16">

            {/* Modern Feature Categories */}
            <div className="space-y-12">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#009] to-[#0066cc] rounded-3xl blur-3xl opacity-15 animate-pulse"></div>
                  <h2 className="relative text-4xl md:text-5xl font-light bg-gradient-to-r from-[#009] via-[#0066cc] to-[#004499] bg-clip-text text-transparent tracking-wide">
                    Explore Your Journey
                  </h2>
                </div>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
                  Discover powerful features designed to elevate your debate skills to the next level
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {/* Debate with Chanakya */}
                <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:-translate-y-2 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  <CardHeader 
                    className="text-center relative z-10 pb-6 cursor-pointer px-8 pt-10" 
                    onClick={() => requireAuth ? requireAuth(onChanakyaDebate || onInstantDebate) : (onChanakyaDebate ? onChanakyaDebate() : onInstantDebate())}
                  >
                    <div className="relative mx-auto mb-8">
                      <div className="absolute inset-0 bg-[#009] rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-6 rounded-2xl w-24 h-24 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-white text-[#009] text-xs px-2 py-1 rounded-full font-semibold shadow-sm border border-gray-200">
                        {isAuthenticated ? 'AI' : '🔒 Login'}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300 mb-3">
                      Debate with Chanakya
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm leading-relaxed font-light">
                      Challenge the strategic AI master in instant debates with voice synthesis
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* MUN World */}
                <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:-translate-y-2 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  <CardHeader 
                    className="text-center relative z-10 pb-6 cursor-pointer px-8 pt-10" 
                    onClick={() => requireAuth ? requireAuth(onJoinMUN) : onJoinMUN()}
                  >
                    <div className="relative mx-auto mb-8">
                      <div className="absolute inset-0 bg-[#009] rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-6 rounded-2xl w-24 h-24 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                        <Globe className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-white text-[#009] text-xs px-2 py-1 rounded-full font-semibold shadow-sm border border-gray-200">
                        {isAuthenticated ? 'MUN' : '🔒 Login'}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300 mb-3">
                      MUN World
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm leading-relaxed font-light">
                      Model United Nations simulations with Gavel Bro AI moderator
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Events */}
                <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:-translate-y-2 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  <CardHeader 
                    className="text-center relative z-10 pb-6 cursor-pointer px-8 pt-10" 
                    onClick={onViewEvents}
                  >
                    <div className="relative mx-auto mb-8">
                      <div className="absolute inset-0 bg-[#009] rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-6 rounded-2xl w-24 h-24 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                        <Calendar className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-white text-[#009] text-xs px-2 py-1 rounded-full font-semibold shadow-sm border border-gray-200">
                        NEW
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300 mb-3">
                      Events
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm leading-relaxed font-light">
                      Discover upcoming debate tournaments, workshops, and community events
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* My History */}
                <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:-translate-y-2 shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  
                  <CardHeader 
                    className="text-center relative z-10 pb-6 cursor-pointer px-8 pt-10" 
                    onClick={() => requireAuth ? requireAuth(onDebateHistory) : onDebateHistory()}
                  >
                    <div className="relative mx-auto mb-8">
                      <div className="absolute inset-0 bg-[#009] rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                      <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-6 rounded-2xl w-24 h-24 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                        <History className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-white text-[#009] text-xs px-2 py-1 rounded-full font-semibold shadow-sm border border-gray-200">
                        {isAuthenticated ? 'LOG' : '🔒 Login'}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300 mb-3">
                      My History
                    </CardTitle>
                    <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm leading-relaxed font-light">
                      Review and replay your past debates and conversation history
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Track & Analyze Section - Only show when authenticated */}
            {isAuthenticated && (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-light bg-gradient-to-r from-[#009] via-[#0066cc] to-[#004499] bg-clip-text text-transparent mb-4 tracking-wide">Track & Analyze</h2>
                  <p className="text-xl text-gray-700 font-light max-w-2xl mx-auto">Monitor your progress and get insights into your debate performance</p>
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
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#009] via-[#0066cc] to-[#004499] text-white text-center shadow-2xl">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#0066cc] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#004499] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#009] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
              </div>
              
              <CardContent className="relative z-10 p-16">
                <div className="max-w-3xl mx-auto space-y-8">
                  <h3 className="text-3xl md:text-4xl font-light mb-6 leading-tight tracking-wide">Ready to Start Your Debate Journey?</h3>
                  <p className="text-xl text-blue-100 mb-10 font-light leading-relaxed">
                    Choose from AI debates, live competitions, or MUN simulations to enhance your skills and join a global community of debaters
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button 
                      className="bg-white text-[#009] hover:bg-gray-50 font-medium px-10 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-white/20"
                      onClick={onStartDebate}
                    >
                      Start AI Debate
                    </Button>
                    <Button 
                      className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 hover:border-white/50 font-medium px-10 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      onClick={onDebateLive}
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
