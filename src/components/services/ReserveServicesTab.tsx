
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Loader2, DoorOpen, ShoppingBag } from 'lucide-react';
import IconButton from './IconButton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getFallbackImage } from '@/utils/imageUtils';
import { useTranslation } from 'react-i18next';

const ReserveServicesTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  if (error || !services) {
    return (
      <div className="p-4 text-destructive">
        {t('common.errorLoadingServices')}
      </div>
    );
  }

  // Filter out both "Book Space" and "Shop" services since we'll add them manually
  const filteredServices = services.filter(service => 
    !service.name.toLowerCase().includes('space') && 
    !service.name.toLowerCase().includes('shop')
  );

  return (
    <div className="space-y-4 mt-4">
      {filteredServices.map((service, index) => (
        <Card 
          key={service.id} 
          className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden"
        >
          <AspectRatio ratio={16/9}>
            <img 
              src={service.image_url || getFallbackImage(service.name, index)} 
              alt={service.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackImage(service.name, index);
              }}
            />
          </AspectRatio>
          <div className="p-4">
            <h2 className="text-darcare-white text-lg font-semibold mb-2">
              {service.name}
            </h2>
            <p className="text-darcare-beige mb-4">
              {service.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-darcare-beige/70">
                {service.estimated_duration}
              </span>
              <IconButton 
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>}
                variant="primary"
                onClick={() => navigate(`/services/${service.id}`)}
                aria-label={t('services.viewDetails')}
              />
            </div>
          </div>
        </Card>
      ))}
      
      <Card 
        className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden cursor-pointer"
        onClick={() => navigate('/services/spaces')}
      >
        <AspectRatio ratio={16/9}>
          <img 
            src="https://xhsjtgezcrgyypumzkra.supabase.co/storage/v1/object/public/spaces/pool.jpg"
            alt={t('services.bookSpace')}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getFallbackImage(t('services.bookSpace'), 0);
            }}
          />
        </AspectRatio>
        <div className="p-4">
          <h2 className="text-darcare-white text-lg font-semibold mb-2">
            {t('services.bookSpace')}
          </h2>
          <p className="text-darcare-beige mb-4">
            {t('services.bookSpaceDescription')}
          </p>
          <div className="flex items-center justify-end">
            <IconButton 
              icon={<DoorOpen className="w-5 h-5" />}
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/services/spaces');
              }}
              aria-label={t('services.bookSpace')}
            />
          </div>
        </div>
      </Card>
      
      <Card 
        className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden"
        onClick={() => navigate('/services/shop')}
      >
        <AspectRatio ratio={16/9}>
          <img 
            src="https://images.unsplash.com/photo-1580913428735-bd3c269d6a82?auto=format&fit=crop&q=80&w=1770&ixlib=rb-4.0.3"
            alt={t('services.shop')}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getFallbackImage(t('services.shop'), 3);
            }}
          />
        </AspectRatio>
        <div className="p-4">
          <h2 className="text-darcare-white text-lg font-semibold mb-2">
            {t('services.shop')}
          </h2>
          <p className="text-darcare-beige mb-4">
            {t('services.shopDescription')}
          </p>
          <div className="flex items-center justify-end">
            <IconButton 
              icon={<ShoppingBag className="w-5 h-5" />}
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/services/shop');
              }}
              aria-label={t('services.shop')}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReserveServicesTab;
