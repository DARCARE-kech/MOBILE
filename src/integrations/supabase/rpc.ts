
import { supabase } from './client';

// Define RPC functions types here
export interface StaffAssignment {
  id: string;
  request_id: string;
  staff_id: string | null;
  staff_name: string | null;
  assigned_at: string;
}

export interface ServiceRating {
  id: string;
  request_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string | null;
}

// Get staff assignments for a specific request
export const getStaffAssignmentsForRequest = async (requestId: string): Promise<StaffAssignment[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_staff_assignments_for_request', { 
        request_id_param: requestId 
      });
    
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
    const { data, error } = await supabase
      .rpc('get_service_ratings_for_request', { 
        request_id_param: requestId 
      });
    
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
