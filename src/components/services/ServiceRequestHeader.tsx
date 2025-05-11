
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MainHeader from '@/components/MainHeader';

interface ServiceRequestHeaderProps {
  serviceTitle: string;
}

const ServiceRequestHeader: React.FC<ServiceRequestHeaderProps> = ({ serviceTitle }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const key = serviceTitle?.toLowerCase();
const labelKeys = t('services.labels', { returnObjects: true }) as Record<string, string>;
const translatedTitle = key && key in labelKeys ? t(`services.labels.${key}`) : serviceTitle || t('services.newRequest');
  console.log("🔑 Raw title:", serviceTitle);
console.log("🌍 Langue active :", i18n.language);
console.log("🈁 Titre affiché :", translatedTitle);


return (
  <MainHeader 
    title={translatedTitle}
    onBack={() => navigate(-1)}
    rightContent={<div />}
  />
);
};

export default ServiceRequestHeader;
