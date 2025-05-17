
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { CalendarClock, PenLine, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { DateTimeSelector } from '@/components/services/space-booking/DateTimeSelector';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { useServiceRequestForForm } from '@/hooks/useServiceRequest';
import { useServiceSubmitter } from '@/components/services/ServiceRequestSubmitter';
import ServiceRequestLoader from '@/components/services/ServiceRequestLoader';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import DynamicFields from '@/components/services/form/DynamicFields';

interface ServiceRequestFormProps {
  serviceType: string;
  serviceId?: string;
  existingRequest?: any;
  editMode?: boolean;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  serviceType,
  serviceId,
  existingRequest,
  editMode = false
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  
  // Force the location state to use our props
  const location = useLocation();
  const locationState = {
    ...location.state,
    serviceType,
    serviceId
  };
  
  // Use our custom hook to handle service data fetching
  const {
    serviceState,
    service,
    serviceDetails,
    isLoading,
    enhanceOptionalFields,
    getServiceTitle
  } = useServiceRequestForForm();
  
  // Use our custom hook to handle form submission
  const { handleSubmitRequest } = useServiceSubmitter({
    service,
    serviceState: { ...serviceState, serviceType, serviceId },
    onSubmitStart: () => setIsSubmitting(true),
    onSubmitEnd: () => setIsSubmitting(false)
  });
  
  const form = useForm({
    defaultValues: {
      preferredDate: '',
      preferredTime: '',
      note: existingRequest?.note || '',
    }
  });
  
  if (isLoading) {
    return <ServiceRequestLoader onBack={() => navigate(-1)} />;
  }
  
  // Get the optional fields from the service details
  const optionalFields = enhanceOptionalFields();
  
  const onSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      
      // Format date and time
      let preferredTime = null;
      if (selectedTime) {
        preferredTime = selectedTime.toISOString();
      }
      
      // Prepare the request data
      const requestData = {
        ...values,
        preferredTime,
      };
      
      // Handle the submission and store result
      const success = await handleSubmitRequest(requestData);
      
      // Only navigate if result is truthy (successful submission)
      if (success === true) {
        navigate('/services');
      }
    } catch (error) {
      console.error('Error submitting service request:', error);
      toast({
        title: t('services.errorSubmitting', 'Error Submitting'),
        description: t('services.pleaseTryAgain', 'Please try again later'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Scheduling Details */}
        <LuxuryCard>
          <FormSectionTitle 
            title={t('services.schedulingDetails')} 
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

        {/* Dynamic Fields Section */}
        {optionalFields && Object.keys(optionalFields).length > 0 && (
          <LuxuryCard>
            <DynamicFields 
              form={form} 
              optionalFields={optionalFields} 
            />
          </LuxuryCard>
        )}

        {/* Special Requests */}
        <LuxuryCard>
          <FormSectionTitle 
            title={t('services.specialRequests', 'Special Requests')} 
            icon={<PenLine className="w-5 h-5" />}
            rawKeys={true}
          />
          <div className="mt-3">
            <Textarea
              placeholder={t('services.specialRequestsPlaceholder', 'Any special instructions or requests...')}
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
                {t('services.submitting', 'Submitting...')}
              </span>
            ) : editMode ? (
              t('services.updateRequest', 'Update Request')
            ) : (
              t('services.submitRequest', 'Submit Request')
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ServiceRequestForm;
