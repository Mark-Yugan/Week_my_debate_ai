import { supabase } from '../integrations/supabase/client.js';import { supabase } from '../integrations/supabase/client.js';import { supabase } from '../integrations/supabase/client.js';

import {

  DebateSession,import {import {

  DebateMessage,

  DebateSessionSummary,  DebateSession,  DebateSession,

  UserDebateStats,

  CreateDebateSessionInput,  DebateMessage,  DebateMessage,

  CreateDebateMessageInput,

  DebateHistoryResponse,  DebateSessionSummary,  DebateSessionSummary,

  DebateSessionResponse,

  DebateStatsResponse  UserDebateStats,  UserDebateStats,

} from '../types/debate-history.js';

  CreateDebateSessionInput,  CreateDebateSessionInput,

export class DebateHistoryService {

  /**  CreateDebateMessageInput,  CreateDebateMessageInput,

   * Create a new debate session

   */  DebateHistoryResponse,  DebateHistoryResponse,

  static async createDebateSession(input: CreateDebateSessionInput, userId?: string): Promise<{ success: boolean; data?: DebateSession; error?: string }> {

    try {  DebateSessionResponse,  DebateSessionResponse,

      if (!userId) {

        return { success: false, error: 'User ID is required' };  DebateStatsResponse  DebateStatsResponse

      }

} from '../types/debate-history.js';} from '../types/debate-history.js';

      const { data, error } = await supabase

        .from('debate_sessions')

        .insert({

          user_id: userId,export class DebateHistoryService {export class DebateHistoryService {

          topic: input.topic,

          topic_type: input.topic_type,  /**  /**

          user_position: input.user_position,

          first_speaker: input.first_speaker,   * Create a new debate session   * Create a new debate session

          difficulty: input.difficulty,

          debate_type: input.debate_type || 'chanakya', // Use provided type or default to chanakya   */   */

          metadata: input.metadata || {}

        })  static async createDebateSession(input: CreateDebateSessionInput, userId?: string): Promise<{ success: boolean; data?: DebateSession; error?: string }> {  static async createDebateSession(input: CreateDebateSessionInput, userId?: string): Promise<{ success: boolean; data?: DebateSession; error?: string }> {

        .select()

        .single();    try {    try {



      if (error) {      if (!userId) {      let currentUserId = userId;

        console.error('Error creating debate session:', error);

        return { success: false, error: error.message };        return { success: false, error: 'User ID is required' };      

      }

      }      if (!currentUserId) {

      return { success: true, data };

    } catch (error) {        const { data: { user } } = await supabase.auth.getUser();

      console.error('Error creating debate session:', error);

      return { success: false, error: 'Failed to create debate session' };      const { data, error } = await supabase        if (!user) {

    }

  }        .from('debate_sessions')          return { success: false, error: 'User not authenticated' };



  /**        .insert({        }

   * Add a message to a debate session

   */          user_id: userId,        currentUserId = user.id;

  static async addDebateMessage(input: CreateDebateMessageInput, userId?: string): Promise<{ success: boolean; data?: DebateMessage; error?: string }> {

    try {          topic: input.topic,      }

      const { data, error } = await supabase

        .from('debate_messages')          topic_type: input.topic_type,

        .insert({

          debate_session_id: input.debate_session_id,          user_position: input.user_position,      const { data, error } = await supabase

          speaker: input.speaker,

          message_text: input.message_text,          first_speaker: input.first_speaker,        .from('debate_sessions')

          turn_number: input.turn_number,

          processing_time: input.processing_time,          difficulty: input.difficulty,        .insert({

          confidence_score: input.confidence_score,

          relevance_score: input.relevance_score,          debate_type: input.debate_type || 'chanakya', // Use provided type or default to chanakya          user_id: currentUserId,

          message_type: input.message_type || 'debate_turn',

          metadata: input.metadata || {}          metadata: input.metadata || {}          topic: input.topic,

        })

        .select()        })          topic_type: input.topic_type,

        .single();

        .select()          user_position: input.user_position,

      if (error) {

        console.error('Error adding debate message:', error);        .single();          first_speaker: input.first_speaker,

        return { success: false, error: error.message };

      }          difficulty: input.difficulty,



      // Update total_turns in debate_sessions      if (error) {          debate_type: input.debate_type || 'chanakya', // Use provided type or default to chanakya

      await this.updateSessionTurnCount(input.debate_session_id);

        console.error('Error creating debate session:', error);          metadata: input.metadata || {}

      return { success: true, data };

    } catch (error) {        return { success: false, error: error.message };        })

      console.error('Error adding debate message:', error);

      return { success: false, error: 'Failed to add debate message' };      }        .select()

    }

  }        .single();



  /**      return { success: true, data };

   * Get user's debate history with pagination

   */    } catch (error) {      if (error) {

  static async getDebateHistory(page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {

    try {      console.error('Error creating debate session:', error);        console.error('Error creating debate session:', error);

      if (!userId) {

        return { success: false, error: 'User ID is required' };      return { success: false, error: 'Failed to create debate session' };        return { success: false, error: error.message };

      }

    }      }

      const offset = (page - 1) * limit;

  }

      // Get total count from debate_sessions table directly

      const { count } = await supabase      return { success: true, data };

        .from('debate_sessions')

        .select('*', { count: 'exact', head: true })  /**    } catch (error) {

        .eq('user_id', userId);

   * Add a message to a debate session      console.error('Error creating debate session:', error);

      // Get paginated data from debate_sessions table

      const { data, error } = await supabase   */      return { success: false, error: 'Failed to create debate session' };

        .from('debate_sessions')

        .select('*')  static async addDebateMessage(input: CreateDebateMessageInput, userId?: string): Promise<{ success: boolean; data?: DebateMessage; error?: string }> {    }

        .eq('user_id', userId)

        .order('created_at', { ascending: false })    try {  }

        .range(offset, offset + limit - 1);

      const { data, error } = await supabase

      if (error) {

        console.error('Error fetching debate history:', error);        .from('debate_messages')  /**

        return { success: false, error: error.message };

      }        .insert({   * Add a message to a debate session



      const total = count || 0;          debate_session_id: input.debate_session_id,   */

      const hasMore = offset + limit < total;

          speaker: input.speaker,  static async addDebateMessage(input: CreateDebateMessageInput, userId?: string): Promise<{ success: boolean; data?: DebateMessage; error?: string }> {

      return {

        success: true,          message_text: input.message_text,    try {

        data,

        pagination: {          turn_number: input.turn_number,      const { data, error } = await supabase

          page,

          limit,          processing_time: input.processing_time,        .from('debate_messages')

          total,

          hasMore          confidence_score: input.confidence_score,        .insert({

        }

      };          relevance_score: input.relevance_score,          debate_session_id: input.debate_session_id,

    } catch (error) {

      console.error('Error fetching debate history:', error);          message_type: input.message_type || 'debate_turn',          speaker: input.speaker,

      return { success: false, error: 'Failed to fetch debate history' };

    }          metadata: input.metadata || {}          message_text: input.message_text,

  }

        })          turn_number: input.turn_number,

  /**

   * Get a specific debate session with all messages        .select()          processing_time: input.processing_time,

   */

  static async getDebateSession(sessionId: string): Promise<DebateSessionResponse> {        .single();          confidence_score: input.confidence_score,

    try {

      const { data: session, error: sessionError } = await supabase          relevance_score: input.relevance_score,

        .from('debate_sessions')

        .select('*')      if (error) {          message_type: input.message_type || 'debate_turn',

        .eq('id', sessionId)

        .single();        console.error('Error adding debate message:', error);          metadata: input.metadata || {}



      if (sessionError) {        return { success: false, error: error.message };        })

        console.error('Error fetching debate session:', sessionError);

        return { success: false, error: sessionError.message };      }        .select()

      }

        .single();

      const { data: messages, error: messagesError } = await supabase

        .from('debate_messages')      // Update total_turns in debate_sessions

        .select('*')

        .eq('debate_session_id', sessionId)      await this.updateSessionTurnCount(input.debate_session_id);      if (error) {

        .order('turn_number', { ascending: true });

        console.error('Error adding debate message:', error);

      if (messagesError) {

        console.error('Error fetching debate messages:', messagesError);      return { success: true, data };        return { success: false, error: error.message };

        return { success: false, error: messagesError.message };

      }    } catch (error) {      }



      return {      console.error('Error adding debate message:', error);

        success: true,

        data: {      return { success: false, error: 'Failed to add debate message' };      // Update total_turns in debate_sessions

          session,

          messages    }      await this.updateSessionTurnCount(input.debate_session_id);

        }

      };  }

    } catch (error) {

      console.error('Error fetching debate session:', error);      return { success: true, data };

      return { success: false, error: 'Failed to fetch debate session' };

    }  /**    } catch (error) {

  }

   * Get user's debate history with pagination      console.error('Error adding debate message:', error);

  /**

   * Get user debate statistics   */      return { success: false, error: 'Failed to add debate message' };

   */

  static async getUserDebateStats(userId?: string): Promise<DebateStatsResponse> {  static async getDebateHistory(page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {    }

    try {

      if (!userId) {    try {  }

        return { success: false, error: 'User ID is required' };

      }      if (!userId) {



      // Get total debates        return { success: false, error: 'User ID is required' };  /**

      const { count: totalDebates } = await supabase

        .from('debate_sessions')      }   * Get user's debate history with pagination

        .select('*', { count: 'exact', head: true })

        .eq('user_id', userId);   */



      // Get completed debates      const offset = (page - 1) * limit;  static async getDebateHistory(page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {

      const { count: completedDebates } = await supabase

        .from('debate_sessions')    try {

        .select('*', { count: 'exact', head: true })

        .eq('user_id', userId)      // Get total count from debate_sessions table directly      let currentUserId = userId;

        .eq('status', 'completed');

      const { count } = await supabase      

      // Get total messages

      const { count: totalMessages } = await supabase        .from('debate_sessions')      if (!currentUserId) {

        .from('debate_messages')

        .select('*', { count: 'exact', head: true })        .select('*', { count: 'exact', head: true })        const { data: { user } } = await supabase.auth.getUser();

        .eq('speaker', 'user');

        .eq('user_id', userId);        if (!user) {

      // Calculate averages (simplified for now)

      const stats: UserDebateStats = {          return { success: false, error: 'User not authenticated' };

        total_debates: totalDebates || 0,

        completed_debates: completedDebates || 0,      // Get paginated data from debate_sessions table        }

        total_turns: totalMessages || 0,

        avg_confidence_score: 85, // Mock for now      const { data, error } = await supabase        currentUserId = user.id;

        avg_relevance_score: 88, // Mock for now

        most_discussed_topics: [], // Could be implemented later        .from('debate_sessions')      }

        debate_streak: 0, // Could be implemented later

        preferred_difficulty: 'medium' // Could be implemented later        .select('*')

      };

        .eq('user_id', userId)      const offset = (page - 1) * limit;

      return {

        success: true,        .order('created_at', { ascending: false })

        data: stats

      };        .range(offset, offset + limit - 1);      // Get total count

    } catch (error) {

      console.error('Error fetching user debate stats:', error);      const { count } = await supabase

      return { success: false, error: 'Failed to fetch user debate stats' };

    }      if (error) {        .from('debate_session_summaries')

  }

        console.error('Error fetching debate history:', error);        .select('*', { count: 'exact', head: true })

  /**

   * Update session status        return { success: false, error: error.message };        .eq('user_id', currentUserId);

   */

  static async updateSessionStatus(sessionId: string, status: string): Promise<{ success: boolean; error?: string }> {      }

    try {

      const { error } = await supabase      // Get paginated data

        .from('debate_sessions')

        .update({ status })      const total = count || 0;      const { data, error } = await supabase

        .eq('id', sessionId);

      const hasMore = offset + limit < total;        .from('debate_session_summaries')

      if (error) {

        console.error('Error updating session status:', error);        .select('*')

        return { success: false, error: error.message };

      }      return {        .eq('user_id', currentUserId)



      return { success: true };        success: true,        .order('created_at', { ascending: false })

    } catch (error) {

      console.error('Error updating session status:', error);        data,        .range(offset, offset + limit - 1);

      return { success: false, error: 'Failed to update session status' };

    }        pagination: {

  }

          page,      if (error) {

  /**

   * Delete a debate session and all its messages          limit,        console.error('Error fetching debate history:', error);

   */

  static async deleteDebateSession(sessionId: string): Promise<{ success: boolean; error?: string }> {          total,        return { success: false, error: error.message };

    try {

      // Delete messages first (due to foreign key constraint)          hasMore      }

      const { error: messagesError } = await supabase

        .from('debate_messages')        }

        .delete()

        .eq('debate_session_id', sessionId);      };      const total = count || 0;



      if (messagesError) {    } catch (error) {      const hasMore = offset + limit < total;

        console.error('Error deleting debate messages:', messagesError);

        return { success: false, error: messagesError.message };      console.error('Error fetching debate history:', error);

      }

      return { success: false, error: 'Failed to fetch debate history' };      return {

      // Delete the session

      const { error: sessionError } = await supabase    }        success: true,

        .from('debate_sessions')

        .delete()  }        data,

        .eq('id', sessionId);

        pagination: {

      if (sessionError) {

        console.error('Error deleting debate session:', sessionError);  /**          page,

        return { success: false, error: sessionError.message };

      }   * Get a specific debate session with all messages          limit,



      return { success: true };   */          total,

    } catch (error) {

      console.error('Error deleting debate session:', error);  static async getDebateSession(sessionId: string): Promise<DebateSessionResponse> {          hasMore

      return { success: false, error: 'Failed to delete debate session' };

    }    try {        }

  }

      const { data: session, error: sessionError } = await supabase      };

  /**

   * Search debate sessions by topic        .from('debate_sessions')    } catch (error) {

   */

  static async searchDebateSessions(searchTerm: string, page: number = 1, limit: number = 10, userId?: string): Promise<DebateHistoryResponse> {        .select('*')      console.error('Error fetching debate history:', error);

    try {

      if (!userId) {        .eq('id', sessionId)      return { success: false, error: 'Failed to fetch debate history' };

        return { success: false, error: 'User ID is required' };

      }        .single();    }



      const offset = (page - 1) * limit;  }



      // Get total count      if (sessionError) {

      const { count } = await supabase

        .from('debate_sessions')        console.error('Error fetching debate session:', sessionError);  /**

        .select('*', { count: 'exact', head: true })

        .eq('user_id', userId)        return { success: false, error: sessionError.message };   * Get a specific debate session with all messages

        .ilike('topic', `%${searchTerm}%`);

      }   */

      // Get paginated data

      const { data, error } = await supabase  static async getDebateSession(sessionId: string): Promise<DebateSessionResponse> {

        .from('debate_sessions')

        .select('*')      const { data: messages, error: messagesError } = await supabase    try {

        .eq('user_id', userId)

        .ilike('topic', `%${searchTerm}%`)        .from('debate_messages')      const { data: { user } } = await supabase.auth.getUser();

        .order('created_at', { ascending: false })

        .range(offset, offset + limit - 1);        .select('*')      



      if (error) {        .eq('debate_session_id', sessionId)      if (!user) {

        console.error('Error searching debate sessions:', error);

        return { success: false, error: error.message };        .order('turn_number', { ascending: true });        return { success: false, error: 'User not authenticated' };

      }

      }

      const total = count || 0;

      const hasMore = offset + limit < total;      if (messagesError) {



      return {        console.error('Error fetching debate messages:', messagesError);      // Get session details

        success: true,

        data,        return { success: false, error: messagesError.message };      const { data: session, error: sessionError } = await supabase

        pagination: {

          page,      }        .from('debate_sessions')

          limit,

          total,        .select('*')

          hasMore

        }      return {        .eq('id', sessionId)

      };

    } catch (error) {        success: true,        .eq('user_id', user.id)

      console.error('Error searching debate sessions:', error);

      return { success: false, error: 'Failed to search debate sessions' };        data: {        .single();

    }

  }          session,



  /**          messages      if (sessionError) {

   * Get messages for a specific debate session

   */        }        console.error('Error fetching debate session:', sessionError);

  static async getDebateMessages(sessionId: string): Promise<{ success: boolean; data?: DebateMessage[]; error?: string }> {

    try {      };        return { success: false, error: sessionError.message };

      const { data, error } = await supabase

        .from('debate_messages')    } catch (error) {      }

        .select('*')

        .eq('debate_session_id', sessionId)      console.error('Error fetching debate session:', error);

        .order('turn_number', { ascending: true });

      return { success: false, error: 'Failed to fetch debate session' };      // Get all messages for this session

      if (error) {

        console.error('Error fetching debate messages:', error);    }      const { data: messages, error: messagesError } = await supabase

        return { success: false, error: error.message };

      }  }        .from('debate_messages')



      return { success: true, data };        .select('*')

    } catch (error) {

      console.error('Error fetching debate messages:', error);  /**        .eq('debate_session_id', sessionId)

      return { success: false, error: 'Failed to fetch debate messages' };

    }   * Get user debate statistics        .order('turn_number', { ascending: true });

  }

   */

  /**

   * Update turn count for a session  static async getUserDebateStats(userId?: string): Promise<DebateStatsResponse> {      if (messagesError) {

   */

  private static async updateSessionTurnCount(sessionId: string): Promise<void> {    try {        console.error('Error fetching debate messages:', messagesError);

    try {

      const { count } = await supabase      if (!userId) {        return { success: false, error: messagesError.message };

        .from('debate_messages')

        .select('*', { count: 'exact', head: true })        return { success: false, error: 'User ID is required' };      }

        .eq('debate_session_id', sessionId);

      }

      await supabase

        .from('debate_sessions')      return {

        .update({ total_turns: count || 0 })

        .eq('id', sessionId);      // Get total debates        success: true,

    } catch (error) {

      console.error('Error updating session turn count:', error);      const { count: totalDebates } = await supabase        data: {

    }

  }        .from('debate_sessions')          session,

}
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