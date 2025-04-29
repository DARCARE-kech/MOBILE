
import { supabase } from '@/integrations/supabase/client';
import { ServiceDetail } from '@/components/services/form/formHelpers';

// Helper functions for service requests
export const getStaffAssignmentsForRequest = async (requestId: string) => {
  const { data } = await supabase
    .from('staff_assignments')
    .select('*')
    .eq('request_id', requestId);
  
  return data || [];
};

export const getServiceRatingsForRequest = async (requestId: string) => {
  const { data } = await supabase
    .from('service_ratings')
    .select('*')
    .eq('request_id', requestId);
  
  return data || [];
};

// Function to enhance optional fields with prefilled selected values
export const enhanceOptionalFields = (
  serviceDetails: ServiceDetail | null,
  category?: string,
  option?: string,
  tripType?: string
) => {
  if (!serviceDetails?.optional_fields) return {};
  
  // Safely cast the optional_fields to Record<string, any>
  const optionalFields = serviceDetails.optional_fields as Record<string, any>;
  
  // Create a copy of optional_fields to avoid modifying the original data
  const enhanced: Record<string, any> = { ...optionalFields };
  
  // Pre-select the category if provided
  if (category && enhanced.categories) {
    enhanced.selectedCategory = category;
  }
  
  // Pre-select the option if provided
  if (option && enhanced.options) {
    enhanced.selectedOption = option;
  }
  
  // Pre-select the trip type if provided
  if (tripType && enhanced.trip_types) {
    enhanced.selectedTripType = tripType;
  }
  
  return enhanced;
};

// Function to create a title based on the service type
export const getServiceTitle = (service: any, serviceType?: string) => {
  if (service) {
    return service.name;
  }
  
  if (serviceType) {
    return `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service`;
  }
  
  return 'New Request';
};
