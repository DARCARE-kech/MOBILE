
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import DrawerMenu from '@/components/DrawerMenu';
import { useTranslation } from 'react-i18next';

interface ServiceHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
  showWeather?: boolean;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ 
  title,
  showBackButton = false,
  rightComponent,
  showWeather = false
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Translate title if needed
 const translatedTitle =
  title in t('services.labels', { returnObjects: true }) ? t(`services.labels.${title}`) : title;

  
  return (
    <AppHeader 
      title={translatedTitle}
      rightContent={rightComponent}
      onBack={showBackButton ? () => navigate('/services') : undefined}
      drawerContent={!showBackButton ? <DrawerMenu /> : undefined}
    />
  );
};

export default ServiceHeader;
