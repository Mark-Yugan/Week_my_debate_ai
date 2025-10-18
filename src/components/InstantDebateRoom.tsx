// @ts-nocheck
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  VolumeX 
} from 'lucide-react';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';

interface DebateConfig {
  topic: string;
  userPosition: 'for' | 'against';
  firstSpeaker: 'user' | 'ai';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface InstantDebateRoomProps {
  config: DebateConfig;
  onBack: () => void;
  onComplete: (config: DebateConfig, messages: DebateMessage[]) => void;
}

interface DebateMessage {
  id: string;
  speaker: 'user' | 'ai';
  text: string;
  timestamp: Date;
  side: 'for' | 'against';
  confidence?: number;
  relevance?: string;
  processingTime?: number;
  model?: string;
}

const InstantDebateRoom = ({ config, onBack, onComplete }: InstantDebateRoomProps) => {
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [debateStarted, setDebateStarted] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const deepSeekAI = useDeepSeekAI({
    topic: config.topic,
    context: `Debate topic: ${config.topic}, User position: ${config.userPosition}, First speaker: ${config.firstSpeaker}`,
    autoSpeak: !isMuted // Only auto-speak if not muted
  });

  // Update the deepSeekAI hook when mute state changes
  useEffect(() => {
    // The hook will automatically update when autoSpeak prop changes
    console.log('Mute state changed in InstantDebateRoom:', isMuted);
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

  const startDebate = async () => {
    setDebateStarted(true);
    if (config.firstSpeaker === 'ai') {
      await generateAIResponse();
    }
  };

  const generateAIResponse = async () => {
    setIsAIResponding(true);
    
    try {
      const lastUserMessage = messages.filter(m => m.speaker === 'user').pop();
      const userText = lastUserMessage?.text || `Start the debate about ${config.topic}. I am arguing ${config.userPosition === 'for' ? 'against' : 'for'} this topic.`;
      
      const response = await deepSeekAI.sendToDeepSeek(userText);
      
      if (response) {
        const aiMessage: DebateMessage = {
          id: Date.now().toString(),
          speaker: 'ai',
          text: response.reply,
          timestamp: new Date(),
          side: config.userPosition === 'for' ? 'against' : 'for',
          confidence: response.confidence,
          relevance: response.relevance,
          processingTime: response.processingTime,
          model: response.model
        };

        setMessages(prev => [...prev, aiMessage]);
        setTurnCount(prev => prev + 1);
        // TTS is handled automatically by the useDeepSeekAI hook
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      // Fallback response
      const fallbackMessage: DebateMessage = {
        id: Date.now().toString(),
        speaker: 'ai',
        text: `I understand your position on ${config.topic}. Please continue with your argument.`,
        timestamp: new Date(),
        side: config.userPosition === 'for' ? 'against' : 'for'
      };
      setMessages(prev => [...prev, fallbackMessage]);
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
    deepSeekAI.stopSpeaking();
    setIsSpeaking(false);
  };

  const toggleRecording = () => {
    if (isListening) {
      // Stop recording logic here
      setIsListening(false);
    } else {
      // Start recording logic here
      setIsListening(true);
    }
  };

  const handleToggleMute = () => {
    // Stop current speech if speaking
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    deepSeekAI.stopSpeaking();
    setIsSpeaking(false);
    setIsMuted(!isMuted);
    console.log('Mute toggled in InstantDebateRoom:', !isMuted);
  };

  const handleEndDebate = () => {
    onComplete(config, messages);
  };

  const getMessageIcon = (speaker: string, side: string) => {
    if (speaker === 'user') {
      return <User className="h-4 w-4" />;
    } else {
      return <Bot className="h-4 w-4" />;
    }
  };

  const getMessageStyles = (speaker: string, side: string) => {
    if (speaker === 'user') {
      return 'bg-azul text-white rounded-lg p-4 max-w-xs lg:max-w-md shadow-sm';
    } else {
      return 'bg-neutral-100 text-gunmetal rounded-lg p-4 max-w-xs lg:max-w-md border border-neutral-200';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
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
                <span>{isMuted ? 'Unmute' : 'Mute'} AI</span>
              </Button>
              
              <Button
                onClick={handleEndDebate}
                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              >
                End Debate
              </Button>
            </div>
          </div>
          
          <div className="flex-1">
            <p className="text-sm text-gray-600 font-medium mb-2">
              Topic: {config.topic}
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Your Position: <Badge className={config.userPosition === 'for' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {config.userPosition.toUpperCase()}
              </Badge></span>
              <span>AI Position: <Badge className={config.userPosition === 'for' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                {(config.userPosition === 'for' ? 'against' : 'for').toUpperCase()}
              </Badge></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-1">
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  <span>Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Voice Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Voice Input:</span>
                    <Button
                      size="sm"
                      variant={isListening ? "destructive" : "outline"}
                      onClick={toggleRecording}
                      className="flex items-center space-x-2"
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      <span>{isListening ? 'Stop' : 'Start'}</span>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">AI Speech:</span>
                    <Button
                      size="sm"
                      variant={isMuted ? "destructive" : "outline"}
                      onClick={handleToggleMute}
                      className="flex items-center space-x-2"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      <span>{isMuted ? 'Muted' : 'Unmuted'}</span>
                    </Button>
                  </div>

                  {isSpeaking && !isMuted && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Stop Speech:</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleStopSpeech}
                        className="flex items-center space-x-2"
                      >
                        <VolumeX className="h-4 w-4" />
                        <span>Stop</span>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Debate Stats */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Turns:</span>
                      <Badge variant="outline">{turnCount}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <Badge className={debateStarted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {debateStarted ? 'Active' : 'Ready'}
                      </Badge>
                    </div>
                    {isMuted && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">AI Voice:</span>
                        <Badge variant="destructive" className="text-xs">
                          <VolumeX className="h-3 w-3 mr-1" />
                          Muted
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Start Debate Button */}
                {!debateStarted && config.firstSpeaker === 'user' && (
                  <div className="pt-4 border-t border-gray-200">
                    <Button 
                      onClick={startDebate}
                      className="w-full bg-azul hover:bg-steel-blue text-white font-semibold py-3 transition-colors duration-200"
                      size="lg"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Start Debate
                    </Button>
                  </div>
                )}
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
                    <span>Debate Messages</span>
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
                      <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No messages yet. Start the debate to begin!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={getMessageStyles(message.speaker, message.side)}>
                            <div className="flex items-center space-x-2 mb-2">
                              {getMessageIcon(message.speaker, message.side)}
                              <span className="text-sm font-medium">
                                {message.speaker === 'user' ? 'You' : 'Chanakya AI'}
                              </span>
                              <span className="text-xs opacity-75">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            
                            {/* AI Response Metadata */}
                            {message.speaker === 'ai' && message.confidence && (
                              <div className="mt-3 pt-2 border-t border-white/20">
                                <div className="flex items-center justify-between text-xs opacity-75">
                                  <span>Confidence: {message.confidence}%</span>
                                  {message.processingTime && (
                                    <span>• {message.processingTime}ms</span>
                                  )}
                                  {message.model && (
                                    <span>• {message.model}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  <Textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your argument here..."
                    className="min-h-[100px] resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    disabled={isAIResponding}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isAIResponding && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                          <span>AI is thinking...</span>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || isAIResponding}
                      className="bg-azul hover:bg-steel-blue text-white transition-colors duration-200"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantDebateRoom; 