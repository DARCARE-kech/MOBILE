
-- Create chat_threads table
CREATE TABLE IF NOT EXISTS public.chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  thread_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, thread_id)
);

-- Enable row-level security
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own threads
CREATE POLICY "Users can view their own threads"
  ON public.chat_threads
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own threads
CREATE POLICY "Users can insert their own threads"
  ON public.chat_threads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add trigger to update timestamp
CREATE OR REPLACE FUNCTION public.update_chat_thread_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_thread_updated_at_trigger
BEFORE UPDATE ON public.chat_threads
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_thread_updated_at();
