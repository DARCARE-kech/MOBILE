
import { Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { getFallbackImage } from "@/utils/imageUtils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const fallbackImage = getFallbackImage(recommendation.title, 0);
  const imageSource = !imageError && recommendation.image_url ? recommendation.image_url : fallbackImage;
  
  // Get category translation directly from the recommendation category
  const getCategoryTranslation = (category: string | null) => {
    if (!category) return t('explore.categories.other');
    
    // Try direct translation key first
    const directKey = `explore.categories.${category}`;
    const directTranslation = t(directKey);
    
    // If translation exists (not the key itself), use it
    if (directTranslation !== directKey) {
      return directTranslation;
    }
    
    // Try with normalized category (lowercase, replace spaces/hyphens with underscores)
    const normalizedCategory = category.toLowerCase().replace(/[\s-]/g, '_');
    const normalizedKey = `explore.categories.${normalizedCategory}`;
    const normalizedTranslation = t(normalizedKey);
    
    if (normalizedTranslation !== normalizedKey) {
      return normalizedTranslation;
    }
    
    // Fallback to capitalized category name
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <div className="overflow-x-hidden space-y-6 pt-10 px-4 max-w-screen-sm mx-auto">
      {/* Image */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={imageSource}
          alt={recommendation.title}
          className="w-full object-cover h-[240px]"
          onError={() => setImageError(true)}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 rounded-full bg-darcare-navy/80 hover:bg-darcare-navy text-darcare-gold"
          onClick={onToggleFavorite}
        >
          <Heart
            size={20}
            className={recommendation.is_favorite ? "fill-current" : ""}
          />
        </Button>
      </div>

      {/* Titre + Rating + Catégorie + Reserve */}
      <div className="space-y-3">
        <h1 className="font-serif text-darcare-gold text-2xl leading-tight">
          {recommendation.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          {recommendation.category && (
            <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20 font-serif text-xs px-2 py-1">
              {getCategoryTranslation(recommendation.category)}
            </Badge>
          )}
          {recommendation.rating && recommendation.rating > 0 && (
            <div className="flex items-center gap-1 text-darcare-gold text-sm">
              <Star size={14} className="fill-current" />
              <span className="font-medium">{recommendation.rating.toFixed(1)}</span>
              {recommendation.review_count ? (
                <span className="text-darcare-beige/70 text-xs">
                  ({recommendation.review_count})
                </span>
              ) : null}
            </div>
          )}
          <Button 
            onClick={onReserve}
            variant="ghost"
            className="text-darcare-gold border border-darcare-gold font-serif rounded-md hover:bg-darcare-gold/10 text-xs h-7 px-4 ml-auto"
          >
            {t('explore.reserve')}
          </Button>
        </div>
      </div>
    </div>
  );
};
