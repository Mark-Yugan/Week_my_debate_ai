// @ts-nocheck
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Mic, 
  MicOff, 
  Users, 
  Clock,
  Flag,
  Gavel,
  MessageSquare,
  AlertTriangle,
  Globe,
  Vote,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { MunCommittee, LiveMunSession } from '@/data/munCommittees';

interface MunArenaProps {
  committee?: MunCommittee;
  liveSession?: LiveMunSession;
  onExit: () => void;
  onBackToCommittees: () => void;
}

const MunArena = ({ committee, liveSession, onExit, onBackToCommittees }: MunArenaProps) => {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [isInSpeakerQueue, setIsInSpeakerQueue] = useState(false);
  const [currentMode, setCurrentMode] = useState<'general' | 'moderated' | 'unmoderated'>('general');
  const [micStatus, setMicStatus] = useState(false);

  // Update countries based on committee type
  const getCountriesForCommittee = () => {
    if (committee?.type === 'indian') {
      return [
        { name: 'BJP', delegate: 'You', status: 'active', avatar: '🇮🇳' },
        { name: 'INC', delegate: 'Rahul G.', status: 'speaking', avatar: '✋' },
        { name: 'AAP', delegate: 'Arvind K.', status: 'active', avatar: '🧹' },
        { name: 'TMC', delegate: 'Mamata B.', status: 'queued', avatar: '🌿' },
        { name: 'DMK', delegate: 'Stalin M.', status: 'active', avatar: '☀️' },
        { name: 'SP', delegate: 'Akhilesh Y.', status: 'active', avatar: '🚲' },
        { name: 'BSP', delegate: 'Mayawati', status: 'inactive', avatar: '🐘' },
        { name: 'BJD', delegate: 'Naveen P.', status: 'active', avatar: '🦌' },
      ];
    }
    
    return [
      { name: 'United States', delegate: 'You', status: 'active', avatar: '🇺🇸' },
      { name: 'United Kingdom', delegate: 'Sarah M.', status: 'speaking', avatar: '🇬🇧' },
      { name: 'China', delegate: 'Wei L.', status: 'active', avatar: '🇨🇳' },
      { name: 'Germany', delegate: 'Hans K.', status: 'queued', avatar: '🇩🇪' },
      { name: 'France', delegate: 'Marie D.', status: 'active', avatar: '🇫🇷' },
      { name: 'Japan', delegate: 'Akira T.', status: 'active', avatar: '🇯🇵' },
      { name: 'Brazil', delegate: 'Carlos R.', status: 'inactive', avatar: '🇧🇷' },
      { name: 'Russia', delegate: 'Dimitri V.', status: 'active', avatar: '🇷🇺' },
    ];
  };

  const countries = getCountriesForCommittee();

  const speakerQueue = [
    { country: 'United Kingdom', delegate: 'Sarah M.', timeRemaining: 180 },
    { country: 'Germany', delegate: 'Hans K.', timeRemaining: 180 },
    { country: 'China', delegate: 'Wei L.', timeRemaining: 180 },
  ];

  const getCurrentAgenda = () => {
    if (liveSession) return liveSession.agenda;
    if (committee) return committee.currentAgendas[0];
    return 'Climate Change Mitigation Strategies';
  };

  const getCommitteeTitle = () => {
    if (liveSession) return `${liveSession.committee} Live Session`;
    if (committee) return `${committee.name} Simulation`;
    return 'MUN General Assembly';
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-gray-950 to-fuchsia-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto p-6 space-y-6 relative z-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={onBackToCommittees}
              className="btn-neon-secondary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Committees
            </button>
            
            <div className="text-right">
              <h1 className="text-4xl font-bold font-orbitron neon-text">
                {getCommitteeTitle()}
              </h1>
              <p className="text-gray-300 mt-1 font-inter">{getCurrentAgenda()}</p>
              {committee && (
                <p className="text-sm text-gray-400">{committee.fullName} • {committee.rulesOfProcedure} Rules</p>
              )}
            </div>
          </div>
          
          {/* Status Badges */}
          <div className="flex justify-end items-center space-x-3">
            {liveSession && (
              <div className="badge-neon text-red-300 border-red-400/50 bg-red-400/10">
                🔴 Live Session
              </div>
            )}
            <div className="badge-neon text-emerald-300 border-emerald-400/50 bg-emerald-400/10">
              Session Active
            </div>
            <button 
              onClick={onExit}
              className="btn-neon-secondary"
            >
              Exit Session
            </button>
          </div>
        </div>

        {/* Crisis Alert - Updated for committee */}
        <div className="card-neon border-orange-400/30 bg-gradient-to-r from-orange-950/30 to-red-950/30">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-orange-400" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-300 font-orbitron">
                  {committee?.type === 'indian' 
                    ? 'Breaking: Opposition walks out over digital privacy concerns' 
                    : 'Breaking: Economic Sanctions Announced'
                  }
                </h3>
                <p className="text-sm text-orange-200">
                  {committee?.type === 'indian'
                    ? 'Parliament session disrupted. Delegates must address privacy vs security balance.'
                    : 'Major economic sanctions have been imposed affecting global trade relations. Delegates must adjust their positions accordingly.'
                  }
                </p>
              </div>
              <div className="badge-neon text-red-300 border-red-400/50 bg-red-400/10">
                {committee?.type === 'indian' ? 'Parliamentary Alert' : 'Crisis Update'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Country/Party Seats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-neon">
              <div className="p-6 border-b border-cyan-400/20">
                <h3 className="flex items-center space-x-2 text-cyan-300 font-orbitron text-lg">
                  <Globe className="h-5 w-5" />
                  <span>{committee?.type === 'indian' ? 'Party Seats' : 'Delegate Seats'}</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {countries.map((country, index) => (
                    <div
                      key={index}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        country.name === selectedCountry
                          ? 'border-cyan-400 bg-cyan-400/20 shadow-neon'
                          : country.status === 'speaking'
                          ? 'border-emerald-400 bg-emerald-400/20'
                          : country.status === 'queued'
                          ? 'border-amber-400 bg-amber-400/20'
                          : country.status === 'inactive'
                          ? 'border-gray-600 bg-gray-800/30'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                      }`}
                      onClick={() => setSelectedCountry(country.name)}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{country.avatar}</div>
                        <div className="text-xs font-medium text-white truncate">
                          {country.name}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {country.delegate}
                        </div>
                        <div className="mt-1">
                          <div
                            className={`badge-neon text-xs ${
                              country.status === 'speaking'
                                ? 'text-emerald-300 border-emerald-400/50 bg-emerald-400/10'
                                : country.status === 'queued'
                                ? 'text-amber-300 border-amber-400/50 bg-amber-400/10'
                                : country.status === 'inactive'
                                ? 'text-gray-400 border-gray-500/50 bg-gray-500/10'
                                : 'text-cyan-300 border-cyan-400/50 bg-cyan-400/10'
                            }`}
                          >
                            {country.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Agenda/Resolution */}
            <div className="card-neon">
              <div className="p-6 border-b border-fuchsia-400/20">
                <h3 className="flex items-center space-x-2 text-fuchsia-300 font-orbitron text-lg">
                  <FileText className="h-5 w-5" />
                  <span>{committee?.type === 'indian' ? 'Current Bill' : 'Current Resolution'}</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-white">{getCurrentAgenda()}</h4>
                        <p className="text-sm text-gray-400">
                          {committee?.type === 'indian' ? 'Bill No. 2024/001' : 'Resolution A/78/123'}
                        </p>
                      </div>
                      <div className="badge-neon text-blue-300 border-blue-400/50 bg-blue-400/10">Under Discussion</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div className="text-center">
                        <div className="text-lg font-bold text-emerald-400">12</div>
                        <div className="text-xs text-gray-400">In Favor</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">3</div>
                        <div className="text-xs text-gray-400">Against</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-amber-400">2</div>
                        <div className="text-xs text-gray-400">Abstain</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Controls */}
            {/* Session Controls */}
            <div className="card-neon">
              <div className="p-6 border-b border-amber-400/20">
                <h3 className="flex items-center space-x-2 text-amber-300 font-orbitron text-lg">
                  <Gavel className="h-5 w-5" />
                  <span>Session Controls</span>
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                      currentMode === 'general' 
                        ? 'btn-neon-primary' 
                        : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-300'
                    }`}
                    onClick={() => setCurrentMode('general')}
                  >
                    General
                  </button>
                  <button
                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                      currentMode === 'moderated' 
                        ? 'btn-neon-primary' 
                        : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-300'
                    }`}
                    onClick={() => setCurrentMode('moderated')}
                  >
                    Moderated
                  </button>
                  <button
                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                      currentMode === 'unmoderated' 
                        ? 'btn-neon-primary' 
                        : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400/50 hover:text-cyan-300'
                    }`}
                    onClick={() => setCurrentMode('unmoderated')}
                  >
                    Unmoderated
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-all flex items-center justify-center gap-2 ${
                      micStatus 
                        ? 'bg-red-500/20 border-red-400 text-red-300 hover:bg-red-500/30' 
                        : 'btn-neon-primary'
                    }`}
                    onClick={() => setMicStatus(!micStatus)}
                  >
                    {micStatus ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    {micStatus ? 'Mute' : 'Unmute'}
                  </button>
                  
                  <button
                    className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-all flex items-center justify-center gap-2 ${
                      isInSpeakerQueue 
                        ? 'btn-neon-secondary' 
                        : 'btn-neon-primary'
                    }`}
                    onClick={() => setIsInSpeakerQueue(!isInSpeakerQueue)}
                  >
                    <Users className="h-4 w-4" />
                    {isInSpeakerQueue ? 'Leave Queue' : 'Join Queue'}
                  </button>
                </div>

                <button className="w-full btn-neon-secondary py-2 flex items-center justify-center gap-2">
                  <Vote className="h-4 w-4" />
                  Cast Vote
                </button>
              </div>
            </div>

            {/* Speaker Queue */}
            <div className="card-neon">
              <div className="p-6 border-b border-emerald-400/20">
                <h3 className="flex items-center space-x-2 text-emerald-300 font-orbitron text-lg">
                  <MessageSquare className="h-5 w-5" />
                  <span>Speaker Queue</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {speakerQueue.map((speaker, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center border border-cyan-400/50">
                          <span className="text-sm font-medium text-cyan-300">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">{speaker.country}</p>
                          <p className="text-xs text-gray-400">{speaker.delegate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">3:00</span>
                    </div>
                  </div>
                ))}
                
                {isInSpeakerQueue && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-700">{speakerQueue.length + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-blue-900">{selectedCountry}</p>
                        <p className="text-xs text-blue-700">You</p>
                      </div>
                    </div>
                    <div className="badge-neon text-blue-300 border-blue-400/50 bg-blue-400/10">
                      Queued
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* Country Position */}
            <div className="card-neon">
              <div className="p-6 border-b border-red-400/20">
                <h3 className="flex items-center space-x-2 text-red-300 font-orbitron text-lg">
                  <Flag className="h-5 w-5" />
                  <span>Your Position</span>
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-400/30">
                    <h4 className="font-medium text-blue-300 mb-1">
                      {committee?.type === 'indian' ? `Representing: ${selectedCountry} Party` : `Representing: ${selectedCountry}`}
                    </h4>
                    <p className="text-sm text-blue-200">
                      {committee?.type === 'indian' 
                        ? `As a ${selectedCountry} representative, you advocate for transparent digital governance while ensuring citizen privacy protection and constitutional rights.`
                        : `As the delegate for ${selectedCountry}, you support innovative climate solutions while maintaining economic stability and international cooperation.`
                      }
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-white">Key Talking Points:</h5>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {committee?.type === 'indian' ? (
                        <>
                          <li>• Data protection and privacy rights</li>
                          <li>• Digital infrastructure development</li>
                          <li>• Cybersecurity framework</li>
                          <li>• Constitutional compliance</li>
                        </>
                      ) : (
                        <>
                          <li>• Technology transfer for developing nations</li>
                          <li>• Carbon pricing mechanisms</li>
                          <li>• Green energy investment frameworks</li>
                          <li>• Climate adaptation funding</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunArena;
