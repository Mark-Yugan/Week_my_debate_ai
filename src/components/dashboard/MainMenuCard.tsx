
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
      color: "bg-azul",
      textColor: "text-white",
      bgColor: "bg-azul",
      items: [
        {
          icon: Zap,
          title: '⚡ Instant Debate',
          description: 'Quick AI debates with Chanakya AI and voice synthesis',
          onClick: onInstantDebate,
          borderColor: 'border-azul',
          bgColor: 'bg-white',
          iconBg: 'bg-azul',
          featured: true,
          accent: 'border-l-4 border-l-azul'
        },
        {
          icon: Brain,
          title: '🧠 AI Coach',
          description: 'Get personalized coaching on speech, grammar, and content analysis',
          onClick: onAICoach,
          borderColor: 'border-steel-blue',
          bgColor: 'bg-white',
          iconBg: 'bg-steel-blue',
          featured: true,
          accent: 'border-l-4 border-l-steel-blue'
        }
      ]
    },
    {
      title: "🎯 Debate Modes",
      description: "Choose your competition style",
      color: "bg-steel-blue",
      textColor: "text-white",
      bgColor: "bg-steel-blue",
      items: [
        {
          icon: Bot,
          title: '🤖 AI Debate',
          description: 'Challenge our fierce AI opponent - Gabbar',
          onClick: onStartDebate,
          borderColor: 'border-gunmetal',
          bgColor: 'bg-white',
          iconBg: 'bg-gunmetal',
          featured: false,
          accent: 'border-l-4 border-l-gunmetal'
        },
        {
          icon: Users,
          title: '⚡ Live Debate',
          description: 'Live debates with real people in any language',
          onClick: onDebateLive,
          borderColor: 'border-indigo-dye',
          bgColor: 'bg-white',
          iconBg: 'bg-indigo-dye',
          featured: false,
          accent: 'border-l-4 border-l-indigo-dye'
        },
        {
          icon: Eye,
          title: '👥 Human vs Human',
          description: 'Debate with real people in live rooms with observer mode',
          onClick: onHumanDebate,
          borderColor: 'border-steel-blue',
          bgColor: 'bg-white',
          iconBg: 'bg-steel-blue',
          featured: false,
          accent: 'border-l-4 border-l-steel-blue'
        },
        {
          icon: Globe,
          title: '🌍 MUN Mode',
          description: 'Model United Nations with Gavel Bro AI moderator',
          onClick: onJoinMUN,
          borderColor: 'border-ruddy-blue',
          bgColor: 'bg-white',
          iconBg: 'bg-ruddy-blue',
          featured: false,
          accent: 'border-l-4 border-l-ruddy-blue'
        }
      ]
    },
    {
      title: "🎭 Activities & Learning",
      description: "Expand your skills",
      color: "bg-ruddy-blue",
      textColor: "text-white",
      bgColor: "bg-ruddy-blue",
      items: [
        {
          icon: Mic,
          title: '🎭 Public Speaking',
          description: 'Group discussions, JAM, Best Manager & more activities',
          onClick: onPublicSpeaking,
          borderColor: 'border-azul',
          bgColor: 'bg-white',
          iconBg: 'bg-azul',
          featured: false,
          accent: 'border-l-4 border-l-azul'
        },
        {
          icon: BookOpen,
          title: '📚 Resources',
          description: 'Rules, techniques, blogs, videos & speech feedback',
          onClick: onResources,
          borderColor: 'border-indigo-dye',
          bgColor: 'bg-white',
          iconBg: 'bg-indigo-dye',
          featured: false,
          accent: 'border-l-4 border-l-indigo-dye'
        },
        {
          icon: Newspaper,
          title: '📰 Debates Hub',
          description: 'Articles, videos, and resources for debate mastery',
          onClick: onDebatesHub,
          borderColor: 'border-steel-blue',
          bgColor: 'bg-white',
          iconBg: 'bg-steel-blue',
          featured: false,
          accent: 'border-l-4 border-l-steel-blue'
        }
      ]
    },
    {
      title: "⚙️ Manage & Track",
      description: "Organize and review",
      color: "bg-gunmetal",
      textColor: "text-white",
      bgColor: "bg-gunmetal",
      items: [
        {
          icon: Settings,
          title: '🏛️ Create Room',
          description: 'Set up custom topics and debate formats',
          onClick: onCreateDebateRoom,
          borderColor: 'border-gunmetal',
          bgColor: 'bg-white',
          iconBg: 'bg-gunmetal',
          featured: false,
          accent: 'border-l-4 border-l-gunmetal'
        },
        {
          icon: History,
          title: '📜 Debate History',
          description: 'View and replay your past debates and conversations',
          onClick: onDebateHistory,
          borderColor: 'border-ruddy-blue',
          bgColor: 'bg-white',
          iconBg: 'bg-ruddy-blue',
          featured: false,
          accent: 'border-l-4 border-l-ruddy-blue'
        },
        {
          icon: Calendar,
          title: '🎪 Events',
          description: 'Recent debates, competitions, and tournaments',
          onClick: onViewEvents,
          borderColor: 'border-azul',
          bgColor: 'bg-white',
          iconBg: 'bg-azul',
          featured: false,
          accent: 'border-l-4 border-l-azul'
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
              <div className={`inline-flex items-center px-6 py-3 rounded-xl ${section.bgColor} border border-neutral-200 shadow-sm`}>
                <h3 className={`text-xl font-semibold ${section.textColor}`}>
                  {section.title}
                </h3>
              </div>
            </div>
            <p className="text-neutral-600 text-sm max-w-md mx-auto">
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
                  group relative overflow-hidden border ${item.borderColor} 
                  ${item.bgColor} hover:shadow-lg transition-all duration-200 cursor-pointer 
                  card-hover-minimal
                  ${item.accent}
                `} 
                onClick={item.onClick}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-6">
                    {/* Icon Container */}
                    <div className={`${item.iconBg} p-4 rounded-xl w-16 h-16 flex items-center justify-center shadow-sm mx-auto`}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute -top-2 -right-2 bg-azul text-white text-xs px-2 py-1 rounded-full font-semibold shadow-sm">
                        <Sparkles className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl text-gunmetal group-hover:text-azul transition-colors duration-200">
                    {item.title}
                  </CardTitle>
                  
                  <CardDescription className="text-neutral-600 group-hover:text-neutral-700 transition-colors duration-200 leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainMenuCard;
