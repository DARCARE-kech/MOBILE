
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Club, Car, Scissors, Bath } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDarkMode } = useTheme();
  
  // Get the appropriate icon based on the service name
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
    
    return <Bath className="h-5 w-5" />; // Changed from Spa to Bath
  };
  
  // Format image URL for Supabase storage
  const getImageUrl = () => {
    if (!service.image_url) return null;
    
    // If it's already a full URL, return it
    if (service.image_url.startsWith('http')) {
      return service.image_url;
    }
    
    // Otherwise, it might be a relative path in storage
    if (service.image_url.includes('/')) {
      return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${service.image_url}`;
    }
    
    // Default placeholder image for fallback
    return `${import.meta.env.VITE_PUBLIC_URL}/placeholder.svg`;
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200 border",
        isDarkMode 
          ? "bg-darcare-navy/50 border-darcare-gold/10 hover:border-darcare-gold/30" 
          : "bg-white border-darcare-deepGold/10 hover:border-darcare-deepGold/30"
      )}
      onClick={onSelect}
    >
      <div 
        className={cn(
          "h-24 bg-cover bg-center relative",  // Reduced height from 32 to 24
          !service.image_url && "bg-gradient-to-r from-primary/50 to-primary/20"
        )}
        style={service.image_url ? { backgroundImage: `url(${getImageUrl()})` } : {}}
      >
        {/* Optional overlay for text legibility */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Fallback if image fails to load */}
        {!service.image_url && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {getServiceIcon()}
          </div>
        )}
      </div>
      
      <CardContent className={cn(
        "p-3", // Reduced padding
        isDarkMode ? "text-darcare-beige" : "text-darcare-charcoal"
      )}>
        <h3 className={cn(
          "font-serif text-sm font-medium mb-1", // Reduced text size and margin
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {service.name}
        </h3>
        {service.description && (
          <p className="text-xs opacity-75 line-clamp-2"> {/* Reduced text size */}
            {service.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
