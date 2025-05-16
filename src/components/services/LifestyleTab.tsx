
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Loader2, Scissors, Baby, Book } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { getFallbackImage } from '@/utils/imageUtils';

// Lifestyle categories
const LIFESTYLE_CATEGORIES = ['hair', 'kids', 'book-space'];

// Icon mapping for service types
const ServiceIcon = ({ category, name }: { category: string | null, name: string }) => {
  const { isDarkMode } = useTheme();
  const iconClass = cn(
    "w-4 h-4 mr-2", // Smaller icon
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
      console.log('Fetching lifestyle services with categories:', LIFESTYLE_CATEGORIES);
      
      // Fetch services by category
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .in('category', LIFESTYLE_CATEGORIES);
      
      if (error) {
        console.error('Error fetching lifestyle services:', error);
        throw error;
      }
      
      console.log('Lifestyle services fetched:', data);
      
      // Add a static "Book Space" service if it doesn't exist in the data
      const bookSpaceExists = data?.some(service => 
        service.category === 'book-space' || 
        service.name?.toLowerCase().includes('book space')
      );
      
      if (!bookSpaceExists) {
        console.log('Adding static Book Space service');
        const bookSpaceService = {
          id: 'book-space',
          name: 'Book Space',
          description: 'Reserve spaces for your activities',
          category: 'book-space',
          image_url: null,
          estimated_duration: null
        };
        return [...(data || []), bookSpaceService];
      }
      
      return data || [];
    }
  });

  const handleServiceClick = (id: string, name: string, category: string | null) => {
    console.log('Clicked service:', id, name, category);
    
    if (category === 'book-space' || name.toLowerCase().includes('book space') || id === 'book-space') {
      console.log('Navigating to spaces page');
      navigate('/services/spaces');
    } else if (category === 'hair' || name.toLowerCase().includes('hair') || name.toLowerCase().includes('salon')) {
      console.log('Navigating to hair salon service');
      navigate(`/services/${id}`);
    } else if (category === 'kids' || name.toLowerCase().includes('kids') || name.toLowerCase().includes('club')) {
      console.log('Navigating to kids club service');
      navigate(`/services/${id}`);
    } else {
      console.log('Navigating to generic service');
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
      <div className="grid grid-cols-2 gap-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={cn(
              "rounded-xl overflow-hidden cursor-pointer transition-all duration-200 shadow",
              isDarkMode
                ? "bg-[#1E2230] hover:shadow-darcare-gold/10 hover:shadow-md"
                : "bg-white hover:shadow-darcare-deepGold/10 hover:shadow-md"
            )}
            onClick={() => handleServiceClick(service.id, service.name, service.category)}
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
                <ServiceIcon category={service.category} name={service.name} />
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

export default LifestyleTab;
