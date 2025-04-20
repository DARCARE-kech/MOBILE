
import { Star, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";

interface RecommendationHeaderProps {
  recommendation: Recommendation;
  onToggleFavorite: () => void;
}

export const RecommendationHeader = ({ 
  recommendation, 
  onToggleFavorite 
}: RecommendationHeaderProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={recommendation.image_url || '/placeholder.svg'}
          alt={recommendation.title}
          className="w-full h-64 object-cover"
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
      
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20">
          {t(`explore.categories.${(recommendation.category || 'other').toLowerCase()}`)}
        </Badge>
        {recommendation.rating && (
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
