// Database types for debate history system
export interface DebateSession {
  id: string;
  user_id: string;
  topic: string;
  topic_type: 'custom' | 'scenario';
  user_position: 'for' | 'against';
  first_speaker: 'user' | 'ai';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  updated_at: string;
  completed_at?: string;
  total_turns: number;
  session_duration?: number; // in seconds
  metadata: Record<string, any>;
  analysis_data?: DebateAnalysisData; // Add analysis data
}

// Debate Analysis Types
export interface PerformanceMetric {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvement: string;
}

export interface DebateAnalysisData {
  overallScore: number;
  performanceMetrics: {
    argumentation: PerformanceMetric;
    clarity: PerformanceMetric;
    engagement: PerformanceMetric;
    criticalThinking: PerformanceMetric;
    communication: PerformanceMetric;
  };
  keyStrengths: string[];
  areasForImprovement: string[];
  specificFeedback: {
    content: string[];
    delivery: string[];
    strategy: string[];
  };
  improvementPlan: {
    immediate: Array<{
      action: string;
      description: string;
      timeframe: string;
    }>;
    shortTerm: Array<{
      action: string;
      description: string;
      timeframe: string;
    }>;
    longTerm: Array<{
      action: string;
      description: string;
      timeframe: string;
    }>;
  };
  encouragementMessage: string;
  nextSteps: string[];
}

export interface DebateMessage {
  id: string;
  debate_session_id: string;
  speaker: 'user' | 'ai';
  message_text: string;
  turn_number: number;
  timestamp: string;
  processing_time?: number; // AI response time in milliseconds
  confidence_score?: number; // AI confidence level (0-100)
  relevance_score?: 'high' | 'medium' | 'low';
  message_type: 'debate_turn' | 'opening_statement' | 'closing_statement' | 'clarification';
  metadata: Record<string, any>;
}

export interface DebateSessionSummary {
  id: string;
  user_id: string;
  topic: string;
  topic_type: 'custom' | 'scenario';
  user_position: 'for' | 'against';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'active' | 'completed' | 'abandoned';
  created_at: string;
  completed_at?: string;
  total_turns: number;
  session_duration?: number;
  message_count: number;
  last_message_at?: string;
  display_status: 'Completed' | 'In Progress' | 'Started' | 'Abandoned';
}

export interface UserDebateStats {
  total_debates: number;
  completed_debates: number;
  active_debates: number;
  total_turns: number;
  avg_session_duration: number;
  favorite_difficulty?: 'easy' | 'medium' | 'hard';
  debates_by_difficulty: Record<string, number>;
}

// Input types for creating new debate sessions
export interface CreateDebateSessionInput {
  topic: string;
  topic_type: 'custom' | 'scenario';
  user_position: 'for' | 'against';
  first_speaker: 'user' | 'ai';
  difficulty: 'easy' | 'medium' | 'hard';
  debate_type?: 'chanakya' | 'instant' | 'human' | 'mun'; // Add debate_type field
  metadata?: Record<string, any>;
}

export interface CreateDebateMessageInput {
  debate_session_id: string;
  speaker: 'user' | 'ai';
  message_text: string;
  turn_number: number;
  processing_time?: number;
  confidence_score?: number;
  relevance_score?: 'high' | 'medium' | 'low';
  message_type?: 'debate_turn' | 'opening_statement' | 'closing_statement' | 'clarification';
  metadata?: Record<string, any>;
}

// Response types for API endpoints
export interface DebateHistoryResponse {
  success: boolean;
  data?: DebateSessionSummary[];
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface DebateSessionResponse {
  success: boolean;
  data?: {
    session: DebateSession;
    messages: DebateMessage[];
  };
  error?: string;
}

export interface DebateStatsResponse {
  success: boolean;
  data?: UserDebateStats;
  error?: string;
}

// Analysis response types
export interface DebateAnalysisResponse {
  success: boolean;
  data?: DebateAnalysisData;
  error?: string;
}

export interface CreateDebateAnalysisInput {
  session_id: string;
  analysis_data: DebateAnalysisData;
}
