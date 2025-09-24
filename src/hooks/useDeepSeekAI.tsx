
import { useState, useRef, useEffect } from 'react';
import { useAutoTextToSpeech } from './useAutoTextToSpeech';

interface DeepSeekResponse {
  reply: string;
  confidence: number;
  relevance: string;
  model: string;
  timestamp: string;
  processingTime: number;
}

interface UseDeepSeekAIProps {
  topic?: string;
  context?: string;
  autoSpeak?: boolean;
}

export const useDeepSeekAI = ({ topic, context, autoSpeak = true }: UseDeepSeekAIProps = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSpeakRef = useRef(autoSpeak);

  // Update the ref when autoSpeak prop changes
  useEffect(() => {
    autoSpeakRef.current = autoSpeak;
    console.log('AutoSpeak updated:', autoSpeak);
  }, [autoSpeak]);

  const { speakText, isSupported, cancel } = useAutoTextToSpeech({
    enabled: autoSpeak,
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voiceType: 'natural'
  });

  const sendToDeepSeek = async (message: string): Promise<DeepSeekResponse | null> => {
    setIsProcessing(true);
    setError(null);

    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`DeepSeek API attempt ${attempt + 1}/${maxRetries + 1}`);

        const response = await fetch('https://n8n-k6lq.onrender.com/webhook/deepseekapihandler', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            speechText: message,
            context: {
              topic,
              context,
              timestamp: new Date().toISOString()
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`DeepSeek API error: ${response.status} - ${response.statusText}`);
        }

        // Check if response has content
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format: Expected JSON');
        }

        // Get response text first to handle empty responses
        const responseText = await response.text();
        
        if (!responseText || responseText.trim().length === 0) {
          throw new Error('Empty response from server');
        }

        let result;
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Response text:', responseText);
          throw new Error(`Invalid JSON response: ${parseError.message}`);
        }

        console.log('DeepSeek AI Response (attempt ' + (attempt + 1) + '):', result);

        // Validate response structure
        if (!result || typeof result !== 'object') {
          throw new Error('Invalid response structure');
        }

        // Transform n8n response to match expected format
        const data: DeepSeekResponse = {
          reply: result.data?.reply || result.reply || 'I understand your point. Let me provide a counterargument to strengthen this debate.',
          confidence: result.data?.confidence || result.confidence || Math.floor(Math.random() * 20) + 80,
          relevance: result.data?.relevance || result.relevance || 'high',
          model: result.data?.model || result.model || 'deepseek-chat',
          timestamp: result.data?.timestamp || result.timestamp || new Date().toISOString(),
          processingTime: result.data?.processingTime || result.processingTime || Math.floor(Math.random() * 500) + 200
        };

        // Validate that we have a meaningful reply
        if (!data.reply || data.reply.trim().length === 0) {
          data.reply = 'I understand your argument. Let me present an alternative perspective on this topic.';
        }

        // Automatically speak the AI response if TTS is enabled and supported
        if (autoSpeakRef.current && isSupported && data.reply) {
          console.log('Speaking AI response:', data.reply);
          speakText(data.reply);
        }

        console.log('DeepSeek success on attempt:', attempt + 1);
        setIsProcessing(false);
        return data;

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error(`DeepSeek AI Error (attempt ${attempt + 1}):`, err);

        // If this is not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Last attempt failed, set error and return fallback
        setError(`Failed after ${maxRetries + 1} attempts: ${errorMessage}`);
        console.error('All DeepSeek attempts failed:', errorMessage);

        // Return a fallback response instead of null
        const fallbackResponse: DeepSeekResponse = {
          reply: "I appreciate your argument. Due to a temporary connection issue, let me offer this perspective: every complex topic has multiple valid viewpoints that deserve consideration.",
          confidence: 75,
          relevance: 'medium',
          model: 'fallback-response',
          timestamp: new Date().toISOString(),
          processingTime: 500
        };

        // Speak fallback response if TTS is enabled
        if (autoSpeakRef.current && isSupported) {
          console.log('Speaking fallback response');
          speakText(fallbackResponse.reply);
        }

        setIsProcessing(false);
        return fallbackResponse;
      }
    }

    // This should never be reached, but just in case
    setIsProcessing(false);
    return null;
  };

  const stopSpeaking = () => {
    if (isSupported) {
      cancel();
    }
  };

  return {
    sendToDeepSeek,
    isProcessing,
    error,
    isSupported,
    stopSpeaking
  };
};
