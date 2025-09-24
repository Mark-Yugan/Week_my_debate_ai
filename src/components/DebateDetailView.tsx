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
        return 'bg-blue-500';
      case 'ai':
        return 'bg-gray-500';
      case 'system':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Debates</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button 
                onClick={handleExport}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1 mr-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {debate.topic}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                  debate.display_status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : debate.display_status === 'In Progress'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <Trophy className="w-4 h-4" />
                  {debate.display_status}
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                  debate.difficulty === 'easy'
                    ? 'bg-green-100 text-green-700'
                    : debate.difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  <Target className="w-4 h-4" />
                  {debate.difficulty.charAt(0).toUpperCase() + debate.difficulty.slice(1)}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium">
                  <Calendar className="w-4 h-4" />
                  {new Date(debate.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Duration: {formatDuration(debate.session_duration || 0)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">{debate.message_count} messages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{debate.total_turns}</div>
            <div className="text-sm text-gray-600">Debate Rounds</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{debate.message_count}</div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Timer className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {debate.session_duration && debate.total_turns 
                ? Math.round(debate.session_duration / debate.total_turns) 
                : 0}s
            </div>
            <div className="text-sm text-gray-600">Avg. Response</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {debate.user_position === 'for' ? 'Pro' : 'Con'}
            </div>
            <div className="text-sm text-gray-600">Your Position</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Overview
                </div>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'chat'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Debate Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <p className="text-gray-900 font-medium">{debate.topic}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Position</label>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                          debate.user_position === 'for'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Topic Type</label>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-medium">
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
                          debate.difficulty === 'easy'
                            ? 'bg-green-100 text-green-700'
                            : debate.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
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
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                        <Eye className="w-6 h-6 text-green-500" />
                        Debate Preview
                      </h2>
                      <button
                        onClick={() => setActiveTab('chat')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        View Full Chat
                      </button>
                    </div>
                    {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.slice(0, 3).map((message: DebateMessage) => (
                          <div key={message.id} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getSenderColor(message.sender)}`}>
                              {message.sender === 'user' ? (
                                <User className="w-5 h-5 text-white" />
                              ) : (
                                <Bot className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-900">{getSenderLabel(message.sender)}</span>
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(message.timestamp)}
                                </span>
                                {message.turn && (
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                                    Turn {message.turn}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-700 leading-relaxed">
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
                            <p className="text-gray-600 mb-4">
                              And {messages.length - 3} more messages...
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No messages found in this debate.</p>
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
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                    Full Debate Conversation
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {messages.length} messages
                    </span>
                    <button 
                      onClick={handleExport}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading debate messages...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-600 mb-4">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Messages</h3>
                    <p className="text-red-600">{error}</p>
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
                          <div className="bg-gray-50 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-900">{getSenderLabel(message.sender)}</span>
                                {message.turn && (
                                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                                    Turn {message.turn}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(message.timestamp)}
                              </span>
                            </div>
                            <div className="prose prose-sm max-w-none">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Messages Found</h3>
                    <p className="text-gray-500">This debate doesn't have any messages yet.</p>
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
