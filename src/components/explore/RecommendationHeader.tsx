
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
   onReserve: () => void;
}

export const RecommendationHeader = ({ 
  recommendation, 
  onReserve,
  onToggleFavorite 
}: RecommendationHeaderProps) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);
  const fallbackImage = getFallbackImage(recommendation.title, 0);
  const imageSource = !imageError && recommendation.image_url ? recommendation.image_url : fallbackImage;
  
  // Ensure category is one of the valid categories
  const displayCategory = recommendation.category && 
    (typeof recommendation.category === 'string') && 
    RECOMMENDATION_CATEGORIES.includes(recommendation.category as any)
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
          className="absolute top-4 right-4 rounded-full bg-darcare-navy/80 hover:bg-darcare-navy text-darcare-gold"
          onClick={onToggleFavorite}
        >
          <Heart
            size={20}
            className={recommendation.is_favorite ? "fill-current" : ""}
          />
        </Button>
      </div>
      
      <div className="flex flex-col gap-3 px-6">
  {/* Titre + Reserve */}
  <div className="flex flex-wrap justify-between items-center gap-3">
    <h1 className="text-2xl font-serif text-darcare-gold">{recommendation.title}</h1>
   <Button 
  onClick={onReserve}
  variant="ghost"
  className="text-darcare-gold border border-darcare-gold px-4 py-0.5 h-7 text-xs font-serif rounded-md hover:bg-darcare-gold/10 transition"
>
  {t('explore.reserve', 'Reserve')}
</Button>

  </div>

  {/* Catégorie + Avis */}
  <div className="flex flex-wrap items-center gap-3">
    <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20 font-serif">
      {t(`explore.categories.${typeof displayCategory === 'string' ? displayCategory.toLowerCase() : 'other'}`)}
    </Badge>
    {recommendation.rating && recommendation.rating > 0 && (
      <div className="flex items-center gap-1 text-darcare-gold text-sm">
        <Star size={16} className="fill-current" />
        <span className="font-medium">{recommendation.rating.toFixed(1)}</span>
        {recommendation.review_count ? (
          <span className="text-darcare-beige/70">
            ({recommendation.review_count})
          </span>
        ) : null}
      </div>
    )}
  </div>
</div>

    </div>
  );
};
