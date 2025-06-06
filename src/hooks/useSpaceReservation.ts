
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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

  // Fetch space details
  const { data: space, isLoading: isLoadingSpace } = useQuery({
    queryKey: ['space', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', spaceId)
        .single();
      
      if (error) {
        console.error('Error fetching space:', error);
        throw error;
      }
      return data;
    },
    enabled: !!spaceId
  });

  // Fetch form schema for this space
  const { data: formFields, isLoading: isLoadingFields } = useQuery({
    queryKey: ['space-form-schema', spaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('space_form_schema')
        .select('*')
        .eq('space_id', spaceId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching form fields:', error);
        return [];
      }
      return (data || []).map((field) => {
  let parsedOptions = null;
  if (Array.isArray(field.options)) {
    // Auto-wrap flat array into { choices: [...] }
    parsedOptions = { choices: field.options };
  } else if (typeof field.options === 'object') {
    parsedOptions = field.options;
  }
  return {
    ...field,
    options: parsedOptions
  };
}) as SpaceFormField[];

    },
    enabled: !!spaceId
  });

  // Fetch existing reservation if editing
  const { data: existingReservation, isLoading: isLoadingReservation } = useQuery({
    queryKey: ['space-reservation', existingReservationId],
    queryFn: async () => {
      if (!existingReservationId) return null;
      
      const { data, error } = await supabase
        .from('space_reservations')
        .select('*')
        .eq('id', existingReservationId)
        .single();
      
      if (error) {
        console.error('Error fetching existing reservation:', error);
        return null;
      }
      return data;
    },
    enabled: !!existingReservationId
  });

  // Generate default values for dynamic fields
  const generateDefaultValues = () => {
    const defaults: any = {
      preferred_time: new Date(),
      note: '',
    };

    // Add defaults for custom fields
    if (formFields) {
      formFields.forEach(field => {
        switch (field.input_type) {
          case 'checkbox':
            defaults[field.field_name] = false;
            break;
          case 'number':
            defaults[field.field_name] = field.options?.min || 0;
            break;
          default:
            defaults[field.field_name] = '';
        }
      });
    }

    return defaults;
  };

  const form = useForm<SpaceReservationFormData>({
    defaultValues: generateDefaultValues()
  });

  // Update form defaults when fields are loaded
  useEffect(() => {
    if (formFields && formFields.length > 0) {
      const newDefaults = generateDefaultValues();
      Object.keys(newDefaults).forEach(key => {
        if (!form.getValues(key)) {
          form.setValue(key, newDefaults[key]);
        }
      });
    }
  }, [formFields, form]);

  const handleSubmit = async (values: SpaceReservationFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Submitting reservation with values:', values);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast({
          title: t('services.errorSubmitting', 'Error Submitting'),
          description: t('services.needToLogin', 'You need to be logged in'),
          variant: 'destructive'
        });
        return false;
      }

      // Extract custom fields from form values
      const customFields: Record<string, any> = {};
      if (formFields) {
        formFields.forEach(field => {
          const fieldValue = values[field.field_name];
          if (fieldValue !== undefined && fieldValue !== '' && fieldValue !== null) {
            customFields[field.field_name] = fieldValue;
          }
        });
      }

      const reservationData = {
        user_id: user.user.id,
        space_id: spaceId,
        preferred_time: values.preferred_time.toISOString(),
        note: values.note || null,
        custom_fields: Object.keys(customFields).length > 0 ? customFields : null,
        status: 'pending'
      };

      console.log('Reservation data to be inserted:', reservationData);

      let result;
      if (existingReservationId) {
        // Update existing reservation
        const { data, error } = await supabase
          .from('space_reservations')
          .update(reservationData)
          .eq('id', existingReservationId)
          .select();
        
        if (error) {
          console.error('Error updating reservation:', error);
          throw error;
        }
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
        
        if (error) {
          console.error('Error creating reservation:', error);
          throw error;
        }
        result = data;
        
        toast({
          title: t('services.reservationConfirmed', 'Reservation Confirmed'),
          description: t('services.spaceReservationConfirmed', 'Your space has been successfully reserved'),
        });
      }

      console.log('Reservation operation result:', result);
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

  const isLoading = isLoadingSpace || isLoadingFields || isLoadingReservation;

  return {
    space,
    formFields,
    existingReservation,
    form,
    isSubmitting,
    isLoading,
    handleSubmit
  };
};
