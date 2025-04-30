
import React, { useState, useEffect } from 'react';
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
import { WashingMachine, Shirt } from 'lucide-react';

interface LaundryServiceProps {
  serviceData?: ServiceDetail;
  existingRequest?: any;
  editMode?: boolean;
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  services: {
    washing: boolean;
    drying: boolean;
    ironing: boolean;
    folding: boolean;
  };
  specialFabrics: {
    silk: boolean;
    wool: boolean;
    delicate: boolean;
  };
  weight: number;
  sameDayDelivery: boolean;
}

const LaundryService: React.FC<LaundryServiceProps> = ({ 
  serviceData,
  existingRequest,
  editMode = false
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const optionalFields = serviceData?.optional_fields || {};
  const serviceOptions = optionalFields.service_options || ["washing", "drying", "ironing", "folding"];
  const fabricOptions = optionalFields.fabric_options || ["silk", "wool", "delicate"];
  
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
  
  // Extract selected services from existingRequest
  const getDefaultServices = () => {
    const defaultServices = {
      washing: false,
      drying: false,
      ironing: false,
      folding: false
    };
    
    if (editMode && existingRequest?.selected_options?.selectedServices) {
      const selectedServices = existingRequest.selected_options.selectedServices;
      selectedServices.forEach((service: string) => {
        if (defaultServices.hasOwnProperty(service)) {
          defaultServices[service as keyof typeof defaultServices] = true;
        }
      });
    }
    
    return defaultServices;
  };
  
  // Extract selected fabrics from existingRequest
  const getDefaultFabrics = () => {
    const defaultFabrics = {
      silk: false,
      wool: false,
      delicate: false
    };
    
    if (editMode && existingRequest?.selected_options?.selectedFabrics) {
      const selectedFabrics = existingRequest.selected_options.selectedFabrics;
      selectedFabrics.forEach((fabric: string) => {
        if (defaultFabrics.hasOwnProperty(fabric)) {
          defaultFabrics[fabric as keyof typeof defaultFabrics] = true;
        }
      });
    }
    
    return defaultFabrics;
  };
  
  const form = useForm<FormValues>({
    defaultValues: {
      date: getDefaultDate(),
      time: getDefaultTime(),
      note: editMode && existingRequest?.note ? existingRequest.note : '',
      services: getDefaultServices(),
      specialFabrics: getDefaultFabrics(),
      weight: editMode && existingRequest?.selected_options?.weight 
        ? existingRequest.selected_options.weight 
        : 3,
      sameDayDelivery: editMode && existingRequest?.selected_options?.sameDayDelivery 
        ? existingRequest.selected_options.sameDayDelivery 
        : false
    },
    mode: 'onChange'
  });
  
  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    const { services } = form.getValues();
    // Check if at least one service is selected
    return Object.values(services).some(value => value === true);
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
      
      // Convert selected services to a more concise format
      const selectedServices = Object.entries(data.services)
        .filter(([_, isSelected]) => isSelected)
        .map(([service]) => service);
        
      // Convert selected fabrics to a more concise format
      const selectedFabrics = Object.entries(data.specialFabrics)
        .filter(([_, isSelected]) => isSelected)
        .map(([fabric]) => fabric);
      
      const requestData = {
        service_id: serviceData?.service_id,
        user_id: user.id,
        preferred_time: isoDateTime,
        note: data.note,
        selected_options: {
          selectedServices,
          selectedFabrics,
          weight: data.weight,
          sameDayDelivery: data.sameDayDelivery
        }
      };
      
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
    <div className="p-4 pb-24">
      {/* Service Header with instructions */}
      <ServiceHeader 
        serviceName={serviceData?.category || t('services.laundry')}
        serviceDetail={serviceData}
      />
      
      {/* Form Card */}
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Laundry Services Selection */}
            <OptionField
              form={form}
              fieldType="checkbox"
              name="services"
              label={t('services.laundryServices')}
              options={serviceOptions}
              icon={<WashingMachine className="h-5 w-5" />}
              subtitle={t('services.selectAtLeastOne')}
            />
            
            {/* Special Fabrics Selection */}
            <OptionField
              form={form}
              fieldType="checkbox"
              name="specialFabrics"
              label={t('services.specialFabrics')}
              options={fabricOptions}
              icon={<Shirt className="h-5 w-5" />}
              subtitle={t('services.fabricsSubtitle')}
            />
            
            {/* Weight Slider */}
            <OptionField
              form={form}
              fieldType="slider"
              name="weight"
              label={t('services.weight')}
              min={1}
              max={10}
              step={0.5}
              icon={<Shirt className="h-5 w-5" />}
            />
            
            {/* Same Day Delivery Toggle */}
            <OptionField
              form={form}
              fieldType="toggle"
              name="sameDayDelivery"
              label={t('services.sameDayDelivery')}
              subtitle={t('services.premiumService')}
            />
            
            {/* Date and Time Selection */}
            <DateTimePickerSection form={form} />
            
            {/* Notes Field */}
            <NoteInput form={form} />
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
            >
              {isSubmitting ? t('common.submitting') : 
                editMode ? t('services.updateRequest') : t('services.sendRequest')
              }
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default LaundryService;
