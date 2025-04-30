
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
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  maintenanceType: string;
  urgency: string;
}

const MaintenanceService: React.FC<MaintenanceServiceProps> = ({ serviceData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const optionalFields = serviceData?.optional_fields || {};
  const maintenanceTypes = optionalFields.maintenance_types || ["plumbing", "electrical", "AC", "painting"];
  const urgencyLevels = optionalFields.urgency_levels || ["standard", "urgent"];
  
  const form = useForm<FormValues>({
    defaultValues: {
      date: new Date(),
      time: '12:00',
      note: '',
      maintenanceType: '',
      urgency: 'standard'
    },
    mode: 'onChange'
  });
  
  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    const { maintenanceType } = form.getValues();
    return !!maintenanceType;
  };
  
  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `maintenance/${fileName}`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('service_images')
        .upload(filePath, imageFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
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
      // Upload image if present
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      
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
        image_url: imageUrl,
        selected_options: {
          maintenanceType: data.maintenanceType,
          urgency: data.urgency
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
        serviceName={serviceData?.category || t('services.maintenance')}
        serviceDetail={serviceData}
      />
      
      {/* Form Card */}
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Maintenance Type Option */}
            <OptionField
              form={form}
              fieldType="radio"
              name="maintenanceType"
              label={t('services.maintenanceType')}
              options={maintenanceTypes}
              icon={<Wrench className="h-5 w-5" />}
            />
            
            {/* Urgency Selection */}
            <OptionField
              form={form}
              fieldType="radio"
              name="urgency"
              label={t('services.urgency')}
              options={urgencyLevels}
            />
            
            {/* Image Upload */}
            <div className="space-y-3">
              <FormSectionTitle 
                title={t('services.uploadImage')}
                subtitle={t('services.imageHelp')}
              />
              <FileUpload onFileChange={setImageFile} />
            </div>
            
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
              {isSubmitting ? t('common.submitting') : t('services.sendRequest')}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default MaintenanceService;
