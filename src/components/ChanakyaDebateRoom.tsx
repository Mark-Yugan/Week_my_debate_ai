import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Video, VideoOff, Users, Trophy, ArrowLeft, Send, Type, Square } from 'lucide-react';
import { useDeepSeekAI } from '@/hooks/useDeepSeekAI';
import { useAutoTextToSpeech } from '@/hooks/useAutoTextToSpeech';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { DebateService } from '@/services/DebateService';
import VideoConferencePanel from './debate/VideoConferencePanel';
import ConversationPanel from './debate/ConversationPanel';
import CompactScorePanel from './debate/CompactScorePanel';
import VoiceInputButton from './debate/VoiceInputButton';
import FloatingMicrophone from './debate/FloatingMicrophone';
import DebateAnalysis from './DebateAnalysis';

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
  const [currentSpeaker, setCurrentSpeaker] = useState<'student' | 'opponent'>(
    config.firstSpeaker === 'ai' ? 'opponent' : 'student'
  );
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
  const aiFirstMessageSentRef = useRef(false); // Prevent duplicate AI opening messages

  // Analysis state
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  // Dynamic autoSpeak state that updates with mute changes
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState(!isMuted);

  // Update autoSpeak when mute state changes
  useEffect(() => {
    setAutoSpeakEnabled(!isMuted);
    console.log('AutoSpeak updated to:', !isMuted);
  }, [isMuted]);

  const deepSeekAI = useDeepSeekAI({
    topic: config.topic,
    context: `Chanakya Debate - Topic: ${config.topic}, Type: ${config.topicType}, User Position: ${config.userPosition}, Difficulty: ${config.difficulty}`,
    autoSpeak: autoSpeakEnabled
  });

  // Fallback TTS for manual control
  const fallbackTTS = useAutoTextToSpeech({
    enabled: true,
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voiceType: 'natural'
  });

  // Helper function to ensure AI response is spoken
  const ensureAIResponseSpoken = (text: string) => {
    if (!isMuted && text) {
      console.log('🔊 Triggering TTS for AI response:', text);
      fallbackTTS.speakText(text);
    } else {
      console.log('🔇 TTS skipped - muted:', isMuted, 'text:', !!text);
    }
  };

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

  // Initialize AI first message if AI should speak first
  useEffect(() => {
    const initializeAIFirstMessage = async () => {
      // Debug logging
      console.log('AI First Message Check:', {
        firstSpeaker: config.firstSpeaker,
        messagesLength: messages.length,
        debateSessionId,
        alreadySent: aiFirstMessageSentRef.current
      });

      // Only trigger if AI should speak first, no messages exist yet, session is ready, and not already sent
      if (config.firstSpeaker === 'ai' && 
          messages.length === 0 && 
          debateSessionId && 
          !aiFirstMessageSentRef.current) {
        
        console.log('✅ AI should speak first - initializing AI message...');
        aiFirstMessageSentRef.current = true; // Prevent multiple executions
        
        // Create an opening prompt for the AI
        const openingPrompt = `You are Chanakya AI, beginning a debate about "${config.topic}". 
          The user has chosen to ${config.userPosition === 'for' ? 'support' : 'oppose'} this topic.
          Since you are speaking first, please open the debate with a compelling introduction that:
          1. Introduces the topic clearly
          2. States your opposing position (${config.userPosition === 'for' ? 'against' : 'for'})
          3. Presents your opening argument
          4. Challenges the user to respond
          
          Keep it conversational, engaging, and under 150 words. Set the tone for an intellectual discussion.`;

        try {
          // Trigger AI response with the opening prompt
          const aiResponse = await deepSeekAI.sendToDeepSeek(openingPrompt);
          
          if (aiResponse) {
            // Create AI message object
            const aiMessage: Message = {
              id: `ai-opening-${Date.now()}`,
              type: 'deepseek-ai',
              text: aiResponse.reply,
              timestamp: new Date(),
              confidence: aiResponse.confidence,
              relevance: aiResponse.relevance,
              processingTime: aiResponse.processingTime,
              model: aiResponse.model
            };

            // Add AI message to the conversation
            setMessages(prev => [...prev, aiMessage]);
            await saveMessageToDatabase(aiMessage, 'ai');
            setCurrentSpeaker('student'); // After AI speaks, it's user's turn
            
            // Ensure TTS for opening message
            setTimeout(() => {
              ensureAIResponseSpoken(aiResponse.reply);
            }, 500);
            
            console.log('✅ AI opening message added successfully');
          }
        } catch (error) {
          console.error('❌ Error initializing AI first message:', error);
          // Reset the ref in case of error so it can be retried
          aiFirstMessageSentRef.current = false;
        }
      } else {
        console.log('⏭️ Skipping AI first message initialization');
      }
    };

    // Add a slight delay to ensure session is fully created
    const timer = setTimeout(initializeAIFirstMessage, 1000);
    return () => clearTimeout(timer);
  }, [config.firstSpeaker, messages.length, debateSessionId]); // Removed problematic dependencies

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
        'completed'
      );

      if (result.success) {
        console.log('Debate session completed in database');
        // Process analysis after completing the session
        await processDebateAnalysis();
      } else {
        console.error('Failed to complete session:', result.error);
      }
    } catch (error) {
      console.error('Error completing debate session:', error);
    }
  };

  const processDebateAnalysis = async () => {
    if (!debateSessionId) return;

    setIsLoadingAnalysis(true);
    try {
      // Use your N8N webhook URL directly
      const n8nWebhookUrl = 'https://n8n-k6lq.onrender.com/webhook/debate-analysis';
      
      console.log('Starting debate analysis for session:', debateSessionId);
      console.log('Using N8N webhook URL:', n8nWebhookUrl);
      
      const analysisResult = await DebateService.processDebateAnalysis(debateSessionId, n8nWebhookUrl);
      
      console.log('Analysis result:', analysisResult);
      
      if (analysisResult.success && analysisResult.data) {
        console.log('Analysis successful, setting data and showing analysis');
        setAnalysisData(analysisResult.data);
        setShowAnalysis(true);
      } else {
        console.error('Failed to process analysis:', analysisResult.error);
        // Show a fallback analysis or error message
        showFallbackAnalysis();
      }
    } catch (error) {
      console.error('Error processing analysis:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      showFallbackAnalysis();
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const showFallbackAnalysis = () => {
    // Create a basic analysis based on current scores
    const fallbackAnalysis = {
      overallScore: scores.overall,
      performanceMetrics: {
        argumentation: {
          score: scores.creativity,
          strengths: ["Good creative thinking", "Innovative arguments"],
          weaknesses: ["Could improve structure"],
          improvement: "Focus on organizing your arguments more systematically"
        },
        clarity: {
          score: scores.fluency,
          strengths: ["Clear communication", "Good flow"],
          weaknesses: ["Some hesitation"],
          improvement: "Practice to reduce pauses and improve fluency"
        },
        engagement: {
          score: scores.confidence,
          strengths: ["Shows enthusiasm"],
          weaknesses: ["Could be more assertive"],
          improvement: "Practice with confident body language and tone"
        },
        criticalThinking: {
          score: scores.grammar,
          strengths: ["Good language use"],
          weaknesses: ["Some grammar issues"],
          improvement: "Review grammar rules and practice"
        },
        communication: {
          score: (scores.fluency + scores.confidence) / 2,
          strengths: ["Expressive speaking"],
          weaknesses: ["Needs more precision"],
          improvement: "Focus on precise word choice"
        }
      },
      keyStrengths: ["Good participation", "Shows knowledge of topic", "Maintains engagement"],
      areasForImprovement: ["Structure arguments better", "Improve confidence", "Enhanced preparation"],
      specificFeedback: {
        content: ["Good understanding of the topic", "Could use more evidence"],
        delivery: ["Work on confidence", "Maintain eye contact"],
        strategy: ["Plan your arguments", "Anticipate counterarguments"]
      },
      improvementPlan: {
        immediate: [
          { action: "Review key arguments", description: "Reflect on the main points discussed", timeframe: "Next 30 minutes" }
        ],
        shortTerm: [
          { action: "Practice structured debates", description: "Work on organizing arguments clearly", timeframe: "This week" }
        ],
        mediumTerm: [
          { action: "Study debate techniques", description: "Learn advanced rhetorical strategies", timeframe: "Next 2-3 weeks" }
        ],
        longTerm: [
          { action: "Join debate club", description: "Get regular practice with peers", timeframe: "This month" }
        ]
      },
      encouragementMessage: "Great job participating in this debate! Every debate is a learning opportunity.",
      nextSteps: ["Review the feedback", "Practice the suggested improvements", "Try another debate soon"]
    };
    
    setAnalysisData(fallbackAnalysis);
    setShowAnalysis(true);
  };

  // Custom handler for leaving the debate
  const handleExit = async () => {
    if (!showAnalysis) {
      // Complete the session and show analysis first
      await completeDebateSession();
    } else {
      // Analysis is shown, now actually exit
      onComplete(config, messages);
      onBack();
    }
  };

  const handleBackToDebate = () => {
    setShowAnalysis(false);
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
            
            // Ensure TTS for AI response
            setTimeout(() => {
              ensureAIResponseSpoken(deepSeekResponse.reply);
            }, 200);
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
          
          // Ensure TTS for AI response
          setTimeout(() => {
            ensureAIResponseSpoken(deepSeekResponse.reply);
          }, 200);
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

  // Show analysis if it's ready
  if (showAnalysis && analysisData) {
    return (
      <DebateAnalysis 
        analysisData={analysisData}
        onBack={handleBackToDebate}
        onContinue={handleExit}
        isLoading={isLoadingAnalysis}
      />
    );
  }

  // Show loading screen while processing analysis
  if (isLoadingAnalysis) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Analyzing Your Debate Performance</h2>
          <p className="text-gray-400">Our AI is reviewing your debate and preparing detailed feedback...</p>
        </div>
      </div>
    );
  }

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
                <span>View Analysis</span>
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
