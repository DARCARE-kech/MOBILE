
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationHeaderProps {
  recommendation: Recommendation;
}

export const RecommendationHeader = ({ recommendation }: RecommendationHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <img
          src={recommendation.image_url || '/placeholder.svg'}
          alt={recommendation.title}
          className="w-full h-64 object-cover"
        />
      </div>
      
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
    </div>
  );
};
