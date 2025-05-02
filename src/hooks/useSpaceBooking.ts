
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export const useSpaceBooking = (requestId?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('morning');
  const [peopleCount, setPeopleCount] = useState<number>(1);
  const { user } = useAuth();
  const { t } = useTranslation();
  
  const form = useForm({
    defaultValues: {
      date: new Date(),
      specialRequests: '',
    },
  });
  
  // Load existing data if in edit mode and requestId is provided
  useEffect(() => {
    const loadExistingBooking = async () => {
      if (!requestId) return;
      
      try {
        // Fetch the existing booking data
        const { data, error } = await supabase
          .from('service_requests')
          .select('*')
          .eq('id', requestId)
          .single();
        
        if (error) throw error;
        if (!data) return;
        
        // Set form values based on the existing data
        if (data.preferred_time) {
          const preferredTime = new Date(data.preferred_time);
          form.setValue('date', preferredTime);
          
          // Determine time of day
          const hours = preferredTime.getHours();
          if (hours < 12) {
            setSelectedTime('morning');
          } else if (hours < 17) {
            setSelectedTime('afternoon');
          } else {
            setSelectedTime('evening');
          }
        }
        
        // Set special requests if available
        if (data.note) {
          form.setValue('specialRequests', data.note);
        }
        
        // Set people count if available
        if (data.selected_options && data.selected_options.peopleCount) {
          setPeopleCount(Number(data.selected_options.peopleCount) || 1);
        }
        
      } catch (error) {
        console.error('Error loading booking data:', error);
      }
    };
    
    loadExistingBooking();
  }, [requestId, form]);
  
  const handleSubmit = async (values: any, spaceId: string, isEditing = false, editRequestId?: string) => {
    if (!user) {
      toast.error(t('common.error'), {
        description: t('services.loginRequired'),
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Set time based on selected period (morning, afternoon, evening)
      const date = new Date(values.date);
      
      // Set hours based on time period selected
      switch (selectedTime) {
        case 'morning':
          date.setHours(10, 0, 0, 0);
          break;
        case 'afternoon':
          date.setHours(14, 0, 0, 0);
          break;
        case 'evening':
          date.setHours(19, 0, 0, 0);
          break;
      }
      
      // Prepare the request data
      const requestData = {
        user_id: user.id,
        space_id: spaceId,
        preferred_time: date.toISOString(),
        note: values.specialRequests || null,
        selected_options: {
          peopleCount,
          timeOfDay: selectedTime
        },
        status: isEditing ? undefined : 'pending' // Don't update status if editing
      };
      
      let error;
      
      if (isEditing && editRequestId) {
        // Update existing request
        const { error: updateError } = await supabase
          .from('service_requests')
          .update(requestData)
          .eq('id', editRequestId);
        
        error = updateError;
        
        if (!updateError) {
          toast.success(t('services.bookingUpdated', 'Booking Updated'), {
            description: t('services.bookingUpdatedDesc', 'Your space booking has been updated successfully')
          });
        }
      } else {
        // Create new request
        const { error: insertError } = await supabase
          .from('service_requests')
          .insert(requestData);
        
        error = insertError;
        
        if (!insertError) {
          toast.success(t('services.bookingConfirmed', 'Booking Confirmed'), {
            description: t('services.bookingConfirmedDesc', 'Your space has been booked successfully')
          });
        }
      }
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error(t('common.error'), {
        description: t('services.bookingError', 'There was an error with your booking. Please try again.')
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
