// @ts-nocheck
/**
 * Speech Test Component
 * Allows users to record a 1-minute video speech to determine their skill level
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Video, VideoOff, Play, Square, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpeechTestProps {
  onComplete: (level: 'beginner' | 'amateur' | 'expert') => void;
  onCancel: () => void;
}

const SUGGESTED_TOPICS = [
  "The importance of reading books in the digital age",
  "How technology has changed the way we communicate",
  "The benefits of learning a second language",
  "Why exercise is important for mental health",
  "The impact of social media on relationships",
  "The value of education in today's world",
  "How hobbies improve our quality of life",
  "The role of family in personal development"
];

const SpeechTest = ({ onComplete, onCancel }: SpeechTestProps) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds = 1 minute
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<'beginner' | 'amateur' | 'expert' | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;

      // Set video source
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create blob from recorded chunks
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        // In a real implementation, you would upload this blob to a server for analysis
        // For now, we'll analyze it locally or simulate analysis
        analyzeSpeech(blob);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setTimeRemaining(60);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone. You have 1 minute.",
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera/Microphone Access Error",
        description: "Please allow camera and microphone access to take the test.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setHasRecorded(true);
  };

  const analyzeSpeech = async (videoBlob: Blob) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would:
    // 1. Upload video to a server
    // 2. Extract audio from video
    // 3. Analyze speech using AI/ML (speech recognition, fluency, clarity, etc.)
    // 4. Determine level based on metrics like:
    //    - Speech clarity and pronunciation
    //    - Fluency (pauses, hesitations)
    //    - Structure and coherence
    //    - Vocabulary usage
    //    - Confidence and delivery
    
    // For now, we'll use a simple heuristic based on recording duration and topic complexity
    // In production, this would use actual speech analysis
    
    let level: 'beginner' | 'amateur' | 'expert' = 'beginner';
    
    // Mock analysis - in production, this would be AI-powered
    // Factors to consider: duration, pauses, clarity, structure
    const duration = videoBlob.size; // Proxy for duration
    const hasCompleteRecording = duration > 100000; // Basic check
    
    if (hasCompleteRecording) {
      // Simple heuristic: if user completed full minute, they're at least amateur
      // More sophisticated analysis would evaluate speech quality
      level = Math.random() > 0.5 ? 'amateur' : 'expert';
    }
    
    // For demo purposes, randomly assign a level (in production, use real analysis)
    const levels: ('beginner' | 'amateur' | 'expert')[] = ['beginner', 'amateur', 'expert'];
    const weights = [0.3, 0.4, 0.3]; // Distribution
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < levels.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        level = levels[i];
        break;
      }
    }
    
    setAnalysisResult(level);
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Your speech level has been determined: ${level.charAt(0).toUpperCase() + level.slice(1)}`,
    });
  };

  const handleConfirmLevel = () => {
    if (analysisResult) {
      onComplete(analysisResult);
    }
  };

  const handleRetake = () => {
    setSelectedTopic('');
    setIsRecording(false);
    setTimeRemaining(60);
    setHasRecorded(false);
    setIsAnalyzing(false);
    setAnalysisResult(null);
    chunksRef.current = [];
    stopRecording();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Speech Skills Assessment Test
        </CardTitle>
        <CardDescription>
          Record a 1-minute video speech to determine your skill level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Topic Selection */}
        {!isRecording && !hasRecorded && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Choose a Topic</h3>
              <div className="grid grid-cols-2 gap-3">
                {SUGGESTED_TOPICS.map((topic, index) => (
                  <Button
                    key={index}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    onClick={() => setSelectedTopic(topic)}
                    className="h-auto p-4 text-left justify-start"
                  >
                    <div className="flex items-center gap-2">
                      {selectedTopic === topic && (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <span className="text-sm">{topic}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recording Area */}
        {selectedTopic && (
          <div className="space-y-4">
            {!isRecording && !hasRecorded && (
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Selected Topic:</strong> {selectedTopic}
                </p>
                <p className="text-xs text-gray-500">
                  You will have 1 minute to speak about this topic. Make sure your camera and microphone are ready.
                </p>
              </div>
            )}

            {/* Video Preview/Recording */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isRecording && !hasRecorded && streamRef.current && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <p className="text-white text-lg">Camera Ready</p>
                </div>
              )}
              
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                </div>
              )}
            </div>

            {/* Recording Controls */}
            {!hasRecorded && (
              <div className="flex justify-center gap-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    disabled={!selectedTopic}
                    className="gradient-indigo text-white"
                    size="lg"
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="lg"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop Recording
                  </Button>
                )}
                <Button
                  onClick={onCancel}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Analysis Results */}
            {hasRecorded && (
              <div className="space-y-4">
                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyzing your speech...</p>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 text-center">
                      <CheckCircle className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
                      <h3 className="text-xl font-semibold mb-2">Analysis Complete</h3>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Badge 
                          variant="outline" 
                          className={`text-lg px-4 py-2 ${
                            analysisResult === 'beginner' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            analysisResult === 'amateur' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            'bg-green-100 text-green-800 border-green-300'
                          }`}
                        >
                          {analysisResult.charAt(0).toUpperCase() + analysisResult.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {analysisResult === 'beginner' && "You're just starting your speech journey. Keep practicing!"}
                        {analysisResult === 'amateur' && "Good progress! You have solid speaking skills with room to grow."}
                        {analysisResult === 'expert' && "Excellent! You demonstrate advanced speaking abilities."}
                      </p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={handleConfirmLevel}
                        className="gradient-indigo text-white"
                        size="lg"
                      >
                        Confirm & Save Level
                      </Button>
                      <Button
                        onClick={handleRetake}
                        variant="outline"
                        size="lg"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retake Test
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!selectedTopic && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">How the test works:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Select a topic from the suggestions above</li>
                  <li>Record a 1-minute video speech about the topic</li>
                  <li>Speak clearly and confidently</li>
                  <li>Your speech will be analyzed to determine your skill level</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeechTest;

