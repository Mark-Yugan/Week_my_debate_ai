
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Users, Settings, Calendar, BookOpen, Zap, Crown, Globe, Newspaper, Eye, History, Sparkles, Target, Mic, Brain, Award } from 'lucide-react';

interface MainMenuCardProps {
  onStartDebate: () => void;
  onDebateLive: () => void;
  onJoinMUN: () => void;
  onCreateDebateRoom: () => void;
  onViewEvents: () => void;
  onResources: () => void;
  onPublicSpeaking: () => void;
  onDebatesHub: () => void;
  onHumanDebate: () => void;
  onDebateHistory: () => void;
  onInstantDebate: () => void;
  onAICoach: () => void;
}

const MainMenuCard = ({ 
  onStartDebate, 
  onDebateLive,
  onJoinMUN,
  onCreateDebateRoom, 
  onViewEvents, 
  onResources,
  onPublicSpeaking,
  onDebatesHub,
  onHumanDebate,
  onDebateHistory,
  onInstantDebate,
  onAICoach
}: MainMenuCardProps) => {
  // Organize menu items into logical sections
  const sections = [
    {
      title: "🚀 Quick Start",
      description: "Jump right into debating",
      color: "from-yellow-500 to-orange-500",
      textColor: "text-yellow-900",
      bgColor: "from-yellow-50 to-orange-50",
      items: [
        {
          icon: Zap,
          title: '⚡ Instant Debate',
          description: 'Quick AI debates with Chanakya AI and voice synthesis',
          onClick: onInstantDebate,
          borderColor: 'border-yellow-300',
          bgGradient: 'from-yellow-50 via-orange-50 to-white',
          iconBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          featured: true,
          glow: 'shadow-yellow-500/20',
          hoverGlow: 'hover:shadow-yellow-500/30'
        },
        {
          icon: Brain,
          title: '🧠 AI Coach',
          description: 'Get personalized coaching on speech, grammar, and content analysis',
          onClick: onAICoach,
          borderColor: 'border-emerald-300',
          bgGradient: 'from-emerald-50 via-teal-50 to-white',
          iconBg: 'bg-gradient-to-r from-emerald-500 to-teal-500',
          featured: true,
          glow: 'shadow-emerald-500/20',
          hoverGlow: 'hover:shadow-emerald-500/30'
        }
      ]
    },
    {
      title: "🎯 Debate Modes",
      description: "Choose your competition style",
      color: "from-indigo-500 to-blue-500",
      textColor: "text-indigo-900",
      bgColor: "from-indigo-50 to-blue-50",
      items: [
        {
          icon: Bot,
          title: '🤖 AI Debate',
          description: 'Challenge our fierce AI opponent - Gabbar',
          onClick: onStartDebate,
          borderColor: 'border-gray-300',
          bgGradient: 'from-gray-50 via-slate-50 to-white',
          iconBg: 'bg-gradient-to-r from-gray-700 to-gray-900',
          featured: false,
          glow: 'shadow-gray-500/20',
          hoverGlow: 'hover:shadow-gray-500/30'
        },
        {
          icon: Users,
          title: '⚡ Live Debate',
          description: 'Live debates with real people in any language',
          onClick: onDebateLive,
          borderColor: 'border-indigo-300',
          bgGradient: 'from-indigo-50 via-blue-50 to-white',
          iconBg: 'bg-gradient-to-r from-indigo-500 to-blue-500',
          featured: false,
          glow: 'shadow-indigo-500/20',
          hoverGlow: 'hover:shadow-indigo-500/30'
        },
        {
          icon: Eye,
          title: '👥 Human vs Human',
          description: 'Debate with real people in live rooms with observer mode',
          onClick: onHumanDebate,
          borderColor: 'border-green-300',
          bgGradient: 'from-green-50 via-emerald-50 to-white',
          iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          featured: false,
          glow: 'shadow-green-500/20',
          hoverGlow: 'hover:shadow-green-500/30'
        },
        {
          icon: Globe,
          title: '🌍 MUN Mode',
          description: 'Model United Nations with Gavel Bro AI moderator',
          onClick: onJoinMUN,
          borderColor: 'border-purple-300',
          bgGradient: 'from-purple-50 via-indigo-50 to-white',
          iconBg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
          featured: false,
          glow: 'shadow-purple-500/20',
          hoverGlow: 'hover:shadow-purple-500/30'
        }
      ]
    },
    {
      title: "🎭 Activities & Learning",
      description: "Expand your skills",
      color: "from-purple-500 to-pink-500",
      textColor: "text-purple-900",
      bgColor: "from-purple-50 to-pink-50",
      items: [
        {
          icon: Mic,
          title: '🎭 Public Speaking',
          description: 'Group discussions, JAM, Best Manager & more activities',
          onClick: onPublicSpeaking,
          borderColor: 'border-pink-300',
          bgGradient: 'from-pink-50 via-purple-50 to-white',
          iconBg: 'bg-gradient-to-r from-indigo-400 to-purple-400',
          featured: false,
          glow: 'shadow-pink-500/20',
          hoverGlow: 'hover:shadow-pink-500/30'
        },
        {
          icon: BookOpen,
          title: '📚 Resources',
          description: 'Rules, techniques, blogs, videos & speech feedback',
          onClick: onResources,
          borderColor: 'border-violet-300',
          bgGradient: 'from-violet-50 via-purple-50 to-white',
          iconBg: 'bg-gradient-to-r from-indigo-600 to-purple-600',
          featured: false,
          glow: 'shadow-violet-500/20',
          hoverGlow: 'hover:shadow-violet-500/30'
        },
        {
          icon: Newspaper,
          title: '📰 Debates Hub',
          description: 'Articles, videos, and resources for debate mastery',
          onClick: onDebatesHub,
          borderColor: 'border-blue-300',
          bgGradient: 'from-blue-50 via-indigo-50 to-white',
          iconBg: 'bg-gradient-to-r from-indigo-500 to-blue-500',
          featured: false,
          glow: 'shadow-blue-500/20',
          hoverGlow: 'hover:shadow-blue-500/30'
        }
      ]
    },
    {
      title: "⚙️ Manage & Track",
      description: "Organize and review",
      color: "from-teal-500 to-cyan-500",
      textColor: "text-teal-900",
      bgColor: "from-teal-50 to-cyan-50",
      items: [
        {
          icon: Settings,
          title: '🏛️ Create Room',
          description: 'Set up custom topics and debate formats',
          onClick: onCreateDebateRoom,
          borderColor: 'border-teal-300',
          bgGradient: 'from-teal-50 via-cyan-50 to-white',
          iconBg: 'bg-gradient-to-r from-teal-500 to-cyan-500',
          featured: false,
          glow: 'shadow-teal-500/20',
          hoverGlow: 'hover:shadow-teal-500/30'
        },
        {
          icon: History,
          title: '📜 Debate History',
          description: 'View and replay your past debates and conversations',
          onClick: onDebateHistory,
          borderColor: 'border-purple-300',
          bgGradient: 'from-purple-50 via-indigo-50 to-white',
          iconBg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
          featured: false,
          glow: 'shadow-purple-500/20',
          hoverGlow: 'hover:shadow-purple-500/30'
        },
        {
          icon: Calendar,
          title: '🎪 Events',
          description: 'Recent debates, competitions, and tournaments',
          onClick: onViewEvents,
          borderColor: 'border-cyan-300',
          bgGradient: 'from-cyan-50 via-blue-50 to-white',
          iconBg: 'bg-gradient-to-r from-indigo-500 to-cyan-500',
          featured: false,
          glow: 'shadow-cyan-500/20',
          hoverGlow: 'hover:shadow-cyan-500/30'
        }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-6">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className={`inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r ${section.bgColor} border border-gray-200 shadow-sm`}>
                <h3 className={`text-xl font-bold ${section.textColor}`}>
                  {section.title}
                </h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              {section.description}
            </p>
          </div>

          {/* Section Cards */}
          <div className={`grid gap-6 ${
            section.items.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
            section.items.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {section.items.map((item, index) => (
              <Card 
                key={index}
                className={`
                  group relative overflow-hidden border-2 ${item.borderColor} 
                  bg-gradient-to-br ${item.bgGradient} 
                  hover:shadow-2xl transition-all duration-500 cursor-pointer 
                  hover:border-opacity-60 hover:scale-105 hover:-translate-y-2
                  ${item.featured ? 'ring-2 ring-yellow-300 ring-opacity-50 animate-pulse' : ''}
                  ${item.glow} ${item.hoverGlow}
                  backdrop-blur-sm
                `} 
                onClick={item.onClick}
              >
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.iconBg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full"></div>
                
                <CardHeader className="text-center relative z-10">
                  <div className="relative mx-auto mb-6">
                    {/* Icon Background Glow */}
                    <div className={`absolute inset-0 ${item.iconBg} rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                    
                    {/* Icon Container */}
                    <div className={`relative ${item.iconBg} p-4 rounded-full w-16 h-16 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                    {item.title}
                  </CardTitle>
                  
                  <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                
                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainMenuCard;
