import React, { useState, useEffect } from 'react';
import { DebateService } from '../services/DebateService.js';
import { useCustomAuth } from '@/hooks/useCustomAuth';
import { Search, Filter, Calendar, Clock, Trophy, User, Bot, ChevronDown, Eye, Trash2, Download, Share2, SortDesc, SortAsc } from 'lucide-react';

interface DebateHistoryViewerProps {
  onViewSession?: (sessionId: string) => void;
  onBack?: () => void;
  onViewDebate?: (debate: any) => void;
}

interface FilterState {
  status: string;
  difficulty: string;
  position: string;
  topicType: string;
  dateRange: string;
}

interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

export default function DebateHistoryViewer({ onViewSession, onBack, onViewDebate }: DebateHistoryViewerProps) {
  const { user, isAuthenticated } = useCustomAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    difficulty: 'all',
    position: 'all',
    topicType: 'all',
    dateRange: 'all'
  });
  
  const [sort, setSort] = useState<SortState>({
    field: 'created_at',
    direction: 'desc'
  });
  
  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
    totalTurns: 0,
    avgDuration: 0
  });
  
  // Load debate history from database
  useEffect(() => {
    const loadDebateHistory = async () => {
      if (!isAuthenticated || !user?.id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const [historyResult, statsResult] = await Promise.all([
          DebateService.getDebateHistory(1, 100, user.id),
          DebateService.getUserDebateStats(user.id)
        ]);
        
        if (historyResult.success && historyResult.data) {
          setSessions(historyResult.data);
        } else {
          setError(historyResult.error || 'Failed to load debate history');
        }
        
        if (statsResult.success && statsResult.data) {
          setStats({
            total: statsResult.data.total_debates,
            completed: statsResult.data.completed_debates,
            active: statsResult.data.active_debates,
            totalTurns: statsResult.data.total_turns,
            avgDuration: statsResult.data.avg_session_duration
          });
        }
      } catch (err) {
        console.error('Error loading debate history:', err);
        setError('Failed to load debate history');
      } finally {
        setLoading(false);
      }
    };

    loadDebateHistory();
  }, [isAuthenticated, user?.id]);

  // Advanced filtering and sorting
  const filteredAndSortedSessions = React.useMemo(() => {
    let filtered = sessions.filter(session => {
      // Search filter
      if (searchTerm && !session.topic.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && session.display_status.toLowerCase() !== filters.status) {
        return false;
      }
      
      // Difficulty filter
      if (filters.difficulty !== 'all' && session.difficulty !== filters.difficulty) {
        return false;
      }
      
      // Position filter
      if (filters.position !== 'all' && session.user_position !== filters.position) {
        return false;
      }
      
      // Topic type filter
      if (filters.topicType !== 'all' && session.topic_type !== filters.topicType) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange !== 'all') {
        const sessionDate = new Date(session.created_at);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (filters.dateRange) {
          case 'today':
            if (diffDays > 0) return false;
            break;
          case 'week':
            if (diffDays > 7) return false;
            break;
          case 'month':
            if (diffDays > 30) return false;
            break;
        }
      }
      
      return true;
    });
    
    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue = a[sort.field];
      let bValue = b[sort.field];
      
      if (sort.field === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sort.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [sessions, searchTerm, filters, sort]);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Cyberpunk Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-fuchsia-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            {onBack && (
              <button 
                onClick={onBack}
                className="btn-neon-secondary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
            )}
            
            <div className="text-right">
              <h1 className="text-4xl font-bold font-orbitron neon-text">
                Debate History
              </h1>
              <p className="text-gray-300 mt-1 font-inter">Track your intellectual journey</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="card-neon">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 font-inter">Total Debates</p>
                  <p className="text-2xl font-bold text-cyan-400 font-orbitron">{stats.total}</p>
                </div>
                <div className="p-3 bg-cyan-400/20 rounded-xl border border-cyan-400/30">
                  <Trophy className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </div>
            
            <div className="card-neon">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 font-inter">Completed</p>
                  <p className="text-2xl font-bold text-green-400 font-orbitron">{stats.completed}</p>
                </div>
                <div className="p-3 bg-green-400/20 rounded-xl border border-green-400/30">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="card-neon">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 font-inter">Active</p>
                  <p className="text-2xl font-bold text-orange-400 font-orbitron">{stats.active}</p>
                </div>
                <div className="p-3 bg-orange-400/20 rounded-xl border border-orange-400/30">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </div>
            
            <div className="card-neon">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 font-inter">Total Turns</p>
                  <p className="text-2xl font-bold text-fuchsia-400 font-orbitron">{stats.totalTurns}</p>
                </div>
                <div className="p-3 bg-fuchsia-400/20 rounded-xl border border-fuchsia-400/30">
                  <svg className="w-6 h-6 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="card-neon">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300 font-inter">Avg Duration</p>
                  <p className="text-2xl font-bold text-violet-400 font-orbitron">{Math.round(stats.avgDuration / 60)}m</p>
                </div>
                <div className="p-3 bg-violet-400/20 rounded-xl border border-violet-400/30">
                  <Calendar className="w-6 h-6 text-violet-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="card-neon mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search debates by topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-neon w-full pl-12 pr-4"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all duration-200 font-inter ${
                showFilters 
                  ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400' 
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:border-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <select
                value={sort.field}
                onChange={(e) => setSort(prev => ({ ...prev, field: e.target.value }))}
                className="px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800/80 text-gray-200 font-inter"
              >
                <option value="created_at">Date Created</option>
                <option value="topic">Topic</option>
                <option value="difficulty">Difficulty</option>
                <option value="total_turns">Turns</option>
                <option value="session_duration">Duration</option>
              </select>
              
              <button
                onClick={() => setSort(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                className="p-3 border border-gray-700 rounded-xl hover:bg-gray-700/50 hover:border-gray-600 text-gray-300 hover:text-cyan-400 transition-all duration-200"
              >
                {sort.direction === 'desc' ? <SortDesc className="w-5 h-5" /> : <SortAsc className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-400 mb-2 font-inter">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800/80 text-gray-200 font-inter"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="in progress">In Progress</option>
                    <option value="started">Started</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-cyan-400 mb-2 font-inter">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800/80 text-gray-200 font-inter"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-cyan-400 mb-2 font-inter">Position</label>
                  <select
                    value={filters.position}
                    onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800/80 text-gray-200 font-inter"
                  >
                    <option value="all">All Positions</option>
                    <option value="for">Supporting</option>
                    <option value="against">Opposing</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-cyan-400 mb-2 font-inter">Topic Type</label>
                  <select
                    value={filters.topicType}
                    onChange={(e) => setFilters(prev => ({ ...prev, topicType: e.target.value }))}
                    className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800/80 text-gray-200 font-inter"
                  >
                    <option value="all">All Types</option>
                    <option value="custom">Custom</option>
                    <option value="scenario">Scenario</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-cyan-400 mb-2 font-inter">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full p-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-gray-800/80 text-gray-200 font-inter"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
              
              {/* Clear Filters Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilters({
                      status: 'all',
                      difficulty: 'all',
                      position: 'all',
                      topicType: 'all',
                      dateRange: 'all'
                    });
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors font-inter"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center gap-3 text-gray-300">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="text-lg font-inter">Loading your debate history...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="card-neon max-w-md mx-auto">
                <div className="text-red-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-400 mb-2 font-orbitron">
                  {error?.includes('User') ? 'Authentication Required' : 'Failed to Load'}
                </h3>
                <p className="text-gray-300 mb-4 font-inter">
                  {error?.includes('User') ? 'Please sign in to view your debate history.' : error}
                </p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-neon-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredAndSortedSessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="card-neon max-w-md mx-auto">
                {searchTerm || Object.values(filters).some(f => f !== 'all') ? (
                  <>
                    <div className="text-cyan-400 mb-4">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2 font-orbitron">No Results Found</h3>
                    <p className="text-gray-300 mb-4 font-inter">
                      No debates match your current search and filter criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilters({
                          status: 'all',
                          difficulty: 'all',
                          position: 'all',
                          topicType: 'all',
                          dateRange: 'all'
                        });
                      }}
                      className="btn-neon-primary"
                    >
                      Clear Filters
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-cyan-400 mb-4">
                      <Trophy className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2 font-orbitron">No Debates Yet</h3>
                    <p className="text-gray-300 font-inter">Start your first debate to see your history here!</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-300 font-inter">
                  Showing <span className="font-semibold text-cyan-400">{filteredAndSortedSessions.length}</span> of{' '}
                  <span className="font-semibold text-cyan-400">{sessions.length}</span> debates
                </p>
              </div>
              
              {/* Debate Cards */}
              <div className="grid gap-6">
                {filteredAndSortedSessions.map((session: any) => (
                  <div
                    key={session.id}
                    className="card-neon hover:shadow-neon transition-all duration-300 group overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors font-orbitron">
                            {session.topic}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`badge-neon text-xs font-medium font-inter ${
                              session.display_status === 'Completed' 
                                ? 'bg-green-400/20 text-green-400 border-green-400/30'
                                : session.display_status === 'In Progress'
                                ? 'bg-orange-400/20 text-orange-400 border-orange-400/30'
                                : 'bg-gray-400/20 text-gray-400 border-gray-400/30'
                            }`}>
                              {session.display_status}
                            </span>
                            <span className={`badge-neon text-xs font-medium font-inter ${
                              session.difficulty === 'easy'
                                ? 'bg-cyan-400/20 text-cyan-400 border-cyan-400/30'
                                : session.difficulty === 'medium'
                                ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
                                : 'bg-red-400/20 text-red-400 border-red-400/30'
                            }`}>
                              {session.difficulty}
                            </span>
                            <span className="badge-neon text-xs font-medium bg-fuchsia-400/20 text-fuchsia-400 border-fuchsia-400/30 font-inter">
                              {session.user_position === 'for' ? '🛡️ Supporting' : '⚔️ Opposing'}
                            </span>
                            <span className="badge-neon text-xs font-medium bg-violet-400/20 text-violet-400 border-violet-400/30 font-inter">
                              {session.topic_type === 'custom' ? '✏️ Custom' : '🎭 Scenario'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          {onViewSession && (
                            <button
                              onClick={() => onViewSession(session.id)}
                              className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/20 rounded-xl transition-all duration-200 tooltip"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          )}
                          {onViewDebate && (
                            <button
                              onClick={() => onViewDebate(session)}
                              className="btn-neon-primary flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View Debate</span>
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/20 rounded-xl transition-all duration-200 tooltip" title="Share">
                            <Share2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-violet-400 hover:bg-violet-400/20 rounded-xl transition-all duration-200 tooltip" title="Download">
                            <Download className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/20 rounded-xl transition-all duration-200 tooltip" title="Delete">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Stats Row */}
                      <div className="flex items-center gap-6 text-sm text-gray-300 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center gap-2 font-inter">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <span>{new Date(session.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 font-inter">
                          <svg className="w-4 h-4 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{session.message_count} messages</span>
                        </div>
                        <div className="flex items-center gap-2 font-inter">
                          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                          </svg>
                          <span>{session.total_turns} turns</span>
                        </div>
                        <div className="flex items-center gap-2 font-inter">
                          <Clock className="w-4 h-4 text-green-400" />
                          <span>{session.session_duration ? Math.floor(session.session_duration / 60) : 0}m</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto font-inter">
                          {session.user_position === 'for' ? (
                            <User className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <User className="w-4 h-4 text-fuchsia-400" />
                          )}
                          <span className="text-xs text-gray-400">vs</span>
                          <Bot className="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
