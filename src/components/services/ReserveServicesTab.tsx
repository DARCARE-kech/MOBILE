
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceBanner from '@/components/services/ServiceBanner';
import { useTranslation } from 'react-i18next';
import { Loader2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

// Define proper types for our services
interface ServiceBase {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  category: string;
}

interface ServiceWithDuration extends ServiceBase {
  estimated_duration: string;
}

type Service = ServiceBase | ServiceWithDuration;

const ReserveServicesTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
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
  const allServices: Service[] = [
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
    <div className="p-2 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allServices.map((service) => (
          <div 
            key={service.id}
            onClick={() => handleServiceClick(service.id, service.name)}
            className="cursor-pointer group transition-transform hover:scale-[1.01] service-card-elegant"
          >
            <ServiceBanner
              imageUrl={service.image_url || ''}
              altText={service.name}
              withGradient={false}
              height={180}
            />
            <div className="p-4">
              <h3 className={cn(
                "font-serif text-lg font-medium line-clamp-1",
                isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
              )}>
                {service.name}
              </h3>
              <p className={cn(
                "text-sm mt-1 line-clamp-2",
                isDarkMode ? "text-darcare-beige/80" : "text-darcare-charcoal/80"
              )}>
                {service.description}
              </p>
              
              {/* Add a type guard to check if estimated_duration exists before rendering */}
              {'estimated_duration' in service && service.estimated_duration && (
                <div className={cn(
                  "mt-3 text-xs flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full",
                  isDarkMode 
                    ? "text-darcare-beige/70 bg-darcare-gold/10" 
                    : "text-darcare-deepGold bg-darcare-deepGold/10"
                )}>
                  <Clock size={12} />
                  <span>{service.estimated_duration}</span>
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
