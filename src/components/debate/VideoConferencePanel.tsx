
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
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-fuchsia-500 to-cyan-400 rounded-full flex items-center justify-center mb-3 relative overflow-hidden shadow-neon">
              <Bot className="h-10 w-10 text-white drop-shadow-lg" />
              
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-30"></div>
              <div className="absolute inset-0 rounded-full border-2 border-fuchsia-400 animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
              
              {/* Thinking indicator */}
              {aiThinking && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse shadow-neon">
                  <Brain className="h-2 w-2 text-yellow-800 mx-auto mt-0.5" />
                </div>
              )}
            </div>
            
            {/* AI Name and Status */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white font-orbitron neon-text">Chanakya AI</h3>
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-4 w-4 text-yellow-400 drop-shadow-neon" />
                <span className="text-sm text-gray-300">
                  {aiThinking ? 'Analyzing arguments...' : 'Ready for debate'}
                </span>
              </div>
            </div>
          </div>
          
          {/* AI Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
            <div className="bg-fuchsia-500/20 rounded p-2 border border-fuchsia-400/30">
              <div className="font-bold text-fuchsia-400">Expertise</div>
              <div className="text-white">98%</div>
            </div>
            <div className="bg-cyan-500/20 rounded p-2 border border-cyan-400/30">
              <div className="font-bold text-cyan-400">Speed</div>
              <div className="text-white">Instant</div>
            </div>
            <div className="bg-blue-500/20 rounded p-2 border border-blue-400/30">
              <div className="font-bold text-blue-400">Wins</div>
              <div className="text-white">∞</div>
            </div>
          </div>
          
          {/* Animated dots */}
          {aiThinking && (
            <div className="flex justify-center space-x-1 mt-4">
              <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce shadow-neon"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-neon" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce shadow-neon" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="card-neon h-full">
      <div className="p-4 border-b border-cyan-400/30">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center space-x-2 text-lg font-bold text-white font-orbitron">
            <Video className="h-5 w-5 text-cyan-400 drop-shadow-neon" />
            <span className="neon-text">Video Conference</span>
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-800/50 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-64 lg:h-80">
          {/* Local Video */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-cyan-400/30 shadow-neon">
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
                <div className="text-center text-gray-300">
                  <CameraOff className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm">Camera Off</p>
                </div>
              </div>
            )}
            
            {/* Local Video Overlay */}
            <div className="absolute top-2 left-2">
              <div className="badge-neon text-xs">
                You (FOR)
              </div>
            </div>
            
            {/* Audio Indicator */}
            {!isMicOn && (
              <div className="absolute top-2 right-2">
                <div className="px-2 py-1 bg-red-500/80 text-white text-xs rounded-md flex items-center space-x-1">
                  <MicOff className="h-3 w-3" />
                  <span>Muted</span>
                </div>
              </div>
            )}
          </div>

          {/* Remote Video / AI Opponent */}
          <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-cyan-400/30 shadow-neon">
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
                <div className="text-center text-gray-300">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm">Waiting for opponent...</p>
                </div>
              </div>
            )}
            
            {/* Remote Video Overlay */}
            {debateType === 'ai' ? (
              <div className="absolute top-2 left-2">
                <div className="px-2 py-1 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white text-xs rounded-md flex items-center space-x-1">
                  <Bot className="h-3 w-3" />
                  <span>Chanakya AI</span>
                </div>
              </div>
            ) : remoteStream && (
              <div className="absolute top-2 left-2">
                <div className="px-2 py-1 bg-red-500/80 text-white text-xs rounded-md">
                  Opponent (AGAINST)
                </div>
              </div>
            )}
            
            {/* AI Status Indicator */}
            {debateType === 'ai' && (
              <div className="absolute top-2 right-2">
                <div className={`px-2 py-1 text-xs rounded-md flex items-center space-x-1 ${aiThinking ? 'bg-yellow-500/80 text-black' : 'bg-green-500/80 text-white'}`}>
                  <Zap className="h-3 w-3" />
                  <span>{aiThinking ? 'Thinking' : 'Ready'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Screen Share Video (if active) */}
        {isScreenSharing && (
          <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-orange-400/50">
            <video
              ref={screenShareRef}
              autoPlay
              playsInline
              className="w-full h-32 object-contain"
            />
            <div className="absolute top-2 left-2">
              <div className="px-2 py-1 bg-orange-500/80 text-white text-xs rounded-md">
                Screen Sharing
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleCamera}
            className={`rounded-full w-12 h-12 p-0 flex items-center justify-center transition-all duration-300 ${
              isCameraOn 
                ? 'bg-green-500 hover:bg-green-400 text-white border border-green-400/50 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                : 'bg-gray-800/50 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500'
            }`}
          >
            {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
          </button>
          
          <button
            onClick={toggleMicrophone}
            className={`rounded-full w-12 h-12 p-0 flex items-center justify-center transition-all duration-300 ${
              isMicOn 
                ? 'bg-blue-500 hover:bg-blue-400 text-white border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                : 'bg-gray-800/50 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500'
            }`}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>
          
          <button
            onClick={toggleScreenShare}
            className={`rounded-full w-12 h-12 p-0 flex items-center justify-center transition-all duration-300 ${
              isScreenSharing 
                ? 'bg-orange-500 hover:bg-orange-400 text-white border border-orange-400/50 shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
                : 'bg-gray-800/50 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500'
            }`}
          >
            {isScreenSharing ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>
          
          <button className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-gray-800/50 border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Participants List */}
        <div className="border-t border-cyan-400/30 pt-4">
          <h4 className="font-semibold text-sm text-cyan-400 mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Participants ({participants.length})
          </h4>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getParticipantSideColor(participant.side)}`} />
                  <span className="text-sm font-medium text-white">{participant.name}</span>
                  <div className={`px-2 py-1 text-white text-xs rounded-md ${getParticipantSideColor(participant.side)}`}>
                    {getParticipantSideText(participant.side)}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!participant.videoEnabled && (
                    <CameraOff className="h-3 w-3 text-gray-400" />
                  )}
                  {!participant.audioEnabled && (
                    <MicOff className="h-3 w-3 text-gray-400" />
                  )}
                  {participant.isSpeaking && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-neon" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConferencePanel;
