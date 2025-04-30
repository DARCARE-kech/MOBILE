
import React from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LuxuryCard, LuxuryCardHeader, LuxuryCardTitle } from '@/components/ui/luxury-card';
import { ServiceDetail } from '@/hooks/services/types';

interface ServiceHeaderProps {
  serviceName: string | undefined;
  serviceDetail: ServiceDetail | undefined;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ serviceName, serviceDetail }) => {
  const { t } = useTranslation();
  
  return (
    <LuxuryCard className="mb-6">
      <LuxuryCardHeader>
        <LuxuryCardTitle className="text-darcare-gold font-serif">
          {serviceName || t('services.service')}
        </LuxuryCardTitle>
        
        {/* Display service details like price and duration */}
        {serviceDetail && (
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-darcare-beige/80">
            {serviceDetail.default_duration && (
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-darcare-gold" />
                <span>{serviceDetail.default_duration}</span>
              </div>
            )}
            {serviceDetail.price_range && (
              <div className="text-darcare-gold/80">
                <span>{serviceDetail.price_range}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Service Instructions */}
        {serviceDetail?.instructions && (
          <div className="mt-4 text-darcare-beige/90 text-sm">
            {serviceDetail.instructions}
          </div>
        )}
      </LuxuryCardHeader>
    </LuxuryCard>
  );
};

export default ServiceHeader;
