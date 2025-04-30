
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

  return (
    <MainHeader 
      title={serviceTitle || t('services.newRequest')} 
      onBack={() => navigate(-1)}
      rightContent={<div />} // Empty div to prevent default icons on service request screens
    />
  );
};

export default ServiceRequestHeader;
