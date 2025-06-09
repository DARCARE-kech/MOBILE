
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import ServiceHeader from '@/components/services/form/ServiceHeader';
import OptionField from '@/components/services/form/OptionField';
import DateTimePickerSection from '@/components/services/form/DateTimePickerSection';
import NoteInput from '@/components/services/form/NoteInput';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceDetail } from '@/hooks/services/types';

interface TransportServiceProps {
  serviceData?: ServiceDetail;
  existingRequest?: any;
  editMode?: boolean;
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  driverLanguage: string;
  passengers: number;
  luggageSupport: boolean;
  // Adding vehicleType with an empty string as default value
  vehicleType: string;
}

const TransportService: React.FC<TransportServiceProps> = ({ 
  serviceData,
  existingRequest,
  editMode = false
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const optionalFields = serviceData?.optional_fields || {};
  const languageOptions = optionalFields.driver_languages || ["english", "french", "arabic"];
  
  // Extract date and time from existingRequest if in edit mode
  const getDefaultDate = (): Date => {
    if (editMode && existingRequest?.preferred_time) {
      return new Date(existingRequest.preferred_time);
    }
    return new Date();
  };
  
  const getDefaultTime = (): string => {
    if (editMode && existingRequest?.preferred_time) {
      const date = new Date(existingRequest.preferred_time);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    return '12:00';
  };
  
  const form = useForm<FormValues>({
    defaultValues: {
      date: getDefaultDate(),
      time: getDefaultTime(),
      note: editMode && existingRequest?.note ? existingRequest.note : '',
      driverLanguage: editMode && existingRequest?.selected_options?.driverLanguage 
        ? existingRequest.selected_options.driverLanguage 
        : 'english',
      passengers: editMode && existingRequest?.selected_options?.passengers 
        ? existingRequest.selected_options.passengers 
        : 2,
      luggageSupport: editMode && existingRequest?.selected_options?.luggageSupport 
        ? existingRequest.selected_options.luggageSupport 
        : false,
      // Initialize vehicleType with an existing value or empty string
      vehicleType: editMode && existingRequest?.selected_options?.vehicleType
        ? existingRequest.selected_options.vehicleType
        : ''
    },
    mode: 'onChange'
  });
  
  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    // Since vehicleType isn't actually used in the UI currently,
    // we can modify this validation to check other fields or always return true
    return true;
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error(t('common.error'), {
        description: t('services.loginRequired')
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const isoDateTime = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        parseInt(data.time.split(':')[0]),
        parseInt(data.time.split(':')[1])
      ).toISOString();

      // Vérification et log du service_id utilisé
      console.log('Using service_id:', serviceData?.service_id);
      
      if (!serviceData?.service_id) {
        console.warn('Warning: service_id is undefined - this will cause naming issues in My Requests');
      }
      
      const requestData = {
        service_id: serviceData?.service_id, // S'assurer que service_id est toujours inclus
        user_id: user.id,
        profile_id: user.id, // Définir profile_id égal à user_id
        preferred_time: isoDateTime,
        note: data.note || null, // S'assurer que note est toujours incluse
        selected_options: {
          driverLanguage: data.driverLanguage,
          passengers: data.passengers,
          luggageSupport: data.luggageSupport
          // We don't include vehicleType in the submitted data since it's not actually used
        }
      };

      console.log('Submitting transport service request:', requestData);
      
      let error;
      
      if (editMode && existingRequest?.id) {
        // Update existing request
        const { error: updateError } = await supabase
          .from('service_requests')
          .update(requestData)
          .eq('id', existingRequest.id);
        
        error = updateError;
        
        if (!updateError) {
          toast.success(t('services.requestUpdated'), {
            description: t('services.requestUpdatedDesc')
          });
        }
      } else {
        // Create new request
        const { error: insertError } = await supabase
          .from('service_requests')
          .insert(requestData);
        
        error = insertError;
        
        if (!insertError) {
          toast.success(t('services.requestSubmitted'), {
            description: t('services.requestSubmittedDesc')
          });
        }
      }
      
      if (error) throw error;
      
      navigate('/services');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(t('common.error'), {
        description: t('services.requestErrorDesc')
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-3 sm:p-4 pb-20 sm:pb-24 mobile-form-container">
      {/* Service Header with instructions */}
      <ServiceHeader 
        serviceName={serviceData?.category || t('services.transport')}
        serviceDetail={serviceData}
      />
      
      {/* Form Card */}
      <Card className="bg-darcare-navy border-darcare-gold/20 p-4 sm:p-5 rounded-lg sm:rounded-2xl mb-4 sm:mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Driver Language Selection */}
            <div className="mobile-form-section">
              <OptionField
                form={form}
                fieldType="radio"
                name="driverLanguage"
                label={t('services.driverLanguage')}
                options={languageOptions}
              />
            </div>
            
            {/* Number of Passengers */}
            <div className="mobile-form-section">
              <OptionField
                form={form}
                fieldType="number"
                name="passengers"
                label={t('services.passengers')}
                min={1}
                max={6}
              />
            </div>
            
            {/* Luggage Support Toggle */}
            <div className="mobile-form-section">
              <OptionField
                form={form}
                fieldType="toggle"
                name="luggageSupport"
                label={t('services.luggageSupport')}
                subtitle={t('services.luggageSubtitle')}
              />
            </div>
            
            {/* Date and Time Selection */}
            <div className="mobile-form-section">
              <DateTimePickerSection form={form} />
            </div>
            
            {/* Notes Field */}
            <div className="mobile-form-section">
              <NoteInput form={form} />
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 mobile-form-button h-10 sm:h-12 text-sm sm:text-base"
            >
              {isSubmitting ? t('common.submitting') : 
                editMode ? t('services.updateRequest') : t('services.sendRequest')}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default TransportService;
