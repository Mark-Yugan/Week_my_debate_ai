import { supabase } from '../integrations/supabase/client.js';import { supabase } from '../integrations/supabase/client.js';

import {import {

  DebateSession,  DebateSession,

  DebateMessage,  DebateMessage,

  DebateSessionSummary,  DebateSessionSummary,

  UserDebateStats,  UserDebateStats,

  CreateDebateSessionInput,  CreateDebateSessionInput,

  CreateDebateMessageInput,  CreateDebateMessageInput,

  DebateHistoryResponse,  DebateHistoryResponse,

  DebateSessionResponse,  DebateSessionResponse,

  DebateStatsResponse  DebateStatsResponse

} from '../types/debate-history.js';} from '../types/debate-history.js';



export class DebateHistoryService {export class DebateHistoryService {

  /**  /**

   * Create a new debate session   * Create a new debate session

   */   */

  static async createDebateSession(input: CreateDebateSessionInput, userId?: string): Promise<{ success: boolean; data?: DebateSession; error?: string }> {  static async createDebateSession(input: CreateDebateSessionInput, userId?: string): Promise<{ success: boolean; data?: DebateSession; error?: string }> {

    try {    try {

      if (!userId) {      let currentUserId = userId;

        return { success: false, error: 'User ID is required' };      

      }      if (!currentUserId) {

        const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase        if (!user) {

        .from('debate_sessions')          return { success: false, error: 'User not authenticated' };

        .insert({        }

          user_id: userId,        currentUserId = user.id;

          topic: input.topic,      }

          topic_type: input.topic_type,

          user_position: input.user_position,      const { data, error } = await supabase

          first_speaker: input.first_speaker,        .from('debate_sessions')

          difficulty: input.difficulty,        .insert({

          debate_type: input.debate_type || 'chanakya', // Use provided type or default to chanakya          user_id: currentUserId,

          metadata: input.metadata || {}          topic: input.topic,

        })          topic_type: input.topic_type,

        .select()          user_position: input.user_position,

        .single();          first_speaker: input.first_speaker,

          difficulty: input.difficulty,

      if (error) {          debate_type: input.debate_type || 'chanakya', // Use provided type or default to chanakya

        console.error('Error creating debate session:', error);          metadata: input.metadata || {}

        return { success: false, error: error.message };        })

      }        .select()

        .single();

      return { success: true, data };

    } catch (error) {      if (error) {

      console.error('Error creating debate session:', error);        console.error('Error creating debate session:', error);

      return { success: false, error: 'Failed to create debate session' };        return { success: false, error: error.message };

    }      }

  }

      return { success: true, data };

  /**    } catch (error) {

   * Add a message to a debate session      console.error('Error creating debate session:', error);

   */      return { success: false, error: 'Failed to create debate session' };

  static async addDebateMessage(input: CreateDebateMessageInput, userId?: string): Promise<{ success: boolean; data?: DebateMessage; error?: string }> {    }

    try {  }

      const { data, error } = await supabase

        .from('debate_messages')  /**

        .insert({   * Add a message to a debate session

          debate_session_id: input.debate_session_id,   */

          speaker: input.speaker,  static async addDebateMessage(input: CreateDebateMessageInput, userId?: string): Promise<{ success: boolean; data?: DebateMessage; error?: string }> {

          message_text: input.message_text,    try {

          turn_number: input.turn_number,      const { data, error } = await supabase

          processing_time: input.processing_time,        .from('debate_messages')

          confidence_score: input.confidence_score,        .insert({

          relevance_score: input.relevance_score,          debate_session_id: input.debate_session_id,

          message_type: input.message_type || 'debate_turn',          speaker: input.speaker,

          metadata: input.metadata || {}          message_text: input.message_text,

        })          turn_number: input.turn_number,

        .select()          processing_time: input.processing_time,

        .single();          confidence_score: input.confidence_score,

          relevance_score: input.relevance_score,

      if (error) {          message_type: input.message_type || 'debate_turn',

        console.error('Error adding debate message:', error);          metadata: input.metadata || {}

        return { success: false, error: error.message };        })

      }        .select()

        .single();

      // Update total_turns in debate_sessions

      await this.updateSessionTurnCount(input.debate_session_id);      if (error) {

        console.error('Error adding debate message:', error);

      return { success: true, data };        return { success: false, error: error.message };

    } catch (error) {      }

      console.error('Error adding debate message:', error);

      return { success: false, error: 'Failed to add debate message' };      // Update total_turns in debate_sessions

    }      await this.updateSessionTurnCount(input.debate_session_id);

  }

