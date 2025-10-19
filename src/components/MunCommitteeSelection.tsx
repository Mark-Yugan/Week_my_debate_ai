
// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, Globe, MapPin, ArrowLeft, Play, Star, Shield } from 'lucide-react';
import { munCommittees, liveMunSessions, MunCommittee, LiveMunSession } from '@/data/munCommittees';

interface MunCommitteeSelectionProps {
  onCommitteeSelect: (committee: MunCommittee) => void;
  onJoinLiveSession: (session: LiveMunSession) => void;
  onBack: () => void;
}

const MunCommitteeSelection = ({ onCommitteeSelect, onJoinLiveSession, onBack }: MunCommitteeSelectionProps) => {
  const internationalCommittees = munCommittees.filter(c => c.type === 'international');
  const indianCommittees = munCommittees.filter(c => c.type === 'indian');

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-gray-950 to-fuchsia-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={onBack}
              className="btn-neon-secondary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
            
            <div className="text-right">
              <h1 className="text-4xl font-bold font-orbitron neon-text">
                MUN Committees
              </h1>
              <p className="text-gray-300 mt-1 font-inter">Join the global conversation</p>
            </div>
          </div>
        </div>

        {/* Live Sessions */}
        <div className="card-neon bg-gradient-to-br from-emerald-950/30 to-cyan-950/30 border-emerald-400/30">
          <div className="p-6 border-b border-emerald-400/20">
            <h2 className="flex items-center space-x-2 text-emerald-300 font-orbitron text-xl">
              <Clock className="h-5 w-5" />
              <span>🔴 Join Live MUN Sessions</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {liveMunSessions.map((session) => (
                <div key={session.id} className="p-4 bg-gray-800/50 border border-emerald-400/30 rounded-lg hover:border-emerald-400/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-white">{session.committee}</h4>
                    <div className="badge-neon text-emerald-300 border-emerald-400/50 bg-emerald-400/10">Live Soon</div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{session.agenda}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{session.startTime}</span>
                    <span>{session.participants}/{session.maxParticipants} joined</span>
                  </div>
                  <button 
                    className="btn-neon-primary w-full py-2 text-sm"
                    onClick={() => onJoinLiveSession(session)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Join Session
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* International Committees */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Globe className="h-6 w-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white font-orbitron">International Committees</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalCommittees.map((committee) => (
              <div 
                key={committee.id} 
                className="card-neon hover:shadow-neon transition-all cursor-pointer group"
                onClick={() => onCommitteeSelect(committee)}
              >
                <div className="p-6 border-b border-cyan-400/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{committee.name}</h3>
                      <p className="text-sm text-gray-400 font-medium">{committee.fullName}</p>
                    </div>
                    <div className="badge-neon text-cyan-300 border-cyan-400/50 bg-cyan-400/10">
                      {committee.rulesOfProcedure}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-300 mb-4">{committee.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Users className="h-4 w-4 text-cyan-400" />
                      <span>{committee.participants} members</span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-cyan-300">Current Agendas:</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {committee.currentAgendas.slice(0, 2).map((agenda, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Star className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span>{agenda}</span>
                          </li>
                        ))}
                        {committee.currentAgendas.length > 2 && (
                          <li className="flex items-start space-x-2">
                            <Star className="h-3 w-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span>+{committee.currentAgendas.length - 2} more</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indian Parliamentary Committees */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-fuchsia-400" />
            <h2 className="text-2xl font-bold text-white font-orbitron">Indian Parliamentary Committees</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indianCommittees.map((committee) => (
              <div 
                key={committee.id} 
                className="card-neon border-fuchsia-400/30 hover:shadow-neon hover:shadow-fuchsia-400/20 transition-all cursor-pointer group"
                onClick={() => onCommitteeSelect(committee)}
              >
                <div className="p-6 border-b border-fuchsia-400/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">{committee.name}</h3>
                      <p className="text-sm text-gray-400 font-medium">{committee.fullName}</p>
                    </div>
                    <div className="badge-neon text-fuchsia-300 border-fuchsia-400/50 bg-fuchsia-400/10">
                      {committee.rulesOfProcedure}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-300 mb-4">{committee.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Users className="h-4 w-4 text-fuchsia-400" />
                      <span>{committee.participants} seats</span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2 text-fuchsia-300">Current Agendas:</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {committee.currentAgendas.slice(0, 2).map((agenda, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Star className="h-3 w-3 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                            <span>{agenda}</span>
                          </li>
                        ))}
                        {committee.currentAgendas.length > 2 && (
                          <li className="flex items-start space-x-2">
                            <Star className="h-3 w-3 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                            <span>+{committee.currentAgendas.length - 2} more</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunCommitteeSelection;
