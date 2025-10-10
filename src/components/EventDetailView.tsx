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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event details could not be loaded.</p>
          <button
            onClick={onBack}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 hover:border-white/50 font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Events
              </Button>
            </div>
            <div className="flex items-center gap-3">
              {event.badges.map((badge, index) => (
                <Badge key={index} className="bg-white/15 backdrop-blur-lg text-white border border-white/20 px-4 py-2 text-sm font-medium shadow-sm">
                  {badge.text}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-start space-x-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-3xl blur-3xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white/15 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
                {event.id === 1 ? <Globe className="h-16 w-16 text-white" /> : <Award className="h-16 w-16 text-white" />}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-extralight text-white leading-tight tracking-wide mb-4">
                {event.emoji}{' '}
                <span className="font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  {event.title}
                </span>
              </h1>
              <p className="text-2xl text-blue-100 font-light leading-relaxed max-w-3xl">
                {event.shortDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <CardHeader className="relative z-10 pb-6">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300">
                  <div className="relative mr-3">
                    <div className="absolute inset-0 bg-[#009] rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-500">
                      <Info className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed font-light text-lg">
                  {event.fullDescription}
                </p>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <CardHeader className="relative z-10 pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300">
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.features.map((feature, index) => (
                    <div key={index} className="flex items-center p-3 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-[#009]/5 hover:to-[#0066cc]/5 hover:border-[#009]/20 transition-all duration-300">
                      <div className="relative mr-3">
                        <ChevronRight className="h-4 w-4 text-[#009]" />
                        <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#0066cc] rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Section */}
            <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <CardHeader className="relative z-10 pb-6">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300">
                  <div className="relative mr-3">
                    <div className="absolute inset-0 bg-[#009] rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-500">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  Event Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="group/item flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-[#009]/5 hover:to-[#0066cc]/5 hover:border-[#009]/20 transition-all duration-300 last:border-b-0">
                      <div className="bg-gradient-to-r from-[#009] to-[#0066cc] text-white px-4 py-2 rounded-xl text-sm font-medium min-w-max shadow-sm group-hover/item:shadow-md transition-all duration-300">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 group-hover/item:text-[#009] font-medium transition-colors duration-300">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Committees Section - if available */}
            {event.committees && (
              <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                <CardHeader className="relative z-10 pb-6">
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300">
                    Committees
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.committees.map((committee, index) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 hover:bg-gradient-to-r hover:from-[#009]/5 hover:to-[#0066cc]/5 hover:border-[#009]/20 transition-all duration-300">
                        <span className="text-sm font-medium text-gray-700">{committee}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-8">
            {/* Event Details Card */}
            <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#009]/5 via-[#0066cc]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              
              <CardHeader className="relative z-10 pb-6">
                <CardTitle className="flex items-center text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300">
                  <div className="relative mr-3">
                    <div className="absolute inset-0 bg-[#009] rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-all duration-500"></div>
                    <div className="relative bg-gradient-to-br from-[#009] to-[#0066cc] p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-500">
                      <Info className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                <div className="flex items-start text-sm p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
                  <div className="relative mr-4 mt-1">
                    <Calendar className="h-5 w-5 text-[#009]" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0066cc] rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">Date:</span>
                    <p className="text-gray-600 font-light mt-1">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start text-sm p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
                  {event.venue ? <MapPin className="h-5 w-5 text-[#009] mr-4 mt-1" /> : <Globe className="h-5 w-5 text-[#009] mr-4 mt-1" />}
                  <div>
                    <span className="font-semibold text-gray-800">{event.venue ? 'Venue:' : 'Format:'}</span>
                    <p className="text-gray-600 font-light mt-1">{event.venue || event.format}</p>
                  </div>
                </div>
                
                <div className="flex items-start text-sm p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
                  <Users className="h-5 w-5 text-[#009] mr-4 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-800">Participants:</span>
                    <p className="text-gray-600 font-light mt-1">{event.participants}</p>
                  </div>
                </div>
                
                {event.prizes && (
                  <div className="flex items-start text-sm p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
                    <Trophy className="h-5 w-5 text-[#009] mr-4 mt-1" />
                    <div>
                      <span className="font-semibold text-gray-800">Prizes:</span>
                      <p className="text-gray-600 font-light mt-1">{event.prizes}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start text-sm p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
                  <DollarSign className="h-5 w-5 text-[#009] mr-4 mt-1" />
                  <div>
                    <span className="font-semibold text-gray-800">Registration Fee:</span>
                    <p className="text-gray-600 font-light mt-1">{event.registrationFee}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Card */}
            <Card className="group relative overflow-hidden border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl hover:shadow-[#009]/10 transition-all duration-500 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-[#009]/10 via-[#0066cc]/10 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009] to-[#0066cc]"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-[#009] transition-colors duration-300">
                  Ready to Participate?
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Join this exciting event and showcase your debate skills!
                </p>
                
                <Button 
                  onClick={() => onRegister && onRegister({
                    ...event,
                    price: 200,
                    location: event.venue || event.format,
                    time: "10:00 AM"
                  })}
                  className="w-full bg-gradient-to-r from-[#009] to-[#0066cc] hover:from-[#0066cc] hover:to-[#004499] text-white font-medium py-3 text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Register Now - ₹200</span>
                </Button>
                
                <div className="text-center p-4 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm rounded-xl border border-gray-200/50">
                  <p className="text-sm font-semibold text-gray-800 mb-2">Contact for Registration:</p>
                  <p className="text-sm text-gray-600 font-light">{event.contact}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}