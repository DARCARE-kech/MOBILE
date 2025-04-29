
import React from 'react';
import { Clock, Wallet } from 'lucide-react';
import { 
  LuxuryCard, 
  LuxuryCardContent, 
  LuxuryCardHeader, 
  LuxuryCardTitle
} from '@/components/ui/luxury-card';
import { useTranslation } from 'react-i18next';
import { ServiceDetail } from './formHelpers';

interface ServiceDetailsCardProps {
  serviceName: string | undefined;
  serviceType: string;
  serviceDetails: ServiceDetail | undefined;
}

const ServiceDetailsCard: React.FC<ServiceDetailsCardProps> = ({
  serviceName,
  serviceType,
  serviceDetails
}) => {
  const { t } = useTranslation();
  
  if (!serviceDetails) return null;
  
  return (
    <LuxuryCard className="mb-6 -mt-4 relative z-10">
      <LuxuryCardHeader>
        <LuxuryCardTitle className="text-darcare-gold">
          {serviceName || t(`services.${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}`)}
        </LuxuryCardTitle>
        
        {/* Display service details like price and duration */}
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-darcare-beige/80">
          {serviceDetails.default_duration && (
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-darcare-gold" />
              <span>{serviceDetails.default_duration}</span>
            </div>
          )}
          {serviceDetails.price_range && (
            <div className="flex items-center gap-1.5">
              <Wallet size={16} className="text-darcare-gold" />
              <span>{serviceDetails.price_range}</span>
            </div>
          )}
        </div>
      </LuxuryCardHeader>
      
      <LuxuryCardContent>
        {/* Service Instructions */}
        {serviceDetails.instructions && (
          <div className="mb-4 text-darcare-beige/90 text-sm">
            {serviceDetails.instructions}
          </div>
        )}
      </LuxuryCardContent>
    </LuxuryCard>
  );
};

export default ServiceDetailsCard;
