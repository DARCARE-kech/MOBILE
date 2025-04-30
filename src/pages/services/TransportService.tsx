
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
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  vehicleType: string;
  driverLanguage: string;
  passengers: number;
  luggageSupport: boolean;
}

const TransportService: React.FC<TransportServiceProps> = ({ serviceData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const optionalFields = serviceData?.optional_fields || {};
  const vehicleTypes = optionalFields.vehicle_types || ["van", "sedan", "luxury car", "motorbike"];
  const languageOptions = optionalFields.driver_languages || ["english", "french", "arabic"];
  
  const form = useForm<FormValues>({
    defaultValues: {
      date: new Date(),
      time: '12:00',
      note: '',
      vehicleType: '',
      driverLanguage: 'english',
      passengers: 2,
      luggageSupport: false
    }
  });
  
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
      
      const { error } = await supabase.from('service_requests').insert({
        service_id: serviceData?.service_id,
        user_id: user.id,
        preferred_time: isoDateTime,
        note: data.note,
        selected_options: {
          vehicleType: data.vehicleType,
          driverLanguage: data.driverLanguage,
          passengers: data.passengers,
          luggageSupport: data.luggageSupport
        }
      });
      
      if (error) throw error;
      
      toast.success(t('services.requestSubmitted'), {
        description: t('services.requestSubmittedDesc')
      });
      
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
      {/* Service Header with instructions */}
      <ServiceHeader 
        serviceName={serviceData?.category || t('services.transport')}
        serviceDetail={serviceData}
      />
      
      {/* Form Card */}
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Vehicle Type Selection */}
            <OptionField
              form={form}
              fieldType="radio"
              name="vehicleType"
              label={t('services.vehicleType')}
              options={vehicleTypes}
            />
            
            {/* Driver Language Selection */}
            <OptionField
              form={form}
              fieldType="radio"
              name="driverLanguage"
              label={t('services.driverLanguage')}
              options={languageOptions}
            />
            
            {/* Number of Passengers */}
            <OptionField
              form={form}
              fieldType="number"
              name="passengers"
              label={t('services.passengers')}
              min={1}
              max={6}
            />
            
            {/* Luggage Support Toggle */}
            <OptionField
              form={form}
              fieldType="toggle"
              name="luggageSupport"
              label={t('services.luggageSupport')}
            />
            
            {/* Date and Time Selection */}
            <DateTimePickerSection form={form} />
            
            {/* Notes Field */}
            <NoteInput form={form} />
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
            >
              {isSubmitting ? t('common.submitting') : t('services.sendRequest')}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default TransportService;
