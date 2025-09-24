-- Create debate_sessions table to store debate metadata
CREATE TABLE IF NOT EXISTS public.debate_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  topic_type TEXT NOT NULL CHECK (topic_type IN ('custom', 'scenario')),
  user_position TEXT NOT NULL CHECK (user_position IN ('for', 'against')),
  first_speaker TEXT NOT NULL CHECK (first_speaker IN ('user', 'ai')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_turns INTEGER DEFAULT 0,
  session_duration INTEGER, -- in seconds
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create debate_messages table to store individual messages/turns
CREATE TABLE IF NOT EXISTS public.debate_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  debate_session_id UUID REFERENCES public.debate_sessions(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL CHECK (speaker IN ('user', 'ai')),
  message_text TEXT NOT NULL,
  turn_number INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processing_time INTEGER, -- AI response time in milliseconds
  confidence_score INTEGER, -- AI confidence level (0-100)
  relevance_score TEXT, -- high, medium, low
  message_type TEXT DEFAULT 'debate_turn' CHECK (message_type IN ('debate_turn', 'opening_statement', 'closing_statement', 'clarification')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_debate_sessions_user_id ON public.debate_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_debate_sessions_created_at ON public.debate_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_debate_sessions_status ON public.debate_sessions(status);
CREATE INDEX IF NOT EXISTS idx_debate_messages_session_id ON public.debate_messages(debate_session_id);
CREATE INDEX IF NOT EXISTS idx_debate_messages_turn_number ON public.debate_messages(turn_number);
CREATE INDEX IF NOT EXISTS idx_debate_messages_timestamp ON public.debate_messages(timestamp DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to automatically update updated_at column
CREATE TRIGGER update_debate_sessions_updated_at
  BEFORE UPDATE ON public.debate_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.debate_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for debate_sessions
CREATE POLICY "Users can view their own debate sessions"
  ON public.debate_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own debate sessions"
  ON public.debate_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debate sessions"
  ON public.debate_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debate sessions"
  ON public.debate_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for debate_messages
CREATE POLICY "Users can view messages from their debate sessions"
  ON public.debate_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.debate_sessions 
      WHERE id = debate_session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to their debate sessions"
  ON public.debate_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.debate_sessions 
      WHERE id = debate_session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in their debate sessions"
  ON public.debate_messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.debate_sessions 
      WHERE id = debate_session_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their debate sessions"
  ON public.debate_messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.debate_sessions 
      WHERE id = debate_session_id AND user_id = auth.uid()
    )
  );

-- Create a view for debate session summaries
CREATE OR REPLACE VIEW public.debate_session_summaries AS
SELECT 
  ds.id,
  ds.user_id,
  ds.topic,
  ds.topic_type,
  ds.user_position,
  ds.difficulty,
  ds.status,
  ds.created_at,
  ds.completed_at,
  ds.total_turns,
  ds.session_duration,
  COUNT(dm.id) as message_count,
  MAX(dm.timestamp) as last_message_at,
  CASE 
    WHEN ds.status = 'completed' THEN 'Completed'
    WHEN ds.status = 'active' AND COUNT(dm.id) > 0 THEN 'In Progress'
    WHEN ds.status = 'active' AND COUNT(dm.id) = 0 THEN 'Started'
    ELSE 'Abandoned'
  END as display_status
FROM public.debate_sessions ds
LEFT JOIN public.debate_messages dm ON ds.id = dm.debate_session_id
GROUP BY ds.id, ds.user_id, ds.topic, ds.topic_type, ds.user_position, 
         ds.difficulty, ds.status, ds.created_at, ds.completed_at, 
         ds.total_turns, ds.session_duration;

-- Grant access to the view
GRANT SELECT ON public.debate_session_summaries TO authenticated;

-- Create function to get debate statistics
CREATE OR REPLACE FUNCTION get_user_debate_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  total_count INTEGER;
  completed_count INTEGER;
  active_count INTEGER;
  total_turns_sum INTEGER;
  avg_duration NUMERIC;
  fav_difficulty TEXT;
  difficulty_stats JSON;
  result JSON;
BEGIN
  -- Get basic counts
  SELECT COUNT(*) INTO total_count 
  FROM public.debate_sessions 
  WHERE user_id = user_uuid;
  
  SELECT COUNT(*) INTO completed_count 
  FROM public.debate_sessions 
  WHERE user_id = user_uuid AND status = 'completed';
  
  SELECT COUNT(*) INTO active_count 
  FROM public.debate_sessions 
  WHERE user_id = user_uuid AND status = 'active';
  
  -- Get sum of turns
  SELECT COALESCE(SUM(total_turns), 0) INTO total_turns_sum
  FROM public.debate_sessions 
  WHERE user_id = user_uuid;
  
  -- Get average duration
  SELECT COALESCE(AVG(session_duration), 0) INTO avg_duration
  FROM public.debate_sessions 
  WHERE user_id = user_uuid;
  
  -- Get favorite difficulty
  SELECT difficulty INTO fav_difficulty
  FROM public.debate_sessions 
  WHERE user_id = user_uuid 
  GROUP BY difficulty 
  ORDER BY COUNT(*) DESC 
  LIMIT 1;
  
  -- Get difficulty breakdown
  SELECT json_object_agg(difficulty, count) INTO difficulty_stats
  FROM (
    SELECT difficulty, COUNT(*) as count
    FROM public.debate_sessions
    WHERE user_id = user_uuid
    GROUP BY difficulty
  ) subq;
  
  -- Build final result
  result := json_build_object(
    'total_debates', total_count,
    'completed_debates', completed_count,
    'active_debates', active_count,
    'total_turns', total_turns_sum,
    'avg_session_duration', avg_duration,
    'favorite_difficulty', fav_difficulty,
    'debates_by_difficulty', COALESCE(difficulty_stats, '{}'::json)
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_debate_stats(UUID) TO authenticated;
