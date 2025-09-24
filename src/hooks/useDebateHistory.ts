import { useState, useEffect, useCallback } from 'react';
import { DebateService } from '../services/DebateService.js';
import {
  DebateSession,
  DebateMessage,
  DebateSessionSummary,
  UserDebateStats,
  CreateDebateSessionInput,
  CreateDebateMessageInput
} from '../types/debate-history.js';

export function useDebateHistory() {
  const [sessions, setSessions] = useState<DebateSessionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
  });

  const fetchDebateHistory = useCallback(async (page: number = 1, append: boolean = false) => {
    setLoading(true);
    setError(null);

    const response = await DebateService.getDebateHistory(page, pagination.limit);

    if (response.success && response.data) {
      if (append) {
        setSessions(prev => [...prev, ...response.data!]);
      } else {
        setSessions(response.data);
      }
      
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } else {
      setError(response.error || 'Failed to fetch debate history');
    }

    setLoading(false);
  }, [pagination.limit]);

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      fetchDebateHistory(pagination.page + 1, true);
    }
  }, [pagination.hasMore, pagination.page, loading, fetchDebateHistory]);

  const refresh = useCallback(() => {
    fetchDebateHistory(1, false);
  }, [fetchDebateHistory]);

  const searchSessions = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    const response = await DebateService.searchDebateSessions(searchTerm, 1, pagination.limit);

    if (response.success && response.data) {
      setSessions(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } else {
      setError(response.error || 'Failed to search debates');
    }

    setLoading(false);
  }, [pagination.limit]);

  const deleteSession = useCallback(async (sessionId: string) => {
    const response = await DebateService.deleteDebateSession(sessionId);
    
    if (response.success) {
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      return true;
    } else {
      setError(response.error || 'Failed to delete session');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchDebateHistory();
  }, []);

  return {
    sessions,
    loading,
    error,
    pagination,
    loadMore,
    refresh,
    searchSessions,
    deleteSession
  };
}

export function useDebateSession(sessionId: string | null) {
  const [session, setSession] = useState<DebateSession | null>(null);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;

    setLoading(true);
    setError(null);

    const response = await DebateService.getDebateSession(sessionId);

    if (response.success && response.data) {
      setSession(response.data.session);
      setMessages(response.data.messages);
    } else {
      setError(response.error || 'Failed to fetch session');
    }

    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    messages,
    loading,
    error,
    refresh: fetchSession
  };
}

export function useDebateStats() {
  const [stats, setStats] = useState<UserDebateStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await DebateService.getUserDebateStats();

    if (response.success && response.data) {
      setStats(response.data);
    } else {
      setError(response.error || 'Failed to fetch stats');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  };
}

export function useCreateDebateSession() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (input: CreateDebateSessionInput): Promise<DebateSession | null> => {
    setCreating(true);
    setError(null);

    const response = await DebateService.createDebateSession(input);

    if (response.success && response.data) {
      setCreating(false);
      return response.data;
    } else {
      setError(response.error || 'Failed to create session');
      setCreating(false);
      return null;
    }
  }, []);

  return {
    createSession,
    creating,
    error
  };
}

export function useAddDebateMessage() {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback(async (input: CreateDebateMessageInput): Promise<DebateMessage | null> => {
    setAdding(true);
    setError(null);

    const response = await DebateService.addDebateMessage(input);

    if (response.success && response.data) {
      setAdding(false);
      return response.data;
    } else {
      setError(response.error || 'Failed to add message');
      setAdding(false);
      return null;
    }
  }, []);

  return {
    addMessage,
    adding,
    error
  };
}
