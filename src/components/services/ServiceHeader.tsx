
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
    <AppHeader title={title}>
      {showBackButton && (
        <button 
          onClick={() => navigate('/services')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-darcare-gold/10"
        >
          <ArrowLeft className="text-darcare-gold w-5 h-5" />
        </button>
      )}
      {rightComponent}
    </AppHeader>
  );
};

export default ServiceHeader;
