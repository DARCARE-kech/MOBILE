
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
      if (!service?.id) return null;
      
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
    enabled: !!service?.id
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
