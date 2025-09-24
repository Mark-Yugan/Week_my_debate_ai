// @ts-nocheck
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Users, Trophy, ArrowLeft } from 'lucide-react';
import { useDebateAI } from '@/hooks/useDebateAI';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import VideoConferencePanel from './debate/VideoConferencePanel';
import ConversationPanel from './debate/ConversationPanel';
import CompactScorePanel from './debate/CompactScorePanel';
import VoiceInputButton from './debate/VoiceInputButton';
import FloatingMicrophone from './debate/FloatingMicrophone';

interface DebateRoomProps {
  debateType: 'ai' | '1v1' | 'mun';
  topic: string;
  language?: string;
  onExit: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'deepseek-ai' | 'system';
  text: string;
  timestamp: Date;
  confidence?: number;
  relevance?: string;
  processingTime?: number;
  model?: string;
}

interface Participant {
  id: string;
  name: string;
  isLocal: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  speaking: boolean;
  timeRemaining?: number;
  side?: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
}

interface ScoreData {
  creativity: number;
  fluency: number;
  grammar: number;
  confidence: number;
  overall: number;
}

const DebateRoom = ({ debateType, topic, language = 'en', onExit }: DebateRoomProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'student' | 'opponent'>('student');
  const [assignedSide] = useState<'FOR' | 'AGAINST'>(Math.random() > 0.5 ? 'FOR' : 'AGAINST');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [scores, setScores] = useState<ScoreData>({
    creativity: 75,
    fluency: 82,
    grammar: 88,
    confidence: 79,
    overall: 81
  });

  const debateAI = useDebateAI({
    topic,
    theme: 'General',
    assignedSide
  });

  const deepSeekAI = useDeepSeekAI({
    topic,
    context: `Debate topic: ${topic}, User side: ${assignedSide}`,
    autoSpeak: !isMuted // Only auto-speak if not muted
  });

  // Update the deepSeekAI hook when mute state changes
  useEffect(() => {
    // The hook will automatically update when autoSpeak prop changes
    console.log('Mute state changed:', isMuted);
  }, [isMuted]);

  // Track speaking state from the TTS hook
  useEffect(() => {
    // We need to track when the AI is speaking
    // This will be updated when the AI response is being spoken
    const checkSpeakingState = () => {
      if ('speechSynthesis' in window) {
        const isCurrentlySpeaking = speechSynthesis.speaking;
        if (isCurrentlySpeaking !== isSpeaking) {
          setIsSpeaking(isCurrentlySpeaking);
        }
      }
    };

    // Check speaking state periodically
    const interval = setInterval(checkSpeakingState, 100);
    
    return () => clearInterval(interval);
  }, [isSpeaking]);

  useEffect(() => {
    if (debateType === 'ai' || debateType === '1v1') {
      setParticipants([
        {
          id: 'user',
          name: 'You',
          isLocal: true,
          videoEnabled: true,
          audioEnabled: true,
          speaking: false,
          timeRemaining: 300
        },
        ...(debateType === '1v1' ? [{
          id: 'opponent',
          name: 'Opponent',
          isLocal: false,
          videoEnabled: true,
          audioEnabled: true,
          speaking: false,
          timeRemaining: 300
        }] : [])
      ]);
    } else {
      // Multi-participant setup for MUN
      setParticipants([
        {
          id: 'user',
          name: 'You',
          isLocal: true,
          videoEnabled: true,
          audioEnabled: true,
          speaking: false,
          timeRemaining: 180
        },
        {
          id: 'participant2',
          name: 'Alex Chen',
          isLocal: false,
          videoEnabled: true,
          audioEnabled: true,
          speaking: false,
          timeRemaining: 180
        },
        {
          id: 'participant3',
          name: 'Sarah Williams',
          isLocal: false,
          videoEnabled: false,
          audioEnabled: true,
          speaking: false,
          timeRemaining: 180
        },
        {
          id: 'participant4',
          name: 'Marcus Johnson',
          isLocal: false,
          videoEnabled: true,
          audioEnabled: true,
          speaking: false,
          timeRemaining: 180
        }
      ]);
    }
  }, [debateType]);

  const handleStartRecording = async () => {
    if (isRecording) return;
    
    setIsRecording(true);
    
    // Update participant speaking status
    setParticipants(prev => prev.map(p => 
      p.id === 'user' ? { ...p, speaking: true } : p
    ));

    try {
      const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        
        // Create user message with actual transcript
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          text: transcript,
          timestamp: new Date(),
          confidence: Math.floor(event.results[0][0].confidence * 100)
        };

        setMessages(prev => [userMessage, ...prev]);
        handleStopRecording();

        // Generate AI response based on debate type
        if (debateType === 'ai') {
          // Use only DeepSeek AI - the hook will handle TTS automatically
          const deepSeekResponse = await deepSeekAI.sendToDeepSeek(transcript);
          
          if (deepSeekResponse) {
            const deepSeekMessage: Message = {
              id: (Date.now() + 2).toString(),
              type: 'deepseek-ai',
              text: deepSeekResponse.reply,
              timestamp: new Date(),
              confidence: deepSeekResponse.confidence,
              relevance: deepSeekResponse.relevance,
              processingTime: deepSeekResponse.processingTime,
              model: deepSeekResponse.model
            };

            setTimeout(() => {
              setMessages(prev => [deepSeekMessage, ...prev]);
              // TTS is handled automatically by the useDeepSeekAI hook
            }, 1500);
          }
        }

        // Update scores based on speech
        setScores(prev => ({
          creativity: Math.min(100, prev.creativity + Math.floor(Math.random() * 10 - 2)),
          fluency: Math.min(100, prev.fluency + Math.floor(Math.random() * 8 - 2)),
          grammar: Math.min(100, prev.grammar + Math.floor(Math.random() * 6 - 1)),
          confidence: Math.min(100, prev.confidence + Math.floor(Math.random() * 12 - 3)),
          overall: 0
         }));
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        handleStopRecording();
      };

      recognition.onend = () => {
        handleStopRecording();
      };

      recognition.start();

    } catch (error) {
      console.error('Error starting speech recognition:', error);
      handleStopRecording();
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    // Update participant speaking status
    setParticipants(prev => prev.map(p => 
      p.id === 'user' ? { ...p, speaking: false } : p
    ));
  };

  const handleToggleMute = () => {
    // Stop current speech if speaking
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    deepSeekAI.stopSpeaking();
    setIsSpeaking(false);
    setIsMuted(!isMuted);
    console.log('Mute toggled:', !isMuted);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    deepSeekAI.stopSpeaking();
    setIsSpeaking(false);
    console.log('Speech stopped manually');
  };

  useEffect(() => {
    const overall = Math.round((scores.creativity + scores.fluency + scores.grammar + scores.confidence) / 4);
    setScores(prev => ({ ...prev, overall }));
  }, [scores.creativity, scores.fluency, scores.grammar, scores.confidence]);

  const getDebateTypeLabel = () => {
    switch (debateType) {
      case 'ai': return 'AI Debate';
      case '1v1': return '1v1 Debate';
      case 'mun': return 'MUN Debate';
      default: return 'Debate';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Debate Arena
                </h1>
              </div>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {getDebateTypeLabel()}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {assignedSide}
              </Badge>
              {debateType === 'ai' && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Chanakya AI Enhanced
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Button variant="outline" onClick={onExit} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Exit Room</span>
              </Button>
            </div>
          </div>
          
          {/* Performance Metrics in Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">
                Topic: {topic}
              </p>
            </div>
            
            {/* Compact Performance Metrics */}
            <div className="flex items-center space-x-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Creativity</div>
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{scores.creativity}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Fluency</div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{scores.fluency}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Grammar</div>
                  <div className="text-sm font-bold text-green-600 dark:text-green-400">{scores.grammar}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Confidence</div>
                  <div className="text-sm font-bold text-purple-600 dark:text-purple-400">{scores.confidence}%</div>
                </div>
              </div>
              
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
              
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Overall</div>
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{scores.overall}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-220px)]">
          {/* Left Column - Video Conference Only */}
          <div className="flex flex-col">
            <VideoConferencePanel 
              participants={participants}
              debateType={debateType}
              onToggleVideo={(id) => {
                setParticipants(prev => prev.map(p => 
                  p.id === id ? { ...p, videoEnabled: !p.videoEnabled } : p
                ));
              }}
              onToggleAudio={(id) => {
                setParticipants(prev => prev.map(p => 
                  p.id === id ? { ...p, audioEnabled: !p.audioEnabled } : p
                ));
              }}
            />
          </div>

          {/* Right Column - Conversation Panel Only */}
          <div className="flex flex-col">
            <ConversationPanel 
              messages={messages} 
              showAI={debateType === 'ai'}
            />
          </div>
        </div>
      </div>

      {/* Floating Microphone Button */}
      <FloatingMicrophone
        id="mic-button"
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        disabled={currentSpeaker !== 'student'}
        isDeepSeekProcessing={deepSeekAI.isProcessing}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isSpeaking={isSpeaking}
      />
    </div>
  );
};

export default DebateRoom;
