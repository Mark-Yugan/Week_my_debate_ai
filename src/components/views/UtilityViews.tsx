
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Globe, Users, Trophy, Award, ChevronRight, MapPin, Clock, DollarSign, Info, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import LiveDebateSelection from '@/components/LiveDebateSelection';
import CreateCommittee from '@/components/CreateCommittee';
import PricingPage from '@/components/PricingPage';
import Resources from '@/components/Resources';
import ScoresTokens from '@/components/ScoresTokens';
import PublicSpeakingActivities from '@/components/PublicSpeakingActivities';
import DebatesHub from '@/components/DebatesHub';
import HumanDebateRoom from '@/components/HumanDebateRoom';
import DebateHistoryViewer from '@/components/DebateHistoryViewer';
import DebateDetailView from '../DebateDetailView.js';
import EventDetailView from '../EventDetailView.js';
import InstantDebateSetup from '@/components/InstantDebateSetup';
import InstantDebateRoom from '@/components/InstantDebateRoom';
import ChanakyaDebateSetup from '@/components/ChanakyaDebateSetup';
import ChanakyaDebateRoom from '@/components/ChanakyaDebateRoom';
import AICoach from '@/components/AICoach';
import EventRegistrationModal from '@/components/EventRegistrationModal';
import { ErrorBoundary } from '../ErrorBoundary';

interface UtilityViewsProps {
  currentView: string;
  userTokens: number;
  selectedDebate?: any;
  selectedEvent?: any;
  instantDebateConfig: {
    topic: string;
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    theme?: string;
  } | null;
  chanakyaDebateConfig: {
    topic: string;
    topicType: 'custom' | 'scenario';
    userPosition: 'for' | 'against';
    firstSpeaker: 'user' | 'ai';
    difficulty: 'easy' | 'medium' | 'hard';
    customTopic?: string;
    scenario?: string;
  } | null;
  handlers: {
    handleLiveDebateFormatSelect: (format: '1v1' | '3v3', language: string) => void;
    handleBackToDashboard: () => void;
    handleViewDebate?: (debate: any) => void;
    handleBackToDebateHistory?: () => void;
    handleInstantDebateStart: (config: any) => void;
    handleInstantDebateBack: () => void;
    handleInstantDebateComplete: (config: any, messages: any[]) => void;
    handleChanakyaDebateStart: (config: any) => void;
    handleChanakyaDebateBack: () => void;
    handleChanakyaDebateComplete: (config: any, messages: any[]) => void;
    handleViewEvent?: (event: any) => void;
    handleBackToEvents?: () => void;
  };
}

