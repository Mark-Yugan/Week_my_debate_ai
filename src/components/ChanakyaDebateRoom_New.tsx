// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mic, 
  MicOff, 
  MessageSquare, 
  Bot, 
  User, 
  Send, 
  Brain, 
  Zap, 
  ArrowLeft, 
  Volume2, 
  VolumeX,
  Crown,
  Shield,
  Target,
  AlertCircle,
  Trophy,
  Users,
  CheckCircle,
  Sparkles,
  Radio,
  Video,
  VideoOff
} from 'lucide-react';

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
  onComplete: (config: ChanakyaDebateConfig, messages: DebateMessage[]) => void;
}

interface DebateMessage {
  id: string;
  speaker: 'user' | 'ai' | 'system';
  text: string;
  timestamp: Date;
  side: 'for' | 'against' | 'neutral';
  confidence?: number;
  relevance?: string;
  processingTime?: number;
  model?: string;
  metadata?: {
    responseType?: string;
    strategicApproach?: string;
    contextAwareness?: string;
  };
}

interface Participant {
  id: string;
  name: string;
  isLocal: boolean;
  videoEnabled: boolean;
  audioEnabled: boolean;
  speaking: boolean;
  timeRemaining?: number;
  side?: 'FOR' | 'AGAINST' | 'OBSERVER';
}

interface ScoreData {
  creativity: number;
  fluency: number;
  grammar: number;
  confidence: number;
  overall: number;
}