      return { success: true, data };

  /**    } catch (error) {

   * Get user's debate history with pagination      console.error('Error adding debate message:', error);

   */      return { success: false, error: 'Failed to add debate message' };

  static async getDebateHistory(page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {    }

    try {  }

      if (!userId) {

        return { success: false, error: 'User ID is required' };  /**

      }   * Get user's debate history with pagination

   */

      const offset = (page - 1) * limit;  static async getDebateHistory(page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {

    try {

      // Get total count from debate_sessions table directly      let currentUserId = userId;

      const { count } = await supabase      

        .from('debate_sessions')      if (!currentUserId) {

        .select('*', { count: 'exact', head: true })        const { data: { user } } = await supabase.auth.getUser();

        .eq('user_id', userId);        if (!user) {

          return { success: false, error: 'User not authenticated' };

      // Get paginated data from debate_sessions table        }

      const { data, error } = await supabase        currentUserId = user.id;

        .from('debate_sessions')      }

        .select('*')

        .eq('user_id', userId)      const offset = (page - 1) * limit;

        .order('created_at', { ascending: false })

        .range(offset, offset + limit - 1);      // Get total count

      const { count } = await supabase

      if (error) {        .from('debate_session_summaries')

        console.error('Error fetching debate history:', error);        .select('*', { count: 'exact', head: true })

        return { success: false, error: error.message };        .eq('user_id', currentUserId);

      }

      // Get paginated data

      const total = count || 0;      const { data, error } = await supabase

      const hasMore = offset + limit < total;        .from('debate_session_summaries')

        .select('*')

      return {        .eq('user_id', currentUserId)

        success: true,        .order('created_at', { ascending: false })

        data,        .range(offset, offset + limit - 1);

        pagination: {

          page,      if (error) {

          limit,        console.error('Error fetching debate history:', error);

          total,        return { success: false, error: error.message };

          hasMore      }

        }

      };      const total = count || 0;

    } catch (error) {      const hasMore = offset + limit < total;

      console.error('Error fetching debate history:', error);

      return { success: false, error: 'Failed to fetch debate history' };      return {

    }        success: true,

  }        data,

        pagination: {

  /**          page,

   * Get a specific debate session with all messages          limit,

   */          total,

  static async getDebateSession(sessionId: string): Promise<DebateSessionResponse> {          hasMore

    try {        }

      const { data: session, error: sessionError } = await supabase      };

        .from('debate_sessions')    } catch (error) {

        .select('*')      console.error('Error fetching debate history:', error);

        .eq('id', sessionId)      return { success: false, error: 'Failed to fetch debate history' };

        .single();    }

  }

      if (sessionError) {

        console.error('Error fetching debate session:', sessionError);  /**

        return { success: false, error: sessionError.message };   * Get a specific debate session with all messages

      }   */

  static async getDebateSession(sessionId: string): Promise<DebateSessionResponse> {

      const { data: messages, error: messagesError } = await supabase    try {

        .from('debate_messages')      const { data: { user } } = await supabase.auth.getUser();

        .select('*')      

        .eq('debate_session_id', sessionId)      if (!user) {

        .order('turn_number', { ascending: true });        return { success: false, error: 'User not authenticated' };

      }

      if (messagesError) {

        console.error('Error fetching debate messages:', messagesError);      // Get session details

        return { success: false, error: messagesError.message };      const { data: session, error: sessionError } = await supabase

      }        .from('debate_sessions')

        .select('*')

      return {        .eq('id', sessionId)

        success: true,        .eq('user_id', user.id)

        data: {        .single();

          session,

          messages      if (sessionError) {

        }        console.error('Error fetching debate session:', sessionError);

      };        return { success: false, error: sessionError.message };

    } catch (error) {      }

      console.error('Error fetching debate session:', error);

      return { success: false, error: 'Failed to fetch debate session' };      // Get all messages for this session

    }      const { data: messages, error: messagesError } = await supabase

  }        .from('debate_messages')

        .select('*')

  /**        .eq('debate_session_id', sessionId)

   * Get user debate statistics        .order('turn_number', { ascending: true });

   */

  static async getUserDebateStats(userId?: string): Promise<DebateStatsResponse> {      if (messagesError) {

    try {        console.error('Error fetching debate messages:', messagesError);

      if (!userId) {        return { success: false, error: messagesError.message };

        return { success: false, error: 'User ID is required' };      }

      }

      return {

      // Get total debates        success: true,

      const { count: totalDebates } = await supabase        data: {

        .from('debate_sessions')          session,

        .select('*', { count: 'exact', head: true })          messages: messages || []

        .eq('user_id', userId);        }

      };

      // Get completed debates    } catch (error) {

      const { count: completedDebates } = await supabase      console.error('Error fetching debate session:', error);

        .from('debate_sessions')      return { success: false, error: 'Failed to fetch debate session' };

        .select('*', { count: 'exact', head: true })    }

        .eq('user_id', userId)  }

        .eq('status', 'completed');

  /**

      // Get total messages   * Update debate session status

      const { count: totalMessages } = await supabase   */

        .from('debate_messages')  static async updateSessionStatus(sessionId: string, status: 'active' | 'completed' | 'abandoned', sessionDuration?: number): Promise<{ success: boolean; error?: string }> {

        .select('*', { count: 'exact', head: true })    try {

        .eq('speaker', 'user');      const updateData: any = { 

        status,

      // Calculate averages (simplified for now)        updated_at: new Date().toISOString()

      const stats: UserDebateStats = {      };

        total_debates: totalDebates || 0,

        completed_debates: completedDebates || 0,      if (status === 'completed') {

        total_turns: totalMessages || 0,        updateData.completed_at = new Date().toISOString();

        avg_confidence_score: 85, // Mock for now      }

        avg_relevance_score: 88, // Mock for now

        most_discussed_topics: [], // Could be implemented later      if (sessionDuration !== undefined) {

        debate_streak: 0, // Could be implemented later        updateData.session_duration = sessionDuration;

        preferred_difficulty: 'medium' // Could be implemented later      }

      };

      const { error } = await supabase

      return {        .from('debate_sessions')

        success: true,        .update(updateData)

        data: stats        .eq('id', sessionId);

      };

    } catch (error) {      if (error) {

      console.error('Error fetching user debate stats:', error);        console.error('Error updating session status:', error);

      return { success: false, error: 'Failed to fetch user debate stats' };        return { success: false, error: error.message };

    }      }

  }

      return { success: true };

  /**    } catch (error) {

   * Update session status      console.error('Error updating session status:', error);

   */      return { success: false, error: 'Failed to update session status' };

  static async updateSessionStatus(sessionId: string, status: string): Promise<{ success: boolean; error?: string }> {    }

    try {  }

      const { error } = await supabase

        .from('debate_sessions')  /**

        .update({ status })   * Get user debate statistics

        .eq('id', sessionId);   */

  static async getUserDebateStats(): Promise<DebateStatsResponse> {

      if (error) {    try {

        console.error('Error updating session status:', error);      const { data: { user } } = await supabase.auth.getUser();

        return { success: false, error: error.message };      

      }      if (!user) {

        return { success: false, error: 'User not authenticated' };

      return { success: true };      }

    } catch (error) {

      console.error('Error updating session status:', error);      const { data, error } = await supabase

      return { success: false, error: 'Failed to update session status' };        .rpc('get_user_debate_stats', { user_uuid: user.id });

    }

  }      if (error) {

        console.error('Error fetching debate stats:', error);

  /**        return { success: false, error: error.message };

   * Delete a debate session and all its messages      }

   */

  static async deleteDebateSession(sessionId: string): Promise<{ success: boolean; error?: string }> {      return { success: true, data };

    try {    } catch (error) {

      // Delete messages first (due to foreign key constraint)      console.error('Error fetching debate stats:', error);

      const { error: messagesError } = await supabase      return { success: false, error: 'Failed to fetch debate statistics' };

        .from('debate_messages')    }

        .delete()  }

        .eq('debate_session_id', sessionId);

  /**

      if (messagesError) {   * Delete a debate session and all its messages

        console.error('Error deleting debate messages:', messagesError);   */

        return { success: false, error: messagesError.message };  static async deleteDebateSession(sessionId: string): Promise<{ success: boolean; error?: string }> {

      }    try {

      const { data: { user } } = await supabase.auth.getUser();

      // Delete the session      

      const { error: sessionError } = await supabase      if (!user) {

        .from('debate_sessions')        return { success: false, error: 'User not authenticated' };

        .delete()      }

        .eq('id', sessionId);

      const { error } = await supabase

      if (sessionError) {        .from('debate_sessions')

        console.error('Error deleting debate session:', sessionError);        .delete()

        return { success: false, error: sessionError.message };        .eq('id', sessionId)

      }        .eq('user_id', user.id);



      return { success: true };      if (error) {

    } catch (error) {        console.error('Error deleting debate session:', error);

      console.error('Error deleting debate session:', error);        return { success: false, error: error.message };

      return { success: false, error: 'Failed to delete debate session' };      }

    }

  }      return { success: true };

    } catch (error) {

  /**      console.error('Error deleting debate session:', error);

   * Search debate sessions by topic      return { success: false, error: 'Failed to delete debate session' };

   */    }

  static async searchDebateSessions(searchTerm: string, page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {  }

    try {

      if (!userId) {  /**

        return { success: false, error: 'User ID is required' };   * Helper method to update turn count for a session

      }   */

  private static async updateSessionTurnCount(sessionId: string): Promise<void> {

      const offset = (page - 1) * limit;    try {

      const { data: messages } = await supabase

      // Get total count        .from('debate_messages')

      const { count } = await supabase        .select('turn_number')

        .from('debate_sessions')        .eq('debate_session_id', sessionId)

        .select('*', { count: 'exact', head: true })        .order('turn_number', { ascending: false })

        .eq('user_id', userId)        .limit(1);

        .ilike('topic', `%${searchTerm}%`);

      const maxTurnNumber = messages && messages.length > 0 ? messages[0].turn_number : 0;

      // Get paginated data

      const { data, error } = await supabase      await supabase

        .from('debate_sessions')        .from('debate_sessions')

        .select('*')        .update({ 

        .eq('user_id', userId)          total_turns: maxTurnNumber,

        .ilike('topic', `%${searchTerm}%`)          updated_at: new Date().toISOString()

        .order('created_at', { ascending: false })        })

        .range(offset, offset + limit - 1);        .eq('id', sessionId);

    } catch (error) {

      if (error) {      console.error('Error updating session turn count:', error);

        console.error('Error searching debate sessions:', error);    }

        return { success: false, error: error.message };  }

      }

  /**

      const total = count || 0;   * Search debate sessions by topic

      const hasMore = offset + limit < total;   */

  static async searchDebateSessions(searchTerm: string, page: number = 1, limit: number = 10): Promise<DebateHistoryResponse> {

      return {    try {

        success: true,      const { data: { user } } = await supabase.auth.getUser();

        data,      

        pagination: {      if (!user) {

          page,        return { success: false, error: 'User not authenticated' };

          limit,      }

          total,

          hasMore      const offset = (page - 1) * limit;

        }

      };      // Get total count

    } catch (error) {      const { count } = await supabase

      console.error('Error searching debate sessions:', error);        .from('debate_session_summaries')

      return { success: false, error: 'Failed to search debate sessions' };        .select('*', { count: 'exact', head: true })

    }        .eq('user_id', user.id)

  }        .ilike('topic', `%${searchTerm}%`);



  /**      // Get paginated data

   * Get messages for a specific debate session      const { data, error } = await supabase

   */        .from('debate_session_summaries')

  static async getDebateMessages(sessionId: string): Promise<{ success: boolean; data?: DebateMessage[]; error?: string }> {        .select('*')

    try {        .eq('user_id', user.id)

      const { data, error } = await supabase        .ilike('topic', `%${searchTerm}%`)

        .from('debate_messages')        .order('created_at', { ascending: false })

        .select('*')        .range(offset, offset + limit - 1);

        .eq('debate_session_id', sessionId)

        .order('turn_number', { ascending: true });      if (error) {

        console.error('Error searching debate sessions:', error);

      if (error) {        return { success: false, error: error.message };

        console.error('Error fetching debate messages:', error);      }

        return { success: false, error: error.message };

      }      const total = count || 0;

      const hasMore = offset + limit < total;

      return { success: true, data };

    } catch (error) {      return {

      console.error('Error fetching debate messages:', error);        success: true,

      return { success: false, error: 'Failed to fetch debate messages' };        data,

    }        pagination: {

  }          page,

          limit,

  /**          total,

   * Update turn count for a session          hasMore

   */        }

  private static async updateSessionTurnCount(sessionId: string): Promise<void> {      };

    try {    } catch (error) {

      const { count } = await supabase      console.error('Error searching debate sessions:', error);

        .from('debate_messages')      return { success: false, error: 'Failed to search debate sessions' };

        .select('*', { count: 'exact', head: true })    }

        .eq('debate_session_id', sessionId);  }

}

      await supabase
        .from('debate_sessions')
        .update({ total_turns: count || 0 })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session turn count:', error);
    }
  }
}