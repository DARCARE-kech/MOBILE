
import React from 'react';
import { Form } from '@/components/ui/form';
import { DateTimeSelector } from '@/components/services/space-booking/DateTimeSelector';
import { SpaceRules } from '@/components/services/space-booking/SpaceRules';
import { SpecialRequests } from '@/components/services/space-booking/SpecialRequests';
import { BookingSubmitButton } from '@/components/services/space-booking/BookingSubmitButton';
import { PeopleCounter } from '@/components/space-booking/PeopleCounter';
import { useSpaceBooking } from '@/hooks/useSpaceBooking';

interface SpaceBookingFormProps {
  space: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    rules?: string;
    capacity?: number;
  };
  onSuccess: () => void;
}

export const SpaceBookingForm: React.FC<SpaceBookingFormProps> = ({
  space,
  onSuccess,
}) => {
  const {
    form,
    isSubmitting,
    selectedTime,
    setSelectedTime,
    peopleCount,
    setPeopleCount,
    handleSubmit,
  } = useSpaceBooking();

  const onSubmit = async (values: any) => {
    const success = await handleSubmit(values, space.id);
    if (success) {
      onSuccess();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DateTimeSelector
          form={form}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        <PeopleCounter
          count={peopleCount}
          maxCapacity={space.capacity}
          onIncrement={() =>
            setPeopleCount(Math.min(space.capacity || 10, peopleCount + 1))
          }
          onDecrement={() => setPeopleCount(Math.max(1, peopleCount - 1))}
        />

        <SpaceRules rules={space.rules} />
        <SpecialRequests form={form} />
        <BookingSubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};
