
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Loader2, Scissors, Wrench, Car, Waves } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { getFallbackImage } from '@/utils/imageUtils';

// Household categories
const HOUSEHOLD_CATEGORIES = ['cleaning', 'maintenance', 'laundry', 'transport'];

// Icon mapping for service types
const ServiceIcon = ({ category }: { category: string }) => {
  const { isDarkMode } = useTheme();
  const iconClass = cn(
    "w-4 h-4 mr-2", // Smaller icon
    isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
  );
  
  switch (category.toLowerCase()) {
    case 'cleaning':
      return <Scissors className={iconClass} />;
    case 'maintenance':
      return <Wrench className={iconClass} />;
    case 'transport':
      return <Car className={iconClass} />;
    case 'laundry':
      return <Waves className={iconClass} />;
    default:
      return <Scissors className={iconClass} />;
  }
};

const HouseholdTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const { data: services, isLoading } = useQuery({
    queryKey: ['household-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .in('category', HOUSEHOLD_CATEGORIES)
        .order('name');
      
      if (error) throw error;
      console.log('Household services fetched:', data);
      return data;
    }
  });

  const handleServiceClick = (id: string, name: string) => {
    console.log('Navigating to service detail:', id, name);
    navigate(`/services/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="grid grid-cols-2 gap-3">
        {services?.map((service) => (
          <div
            key={service.id}
            className={cn(
              "rounded-xl overflow-hidden cursor-pointer transition-all duration-200 shadow",
              isDarkMode
                ? "bg-[#1E2230] hover:shadow-darcare-gold/10 hover:shadow-md"
                : "bg-white hover:shadow-darcare-deepGold/10 hover:shadow-md"
            )}
            onClick={() => handleServiceClick(service.id, service.name)}
          >
            {/* Image Section - Further reduced height */}
            <div className="aspect-[16/10] w-full"> {/* More compact aspect ratio */}
              <img
                src={service.image_url || getFallbackImage(service.name, 0)}
                alt={service.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackImage(service.name, 0);
                }}
              />
            </div>
            
            {/* Content Section - Further reduced padding */}
            <div className="p-1.5 relative"> {/* Smaller padding */}
              <div className="flex items-center mb-0.5">
                <ServiceIcon category={service.category || ''} />
                <h3 className={cn(
                  "font-serif text-sm line-clamp-1", // Smaller font
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {service.name}
                </h3>
              </div>
              
              <p className={cn(
                "text-xs line-clamp-1 mb-0.5 min-h-[0.75rem]", // Smaller min height
                isDarkMode ? "text-darcare-beige/80" : "text-darcare-charcoal/80"
              )}>
                {service.description}
              </p>
              
              <div className="flex items-center justify-between mt-0.5"> {/* Reduced margin */}
                {service.estimated_duration && (
                  <div className={cn(
                    "flex items-center gap-1 text-2xs", // Smaller text
                    isDarkMode ? "text-darcare-beige/60" : "text-darcare-charcoal/60"
                  )}>
                    <Clock size={10} className={isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"} />
                    <span>{service.estimated_duration}</span>
                  </div>
                )}
                
                <ChevronRight 
                  size={12} // Smaller icon 
                  className={isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HouseholdTab;
