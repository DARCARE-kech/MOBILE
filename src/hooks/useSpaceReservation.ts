
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

interface SpaceFormField {
  id: string;
  field_name: string;
  label: string;
  input_type: string;
  required: boolean;
  options?: any;
}

interface SpaceReservationFormData {
  preferred_time: Date;
  note: string;
  [key: string]: any; // For custom fields
}

export const useSpaceReservation = (spaceId: string, existingReservationId?: string) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch space details
  const { data: space } = useQuery({
    queryKey: ['space', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', spaceId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!spaceId
  });

  // Fetch form schema for this space
  const { data: formFields } = useQuery({
    queryKey: ['space-form-schema', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('space_form_schema')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at');
      
      if (error) throw error;
      return data as SpaceFormField[];
    },
    enabled: !!spaceId
  });

  // Fetch existing reservation if editing
  const { data: existingReservation } = useQuery({
    queryKey: ['space-reservation', existingReservationId],
    queryFn: async () => {
      if (!existingReservationId) return null;
      
      const { data, error } = await supabase
        .from('space_reservations')
        .select('*')
        .eq('id', existingReservationId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!existingReservationId
  });

  const form = useForm<SpaceReservationFormData>({
    defaultValues: {
      preferred_time: existingReservation?.preferred_time ? new Date(existingReservation.preferred_time) : new Date(),
      note: existingReservation?.note || '',
    }
  });

  const handleSubmit = async (values: SpaceReservationFormData) => {
    try {
      setIsSubmitting(true);
      
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        toast({
          title: t('services.errorSubmitting', 'Error Submitting'),
          description: t('services.needToLogin', 'You need to be logged in'),
          variant: 'destructive'
        });
        return false;
      }

      // Extract custom fields from form values
      const customFields: Record<string, any> = {};
      formFields?.forEach(field => {
        if (values[field.field_name] !== undefined) {
          customFields[field.field_name] = values[field.field_name];
        }
      });

      const reservationData = {
        user_id: userId,
        space_id: spaceId,
        preferred_time: values.preferred_time.toISOString(),
        note: values.note,
        custom_fields: customFields,
        status: 'pending'
      };

      let result;
      if (existingReservationId) {
        // Update existing reservation
        const { data, error } = await supabase
          .from('space_reservations')
          .update(reservationData)
          .eq('id', existingReservationId)
          .select();
        
        if (error) throw error;
        result = data;
        
        toast({
          title: t('services.reservationUpdated', 'Reservation Updated'),
          description: t('services.spaceReservationUpdated', 'Your space reservation has been updated'),
        });
      } else {
        // Create new reservation
        const { data, error } = await supabase
          .from('space_reservations')
          .insert(reservationData)
          .select();
        
        if (error) throw error;
        result = data;
        
        toast({
          title: t('services.reservationConfirmed', 'Reservation Confirmed'),
          description: t('services.spaceReservationConfirmed', 'Your space has been successfully reserved'),
        });
      }

      // Navigate back to services
      navigate('/services', { state: { activeTab: 'requests' } });
      return true;
      
    } catch (error: any) {
      console.error('Error submitting space reservation:', error);
      
      toast({
        title: t('services.errorSubmitting', 'Error Submitting'),
        description: error.message || t('services.pleaseTryAgain', 'Please try again later'),
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    space,
    formFields,
    existingReservation,
    form,
    isSubmitting,
    handleSubmit
  };
};
