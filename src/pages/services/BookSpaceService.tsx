
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarClock, Info, PenLine, Users } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useSpaceBooking } from '@/hooks/useSpaceBooking';
import { SpaceRules } from '@/components/services/space-booking/SpaceRules';
import { DateTimeSelector } from '@/components/services/space-booking/DateTimeSelector';
import { SpecialRequests } from '@/components/services/space-booking/SpecialRequests';
import { BookingSubmitButton } from '@/components/services/space-booking/BookingSubmitButton';
import { PeopleCounter } from '@/components/space-booking/PeopleCounter';
import BottomNavigation from '@/components/BottomNavigation';
import AppHeader from '@/components/AppHeader';
import { getFallbackImage } from '@/utils/imageUtils';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import FormSectionTitle from '@/components/services/FormSectionTitle';

const BookSpaceService = () => {
  const navigate = useNavigate();
  const { id: spaceId } = useParams();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

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
        <AppHeader 
          title={t('services.bookSpace', 'Book a Space')}
          onBack={() => navigate('/services/spaces')}
        />
        <div className="flex justify-center items-center h-[80vh] pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
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
      <AppHeader
        title={selectedSpace.name}
        onBack={() => navigate('/services/spaces')}
      />

      <div className="p-4 space-y-5 pb-24 pt-20">
        {/* Space Image and Description */}
        <LuxuryCard className="overflow-hidden">
          <div className="w-full aspect-[16/9] bg-darcare-navy/80">
            <img
              src={selectedSpace.image_url || getFallbackImage(selectedSpace.name, 0)}
              alt={selectedSpace.name}
              className="w-full h-full object-cover transition-all"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackImage(selectedSpace.name, 0);
              }}
            />
          </div>
          <div className="p-5">
            <h2 className="text-darcare-gold font-serif text-xl mb-2">
              {selectedSpace.name}
            </h2>
            <div className="flex items-center gap-1 text-sm mb-3">
              <Users size={16} className={isDarkMode ? "text-darcare-gold/70" : "text-darcare-deepGold/70"} />
              <span className={isDarkMode ? "text-darcare-beige/80" : "text-darcare-charcoal/80"}>
                {t('services.capacity', 'Capacity')}: {selectedSpace.capacity || t('common.notSpecified', 'Not specified')}
              </span>
            </div>
            <p className={isDarkMode ? "text-darcare-beige" : "text-darcare-charcoal"}>
              {selectedSpace.description}
            </p>
          </div>
        </LuxuryCard>

        {/* Space Rules Section */}
        {selectedSpace.rules && (
          <LuxuryCard>
            <FormSectionTitle 
              title={t('services.rulesAndGuidelines', 'Rules & Guidelines')} 
              icon={<Info className="w-5 h-5" />}
              rawKeys={true}
            />
            <p className={cn(
              "whitespace-pre-line mt-2",
              isDarkMode ? "text-darcare-beige" : "text-darcare-charcoal"
            )}>
              {selectedSpace.rules}
            </p>
          </LuxuryCard>
        )}

        {/* Booking Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <LuxuryCard>
              <FormSectionTitle 
                title={t('services.schedulingDetails', 'Scheduling Details')} 
                icon={<CalendarClock className="w-5 h-5" />}
                rawKeys={true}
              />
              <div className="mt-3">
                <DateTimeSelector
                  form={form}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                />
              </div>
            </LuxuryCard>

            <LuxuryCard>
              <PeopleCounter
                count={peopleCount}
                maxCapacity={selectedSpace.capacity}
                onIncrement={() =>
                  setPeopleCount(Math.min(selectedSpace.capacity || 10, peopleCount + 1))
                }
                onDecrement={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              />
            </LuxuryCard>

            <LuxuryCard>
              <FormSectionTitle 
                title={t('services.specialRequests', 'Special Requests')} 
                icon={<PenLine className="w-5 h-5" />}
                rawKeys={true}
              />
              <div className="mt-3">
                <SpecialRequests form={form} />
              </div>
            </LuxuryCard>

            <div className="pt-4 pb-16">
              <BookingSubmitButton isSubmitting={isSubmitting} />
            </div>
          </form>
        </Form>
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default BookSpaceService;