const ChanakyaDebateRoom = ({ config, onBack, onComplete }: ChanakyaDebateRoomProps) => {
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [debateStarted, setDebateStarted] = useState(false);
  const [contextWarnings, setContextWarnings] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [currentSpeaker, setCurrentSpeaker] = useState<'student' | 'opponent'>('student');
  const [assignedSide] = useState<'FOR' | 'AGAINST'>(config.userPosition === 'for' ? 'FOR' : 'AGAINST');
  const [participants, setParticipants] = useState<Participant[]>([
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
  const [scores, setScores] = useState<ScoreData>({
    creativity: 75,
    fluency: 82,
    grammar: 88,
    confidence: 79,
    overall: 81
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Enhanced scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // Update scores periodically
  useEffect(() => {
    const overall = Math.round((scores.creativity + scores.fluency + scores.grammar + scores.confidence) / 4);
    setScores(prev => ({ ...prev, overall }));
  }, [scores.creativity, scores.fluency, scores.grammar, scores.confidence]);

  const startDebate = async () => {
    setDebateStarted(true);
    if (config.firstSpeaker === 'ai') {
      await generateAIResponse(true);
    }
  };

  const generateAIResponse = async (isFirstMessage = false) => {
    setIsAIResponding(true);
    
    try {
      const lastUserMessage = messages.filter(m => m.speaker === 'user').pop();
      
      // Prepare enhanced context for Chanakya AI
      const contextPayload = {
        speechText: lastUserMessage?.text || `Let's debate about ${config.topic}. I am arguing ${config.userPosition} this topic.`,
        topic: config.topic,
        topicType: config.topicType,
        userPosition: config.userPosition,
        difficulty: config.difficulty,
        isFirstMessage,
        messageCount: messages.length,
        turnCount
      };
      
      const response = await fetch('https://n8n-k6lq.onrender.com/webhook/deepseekapihandler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          speechText: contextPayload.speechText,
          topic: contextPayload.topic,
          topicType: contextPayload.topicType,
          userPosition: contextPayload.userPosition,
          difficulty: contextPayload.difficulty,
          isFirstMessage: contextPayload.isFirstMessage,
          messageCount: contextPayload.messageCount,
          turnCount: contextPayload.turnCount
        })
      });

      if (!response.ok) {
        throw new Error(`Chanakya AI service unavailable: ${response.status} ${response.statusText}`);
      }

      // Check if response has content
      const responseText = await response.text();
      if (!responseText) {
        throw new Error('Empty response from Chanakya AI service');
      }

      let aiResponse;
      try {
        aiResponse = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        console.error('Response Text:', responseText);
        throw new Error('Invalid JSON response from Chanakya AI service');
      }
      
      // Handle both response formats: 
      // 1. New Chanakya format: {success: true, reply: "text", ...}
      // 2. Old DeepSeek format: {choices: [{message: {content: "text"}}]}
      let aiReplyText = '';
      let confidence = 75;
      let relevance = 'high';
      
      if (aiResponse.success && aiResponse.reply) {
        // New Chanakya format
        aiReplyText = aiResponse.reply;
        confidence = aiResponse.confidence || 75;
        relevance = aiResponse.relevance || 'high';
      } else if (aiResponse.choices && aiResponse.choices[0] && aiResponse.choices[0].message) {
        // Old OpenAI format
        aiReplyText = aiResponse.choices[0].message.content;
        confidence = aiResponse.choices[0].finish_reason === 'stop' ? 95 : 75;
      } else if (aiResponse.data?.reply || aiResponse.reply) {
        // Old DeepSeek webhook format
        aiReplyText = aiResponse.data?.reply || aiResponse.reply;
      } else {
        throw new Error('Unexpected response format from Chanakya AI service');
      }

      if (!aiReplyText || aiReplyText.trim() === '') {
        throw new Error('Empty AI response received');
      }

      const aiMessage: DebateMessage = {
        id: Date.now().toString(),
        speaker: 'ai',
        text: aiReplyText.trim(),
        timestamp: new Date(),
        side: config.userPosition === 'for' ? 'against' : 'for',
        confidence,
        relevance,
        processingTime: aiResponse.processingTime || 0,
        model: aiResponse.model || 'chanakya-ai-enhanced',
        metadata: aiResponse.metadata || {
          responseType: 'debate_argument',
          strategicApproach: 'chanakya_methodology',
          contextAwareness: 'high'
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      setTurnCount(prev => prev + 1);

      // Check for context warnings
      if (aiMessage.relevance === 'medium' || aiMessage.relevance === 'low') {
        setContextWarnings(prev => [...prev, 'Chanakya noticed you might be going off-topic']);
      }

      // Auto-speak the response if not muted
      if (!isMuted && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiMessage.text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        setSpeakingMessageId(aiMessage.id);
        
        utterance.onend = () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
        };
      }
    } catch (error) {
      console.error('Error generating Chanakya AI response:', error);
      
      // Show error message to user
      let errorText = 'Chanakya AI is temporarily unavailable.';
      if (error instanceof Error) {
        if (error.message.includes('JSON')) {
          errorText = 'Chanakya AI response format error. Please try again.';
        } else if (error.message.includes('Empty')) {
          errorText = 'Chanakya AI returned an empty response. Please try again.';
        } else if (error.message.includes('503') || error.message.includes('502')) {
          errorText = 'Chanakya AI service is temporarily down. Please try again later.';
        } else if (error.message.includes('404')) {
          errorText = 'Chanakya AI service endpoint not found. Please contact support.';
        }
      }
      
      // Show error message in chat temporarily
      const errorMessage: DebateMessage = {
        id: Date.now().toString(),
        speaker: 'system',
        text: `⚠️ ${errorText}`,
        timestamp: new Date(),
        side: 'neutral',
        confidence: 0,
        model: 'system-error'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Remove error message after 5 seconds and add fallback
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== errorMessage.id));
        
        // Enhanced fallback response
        const fallbackMessage: DebateMessage = {
          id: Date.now().toString(),
          speaker: 'ai',
          text: `I appreciate your perspective on ${config.topic}. However, I must challenge your viewpoint with strategic reasoning. Every argument has multiple dimensions that deserve examination.`,
          timestamp: new Date(),
          side: config.userPosition === 'for' ? 'against' : 'for',
          confidence: 70,
          model: 'chanakya-fallback'
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }, 5000);
    } finally {
      setIsAIResponding(false);
    }
  };

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
        const userMessage: DebateMessage = {
          id: Date.now().toString(),
          speaker: 'user',
          text: transcript,
          timestamp: new Date(),
          side: config.userPosition,
          confidence: Math.floor(event.results[0][0].confidence * 100)
        };

        setMessages(prev => [...prev, userMessage]);
        handleStopRecording();

        // Generate AI response
        await generateAIResponse(false);

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
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    setIsMuted(!isMuted);
    console.log('Mute toggled:', !isMuted);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    console.log('Speech stopped manually');
  };

  const getMessageIcon = (speaker: string, side: string) => {
    if (speaker === 'user') {
      return <User className="h-4 w-4" />;
    } else if (speaker === 'system') {
      return <AlertCircle className="h-4 w-4" />;
    } else {
      return (
        <div className="flex items-center space-x-1">
          <Crown className="h-4 w-4" />
          <Sparkles className="h-4 w-4" />
        </div>
      );
    }
  };

  const getMessageStyles = (speaker: string, side: string) => {
    if (speaker === 'user') {
      return `max-w-[85%] rounded-2xl px-5 py-4 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg`;
    } else if (speaker === 'system') {
      return `max-w-[70%] rounded-xl px-3 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-900 border border-orange-200 text-center`;
    } else {
      return `max-w-[85%] rounded-2xl px-5 py-4 bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-xl border-2 border-purple-400`;
    }
  };

  const getMessageLabel = (speaker: string) => {
    switch (speaker) {
      case 'user':
        return 'You';
      case 'system':
        return 'System';
      case 'ai':
        return 'Chanakya AI';
      default:
        return 'System';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDebateTypeLabel = () => {
    return 'Chanakya AI Debate';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Chanakya Debate Arena
                </h1>
              </div>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {getDebateTypeLabel()}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {assignedSide}
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Chanakya AI Enhanced
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </span>
              </div>
              <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Exit Room</span>
              </Button>
            </div>
          </div>
          
          {/* Performance Metrics in Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">
                Topic: {config.topic}
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
          {/* Left Column - Video Conference Panel */}
          <div className="flex flex-col">
            <Card className="flex-1 card-shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-indigo-600" />
                  <span>Debate Participants</span>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                    Live Video
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-6">
                <div className="grid grid-cols-1 gap-4 h-full">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden aspect-video shadow-lg ${
                        participant.speaking ? 'ring-4 ring-indigo-400 ring-opacity-75' : ''
                      }`}
                    >
                      {/* Video Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {participant.videoEnabled ? (
                          <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center">
                            <User className="h-12 w-12 text-white" />
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                            <VideoOff className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Participant Controls Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-white text-sm font-medium">
                              {participant.name}
                            </span>
                            {participant.side && (
                              <Badge className={`text-xs ${
                                participant.side === 'FOR' 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-red-500 text-white'
                              }`}>
                                {participant.side}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {participant.timeRemaining && (
                              <span className="text-xs text-gray-300">
                                {Math.floor(participant.timeRemaining / 60)}:{(participant.timeRemaining % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                            
                            <div className="flex space-x-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                participant.audioEnabled 
                                  ? 'bg-green-500' 
                                  : 'bg-red-500'
                              }`}>
                                {participant.audioEnabled ? (
                                  <Mic className="h-3 w-3 text-white" />
                                ) : (
                                  <MicOff className="h-3 w-3 text-white" />
                                )}
                              </div>
                              
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                participant.videoEnabled 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-500'
                              }`}>
                                {participant.videoEnabled ? (
                                  <Video className="h-3 w-3 text-white" />
                                ) : (
                                  <VideoOff className="h-3 w-3 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Speaking Indicator */}
                      {participant.speaking && (
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                            <Radio className="h-3 w-3" />
                            <span>Speaking</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Conversation Panel */}
          <div className="flex flex-col">
            <Card className="flex-1 card-shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                  <span>Live Conversation</span>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs">
                    Real-time STT
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                    AI Enabled
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                    Chanakya AI Ready
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px] px-6">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Crown className="h-16 w-16 text-gray-300 mb-6" />
                      <h3 className="text-xl font-semibold text-gray-500 mb-3">
                        Start Your Chanakya Debate
                      </h3>
                      <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                        Click the microphone below to begin your strategic debate with Chanakya AI
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 pb-4">
                      {messages.slice(0, 10).map((message) => {
                        const isSpeaking = speakingMessageId === message.id;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.speaker === 'user' ? 'justify-end' : 
                              message.speaker === 'system' ? 'justify-center' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`relative ${getMessageStyles(message.speaker, message.side)} ${
                                isSpeaking ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
                              }`}
                            >
                              {/* Message Header */}
                              <div className="flex items-center space-x-3 mb-3">
                                <div className="flex items-center space-x-2">
                                  {getMessageIcon(message.speaker, message.side)}
                                  
                                  <span className="text-sm font-bold opacity-90">
                                    {getMessageLabel(message.speaker)}
                                  </span>
                                </div>
                                
                                <span className="text-xs opacity-75 font-medium">
                                  {formatTime(message.timestamp)}
                                </span>

                                {message.confidence && (
                                  <div className="flex items-center space-x-1 bg-white/20 rounded-full px-2 py-1">
                                    <CheckCircle className="h-3 w-3" />
                                    <span className="text-xs font-bold">
                                      {message.confidence}%
                                    </span>
                                  </div>
                                )}

                                {/* Speaking indicator */}
                                {isSpeaking && (
                                  <div className="flex items-center space-x-1 text-xs text-yellow-200">
                                    <div className="animate-pulse w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <span>Speaking...</span>
                                  </div>
                                )}
                              </div>

                              {/* Message Content */}
                              <p className={`text-sm leading-relaxed ${
                                message.speaker === 'ai'
                                  ? 'font-bold text-white drop-shadow-sm' 
                                  : 'font-medium'
                              }`}>
                                {message.text}
                              </p>

                              {/* AI Special Styling */}
                              {message.speaker === 'ai' && (
                                <div className="mt-4 pt-3 border-t border-white/40">
                                  <div className="flex items-center justify-between">
                                    <Badge className="text-xs font-bold px-3 py-1 bg-yellow-400 text-black">
                                      🧠 Chanakya AI
                                    </Badge>
                                    
                                    {message.relevance && (
                                      <div className="flex items-center space-x-2 text-xs opacity-80">
                                        <span>Relevance: {message.relevance}</span>
                                        {message.processingTime && (
                                          <span>• {message.processingTime}ms</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Message Tail */}
                              {message.speaker === 'user' && (
                                <div className="absolute -bottom-1 -right-1 w-0 h-0 border-l-8 border-l-indigo-600 border-t-8 border-t-transparent"></div>
                              )}
                              {message.speaker === 'ai' && (
                                <div className="absolute -bottom-1 -left-1 w-0 h-0 border-r-8 border-r-purple-700 border-t-8 border-t-transparent"></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* AI Thinking Indicator */}
                      {isAIResponding && (
                        <div className="flex justify-start">
                          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 rounded-2xl px-4 py-3 border border-purple-200">
                            <div className="flex items-center space-x-2">
                              <Crown className="h-4 w-4" />
                              <span className="text-sm font-medium">Chanakya AI</span>
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating Microphone Button */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[9999]">
        <div className="relative flex flex-col items-center space-y-3">
          {/* AI Processing Indicator */}
          {isAIResponding && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm animate-pulse">
              <div className="flex items-center space-x-2">
                <Crown className="h-3 w-3 animate-spin" />
                <span className="font-medium">Chanakya thinking...</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-purple-600"></div>
            </div>
          )}

          {/* Floating Action Button */}
          <Button
            size="lg"
            disabled={currentSpeaker !== 'student' || isAIResponding}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
              isRecording
                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse scale-110 shadow-red-500/50'
                : (currentSpeaker !== 'student' || isAIResponding)
                ? 'bg-gray-400 cursor-not-allowed shadow-gray-400/30'
                : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 hover:scale-105 shadow-indigo-500/30'
            }`}
          >
            {isRecording ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </Button>

          {/* Mute Button for TTS */}
          <Button
            size="sm"
            variant={isMuted ? "destructive" : "outline"}
            onClick={handleToggleMute}
            disabled={currentSpeaker !== 'student'}
            className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'
                : isSpeaking
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30'
                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-gray-400/30'
            }`}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : isSpeaking ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          {/* Recording Animation Ring */}
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75 pointer-events-none"></div>
          )}

          {/* AI Processing Ring */}
          {isAIResponding && (
            <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-spin opacity-75 pointer-events-none"></div>
          )}

          {/* Speaking Animation Ring */}
          {isSpeaking && !isMuted && (
            <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-75 pointer-events-none"></div>
          )}

          {/* Status Tooltip */}
          {isRecording && !isAIResponding && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Radio className="h-3 w-3 text-red-400 animate-pulse" />
                <span className="font-medium">Recording...</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80"></div>
            </div>
          )}

          {/* Speaking Tooltip */}
          {isSpeaking && !isMuted && !isRecording && !isAIResponding && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-3 w-3 text-orange-400 animate-pulse" />
                <span className="font-medium">Chanakya speaking...</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80"></div>
            </div>
          )}

          {/* Muted Tooltip */}
          {isMuted && !isRecording && !isAIResponding && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <VolumeX className="h-3 w-3 text-red-400" />
                <span className="font-medium">AI Voice Muted</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80"></div>
            </div>
          )}

          {/* Disabled State Tooltip */}
          {(currentSpeaker !== 'student' || isAIResponding) && !isRecording && !isSpeaking && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-black/80 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap backdrop-blur-sm">
              <span>
                {isAIResponding ? 'Chanakya is thinking...' : 'Wait for your turn'}
              </span>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black/80"></div>
            </div>
          )}

          {/* Pulsing Glow Effect for Active State */}
          {currentSpeaker === 'student' && !isRecording && !isAIResponding && !isSpeaking && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 opacity-20 animate-pulse pointer-events-none"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChanakyaDebateRoom;
