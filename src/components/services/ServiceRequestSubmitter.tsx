
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { type ServiceFormData } from '@/hooks/services/types';
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

  const handleSubmitRequest = async (formData: ServiceFormData) => {
    if (!user) {
      toast.error(t('common.error'), {
        description: t('common.loginRequired')
      });
      return;
    }
    
    onSubmitStart();
    
    try {
      // Convert the form data to the structure needed for the service_requests table
      const selectedOptions = {
        ...formData,
        category: category || formData.selectedCategory,
        option: option || formData.selectedOption,
        tripType: tripType
      };

      console.log('Submitting service request with service_id:', service?.id);

      // Insert request into database
      const { error } = await supabase
        .from('service_requests')
        .insert({
          service_id: service?.id, // S'assurer que service_id est inclus
          profile_id: user.id, // S'assurer que profile_id est égal à user_id
          user_id: user.id,
          preferred_time: new Date(`${formData.preferredDate}T${formData.preferredTime}`).toISOString(),
          note: formData.note || null, // S'assurer que note est inclus
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
