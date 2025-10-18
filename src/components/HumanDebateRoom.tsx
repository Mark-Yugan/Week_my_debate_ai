import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Trophy, 
  MessageSquare, 
  Mic, 
  MicOff, 
  Volume2, 
  Send, 
  Timer, 
  Star, 
  Copy, 
  UserPlus, 
  LogIn, 
  Share2, 
  Link, 
  CheckCircle, 
  Eye,
  Bot,
  User,
  Video,
  Camera,
  CameraOff,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { debateHistoryService } from '@/services/temporaryDebateHistoryService';
import type { 
  HumanDebateRecord, 
  ChatMessage, 
  Participant, 
  RoomUser 
} from '@/types/debate';
import { createClient } from '@supabase/supabase-js';
// Add imports for modular video utilities
import PeerConnection from '@/lib/PeerConnection';
import MediaDevice from '@/lib/MediaDevice.js';

const supabaseUrl = 'https://wyxrtubbrxttmnpyrrae.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5eHJ0dWJicnh0dG1ucHlycmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NTY1MjQsImV4cCI6MjA2NzAzMjUyNH0.tF_KUO6do5K6G395hHMXxULTMWdKXMquRmBavw4xL0Y';

export const supabase = createClient(supabaseUrl, supabaseKey);

interface HumanDebateRoomProps {
  topic: string;
  onExit: () => void;
  roomId?: string;
}

