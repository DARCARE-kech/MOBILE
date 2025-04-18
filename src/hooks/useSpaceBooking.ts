
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SpaceBookingFormData {
  date: Date;
  notes: string;
}

export const useSpaceBooking = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [peopleCount, setPeopleCount] = useState(1);

  const form = useForm<SpaceBookingFormData>({
    defaultValues: {
      date: new Date(),
      notes: '',
    },
  });

  const handleSubmit = async (values: SpaceBookingFormData, spaceId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a booking",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTime) {
      toast({
        title: "Time Required",
        description: "Please select a time slot for your booking",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: bookSpaceService, error: serviceError } = await supabase
        .from('services')
        .select('id')
        .ilike('name', '%space%')
        .single();

      if (serviceError || !bookSpaceService) {
        throw new Error("Book Space service not found");
      }

      const preferredTime = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        parseInt(selectedTime.split(':')[0]),
        0, 0
      );

      const { error } = await supabase
        .from('service_requests')
        .insert({
          service_id: bookSpaceService.id,
          user_id: user.id,
          note: JSON.stringify({
            space_id: spaceId,
            time: selectedTime,
            people: peopleCount,
            notes: values.notes
          }),
          preferred_time: preferredTime.toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your space booking has been submitted",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit your booking. Please try again.",
        variant: "destructive"
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
    handleSubmit,
  };
};
