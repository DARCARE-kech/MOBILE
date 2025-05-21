import { supabase } from '@/integrations/supabase/client';
import type { StaffAssignment, ServiceRating } from '@/integrations/supabase/rpc';
import type { ServiceDetail } from './types';

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
    
    // Process data to match the StaffAssignment type
    // Map staff_services data to include staff_name directly in the assignment object
    const processedData = data?.map((assignment: any) => ({
      ...assignment,
      staff_name: assignment.staff_services?.staff_name || null,
    })) || [];
    
    return processedData as StaffAssignment[];
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

// Add the missing enhanceOptionalFields function
export const enhanceOptionalFields = (
  serviceDetails: ServiceDetail | null | undefined,
  category?: string,
  option?: string,
  tripType?: string
): Record<string, any> => {
  if (!serviceDetails || !serviceDetails.optional_fields) {
    return {}; // Return empty object if no details or optional fields
  }

  // Return the optional fields from the service details
  return serviceDetails.optional_fields;
};

// Add the missing getServiceTitle function
export const getServiceTitle = (
  service: any | null | undefined,
  serviceType?: string
): string => {
  // If service exists and has a name, return it
  if (service && service.name) {
    return service.name;
  }
  
  // Otherwise, fallback to the serviceType with first letter capitalized
  if (serviceType) {
    return serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
  }
  
  // Last fallback
  return 'Service';
};
