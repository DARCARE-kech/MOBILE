
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useServiceSubmitter } from '@/components/services/ServiceRequestSubmitter';
import { ServiceDetail } from '@/hooks/services/types';
import { Loader2, CalendarClock, Users, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LuxuryCard } from '@/components/ui/luxury-card';
import DateTimePickerSection from '@/components/services/form/DateTimePickerSection';

interface ReservationServiceProps {
  serviceData: ServiceDetail;
  editMode?: boolean;
  existingRequest?: any;
}

type FormData = {
  reservationType: string;
  peopleCount: string;
  reservationName: string;
  preferredDate: Date;
  preferredTime: string;
  note: string;
};

const ReservationService: React.FC<ReservationServiceProps> = ({
  serviceData,
  editMode = false,
  existingRequest = null
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = window.location;
  const searchParams = new URLSearchParams(location.search);
  const recommendationTitle = searchParams.get('title');
  const recommendationType = searchParams.get('type');

  const defaultDate = existingRequest?.preferred_time
    ? new Date(existingRequest.preferred_time)
    : new Date();

  const defaultTime = existingRequest?.preferred_time
    ? `${new Date(existingRequest.preferred_time).getHours().toString().padStart(2, '0')}:${new Date(existingRequest.preferred_time).getMinutes().toString().padStart(2, '0')}`
    : '12:00';

  const defaultValues = {
    reservationType: existingRequest?.selected_options?.reservationType || recommendationType || '',
    peopleCount: existingRequest?.selected_options?.peopleCount || '2',
    reservationName: existingRequest?.selected_options?.reservationName || recommendationTitle || '',
    preferredDate: defaultDate,
    preferredTime: defaultTime,
    note: existingRequest?.note || ''
  };

  const form = useForm<FormData>({
    defaultValues,
    mode: 'onChange'
  });

  const { handleSubmitRequest } = useServiceSubmitter({
    service: { id: serviceData.service_id, name: 'Reservation' },
    serviceState: { serviceType: 'reservation', serviceId: serviceData.service_id },
    onSubmitStart: () => setIsSubmitting(true),
    onSubmitEnd: () => setIsSubmitting(false)
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: t('common.error'),
        description: t('services.loginRequired'),
        variant: 'destructive'
      });
      return;
    }

    if (!data.reservationType || !data.reservationName) {
      toast({
        title: t('common.error'),
        description: t('services.fillAllFields'),
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const isoDateTime = new Date(
        data.preferredDate.getFullYear(),
        data.preferredDate.getMonth(),
        data.preferredDate.getDate(),
        parseInt(data.preferredTime.split(':')[0]),
        parseInt(data.preferredTime.split(':')[1])
      ).toISOString();

      // Fix: Modify the object to match ServiceFormData structure
      const requestData = {
        preferredDate: data.preferredDate.toISOString().split('T')[0], // Add missing preferredDate
        preferredTime: data.preferredTime, // Add missing preferredTime
        note: data.note || null,
        // Include all data as selected options
        selectedOptions: {
          reservationType: data.reservationType,
          peopleCount: data.peopleCount,
          reservationName: data.reservationName
        },
        // Add these as extra properties that ServiceSubmitter will use
        service_id: serviceData?.service_id,
        user_id: user.id,
        profile_id: user.id,
        preferred_time: isoDateTime,
      };

      const success = await handleSubmitRequest(requestData);

      if (success) {
        navigate('/services');
      }
    } catch (error) {
      console.error('Error submitting reservation request:', error);
      toast({
        title: t('common.error'),
        description: t('services.requestErrorDesc'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reservationTypes = serviceData?.optional_fields?.selectFields?.find(
    (field: any) => field.name === 'type'
  )?.options || ['restaurant', 'activity', 'excursion', 'other'];

  return (
    <div className="pb-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Scheduling Information */}
          <LuxuryCard>
            <FormSectionTitle 
              title={t('services.schedulingInformation')} 
              icon={<CalendarClock className="w-5 h-5" />}
              rawKeys={true}
            />
            <div className="mt-3">
              <DateTimePickerSection form={form} />
            </div>
          </LuxuryCard>

          {/* Reservation Details */}
          <LuxuryCard>
            <FormSectionTitle 
              title={t('services.requestReservation')} 
              icon={<Users className="w-5 h-5" />}
              rawKeys={true}
            />
            <div className="mt-4 space-y-4">
              {/* Reservation Type */}
              <FormField
                control={form.control}
                name="reservationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('services.reservationType')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={cn(
                          "w-full bg-darcare-navy/50 border-darcare-gold/30",
                          "focus:border-darcare-gold/60 focus:ring-0"
                        )}>
                          <SelectValue placeholder={t('services.reservationType')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reservationTypes.map((type: string) => (
                          <SelectItem key={type} value={type}>
                            {t(`explore.categories.${type.toLowerCase()}`, type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of People */}
              <FormField
                control={form.control}
                name="peopleCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('services.peopleCount')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="50"
                        className={cn(
                          "bg-darcare-navy/50 border-darcare-gold/30",
                          "focus:border-darcare-gold/60 focus:ring-0"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reservation Name */}
              <FormField
                control={form.control}
                name="reservationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('services.reservationName')}</FormLabel>
                    <FormControl>
                      <Input
                        className={cn(
                          "bg-darcare-navy/50 border-darcare-gold/30",
                          "focus:border-darcare-gold/60 focus:ring-0"
                        )}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </LuxuryCard>

          {/* Special Requests */}
          <LuxuryCard>
            <FormSectionTitle 
              title={t('services.specialRequests')} 
              icon={<PenLine className="w-5 h-5" />}
              rawKeys={true}
            />
            <div className="mt-3">
              <Textarea
                placeholder={t('services.notesPlaceholder')}
                className={cn(
                  "min-h-[120px] bg-darcare-navy/50 border-darcare-gold/30",
                  "focus:border-darcare-gold/60 focus:ring-0"
                )}
                {...form.register('note')}
              />
            </div>
          </LuxuryCard>

          {/* Submit Button */}
          <div className="pt-4 pb-16">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={cn(
                "w-full h-12 font-serif text-lg",
                isDarkMode 
                  ? "bg-darcare-gold hover:bg-darcare-gold/90 text-darcare-navy" 
                  : "bg-darcare-deepGold hover:bg-darcare-deepGold/90 text-white"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('common.submitting')}
                </span>
              ) : editMode ? (
                t('services.updateRequest')
              ) : (
                t('services.sendRequest')
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ReservationService;
