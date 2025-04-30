
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CleaningService from '@/pages/services/CleaningService';
import MaintenanceService from '@/pages/services/MaintenanceService';
import TransportService from '@/pages/services/TransportService';
import BookSpaceService from '@/pages/services/BookSpaceService';
import ShopService from '@/pages/services/ShopService';
import LaundryService from '@/pages/services/LaundryService';
import { Loader2 } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';
import { ServiceDetail as ServiceDetailType } from '@/hooks/services/types';

// Base service type
type ServiceType = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  estimated_duration: string | null;
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Fetch the base service information
  const { data: service, isLoading: isLoadingService, error: serviceError } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as ServiceType;
    },
    enabled: !!id && id !== 'book-space' && id !== 'shop'
  });

  // Fetch the service-specific details based on service type
  const { data: serviceDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['service-details', id, service?.name],
    queryFn: async () => {
      if (!service) return null;
      
      // For all standard services, we now query the unified service_details table
      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('service_id', service.id)
        .single();
      
      if (error) {
        console.error(`Error fetching service details:`, error);
        return null;
      }
      
      return data as ServiceDetailType;
    },
    enabled: !!service
  });
  
  const isLoading = isLoadingService || isLoadingDetails;
  
  if (id === 'book-space') {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('services.bookSpace')} onBack={() => navigate('/services')} />
        <div className="pt-16">
          <BookSpaceService />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  if (id === 'shop') {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('services.shop')} onBack={() => navigate('/services')} />
        <ShopService />
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-darcare-navy">
        <MainHeader title={t('common.loading')} onBack={() => navigate('/services')} />
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  if (serviceError || !service) {
    navigate('/services');
    return null;
  }
  
  const serviceNameLower = service?.name.toLowerCase();
  
  // Pass serviceDetails to the specific service component
  if (serviceNameLower?.includes('laundry')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={service.name} onBack={() => navigate('/services')} />
        <div className="pt-16">
          <LaundryService serviceData={serviceDetails || undefined} />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('cleaning')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={service.name} onBack={() => navigate('/services')} />
        <div className="pt-16">
          <CleaningService serviceData={serviceDetails || undefined} />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('maintenance')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={service.name} onBack={() => navigate('/services')} />
        <div className="pt-16">
          <MaintenanceService serviceData={serviceDetails || undefined} />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('transport')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={service.name} onBack={() => navigate('/services')} />
        <div className="pt-16">
          <TransportService serviceData={serviceDetails || undefined} />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else {
    navigate('/services');
    return null;
  }
};

export default ServiceDetail;
