
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceBanner from '@/components/services/ServiceBanner';
import { useTranslation } from 'react-i18next';
import { Loader2, Clock, ChevronRight } from 'lucide-react';
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
      <div className="grid grid-cols-2 gap-4">
        {allServices.map((service) => (
          <div 
            key={service.id}
            onClick={() => handleServiceClick(service.id, service.name)}
            className={cn(
              "cursor-pointer group rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02]",
              isDarkMode 
                ? "bg-[#1E2230] border border-darcare-gold/10" 
                : "bg-white border border-darcare-deepGold/10 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            )}
          >
            <ServiceBanner
              imageUrl={service.image_url || ''}
              altText={service.name}
              withGradient={false}
              height={120}
            />
            <div className="p-3 pb-4 relative">
              <h3 className={cn(
                "font-serif text-base font-medium line-clamp-1",
                isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
              )}>
                {service.name}
              </h3>
              <p className={cn(
                "text-xs mt-1 line-clamp-2",
                isDarkMode ? "text-darcare-beige/80" : "text-darcare-charcoal/80"
              )}>
                {service.description}
              </p>
              
              <div className="flex justify-between items-end mt-2">
                {/* Add a type guard to check if estimated_duration exists before rendering */}
                {('estimated_duration' in service && service.estimated_duration) ? (
                  <div className={cn(
                    "text-xs flex items-center gap-1 w-fit px-2 py-0.5 rounded-full",
                    isDarkMode 
                      ? "text-darcare-beige/70 bg-darcare-gold/10" 
                      : "text-darcare-deepGold bg-darcare-deepGold/10"
                  )}>
                    <Clock size={10} />
                    <span>{service.estimated_duration}</span>
                  </div>
                ) : (
                  <div></div> // Empty div to maintain layout when no duration
                )}
                
                <ChevronRight 
                  size={16} 
                  className={cn(
                    "transition-transform group-hover:translate-x-1",
                    isDarkMode ? "text-darcare-gold/60" : "text-darcare-deepGold/60"
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReserveServicesTab;
