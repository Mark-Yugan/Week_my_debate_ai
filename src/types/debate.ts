// Debate-related type definitions

export interface DebateConfig {
  topic: string;
  userPosition: 'for' | 'against';
  firstSpeaker: 'user' | 'ai';
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  theme?: string;
  opponent?: {
    id: string;
    name: string;
    level: string;
    type?: 'ai' | 'human';
  };
}

export interface DebateTopic {
  id?: string;  
  topic_name: string;
  category: string;
  description?: string;
  theme?: string;
  status?: 'active' | 'pending' | 'archived';
  student_id?: string;
  created_at?: string;
  updated_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface SuggestedTopic {
  id?: string;
  theme?: string;
  topic_name: string;
  user_id?: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface DebateSession {
  id?: string;
  user_id: string;
  topic: string;
  debate_type: string;
  speech_text?: string;
  duration_seconds?: number;
  created_at?: string;
  // New fields for detailed tracking
  user_position?: 'for' | 'against';
  ai_position?: 'for' | 'against';
  status?: 'active' | 'completed' | 'archived';
  total_messages?: number;
  user_messages?: number;
  ai_messages?: number;
  session_metadata?: Record<string, any>;
}

export interface DebateMessage {
  id?: string;
  session_id: string;
  speaker: 'user' | 'ai' | 'system';
  message_text: string;
  message_order: number;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface DebateEvaluation {
  id?: string;
  session_id: string;
  user_id: string;
  overall_score: number;
  breakdown: {
    logical_consistency?: number;
    evidence_quality?: number;
    rebuttal_effectiveness?: number;
    persuasiveness?: number;
    rhetorical_skill?: number;
    [key: string]: number | undefined;
  };
  strengths: string[];
  improvements: string[];
  argument_analysis: {
    argument: string;
    feedback: string;
    suggestion: string;
  }[];
  final_remarks?: string;
  evaluation_data?: Record<string, any>;
  created_at?: string;
}

export interface DetailedDebateRecord {
  session: DebateSession;
  messages: DebateMessage[];
  evaluation?: DebateEvaluation;
}

export interface TopicCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

// Predefined topic categories
export const TOPIC_CATEGORIES: TopicCategory[] = [
  { id: 'technology', name: 'Technology & AI', description: 'Tech, AI, and digital innovation topics', color: 'blue' },
  { id: 'politics', name: 'Politics & Society', description: 'Government, policy, and social issues', color: 'red' },
  { id: 'environment', name: 'Environment & Climate', description: 'Climate change, sustainability, and environmental issues', color: 'green' },
  { id: 'education', name: 'Education & Learning', description: 'Education systems, learning methods, and academic topics', color: 'purple' },
  { id: 'health', name: 'Health & Medicine', description: 'Healthcare, medical ethics, and public health', color: 'pink' },
  { id: 'economics', name: 'Economics & Business', description: 'Economic policies, business practices, and finance', color: 'yellow' },
  { id: 'ethics', name: 'Ethics & Philosophy', description: 'Moral dilemmas, philosophical questions, and ethical debates', color: 'indigo' },
  { id: 'culture', name: 'Culture & Society', description: 'Social norms, cultural practices, and lifestyle topics', color: 'orange' },
  { id: 'science', name: 'Science & Research', description: 'Scientific discoveries, research methods, and innovation', color: 'cyan' },
  { id: 'sports', name: 'Sports & Entertainment', description: 'Sports, media, entertainment, and recreational activities', color: 'teal' }
];

// Default topics for each category
export const DEFAULT_TOPICS: Record<string, string[]> = {
  technology: [
    "Should artificial intelligence be regulated by government?",
    "Is social media doing more harm than good to society?",
    "Should tech companies be broken up to prevent monopolies?",
    "Is cryptocurrency the future of money?",
    "Should there be a universal ban on facial recognition technology?"
  ],
  politics: [
    "Should voting be mandatory in democratic countries?",
    "Is the death penalty an effective deterrent to crime?",
    "Should there be term limits for political leaders?",
    "Is democracy the best form of government?",
    "Should political parties be abolished?"
  ],
  environment: [
    "Is nuclear energy the key to solving climate change?",
    "Should plastic bags be banned worldwide?",
    "Is individual action enough to combat climate change?",
    "Should governments prioritize economic growth over environmental protection?",
    "Is vegetarianism necessary to save the planet?"
  ],
  education: [
    "Should university education be free for everyone?",
    "Is standardized testing an effective measure of student ability?",
    "Should schools teach coding as a mandatory subject?",
    "Is homeschooling better than traditional schooling?",
    "Should students be allowed to use AI tools for homework?"
  ],
  health: [
    "Should vaccination be mandatory for all children?",
    "Is universal healthcare a human right?",
    "Should euthanasia be legalized?",
    "Is mental health as important as physical health?",
    "Should junk food advertising be banned?"
  ],
  economics: [
    "Should there be a universal basic income?",
    "Is capitalism the best economic system?",
    "Should minimum wage be increased significantly?",
    "Is remote work better than office work?",
    "Should billionaires exist in a fair society?"
  ],
  ethics: [
    "Is it ethical to edit human genes?",
    "Should animals have the same rights as humans?",
    "Is lying ever morally acceptable?",
    "Should we prioritize human needs over animal welfare?",
    "Is it ethical to use AI to replace human workers?"
  ],
  culture: [
    "Should cultural traditions adapt to modern values?",
    "Is globalization destroying local cultures?",
    "Should parents choose their children's career paths?",
    "Is social media changing human relationships for the worse?",
    "Should religious symbols be banned in public schools?"
  ],
  science: [
    "Should human cloning be allowed for medical purposes?",
    "Is space exploration worth the investment?",
    "Should we prioritize Mars colonization over Earth conservation?",
    "Is genetic modification of food safe and ethical?",
    "Should we attempt to contact extraterrestrial life?"
  ],
  sports: [
    "Should performance-enhancing drugs be allowed in sports?",
    "Is competitive sports beneficial for children's development?",
    "Should esports be considered real sports?",
    "Is it fair to separate sports by gender?",
    "Should professional athletes be role models?"
  ]
};

// Enhanced Human debate room interfaces
export interface Participant {
  id: string;
  name: string;
  side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
  lastSeen: string;
  avatar?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens?: number;
  country?: string;
  status?: 'available' | 'in-debate' | 'away';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
  timestamp: string;
  message?: string; // Legacy support for old format
}

export interface HumanDebateRecord {
  id: string;
  roomId: string;
  topic: string;
  hostName: string;
  participants: Participant[];
  messages: ChatMessage[];
  createdAt: string;
  endedAt?: string;
  status: 'waiting' | 'active' | 'completed';
  winner?: 'FOR' | 'AGAINST' | 'DRAW';
  moderatorNotes?: string;
  tags?: string[];
}

// Online user interface for live debates
export interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tokens: number;
  country: string;
  status: 'available' | 'in-debate' | 'away';
  side?: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
}

// Team interface for team debates
export interface Team {
  id: string;
  name: string;
  members: OnlineUser[];
  rating: number;
  wins: number;
  losses: number;
}

// Live debate message interface
export interface LiveDebateMessage {
  id: string;
  speaker: string;
  team: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR';
  message: string;
  timestamp: Date;
  isUser: boolean;
}

// Room user interface for debate rooms
export interface RoomUser {
  id: string;
  name: string;
  side: 'FOR' | 'AGAINST' | 'OBSERVER' | 'EVALUATOR' | null;
  isActive: boolean;
  joinedAt: string;
  lastSeen: string;
  avatar?: string;
  level?: string;
}

// Debate room interface
export interface DebateRoom {
  id: string;
  topic: string;
  hostId: string;
  hostName: string;
  participants: RoomUser[];
  messages: ChatMessage[];
  status: 'waiting' | 'active' | 'completed';
  createdAt: string;
  endedAt?: string;
  winner?: 'FOR' | 'AGAINST' | 'DRAW';
  settings?: {
    maxParticipants?: number;
    allowObservers?: boolean;
    timeLimit?: number;
    language?: string;
  };
} 