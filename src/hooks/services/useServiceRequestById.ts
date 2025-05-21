
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getStaffAssignmentsForRequest, getServiceRatingsForRequest, getStatusHistoryForRequest } from './serviceHelpers';

/**
 * Hook for fetching a single service request by ID
 * Used by the request details page
 */
export const useServiceRequestById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['service-request', id],
    queryFn: async () => {
      if (!id) throw new Error("Request ID is required");
      
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;

      // Fetch staff assignments using our helper
      const staffAssignments = await getStaffAssignmentsForRequest(id);
      
      // Fetch service ratings using our helper
      const serviceRatings = await getServiceRatingsForRequest(id);
      
      // Fetch status history using our helper
      const statusHistory = await getStatusHistoryForRequest(id);
      
      return {
        ...data,
        staff_assignments: staffAssignments,
        service_ratings: serviceRatings,
        status_history: statusHistory
      };
    },
    enabled: !!id
  });
};

export default useServiceRequestById;
