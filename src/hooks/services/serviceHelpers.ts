
import { supabase } from '@/integrations/supabase/client';
import type { ServiceDetail } from './types';

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
  
  // Special processing for Hair Salon service
  if (serviceDetails.category === 'hair' && !enhanced.selectFields) {
    enhanced.selectFields = [
      {
        name: 'client_gender',
        label: 'Client Gender',
        options: ['Man', 'Woman']
      },
      {
        name: 'stylist_gender_preference',
        label: 'Stylist Gender Preference',
        options: ['Any', 'Male', 'Female']
      }
    ];
    
    enhanced.multiSelectFields = [
      {
        name: 'services',
        label: 'Services',
        options: ['Haircut', 'Beard trim', 'Coloring', 'Blow dry', 'Shaving', 'Hair wash']
      }
    ];
  }
  
  // Special processing for Kids Club service
  if (serviceDetails.category === 'kids' && !enhanced.selectFields) {
    enhanced.selectFields = [
      {
        name: 'age_range',
        label: 'Age Range',
        options: ['0-3', '4-7', '8-12']
      },
      {
        name: 'time_slot',
        label: 'Time Slot',
        options: ['Morning', 'Afternoon', 'Evening']
      }
    ];
    
    enhanced.numberFields = [
      {
        name: 'number_of_children',
        label: 'Number of Children',
        min: 1,
        max: 10
      }
    ];
    
    enhanced.multiSelectFields = [
      {
        name: 'activities',
        label: 'Activities',
        options: ['Drawing', 'Games', 'Storytelling', 'Outdoor play']
      }
    ];
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

// Define or export additional functions for getting space details
export const getSpaceById = async (id: string) => {
  if (!id) return null;
  
  try {
    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error in getSpaceById:', err);
    return null;
  }
};
