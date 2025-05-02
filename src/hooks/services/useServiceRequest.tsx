
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export interface ServiceLocationState {
  category?: string;
  option?: string;
  tripType?: string;
}

export interface ServiceFormData {
  preferredDate: string;
  preferredTime: string;
  selectedCategory?: string;
  selectedOption?: string;
  note?: string;
  [key: string]: any;
}

export interface ServiceDetail {
  id: string;
  service_id: string;
  category: string;
  instructions?: string;
  default_duration?: string;
  optional_fields?: Record<string, any>;
  price_range?: string;
}

export interface UseServiceRequestResult {
  handleSubmitRequest: (formData: ServiceFormData, isEdit?: boolean, requestId?: string) => Promise<void>;
  isSubmitting: boolean;
}

export const useServiceRequest = (
  service: any,
  serviceState: ServiceLocationState
): UseServiceRequestResult => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { category, option, tripType } = serviceState;

  const handleSubmitRequest = async (formData: ServiceFormData, isEdit = false, requestId?: string) => {
    if (!user) {
      toast.error(t('common.error'), {
        description: t('common.loginRequired')
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert the form data to the structure needed for the service_requests table
      const selectedOptions = {
        ...formData,
        category: category || formData.selectedCategory,
        option: option || formData.selectedOption,
        tripType: tripType
      };

      // Prepare request data
      const requestData = {
        service_id: service?.id,
        user_id: user.id,
        preferred_time: new Date(`${formData.preferredDate}T${formData.preferredTime}`).toISOString(),
        note: formData.note || null,
        selected_options: selectedOptions,
        status: isEdit ? undefined : 'pending' // Don't update status on edit
      };
      
      let error;
      
      if (isEdit && requestId) {
        // Update existing request
        const { error: updateError } = await supabase
          .from('service_requests')
          .update(requestData)
          .eq('id', requestId);
        
        error = updateError;
        
        if (!updateError) {
          toast.success(t('services.requestUpdated', 'Request Updated'), {
            description: t('services.requestUpdatedDesc', 'Your service request has been updated')
          });
          
          // Invalidate relevant queries to refresh data
          // This ensures that the updated request appears in the correct tab
        }
      } else {
        // Create new request
        const { error: insertError } = await supabase
          .from('service_requests')
          .insert(requestData);
        
        error = insertError;
        
        if (!insertError) {
          toast.success(t('services.requestSubmitted', 'Request Submitted'), {
            description: t('services.requestSubmittedDesc', 'Your service request has been submitted')
          });
        }
      }
      
      if (error) throw error;
      
      // Navigate back to services
      navigate('/services', { replace: true });
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(t('common.error'), {
        description: t('services.requestErrorDesc', 'An error occurred while submitting your request')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmitRequest, isSubmitting };
};
