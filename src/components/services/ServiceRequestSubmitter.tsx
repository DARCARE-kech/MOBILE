
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
      // Extract the form-specific data for selectedOptions
      // Clone formData to avoid mutating the original object
      const { 
        preferredDate, 
        preferredTime, 
        note,
        selectedOptions: formSelectedOptions,
        ...otherFormData 
      } = { ...formData };
      
      // Combine form-specific fields with any passed selectedOptions
      const selectedOptions = {
        ...otherFormData,
        ...(formSelectedOptions || {}),
        category: category || formData.selectedCategory,
        option: option || formData.selectedOption,
        tripType: tripType
      };

      // Remove any root-level fields that should not be in the request object
      delete selectedOptions.preferredDate;
      delete selectedOptions.preferredTime;
      delete selectedOptions.note;
      delete selectedOptions.date;

      // Make sure service_id is properly defined
      console.log('Submitting service request with service:', service);
      console.log('Service ID used for submission:', service?.id);
      console.log('Form data being submitted:', formData);
      console.log('Selected options for submission:', selectedOptions);

      if (!service?.id) {
        console.warn('Warning: service_id is undefined - this will cause naming issues in My Requests');
      }

      // Format the preferred time
      let preferredTimeISO = null;
      if (preferredDate && preferredTime) {
        const [hours, minutes] = preferredTime.split(':').map(Number);
        const dateObj = new Date(preferredDate);
        dateObj.setHours(hours, minutes);
        preferredTimeISO = dateObj.toISOString();
      }

      // Insert request into database with properly structured data
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          service_id: service?.id, // Root level field
          profile_id: user.id, // Root level field
          user_id: user.id, // Root level field
          preferred_time: preferredTimeISO, // Root level field
          note: note || null, // Root level field
          selected_options: selectedOptions // Only form-specific data
        });
      
      if (error) {
        console.error('Error submitting service request:', error);
        throw error;
      }
      
      console.log('Service request submitted successfully:', data);
      
      // Show success message
      toast.success(t('services.requestSubmitted'), {
        description: t('services.requestSubmittedDesc')
      });
      
      // Return true for successful submission
      return true;
      
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(t('common.error'), {
        description: t('services.requestErrorDesc')
      });
      return false;
    } finally {
      onSubmitEnd();
    }
  };

  return { handleSubmitRequest };
};
