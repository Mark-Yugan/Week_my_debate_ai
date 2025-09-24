
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  User, 
  Bot, 
  Brain, 
  CheckCircle, 
  Volume2, 
  VolumeX,
  Zap,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'gabbar-ai' | 'deepseek-ai' | 'system';
  text: string;
  timestamp: Date;
  confidence?: number;
  relevance?: string;
  processingTime?: number;
  model?: string;
}

interface ConversationPanelProps {
  messages: Message[];
  showAI?: boolean;
}

const ConversationPanel = ({ messages, showAI = true }: ConversationPanelProps) => {
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleStopSpeech = () => {
    if (isSupported) {
      speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'gabbar-ai':
        return (
          <div className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <Bot className="h-4 w-4" />
          </div>
        );
      case 'deepseek-ai':
        return (
          <div className="flex items-center space-x-1">
            <Brain className="h-4 w-4" />
            <Sparkles className="h-4 w-4" />
          </div>
        );
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getMessageLabel = (type: string) => {
    switch (type) {
      case 'user':
        return 'You';
      case 'gabbar-ai':
        return 'Chanakya AI';
      case 'deepseek-ai':
        return 'Chanakya AI';
      default:
        return 'System';
    }
  };

  const getMessageStyles = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg';
      case 'gabbar-ai':
        return 'bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-xl border-2 border-purple-400';
      case 'deepseek-ai':
        return 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl border-2 border-emerald-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md';
    }
  };

  return (
    <Card className="flex-1 card-shadow-lg border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg">
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="flex items-center space-x-2 text-sm">
          <MessageSquare className="h-4 w-4 text-indigo-600" />
          <span>Live Conversation</span>
          {showAI && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-0">
              Chanakya AI
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] px-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-gray-500 mb-3">
                Start Your Debate
              </h3>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                Click "Start Speaking" below to begin your conversation
                {showAI ? ' with Chanakya AI' : ' with your opponent'}
              </p>
            </div>
          ) : (
            <div className="space-y-6 pb-4">
              {messages.slice(0, 10).map((message) => {
                const isSpeaking = speakingMessageId === message.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 relative ${getMessageStyles(message.type)} ${
                        isSpeaking ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          {getMessageIcon(message.type)}
                          
                          <span className="text-sm font-bold opacity-90">
                            {getMessageLabel(message.type)}
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
                        message.type === 'gabbar-ai' || message.type === 'deepseek-ai'
                          ? 'font-bold text-white drop-shadow-sm' 
                          : 'font-medium'
                      }`}>
                        {message.text}
                      </p>

                      {/* AI Special Styling */}
                      {(message.type === 'gabbar-ai' || message.type === 'deepseek-ai') && (
                        <div className="mt-4 pt-3 border-t border-white/40">
                          <div className="flex items-center justify-between">
                            <Badge className={`text-xs font-bold px-3 py-1 ${
                              message.type === 'deepseek-ai' 
                                ? 'bg-emerald-400 text-black' 
                                : 'bg-yellow-400 text-black'
                            }`}>
                              {message.type === 'deepseek-ai' ? '🧠 Chanakya AI' : '🤖 AI OPPONENT'}
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
                      {message.type === 'user' && (
                        <div className="absolute -bottom-1 -right-1 w-0 h-0 border-l-8 border-l-indigo-600 border-t-8 border-t-transparent"></div>
                      )}
                      {message.type === 'gabbar-ai' && (
                        <div className="absolute -bottom-1 -left-1 w-0 h-0 border-r-8 border-r-purple-700 border-t-8 border-t-transparent"></div>
                      )}
                      {message.type === 'deepseek-ai' && (
                        <div className="absolute -bottom-1 -left-1 w-0 h-0 border-r-8 border-r-teal-700 border-t-8 border-t-transparent"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationPanel;
