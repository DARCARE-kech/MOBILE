
-- First, update existing NULL user_id values with a default or remove those rows
-- Let's check what we have and clean up the data first

-- Option 1: Remove rows with NULL user_id (if they are invalid/orphaned data)
DELETE FROM public.service_ratings WHERE user_id IS NULL;

-- Option 2: Alternative - if you want to keep the data, you could set a default user_id
-- UPDATE public.service_ratings SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Now apply the constraints after cleaning the data
ALTER TABLE public.service_ratings ALTER COLUMN user_id SET NOT NULL;

-- Add unique constraint to prevent duplicate ratings from the same user for the same request
ALTER TABLE public.service_ratings ADD CONSTRAINT unique_user_request_rating UNIQUE (user_id, request_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_service_ratings_user_request ON public.service_ratings(user_id, request_id);

-- Update the trigger to automatically set user_id if not provided
CREATE OR REPLACE FUNCTION public.set_service_rating_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically set user_id on insert
DROP TRIGGER IF EXISTS set_service_rating_user_id_trigger ON public.service_ratings;
CREATE TRIGGER set_service_rating_user_id_trigger
  BEFORE INSERT ON public.service_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_service_rating_user_id();
