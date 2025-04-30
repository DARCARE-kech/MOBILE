
import React from 'react';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { getFallbackImage } from '@/utils/imageUtils';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SpaceInfoCardProps {
  space: {
    id: string;
    name: string;
    description: string;
    image_url?: string;
    capacity?: number;
  };
}

const SpaceInfoCard = ({ space }: SpaceInfoCardProps) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  return (
    <Card className={cn(
      "overflow-hidden border",
      isDarkMode ? "bg-[#1C1F2A] border-darcare-gold/20" : "bg-white border-darcare-deepGold/20"
    )}>
      <AspectRatio ratio={16/9}>
        <img 
          src={space.image_url || getFallbackImage(space.name, 0)}
          alt={space.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImage(space.name, 0);
          }}
        />
      </AspectRatio>
      
      <div className="p-4">
        <h2 className={cn(
          "font-serif text-xl mb-2",
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {space.name}
        </h2>
        
        <div className="flex items-center gap-1 text-sm mb-2">
          <Users size={16} className={isDarkMode ? "text-darcare-gold/70" : "text-darcare-deepGold/70"} />
          <span className={isDarkMode ? "text-darcare-beige/80" : "text-darcare-charcoal/80"}>
            {t('services.capacity', 'Capacity')}: {space.capacity || t('common.notSpecified', 'Not specified')}
          </span>
        </div>
        
        <p className={isDarkMode ? "text-darcare-beige" : "text-darcare-charcoal"}>
          {space.description}
        </p>
      </div>
    </Card>
  );
};

export default SpaceInfoCard;
