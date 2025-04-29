
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { type ServiceFormData } from '@/hooks/services/types';
import type { ServiceLocationState } from '@/hooks/services/types';

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
  const { category, option, tripType } = serviceState;

  const handleSubmitRequest = async (formData: ServiceFormData) => {
    onSubmitStart();
    
    try {
      // Convert the form data to the structure needed for the service_requests table
      const selectedOptions = {
        ...formData,
        category: category || formData.selectedCategory,
        option: option || formData.selectedOption,
        tripType: tripType
      };

      // Insert request into database
      const { error } = await supabase
        .from('service_requests')
        .insert({
          service_id: service?.id,
          preferred_time: new Date(`${formData.preferredDate}T${formData.preferredTime}`).toISOString(),
          note: formData.note,
          selected_options: selectedOptions
        });
      
      if (error) throw error;
      
      // Show success message
      toast.success(t('services.requestSubmitted'), {
        description: t('services.requestSubmittedDesc')
      });
      
      // Navigate back to services
      navigate('/services');
      
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(t('common.error'), {
        description: t('services.requestErrorDesc')
      });
    } finally {
      onSubmitEnd();
    }
  };

  return { handleSubmitRequest };
};
