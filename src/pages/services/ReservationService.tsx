
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { Card } from "@/components/ui/card";

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
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get prefilled data if available from state
  const prefilledData = location.state?.prefilledData || {};

  // Use URL search params as a fallback for direct links
  const searchParams = new URLSearchParams(location.search);
  const recommendationTitle = searchParams.get('title') || prefilledData.reservationName;
  const recommendationType = searchParams.get('type') || prefilledData.reservationType;

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

  // Update form values when prefilled data changes
  useEffect(() => {
    if (prefilledData.reservationType) {
      form.setValue('reservationType', prefilledData.reservationType);
    }
    
    if (prefilledData.reservationName) {
      form.setValue('reservationName', prefilledData.reservationName);
    }
  }, [prefilledData, form]);

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

      // Format the date and time for submission
      const formattedDate = data.preferredDate.toISOString().split('T')[0];
      
      // Create the properly structured request data
      const requestData = {
        // Include required fields in the root of the object
        preferredDate: formattedDate,
        preferredTime: data.preferredTime,
        note: data.note || null,
        // Only include form-specific fields in selectedOptions
        selectedOptions: {
          reservationType: data.reservationType,
          peopleCount: data.peopleCount,
          reservationName: data.reservationName
        }
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
  <div className="p-4 pb-24">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="bg-darcare-navy/50 border border-darcare-gold/20 rounded-xl p-5 space-y-6">

          {/* Scheduling Information */}
          <DateTimePickerSection form={form} />

          {/* Reservation Details */}
          <FormSectionTitle 
            title={t('services.requestReservation')} 
            icon={<Users className="w-5 h-5" />}
            rawKeys={true}
          />

          <div className="space-y-4">
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

          {/* Special Requests */}
          <FormSectionTitle 
            title={t('services.specialRequests')} 
            icon={<PenLine className="w-5 h-5" />}
            rawKeys={true}
          />
          <Textarea
            placeholder={t('services.notesPlaceholder')}
            className={cn(
              "min-h-[120px] bg-darcare-navy/50 border-darcare-gold/30",
              "focus:border-darcare-gold/60 focus:ring-0"
            )}
            {...form.register('note')}
          />

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-12 bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 font-serif text-lg"
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

        </Card>
      </form>
    </Form>
  </div>
);
};

export default ReservationService;
