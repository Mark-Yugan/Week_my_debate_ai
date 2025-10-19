import React, { useState, useEffect } from 'react';
import { DebateService } from '../services/DebateService.js';
import { DebateMessage as DbDebateMessage } from '../types/debate-history.js';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Trophy, 
  User, 
  Bot, 
  MessageSquare, 
  Target, 
  Zap,
  Download,
  Share2,
  Eye,
  BarChart3,
  Timer,
  Users,
  Brain
} from 'lucide-react';

interface DebateMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  turn?: number;
}

interface DebateDetailViewProps {
  debate: {
    id: string;
    topic: string;
    display_status: string;
    difficulty: string;
    user_position: string;
    topic_type: string;
    created_at: string;
    message_count: number;
    total_turns: number;
    session_duration: number;
  };
  onBack: () => void;
}

export default function DebateDetailView({ debate, onBack }: DebateDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'chat'>('overview');
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const response = await DebateService.getDebateSession(debate.id);
        if (response.success && response.data) {
          const formattedMessages = response.data.messages.map((msg: DbDebateMessage) => ({
            id: msg.id,
            sender: msg.speaker,
            content: msg.message_text,
            timestamp: msg.timestamp,
            turn: msg.turn_number
          }));
          setMessages(formattedMessages);
        } else {
          setError(response.error || 'Failed to load debate messages');
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
        setError('Failed to load debate messages');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [debate.id]);

  const formatDuration = (seconds: number): string => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) return `${remainingSeconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const handleExport = () => {
    console.log('Exporting debate...');
  };

  const handleShare = () => {
    console.log('Sharing debate...');
  };

  const getSenderColor = (sender: string) => {
    switch (sender) {
      case 'user':
        return 'bg-cyan-500 border border-cyan-400/50';
      case 'ai':
        return 'bg-fuchsia-500 border border-fuchsia-400/50';
      case 'system':
        return 'bg-amber-500 border border-amber-400/50';
      default:
        return 'bg-gray-500 border border-gray-400/50';
    }
  };

  const getSenderLabel = (sender: string) => {
    switch (sender) {
      case 'user':
        return 'You';
      case 'ai':
        return 'AI Opponent';
      case 'system':
        return 'System';
      default:
        return sender;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="card-neon p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="btn-neon-secondary flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Debates</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="btn-neon-secondary flex items-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={handleExport}
                className="btn-neon-primary flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1 mr-8">
              <h1 className="text-2xl md:text-3xl font-bold font-orbitron neon-text mb-4 leading-tight">
                {debate.topic}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className={`inline-flex items-center gap-2 badge-neon font-medium ${
                  debate.display_status === 'Completed'
                    ? 'text-emerald-300 border-emerald-400/50 bg-emerald-400/10'
                    : debate.display_status === 'In Progress'
                    ? 'text-amber-300 border-amber-400/50 bg-amber-400/10'
                    : 'text-gray-300 border-gray-400/50 bg-gray-400/10'
                }`}>
                  <Trophy className="w-4 h-4" />
                  {debate.display_status}
                </div>
                <div className={`inline-flex items-center gap-2 badge-neon font-medium ${
                  debate.difficulty === 'easy'
                    ? 'text-emerald-300 border-emerald-400/50 bg-emerald-400/10'
                    : debate.difficulty === 'medium'
                    ? 'text-amber-300 border-amber-400/50 bg-amber-400/10'
                    : 'text-red-300 border-red-400/50 bg-red-400/10'
                }`}>
                  <Target className="w-4 h-4" />
                  {debate.difficulty.charAt(0).toUpperCase() + debate.difficulty.slice(1)}
                </div>
                <div className="inline-flex items-center gap-2 badge-neon text-cyan-300 border-cyan-400/50 bg-cyan-400/10 font-medium">
                  <Calendar className="w-4 h-4" />
                  {new Date(debate.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-inter">Duration: {formatDuration(debate.session_duration || 0)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-inter">{debate.message_count} messages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-neon p-6 text-center hover:shadow-neon transition-all duration-300">
            <div className="w-12 h-12 bg-cyan-400/20 border border-cyan-400/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-orbitron text-white mb-1">{debate.total_turns}</div>
            <div className="text-sm text-gray-300 font-inter">Debate Rounds</div>
          </div>
          
          <div className="card-neon p-6 text-center hover:shadow-neon transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-400/20 border border-emerald-400/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-orbitron text-white mb-1">{debate.message_count}</div>
            <div className="text-sm text-gray-300 font-inter">Total Messages</div>
          </div>
          
          <div className="card-neon p-6 text-center hover:shadow-neon transition-all duration-300">
            <div className="w-12 h-12 bg-fuchsia-400/20 border border-fuchsia-400/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Timer className="w-6 h-6 text-fuchsia-400" />
            </div>
            <div className="text-2xl font-bold font-orbitron text-white mb-1">
              {debate.session_duration && debate.total_turns 
                ? Math.round(debate.session_duration / debate.total_turns) 
                : 0}s
            </div>
            <div className="text-sm text-gray-300 font-inter">Avg. Response</div>
          </div>
          
          <div className="card-neon p-6 text-center hover:shadow-neon transition-all duration-300">
            <div className="w-12 h-12 bg-amber-400/20 border border-amber-400/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-orbitron text-white mb-1">
              {debate.user_position === 'for' ? 'Pro' : 'Con'}
            </div>
            <div className="text-sm text-gray-300 font-inter">Your Position</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="card-neon mb-8">
          <div className="border-b border-gray-700/50">
            <nav className="flex space-x-8 px-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm font-inter transition-colors duration-200 ${
                  activeTab === 'overview'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-cyan-400 hover:border-cyan-400/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-4 px-1 border-b-2 font-medium text-sm font-inter transition-colors duration-200 ${
                  activeTab === 'chat'
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-cyan-400 hover:border-cyan-400/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Full Conversation ({messages.length})
                </div>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Debate Information */}
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/30">
                  <h2 className="text-xl font-semibold font-orbitron text-white mb-6 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-amber-400" />
                    Debate Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">Topic</label>
                        <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/30">
                          <p className="text-white font-medium font-inter">{debate.topic}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">Your Position</label>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium badge-neon ${
                          debate.user_position === 'for'
                            ? 'text-cyan-300 border-cyan-400/50 bg-cyan-400/10'
                            : 'text-red-300 border-red-400/50 bg-red-400/10'
                        }`}>
                          {debate.user_position === 'for' ? (
                            <>
                              <User className="w-4 h-4" />
                              Supporting
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4" />
                              Opposing
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">Topic Type</label>
                        <div className="inline-flex items-center gap-2 px-4 py-2 badge-neon text-fuchsia-300 border-fuchsia-400/50 bg-fuchsia-400/10 font-medium">
                          {debate.topic_type === 'custom' ? (
                            <>
                              <Zap className="w-4 h-4" />
                              Custom Topic
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Scenario Based
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">Difficulty Level</label>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium badge-neon ${
                          debate.difficulty === 'easy'
                            ? 'text-emerald-300 border-emerald-400/50 bg-emerald-400/10'
                            : debate.difficulty === 'medium'
                            ? 'text-amber-300 border-amber-400/50 bg-amber-400/10'
                            : 'text-red-300 border-red-400/50 bg-red-400/10'
                        }`}>
                          <Target className="w-4 h-4" />
                          {debate.difficulty.charAt(0).toUpperCase() + debate.difficulty.slice(1)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                          debate.display_status === 'Completed'
                            ? 'bg-green-100 text-green-700'
                            : debate.display_status === 'In Progress'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          <Clock className="w-4 h-4" />
                          {debate.display_status}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-2 text-gray-900">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(debate.created_at).toLocaleDateString()}</span>
                            <span className="text-gray-500">at</span>
                            <span>{new Date(debate.created_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Preview */}
                {loading ? (
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading debate messages...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <div className="text-center">
                      <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Messages</h3>
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/30">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold font-orbitron text-white flex items-center gap-3">
                        <Eye className="w-6 h-6 text-emerald-400" />
                        Debate Preview
                      </h2>
                      <button
                        onClick={() => setActiveTab('chat')}
                        className="btn-neon-primary flex items-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        View Full Chat
                      </button>
                    </div>
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.slice(0, 3).map((message: DebateMessage) => (
                          <div key={message.id} className="flex gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-600/30">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getSenderColor(message.sender)}`}>
                              {message.sender === 'user' ? (
                                <User className="w-5 h-5 text-white" />
                              ) : (
                                <Bot className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium font-orbitron text-white">{getSenderLabel(message.sender)}</span>
                                <span className="text-xs text-gray-400 font-inter">
                                  {formatTimestamp(message.timestamp)}
                                </span>
                                {message.turn && (
                                  <span className="badge-neon text-cyan-300 border-cyan-400/50 bg-cyan-400/10 text-xs px-2 py-1">
                                    Turn {message.turn}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-200 font-inter leading-relaxed">
                                {message.content.length > 200 
                                  ? `${message.content.substring(0, 200)}...` 
                                  : message.content
                                }
                              </p>
                            </div>
                          </div>
                        ))}
                        {messages.length > 3 && (
                          <div className="text-center py-4">
                            <p className="text-gray-400 font-inter mb-4">
                              And {messages.length - 3} more messages...
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 font-inter">No messages found in this debate.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold font-orbitron text-white flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-cyan-400" />
                    Full Debate Conversation
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-300 font-inter">
                      {messages.length} messages
                    </span>
                    <button 
                      onClick={handleExport}
                      className="btn-neon-secondary flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-gray-300 font-inter">Loading debate messages...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-400 mb-4">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold font-orbitron text-red-300 mb-2">Failed to Load Messages</h3>
                    <p className="text-red-400 font-inter">{error}</p>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-6 max-h-[600px] overflow-y-auto">
                    {messages.map((message: DebateMessage, index) => (
                      <div key={message.id} className="flex gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${getSenderColor(message.sender)}`}>
                          {message.sender === 'user' ? (
                            <User className="w-5 h-5 text-white" />
                          ) : (
                            <Bot className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold font-orbitron text-white">{getSenderLabel(message.sender)}</span>
                                {message.turn && (
                                  <span className="badge-neon text-cyan-300 border-cyan-400/50 bg-cyan-400/10 text-xs px-3 py-1 font-medium">
                                    Turn {message.turn}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 font-inter">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <p className="text-gray-200 font-inter leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold font-orbitron text-gray-400 mb-2">No Messages Found</h3>
                    <p className="text-gray-500 font-inter">This debate doesn't have any messages yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
