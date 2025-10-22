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
  DebateStatsResponse,
  DebateAnalysisData,
  DebateAnalysisResponse,
  CreateDebateAnalysisInput
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
        active_debates: (totalDebates || 0) - (completedDebates || 0),
        total_turns: totalMessages || 0,
        avg_session_duration: 1200, // 20 minutes average
        favorite_difficulty: 'medium',
        debates_by_difficulty: {
          easy: 0,
          medium: 0,
          hard: 0
        }
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

  /**
   * Store debate analysis for a session in localStorage
   */
  static async storeDebateAnalysis(input: CreateDebateAnalysisInput): Promise<{ success: boolean; error?: string }> {
    try {
      // Store analysis in localStorage with session ID as key
      const storageKey = `debate_analysis_${input.session_id}`;
      const analysisWithTimestamp = {
        ...input.analysis_data,
        storedAt: new Date().toISOString(),
        sessionId: input.session_id
      };
      
      localStorage.setItem(storageKey, JSON.stringify(analysisWithTimestamp));
      
      // Update session status in database (but not analysis data)
      const { error } = await supabase
        .from('debate_sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', input.session_id);

      if (error) {
        console.warn('Warning: Could not update session status in database:', error);
        // Don't fail the analysis storage if DB update fails
      }

      console.log('Analysis stored in localStorage for session:', input.session_id);
      return { success: true };
    } catch (error) {
      console.error('Error storing debate analysis in localStorage:', error);
      return { success: false, error: 'Failed to store debate analysis' };
    }
  }

  /**
   * Get all stored debate analyses from localStorage
   */
  static getAllStoredAnalyses(): Record<string, any> {
    const analyses: Record<string, any> = {};
    
    try {
      // Iterate through all localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('debate_analysis_')) {
          const sessionId = key.replace('debate_analysis_', '');
          const analysisData = localStorage.getItem(key);
          if (analysisData) {
            analyses[sessionId] = JSON.parse(analysisData);
          }
        }
      }
      
      console.log(`Found ${Object.keys(analyses).length} stored analyses in localStorage`);
      return analyses;
    } catch (error) {
      console.error('Error retrieving stored analyses:', error);
      return {};
    }
  }

  /**
   * Get debate analysis for a session from localStorage
   */
  static async getDebateAnalysis(sessionId: string): Promise<DebateAnalysisResponse> {
    try {
      // Try to get analysis from localStorage first
      const storageKey = `debate_analysis_${sessionId}`;
      const storedAnalysis = localStorage.getItem(storageKey);
      
      if (storedAnalysis) {
        const analysisData = JSON.parse(storedAnalysis);
        console.log('Analysis retrieved from localStorage for session:', sessionId);
        return { success: true, data: analysisData };
      }

      // Fallback: try to get from database (for backwards compatibility)
      const { data, error } = await supabase
        .from('debate_sessions')
        .select('analysis_data')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error fetching debate analysis from database:', error);
        return { success: false, error: 'No analysis data found for this session' };
      }

      if (!data?.analysis_data) {
        return { success: false, error: 'No analysis data found for this session' };
      }

      return { success: true, data: data.analysis_data };
    } catch (error) {
      console.error('Error fetching debate analysis:', error);
      return { success: false, error: 'Failed to fetch debate analysis' };
    }
  }

  /**
   * Process debate transcript with N8N workflow for analysis
   */
  static async processDebateAnalysis(sessionId: string, n8nWebhookUrl: string): Promise<DebateAnalysisResponse> {
    try {
      // Get the debate session and messages
      console.log('Fetching debate session for ID:', sessionId);
      const sessionResponse = await this.getDebateSession(sessionId);
      if (!sessionResponse.success || !sessionResponse.data) {
        console.error('Failed to get debate session data:', sessionResponse.error);
        return { success: false, error: 'Failed to get debate session data' };
      }

      const { session, messages } = sessionResponse.data;
      console.log('Retrieved session data:', session);
      console.log('Retrieved messages count:', messages.length);

      if (!messages || messages.length === 0) {
        console.warn('No messages found for session:', sessionId);
        return { success: false, error: 'No messages found for this debate session' };
      }

      // Prepare the payload for N8N webhook in the format expected by the workflow
      const webhookPayload = {
        body: {
          debateData: {
            messages: messages.map(msg => ({
              type: msg.speaker === 'user' ? 'user' : 'deepseek-ai',
              text: msg.message_text,
              timestamp: msg.timestamp,
              confidence: 85 // Default confidence for stored messages
            })),
            config: {
              topic: session.topic,
              userPosition: session.user_position,
              firstSpeaker: 'user', // Default assumption
              difficulty: session.difficulty || 'medium',
              topicType: 'custom'
            },
            duration: session.session_duration || 0,
            sessionId: sessionId
          }
        }
      };

      // Send to N8N webhook with enhanced error handling and timeout
      console.log('Sending data to N8N webhook:', n8nWebhookUrl);
      console.log('Payload:', JSON.stringify(webhookPayload, null, 2));
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      let analysisData: DebateAnalysisData;
      
      try {
        const response = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('N8N Response status:', response.status);
        console.log('N8N Response headers:', response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('N8N webhook error response:', errorText);
          throw new Error(`N8N webhook failed: ${response.status} ${response.statusText}. Response: ${errorText}`);
        }

        const responseText = await response.text();
        console.log('N8N Response text:', responseText);
        
        if (!responseText || responseText.trim() === '') {
          console.warn('N8N returned empty response, using fallback analysis');
          throw new Error('Empty response from N8N webhook');
        }
        
        try {
          analysisData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Failed to parse N8N response as JSON:', parseError);
          throw new Error(`Invalid JSON response from N8N: ${responseText}`);
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('N8N webhook request timed out after 30 seconds');
        }
        throw fetchError;
      }

      // Store the analysis
      const storeResult = await this.storeDebateAnalysis({
        session_id: sessionId,
        analysis_data: analysisData
      });

      if (!storeResult.success) {
        return { success: false, error: storeResult.error };
      }

      return { success: true, data: analysisData };
    } catch (error) {
      console.error('Error processing debate analysis:', error);
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
      
      // Return a structured error response that the frontend can handle
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process debate analysis'
      };
    }
  }
}