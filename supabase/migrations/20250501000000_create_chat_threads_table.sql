
CREATE TABLE IF NOT EXISTS public.chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  thread_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Créer une politique RLS pour permettre aux utilisateurs d'accéder uniquement à leurs propres threads
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own threads" 
  ON public.chat_threads 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own threads" 
  ON public.chat_threads 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own threads" 
  ON public.chat_threads 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own threads" 
  ON public.chat_threads 
  FOR DELETE 
  USING (auth.uid() = user_id);
