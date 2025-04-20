
import { MapPin, Star, Clock, Phone, Mail, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";
import { ContactInfoBlock } from "./ContactInfoBlock";
import { TagsList } from "./TagsList";

interface RecommendationInfoProps {
  recommendation: Recommendation;
}

export const RecommendationInfo = ({ recommendation }: RecommendationInfoProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20">
          {recommendation.category ? t(`explore.categories.${recommendation.category.toLowerCase()}`) : t('explore.categories.other')}
        </Badge>
        {recommendation.rating && recommendation.rating > 0 && (
          <div className="flex items-center gap-1 text-darcare-gold">
            <Star size={16} className="fill-current" />
            <span>{recommendation.rating.toFixed(1)}</span>
            {recommendation.review_count ? ` (${recommendation.review_count})` : ''}
          </div>
        )}
      </div>

      {recommendation.description && (
        <p className="text-darcare-white mt-2">
          {recommendation.description}
        </p>
      )}
      
      {recommendation.location && (
        <div className="flex items-center gap-2 text-darcare-beige mt-2">
          <MapPin size={16} className="text-darcare-gold" />
          <span>{recommendation.location}</span>
        </div>
      )}
      
      <ContactInfoBlock recommendation={recommendation} />
      
      <TagsList tags={recommendation.tags || []} />
    </div>
  );
};
