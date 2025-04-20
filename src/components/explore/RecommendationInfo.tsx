import { MapPin, Star, Clock, Phone, Mail, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";
import { ContactInfoBlock } from "./ContactInfoBlock";
import { TagsList } from "./TagsList";
import { isValidCategory } from "@/utils/recommendationCategories";

interface RecommendationInfoProps {
  recommendation: Recommendation;
}

export const RecommendationInfo = ({ recommendation }: RecommendationInfoProps) => {
  const { t } = useTranslation();
  
  // Use the validation function to safely check category
  const displayCategory = isValidCategory(recommendation.category) 
    ? recommendation.category 
    : 'other';
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20 font-serif">
          {t(`explore.categories.${displayCategory.toLowerCase()}`)}
        </Badge>
        {recommendation.rating && recommendation.rating > 0 && (
          <div className="flex items-center gap-1 text-darcare-gold">
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

      {recommendation.description && (
        <p className="text-darcare-white leading-relaxed">
          {recommendation.description}
        </p>
      )}
      
      {recommendation.location && (
        <div className="flex items-center gap-2 text-darcare-beige">
          <MapPin size={16} className="text-darcare-gold flex-shrink-0" />
          <span>{recommendation.location}</span>
        </div>
      )}
      
      <ContactInfoBlock recommendation={recommendation} />
      
      <TagsList tags={recommendation.tags || []} />
    </div>
  );
};
