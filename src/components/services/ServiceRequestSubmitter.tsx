
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
      toast.error(t('common.error'), {
        description: t('common.loginRequired')
      });
      return false;
    }
    
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

      console.log('Submitting service request with data:', {
        service_id: service?.id,
        user_id: user.id,
        profile_id: user.id,
        preferred_time: preferredTimeISO,
        note: note || null,
        selected_options: selectedOptions
      });

      // Insert request into database with properly structured data
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          service_id: service?.id,            // Root level field
          user_id: user.id,                   // Root level field
          profile_id: user.id,                // Root level field
          preferred_time: preferredTimeISO,   // Root level field
          note: note || null,                 // Root level field
          selected_options: selectedOptions    // Only form-specific data
        });
      
      if (error) {
        console.error('Error submitting service request:', error);
        throw error;
      }
      
      console.log('Service request submitted successfully:', data);
      
      // Show success message only once
      toast.success(t('services.requestSubmitted'), {
        description: t('services.requestSubmittedDesc'),
        id: 'service-request-success', // Add an ID to prevent duplicate toasts
      });
      
      // Return true for successful submission
      return true;
      
    } catch (error) {
      console.error('Error submitting request:', error);
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
