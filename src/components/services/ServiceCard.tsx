import React from 'react';
import { Card } from '@/components/ui/card';
import { Club, Car, Scissors, Bath } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    category?: string;
  };
  onSelect: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const getServiceIcon = () => {
    const serviceName = service.name.toLowerCase();

    if (serviceName.includes('hair') || serviceName.includes('salon')) {
      return <Scissors className="h-5 w-5" />;
    }

    if (serviceName.includes('transport') || serviceName.includes('car')) {
      return <Car className="h-5 w-5" />;
    }

    if (serviceName.includes('club') || serviceName.includes('access')) {
      return <Club className="h-5 w-5" />;
    }

    return <Bath className="h-5 w-5" />;
  };

  const getImageUrl = () => {
    if (!service.image_url) return null;
    if (service.image_url.startsWith('http')) {
      return service.image_url;
    }
    if (service.image_url.includes('/')) {
      return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${service.image_url}`;
    }
    return `${import.meta.env.VITE_PUBLIC_URL}/placeholder.svg`;
  };

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 border w-[140px] h-[140px] rounded-2xl flex-shrink-0",
        isDarkMode
          ? "bg-darcare-navy/50 border-darcare-gold/10 hover:border-darcare-gold/30"
          : "bg-white border-darcare-deepGold/10 hover:border-darcare-deepGold/30"
      )}
      onClick={onSelect}
    >
      <div className="relative w-full h-full">
        <img
          src={getImageUrl() || ''}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        {!service.image_url && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {getServiceIcon()}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-2 backdrop-blur-md bg-black/40 text-white">
          <h3 className="text-xs font-semibold truncate">
            {t(`services.${service.name}`, service.name)}
          </h3>
          {service.description && (
            <p className="text-[10px] opacity-80 leading-snug line-clamp-2">
              {service.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
