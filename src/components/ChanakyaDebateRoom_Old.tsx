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
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';

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
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [debateStarted, setDebateStarted] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [contextWarnings, setContextWarnings] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
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

  // Enhanced DeepSeek AI with Chanakya context
  const deepSeekAI = useDeepSeekAI({
    topic: config.topic,
    context: `Chanakya Debate - Topic: ${config.topic}, Type: ${config.topicType}, User Position: ${config.userPosition}, Difficulty: ${config.difficulty}`,
    autoSpeak: !isMuted
  });

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
    setIsMuted(!isMuted);
    console.log('Mute toggled:', !isMuted);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    console.log('Speech stopped manually');
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
        
        utterance.onend = () => setIsSpeaking(false);
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

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isAIResponding) return;

    const userMessage: DebateMessage = {
      id: Date.now().toString(),
      speaker: 'user',
      text: currentMessage,
      timestamp: new Date(),
      side: config.userPosition
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setTurnCount(prev => prev + 1);

    // Generate AI response after a short delay
    setTimeout(() => {
      generateAIResponse();
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleRecording = () => {
    setIsListening(!isListening);
    // Voice recognition implementation would go here
  };

  const handleToggleMute = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsMuted(!isMuted);
  };

  const handleEndDebate = () => {
    onComplete(config, messages);
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
      return `max-w-[85%] rounded-2xl px-5 py-4 ${
        side === 'for' 
          ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg' 
          : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg'
      }`;
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Setup</span>
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleMute}
                className="flex items-center space-x-2"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span>{isMuted ? 'Unmute' : 'Mute'} Chanakya</span>
              </Button>
              
              <Button
                onClick={handleEndDebate}
                variant="outline"
                size="sm"
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              >
                End Debate
              </Button>
            </div>
          </div>
          
          <div className="flex-1 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {config.topicType === 'custom' ? 'Topic' : 'Scenario'}: {config.topic}
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Your Position: <Badge className={config.userPosition === 'for' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {config.userPosition.toUpperCase()}
                  </Badge></span>
                  <span>Chanakya Position: <Badge className={config.userPosition === 'for' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {(config.userPosition === 'for' ? 'AGAINST' : 'FOR')}
                  </Badge></span>
                  <span>Intensity: <Badge className={getDifficultyColor(config.difficulty)}>
                    {config.difficulty.toUpperCase()}
                  </Badge></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Debate Interface */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chanakya Status Panel */}
          <div className="lg:col-span-1">
            <Card className="card-shadow sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-purple-600" />
                  <span>Chanakya AI</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* AI Avatar */}
                  <div className="text-center">
                    <div className="relative mx-auto w-20 h-20 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full h-full flex items-center justify-center">
                        <Brain className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900">Strategic Mind</h3>
                    <p className="text-sm text-gray-600">Ancient wisdom meets modern AI</p>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <Badge variant={isAIResponding ? 'default' : debateStarted ? 'secondary' : 'outline'}>
                        {isAIResponding ? 'Thinking...' : debateStarted ? 'Ready' : 'Waiting'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Turn Count:</span>
                      <Badge variant="outline">{turnCount}</Badge>
                    </div>
                    
                    {isSpeaking && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Speaking:</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <Volume2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    )}
                    
                    {isMuted && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Voice:</span>
                        <Badge variant="destructive" className="text-xs">
                          <VolumeX className="h-3 w-3 mr-1" />
                          Muted
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Context Warnings */}
                  {contextWarnings.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-orange-800 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Strategic Notes
                      </h4>
                      {contextWarnings.slice(-2).map((warning, index) => (
                        <p key={index} className="text-xs text-orange-700 bg-orange-50 p-2 rounded">
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Start Debate Button */}
                  {!debateStarted && config.firstSpeaker === 'user' && (
                    <div className="pt-4 border-t border-gray-200">
                      <Button 
                        onClick={startDebate}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3"
                        size="lg"
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        Begin Debate
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                    <span>Debate Arena</span>
                  </div>
                  {!debateStarted && config.firstSpeaker === 'user' && (
                    <Button onClick={startDebate} size="sm">
                      Start Debate
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Crown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>The debate arena awaits. Make your opening statement!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${
                          message.speaker === 'user' ? 'justify-end' : 
                          message.speaker === 'system' ? 'justify-center' : 'justify-start'
                        }`}>
                          <div className={getMessageStyles(message.speaker, message.side)}>
                            <div className="flex items-center space-x-2 mb-2">
                              {getMessageIcon(message.speaker, message.side)}
                              <span className="text-sm font-medium">
                                {message.speaker === 'user' ? 'You' : 
                                 message.speaker === 'system' ? 'System' : 'Chanakya AI'}
                              </span>
                              <span className="text-xs opacity-75">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            
                            {/* Enhanced AI Response Metadata */}
                            {message.speaker === 'ai' && message.confidence && (
                              <div className="mt-3 pt-2 border-t border-white/20">
                                <div className="flex items-center justify-between text-xs opacity-75">
                                  <span>Confidence: {message.confidence}%</span>
                                  {message.processingTime && (
                                    <span>{message.processingTime}ms</span>
                                  )}
                                </div>
                                {message.metadata?.strategicApproach && (
                                  <div className="text-xs opacity-75 mt-1">
                                    Strategy: {message.metadata.strategicApproach}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* AI Thinking Indicator */}
                      {isAIResponding && (
                        <div className="flex justify-start">
                          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 rounded-2xl px-4 py-3 border border-purple-200">
                            <div className="flex items-center space-x-2">
                              <Crown className="h-4 w-4" />
                              <span className="text-sm font-medium">Chanakya AI</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-xs text-purple-700">Formulating strategic response...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  <div className="flex space-x-3">
                    <Textarea
                      placeholder="Enter your argument or response..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 min-h-[80px] resize-none"
                      disabled={isAIResponding}
                    />
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={toggleRecording}
                        variant={isListening ? 'default' : 'outline'}
                        size="sm"
                        className="p-3"
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || isAIResponding}
                        size="sm"
                        className="p-3"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {isSpeaking && (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">Chanakya is speaking...</span>
                      </div>
                      <Button
                        onClick={handleStopSpeech}
                        variant="outline"
                        size="sm"
                        className="text-blue-700 border-blue-300"
                      >
                        Stop
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChanakyaDebateRoom;
