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

export class DebateHistoryService {
  /**
   * Create a new debate session
   */
  static async createDebateSession(input: CreateDebateSessionInput, userId?: string): Promise<{ success: boolean; data?: DebateSession; error?: string }> {
    try {
      let currentUserId = userId;
      
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { success: false, error: 'User not authenticated' };
        }
        currentUserId = user.id;
      }

      const { data, error } = await supabase
        .from('debate_sessions')
        .insert({
          user_id: currentUserId,
          topic: input.topic,
          topic_type: input.topic_type,
          user_position: input.user_position,
          first_speaker: input.first_speaker,
          difficulty: input.difficulty,
          debate_type: input.debate_type || 'chanakya', // Use provided type or default to chanakya
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
      let currentUserId = userId;
      
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { success: false, error: 'User not authenticated' };
        }
        currentUserId = user.id;
      }

      const offset = (page - 1) * limit;

      // Get total count
      const { count } = await supabase
        .from('debate_session_summaries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId);

      // Get paginated data
      const { data, error } = await supabase
        .from('debate_session_summaries')
        .select('*')
        .eq('user_id', currentUserId)
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
  static async getDebateSession(sessionId: string, userId?: string): Promise<DebateSessionResponse> {
    try {
      let currentUserId = userId;
      
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { success: false, error: 'User not authenticated' };
        }
        currentUserId = user.id;
      }

      // Get session details
      const { data: session, error: sessionError } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', currentUserId)
        .single();

      if (sessionError) {
        console.error('Error fetching debate session:', sessionError);
        return { success: false, error: sessionError.message };
      }

      // Get all messages for this session
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
          messages: messages || []
        }
      };
    } catch (error) {
      console.error('Error fetching debate session:', error);
      return { success: false, error: 'Failed to fetch debate session' };
    }
  }

  /**
   * Update debate session status
   */
  static async updateSessionStatus(sessionId: string, status: 'active' | 'completed' | 'abandoned', sessionDuration?: number): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      if (sessionDuration !== undefined) {
        updateData.session_duration = sessionDuration;
      }

      const { error } = await supabase
        .from('debate_sessions')
        .update(updateData)
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
   * Get user's debate statistics
   */
  static async getUserDebateStats(userId?: string): Promise<DebateStatsResponse> {
    try {
      let currentUserId = userId;
      
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { success: false, error: 'User not authenticated' };
        }
        currentUserId = user.id;
      }

      const { data, error } = await supabase
        .rpc('get_user_debate_stats', { user_uuid: currentUserId });

      if (error) {
        console.error('Error fetching debate stats:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching debate stats:', error);
      return { success: false, error: 'Failed to fetch debate statistics' };
    }
  }

  /**
   * Delete a debate session and all its messages
   */
  static async deleteDebateSession(sessionId: string, userId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      let currentUserId = userId;
      
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { success: false, error: 'User not authenticated' };
        }
        currentUserId = user.id;
      }

      const { error } = await supabase
        .from('debate_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', currentUserId);

      if (error) {
        console.error('Error deleting debate session:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting debate session:', error);
      return { success: false, error: 'Failed to delete debate session' };
    }
  }

  /**
   * Search debate sessions by topic or content
   */
  static async searchDebateSessions(searchTerm: string, page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {
    try {
      let currentUserId = userId;
      
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { success: false, error: 'User not authenticated' };
        }
        currentUserId = user.id;
      }

      const offset = (page - 1) * limit;

      // Search in topics and messages
      const { data, error } = await supabase
        .from('debate_session_summaries')
        .select('*')
        .eq('user_id', currentUserId)
        .or(`topic.ilike.%${searchTerm}%,user_position.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error searching debate sessions:', error);
        return { success: false, error: error.message };
      }

      // Get total count for search
      const { count } = await supabase
        .from('debate_session_summaries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUserId)
        .or(`topic.ilike.%${searchTerm}%,user_position.ilike.%${searchTerm}%`);

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
   * Update total turns count for a session
   */
  private static async updateSessionTurnCount(sessionId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .rpc('update_session_turn_count', { session_uuid: sessionId });

      if (error) {
        console.error('Error updating session turn count:', error);
      }
    } catch (error) {
      console.error('Error in updateSessionTurnCount:', error);
    }
  }

  /**
   * Get debate messages for a specific session
   */
  static async getDebateMessages(sessionId: string, userId?: string): Promise<{ success: boolean; data?: DebateMessage[]; error?: string }> {
    try {
      let currentUserId = userId;
      
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { success: false, error: 'User not authenticated' };
        }
        currentUserId = user.id;
      }

      // First verify the session belongs to the user
      const { data: session, error: sessionError } = await supabase
        .from('debate_sessions')
        .select('id')
        .eq('id', sessionId)
        .eq('user_id', currentUserId)
        .single();

      if (sessionError || !session) {
        return { success: false, error: 'Session not found or access denied' };
      }

      // Get messages for this session
      const { data: messages, error: messagesError } = await supabase
        .from('debate_messages')
        .select('*')
        .eq('debate_session_id', sessionId)
        .order('turn_number', { ascending: true });

      if (messagesError) {
        console.error('Error fetching debate messages:', messagesError);
        return { success: false, error: messagesError.message };
      }

      return { success: true, data: messages || [] };
    } catch (error) {
      console.error('Error fetching debate messages:', error);
      return { success: false, error: 'Failed to fetch debate messages' };
    }
  }
}