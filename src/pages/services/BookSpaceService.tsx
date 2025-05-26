
import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarClock, Info, PenLine, Users, Loader2 } from 'lucide-react';
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
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import ServiceBanner from '@/components/services/ServiceBanner';
import { ServiceDetail as ServiceDetailType } from '@/hooks/services/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Define props interface for BookSpaceService component to match what ServiceDetail is passing
interface BookSpaceServiceProps {
  serviceData?: ServiceDetailType;
  existingRequest?: any;
  editMode?: boolean;
}

const BookSpaceService: React.FC<BookSpaceServiceProps> = ({ 
  serviceData, 
  existingRequest, 
  editMode = false 
}) => {
  const navigate = useNavigate();
  const { id: spaceId } = useParams();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  
  // If not explicitly set through props, check location state
  const isEditMode = editMode || (location.state?.editMode === true);
  const requestId = existingRequest?.id || location.state?.requestId;
  
  // Get serviceId from props or location state
  const serviceId = serviceData?.service_id || location.state?.serviceId;

  const {
    form,
    isSubmitting,
    selectedTime,
    setSelectedTime,
    peopleCount,
    setPeopleCount,
    handleSubmit
  } = useSpaceBooking(requestId);

  // Query to get spaces data
  const { data: spaces, isLoading } = useQuery({
    queryKey: ['spaces', spaceId],
    queryFn: async () => {
      // If we have a specific spaceId, fetch just that space
      if (spaceId) {
        const { data, error } = await supabase
          .from('spaces')
          .select('*')
          .eq('id', spaceId)
          .single();

        if (error) throw error;
        return [data];
      }
      
      // Otherwise fetch all spaces
      const { data, error } = await supabase
        .from('spaces')
        .select('*');

      if (error) throw error;
      return data;
    }
  });

  // Find the club access service ID if not provided
  const { data: clubAccessService } = useQuery({
    queryKey: ['club-access-service'],
    queryFn: async () => {
      if (serviceId) return { id: serviceId };
      
      const { data, error } = await supabase
        .from('services')
        .select('id')
        .eq('name', 'Club Access')
        .single();
        
      if (error) {
        console.error('Error fetching Club Access service:', error);
        return null;
      }
      
      return data;
    },
    enabled: !serviceId
  });

  const selectedSpace = spaces?.find(space => space.id === spaceId) || spaces?.[0];

  if (isLoading || !selectedSpace) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <AppHeader 
          title={t('services.clubAccess', 'Club Access')}
          onBack={() => navigate('/services')}
        />
        <div className="flex justify-center items-center h-[80vh] pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  const onSubmit = async (values: any) => {
    // Ensure we have the service ID before proceeding
    const effectiveServiceId = serviceId || clubAccessService?.id;
    
    if (!effectiveServiceId) {
      toast.error(t('common.error', 'Error'), {
        description: t('services.serviceNotFound', 'Club Access service not found')
      });
      return;
    }
    
    if (!spaceId) {
      toast.error(t('common.error', 'Error'), {
        description: t('services.spaceNotFound', 'Space not found')
      });
      return;
    }
    
    // Prepare the request data with all necessary fields
    const requestData = {
      ...values,
      serviceId: effectiveServiceId,
      spaceName: selectedSpace.name,
      spaceId: selectedSpace.id
      user_id: user?.id,
      profile_id: user?.id 
    };
    
    console.log('Submitting space booking with data:', requestData);
    
    try {
      // For edit mode, we need to pass the requestId
      const success = await handleSubmit(requestData, selectedSpace.id, isEditMode, requestId);
      
      if (success) {
        // Show success toast
        toast.success(isEditMode 
          ? t('services.requestUpdated', 'Request Updated') 
          : t('services.bookingConfirmed', 'Booking Confirmed'), {
          description: isEditMode 
            ? t('services.spaceBookingUpdated', 'Your space booking has been updated')
            : t('services.spaceBookingConfirmed', 'Your space has been successfully booked')
        });
        
        // Navigate back to services page
        navigate('/services');
      }
    } catch (error) {
      console.error('Error submitting space booking:', error);
      toast.error(t('common.error', 'Error'), {
        description: t('services.errorSubmitting', 'Error submitting your request. Please try again.') 
      });
    }
  };

  return (
    <div className="bg-darcare-navy min-h-screen pb-20">
      <AppHeader
        title={isEditMode ? t('services.updateBooking', 'Update Booking') : selectedSpace.name}
        showBack={true}
        onBack={() => navigate('/services/spaces')}
      />

      <div className="p-4 space-y-5 pb-24 pt-20">
        {/* Space Image and Description */}
        <LuxuryCard className="overflow-hidden">
          <div className="w-full">
            <AspectRatio ratio={16/9}>
              <img
                src={selectedSpace.image_url || getFallbackImage(selectedSpace.name, 0)}
                alt={selectedSpace.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackImage(selectedSpace.name, 0);
                }}
              />
            </AspectRatio>
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
              title={t('services.rulesAndGuidelines', 'Rules and Guidelines')} 
              icon={<Info className="w-5 h-5" />}
              rawKeys={false}
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
                rawKeys={false}
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
              
              <div className="mt-3">
                <SpecialRequests form={form} />
              </div>
            </LuxuryCard>

            <div className="pt-4 pb-16">
              <BookingSubmitButton 
                isSubmitting={isSubmitting} 
                isEditing={isEditMode}
              />
            </div>
          </form>
        </Form>
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default BookSpaceService;
