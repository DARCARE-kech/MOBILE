
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceRequestForm from '@/pages/services/ServiceRequestForm';
import ServiceHeader from '@/components/services/ServiceHeader';
import { ServiceDetail as ServiceDetailType } from '@/hooks/services/types';
import { LuxuryCard } from '@/components/ui/luxury-card';
import { Loader2 } from 'lucide-react';

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
  const { t } = useTranslation();
  
  // Fetch the service to get more details like name and image
  const { data: service, isLoading } = useQuery({
    queryKey: ['service-data', serviceData?.service_id],
    queryFn: async () => {
      if (!serviceData?.service_id) return null;
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceData.service_id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!serviceData?.service_id
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center pt-8">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      <ServiceHeader
        serviceName={service?.name || "Hair Salon"}
        serviceDetail={service}
      />
      
      <div className="px-4 py-6">
        <LuxuryCard className="mb-6">
          <div className="p-5">
            <h2 className="text-darcare-gold font-serif text-xl mb-3">
              {t('services.hairSalon', 'Hair Salon Service')}
            </h2>
            <p className="text-darcare-beige">
              {service?.description || t('services.hairSalonDescription', 'Book a salon appointment for haircuts, styling, coloring and more. Our professional stylists offer a variety of services.')}
            </p>
          </div>
        </LuxuryCard>
      
        <ServiceRequestForm
          serviceType="hair"
          serviceId={serviceData?.service_id}
          existingRequest={existingRequest}
          editMode={editMode}
        />
      </div>
    </div>
  );
};

export default HairSalonService;
