
-- Create chat_threads table to store OpenAI thread IDs for users
CREATE TABLE IF NOT EXISTS chat_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_chat_threads_user_id ON chat_threads(user_id);

-- Add RLS policies
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;

-- Users can only see their own threads
CREATE POLICY chat_threads_select_policy 
  ON chat_threads FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can only insert their own threads
CREATE POLICY chat_threads_insert_policy 
  ON chat_threads FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
