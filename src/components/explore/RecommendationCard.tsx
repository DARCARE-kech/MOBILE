
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

import { Card } from '@/components/ui/card';
import { Recommendation } from '@/types/recommendation';
import { getFallbackImage } from '@/utils/imageUtils';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleToggleFavorite = (e: React.MouseEvent) => {
     e.stopPropagation();
     
     // Update UI immediately for responsive feel
     setIsFavorite(!isFavorite);
     
     if (onToggleFavorite) {
       onToggleFavorite(recommendation.id);
     }

  const handleRecommendationClick = () => {
    if (onSelect) {
      onSelect(recommendation.id);
    } else {
      navigate(`/explore/recommendations/${recommendation.id}`);
    }
  };

  return (
    <Card 
      className="relative overflow-hidden rounded-xl border-darcare-gold/10 hover:border-darcare-gold/30 transition-all bg-darcare-navy/80 backdrop-blur-sm"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-video relative">
        <img 
          src={recommendation.image_url || getFallbackImage(recommendation.title, recommendation.id)}
          alt={recommendation.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImage(recommendation.title, recommendation.id);
          }}
        />
        {user && (
           <Button
             variant="ghost"
             size="icon"
             className={cn(
               "absolute top-2 right-2 rounded-full",
               isDarkMode
                 ? "bg-darcare-navy/80 hover:bg-darcare-navy text-darcare-gold"
                 : "bg-white/80 hover:bg-white text-darcare-deepGold"
             )}
             onClick={handleToggleFavorite}
        
        {/* Category badge */}
        {recommendation.category && (
          <Badge 
            className="absolute top-2 left-2 bg-darcare-navy/80 text-darcare-gold border-darcare-gold/30"
          >
            {t(`explore.categories.${recommendation.category.toLowerCase()}`)}
          </Badge>
        )}
        
        {/* Favorite button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 backdrop-blur-sm transition-colors hover:bg-black/50"
        >
          <Heart 
            size={18} 
            className={cn(
              "transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            )} 
          />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="font-serif text-lg text-darcare-gold mb-1 line-clamp-1">
          {recommendation.title}
        </h3>
        
        <div className="flex items-center gap-1 text-darcare-beige/70 text-sm mb-2">
          <MapPin size={14} />
          <span className="line-clamp-1">{recommendation.address || t('explore.locationNotAvailable')}</span>
        </div>
        
        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="text-darcare-beige">
              {recommendation.rating?.toFixed(1) || "N/A"} 
              {recommendation.review_count > 0 && (
                <span className="text-darcare-beige/60 text-xs ml-1">
                  ({recommendation.review_count})
                </span>
              )}
            </span>
          </div>
          
          
        </div>
      </div>
    </Card>
  );
};
