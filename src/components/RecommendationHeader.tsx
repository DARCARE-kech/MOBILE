
import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { getFallbackImage } from "@/utils/imageUtils";
import { isValidCategory } from "@/utils/recommendationCategories";

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
  
  return (
  <div className="space-y-6 px-4 pt-8 pb-4">
    {/* IMAGE HEADER */}
    <div className="relative rounded-xl overflow-hidden">
      <img
        src={imageSource}
        alt={recommendation.title}
        className="w-full h-[250px] object-cover"
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

    {/* TITLE + RATING */}
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-serif text-darcare-gold leading-tight">
        {recommendation.title}
      </h1>

      {recommendation.rating && recommendation.rating > 0 && (
        <div className="flex items-center gap-2 text-darcare-gold">
          <Star size={16} className="fill-current" />
          <span className="font-medium">{recommendation.rating.toFixed(1)}</span>
          {recommendation.review_count ? (
            <span className="text-darcare-beige/70 text-sm">
              ({recommendation.review_count})
            </span>
          ) : null}
        </div>
      )}
    </div>
  </div>
);

};
