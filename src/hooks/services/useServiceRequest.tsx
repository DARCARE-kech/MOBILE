
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { enhanceOptionalFields, getServiceTitle } from './serviceHelpers';
import type { ServiceLocationState, UseServiceRequestResult, ServiceDetail } from './types';

/**
 * Hook for handling service requests form
 * Fetches service data and manages form state
 */
export function useServiceRequest(): UseServiceRequestResult {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get serviceType and serviceId from state
  const serviceState = location.state as ServiceLocationState || {};
  const { serviceType, serviceId, category, option, tripType } = serviceState;
  
  // Validate we have a serviceType or serviceId
  useEffect(() => {
    if (!serviceType && !serviceId) {
      navigate('/services');
    }
  }, [serviceType, serviceId, navigate]);
  
  // Fetch service details based on the service type or ID
  const { data: service, isLoading: isLoadingService } = useQuery({
    queryKey: ['service', serviceType, serviceId],
    queryFn: async () => {
      if (serviceId) {
        console.log('Fetching service with ID:', serviceId);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single();
          
        if (error) {
          console.error('Error fetching service by ID:', error);
          throw error;
        }
        console.log('Service data fetched by ID:', data);
        return data;
      } else if (serviceType) {
        console.log('Fetching service with type:', serviceType);
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .ilike('name', `%${serviceType}%`)
          .limit(1)
          .single();
          
        if (error) {
          console.error('Error fetching service by type:', error);
          throw error;
        }
        console.log('Service data fetched by type:', data);
        return data;
      }
      
      console.warn('No serviceId or serviceType provided');
      return null;
    },
    enabled: !!serviceType || !!serviceId
  });
  
  // Fetch the detailed service options
  const { data: serviceDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['service-details', service?.id],
    queryFn: async () => {
      if (!service?.id) {
        console.warn('No service ID available for fetching details');
        
        // For serviceType-based requests (like hair or kids), return category-specific details
        if (serviceType === 'hair') {
          return { 
            category: 'hair',
            service_id: serviceId
          } as ServiceDetail;
        }
        
        if (serviceType === 'kids') {
          return { 
            category: 'kids',
            service_id: serviceId
          } as ServiceDetail;
        }
        
        return null;
      }
      
      console.log('Fetching service details for ID:', service.id);
      
      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('service_id', service.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching service details:', error);
        
        // Fallback to type-specific details if service details not found
        if (service.name?.toLowerCase().includes('hair')) {
          return { 
            category: 'hair',
            service_id: service.id
          } as ServiceDetail;
        }
        
        if (service.name?.toLowerCase().includes('kids')) {
          return { 
            category: 'kids',
            service_id: service.id
          } as ServiceDetail;
        }
        
        return null;
      }
      
      if (!data) {
        console.log('No service details found, using fallback');
        
        // Fallback based on service name
        if (service.name?.toLowerCase().includes('hair')) {
          return { 
            category: 'hair',
            service_id: service.id
          } as ServiceDetail;
        }
        
        if (service.name?.toLowerCase().includes('kids')) {
          return { 
            category: 'kids',
            service_id: service.id
          } as ServiceDetail;
        }
      }
      
      console.log('Service details fetched:', data);
      
      // Ensure the optional_fields is correctly typed
      if (data && data.optional_fields) {
        return {
          ...data,
          optional_fields: data.optional_fields as Record<string, any>
        } as ServiceDetail;
      }
      
      return data as ServiceDetail;
    },
    enabled: !!service?.id || serviceType === 'hair' || serviceType === 'kids'
  });

  return {
    serviceState,
    service,
    serviceDetails,
    isLoading: isLoadingService || isLoadingDetails,
    // Create wrapper functions to access the utility functions with current state
    enhanceOptionalFields: () => enhanceOptionalFields(serviceDetails, category, option, tripType),
    getServiceTitle: () => getServiceTitle(service, serviceType)
  };
}
