// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Video, VideoOff, Users, Trophy, ArrowLeft, Send, Type } from 'lucide-react';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { useCreateDebateSession, useAddDebateMessage } from '../hooks/useDebateHistory.js';
import { DebateService } from '../services/DebateService.js';
import VideoConferencePanel from './debate/VideoConferencePanel';
import ConversationPanel from './debate/ConversationPanel';
import CompactScorePanel from './debate/CompactScorePanel';
import VoiceInputButton from './debate/VoiceInputButton';
import FloatingMicrophone from './debate/FloatingMicrophone';

interface ChanakyaDebateConfig {
  topic: string;
  topicType: 'custom' | 'scenario';
  userPosition: 'for' | 'against';
  firstSpeaker: 'user' | 'ai';
  difficulty: 'easy' | 'medium' | 'hard';
  customTopic?: string;
  scenario?: string;
}

interface ChanakyaDebateRoomProps {
  config: ChanakyaDebateConfig;
  onBack: () => void;
  onComplete: (config: ChanakyaDebateConfig, messages: Message[]) => void;
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

const ChanakyaDebateRoom = ({ config, onBack, onComplete }: ChanakyaDebateRoomProps) => {
  // Existing state
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [manualInput, setManualInput] = useState('');
  
  // New debate history state
  const [debateSessionId, setDebateSessionId] = useState<string | null>(null);
  const [turnNumber, setTurnNumber] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Hooks for debate history
  const { createSession } = useCreateDebateSession();
  const { addMessage } = useAddDebateMessage();
  
  const { sendMessage, isLoading: aiLoading, error: aiError } = useDeepSeekAI({
    topic: config.topic,
    userPosition: config.userPosition,
    difficulty: config.difficulty
  });

  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize debate session when component mounts
  useEffect(() => {
    initializeDebateSession();
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  const initializeDebateSession = async () => {
    try {
      const session = await createSession({
        topic: config.topic,
        topic_type: config.topicType,
        user_position: config.userPosition,
        first_speaker: config.firstSpeaker,
        difficulty: config.difficulty,
        metadata: {
          customTopic: config.customTopic,
          scenario: config.scenario
        }
      });

      if (session) {
        setDebateSessionId(session.id);
        setSessionStartTime(new Date());
        
        // Start session timer
        sessionTimerRef.current = setInterval(() => {
          // Timer runs every minute to track session progress
        }, 60000);

        // Initialize participants
        const initialParticipants: Participant[] = [
          {
            id: 'user',
            name: 'You',
            isLocal: true,
            videoEnabled: false,
            audioEnabled: true,
            speaking: false,
            side: config.userPosition === 'for' ? 'FOR' : 'AGAINST',
            timeRemaining: 300
          },
          {
            id: 'chanakya-ai',
            name: 'Chanakya AI',
            isLocal: false,
            videoEnabled: false,
            audioEnabled: true,
            speaking: false,
            side: config.userPosition === 'for' ? 'AGAINST' : 'FOR',
            timeRemaining: 300
          }
        ];
        setParticipants(initialParticipants);

        // Add welcome message
        const welcomeMessage: Message = {
          id: `welcome-${Date.now()}`,
          type: 'system',
          text: `Welcome to your debate with Chanakya AI! Topic: "${config.topic}". You are arguing ${config.userPosition}. ${config.firstSpeaker === 'user' ? 'You will speak first.' : 'Chanakya AI will open the debate.'}`,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);

        // If AI speaks first, get the opening statement
        if (config.firstSpeaker === 'ai' && !hasStarted) {
          setHasStarted(true);
          await handleAIOpeningStatement();
        }
      }
    } catch (error) {
      console.error('Failed to initialize debate session:', error);
    }
  };

  const handleAIOpeningStatement = async () => {
    const nextTurn = turnNumber + 1;
    setTurnNumber(nextTurn);
    
    setIsAISpeaking(true);
    try {
      const result = await sendMessage(
        "Please provide your opening statement for this debate topic.",
        true // isFirstMessage
      );

      if (result?.success && result.reply) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          type: 'deepseek-ai',
          text: result.reply,
          timestamp: new Date(),
          confidence: result.confidence,
          relevance: result.relevance,
          processingTime: result.processingTime,
          model: result.model
        };

        setMessages(prev => [aiMessage, ...prev]);

        // Save to database
        if (debateSessionId) {
          await addMessage({
            debate_session_id: debateSessionId,
            speaker: 'ai',
            message_text: result.reply,
            turn_number: nextTurn,
            processing_time: result.processingTime,
            confidence_score: result.confidence,
            relevance_score: result.relevance as 'high' | 'medium' | 'low',
            message_type: nextTurn === 1 ? 'opening_statement' : 'debate_turn',
            metadata: {
              model: result.model,
              originalQuery: "Please provide your opening statement for this debate topic."
            }
          });
        }
      } else {
        throw new Error(result?.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error getting AI opening statement:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'system',
        text: 'Sorry, there was an issue getting Chanakya AI\'s opening statement. Please try speaking first.',
        timestamp: new Date()
      };
      setMessages(prev => [errorMessage, ...prev]);
    } finally {
      setIsAISpeaking(false);
    }
  };

  const handleUserMessage = async (userText: string) => {
    if (!userText.trim() || isAISpeaking) return;

    const nextTurn = turnNumber + 1;
    setTurnNumber(nextTurn);
    
    if (!hasStarted) {
      setHasStarted(true);
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: userText,
      timestamp: new Date()
    };

    setMessages(prev => [userMessage, ...prev]);

    // Save user message to database
    if (debateSessionId) {
      await addMessage({
        debate_session_id: debateSessionId,
        speaker: 'user',
        message_text: userText,
        turn_number: nextTurn,
        message_type: (!hasStarted && config.firstSpeaker === 'user') ? 'opening_statement' : 'debate_turn',
        metadata: {
          inputMethod: textMode ? 'text' : 'voice'
        }
      });
    }

    // Get AI response
    setIsAISpeaking(true);
    try {
      const result = await sendMessage(userText, !hasStarted && config.firstSpeaker === 'user');

      if (result?.success && result.reply) {
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          type: 'deepseek-ai',
          text: result.reply,
          timestamp: new Date(),
          confidence: result.confidence,
          relevance: result.relevance,
          processingTime: result.processingTime,
          model: result.model
        };

        setMessages(prev => [aiMessage, ...prev]);

        // Save AI response to database
        if (debateSessionId) {
          const aiTurnNumber = nextTurn + 1;
          setTurnNumber(aiTurnNumber);
          
          await addMessage({
            debate_session_id: debateSessionId,
            speaker: 'ai',
            message_text: result.reply,
            turn_number: aiTurnNumber,
            processing_time: result.processingTime,
            confidence_score: result.confidence,
            relevance_score: result.relevance as 'high' | 'medium' | 'low',
            message_type: 'debate_turn',
            metadata: {
              model: result.model,
              userMessage: userText
            }
          });
        }
      } else {
        throw new Error(result?.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'system',
        text: 'Sorry, there was an issue getting Chanakya AI\'s response. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [errorMessage, ...prev]);
    } finally {
      setIsAISpeaking(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    await handleUserMessage(transcript);
  };

  const handleTextSubmit = async () => {
    if (manualInput.trim()) {
      await handleUserMessage(manualInput.trim());
      setManualInput('');
    }
  };

  const handleEndDebate = async () => {
    if (debateSessionId && sessionStartTime) {
      const sessionDuration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
      
      await DebateService.updateSessionStatus(
        debateSessionId, 
        'completed', 
        sessionDuration
      );
    }
    
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
    
    onComplete(config, messages);
  };

  const handleBackToSetup = async () => {
    if (debateSessionId && messages.length > 1) {
      // Mark as abandoned if there were actual debate messages
      const sessionDuration = sessionStartTime 
        ? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000)
        : 0;
      
      await DebateService.updateSessionStatus(
        debateSessionId, 
        'abandoned', 
        sessionDuration
      );
    }
    
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }
    
    onBack();
  };

  // Rest of the component remains the same as the original implementation
  // (including all the UI rendering logic)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToSetup}
                className="text-gray-300 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Setup
              </Button>
              
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">Chanakya AI Debate</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-purple-300 border-purple-400">
                Turn {turnNumber}
              </Badge>
              <Badge variant={hasStarted ? "default" : "secondary"}>
                {hasStarted ? "Active" : "Waiting"}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTextMode(!textMode)}
                className="text-gray-300 border-gray-600 hover:text-white"
              >
                <Type className="h-4 w-4 mr-2" />
                {textMode ? 'Voice Mode' : 'Text Mode'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Video Conference */}
          <div className="lg:col-span-1">
            <VideoConferencePanel
              participants={participants}
              onParticipantUpdate={setParticipants}
              isUserSpeaking={isUserSpeaking}
              isAISpeaking={isAISpeaking}
            />
          </div>

          {/* Center Column - Conversation */}
          <div className="lg:col-span-2 space-y-4">
            <ConversationPanel 
              messages={messages}
              config={config}
              isLoading={aiLoading}
              error={aiError}
            />
            
            {/* Input Area */}
            <Card className="bg-gray-800/50 border-gray-700">
              <div className="p-4">
                {textMode ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Type your argument here..."
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleTextSubmit();
                        }
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Press Enter to send, Shift+Enter for new line
                      </span>
                      <Button 
                        onClick={handleTextSubmit}
                        disabled={!manualInput.trim() || isAISpeaking}
                        size="sm"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <VoiceInputButton
                      onTranscript={handleVoiceInput}
                      disabled={isAISpeaking}
                      isRecording={isUserSpeaking}
                      onRecordingChange={setIsUserSpeaking}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - Scores and Controls */}
          <div className="lg:col-span-1">
            <CompactScorePanel
              config={config}
              messages={messages}
              onEndDebate={handleEndDebate}
              turnNumber={turnNumber}
              sessionId={debateSessionId}
            />
          </div>
        </div>
      </div>

      {/* Floating Microphone for voice mode */}
      {!textMode && (
        <FloatingMicrophone
          isRecording={isUserSpeaking}
          onStart={() => setIsUserSpeaking(true)}
          onStop={() => setIsUserSpeaking(false)}
          onTranscript={handleVoiceInput}
          disabled={isAISpeaking}
        />
      )}
    </div>
  );
};

export default ChanakyaDebateRoom;
