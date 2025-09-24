
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, MessageSquare, Bot, User, Loader2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { getDeepSeekResponse } from '@/api/deepseek';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface VoiceChatBotProps {
  // Props for future API integration
  onSpeechToText?: (audioBlob: Blob) => Promise<string>;
  onTextToSpeech?: (text: string) => Promise<void>;
  onBotResponse?: (userMessage: string) => Promise<string>;
  disabled?: boolean;
  className?: string;
}

const VoiceChatBot = ({ 
  onSpeechToText,
  onTextToSpeech,
  onBotResponse,
  disabled = false,
  className = ""
}: VoiceChatBotProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [debateStarted, setDebateStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Placeholder responses from Chanakya AI
  const bharatAIResponses = [
    "अरे O साले, बहुत बोलता है तू! मैं Chanakya AI हूँ, तेरे साथ debate करूंगा।",
    "जो डर गया समझो मर गया! तू कमजोर arguments दे रहा है।",
    "मैंने बहुत सारे debates जीते हैं, तेरा क्या है?",
    "तेरा logic कमजोर है, मेरे सामने बहुत strong points लाना पड़ेगा।",
    "अच्छा point है, लेकिन Chanakya AI से बेहतर बोलना पड़ेगा!"
  ];

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('User said:', transcript);
        
        // Process user input
        await processUserInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsLoading(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-restart microphone after AI finishes speaking
  useEffect(() => {
    if (!isSpeaking && debateStarted && !isListening && !isLoading) {
      // Small delay to ensure TTS has completely finished
      const timer = setTimeout(() => {
        if (recognitionRef.current && !isListening && !isLoading) {
          console.log('Auto-restarting microphone after AI response');
          startListening();
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isSpeaking, debateStarted, isListening, isLoading]);

  const startListening = () => {
    if (disabled || isLoading || !recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      setDebateStarted(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleMute = () => {
    if (isSpeaking) {
      // Stop current speech if speaking
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  const processUserInput = async (userText: string) => {
    setIsLoading(true);
    setIsListening(false);

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: userText,
        timestamp: new Date()
      };

      setMessages(prev => [userMessage, ...prev.slice(0, 2)]);

      // Get bot response using DeepSeek API
      let botResponseText: string;
      if (onBotResponse) {
        console.log('Using custom onBotResponse handler');
        botResponseText = await onBotResponse(userText);
      } else {
        // Use the actual DeepSeek API integration
        console.log('Using DeepSeek API integration');
        try {
          const deepSeekPrompt = `You are ArguAI, a fierce and confident debate opponent inspired by Gabbar Singh from the movie Sholay. You speak in a mix of Hindi and English with an iconic style. Respond to this user's debate point with a strong counterargument: "${userText}"`;
          console.log('Sending to DeepSeek API:', deepSeekPrompt);
          
          botResponseText = await getDeepSeekResponse(deepSeekPrompt);
          console.log('DeepSeek API response:', botResponseText);
          
          // Check if we got a valid response
          if (!botResponseText || botResponseText.trim() === '' || botResponseText === 'No response from DeepSeek') {
            throw new Error('Empty or invalid response from DeepSeek API');
          }
        } catch (error) {
          console.error('DeepSeek API error:', error);
          // Fallback to placeholder responses only if API fails
          botResponseText = bharatAIResponses[Math.floor(Math.random() * bharatAIResponses.length)];
          console.log('Using fallback response:', botResponseText);
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: botResponseText,
        timestamp: new Date()
      };

      setMessages(prev => [botMessage, ...prev.slice(0, 2)]);

      // Trigger text-to-speech for bot response (only if not muted)
      if (!isMuted) {
        if (onTextToSpeech) {
          setIsSpeaking(true);
          await onTextToSpeech(botResponseText);
          setIsSpeaking(false);
        } else {
          // Use browser's built-in speech synthesis as fallback
          if ('speechSynthesis' in window) {
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(botResponseText);
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 0.8;
            
            utterance.onend = () => {
              setIsSpeaking(false);
            };
            
            utterance.onerror = () => {
              setIsSpeaking(false);
            };
            
            speechSynthesis.speak(utterance);
          }
        }
      }

    } catch (error) {
      console.error('Voice chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartListening = () => {
    if (disabled || isLoading) return;
    startListening();
  };

  const handleStopListening = () => {
    stopListening();
    setDebateStarted(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className={`card-shadow border-purple-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <span>Voice Chat with ArguAI</span>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 text-xs">
            ArguAI
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voice Input Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            disabled={disabled || isLoading}
            className={`w-32 h-12 rounded-full transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-purple-500 hover:bg-purple-600'
            }`}
            onClick={isListening ? handleStopListening : handleStartListening}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
            <span className="ml-2 text-sm">
              {isLoading ? 'Processing...' : isListening ? 'Stop' : debateStarted ? 'Continue' : 'Start Debate'}
            </span>
          </Button>
        </div>

        {/* Mute Button */}
        <div className="flex justify-center">
          <Button
            size="sm"
            variant={isMuted ? "destructive" : "outline"}
            onClick={toggleMute}
            className="flex items-center space-x-2"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
            <span className="text-sm">
              {isMuted ? 'Unmute AI' : 'Mute AI'}
            </span>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              <span className="text-sm text-gray-600">
                {isListening ? 'Listening...' : 'ArguAI is thinking...'}
              </span>
            </div>
          </div>
        )}

        {/* Speaking State */}
        {isSpeaking && !isMuted && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                ArguAI is speaking...
              </span>
            </div>
          </div>
        )}

        {/* Muted State Indicator */}
        {isMuted && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2">
              <VolumeX className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">
                AI Voice Muted
              </span>
            </div>
          </div>
        )}

        {/* Message History (Last 3 Messages) */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Start a voice conversation with ArguAI</p>
            </div>
          ) : (
            messages.slice(0, 3).map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-purple-100 text-purple-900 border border-purple-200'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.type === 'user' ? (
                      <User className="h-3 w-3" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}
                    <span className="text-xs font-medium">
                      {message.type === 'user' ? 'You' : 'ArguAI'}
                    </span>
                    <span className="text-xs opacity-75">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Connection Status */}
        <div className="text-center">
          <Badge 
            variant="outline" 
            className={`text-xs ${
              disabled 
                ? 'bg-red-50 text-red-700 border-red-200' 
                : 'bg-green-50 text-green-700 border-green-200'
            }`}
          >
            {disabled ? 'APIs Not Connected' : debateStarted ? 'Debate Active' : 'Ready for Voice Chat'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceChatBot;
