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
}

export default function EventDetailView({ event, onBack }: EventDetailViewProps) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${event.gradientColor} text-white`}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center mb-6">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
            <div className="flex items-center gap-2">
              {event.badges.map((badge, index) => (
                <Badge key={index} className={`${badge.color} px-2 py-1 text-xs`}>
                  {badge.text}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className={`bg-white/20 p-4 rounded-xl`}>
              {event.id === 1 ? <Globe className="h-12 w-12" /> : <Award className="h-12 w-12" />}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{event.emoji} {event.title}</h1>
              <p className="text-xl text-white/90">{event.shortDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  About This Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{event.fullDescription}</p>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {event.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <ChevronRight className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Event Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium min-w-max">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Committees Section - if available */}
            {event.committees && (
              <Card>
                <CardHeader>
                  <CardTitle>Committees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.committees.map((committee, index) => (
                      <div key={index} className="bg-gray-50 px-4 py-3 rounded-lg">
                        <span className="text-sm font-medium">{committee}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                  <div>
                    <span className="font-medium">Date:</span>
                    <p className="text-gray-600">{event.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  {event.venue ? <MapPin className="h-4 w-4 mr-3 text-gray-500" /> : <Globe className="h-4 w-4 mr-3 text-gray-500" />}
                  <div>
                    <span className="font-medium">{event.venue ? 'Venue:' : 'Format:'}</span>
                    <p className="text-gray-600">{event.venue || event.format}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-3 text-gray-500" />
                  <div>
                    <span className="font-medium">Participants:</span>
                    <p className="text-gray-600">{event.participants}</p>
                  </div>
                </div>
                
                {event.prizes && (
                  <div className="flex items-center text-sm">
                    <Trophy className="h-4 w-4 mr-3 text-gray-500" />
                    <div>
                      <span className="font-medium">Prizes:</span>
                      <p className="text-gray-600">{event.prizes}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-3 text-gray-500" />
                  <div>
                    <span className="font-medium">Registration Fee:</span>
                    <p className="text-gray-600">{event.registrationFee}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Participate?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Join this exciting event and showcase your debate skills!
                </p>
                
                <Button className={`w-full bg-gradient-to-r ${event.gradientColor} hover:opacity-90 text-white`}>
                  Register Now
                </Button>
                
                <div className="text-xs text-gray-500 text-center">
                  <p className="font-medium">Contact for Registration:</p>
                  <p>{event.contact}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}