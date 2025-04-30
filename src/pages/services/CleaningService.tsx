
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

interface CleaningServiceProps {
  serviceData?: ServiceDetail;
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  cleaningType: string;
  rooms: {
    bedroom: boolean;
    kitchen: boolean;
    bathroom: boolean;
    balcony: boolean;
    all_areas: boolean;
  };
}

const CleaningService: React.FC<CleaningServiceProps> = ({ serviceData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const optionalFields = serviceData?.optional_fields || {};
  const cleaningTypes = optionalFields.cleaning_types || ["standard cleaning", "deep cleaning", "premium cleaning"];
  const roomOptions = optionalFields.rooms || ["bedroom", "kitchen", "bathroom", "balcony", "all areas"];
  
  const form = useForm<FormValues>({
    defaultValues: {
      date: new Date(),
      time: '12:00',
      note: '',
      cleaningType: '',
      rooms: {
        bedroom: false,
        kitchen: false,
        bathroom: false,
        balcony: false,
        all_areas: false,
      }
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
      
      // Convert selected rooms to a more concise format
      const selectedRooms = Object.entries(data.rooms)
        .filter(([_, isSelected]) => isSelected)
        .map(([room]) => room);
      
      const { error } = await supabase.from('service_requests').insert({
        service_id: serviceData?.service_id,
        user_id: user.id,
        preferred_time: isoDateTime,
        note: data.note,
        selected_options: {
          cleaningType: data.cleaningType,
          selectedRooms
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
        serviceName={serviceData?.category || t('services.cleaning')}
        serviceDetail={serviceData}
      />
      
      {/* Form Card */}
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Cleaning Type Option */}
            <OptionField
              form={form}
              fieldType="radio"
              name="cleaningType"
              label={t('services.cleaningType')}
              options={cleaningTypes}
            />
            
            {/* Rooms Selection */}
            <div className="space-y-4">
              <h3 className="text-darcare-gold font-serif">{t('services.selectRooms')}</h3>
              {roomOptions.map((room) => (
                <OptionField
                  key={room}
                  form={form}
                  fieldType="checkbox"
                  name={`rooms.${room.replace(/\s+/g, '_').toLowerCase()}`}
                  label={room}
                  options={[room]}
                />
              ))}
            </div>
            
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

export default CleaningService;
