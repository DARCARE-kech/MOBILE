
import React from 'react';
import { ArrowLeft, Bell, CloudSun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceHeaderProps {
  title: string;
  showWeather?: boolean;
}

const ServiceHeader: React.FC<ServiceHeaderProps> = ({ title, showWeather = false }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between p-4 bg-darcare-navy border-b border-darcare-gold/20">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate('/services')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-darcare-gold/10"
        >
          <ArrowLeft className="text-darcare-gold w-5 h-5" />
        </button>
        <h1 className="text-darcare-gold font-serif text-xl">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {showWeather && (
          <div className="flex items-center text-darcare-beige">
            <CloudSun className="w-5 h-5 mr-1" />
            <span className="text-sm">28°C</span>
          </div>
        )}
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-darcare-gold/10">
          <Bell className="text-darcare-beige w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ServiceHeader;
