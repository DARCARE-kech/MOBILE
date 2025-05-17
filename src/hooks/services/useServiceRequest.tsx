
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { enhanceOptionalFields, getServiceTitle } from './serviceHelpers';
import type { ServiceLocationState, UseServiceRequestResult, ServiceDetail } from './types';
import { toast } from '@/components/ui/use-toast';

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
  
  console.log('useServiceRequest - state:', serviceState);
  console.log('useServiceRequest - serviceType:', serviceType, 'serviceId:', serviceId);
  
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
          toast({
            title: "Error fetching service",
            description: error.message,
            variant: "destructive"
          });
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
          // Instead of throwing, provide a fallback for known service types
          if (serviceType === 'hair') {
            return { name: 'Hair Salon', category: 'hair' };
          }
          if (serviceType === 'kids') {
            return { name: 'Kids Club', category: 'kids' };
          }
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
    queryKey: ['service-details', service?.id, serviceType],
    queryFn: async () => {
      // Special handling for service types without ID
      if (!service?.id && (serviceType === 'hair' || serviceType === 'kids')) {
        console.log(`Creating default service details for ${serviceType}`);
        
        // Return category-specific default details
        if (serviceType === 'hair') {
          return { 
            category: 'hair',
            service_id: serviceType,
            optional_fields: {
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
            }
          } as ServiceDetail;
        }
        
        if (serviceType === 'kids') {
          return { 
            category: 'kids',
            service_id: serviceType,
            optional_fields: {
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
            }
          } as ServiceDetail;
        }
        
        return null;
      }
      
      if (!service?.id) {
        console.warn('No service ID available for fetching details');
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
        toast({
          title: "Error fetching service details",
          description: error.message,
          variant: "destructive"
        });
        
        // Fallback to type-specific details if service details not found
        if (service.name?.toLowerCase().includes('hair')) {
          return { 
            category: 'hair',
            service_id: service.id,
            optional_fields: {
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
            }
          } as ServiceDetail;
        }
        
        if (service.name?.toLowerCase().includes('kids')) {
          return { 
            category: 'kids',
            service_id: service.id,
            optional_fields: {
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
            }
          } as ServiceDetail;
        }
        
        return null;
      }
      
      console.log('Service details fetched from database:', data);
      
      if (!data) {
        console.log('No service details found, using fallback');
        
        // Fallback based on service name
        if (service.name?.toLowerCase().includes('hair')) {
          return { 
            category: 'hair',
            service_id: service.id,
            optional_fields: {
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
            }
          } as ServiceDetail;
        }
        
        if (service.name?.toLowerCase().includes('kids')) {
          return { 
            category: 'kids',
            service_id: service.id,
            optional_fields: {
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
            }
          } as ServiceDetail;
        }
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
    enabled: !!(service?.id || serviceType === 'hair' || serviceType === 'kids')
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
