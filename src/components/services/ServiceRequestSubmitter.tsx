
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ServiceFormData } from '@/components/services/form/formHelpers';
import type { ServiceLocationState } from '@/hooks/services/types';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceRequestSubmitterProps {
  service: any;
  serviceState: ServiceLocationState;
  onSubmitStart: () => void;
  onSubmitEnd: () => void;
}

export const useServiceSubmitter = ({
  service,
  serviceState,
  onSubmitStart,
  onSubmitEnd
}: ServiceRequestSubmitterProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { category, option, tripType } = serviceState;
  
  const handleSubmitRequest = async (formData: ServiceFormData): Promise<boolean> => {
    if (!user) {
      console.error('ServiceRequestSubmitter: No user found');
      toast.error(t('common.error'), {
        description: t('common.loginRequired')
      });
      return false;
    }
    
    console.log('ServiceRequestSubmitter: Starting submission');
    console.log('Service:', service);
    console.log('ServiceState:', serviceState);
    console.log('FormData:', formData);
    
    onSubmitStart();
    
    try {
      // Extract the form-specific data and root-level fields
      // Clone formData to avoid mutating the original object
      const { 
        preferredDate, 
        preferredTime, 
        note,
        selectedOptions: formSelectedOptions,
        ...otherFormData 
      } = { ...formData };
      
      // Properly structure service-specific options for selected_options
      // This should only contain form-specific fields, not root-level fields
      const selectedOptions = {
        ...formSelectedOptions || {},
        ...otherFormData,
      };

      // Add category, option, tripType to selectedOptions if provided in serviceState
      if (category) selectedOptions.category = category;
      if (option) selectedOptions.option = option;
      if (tripType) selectedOptions.tripType = tripType;

      // Format the preferred time
      let preferredTimeISO = null;
      if (preferredDate && preferredTime) {
        const [hours, minutes] = preferredTime.split(':').map(Number);
        const dateObj = new Date(preferredDate);
        dateObj.setHours(hours, minutes);
        preferredTimeISO = dateObj.toISOString();
      }

      // Verify service_id exists
      if (!service?.id) {
        console.error('ServiceRequestSubmitter: No service ID found');
        console.error('Service object:', service);
        toast.error(t('common.error'), {
          description: 'Service ID is missing. Please try again.'
        });
        return false;
      }

      const requestData = {
        service_id: service.id,            // Root level field
        user_id: user.id,                   // Root level field
        profile_id: user.id,                // Root level field
        preferred_time: preferredTimeISO,   // Root level field
        note: note || null,                 // Root level field
        selected_options: selectedOptions    // Only form-specific data
      };

      console.log('ServiceRequestSubmitter: Submitting request with data:', requestData);

      // Insert request into database with properly structured data
      const { data, error } = await supabase
        .from('service_requests')
        .insert(requestData);
      
      if (error) {
        console.error('ServiceRequestSubmitter: Error submitting service request:', error);
        throw error;
      }
      
      console.log('ServiceRequestSubmitter: Service request submitted successfully:', data);
      
      // Show success message only once
      toast.success(t('services.requestSubmitted'), {
        description: t('services.requestSubmittedDesc'),
        id: 'service-request-success', // Add an ID to prevent duplicate toasts
      });
      
      // Return true for successful submission
      return true;
      
    } catch (error) {
      console.error('ServiceRequestSubmitter: Error submitting request:', error);
      toast.error(t('common.error'), {
        description: t('services.requestErrorDesc'),
        id: 'service-request-error', // Add an ID to prevent duplicate toasts
      });
      return false;
    } finally {
      onSubmitEnd();
    }
  };

  return { handleSubmitRequest };
};