const UtilityViews = ({ currentView, userTokens, selectedDebate, selectedEvent, instantDebateConfig, chanakyaDebateConfig, handlers }: UtilityViewsProps) => {
  // Registration modal state
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState<any>(null);

  // Event data
  const events = [
    {
      id: 1,
      title: "sym AI MUN",
      emoji: "🤖",
      shortDesc: "AI-powered Model United Nations simulation",
      date: "December 15-17, 2025",
      format: "Virtual + AI Moderated",
      participants: "Open to All Levels",
      status: "Upcoming",
      statusColor: "green",
      theme: "from-blue-50 via-indigo-50 to-white",
      gradientColor: "from-blue-500 to-indigo-600",
      iconBg: "from-blue-500 to-indigo-600",
      badges: [
        { text: "Upcoming", color: "bg-green-100 text-green-800" },
        { text: "AI Powered", color: "bg-blue-100 text-blue-800" }
      ],
      fullDescription: "Experience the future of Model United Nations with AI-powered simulations and intelligent debate assistance. This revolutionary event combines traditional diplomatic training with cutting-edge artificial intelligence to create an immersive learning experience.",
      features: [
        "AI-powered debate moderation",
        "Real-time argument analysis",
        "Virtual diplomatic environment",
        "Interactive policy simulations",
        "Global participant network"
      ],
      schedule: [
        { time: "Dec 15 - 10:00 AM", event: "Opening Ceremony & Registration" },
        { time: "Dec 15 - 2:00 PM", event: "Committee Sessions Begin" },
        { time: "Dec 16 - 9:00 AM", event: "Crisis Committees" },
        { time: "Dec 17 - 3:00 PM", event: "Closing Ceremony & Awards" }
      ],
      prizes: "Certificates and AI Learning Credits",
      registrationFee: "₹200",
      contact: "symaimun@debate.ai"
    },
    {
      id: 2,
      title: "Eswari inter MUN 2025",
      emoji: "🏆",
      shortDesc: "Prestigious inter-college Model United Nations conference",
      date: "January 20-22, 2025",
      venue: "Eswari Engineering College",
      participants: "College Students Only",
      prizes: "₹50,000 Prize Pool",
      status: "Registration Open",
      statusColor: "orange",
      theme: "from-purple-50 via-pink-50 to-white",
      gradientColor: "from-purple-500 to-pink-600",
      iconBg: "from-purple-500 to-pink-600",
      badges: [
        { text: "Registration Open", color: "bg-orange-100 text-orange-800" },
        { text: "Inter-College", color: "bg-purple-100 text-purple-800" }
      ],
      fullDescription: "Join the most prestigious inter-college Model United Nations conference in South India. This three-day event brings together the brightest minds from engineering colleges across the region for intense diplomatic negotiations and policy debates.",
      features: [
        "6 specialized committees",
        "Expert panel discussions",
        "Networking opportunities",
        "Professional development workshops",
        "Industry mentorship sessions"
      ],
      schedule: [
        { time: "Jan 20 - 9:00 AM", event: "Registration & Welcome" },
        { time: "Jan 20 - 11:00 AM", event: "Committee Sessions I" },
        { time: "Jan 21 - 9:00 AM", event: "Crisis Simulation" },
        { time: "Jan 22 - 4:00 PM", event: "Award Ceremony" }
      ],
      committees: [
        "UN Security Council",
        "WHO Emergency Session",
        "G20 Economic Summit",
        "Climate Action Committee",
        "Technology & Innovation Council",
        "Youth Development Forum"
      ],
      registrationFee: "₹200",
      contact: "munregistration@eswari.edu.in"
    }
  ];



  switch (currentView) {
    case 'ai-coach':
      return <AICoach onBack={handlers.handleBackToDashboard} />;
      
    case 'live-debate-selection':
      return (
        <LiveDebateSelection
          onFormatSelect={handlers.handleLiveDebateFormatSelect}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'create-debate-room':
      return <CreateCommittee onBack={handlers.handleBackToDashboard} />;

    case 'events':
      return (
        <>
        <div className="min-h-screen bg-gray-950 relative overflow-hidden">
          {/* Cyberpunk Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-cyan-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            
          
          <div className="relative max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-cyan-400/20 border border-cyan-400/30 rounded-2xl">
                    <Calendar className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold font-orbitron neon-text">
                      Debate Events
                    </h1>
                    <p className="text-gray-300 text-lg font-inter">Discover upcoming tournaments and competitions</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handlers.handleBackToDashboard}
                className="btn-neon-secondary"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
            </div>

            {/* Events Grid */}
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold font-orbitron neon-text">
                  Upcoming Events
                </h2>
                <p className="text-gray-300 text-lg font-inter max-w-2xl mx-auto">
                  Join our vibrant community of debaters in these exciting events
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div key={event.id} className="card-neon group hover:shadow-neon transition-all duration-500 cursor-pointer hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-t-xl"></div>
                    
                    <div className="relative z-10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-cyan-400/20 rounded-xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
                          <div className="relative bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 border border-cyan-400/30 p-3 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                            {event.id === 1 ? <Globe className="h-8 w-8 text-cyan-400" /> : <Award className="h-8 w-8 text-cyan-400" />}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {event.badges.map((badge, index) => (
                            <span key={index} className="badge-neon text-cyan-300 border-cyan-400/50 bg-cyan-400/10 px-3 py-1 text-xs font-medium">
                              {badge.text}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300 mb-3 font-orbitron">
                        {event.emoji} {event.title}
                      </h3>
                      
                      <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm leading-relaxed font-inter">
                        {event.shortDesc}
                      </p>
                    </div>
                    
                    <div className="relative z-10 px-6 pb-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                          <div className="relative mr-3">
                            <Calendar className="h-4 w-4 text-cyan-400" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse"></div>
                          </div>
                          <span className="font-medium">{event.date}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                          {event.venue ? <MapPin className="h-4 w-4 text-cyan-400 mr-3" /> : <Globe className="h-4 w-4 text-cyan-400 mr-3" />}
                          <span className="font-medium">{event.venue || event.format}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handlers.handleViewEvent && handlers.handleViewEvent(event)}
                          className="flex-1 btn-neon-secondary text-sm font-medium"
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Details
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedEventForRegistration({
                              ...event,
                              price: 200,
                              location: event.venue || event.format,
                              time: "10:00 AM"
                            });
                            setRegistrationModalOpen(true);
                          }}
                          className="flex-1 btn-neon-primary text-sm font-medium"
                        >
                          Register ₹200
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <EventRegistrationModal
          isOpen={registrationModalOpen}
          onClose={() => {
            setRegistrationModalOpen(false);
            setSelectedEventForRegistration(null);
          }}
          event={selectedEventForRegistration}
        />
        </>
      );

    case 'debates-hub':
      return <DebatesHub onBack={handlers.handleBackToDashboard} />;

    case 'pricing':
      return <PricingPage onBack={handlers.handleBackToDashboard} />;

    case 'resources':
      return <Resources onBack={handlers.handleBackToDashboard} />;

    case 'scores':
      return <ScoresTokens userTokens={userTokens} onBack={handlers.handleBackToDashboard} />;

    case 'public-speaking':
      return <PublicSpeakingActivities onBack={handlers.handleBackToDashboard} />;

    case 'human-debate':
      return (
        <ErrorBoundary>
          <HumanDebateRoom
            topic="Sample Human Debate Topic"
            onExit={handlers.handleBackToDashboard}
          />
        </ErrorBoundary>
      );

    case 'debate-history':
      return (
        <DebateHistoryViewer
          onBack={handlers.handleBackToDashboard}
          onViewDebate={(debate: any) => {
            if (handlers.handleViewDebate) {
              handlers.handleViewDebate(debate);
            }
          }}
        />
      );

    case 'debate-detail':
      return selectedDebate ? (
        <DebateDetailView
          debate={selectedDebate}
          onBack={() => {
            if (handlers.handleBackToDebateHistory) {
              handlers.handleBackToDebateHistory();
            }
          }}
        />
      ) : null;

    case 'event-detail':
      return (
        <>
          {selectedEvent ? (
            <EventDetailView
              event={selectedEvent}
              onBack={() => {
                if (handlers.handleBackToEvents) {
                  handlers.handleBackToEvents();
                }
              }}
              onRegister={(event) => {
                setSelectedEventForRegistration(event);
                setRegistrationModalOpen(true);
              }}
            />
          ) : (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Event Selected</h2>
                <p className="text-gray-600 mb-6">Please select an event to view details.</p>
                <button
                  onClick={() => handlers.handleBackToEvents && handlers.handleBackToEvents()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Back to Events
                </button>
              </div>
            </div>
          )}
          <EventRegistrationModal
            isOpen={registrationModalOpen}
            onClose={() => {
              setRegistrationModalOpen(false);
              setSelectedEventForRegistration(null);
            }}
            event={selectedEventForRegistration}
          />
        </>
      );

    case 'instant-debate-setup':
      return (
        <InstantDebateSetup
          onStartDebate={(config) => {
            console.log('Starting instant debate with config:', config);
            handlers.handleInstantDebateStart(config);
          }}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'instant-debate-room':
      return (
        <InstantDebateRoom
          config={instantDebateConfig || {
            topic: 'Sample Topic',
            userPosition: 'for',
            firstSpeaker: 'user'
          }}
          onBack={handlers.handleInstantDebateBack}
          onComplete={(config, messages) => {
            console.log('Instant debate completed:', { config, messages });
            handlers.handleInstantDebateComplete(config, messages);
          }}
        />
      );

    case 'chanakya-debate-setup':
      return (
        <ChanakyaDebateSetup
          onStartDebate={(config) => {
            console.log('Starting Chanakya debate with config:', config);
            handlers.handleChanakyaDebateStart(config);
          }}
          onBack={handlers.handleBackToDashboard}
        />
      );

    case 'chanakya-debate-room':
      return (
        <ChanakyaDebateRoom
          config={chanakyaDebateConfig || {
            topic: 'Sample Topic',
            topicType: 'custom',
            userPosition: 'for',
            firstSpeaker: 'user',
            difficulty: 'medium'
          }}
          onBack={handlers.handleChanakyaDebateBack}
          onComplete={(config, messages) => {
            console.log('Chanakya debate completed:', { config, messages });
            handlers.handleChanakyaDebateComplete(config, messages);
          }}
        />
      );

    default:
      return null;
  }
};

export default UtilityViews;
