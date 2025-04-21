
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarClock, PenLine, Send, Info } from 'lucide-react';
// Remove ServiceHeader import, use a custom header below
import IconButton from '@/components/services/IconButton';
import { Form } from '@/components/ui/form';
import { useSpaceBooking } from '@/hooks/useSpaceBooking';
import { SpaceRules } from './space-booking/SpaceRules';
import { DateTimeSelector } from './space-booking/DateTimeSelector';
import { SpecialRequests } from './space-booking/SpecialRequests';
import { BookingSubmitButton } from './space-booking/BookingSubmitButton';
import { PeopleCounter } from '@/components/space-booking/PeopleCounter';
import BottomNavigation from '@/components/BottomNavigation';
import { ArrowLeft } from "lucide-react";

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
        {/* Custom Header */}
        <div className="flex items-center justify-between p-4 bg-darcare-navy border-b border-darcare-gold/20">
          <button
            onClick={() => navigate('/services/spaces')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-darcare-gold/10"
            aria-label="Back"
          >
            <ArrowLeft className="text-darcare-gold w-5 h-5" />
          </button>
          <h1 className="text-darcare-gold font-serif text-xl mx-auto">
            Book a Space
          </h1>
          <div className="w-10" /> {/* Filler for spacing */}
        </div>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full"></div>
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
      {/* Header with functional back button */}
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
        <div className="w-10" /> {/* Filler for spacing */}
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Space Image and Description */}
        <div className="bg-darcare-navy border border-darcare-gold/20 rounded-xl overflow-hidden">
          <div className="w-full aspect-[16/9] bg-darcare-navy/80">
            <img
              src={selectedSpace.image_url || '/placeholder.svg'}
              alt={selectedSpace.name}
              className="w-full h-full object-cover rounded-b-none rounded-t-xl transition-all"
              style={{ minHeight: 160, maxHeight: 320 }}
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="p-4">
            <h2 className="text-darcare-gold font-serif text-xl mb-2">
              {selectedSpace.name}
            </h2>
            <p className="text-darcare-beige">{selectedSpace.description}</p>
          </div>
        </div>

        {/* Space Rules Section */}
        {selectedSpace.rules && (
          <div className="bg-darcare-navy border border-darcare-gold/20 rounded-xl p-4">
            <div className="flex items-center mb-2 gap-2">
              <Info className="w-5 h-5 text-darcare-gold" />
              <span className="text-darcare-gold text-lg font-serif">
                Rules & Guidelines
              </span>
            </div>
            <p className="text-darcare-beige whitespace-pre-line">
              {selectedSpace.rules}
            </p>
          </div>
        )}

        {/* Booking Form */}
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
      {/* Fixed Bottom Navigation */}
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default BookSpaceService;

