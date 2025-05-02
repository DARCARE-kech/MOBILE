
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Recommendation } from '@/types/recommendation';
import { getFallbackImage } from '@/utils/imageUtils';
import { useAuth } from '@/contexts/AuthContext';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSelect?: (id: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onSelect }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(recommendation.is_favorite || false);
  const { user } = useAuth();

  // Update local state when prop changes
  useEffect(() => {
    setIsFavorite(recommendation.is_favorite || false);
  }, [recommendation.is_favorite]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update UI immediately for responsive feel
    setIsFavorite(!isFavorite);
  };

  const handleClick = () => {
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
          src={recommendation.image_url || getFallbackImage(recommendation.title, 0)}
          alt={recommendation.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImage(recommendation.title, 0);
          }}
        />
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 rounded-full",
              "bg-darcare-navy/80 hover:bg-darcare-navy text-darcare-gold"
            )}
            onClick={handleToggleFavorite}
          >
            <Heart
              size={18}
              className={cn(
                "transition-colors",
                isFavorite ? "fill-current" : ""
              )}
            />
          </Button>
        )}
        
        {/* Category badge */}
        {recommendation.category && (
          <Badge 
            className="absolute top-2 left-2 bg-darcare-navy/80 text-darcare-gold border-darcare-gold/30"
          >
            {t(`explore.categories.${recommendation.category.toLowerCase()}`)}
          </Badge>
        )}
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
