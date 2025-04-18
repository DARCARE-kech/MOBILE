
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarClock, PenLine, Send, Info } from 'lucide-react';
import ServiceHeader from '@/components/services/ServiceHeader';
import IconButton from '@/components/services/IconButton';
import { Form } from '@/components/ui/form';
import { useSpaceBooking } from '@/hooks/useSpaceBooking';
import { SpaceHeader } from './space-booking/SpaceHeader';
import { SpaceRules } from './space-booking/SpaceRules';
import { DateTimeSelector } from './space-booking/DateTimeSelector';
import { SpecialRequests } from './space-booking/SpecialRequests';
import { BookingSubmitButton } from './space-booking/BookingSubmitButton';
import { PeopleCounter } from './space-booking/PeopleCounter';

const BookSpaceService = () => {
  const navigate = useNavigate();
  const { id: spaceId } = useParams();
  
  const {
    form,
    isSubmitting,
    selectedTime,
    setSelectedTime,
    peopleCount,
    setPeopleCount,
    handleSubmit
  } = useSpaceBooking();
  
  const { data: spaces, isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const selectedSpace = spaces?.find(space => space.id === spaceId) || spaces?.[0];
  
  if (isLoading || !selectedSpace) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <ServiceHeader title="Book a Space" />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  const onSubmit = async (values: any) => {
    const success = await handleSubmit(values, selectedSpace.id);
    if (success) {
      navigate('/services');
    }
  };
  
  return (
    <div className="bg-darcare-navy min-h-screen pb-20">
      <ServiceHeader title={selectedSpace.name} />
      
      <div className="p-4 space-y-4">
        <SpaceHeader space={selectedSpace} />
        <SpaceRules rules={selectedSpace.rules} />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DateTimeSelector
              form={form}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
            
            <PeopleCounter
              count={peopleCount}
              maxCapacity={selectedSpace.capacity}
              onIncrement={() => setPeopleCount(Math.min(selectedSpace.capacity || 10, peopleCount + 1))}
              onDecrement={() => setPeopleCount(Math.max(1, peopleCount - 1))}
            />
            
            <SpecialRequests form={form} />
            <BookingSubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookSpaceService;
