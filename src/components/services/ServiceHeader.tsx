
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
  const { t } = useTranslation();
const key = title.toLowerCase();
const labelKeys = t('services.labels', { returnObjects: true }) as Record<string, string>;
const translatedTitle = key in labelKeys ? t(`services.labels.${key}`) : title;

  console.log("🌐 Langue active :", i18n.language);
console.log("🔑 Clé service :", rawKey);
console.log("📦 Labels disponibles :", serviceLabels);
console.log("✅ Titre affiché :", translatedTitle);
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
