
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
      vehicleType: editMode && existingRequest?.selected_options?.vehicleType
        ? existingRequest.selected_options.vehicleType
        : ''
    },
    mode: 'onChange'
  });
  
  // Check if form is valid for enabling submit button
  const isFormValid = () => {
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

      console.log('Using service_id:', serviceData?.service_id);
      
      if (!serviceData?.service_id) {
        console.warn('Warning: service_id is undefined - this will cause naming issues in My Requests');
      }
      
      const requestData = {
        service_id: serviceData?.service_id,
        user_id: user.id,
        profile_id: user.id,
        preferred_time: isoDateTime,
        note: data.note || null,
        selected_options: {
          driverLanguage: data.driverLanguage,
          passengers: data.passengers,
          luggageSupport: data.luggageSupport
        }
      };

      console.log('Submitting transport service request:', requestData);
      
      let error;
      
      if (editMode && existingRequest?.id) {
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
    <div className="p-4 pb-24">
      <ServiceHeader 
        serviceName={serviceData?.category || t('services.transport')}
        serviceDetail={serviceData}
      />
      
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <OptionField
              form={form}
              fieldType="radio"
              name="driverLanguage"
              label={t('services.driverLanguage')}
              options={languageOptions}
            />
            
            <OptionField
              form={form}
              fieldType="number"
              name="passengers"
              label={t('services.passengers')}
              min={1}
              max={6}
            />
            
            <OptionField
              form={form}
              fieldType="toggle"
              name="luggageSupport"
              label={t('services.luggageSupport')}
              subtitle={t('services.luggageSubtitle')}
            />
            
            <DateTimePickerSection form={form} />
            
            <NoteInput form={form} />
            
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
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
