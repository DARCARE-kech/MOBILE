
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationInfoProps {
  recommendation: Recommendation;
}

export const RecommendationInfo = ({ recommendation }: RecommendationInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20">
          {recommendation.category}
        </Badge>
        {recommendation.rating && (
          <div className="flex items-center gap-1 text-darcare-gold">
            <Star size={16} className="fill-current" />
            <span>{recommendation.rating.toFixed(1)}</span>
            {recommendation.review_count ? ` (${recommendation.review_count})` : ''}
          </div>
        )}
      </div>

      {recommendation.location && (
        <div className="flex items-center gap-2 text-darcare-beige">
          <MapPin size={16} />
          <span>{recommendation.location}</span>
        </div>
      )}

      <p className="text-darcare-white">
        {recommendation.description}
      </p>
    </div>
  );
};
