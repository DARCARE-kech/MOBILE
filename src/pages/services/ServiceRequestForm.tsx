
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import DynamicServiceForm from '@/components/services/DynamicServiceForm';
import { FormData } from '@/components/services/form/formHelpers';
import ServiceRequestHeader from '@/components/services/ServiceRequestHeader';
import ServiceRequestLoader from '@/components/services/ServiceRequestLoader';
import { useServiceRequestForForm } from '@/hooks/useServiceRequest';
import { useServiceSubmitter } from '@/components/services/ServiceRequestSubmitter';

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
  const [submitting, setSubmitting] = useState(false);
  
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
  
  // Log service information for debugging
  console.log('Current service data in form:', service);
  console.log('Service ID in form:', service?.id);
  console.log('Using provided serviceType:', serviceType);
  console.log('Using provided serviceId:', serviceId);
  
  // Use our custom hook to handle form submission
  const { handleSubmitRequest } = useServiceSubmitter({
    service,
    serviceState: { ...serviceState, serviceType, serviceId },
    onSubmitStart: () => setSubmitting(true),
    onSubmitEnd: () => setSubmitting(false)
  });
  
  if (isLoading) {
    return <ServiceRequestLoader onBack={() => navigate(-1)} />;
  }
  
  return (
    <div className="min-h-screen bg-darcare-navy">
      <ServiceRequestHeader serviceTitle={getServiceTitle() || (serviceType === 'hair' ? 'Hair Salon' : 'Kids Club')} />
      <div className="pt-16 pb-20">
        <DynamicServiceForm 
          serviceId={serviceId || service?.id || ''}
          serviceType={serviceType || serviceState.serviceType || service?.name?.toLowerCase() || ''}
          serviceName={service?.name || (serviceType === 'hair' ? 'Hair Salon' : 'Kids Club')}
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
