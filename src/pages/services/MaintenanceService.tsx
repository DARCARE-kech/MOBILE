
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
import FileUpload from '@/components/services/form/FileUpload';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceDetail } from '@/hooks/services/types';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { Wrench } from 'lucide-react';

interface MaintenanceServiceProps {
  serviceData?: ServiceDetail;
  existingRequest?: any;
  editMode?: boolean;
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  maintenanceType: string;
  urgency: string;
}

const MaintenanceService: React.FC<MaintenanceServiceProps> = ({ 
  serviceData,
  existingRequest,
  editMode = false
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const optionalFields = serviceData?.optional_fields || {};
  const maintenanceTypes = optionalFields.maintenance_types || ["plumbing", "electrical", "AC", "painting"];
  const urgencyLevels = optionalFields.urgency_levels || ["standard", "urgent"];
  
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
      maintenanceType: editMode && existingRequest?.selected_options?.maintenanceType 
        ? existingRequest.selected_options.maintenanceType 
        : '',
      urgency: editMode && existingRequest?.selected_options?.urgency 
        ? existingRequest.selected_options.urgency 
        : 'standard'
    },
    mode: 'onChange'
  });
  
  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    const { maintenanceType } = form.getValues();
    return !!maintenanceType;
  };
  
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) {
      if (editMode && existingRequest?.image_url) {
        return existingRequest.image_url;
      }
      return null;
    }
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `maintenance/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('service_images')
        .upload(filePath, imageFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('service_images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
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
      let imageUrl = await uploadImage();
      
      const isoDateTime = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        parseInt(data.time.split(':')[0]),
        parseInt(data.time.split(':')[1])
      ).toISOString();
      
      const requestData = {
        service_id: serviceData?.service_id,
        user_id: user.id,
        profile_id: user.id,
        preferred_time: isoDateTime,
        note: data.note || null,
        image_url: imageUrl,
        selected_options: {
          maintenanceType: data.maintenanceType,
          urgency: data.urgency
        }
      };
      
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
        serviceName={serviceData?.category || t('services.maintenance')}
        serviceDetail={serviceData}
      />
      
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <OptionField
              form={form}
              fieldType="radio"
              name="maintenanceType"
              label={t('services.maintenanceType')}
              options={maintenanceTypes}
              icon={<Wrench className="h-4 w-4 sm:h-5 sm:w-5" />}
            />
            
            <OptionField
              form={form}
              fieldType="radio"
              name="urgency"
              label={t('services.urgency')}
              options={urgencyLevels}
            />
            
            <div className="space-y-3">
              <FormSectionTitle 
                title={t('services.uploadImage')}
                subtitle={t('services.imageHelp')}
                rawKeys={true}
              />
              <FileUpload 
                onFileChange={setImageFile} 
                existingUrl={editMode ? existingRequest?.image_url : undefined}
              />
            </div>
            
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

export default MaintenanceService;
