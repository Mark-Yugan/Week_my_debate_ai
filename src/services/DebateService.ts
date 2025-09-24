import { supabase } from '../integrations/supabase/client.js';
import {
  DebateSession,
  DebateMessage,
  DebateSessionSummary,
  UserDebateStats,
  CreateDebateSessionInput,
  CreateDebateMessageInput,
  DebateHistoryResponse,
  DebateSessionResponse,
  DebateStatsResponse
} from '../types/debate-history.js';

export class DebateService {
  /**
   * Create a new debate session
   */
  static async createDebateSession(input: CreateDebateSessionInput, userId?: string): Promise<{ success: boolean; data?: DebateSession; error?: string }> {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const { data, error } = await supabase
        .from('debate_sessions')
        .insert({
          user_id: userId,
          topic: input.topic,
          topic_type: input.topic_type,
          user_position: input.user_position,
          first_speaker: input.first_speaker,
          difficulty: input.difficulty,
          debate_type: input.debate_type || 'chanakya',
          metadata: input.metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating debate session:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error creating debate session:', error);
      return { success: false, error: 'Failed to create debate session' };
    }
  }

  /**
   * Add a message to a debate session
   */
  static async addDebateMessage(input: CreateDebateMessageInput, userId?: string): Promise<{ success: boolean; data?: DebateMessage; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('debate_messages')
        .insert({
          debate_session_id: input.debate_session_id,
          speaker: input.speaker,
          message_text: input.message_text,
          turn_number: input.turn_number,
          processing_time: input.processing_time,
          confidence_score: input.confidence_score,
          relevance_score: input.relevance_score,
          message_type: input.message_type || 'debate_turn',
          metadata: input.metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding debate message:', error);
        return { success: false, error: error.message };
      }

      // Update total_turns in debate_sessions
      await this.updateSessionTurnCount(input.debate_session_id);

      return { success: true, data };
    } catch (error) {
      console.error('Error adding debate message:', error);
      return { success: false, error: 'Failed to add debate message' };
    }
  }

  /**
   * Get user's debate history with pagination
   */
  static async getDebateHistory(page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const offset = (page - 1) * limit;

      // Get total count from debate_sessions table directly
      const { count } = await supabase
        .from('debate_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get paginated data from debate_sessions table
      const { data, error } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching debate history:', error);
        return { success: false, error: error.message };
      }

      const total = count || 0;
      const hasMore = offset + limit < total;

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          hasMore
        }
      };
    } catch (error) {
      console.error('Error fetching debate history:', error);
      return { success: false, error: 'Failed to fetch debate history' };
    }
  }

  /**
   * Get a specific debate session with all messages
   */
  static async getDebateSession(sessionId: string): Promise<DebateSessionResponse> {
    try {
      const { data: session, error: sessionError } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) {
        console.error('Error fetching debate session:', sessionError);
        return { success: false, error: sessionError.message };
      }

      const { data: messages, error: messagesError } = await supabase
        .from('debate_messages')
        .select('*')
        .eq('debate_session_id', sessionId)
        .order('turn_number', { ascending: true });

      if (messagesError) {
        console.error('Error fetching debate messages:', messagesError);
        return { success: false, error: messagesError.message };
      }

      return {
        success: true,
        data: {
          session,
          messages
        }
      };
    } catch (error) {
      console.error('Error fetching debate session:', error);
      return { success: false, error: 'Failed to fetch debate session' };
    }
  }

  /**
   * Get user debate statistics
   */
  static async getUserDebateStats(userId?: string): Promise<DebateStatsResponse> {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get total debates
      const { count: totalDebates } = await supabase
        .from('debate_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get completed debates
      const { count: completedDebates } = await supabase
        .from('debate_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      // Get total messages
      const { count: totalMessages } = await supabase
        .from('debate_messages')
        .select('*', { count: 'exact', head: true })
        .eq('speaker', 'user');

      // Calculate averages (simplified for now)
      const stats: UserDebateStats = {
        total_debates: totalDebates || 0,
        completed_debates: completedDebates || 0,
        total_turns: totalMessages || 0,
        avg_confidence_score: 85,
        avg_relevance_score: 88,
        most_discussed_topics: [],
        debate_streak: 0,
        preferred_difficulty: 'medium'
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching user debate stats:', error);
      return { success: false, error: 'Failed to fetch user debate stats' };
    }
  }

  /**
   * Update session status
   */
  static async updateSessionStatus(sessionId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('debate_sessions')
        .update({ status })
        .eq('id', sessionId);

      if (error) {
        console.error('Error updating session status:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating session status:', error);
      return { success: false, error: 'Failed to update session status' };
    }
  }

  /**
   * Delete a debate session and all its messages
   */
  static async deleteDebateSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete messages first (due to foreign key constraint)
      const { error: messagesError } = await supabase
        .from('debate_messages')
        .delete()
        .eq('debate_session_id', sessionId);

      if (messagesError) {
        console.error('Error deleting debate messages:', messagesError);
        return { success: false, error: messagesError.message };
      }

      // Delete the session
      const { error: sessionError } = await supabase
        .from('debate_sessions')
        .delete()
        .eq('id', sessionId);

      if (sessionError) {
        console.error('Error deleting debate session:', sessionError);
        return { success: false, error: sessionError.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting debate session:', error);
      return { success: false, error: 'Failed to delete debate session' };
    }
  }

  /**
   * Search debate sessions by topic
   */
  static async searchDebateSessions(searchTerm: string, page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      const offset = (page - 1) * limit;

      // Get total count
      const { count } = await supabase
        .from('debate_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .ilike('topic', `%${searchTerm}%`);

      // Get paginated data
      const { data, error } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('user_id', userId)
        .ilike('topic', `%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error searching debate sessions:', error);
        return { success: false, error: error.message };
      }

      const total = count || 0;
      const hasMore = offset + limit < total;

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          hasMore
        }
      };
    } catch (error) {
      console.error('Error searching debate sessions:', error);
      return { success: false, error: 'Failed to search debate sessions' };
    }
  }

  /**
   * Get messages for a specific debate session
   */
  static async getDebateMessages(sessionId: string): Promise<{ success: boolean; data?: DebateMessage[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('debate_messages')
        .select('*')
        .eq('debate_session_id', sessionId)
        .order('turn_number', { ascending: true });

      if (error) {
        console.error('Error fetching debate messages:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching debate messages:', error);
      return { success: false, error: 'Failed to fetch debate messages' };
    }
  }

  /**
   * Update turn count for a session
   */
  private static async updateSessionTurnCount(sessionId: string): Promise<void> {
    try {
      const { count } = await supabase
        .from('debate_messages')
        .select('*', { count: 'exact', head: true })
        .eq('debate_session_id', sessionId);

      await supabase
        .from('debate_sessions')
        .update({ total_turns: count || 0 })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session turn count:', error);
    }
  }
}