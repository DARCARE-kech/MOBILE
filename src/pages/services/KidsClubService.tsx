
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceRequestForm from '@/pages/services/ServiceRequestForm';
import ServiceHeader from '@/components/services/ServiceHeader';
import { ServiceDetail as ServiceDetailType } from '@/hooks/services/types';

interface KidsClubServiceProps {
  serviceData: ServiceDetailType;
  existingRequest?: any;
  editMode?: boolean;
}

const KidsClubService: React.FC<KidsClubServiceProps> = ({
  serviceData,
  existingRequest,
  editMode = false
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Ensure serviceData includes service_id for correctly tracking the service
  console.log("Kids Club service data:", serviceData);

  return (
    <div className="pb-20">
      <ServiceHeader
        serviceName="Kids Club"
        serviceDetail={serviceData}
      />
      
      <ServiceRequestForm
        serviceType="kids"
        serviceId={serviceData?.service_id}
        existingRequest={existingRequest}
        editMode={editMode}
      />
    </div>
  );
};

export default KidsClubService;
