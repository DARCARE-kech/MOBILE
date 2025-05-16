
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
    "w-5 h-5 mr-2",
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
      return data;
    }
  });

  const handleServiceClick = (id: string, name: string) => {
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
      <div className="grid grid-cols-2 gap-4">
        {services?.map((service) => (
          <div
            key={service.id}
            className={cn(
              "rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 shadow",
              isDarkMode
                ? "bg-[#1E2230] hover:shadow-darcare-gold/10 hover:shadow-md"
                : "bg-white hover:shadow-darcare-deepGold/10 hover:shadow-md"
            )}
            onClick={() => handleServiceClick(service.id, service.name)}
          >
            {/* Image Section */}
            <div className="aspect-[4/3] w-full">
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
            
            {/* Content Section */}
            <div className="p-3 relative">
              <div className="flex items-center mb-1">
                <ServiceIcon category={service.category || ''} />
                <h3 className={cn(
                  "font-serif text-lg line-clamp-1",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {service.name}
                </h3>
              </div>
              
              <p className={cn(
                "text-xs line-clamp-2 mb-2 min-h-[2.5rem]",
                isDarkMode ? "text-darcare-beige/80" : "text-darcare-charcoal/80"
              )}>
                {service.description}
              </p>
              
              <div className="flex items-center justify-between">
                {service.estimated_duration && (
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    isDarkMode ? "text-darcare-beige/60" : "text-darcare-charcoal/60"
                  )}>
                    <Clock size={14} className={isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"} />
                    <span>{service.estimated_duration}</span>
                  </div>
                )}
                
                <ChevronRight 
                  size={16} 
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
