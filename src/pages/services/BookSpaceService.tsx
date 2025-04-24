
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSpaceBooking } from '@/hooks/useSpaceBooking';
import { SpaceRules } from '@/components/services/space-booking/SpaceRules';
import { DateTimeSelector } from '@/components/services/space-booking/DateTimeSelector';
import { SpecialRequests } from '@/components/services/space-booking/SpecialRequests';
import { BookingSubmitButton } from '@/components/services/space-booking/BookingSubmitButton';
import { PeopleCounter } from '@/components/space-booking/PeopleCounter';
import BottomNavigation from '@/components/BottomNavigation';
import { Form } from '@/components/ui/form';
import SpaceInfoCard from '@/components/services/space-booking/SpaceInfoCard';

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
        <div className="flex items-center justify-between p-4 bg-darcare-navy border-b border-darcare-gold/20">
          <button
            onClick={() => navigate('/services/spaces')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-darcare-gold/10"
          >
            <ArrowLeft className="text-darcare-gold w-5 h-5" />
          </button>
          <h1 className="text-darcare-gold font-serif text-xl mx-auto">
            Book a Space
          </h1>
          <div className="w-10" />
        </div>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full" />
        </div>
        <BottomNavigation activeTab="services" />
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
      <div className="flex items-center justify-between p-4 bg-darcare-navy border-b border-darcare-gold/20">
        <button
          onClick={() => navigate('/services/spaces')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-darcare-gold/10"
          aria-label="Back"
        >
          <ArrowLeft className="text-darcare-gold w-5 h-5" />
        </button>
        <h1 className="text-darcare-gold font-serif text-xl mx-auto">
          {selectedSpace.name}
        </h1>
        <div className="w-10" />
      </div>

      <div className="p-4 space-y-4 pb-24">
        <SpaceInfoCard space={selectedSpace} />
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
              onIncrement={() =>
                setPeopleCount(Math.min(selectedSpace.capacity || 10, peopleCount + 1))
              }
              onDecrement={() => setPeopleCount(Math.max(1, peopleCount - 1))}
            />

            <SpecialRequests form={form} />
            <BookingSubmitButton isSubmitting={isSubmitting} />
          </form>
        </Form>
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default BookSpaceService;
