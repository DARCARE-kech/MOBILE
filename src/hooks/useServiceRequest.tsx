
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { ServiceDetail } from '@/components/services/form/formHelpers';

export interface ServiceLocationState {
  serviceType?: string;
  serviceId?: string;
  category?: string;
  option?: string;
  tripType?: string;
}

export interface UseServiceRequestResult {
  serviceState: ServiceLocationState;
  service: any;
  serviceDetails: ServiceDetail | null;
  isLoading: boolean;
  enhanceOptionalFields: () => Record<string, any>;
  getServiceTitle: () => string;
}

export function useServiceRequest(): UseServiceRequestResult {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get serviceType from state
  const serviceState = location.state as ServiceLocationState || {};
  const { serviceType, serviceId, category, option, tripType } = serviceState;
  
  // Validate we have a serviceType
  useEffect(() => {
    if (!serviceType && !serviceId) {
      navigate('/services');
    }
  }, [serviceType, serviceId, navigate]);
  
  // Fetch service details based on the service type
  const { data: service, isLoading: isLoadingService } = useQuery({
    queryKey: ['service', serviceType, serviceId],
    queryFn: async () => {
      if (serviceId) {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single();
          
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .ilike('name', `%${serviceType}%`)
          .limit(1)
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    enabled: !!serviceType || !!serviceId
  });
  
  // Fetch the detailed service options
  const { data: serviceDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['service-details', service?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('service_id', service.id)
        .single();
        
      if (error) {
        console.error('Error fetching service details:', error);
        return null;
      }
      
      // Ensure the optional_fields is correctly typed
      if (data && data.optional_fields) {
        return {
          ...data,
          optional_fields: data.optional_fields as Record<string, any>
        } as ServiceDetail;
      }
      
      return data as ServiceDetail;
    },
    enabled: !!service
  });

  // Create a title based on the service type
  const getServiceTitle = () => {
    if (service) {
      return service.name;
    }
    
    if (serviceType) {
      return `${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Service`;
    }
    
    return 'New Request';
  };
  
  // Enhance the optional fields with prefilled selected values
  const enhanceOptionalFields = () => {
    if (!serviceDetails?.optional_fields) return {};
    
    // Safely cast the optional_fields to Record<string, any> to ensure TypeScript knows it's an object
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

  return {
    serviceState,
    service,
    serviceDetails,
    isLoading: isLoadingService || isLoadingDetails,
    enhanceOptionalFields,
    getServiceTitle
  };
}
