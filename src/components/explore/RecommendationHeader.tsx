
import { Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { getFallbackImage } from "@/utils/imageUtils";

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
        </div>

        {/* Catégorie + Avis */}
        <div className="flex flex-wrap items-center gap-3">
          {recommendation.category && (
            <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20 font-serif">
              {getCategoryTranslation(recommendation.category)}
            </Badge>
          )}
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
          
          <Button 
            onClick={onReserve}
            variant="ghost"
            className="text-darcare-gold border border-darcare-gold px-4 py-0.5 h-7 text-xs font-serif rounded-md hover:bg-darcare-gold/10 transition"
          >
            {t('explore.reserve')}
          </Button>
        </div>
      </div>
    </div>
  );
};
