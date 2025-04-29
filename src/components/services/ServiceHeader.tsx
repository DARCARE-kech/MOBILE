
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';

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
  
  return (
    <AppHeader 
      title={title}
      rightContent={rightComponent}
      onBack={showBackButton ? () => navigate('/services') : undefined}
    />
  );
};

export default ServiceHeader;
