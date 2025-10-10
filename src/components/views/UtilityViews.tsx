
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
              <div className="flex items-center justify-between">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white/20 rounded-2xl blur-2xl opacity-50 animate-pulse"></div>
                      <div className="relative bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-2xl">
                        <Calendar className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-5xl font-extralight text-white leading-tight tracking-wide">
                        Debate{' '}
                        <span className="font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                          Events
                        </span>
                      </h1>
                      <p className="text-xl text-blue-100 max-w-3xl font-light leading-relaxed mt-4">
                        Discover upcoming debate tournaments, workshops, and community competitions
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={handlers.handleBackToDashboard}
                  className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 hover:border-white/50 font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-light bg-gradient-to-r from-[#009] via-[#0066cc] to-[#004499] bg-clip-text text-transparent tracking-wide">
                  Upcoming Events
                </h2>
                <p className="text-xl text-gray-700 font-light max-w-2xl mx-auto">
                  Join our vibrant community of debaters in these exciting events
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                  <Card key={event.id} className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 cursor-pointer hover:scale-[1.02] hover:-translate-y-2 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    
                    <CardHeader className="relative z-10 pb-4 px-6 pt-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#009] rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                          <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-3 rounded-xl w-16 h-16 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 transform group-hover:scale-110">
                            {event.id === 1 ? <Globe className="h-8 w-8 text-white" /> : <Award className="h-8 w-8 text-white" />}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {event.badges.map((badge, index) => (
                            <Badge key={index} className="bg-gradient-to-r from-[#009] to-[#0066cc] text-white border-0 px-3 py-1 text-xs font-medium shadow-sm">
                              {badge.text}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300 mb-3">
                        {event.emoji} {event.title}
                      </CardTitle>
                      
                      <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm leading-relaxed font-light">
                        {event.shortDesc}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 px-6 pb-6">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <div className="relative mr-3">
                            <Calendar className="h-4 w-4 text-[#009]" />
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0066cc] rounded-full animate-pulse"></div>
                          </div>
                          <span className="font-medium">{event.date}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          {event.venue ? <MapPin className="h-4 w-4 text-[#009] mr-3" /> : <Globe className="h-4 w-4 text-[#009] mr-3" />}
                          <span className="font-medium">{event.venue || event.format}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handlers.handleViewEvent && handlers.handleViewEvent(event)}
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-sm hover:bg-[#009]/5 hover:border-[#009]/20 hover:text-[#009] transition-all duration-300 font-medium"
                        >
                          <Info className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button 
                          onClick={() => {
                            setSelectedEventForRegistration({
                              ...event,
                              price: 200,
                              location: event.venue || event.format,
                              time: "10:00 AM"
                            });
                            setRegistrationModalOpen(true);
                          }}
                          size="sm" 
                          className="flex-1 bg-gradient-to-r from-[#009] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004499] text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Register ₹200
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
