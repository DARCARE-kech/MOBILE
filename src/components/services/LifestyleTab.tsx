
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Loader2, Scissors, Baby, Book } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { getFallbackImage } from '@/utils/imageUtils';

// Lifestyle categories and services
const LIFESTYLE_CATEGORIES = ['hair', 'kids', 'book-space'];

// Icon mapping for service types
const ServiceIcon = ({ category, name }: { category: string | null, name: string }) => {
  const { isDarkMode } = useTheme();
  const iconClass = cn(
    "w-5 h-5 mr-2",
    isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
  );
  
  // Try to match by category first, then fallback to name matching
  const lowerCategory = category?.toLowerCase() || '';
  const lowerName = name.toLowerCase();
  
  if (lowerCategory === 'hair' || lowerName.includes('hair') || lowerName.includes('salon')) {
    return <Scissors className={iconClass} />;
  } else if (lowerCategory === 'kids' || lowerName.includes('kids') || lowerName.includes('club')) {
    return <Baby className={iconClass} />;
  } else if (lowerCategory === 'book-space' || lowerName.includes('book') || lowerName.includes('space')) {
    return <Book className={iconClass} />;
  } else {
    return <Book className={iconClass} />; // Default icon
  }
};

const LifestyleTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const { data: services, isLoading } = useQuery({
    queryKey: ['lifestyle-services'],
    queryFn: async () => {
      // Try to find services by category first
      const { data: categoryServices, error: categoryError } = await supabase
        .from('services')
        .select('*')
        .in('category', LIFESTYLE_CATEGORIES);
      
      if (categoryError) throw categoryError;
      
      // Also look for services with names containing our lifestyle keywords
      const { data: nameServices, error: nameError } = await supabase
        .from('services')
        .select('*')
        .or('name.ilike.%hair%,name.ilike.%salon%,name.ilike.%kids%,name.ilike.%club%,name.ilike.%book%,name.ilike.%space%')
        .not('id', 'in', `(${categoryServices.map(s => `'${s.id}'`).join(',')})`);
      
      if (nameError) throw nameError;
      
      // Combine results and remove duplicates
      const combinedServices = [...categoryServices];
      nameServices.forEach(service => {
        if (!combinedServices.some(s => s.id === service.id)) {
          combinedServices.push(service);
        }
      });
      
      return combinedServices.sort((a, b) => a.name.localeCompare(b.name));
    }
  });

  const handleServiceClick = (id: string, name: string, category: string | null) => {
    if (name.toLowerCase().includes('book space') || category === 'book-space') {
      navigate('/services/spaces');
    } else if (name.toLowerCase().includes('hair') || name.toLowerCase().includes('salon') || category === 'hair') {
      navigate(`/services/${id}`);
    } else if (name.toLowerCase().includes('kids') || name.toLowerCase().includes('club') || category === 'kids') {
      navigate(`/services/${id}`);
    } else {
      navigate(`/services/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className={isDarkMode ? "text-darcare-beige" : "text-darcare-charcoal"}>
          {t('services.noLifestyleServices', 'No lifestyle services available')}
        </p>
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
            onClick={() => handleServiceClick(service.id, service.name, service.category)}
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
                <ServiceIcon category={service.category} name={service.name} />
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

export default LifestyleTab;
