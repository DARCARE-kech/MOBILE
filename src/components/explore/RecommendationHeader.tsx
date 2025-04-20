
import { Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { getFallbackImage } from "@/utils/imageUtils";
import { RECOMMENDATION_CATEGORIES } from "@/utils/recommendationCategories";

interface RecommendationHeaderProps {
  recommendation: Recommendation;
  onToggleFavorite: () => void;
}

export const RecommendationHeader = ({ 
  recommendation, 
  onToggleFavorite 
}: RecommendationHeaderProps) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const fallbackImage = getFallbackImage(recommendation.title, 0);
  const imageSource = !imageError && recommendation.image_url ? recommendation.image_url : fallbackImage;
  
  // Ensure category is one of the valid categories
  const displayCategory = recommendation.category && RECOMMENDATION_CATEGORIES.includes(recommendation.category)
    ? recommendation.category
    : 'other';
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={imageSource}
          alt={recommendation.title}
          className="w-full h-64 object-cover"
          onError={() => setImageError(true)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-darcare-navy/80 hover:bg-darcare-navy text-darcare-gold"
          onClick={onToggleFavorite}
        >
          <Heart
            size={18}
            className={recommendation.is_favorite ? "fill-current" : ""}
          />
        </Button>
      </div>
      
      <div className="flex items-center gap-2 px-4">
        <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20">
          {t(`explore.categories.${displayCategory.toLowerCase()}`)}
        </Badge>
        {recommendation.rating && recommendation.rating > 0 && (
          <div className="flex items-center gap-1 text-darcare-gold">
            <Star size={16} className="fill-current" />
            <span>{recommendation.rating.toFixed(1)}</span>
            {recommendation.review_count ? ` (${recommendation.review_count})` : ''}
          </div>
        )}
      </div>
    </div>
  );
};
