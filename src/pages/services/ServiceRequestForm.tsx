
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import DynamicServiceForm from '@/components/services/DynamicServiceForm';
import { FormData } from '@/components/services/form/formHelpers';
import ServiceRequestHeader from '@/components/services/ServiceRequestHeader';
import ServiceRequestLoader from '@/components/services/ServiceRequestLoader';
import { useServiceRequestForForm } from '@/hooks/useServiceRequest';
import { useServiceSubmitter } from '@/components/services/ServiceRequestSubmitter';

const ServiceRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  
  // Use our custom hook to handle service data fetching
  const {
    serviceState,
    service,
    serviceDetails,
    isLoading,
    enhanceOptionalFields,
    getServiceTitle
  } = useServiceRequestForForm();
  
  // Log service information for debugging
  console.log('Current service data in form:', service);
  console.log('Service ID in form:', service?.id);
  
  // Use our custom hook to handle form submission
  const { handleSubmitRequest } = useServiceSubmitter({
    service,
    serviceState,
    onSubmitStart: () => setSubmitting(true),
    onSubmitEnd: () => setSubmitting(false)
  });
  
  if (isLoading) {
    return <ServiceRequestLoader onBack={() => navigate(-1)} />;
  }
  
  return (
    <div className="min-h-screen bg-darcare-navy">
      <ServiceRequestHeader serviceTitle={getServiceTitle()} />
      <div className="pt-16 pb-20">
        <DynamicServiceForm 
          serviceId={service?.id || ''}
          serviceType={serviceState.serviceType || service?.name?.toLowerCase() || ''}
          serviceName={service?.name}
          serviceImageUrl={service?.image_url}
          serviceDetails={serviceDetails}
          optionalFields={enhanceOptionalFields()}
          onSubmitSuccess={handleSubmitRequest}
        />
      </div>
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ServiceRequestForm;
