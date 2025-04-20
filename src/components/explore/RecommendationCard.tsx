
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { getFallbackImage } from '@/utils/imageUtils';
import { RatingStars } from '@/components/RatingStars';
import { useTranslation } from 'react-i18next';
import type { Recommendation } from '@/types/recommendation';

interface RecommendationCardProps {
  item: Recommendation;
  onToggleFavorite: (id: string) => void;
  onSelect: (id: string) => void;
}

export const RecommendationCard = ({ 
  item,
  onToggleFavorite,
  onSelect 
}: RecommendationCardProps) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const fallbackImage = getFallbackImage(item.title, 0);
  const imageSource = (!imageError && item.image_url) ? item.image_url : fallbackImage;
  
  return (
    <div 
      className="bg-darcare-navy border border-darcare-gold/10 rounded-xl overflow-hidden cursor-pointer group"
      onClick={() => onSelect(item.id)}
    >
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img
            src={imageSource}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </AspectRatio>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-darcare-navy/80 hover:bg-darcare-navy text-darcare-gold"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
        >
          <Heart
            size={18}
            className={item.is_favorite ? "fill-current" : ""}
          />
        </Button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-medium text-darcare-white">{item.title}</h3>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="bg-transparent text-darcare-beige border-darcare-gold/20"
          >
            {item.category ? t(`explore.categories.${item.category.toLowerCase()}`) : t('explore.categories.other')}
          </Badge>
          
          {item.rating > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <RatingStars rating={item.rating} />
              <span className="text-sm text-darcare-gold">
                {item.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
