
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceBanner from '@/components/services/ServiceBanner';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

const ReserveServicesTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  // Group services by category
  const servicesByCategory = services?.reduce((acc: Record<string, any[]>, service: any) => {
    const category = service.category || 'Other';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});
  
  const handleServiceClick = (serviceId: string, serviceName: string) => {
    if (serviceName.toLowerCase().includes('book space')) {
      navigate('/services/spaces');
    } else if (serviceName.toLowerCase().includes('shop')) {
      navigate('/services/shop');
    } else {
      navigate(`/services/${serviceId}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  // Create a single array of all services, including special ones
  const allServices = [
    // Special services at the top
    {
      id: 'book-space',
      name: t('services.bookSpace'),
      description: t('services.bookSpaceDesc'),
      image_url: '/images/spaces.jpg',
      category: 'Amenities',
    },
    {
      id: 'shop',
      name: t('services.shop'),
      description: t('services.shopDesc'),
      image_url: '/images/shop.jpg',
      category: 'Amenities',
    },
    // Add all other services
    ...(services || []).filter(s => 
      !s.name.toLowerCase().includes('book space') && 
      !s.name.toLowerCase().includes('shop')
    )
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allServices.map((service) => (
          <div 
            key={service.id}
            onClick={() => handleServiceClick(service.id, service.name)}
            className="cursor-pointer group transition-transform hover:scale-[1.01] bg-darcare-navy/50 border border-darcare-gold/10 rounded-lg overflow-hidden"
          >
            <ServiceBanner
              imageUrl={service.image_url || ''}
              altText={service.name}
              withGradient={true}
              height={160}
            />
            <div className="p-4">
              <h3 className="font-serif text-lg text-darcare-gold group-hover:text-darcare-gold/90">
                {service.name}
              </h3>
              <p className="text-darcare-beige/80 text-sm mt-1">
                {service.description}
              </p>
              {service.estimated_duration && (
                <div className="mt-2 text-xs text-darcare-beige/60 bg-darcare-gold/5 w-fit px-2 py-1 rounded">
                  {t('services.estimatedTime')}: {service.estimated_duration}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReserveServicesTab;
