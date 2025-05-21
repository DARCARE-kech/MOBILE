
import { supabase } from '@/integrations/supabase/client';
import type { StaffAssignment, ServiceRating } from '@/integrations/supabase/rpc';

// Get staff assignments for a specific request
export const getStaffAssignmentsForRequest = async (requestId: string): Promise<StaffAssignment[]> => {
  try {
    // Use a direct query instead of an rpc call since the database doesn't match the types.ts file
    const { data, error } = await supabase
      .from('staff_assignments')
      .select(`
        *,
        staff_services(*)
      `)
      .eq('request_id', requestId);
    
    if (error) {
      console.error('Error in getStaffAssignmentsForRequest:', error);
      return [];
    }
    
    return data as StaffAssignment[];
  } catch (err) {
    console.error('Caught error in getStaffAssignmentsForRequest:', err);
    return [];
  }
};

// Get service ratings for a specific request
export const getServiceRatingsForRequest = async (requestId: string): Promise<ServiceRating[]> => {
  try {
    // Use a direct query instead of an rpc call since the database doesn't match the types.ts file
    const { data, error } = await supabase
      .from('service_ratings')
      .select('*')
      .eq('request_id', requestId);
    
    if (error) {
      console.error('Error in getServiceRatingsForRequest:', error);
      return [];
    }
    
    return data as ServiceRating[];
  } catch (err) {
    console.error('Caught error in getServiceRatingsForRequest:', err);
    return [];
  }
};

// Get status history for a specific request
export const getStatusHistoryForRequest = async (requestId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('status_history')
      .select('*')
      .eq('request_id', requestId)
      .order('changed_at', { ascending: true });
    
    if (error) {
      console.error('Error in getStatusHistoryForRequest:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Caught error in getStatusHistoryForRequest:', err);
    return [];
  }
};
