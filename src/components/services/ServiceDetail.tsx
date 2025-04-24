
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

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && id !== 'book-space' && id !== 'shop'
  });
  
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
  
  if (error || !service) {
    navigate('/services');
    return null;
  }
  
  const serviceNameLower = service?.name.toLowerCase();
  
  if (serviceNameLower?.includes('laundry')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={service.name} onBack={() => navigate('/services')} />
        <div className="pt-16">
          <LaundryService />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('cleaning')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={service.name} onBack={() => navigate('/services')} />
        <div className="pt-16">
          <CleaningService />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('maintenance')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={service.name} onBack={() => navigate('/services')} />
        <div className="pt-16">
          <MaintenanceService />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('transport')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={service.name} onBack={() => navigate('/services')} />
        <div className="pt-16">
          <TransportService />
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
