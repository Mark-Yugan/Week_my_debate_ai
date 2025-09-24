
// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useDeepSeekWebhook } from '@/hooks/useDeepSeekWebhook';
import { useTextToSpeechWebhook } from '@/hooks/useTextToSpeechWebhook';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  confidence?: number;
  processingTime?: number;
}

const DeepSeekWebhookChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [recognition, setRecognition] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false); // Default unmute

  const { speak, stopSpeaking, isSpeaking } = useTextToSpeechWebhook();
  
  const { sendToWebhook, isProcessing } = useDeepSeekWebhook({
    onResponse: (response) => {
      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        type: 'ai',
        text: response.reply,
        timestamp: new Date(),
        confidence: response.confidence,
        processingTime: response.processingTime
      };
      setMessages(prev => [aiMessage, ...prev]);
      
      // Auto-speak the AI response only if not muted
      if (!isMuted) {
        speak(response.reply);
      }
    },
    autoSpeak: false // We handle it manually above
  });

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const newRecognition = new SpeechRecognition();
      
      newRecognition.continuous = false;
      newRecognition.interimResults = false;
      newRecognition.lang = 'en-US';

      newRecognition.onstart = () => {
        setIsRecording(true);
      };

      newRecognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = Math.floor(event.results[0][0].confidence * 100);
        
        // Add user message
        const userMessage: Message = {
          id: Date.now().toString() + '_user',
          type: 'user',
          text: transcript,
          timestamp: new Date(),
          confidence
        };
        setMessages(prev => [userMessage, ...prev]);

        // Send to DeepSeek webhook
        await sendToWebhook(transcript);
      };

      newRecognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      newRecognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(newRecognition);
      newRecognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleStopSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const toggleMute = () => {
    if (isSpeaking) {
      // Stop current speech if speaking
      stopSpeaking();
    }
    setIsMuted(!isMuted);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Chanakya AI Chat (Webhook)</span>
          {isProcessing && <span className="text-sm text-gray-500">Processing...</span>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          
          <Button
            onClick={handleStopSpeech}
            variant="outline"
            disabled={!isSpeaking}
          >
            <VolumeX className="h-4 w-4" />
            {isSpeaking ? 'Stop Speech' : 'Stop TTS'}
          </Button>
        </div>

        {/* Mute Controls */}
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
              {isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
            </span>
          </Button>
        </div>

        {/* Mute Status Indicator */}
        {isMuted && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2">
              <VolumeX className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">
                AI Voice Muted - Responses will be text only
              </span>
            </div>
          </div>
        )}

        {/* Speaking Status */}
        {isSpeaking && !isMuted && (
          <div className="text-center py-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                Chanakya AI is speaking...
              </span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Click "Start Recording" to begin chatting with Chanakya AI
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="text-xs opacity-75 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                    {message.confidence && ` • ${message.confidence}% confidence`}
                    {message.processingTime && ` • ${message.processingTime}ms`}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Status */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Status: {isRecording ? 'Listening...' : isProcessing ? 'Processing...' : isSpeaking ? 'Speaking...' : 'Ready'}
          </p>
          <p className="text-xs mt-1">
            Webhook endpoint: <code>/api/deepseek-webhook</code>
          </p>
          <p className="text-xs mt-1">
            TTS: {isMuted ? 'Muted' : 'Enabled'} (Default: Enabled)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeepSeekWebhookChat;
