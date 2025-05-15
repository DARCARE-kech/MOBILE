
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceRequestForm from '@/pages/services/ServiceRequestForm';
import ServiceHeader from '@/components/services/ServiceHeader';
import { ServiceDetail as ServiceDetailType } from '@/hooks/services/types';

interface HairSalonServiceProps {
  serviceData: ServiceDetailType;
  existingRequest?: any;
  editMode?: boolean;
}

const HairSalonService: React.FC<HairSalonServiceProps> = ({
  serviceData,
  existingRequest,
  editMode = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Ensure serviceData includes service_id for correctly tracking the service
  console.log("Hair Salon service data:", serviceData);

  return (
    <div className="pb-20">
      <ServiceHeader
        serviceName="Hair Salon"
        serviceDetail={serviceData}
      />
      
      <ServiceRequestForm
        serviceType="hair"
        serviceId={serviceData?.service_id}
        existingRequest={existingRequest}
        editMode={editMode}
      />
    </div>
  );
};

export default HairSalonService;
