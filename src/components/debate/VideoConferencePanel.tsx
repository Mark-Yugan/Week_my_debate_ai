
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Users,
  Settings,
  Maximize,
  Minimize,
  Phone,
  PhoneOff,
  Bot,
  Brain,
  Sparkles,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Participant {
  id: string;
  name: string;
  side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
  videoEnabled: boolean;
  audioEnabled: boolean;
  isSpeaking: boolean;
  stream?: MediaStream;
}

interface VideoConferencePanelProps {
  participants: Participant[];
  debateType: 'ai' | '1v1' | 'mun';
  onToggleVideo: (participantId: string) => void;
  onToggleAudio: (participantId: string) => void;
  onLeaveCall?: () => void;
  roomId?: string;
}

const VideoConferencePanel: React.FC<VideoConferencePanelProps> = ({
  participants,
  debateType,
  onToggleVideo,
  onToggleAudio,
  onLeaveCall,
  roomId
}) => {
  const { toast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);

  // Initialize camera access
  useEffect(() => {
    initializeCamera();
    return () => {
      cleanupStreams();
    };
  }, []);

  // Update video elements when streams change
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Simulate AI thinking animation for AI debates
  useEffect(() => {
    if (debateType === 'ai') {
      const interval = setInterval(() => {
        setAiThinking(prev => !prev);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [debateType]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Error",
        description: "Failed to access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const cleanupStreams = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleCamera = async () => {
    if (isCameraOn && localStream) {
      // Turn off camera
      localStream.getVideoTracks().forEach(track => {
        track.enabled = false;
      });
      setIsCameraOn(false);
      onToggleVideo('local');
    } else if (localStream) {
      // Turn on camera
      localStream.getVideoTracks().forEach(track => {
        track.enabled = true;
      });
      setIsCameraOn(true);
      onToggleVideo('local');
    } else {
      // Initialize camera
      await initializeCamera();
    }
  };

  const toggleMicrophone = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicOn(!isMicOn);
      onToggleAudio('local');
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });
        
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        
        // Handle screen share stop
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (screenShareRef.current) {
            screenShareRef.current.srcObject = null;
          }
        };
      } else {
        setIsScreenSharing(false);
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = null;
        }
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
      toast({
        title: "Screen Share Error",
        description: "Failed to start screen sharing.",
        variant: "destructive",
      });
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getParticipantSideColor = (side: string) => {
    switch (side) {
      case 'FOR': return 'bg-green-500';
      case 'AGAINST': return 'bg-red-500';
      case 'OBSERVER': return 'bg-blue-500';
      case 'EVALUATOR': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getParticipantSideText = (side: string) => {
    switch (side) {
      case 'FOR': return 'FOR';
      case 'AGAINST': return 'AGAINST';
      case 'OBSERVER': return 'Observer';
      case 'EVALUATOR': return 'Evaluator';
      default: return 'Unknown';
    }
  };

  const renderAIOpponent = () => {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-white">
          <div className="relative mb-4">
            {/* AI Avatar */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full flex items-center justify-center mb-3 relative overflow-hidden">
              <Bot className="h-10 w-10 text-white" />
              
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Thinking indicator */}
              {aiThinking && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse">
                  <Brain className="h-2 w-2 text-yellow-800 mx-auto mt-0.5" />
                </div>
              )}
            </div>
            
            {/* AI Name and Status */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Chanakya AI</h3>
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-300">
                  {aiThinking ? 'Analyzing arguments...' : 'Ready for debate'}
                </span>
              </div>
            </div>
          </div>
          
          {/* AI Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
            <div className="bg-purple-800/50 rounded p-2">
              <div className="font-bold text-purple-300">Expertise</div>
              <div className="text-white">98%</div>
            </div>
            <div className="bg-indigo-800/50 rounded p-2">
              <div className="font-bold text-indigo-300">Speed</div>
              <div className="text-white">Instant</div>
            </div>
            <div className="bg-blue-800/50 rounded p-2">
              <div className="font-bold text-blue-300">Wins</div>
              <div className="text-white">∞</div>
            </div>
          </div>
          
          {/* Animated dots */}
          {aiThinking && (
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Video className="h-4 w-4 text-blue-600" />
            <span>Video Conference</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="h-7 px-2"
            >
              {isFullscreen ? <Minimize className="h-3 w-3" /> : <Maximize className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-64 lg:h-80">
          {/* Local Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            {isCameraOn && localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <CameraOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Camera Off</p>
                </div>
              </div>
            )}
            
            {/* Local Video Overlay */}
            <div className="absolute top-2 left-2">
              <Badge className={`${getParticipantSideColor('FOR')} text-white text-xs`}>
                You (FOR)
              </Badge>
            </div>
            
            {/* Audio Indicator */}
            {!isMicOn && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="text-xs">
                  <MicOff className="h-3 w-3 mr-1" />
                  Muted
                </Badge>
              </div>
            )}
          </div>

          {/* Remote Video / AI Opponent */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            {debateType === 'ai' ? (
              renderAIOpponent()
            ) : remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm opacity-75">Waiting for opponent...</p>
                </div>
              </div>
            )}
            
            {/* Remote Video Overlay */}
            {debateType === 'ai' ? (
              <div className="absolute top-2 left-2">
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs">
                  <Bot className="h-3 w-3 mr-1" />
                  Chanakya AI
                </Badge>
              </div>
            ) : remoteStream && (
              <div className="absolute top-2 left-2">
                <Badge className={`${getParticipantSideColor('AGAINST')} text-white text-xs`}>
                  Opponent (AGAINST)
                </Badge>
              </div>
            )}
            
            {/* AI Status Indicator */}
            {debateType === 'ai' && (
              <div className="absolute top-2 right-2">
                <Badge className={`text-xs ${aiThinking ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                  <Zap className="h-3 w-3 mr-1" />
                  {aiThinking ? 'Thinking' : 'Ready'}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Screen Share Video (if active) */}
        {isScreenSharing && (
          <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={screenShareRef}
              autoPlay
              playsInline
              className="w-full h-32 object-contain"
            />
            <div className="absolute top-2 left-2">
              <Badge className="bg-orange-500 text-white text-xs">
                Screen Sharing
              </Badge>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant={isCameraOn ? "default" : "outline"}
            size="lg"
            onClick={toggleCamera}
            className="rounded-full w-12 h-12 p-0"
          >
            {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isMicOn ? "default" : "outline"}
            size="lg"
            onClick={toggleMicrophone}
            className="rounded-full w-12 h-12 p-0"
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isScreenSharing ? "default" : "outline"}
            size="lg"
            onClick={toggleScreenShare}
            className="rounded-full w-12 h-12 p-0"
          >
            {isScreenSharing ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-12 h-12 p-0"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Participants List */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Participants ({participants.length})
          </h4>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getParticipantSideColor(participant.side)}`} />
                  <span className="text-sm font-medium">{participant.name}</span>
                  <Badge className={`${getParticipantSideColor(participant.side)} text-white text-xs`}>
                    {getParticipantSideText(participant.side)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {!participant.videoEnabled && (
                    <CameraOff className="h-3 w-3 text-gray-400" />
                  )}
                  {!participant.audioEnabled && (
                    <MicOff className="h-3 w-3 text-gray-400" />
                  )}
                  {participant.isSpeaking && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoConferencePanel;
