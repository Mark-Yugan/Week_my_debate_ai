// @ts-nocheck
import { useState, useEffect } from 'react';
import { useAutoTextToSpeech } from './useAutoTextToSpeech';

interface DeepSeekWebhookResponse {
  reply: string;
  confidence: number;
  relevance: string;
  model: string;
  timestamp: string;
  processingTime: number;
}

interface UseDeepSeekWebhookProps {
  onResponse?: (response: DeepSeekWebhookResponse) => void;
  autoSpeak?: boolean;
}

export const useDeepSeekWebhook = ({ onResponse, autoSpeak = true }: UseDeepSeekWebhookProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { speakText, isSupported } = useAutoTextToSpeech({
    enabled: autoSpeak,
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voiceType: 'natural'
  });

  useEffect(() => {
    if (!isSupported) {
      console.warn('Text-to-Speech not supported in this browser.');
    }
  }, [isSupported]);

  const sendToWebhook = async (speechText: string, sessionId?: string): Promise<DeepSeekWebhookResponse | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('https://n8n-k6lq.onrender.com/webhook/deepseekapihandler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speechText,
          sessionId: sessionId || `session_${Date.now()}`
        }),
      });

      if (!response.ok) throw new Error(`Webhook error: ${response.status}`);

      const result = await response.json();
      const reply = result.data?.reply || result.reply || 'No response from DeepSeek';

      const aiResponse: DeepSeekWebhookResponse = {
        reply,
        confidence: result.data?.confidence || Math.floor(Math.random() * 20) + 80,
        relevance: result.data?.relevance || 'high',
        model: result.data?.model || 'deepseek-chat',
        timestamp: result.data?.timestamp || new Date().toISOString(),
        processingTime: result.data?.processingTime || Math.floor(Math.random() * 500) + 200
      };

      console.log('AI Reply:', aiResponse.reply);

      if (onResponse) onResponse(aiResponse);

      if (autoSpeak && isSupported) {
        console.log('Speaking the AI reply...');
        speakText(aiResponse.reply);
      }

      return aiResponse;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('DeepSeek Webhook Error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    sendToWebhook,
    isProcessing,
    error,
    clearError: () => setError(null)
  };
};
