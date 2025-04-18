
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
    // Use a direct query instead of an rpc call since the RPC function doesn't seem to be properly configured
    const { data, error } = await supabase
      .from('staff_assignments')
      .select('*')
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
    // Use a direct query instead of an rpc call since the RPC function doesn't seem to be properly configured
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
