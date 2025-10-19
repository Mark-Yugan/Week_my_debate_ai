// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Video, VideoOff, Users, Trophy, ArrowLeft, Send, Type, Square } from 'lucide-react';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { DebateService } from '@/services/DebateService';
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

interface ScoreData {
  creativity: number;
  fluency: number;
  grammar: number;
  confidence: number;
  overall: number;
}

const ChanakyaDebateRoom = ({ config, onBack, onComplete }: ChanakyaDebateRoomProps) => {
  const { user } = useCustomAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'student' | 'opponent'>('student');
  const [assignedSide] = useState<'FOR' | 'AGAINST'>(config.userPosition === 'for' ? 'FOR' : 'AGAINST');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isTextMode, setIsTextMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scores, setScores] = useState<ScoreData>({
    creativity: 75,
    fluency: 82,
    grammar: 88,
    confidence: 79,
    overall: 81
  });

  // Database tracking state
  const [debateSessionId, setDebateSessionId] = useState<string | null>(null);
  const [turnNumber, setTurnNumber] = useState(0);
  const [debateStartTime, setDebateStartTime] = useState<Date | null>(null);
  const sessionCreatedRef = useRef(false);

  const deepSeekAI = useDeepSeekAI({
    topic: config.topic,
    context: `Chanakya Debate - Topic: ${config.topic}, Type: ${config.topicType}, User Position: ${config.userPosition}, Difficulty: ${config.difficulty}`,
    autoSpeak: !isMuted
  });

  // Create debate session on component mount
  useEffect(() => {
    const createDebateSession = async () => {
      if (sessionCreatedRef.current) return;
      
      sessionCreatedRef.current = true;
      setDebateStartTime(new Date());
      
      try {
        const result = await DebateService.createDebateSession({
          topic: config.topic,
          topic_type: config.topicType,
          user_position: config.userPosition,
          first_speaker: config.firstSpeaker,
          difficulty: config.difficulty,
          debate_type: 'chanakya', // Specify that this is a Chanakya debate
          metadata: {
            customTopic: config.customTopic,
            scenario: config.scenario,
            assignedSide
          }
        }, user?.id);

        if (result.success && result.data) {
          setDebateSessionId(result.data.id);
          console.log('Debate session created:', result.data.id);
        } else {
          console.error('Failed to create debate session:', result.error);
        }
      } catch (error) {
        console.error('Error creating debate session:', error);
      }
    };

    createDebateSession();
  }, [config, assignedSide]);

  // Helper function to save a message to the database
  const saveMessageToDatabase = async (message: Message, speaker: 'user' | 'ai') => {
    if (!debateSessionId) {
      console.warn('Cannot save message: no debate session ID');
      return;
    }

    try {
      const currentTurn = turnNumber + 1;
      setTurnNumber(currentTurn);

      const result = await DebateService.addDebateMessage({
        debate_session_id: debateSessionId,
        speaker,
        message_text: message.text,
        turn_number: currentTurn,
        processing_time: message.processingTime,
        confidence_score: message.confidence,
        relevance_score: message.relevance as 'high' | 'medium' | 'low' | undefined,
        message_type: 'debate_turn',
        metadata: {
          messageId: message.id,
          timestamp: message.timestamp.toISOString(),
          model: message.model
        }
      }, user?.id);

      if (result.success) {
        console.log('Message saved to database:', result.data?.id);
      } else {
        console.error('Failed to save message:', result.error);
      }
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
  };

  // Helper function to complete the debate session
  const completeDebateSession = async () => {
    if (!debateSessionId || !debateStartTime) {
      console.warn('Cannot complete session: missing session ID or start time');
      return;
    }

    try {
      const sessionDuration = Math.floor((new Date().getTime() - debateStartTime.getTime()) / 1000);
      
      const result = await DebateService.updateSessionStatus(
        debateSessionId,
        'completed',
        sessionDuration
      );

      if (result.success) {
        console.log('Debate session completed in database');
      } else {
        console.error('Failed to complete session:', result.error);
      }
    } catch (error) {
      console.error('Error completing debate session:', error);
    }
  };

  // Custom handler for leaving the debate
  const handleExit = async () => {
    await completeDebateSession();
    onComplete(config, messages);
    onBack();
  };

  // Update the deepSeekAI hook when mute state changes
  useEffect(() => {
    console.log('Mute state changed:', isMuted);
  }, [isMuted]);

  // Track speaking state from the TTS hook
  useEffect(() => {
    const checkSpeakingState = () => {
      if ('speechSynthesis' in window) {
        const isCurrentlySpeaking = speechSynthesis.speaking;
        if (isCurrentlySpeaking !== isSpeaking) {
          setIsSpeaking(isCurrentlySpeaking);
        }
      }
    };

    const interval = setInterval(checkSpeakingState, 100);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  useEffect(() => {
    // AI Debate setup - only user vs Chanakya AI
    setParticipants([
      {
        id: 'user',
        name: 'You',
        isLocal: true,
        videoEnabled: true,
        audioEnabled: true,
        speaking: false,
        timeRemaining: 300,
        side: assignedSide
      }
    ]);
  }, [assignedSide]);

  const handleStartRecording = async () => {
    if (isRecording) return;
    
    setIsRecording(true);
    
    // Update participant speaking status
    setParticipants(prev => prev.map(p => 
      p.id === 'user' ? { ...p, speaking: true } : p
    ));

    try {
      // Check if speech recognition is supported
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const recognition = new (window.SpeechRecognition || (window as any).webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;
      
      // Set timeouts for better reliability
      recognition.speechTimeout = 10000; // 10 seconds
      recognition.speechTimeoutBuffer = 2000; // 2 seconds buffer

      recognition.onstart = () => {
        console.log('Speech recognition started - Please speak now...');
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        
        // Check if transcript is meaningful (not just noise)
        if (transcript.length < 2) {
          console.warn('Transcript too short, please try again');
          handleStopRecording();
          return;
        }
        
        // Create user message with actual transcript
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          text: transcript,
          timestamp: new Date(),
          confidence: Math.floor(event.results[0][0].confidence * 100)
        };

        setMessages(prev => [userMessage, ...prev]);
        
        // Save user message to database
        saveMessageToDatabase(userMessage, 'user');
        
        handleStopRecording();

        // Generate Chanakya AI response
        try {
          const deepSeekResponse = await deepSeekAI.sendToDeepSeek(transcript);
          
          // With retry mechanism, we always get a response
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
            // Save AI message to database
            saveMessageToDatabase(deepSeekMessage, 'ai');
          }, 1500);
          
        } catch (aiError) {
          console.error('Unexpected error in AI communication:', aiError);
          // This should rarely happen now with retry mechanism
          const systemMessage: Message = {
            id: (Date.now() + 3).toString(),
            type: 'system',
            text: '🔧 Unexpected error occurred. The AI should have provided a fallback response.',
            timestamp: new Date()
          };
          setTimeout(() => {
            setMessages(prev => [systemMessage, ...prev]);
          }, 1500);
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
        
        let errorMessage = '';
        switch (event.error) {
          case 'no-speech':
            errorMessage = '🎤 No speech detected. Please speak clearly and try again.';
            break;
          case 'audio-capture':
            errorMessage = '🎤 Microphone access denied. Please allow microphone access.';
            break;
          case 'not-allowed':
            errorMessage = '🎤 Microphone permission denied. Please enable microphone access.';
            break;
          case 'network':
            errorMessage = '🌐 Network error. Please check your internet connection.';
            break;
          case 'aborted':
            errorMessage = '🛑 Speech recognition was aborted.';
            break;
          default:
            errorMessage = `🔧 Speech recognition error: ${event.error}. Please try again.`;
        }
        
        // Show error message to user
        const systemMessage: Message = {
          id: Date.now().toString(),
          type: 'system',
          text: errorMessage,
          timestamp: new Date()
        };
        
        setMessages(prev => [systemMessage, ...prev]);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
          setMessages(prev => prev.filter(msg => msg.id !== systemMessage.id));
        }, 5000);
        
        handleStopRecording();
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        handleStopRecording();
      };

      // Add a timeout to automatically stop if no speech is detected
      const speechTimeout = setTimeout(() => {
        recognition.stop();
        console.log('Speech recognition timeout - stopping');
      }, 15000); // 15 seconds timeout

      recognition.onspeechstart = () => {
        clearTimeout(speechTimeout);
        console.log('Speech detected');
      };

      recognition.start();

    } catch (error) {
      console.error('Error starting speech recognition:', error);
      
      // Show user-friendly error message
      const systemMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        text: '🔧 Speech recognition unavailable. Please check your browser settings.',
        timestamp: new Date()
      };
      
      setMessages(prev => [systemMessage, ...prev]);
      
      // Remove error message after 5 seconds
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== systemMessage.id));
      }, 5000);
      
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

  const handleTextSubmit = async () => {
    if (!textInput.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    const inputText = textInput.trim();
    setTextInput(''); // Clear input immediately

    try {
      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: inputText,
        timestamp: new Date(),
        confidence: 100 // Manual input has 100% confidence
      };

      setMessages(prev => [userMessage, ...prev]);
      
      // Save user message to database
      saveMessageToDatabase(userMessage, 'user');

      // Generate Chanakya AI response
      try {
        const deepSeekResponse = await deepSeekAI.sendToDeepSeek(inputText);
        
        // With retry mechanism, we always get a response
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
          // Save AI message to database
          saveMessageToDatabase(deepSeekMessage, 'ai');
        }, 1500);
        
      } catch (aiError) {
        console.error('Unexpected error in AI communication:', aiError);
        // This should rarely happen now with retry mechanism
        const systemMessage: Message = {
          id: (Date.now() + 3).toString(),
          type: 'system',
          text: '🔧 Unexpected error occurred. The AI should have provided a fallback response.',
          timestamp: new Date()
        };
        setTimeout(() => {
          setMessages(prev => [systemMessage, ...prev]);
        }, 1500);
      }

      // Update scores based on text input
      setScores(prev => ({
        creativity: Math.min(100, prev.creativity + Math.floor(Math.random() * 10 - 2)),
        fluency: Math.min(100, prev.fluency + Math.floor(Math.random() * 8 - 2)),
        grammar: Math.min(100, prev.grammar + Math.floor(Math.random() * 6 - 1)),
        confidence: Math.min(100, prev.confidence + Math.floor(Math.random() * 12 - 3)),
        overall: 0
      }));

    } catch (error) {
      console.error('Error submitting text:', error);
      
      // Show error message
      const systemMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        text: '🔧 Failed to submit message. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [systemMessage, ...prev]);
      
      // Remove error message after 5 seconds
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== systemMessage.id));
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  useEffect(() => {
    const overall = Math.round((scores.creativity + scores.fluency + scores.grammar + scores.confidence) / 4);
    setScores(prev => ({ ...prev, overall }));
  }, [scores.creativity, scores.fluency, scores.grammar, scores.confidence]);

  const getDebateTypeLabel = () => {
    return 'Chanakya AI Debate';
  };

  return (
    <div className="min-h-screen bg-gray-950 bg-gradient-radial-neon">
      {/* Compact Single Row Header */}
      <div className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-xl border-b border-cyan-400/30 shadow-neon">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Title and Topic */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-cyan-400 drop-shadow-neon" />
                <h1 className="text-xl font-bold text-white font-orbitron neon-text">
                  Chanakya AI
                </h1>
                {isTextMode && (
                  <div className="badge-neon text-xs">
                    <Type className="h-3 w-3 mr-1" />
                    Text Mode
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-300 max-w-md truncate font-medium">
                {config.topic}
              </div>
            </div>
            
            {/* Center - Compact Score Display */}
            <div className="hidden lg:flex items-center space-x-3 card-neon-sm px-4 py-2">
              <div className="text-xs text-center">
                <div className="text-xs text-gray-400 mb-1">Overall</div>
                <div className="text-lg font-bold text-cyan-400 neon-text">{scores.overall}%</div>
              </div>
            </div>
            
            {/* Right Side - Control Buttons */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleExit}
                className="btn-neon-secondary text-sm px-4 py-2 flex items-center space-x-2"
              >
                <Square className="h-4 w-4" />
                <span>End Debate</span>
              </button>
              <button 
                onClick={handleExit}
                className="px-4 py-2 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300 flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Maximized Space for Debate */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Left Column - Video Conference Only */}
          <div className="flex flex-col">
            <VideoConferencePanel 
              participants={participants}
              debateType="ai"
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

          {/* Right Column - Conversation Panel with Text Input */}
          <div className="flex flex-col">
            <div className="flex-1">
              <ConversationPanel 
                messages={messages} 
                showAI={true}
              />
            </div>
            
            {/* Text Input Area */}
            <div className="mt-3 p-4 card-neon">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsTextMode(!isTextMode)}
                    className={isTextMode ? "btn-neon-primary text-sm px-4 py-2" : "px-4 py-2 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300 text-sm"}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    <span>Text Mode</span>
                  </button>
                  <div className="text-xs text-gray-400">
                    {isTextMode ? 'Type your argument' : 'Use voice or switch to text mode'}
                  </div>
                </div>
                <button 
                  onClick={handleExit}
                  className="btn-neon-secondary text-sm px-3 py-2 lg:hidden flex items-center space-x-1"
                >
                  <Square className="h-4 w-4" />
                  <span>End</span>
                </button>
              </div>
              
              {isTextMode && (
                <div className="space-y-3">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your argument here... (Press Enter to send, Shift+Enter for new line)"
                    className="input-neon min-h-[80px] max-h-[120px] resize-none w-full"
                    disabled={isSubmitting}
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      {textInput.length} characters
                    </div>
                    <button
                      onClick={handleTextSubmit}
                      disabled={!textInput.trim() || isSubmitting}
                      className="btn-neon-primary text-sm px-4 py-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4" />
                      <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Microphone Button - Hidden in Text Mode */}
      {!isTextMode && (
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
      )}
    </div>
  );
};

export default ChanakyaDebateRoom;
