
import { supabase } from '@/integrations/supabase/client';
import type { ServiceDetail } from './types';

// Helper functions for service requests
export const getStaffAssignmentsForRequest = async (requestId: string) => {
  try {
    // Join staff_assignments with staff_services to get staff_name
    const { data, error } = await supabase
      .from('staff_assignments')
      .select(`
        id,
        request_id,
        staff_id,
        assigned_at,
        status,
        start_time,
        end_time,
        comment,
        private_note,
        staff_services!staff_id(staff_name)
      `)
      .eq('request_id', requestId);
    
    if (error) {
      console.error('Error in getStaffAssignmentsForRequest:', error);
      return [];
    }
    
    // Transform the data to flatten the staff_name from staff_services
    return data.map(assignment => {
      return {
        ...assignment,
        staff_name: assignment.staff_services ? assignment.staff_services.staff_name : null,
        staff_services: undefined // Remove this property as it's now flattened
      };
    });
  } catch (err) {
    console.error('Caught error in getStaffAssignmentsForRequest:', err);
    return [];
  }
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
  if (!serviceDetails || !serviceDetails.optional_fields) {
    // Default fields for Hair Salon service
    if (serviceDetails?.category === 'hair') {
      return {
        selectFields: [
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
        ],
        multiSelectFields: [
          {
            name: 'services',
            label: 'Services',
            options: ['Haircut', 'Beard trim', 'Coloring', 'Blow dry', 'Shaving', 'Hair wash']
          }
        ]
      };
    }
    
    // Default fields for Kids Club service
    if (serviceDetails?.category === 'kids') {
      return {
        selectFields: [
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
        ],
        numberFields: [
          {
            name: 'number_of_children',
            label: 'Number of Children',
            min: 1,
            max: 10
          }
        ],
        multiSelectFields: [
          {
            name: 'activities',
            label: 'Activities',
            options: ['Drawing', 'Games', 'Storytelling', 'Outdoor play']
          }
        ]
      };
    }
    
    // Default fields for Reservation service
    if (serviceDetails?.category === 'reservation') {
      return {
        selectFields: [
          {
            name: 'type',
            label: 'Reservation Type',
            options: ['restaurant', 'activity', 'excursion', 'other']
          }
        ],
        numberFields: [
          {
            name: 'people_count',
            label: 'Number of People',
            min: 1,
            max: 50
          }
        ],
        inputFields: [
          {
            name: 'name',
            label: 'Reservation Name',
            placeholder: 'Enter name or place'
          }
        ]
      };
    }
    
    return {};
  }
  
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
  if (service?.name) {
    return service.name;
  }
  
  if (serviceType) {
    if (serviceType === 'hair') return 'Hair Salon';
    if (serviceType === 'kids') return 'Kids Club';
    if (serviceType === 'reservation') return 'Reservation';
    return `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1).replace(/_/g, ' ')} Service`;
  }
  
  return 'New Request';
};

// Function to get service image URL with proper error handling
export const getServiceImageUrl = (imagePath?: string) => {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a full URL, return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle Supabase storage paths
  try {
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${imagePath}`;
  } catch (error) {
    console.error('Error formatting image URL:', error);
    return '/placeholder.svg';
  }
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