const HumanDebateRoom = ({ topic, onExit, roomId }: HumanDebateRoomProps) => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Room state
  const [currentRoomId, setCurrentRoomId] = useState<string>(roomId || '');
  const [isRoomHost, setIsRoomHost] = useState<boolean>(!!roomId);
  const [roomStatus, setRoomStatus] = useState<'waiting' | 'active' | 'completed'>('waiting');
  const [waitingForOpponent, setWaitingForOpponent] = useState(!roomId);
  
  // User state
  const [currentUser, setCurrentUser] = useState<RoomUser | null>(null);
  const [selectedSide, setSelectedSide] = useState<'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' | null>(null);
  
  // Participants and messages
  const [participants, setParticipants] = useState<RoomUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  
  // UI state
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');
  const [debateEnded, setDebateEnded] = useState(false);
  
  // Debate state
  const [speakingTime, setSpeakingTime] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<string>('');
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Video call state
  const [showVideoPanel, setShowVideoPanel] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [userId: string]: MediaStream }>({});
  const [isCameraOn, setIsCameraOn] = useState(false);
  // Replace peerConnectionsRef and related logic with modular PeerConnection usage
  const peerConnectionsRef = useRef<{ [userId: string]: any }>({});
  const localMediaDeviceRef = useRef<any>(null);
  const userId = currentUser?.id || `user_${Date.now()}`;
  
  // Add preRoom state
  const [preRoom, setPreRoom] = useState(true);
  const [createTopic, setCreateTopic] = useState('');
  // Add roomTopic state
  const [roomTopic, setRoomTopic] = useState('');
  const [cameraStates, setCameraStates] = useState<{ [userId: string]: boolean }>({});

  // Supabase Realtime Channel state
  const channelRef = useRef<any>(null);
  const [channelReady, setChannelReady] = useState(false);
  const [isInitialSync, setIsInitialSync] = useState(false);

  // Negotiation lock per remote user
  const negotiationLocks = useRef<{ [userId: string]: boolean }>({});

  // Add local audio mute state
  const [isMicOn, setIsMicOn] = useState(true);

  // Refactor camera/mic toggle logic to use MediaDevice
  const handleToggleCamera = async () => {
    // Enforce only two debaters (FOR/AGAINST) can have camera on
    const isDebater = selectedSide === 'FOR' || selectedSide === 'AGAINST';
    if (!isDebater) {
      toast({
        title: 'Role Restriction',
        description: 'Only debaters (FOR/AGAINST) can turn on their camera.',
        variant: 'destructive',
      });
      return;
    }
    // Count active debater cameras (excluding self if camera is off)
    const activeDebaterCameras = participants.filter(
      p => (p.side === 'FOR' || p.side === 'AGAINST') && cameraStates[p.id] && p.id !== currentUser?.id
    ).length + (isCameraOn ? 1 : 0);
    if (!isCameraOn && activeDebaterCameras >= 2) {
      toast({
        title: 'Camera Limit Reached',
        description: 'Two debaters are already using their cameras. Please wait for one to turn off theirs.',
        variant: 'destructive',
      });
      return;
    }
    if (!isCameraOn) {
      if (!localMediaDeviceRef.current) {
        localMediaDeviceRef.current = new MediaDevice();
      }
      localMediaDeviceRef.current.on('stream', (stream: MediaStream) => {
        setLocalStream(stream);
        setIsCameraOn(true);
        setIsMicOn(true);
        setCameraError(null);
        // For all peer connections, replace video track
        Object.entries(peerConnectionsRef.current).forEach(([remoteUserId, pc]) => {
          const videoTrack = stream.getVideoTracks()[0];
          if (videoTrack && sendersRef.current[remoteUserId]?.video) {
            sendersRef.current[remoteUserId].video?.replaceTrack(videoTrack);
          } else if (videoTrack && pc.pc) {
            // If no sender yet, add it
            const sender = pc.pc.addTrack(videoTrack, stream);
            if (!sendersRef.current[remoteUserId]) sendersRef.current[remoteUserId] = {};
            sendersRef.current[remoteUserId].video = sender;
          }
        });
      }).start();
    } else {
      if (localMediaDeviceRef.current) {
        localMediaDeviceRef.current.stop();
        setLocalStream(null);
      }
      setIsCameraOn(false);
      setIsMicOn(true);
      setCameraError(null);
      // For all peer connections, replace video track with null
      Object.entries(peerConnectionsRef.current).forEach(([remoteUserId, pc]) => {
        if (sendersRef.current[remoteUserId]?.video) {
          sendersRef.current[remoteUserId].video?.replaceTrack(null);
        }
      });
    }
  };

  const handleToggleMic = () => {
    if (localMediaDeviceRef.current) {
      localMediaDeviceRef.current.toggle('Audio');
      setIsMicOn((prev) => !prev);
      // For all peer connections, toggle audio track enabled
      Object.entries(peerConnectionsRef.current).forEach(([remoteUserId, pc]) => {
        if (sendersRef.current[remoteUserId]?.audio) {
          const track = sendersRef.current[remoteUserId].audio?.track;
          if (track) track.enabled = !isMicOn;
        }
      });
    }
  };

  // Download transcript handler
  const handleDownloadTranscript = () => {
    // Header: topic
    const lines = [`Debate Topic: ${roomTopic || topic}`];
    // List of users and roles
    lines.push('\nParticipants:');
    participants.forEach(p => {
      lines.push(`- ${p.name} (${p.side || 'UNKNOWN'})`);
    });
    lines.push('\nMessages:');
    // Message log
    messages.forEach(msg => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      lines.push(`[${time}] ${msg.senderName}: ${msg.text}`);
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate-transcript-${currentRoomId || 'room'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Refactor peer connection creation to use PeerConnection class
  function createPeerConnection(remoteUserId: string) {
    const pc = new PeerConnection(remoteUserId);
    // Polite: true if our id > remote id (string compare)
    politeRef.current[remoteUserId] = currentUser && currentUser.id > remoteUserId;
    makingOfferRef.current[remoteUserId] = false;
    ignoreOfferRef.current[remoteUserId] = false;
    iceCandidateBufferRef.current[remoteUserId] = [];

    // Forward local ICE candidates to signaling
    pc.on('icecandidate', (candidate: RTCIceCandidate) => {
      if (candidate && channelRef.current && currentUser) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { from: currentUser.id, to: remoteUserId, candidate }
        });
      }
    });
    // Handle remote stream
    pc.on('peerStream', (stream: MediaStream) => {
      setRemoteStreams(prev => ({ ...prev, [remoteUserId]: stream }));
    });
    // negotiationneeded for perfect negotiation
    if (pc.pc) {
      pc.pc.onnegotiationneeded = async () => {
        try {
          makingOfferRef.current[remoteUserId] = true;
          const offer = await pc.pc.createOffer();
          if (pc.pc.signalingState !== 'stable') return;
          await pc.pc.setLocalDescription(offer);
          if (channelRef.current && currentUser) {
            channelRef.current.send({
              type: 'broadcast',
              event: 'video-offer',
              payload: { from: currentUser.id, to: remoteUserId, offer }
            });
          }
        } catch (err) {
          // ignore
        } finally {
          makingOfferRef.current[remoteUserId] = false;
        }
      };
    }
    // Start connection if local stream is available
    if (localStream) {
      // Add audio first, then video (fixed order)
      let audioTrack = localStream.getAudioTracks()[0];
      let videoTrack = localStream.getVideoTracks()[0];
      sendersRef.current[remoteUserId] = {};
      if (audioTrack) {
        const sender = pc.pc?.addTrack(audioTrack, localStream);
        if (sender) sendersRef.current[remoteUserId].audio = sender;
      }
      if (videoTrack) {
        const sender = pc.pc?.addTrack(videoTrack, localStream);
        if (sender) sendersRef.current[remoteUserId].video = sender;
      }
    }
    return pc;
  }

  // Supabase presence and broadcast sync effect
  useEffect(() => {
    setChannelReady(false);
    setIsInitialSync(false);
    if (!currentRoomId || !currentUser) return;

    // Subscribe to the room channel
    const channel = supabase.channel('debate-room-' + currentRoomId, {
      config: { presence: { key: currentUser.id } }
    });
    channelRef.current = channel;

    // Listen for presence sync
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      // Flatten presence state to array
      const users: RoomUser[] = Object.values(state).flat().map((u: any) => ({
        id: u.id,
        name: u.name,
        side: u.side,
        isActive: u.isActive,
        joinedAt: u.joinedAt,
        lastSeen: u.lastSeen
      }));
      setParticipants(users);
      // Update cameraStates
      const camStates: { [userId: string]: boolean } = {};
      Object.values(state).flat().forEach((u: any) => {
        camStates[u.id] = !!u.cameraOn;
      });
      setCameraStates(camStates);
    });

    // Listen for presence join/leave
    channel.on('presence', { event: 'join' }, ({ newPresences }) => {
      setParticipants(prev => ([...prev, ...newPresences]));
      setCameraStates(prev => {
        const copy = { ...prev };
        newPresences.forEach((u: any) => { copy[u.id] = !!u.cameraOn; });
        return copy;
      });
    });
    channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
      setParticipants(prev => prev.filter(p => !leftPresences.some((lp: any) => lp.id === p.id)));
      setCameraStates(prev => {
        const copy = { ...prev };
        leftPresences.forEach((u: any) => { delete copy[u.id]; });
        return copy;
      });
    });

    // Listen for broadcasted state sync
    channel.on('broadcast', { event: 'sync_state' }, ({ payload }) => {
      if (!payload.targetUserId || payload.targetUserId === currentUser?.id) {
        if (payload.topic !== undefined) setRoomTopic(payload.topic);
        if (payload.roomStatus !== undefined) setRoomStatus(payload.roomStatus);
        if (payload.messages !== undefined) setMessages(payload.messages);
        setIsInitialSync(true);
      }
    });

    // Listen for broadcasted topic/status changes
    channel.on('broadcast', { event: 'update_topic' }, ({ payload }) => {
      setRoomTopic(payload.topic);
    });
    channel.on('broadcast', { event: 'update_status' }, ({ payload }) => {
      setRoomStatus(payload.roomStatus);
    });
    channel.on('broadcast', { event: 'new_message' }, ({ payload }) => {
      setMessages(prev => [...prev, payload.message]);
    });

    // Listen for state requests (host only)
    channel.on('broadcast', { event: 'request_state' }, ({ payload }) => {
      if (isRoomHost) {
        channel.send({
          type: 'broadcast',
          event: 'sync_state',
          payload: {
            topic: roomTopic,
            roomStatus,
            messages,
            targetUserId: payload.userId
          }
        });
      }
    });

    // Subscribe and track presence only after SUBSCRIBED
    channel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        setChannelReady(true);
        channel.track({
          id: currentUser.id,
          name: currentUser.name,
          side: currentUser.side,
          isActive: true,
          joinedAt: currentUser.joinedAt,
          lastSeen: new Date().toISOString()
        });
        // If not host, request state
        if (!isRoomHost) {
          channel.send({ type: 'broadcast', event: 'request_state', payload: { userId: currentUser.id } });
        } else {
          // Host: set initial sync true
          setIsInitialSync(true);
        }
      }
    });

    // Cleanup on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [currentRoomId, currentUser, isRoomHost]);

  // Broadcast topic change (host only)
  useEffect(() => {
    if (isRoomHost && channelRef.current && channelReady && isInitialSync) {
      channelRef.current.send({ type: 'broadcast', event: 'update_topic', payload: { topic: roomTopic } });
    }
  }, [roomTopic, isRoomHost, channelReady, isInitialSync]);

  // Broadcast status change (host only)
  useEffect(() => {
    if (isRoomHost && channelRef.current && channelReady && isInitialSync) {
      channelRef.current.send({ type: 'broadcast', event: 'update_status', payload: { roomStatus } });
    }
  }, [roomStatus, isRoomHost, channelReady, isInitialSync]);

  // Initialize user
  useEffect(() => {
    const userId = `user_${Date.now()}`;
    const userName = `User_${Math.floor(Math.random() * 1000)}`;
    
    setCurrentUser({
      id: userId,
      name: userName,
      side: null,
      isActive: true,
      joinedAt: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    });
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Auto-save debate to history
  useEffect(() => {
    if (currentRoomId && participants.length > 0) {
      saveDebateToHistory();
    }
  }, [currentRoomId, participants, messages, roomStatus]);

  const generateRoomId = () => {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const copyRoomId = () => {
    if (currentRoomId) {
      navigator.clipboard.writeText(currentRoomId);
      toast({
        title: 'Room ID Copied',
        description: 'Room ID has been copied to clipboard',
      });
    }
  };

  // Update handleCreateRoom to set roomTopic
  const handleCreateRoom = () => {
    if (!createTopic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a debate topic to create a room',
        variant: 'destructive',
      });
      return;
    }
    const newRoomId = generateRoomId();
    setCurrentRoomId(newRoomId);
    setIsRoomHost(true);
    setRoomStatus('waiting');
    setWaitingForOpponent(true);
    setPreRoom(false);
    setRoomTopic(createTopic.trim());
    toast({
      title: 'Room Created',
      description: `Room ID: ${newRoomId}`,
    });
  };

  const handleJoinRoom = () => {
    if (!joinRoomId.trim()) {
      toast({
        title: 'Invalid Room ID',
        description: 'Please enter a valid room ID',
        variant: 'destructive',
      });
      return;
    }
    setCurrentRoomId(joinRoomId);
    setIsRoomHost(false);
    setRoomStatus('waiting');
    setWaitingForOpponent(false);
    setIsJoinDialogOpen(false);
    setPreRoom(false);
    // Do not reset roomTopic/messages; will sync from host
    // Do not add user as participant yet; wait for role selection
    toast({
      title: 'Joined Room',
      description: `Successfully joined room: ${joinRoomId}`,
    });
  };

  // Remove selectSide Yjs logic, just update currentUser and selectedSide
  const selectSide = (side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR') => {
    setSelectedSide(side);
    if (currentUser) {
      setCurrentUser({ ...currentUser, side });
    }
  };

  // Remove Yjs cleanup effect
  useEffect(() => {
    return () => {
      if (currentUser && channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [currentUser]);

  // Update handleSendMessage to broadcast
  const handleSendMessage = () => {
    if (!currentMessage.trim() || !currentUser || !selectedSide || !channelRef.current || !channelReady) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: currentMessage.trim(),
      side: selectedSide,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Broadcast message
    channelRef.current.send({ type: 'broadcast', event: 'new_message', payload: { message: newMessage } });
  };

  // Update handleStartDebate to broadcast
  const handleStartDebate = () => {
    if (participants.length < 2) {
      toast({
        title: 'Not Enough Participants',
        description: 'Need at least 2 participants to start debate',
        variant: 'destructive',
      });
      return;
    }

    setRoomStatus('active');
    setWaitingForOpponent(false);

    // Add system message
    const systemMessage: ChatMessage = {
      id: `sys_${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      text: `Debate started! Topic: ${roomTopic}`,
      side: 'OBSERVER',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, systemMessage]);

    toast({
      title: 'Debate Started',
      description: 'The debate is now active!',
    });

    // Broadcast status and system message
    if (channelRef.current && channelReady) {
      channelRef.current.send({ type: 'broadcast', event: 'update_status', payload: { roomStatus: 'active' } });
      channelRef.current.send({ type: 'broadcast', event: 'new_message', payload: { message: systemMessage } });
    }
  };

  // Update handleEndDebate to broadcast
  const handleEndDebate = () => {
    setRoomStatus('completed');
    setDebateEnded(true);

    // Add system message
    const systemMessage: ChatMessage = {
      id: `sys_${Date.now()}`,
      senderId: 'system',
      senderName: 'System',
      text: 'Debate ended!',
      side: 'OBSERVER',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, systemMessage]);

    toast({
      title: 'Debate Ended',
      description: 'The debate has been completed',
    });

    // Broadcast status and system message
    if (channelRef.current && channelReady) {
      channelRef.current.send({ type: 'broadcast', event: 'update_status', payload: { roomStatus: 'completed' } });
      channelRef.current.send({ type: 'broadcast', event: 'new_message', payload: { message: systemMessage } });
    }
  };

  const saveDebateToHistory = async () => {
    try {
      const debateRecord: HumanDebateRecord = {
        id: currentRoomId,
        roomId: currentRoomId,
        topic,
        hostName: participants.find(p => p.side === 'FOR')?.name || 'Unknown',
        participants: participants.map(p => ({
          id: p.id,
          name: p.name,
          side: p.side || 'OBSERVER',
          joinedAt: p.joinedAt,
          isActive: p.isActive,
          lastSeen: p.lastSeen
        })),
        messages,
        createdAt: new Date().toISOString(),
        endedAt: roomStatus === 'completed' ? new Date().toISOString() : undefined,
        status: roomStatus,
        winner: roomStatus === 'completed' ? 'DRAW' : undefined
      };

      await debateHistoryService.saveDebate(debateRecord);
    } catch (error) {
      console.error('Error saving debate to history:', error);
    }
  };

  const getMessageIcon = (side: string) => {
    switch (side) {
      case 'FOR':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'AGAINST':
        return <Trophy className="h-4 w-4 text-red-600" />;
      case 'OBSERVER':
        return <Eye className="h-4 w-4 text-blue-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMessageStyles = (side: string, isCurrentUser: boolean) => {
    const baseStyles = 'max-w-[85%] rounded-2xl px-5 py-4 relative';
    
    if (isCurrentUser) {
      return `${baseStyles} bg-azul text-white shadow-sm ml-auto`;
    }
    
    switch (side) {
      case 'FOR':
        return `${baseStyles} bg-green-600 text-white shadow-sm`;
      case 'AGAINST':
        return `${baseStyles} bg-red-600 text-white shadow-sm`;
      case 'OBSERVER':
        return `${baseStyles} bg-steel-blue text-white shadow-sm`;
      default:
        return `${baseStyles} bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md`;
    }
  };

  const renderRoomStatus = () => {
    if (!currentRoomId) {
      return (
        <Card className="mb-4 border-dashed border-blue-300 bg-blue-50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center mb-3">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-800">Human Debate Room</h3>
            </div>
            
            <div className="text-sm text-blue-700 mb-4">
              Create a debate room and invite opponents, or join an existing room.
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={handleCreateRoom}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Room
              </Button>
              
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={() => setIsJoinDialogOpen(true)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Join Room
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="mb-4 border-dashed border-yellow-300 bg-yellow-50">
        <CardContent className="pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-yellow-800">
                {isRoomHost ? 'Your Room' : 'Joined Room'}
              </h3>
            </div>
            <Badge 
              variant={roomStatus === 'active' ? 'default' : 'outline'}
              className={roomStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
            >
              {roomStatus === 'active' ? 'Debate Active' : 'Waiting for participants...'}
            </Badge>
          </div>
          
          <div className="text-sm text-yellow-600 mb-2">
            Room ID: <span className="font-mono font-bold">{currentRoomId}</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 w-6 p-0 ml-2" 
              onClick={copyRoomId}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="text-xs text-yellow-600">
            {participants.length} participant{participants.length !== 1 ? 's' : ''} • 
            {participants.filter(p => p.side === 'FOR').length} FOR • 
            {participants.filter(p => p.side === 'AGAINST').length} AGAINST • 
            {participants.filter(p => p.side === 'OBSERVER').length} Observer{participants.filter(p => p.side === 'OBSERVER').length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRoleSelection = () => {
    if (selectedSide) return null;

    return (
      <Card className="mb-4 border-2 border-yellow-300 bg-yellow-50">
        <CardContent className="pt-4 pb-4">
          <h4 className="font-semibold text-yellow-800 mb-3 text-center">Choose Your Role</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1" 
              onClick={() => selectSide('FOR')}
              variant="outline"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Join FOR
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => selectSide('AGAINST')}
              variant="outline"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Join AGAINST
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => selectSide('EVALUATOR')}
              variant="outline"
            >
              <Star className="h-4 w-4 mr-2" />
              Join as Evaluator
            </Button>
            <Button 
              className="flex-1" 
              onClick={() => selectSide('OBSERVER')}
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              Observe Only
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMessages = () => (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUser?.id;
        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={getMessageStyles(message.side, isCurrentUser)}>
              <div className="flex items-center space-x-2 mb-2">
                {getMessageIcon(message.side)}
                <span className="text-sm font-bold opacity-90">
                  {message.senderName}
                </span>
                <span className="text-xs opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed">
                {message.text}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );

  const renderParticipants = () => (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-900 mb-3">Participants</h4>
      
      {participants.filter(p => p.side === 'FOR').length > 0 && (
        <div className="mb-3">
          <h5 className="text-sm font-medium text-green-700 mb-2">FOR the motion</h5>
          {participants
            .filter(p => p.side === 'FOR')
            .map(participant => (
              <div key={participant.id} className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                {cameraStates[participant.id] ? (
                  <span aria-label="Camera On">
                    <Camera className="h-3 w-3 text-blue-500" />
                  </span>
                ) : (
                  <span aria-label="Camera Off">
                    <CameraOff className="h-3 w-3 text-gray-400" />
                  </span>
                )}
                <span className="text-sm">{participant.name}</span>
                {participant.id === currentUser?.id && (
                  <Badge variant="outline" className="text-xs">You</Badge>
                )}
              </div>
            ))}
        </div>
      )}
      
      {participants.filter(p => p.side === 'AGAINST').length > 0 && (
        <div className="mb-3">
          <h5 className="text-sm font-medium text-red-700 mb-2">AGAINST the motion</h5>
          {participants
            .filter(p => p.side === 'AGAINST')
            .map(participant => (
              <div key={participant.id} className="flex items-center space-x-2 mb-1">
                <Trophy className="h-3 w-3 text-red-600" />
                {cameraStates[participant.id] ? (
                  <span aria-label="Camera On">
                    <Camera className="h-3 w-3 text-blue-500" />
                  </span>
                ) : (
                  <span aria-label="Camera Off">
                    <CameraOff className="h-3 w-3 text-gray-400" />
                  </span>
                )}
                <span className="text-sm">{participant.name}</span>
                {participant.id === currentUser?.id && (
                  <Badge variant="outline" className="text-xs">You</Badge>
                )}
              </div>
            ))}
        </div>
      )}
      
      {participants.filter(p => p.side === 'EVALUATOR').length > 0 && (
        <div className="mb-3">
          <h5 className="text-sm font-medium text-yellow-700 mb-2">Evaluators</h5>
          {participants
            .filter(p => p.side === 'EVALUATOR')
            .map(participant => (
              <div key={participant.id} className="flex items-center space-x-2 mb-1">
                <Star className="h-3 w-3 text-yellow-600" />
                {cameraStates[participant.id] ? (
                  <span aria-label="Camera On">
                    <Camera className="h-3 w-3 text-blue-500" />
                  </span>
                ) : (
                  <span aria-label="Camera Off">
                    <CameraOff className="h-3 w-3 text-gray-400" />
                  </span>
                )}
                <span className="text-sm">{participant.name}</span>
                {participant.id === currentUser?.id && (
                  <Badge variant="outline" className="text-xs">You</Badge>
                )}
              </div>
            ))}
        </div>
      )}
      {participants.filter(p => p.side === 'OBSERVER').length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-blue-700 mb-2">Observers</h5>
          {participants
            .filter(p => p.side === 'OBSERVER')
            .map(participant => (
              <div key={participant.id} className="flex items-center space-x-2 mb-1">
                <Eye className="h-3 w-3 text-blue-600" />
                {cameraStates[participant.id] ? (
                  <span aria-label="Camera On">
                    <Camera className="h-3 w-3 text-blue-500" />
                  </span>
                ) : (
                  <span aria-label="Camera Off">
                    <CameraOff className="h-3 w-3 text-gray-400" />
                  </span>
                )}
                <span className="text-sm">{participant.name}</span>
                {participant.id === currentUser?.id && (
                  <Badge variant="outline" className="text-xs">You</Badge>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );

  // Add polite, makingOffer, and ignoreOffer refs for perfect negotiation
  const politeRef = useRef<{ [userId: string]: boolean }>({});
  const makingOfferRef = useRef<{ [userId: string]: boolean }>({});
  const ignoreOfferRef = useRef<{ [userId: string]: boolean }>({});
  const iceCandidateBufferRef = useRef<{ [userId: string]: RTCIceCandidateInit[] }>({});
  const sendersRef = useRef<{ [userId: string]: { audio?: RTCRtpSender, video?: RTCRtpSender } }>({});

  // --- WebRTC signaling and mesh logic ---
  // Refactor signaling event handlers to use PeerConnection API
  useEffect(() => {
    if (!channelRef.current || !channelReady || !currentUser) return;

    const handleVideoOffer = async ({ payload }: any) => {
      const { from, offer } = payload;
      if (from === currentUser.id) return;
      let pc = peerConnectionsRef.current[from];
      if (!pc) {
        pc = createPeerConnection(from);
        peerConnectionsRef.current[from] = pc;
      }
      const polite = politeRef.current[from];
      const makingOffer = makingOfferRef.current[from];
      // Offer collision detection
      const offerCollision = makingOffer || (pc.pc && pc.pc.signalingState !== 'stable');
      if (!polite && offerCollision) {
        // Impolite peer ignores offer
        ignoreOfferRef.current[from] = true;
        return;
      }
      ignoreOfferRef.current[from] = false;
      try {
        if (offerCollision && polite) {
          // Polite peer rolls back and accepts remote offer
          await pc.pc?.setLocalDescription({ type: 'rollback' });
        }
        await pc.setRemoteDescription(offer);
        // Flush buffered ICE candidates
        if (iceCandidateBufferRef.current[from]) {
          for (const candidate of iceCandidateBufferRef.current[from]) {
            await pc.addIceCandidate(candidate);
          }
          iceCandidateBufferRef.current[from] = [];
        }
        const answer = await pc.pc?.createAnswer();
        if (answer) {
          await pc.pc?.setLocalDescription(answer);
          channelRef.current.send({
            type: 'broadcast',
            event: 'video-answer',
            payload: { from: currentUser.id, to: from, answer }
          });
        }
      } catch (err) {
        // ignore
      }
    };

    const handleVideoAnswer = async ({ payload }: any) => {
      const { from, answer } = payload;
      if (from === currentUser.id) return;
      const pc = peerConnectionsRef.current[from];
      if (pc && pc.pc) {
        try {
          // Only set remote answer if NOT in 'stable' state
          if (pc.pc.signalingState !== 'stable') {
            await pc.setRemoteDescription(answer);
            // Flush buffered ICE candidates
            if (iceCandidateBufferRef.current[from]) {
              for (const candidate of iceCandidateBufferRef.current[from]) {
                await pc.addIceCandidate(candidate);
              }
              iceCandidateBufferRef.current[from] = [];
            }
          } else {
            // Ignore unexpected answer
            console.log('Ignoring answer: connection already stable');
          }
        } catch (err) {
          // Optionally log error
          console.error('Error setting remote answer:', err);
        }
      }
    };

    const handleIceCandidate = async ({ payload }: any) => {
      const { from, candidate } = payload;
      if (from === currentUser.id) return;
      const pc = peerConnectionsRef.current[from];
      if (pc && candidate) {
        // Always buffer ICE candidates until remoteDescription is set
        if (pc.pc && pc.pc.remoteDescription && pc.pc.remoteDescription.type) {
          await pc.addIceCandidate(candidate);
        } else {
          if (!iceCandidateBufferRef.current[from]) iceCandidateBufferRef.current[from] = [];
          iceCandidateBufferRef.current[from].push(candidate);
        }
      }
    };

    // Handle camera-off event
    const handleCameraOff = ({ payload }: any) => {
      const { userId } = payload;
      const pc = peerConnectionsRef.current[userId];
      if (pc) {
        pc.stop();
        delete peerConnectionsRef.current[userId];
        setRemoteStreams(prev => {
          const copy = { ...prev };
          delete copy[userId];
          return copy;
        });
        console.log(`[${currentUser.id}] Closed peer connection to ${userId} due to camera-off`);
      }
    };

    channelRef.current.on('broadcast', { event: 'video-offer' }, handleVideoOffer);
    channelRef.current.on('broadcast', { event: 'video-answer' }, handleVideoAnswer);
    channelRef.current.on('broadcast', { event: 'ice-candidate' }, handleIceCandidate);
    channelRef.current.on('broadcast', { event: 'camera-off' }, handleCameraOff);

    return undefined;
  }, [channelReady, currentUser, localStream]);

  // Update mesh connection logic for full connectivity
  useEffect(() => {
    if (!currentUser) return;
    // Create peer connections for ALL other users, not just debaters
    const allOtherUserIds = participants.filter(p => p.id !== currentUser.id).map(p => p.id);
    allOtherUserIds.forEach((userId) => {
      if (!peerConnectionsRef.current[userId]) {
        const pc = createPeerConnection(userId);
        peerConnectionsRef.current[userId] = pc;
        // Add local tracks if camera is on
        if (isCameraOn && localStream) {
          // Add audio first, then video (fixed order)
          let audioTrack = localStream.getAudioTracks()[0];
          let videoTrack = localStream.getVideoTracks()[0];
          sendersRef.current[userId] = {};
          if (audioTrack) {
            const sender = pc.pc?.addTrack(audioTrack, localStream);
            if (sender) sendersRef.current[userId].audio = sender;
          }
          if (videoTrack) {
            const sender = pc.pc?.addTrack(videoTrack, localStream);
            if (sender) sendersRef.current[userId].video = sender;
          }
          // Trigger negotiation (send offer)
          pc.pc?.createOffer().then((offer: RTCSessionDescriptionInit) => {
            if (pc.pc?.signalingState === 'stable') {
              pc.pc?.setLocalDescription(offer);
              if (channelRef.current && currentUser) {
                channelRef.current.send({
                  type: 'broadcast',
                  event: 'video-offer',
                  payload: { from: currentUser.id, to: userId, offer }
                });
              }
            }
          });
        }
      }
    });
    // Clean up connections to users who are no longer present
    Object.keys(peerConnectionsRef.current).forEach((userId) => {
      if (!allOtherUserIds.includes(userId)) {
        const pc = peerConnectionsRef.current[userId];
        if (pc) pc.stop();
        delete peerConnectionsRef.current[userId];
        setRemoteStreams((prev) => {
          const copy = { ...prev };
          delete copy[userId];
          return copy;
        });
      }
    });
  }, [participants, currentUser, localStream, isCameraOn]);

  // When local camera is toggled on, add tracks to all PeerConnections and trigger negotiation
  useEffect(() => {
    if (!isCameraOn || !localStream) return;
    Object.entries(peerConnectionsRef.current).forEach(([remoteUserId, pc]) => {
      // Add local tracks
      // Add audio first, then video (fixed order)
      let audioTrack = localStream.getAudioTracks()[0];
      let videoTrack = localStream.getVideoTracks()[0];
      sendersRef.current[remoteUserId] = {};
      if (audioTrack) {
        const sender = pc.pc?.addTrack(audioTrack, localStream);
        if (sender) sendersRef.current[remoteUserId].audio = sender;
      }
      if (videoTrack) {
        const sender = pc.pc?.addTrack(videoTrack, localStream);
        if (sender) sendersRef.current[remoteUserId].video = sender;
      }
      // Trigger negotiation (send offer)
      pc.pc?.createOffer().then(offer => {
        if (pc.pc?.signalingState === 'stable') {
          pc.pc?.setLocalDescription(offer);
          if (channelRef.current && currentUser) {
            channelRef.current.send({
              type: 'broadcast',
              event: 'video-offer',
              payload: { from: currentUser.id, to: remoteUserId, offer }
            });
          }
        }
      });
    });
  }, [isCameraOn, localStream]);

  // When camera is turned off, close all peer connections and broadcast camera-off
  useEffect(() => {
    if (!isCameraOn) {
      Object.keys(peerConnectionsRef.current).forEach(userId => {
        const pc = peerConnectionsRef.current[userId];
        if (pc) pc.stop();
        delete peerConnectionsRef.current[userId];
      });
      setRemoteStreams({});
      if (channelRef.current && currentUser) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'camera-off',
          payload: { userId: currentUser.id }
        });
        console.log(`[${currentUser?.id}] Broadcasted camera-off`);
      }
      console.log(`[${currentUser?.id}] Closed all peer connections (camera off)`);
    }
  }, [isCameraOn]);

  // When camera is toggled, update presence
  useEffect(() => {
    if (!currentUser || !channelRef.current || !channelReady) return;
    channelRef.current.track({
      id: currentUser.id,
      name: currentUser.name,
      side: currentUser.side,
      isActive: true,
      joinedAt: currentUser.joinedAt,
      lastSeen: new Date().toISOString(),
      cameraOn: isCameraOn
    });
    console.log(`[${currentUser.id}] Updated presence: cameraOn=${isCameraOn}`);
  }, [isCameraOn, currentUser, channelReady]);

  // 1. Add camera error state
  const [cameraError, setCameraError] = useState<string | null>(null);

  const canSendVideo = selectedSide === 'FOR' || selectedSide === 'AGAINST';

  // --- Add Recheck Video logic ---
  const handleRecheckVideo = () => {
    if (!currentUser) return;
    // For all participants except self
    const allOtherUserIds = participants.filter(p => p.id !== currentUser.id).map(p => p.id);
    allOtherUserIds.forEach((userId) => {
      let pc = peerConnectionsRef.current[userId];
      if (!pc) {
        // Re-create missing peer connection
        pc = createPeerConnection(userId);
        peerConnectionsRef.current[userId] = pc;
        // Add local tracks if camera is on
        if (isCameraOn && localStream) {
          // Add audio first, then video (fixed order)
          let audioTrack = localStream.getAudioTracks()[0];
          let videoTrack = localStream.getVideoTracks()[0];
          sendersRef.current[userId] = {};
          if (audioTrack) {
            const sender = pc.pc?.addTrack(audioTrack, localStream);
            if (sender) sendersRef.current[userId].audio = sender;
          }
          if (videoTrack) {
            const sender = pc.pc?.addTrack(videoTrack, localStream);
            if (sender) sendersRef.current[userId].video = sender;
          }
        }
      }
      // Only send offer if signalingState is 'stable'
      if (pc && pc.pc && pc.pc.signalingState === 'stable') {
        pc.pc.createOffer().then((offer: RTCSessionDescriptionInit) => {
          pc.pc?.setLocalDescription(offer);
          if (channelRef.current && currentUser) {
            channelRef.current.send({
              type: 'broadcast',
              event: 'video-offer',
              payload: { from: currentUser.id, to: userId, offer }
            });
          }
        });
      } else {
        // Optionally, log or queue negotiation for later
        console.log(`PeerConnection to ${userId} not stable, skipping offer`);
      }
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header bar always visible */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onExit} className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Exit Room</span>
              </Button>
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Human Debate Room
                </h1>
              </div>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {roomStatus === 'active' ? 'Live' : 'Waiting'}
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {participants.length} participant{participants.length !== 1 ? 's' : ''}
                </span>
              </div>
              {currentRoomId && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowVideoPanel(!showVideoPanel)}
                >
                  <Video className="h-4 w-4 mr-2" />
                  {showVideoPanel ? 'Hide Video' : 'Show Video'}
                </Button>
              )}
            </div>
          </div>
          {!preRoom && (
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium mb-2">
                Topic: {roomTopic}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Main content conditional below header */}
      {preRoom ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Card className="w-full max-w-md mx-auto mt-20 p-8 border-2 border-indigo-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-indigo-600" />
                <span>Start a Human Debate Room</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Debate Topic</label>
                  <Input
                    placeholder="Enter debate topic..."
                    value={createTopic}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreateTopic(e.target.value)}
                    className="mb-2"
                  />
                  <Button className="w-full" onClick={handleCreateRoom}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Room
                  </Button>
                </div>
                <div className="flex items-center justify-center my-2">
                  <span className="text-gray-400 text-xs">or</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Code</label>
                  <Input
                    placeholder="Enter Room ID to join..."
                    value={joinRoomId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJoinRoomId(e.target.value)}
                    className="mb-2"
                  />
                  <Button className="w-full" onClick={handleJoinRoom}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Join Room
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Sidebar - Participants */}
              <div className="lg:col-span-1">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-indigo-600" />
                      <span>Participants</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderParticipants()}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content - Messages */}
              <div className="lg:col-span-3">
                {renderRoomStatus()}
                {renderRoleSelection()}
                {/* Video Panel */}
                {showVideoPanel && currentRoomId && (
                  <Card className="card-shadow mb-4">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Video className="h-5 w-5 text-blue-600" />
                        <span>Video Conference</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-64">
                        {/* Local Video */}
                        <div className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-40">
                          {isCameraOn && localStream ? (
                            <video
                              autoPlay
                              playsInline
                              muted
                              ref={el => {
                                if (el && localStream) el.srcObject = localStream;
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center text-white">
                              <CameraOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm opacity-75">Camera Off</p>
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-green-600 text-white text-xs">You</Badge>
                          </div>
                          {/* Show mute icon if muted */}
                          {!isMicOn && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="destructive" className="text-xs">
                                <MicOff className="h-3 w-3 mr-1" />
                                Muted
                              </Badge>
                            </div>
                          )}
                        </div>
                        {/* Remote Videos - show all in a grid */}
                        {Object.entries(remoteStreams).length === 0 ? (
                          <div className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-40 col-span-1 md:col-span-1 lg:col-span-2">
                            <div className="text-center text-white">
                              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm opacity-75">No remote video</p>
                            </div>
                          </div>
                        ) : (
                          Object.entries(remoteStreams).map(([uid, stream]) => {
                            // Find if remote user is muted
                            const remoteUser = participants.find(p => p.id === uid);
                            const isRemoteDebater = remoteUser && (remoteUser.side === 'FOR' || remoteUser.side === 'AGAINST');
                            // We can't know remote mute state directly, so just show video
                            return (
                              <div key={uid} className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-40">
                                <video
                                  autoPlay
                                  playsInline
                                  ref={el => {
                                    if (el && stream) el.srcObject = stream;
                                  }}
                                  className="w-full h-full object-cover mb-2"
                                />
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-blue-600 text-white text-xs">
                                    {remoteUser?.name || 'Remote'}
                                  </Badge>
                                </div>
                                {/* Optionally, if you want to show a mute icon for remote, you would need to signal mute state over the channel */}
                              </div>
                            );
                          })
                        )}
                      </div>
                      {/* Persistent camera error UI */}
                      {cameraError && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">
                          <CameraOff className="inline h-5 w-5 mr-2 align-middle" />
                          {cameraError}
                        </div>
                      )}
                      {/* Only FOR/AGAINST can see the camera/mic toggle buttons */}
                      {canSendVideo && (
                        <div className="flex items-center justify-center space-x-4 mt-4">
                          <Button
                            variant={isCameraOn ? 'default' : 'outline'}
                            size="sm"
                            onClick={handleToggleCamera}
                          >
                            {isCameraOn ? <Camera className="h-4 w-4 mr-2" /> : <CameraOff className="h-4 w-4 mr-2" />}
                            {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
                          </Button>
                          {/* Mute/unmute button */}
                          <Button
                            variant={isMicOn ? 'default' : 'outline'}
                            size="sm"
                            onClick={handleToggleMic}
                            disabled={!isCameraOn}
                          >
                            {isMicOn ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                            {isMicOn ? 'Mute' : 'Unmute'}
                          </Button>
                        </div>
                      )}
                      {/* Recheck Video button for all users */}
                      <div className="flex items-center justify-center mt-4">
                        <Button variant="outline" size="sm" onClick={handleRecheckVideo}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Recheck Video
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-indigo-600" />
                        <span>Debate Messages</span>
                      </div>
                      {isRoomHost && roomStatus === 'waiting' && participants.length >= 2 && (
                        <Button onClick={handleStartDebate} size="sm">
                          Start Debate
                        </Button>
                      )}
                      {roomStatus === 'active' && selectedSide !== 'OBSERVER' && (
                        <Button onClick={handleEndDebate} size="sm" variant="destructive">
                          End Debate
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-500 mb-2">
                            No messages yet
                          </h3>
                          <p className="text-sm text-gray-400">
                            Start the debate to see messages here
                          </p>
                        </div>
                      ) : (
                        renderMessages()
                      )}
                    </div>
                    
                    {selectedSide && roomStatus === 'active' && (
                      <div className="flex space-x-2">
                        <Textarea
                          value={currentMessage}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentMessage(e.target.value)}
                          placeholder={`Send a message as ${selectedSide}...`}
                          className="flex-1"
                          onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        />
                        <Button onClick={handleSendMessage} disabled={!currentMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Join Room Dialog is not needed anymore, as join is handled in preRoom UI */}
      {roomStatus === 'completed' && (
        <div className="flex justify-center my-6">
          <Button onClick={handleDownloadTranscript}>
            Download Transcript
          </Button>
        </div>
      )}
    </div>
  );
};

export default HumanDebateRoom; 