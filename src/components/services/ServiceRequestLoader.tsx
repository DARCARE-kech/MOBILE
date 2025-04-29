
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';

interface ServiceRequestLoaderProps {
  onBack: () => void;
}

const ServiceRequestLoader: React.FC<ServiceRequestLoaderProps> = ({ onBack }) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-darcare-navy flex flex-col">
      <MainHeader title={t('services.newRequest')} onBack={onBack} />
      <div className="flex-1 flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-darcare-gold" />
      </div>
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ServiceRequestLoader;
