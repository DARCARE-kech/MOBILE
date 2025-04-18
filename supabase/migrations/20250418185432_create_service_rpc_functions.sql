
-- Function to get staff assignments for a specific request
CREATE OR REPLACE FUNCTION public.get_staff_assignments_for_request(request_id_param UUID)
RETURNS SETOF public.staff_assignments
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.staff_assignments
  WHERE request_id = request_id_param;
$$;

-- Function to get service ratings for a specific request
CREATE OR REPLACE FUNCTION public.get_service_ratings_for_request(request_id_param UUID)
RETURNS SETOF public.service_ratings
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.service_ratings
  WHERE request_id = request_id_param;
$$;
