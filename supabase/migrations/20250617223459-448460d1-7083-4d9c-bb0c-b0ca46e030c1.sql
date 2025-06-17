
-- Enable RLS on service_ratings table (if not already enabled)
ALTER TABLE public.service_ratings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own ratings
CREATE POLICY "Users can view their own service ratings" 
ON public.service_ratings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own ratings
CREATE POLICY "Users can insert their own service ratings" 
ON public.service_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own ratings (if needed)
CREATE POLICY "Users can update their own service ratings" 
ON public.service_ratings 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own ratings (if needed)
CREATE POLICY "Users can delete their own service ratings" 
ON public.service_ratings 
FOR DELETE 
USING (auth.uid() = user_id);
