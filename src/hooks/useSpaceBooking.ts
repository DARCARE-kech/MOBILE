import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

export const useSpaceBooking = (requestId?: string) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [peopleCount, setPeopleCount] = useState(1);
  const navigate = useNavigate();

  // If requestId is provided, fetch the request data
  const { data: existingRequest } = useQuery({
    queryKey: ['space-booking', requestId],
    queryFn: async () => {
      if (!requestId) return null;
      
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('id', requestId)
        .single();
      
      if (error) {
        console.error('Error fetching request:', error);
        return null;
      }
      
      // Set initial values from the existing request
      if (data) {
        if (data.preferred_time) {
          const date = new Date(data.preferred_time);
          setSelectedTime(date);
        }
        
        // Check if selected_options contains peopleCount
        if (data.selected_options && typeof data.selected_options === 'object' && data.selected_options.peopleCount) {
          setPeopleCount(data.selected_options.peopleCount);
        }
        
        // Set form values
        form.setValue('note', data.note || '');
      }
      
      return data;
    },
    enabled: !!requestId
  });

  const form = useForm({
    defaultValues: {
      note: '',
      date: existingRequest?.preferred_time ? new Date(existingRequest.preferred_time) : undefined
    }
  });

  const handleSubmit = async (values: any, spaceId: string, isEditing = false, editRequestId?: string) => {
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
      
      // Format the selected date and time into an ISO string
      let preferredTime = null;
      if (selectedTime) {
        // Use the selected date (or today if not set) and combine with the selectedTime's hours/minutes
        const preferredDate = values.date || new Date();
        const timeDate = new Date(preferredDate);
        timeDate.setHours(selectedTime.getHours());
        timeDate.setMinutes(selectedTime.getMinutes());
        preferredTime = timeDate.toISOString();
      }
      
      // Prepare the request data
      const requestData = {
        user_id: userId,
        service_id: values.serviceId || null, // From Club Access service
        space_id: spaceId,
        request_type: 'space',
        status: 'pending',
        preferred_time: preferredTime,
        note: values.note,
        selected_options: {
          peopleCount,
          spaceName: values.spaceName
        }
      };
      
      let result;
      
      // If we're editing, update the existing request
      if (isEditing && editRequestId) {
        const { data, error } = await supabase
          .from('service_requests')
          .update(requestData)
          .eq('id', editRequestId)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        // Otherwise insert a new request
        const { data, error } = await supabase
          .from('service_requests')
          .insert(requestData)
          .select();
          
        if (error) throw error;
        result = data;
      }
      
      // Show a success toast
      toast({
        title: isEditing 
          ? t('services.bookingUpdated', 'Booking Updated') 
          : t('services.bookingConfirmed', 'Booking Confirmed'),
        description: isEditing
          ? t('services.spaceBookingUpdated', 'Your space booking has been updated')
          : t('services.spaceBookingConfirmed', 'Your space has been successfully booked'),
      });
      
      return true;
      
    } catch (error: any) {
      console.error('Error submitting space booking:', error);
      
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
    form,
    isSubmitting,
    selectedTime,
    setSelectedTime,
    peopleCount,
    setPeopleCount,
    handleSubmit
  };
};
