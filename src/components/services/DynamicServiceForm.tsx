
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import ServiceBanner from '@/components/services/ServiceBanner';
import ServiceDetailsCard from './form/ServiceDetailsCard';
import DateTimeFields from './form/DateTimeFields';
import DynamicFields from './form/DynamicFields';
import NoteField from './form/NoteField';
import SubmitButton from './form/SubmitButton';
import { generateDefaultValues, FormData, ServiceFormProps } from './form/formHelpers';

const DynamicServiceForm: React.FC<ServiceFormProps> = ({
  serviceId,
  serviceType,
  serviceName,
  serviceImageUrl,
  serviceDetails,
  optionalFields,
  onSubmitSuccess
}) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      preferredDate: '',
      preferredTime: '',
      note: '',
      ...generateDefaultValues(optionalFields)
    }
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Process form data
      console.log('Form data:', data);
      
      // Call the callback function if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 pb-24">
      {/* Service Banner (if image is available) */}
      {serviceImageUrl && (
        <ServiceBanner 
          imageUrl={serviceImageUrl} 
          altText={serviceName || serviceType} 
          withGradient={true} 
        />
      )}
      
      {/* Service Details Card */}
      <ServiceDetailsCard 
        serviceName={serviceName}
        serviceType={serviceType}
        serviceDetails={serviceDetails}
      />
      
      {/* Form Container */}
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <h2 className="text-darcare-gold font-serif text-xl mb-4">
          {t(`services.request${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}`)}
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Date and Time Selection */}
            <DateTimeFields form={form} />
            
            {/* Dynamically generated form fields */}
            <DynamicFields form={form} optionalFields={optionalFields} />
            
            {/* Notes Field */}
            <NoteField form={form} />
            
            {/* Submit Button */}
            <SubmitButton 
              isSubmitting={isSubmitting} 
              isValid={form.formState.isValid} 
            />
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default DynamicServiceForm;
