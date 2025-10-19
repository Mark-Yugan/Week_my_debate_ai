import React from 'react';
import { Button } from './ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.js';
import { Badge } from './ui/badge.js';
import { 
  Calendar,
  MapPin,
  Users,
  Trophy,
  DollarSign,
  Clock,
  Info,
  ChevronRight,
  Globe,
  Award,
  ArrowLeft
} from 'lucide-react';

interface EventDetailViewProps {
  event: {
    id: number;
    title: string;
    emoji: string;
    shortDesc: string;
    fullDescription: string;
    date: string;
    venue?: string;
    format?: string;
    participants: string;
    prizes?: string;
    registrationFee: string;
    contact: string;
    gradientColor: string;
    iconBg: string;
    features: string[];
    schedule: Array<{
      time: string;
      event: string;
    }>;
    committees?: string[];
    badges: Array<{
      text: string;
      color: string;
    }>;
    theme: string;
  };
  onBack: () => void;
  onRegister?: (event: any) => void;
}

export default function EventDetailView({ event, onBack, onRegister }: EventDetailViewProps) {
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center font-primary">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-50 mb-4">Event Not Found</h2>
          <p className="text-gray-300 mb-6">The event details could not be loaded.</p>
          <button
            onClick={onBack}
            className="btn-neon-primary flex items-center justify-center"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 font-primary">
      {/* Dark Neon Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(217, 70, 239, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 90%, rgba(34, 211, 238, 0.05) 0%, transparent 50%)
          `
        }}></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-900/80 backdrop-blur-sm">
        {/* Subtle background gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 to-transparent"></div>
        
        {/* Floating Neon Elements - More subtle */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-400/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-400/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16 z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="btn-neon-secondary flex items-center justify-center"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Events
              </button>
            </div>
            <div className="flex items-center gap-3">
              {event.badges.map((badge, index) => (
                <span key={index} className="badge-neon text-cyan-300 border-cyan-400/50 bg-cyan-400/10">
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-start space-x-8">
            <div className="relative">
              <div className="absolute inset-0 gradient-neon-primary rounded-3xl blur-3xl opacity-50 animate-neon-pulse"></div>
              <div className="relative card-neon-glow p-6">
                {event.id === 1 ? <Globe className="h-16 w-16 text-cyan-400" /> : <Award className="h-16 w-16 text-fuchsia-500" />}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-orbitron font-bold leading-tight tracking-wide mb-4">
                <span className="text-2xl mr-3">{event.emoji}</span>
                <span className="neon-text drop-shadow-lg">
                  {event.title}
                </span>
              </h1>
              <p className="text-xl text-gray-200 font-inter font-light leading-relaxed max-w-3xl drop-shadow-md">
                {event.shortDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="card-neon hover:card-neon-glow">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-50">
                  <div className="relative mr-3">
                    <div className="absolute inset-0 gradient-neon-primary rounded-xl blur-xl opacity-30"></div>
                    <div className="relative gradient-neon-primary p-2 rounded-xl shadow-lg">
                      <Info className="h-5 w-5 text-gray-950" />
                    </div>
                  </div>
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed font-light text-lg">
                  {event.fullDescription}
                </p>
              </CardContent>
            </Card>

            {/* Features Section */}
            <div className="card-neon">
              <div className="p-6 border-b border-cyan-400/30">
                <h3 className="text-xl font-bold text-white font-orbitron neon-text">
                  Key Features
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.features.map((feature, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300">
                      <div className="relative mr-3">
                        <ChevronRight className="h-4 w-4 text-cyan-400" />
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div className="card-neon">
              <div className="p-6 border-b border-cyan-400/30">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="absolute inset-0 gradient-neon-primary rounded-xl blur-xl opacity-50"></div>
                    <div className="relative gradient-neon-primary p-2 rounded-xl shadow-neon">
                      <Clock className="h-5 w-5 text-gray-950" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white font-orbitron neon-text">
                    Event Schedule
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300">
                      <div className="btn-neon-primary text-sm font-medium min-w-max px-4 py-2">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300 font-medium">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Committees Section - if available */}
            {event.committees && (
              <div className="card-neon">
                <div className="p-6 border-b border-cyan-400/30">
                  <h3 className="text-xl font-bold text-white font-orbitron neon-text">
                    Committees
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.committees.map((committee, index) => (
                      <div key={index} className="bg-gray-800/50 px-4 py-3 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300">
                        <span className="text-sm font-medium text-gray-300">{committee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-8">
            {/* Event Details Card */}
            <div className="card-neon">
              <div className="p-6 border-b border-cyan-400/30">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="absolute inset-0 gradient-neon-primary rounded-xl blur-xl opacity-50"></div>
                    <div className="relative gradient-neon-primary p-2 rounded-xl shadow-neon">
                      <Info className="h-5 w-5 text-gray-950" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white font-orbitron neon-text">
                    Event Details
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start text-sm p-4 bg-gray-800/50 rounded-lg border border-cyan-400/30">
                  <div className="relative mr-4 mt-1">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-fuchsia-400 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <span className="font-semibold text-white">Date:</span>
                    <p className="text-gray-300 font-light mt-1">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start text-sm p-4 bg-gray-800/50 rounded-lg border border-cyan-400/30">
                  {event.venue ? <MapPin className="h-5 w-5 text-cyan-400 mr-4 mt-1" /> : <Globe className="h-5 w-5 text-cyan-400 mr-4 mt-1" />}
                  <div>
                    <span className="font-semibold text-white">{event.venue ? 'Venue:' : 'Format:'}</span>
                    <p className="text-gray-300 font-light mt-1">{event.venue || event.format}</p>
                  </div>
                </div>
                
                <div className="flex items-start text-sm p-4 bg-gray-800/50 rounded-lg border border-cyan-400/30">
                  <Users className="h-5 w-5 text-cyan-400 mr-4 mt-1" />
                  <div>
                    <span className="font-semibold text-white">Participants:</span>
                    <p className="text-gray-300 font-light mt-1">{event.participants}</p>
                  </div>
                </div>
                
                {event.prizes && (
                  <div className="flex items-start text-sm p-4 bg-gray-800/50 rounded-lg border border-cyan-400/30">
                    <Trophy className="h-5 w-5 text-cyan-400 mr-4 mt-1" />
                    <div>
                      <span className="font-semibold text-white">Prizes:</span>
                      <p className="text-gray-300 font-light mt-1">{event.prizes}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start text-sm p-4 bg-gray-800/50 rounded-lg border border-cyan-400/30">
                  <DollarSign className="h-5 w-5 text-cyan-400 mr-4 mt-1" />
                  <div>
                    <span className="font-semibold text-white">Registration Fee:</span>
                    <p className="text-gray-300 font-light mt-1">{event.registrationFee}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Card */}
            <div className="card-neon">
              <div className="p-6 border-b border-cyan-400/30">
                <h3 className="text-xl font-bold text-white font-orbitron neon-text">
                  Ready to Participate?
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  Join this exciting event and showcase your debate skills!
                </p>
                
                <button 
                  onClick={() => onRegister && onRegister({
                    ...event,
                    price: 200,
                    location: event.venue || event.format,
                    time: "10:00 AM"
                  })}
                  className="btn-neon-primary w-full py-3 text-lg font-bold"
                >
                  Register Now - ₹200
                </button>
                
                <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-cyan-400/30">
                  <p className="text-sm font-semibold text-white mb-2">Contact for Registration:</p>
                  <p className="text-sm text-gray-300 font-light">{event.contact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}