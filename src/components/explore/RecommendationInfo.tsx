
import { MapPin, Star, Clock, Phone, Mail, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";

interface RecommendationInfoProps {
  recommendation: Recommendation;
}

export const RecommendationInfo = ({ recommendation }: RecommendationInfoProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20">
          {recommendation.category ? t(`explore.categories.${recommendation.category.toLowerCase()}`) : t('explore.categories.other')}
        </Badge>
        {recommendation.rating && (
          <div className="flex items-center gap-1 text-darcare-gold">
            <Star size={16} className="fill-current" />
            <span>{recommendation.rating.toFixed(1)}</span>
            {recommendation.review_count ? ` (${recommendation.review_count})` : ''}
          </div>
        )}
        {recommendation.is_reservable && (
          <Badge variant="outline" className="bg-darcare-gold/10 text-darcare-gold border-darcare-gold/20">
            {t('explore.reservationAvailable')}
          </Badge>
        )}
      </div>

      {recommendation.location && (
        <div className="flex items-center gap-2 text-darcare-beige">
          <MapPin size={16} className="text-darcare-gold" />
          <span>{recommendation.location}</span>
        </div>
      )}

      <p className="text-darcare-white">
        {recommendation.description || t('explore.noDescriptionAvailable')}
      </p>
      
      {/* Contact Information */}
      {(recommendation.contact_phone || recommendation.email || recommendation.address || recommendation.opening_hours) && (
        <div className="mt-2 pt-4 border-t border-darcare-gold/10 space-y-3">
          <h3 className="text-lg font-serif text-darcare-gold">{t('explore.contactInfo')}</h3>
          
          {recommendation.contact_phone && (
            <div className="flex items-center gap-2 text-darcare-beige">
              <Phone size={16} className="text-darcare-gold" />
              <span>{recommendation.contact_phone}</span>
            </div>
          )}
          
          {recommendation.email && (
            <div className="flex items-center gap-2 text-darcare-beige">
              <Mail size={16} className="text-darcare-gold" />
              <span>{recommendation.email}</span>
            </div>
          )}
          
          {recommendation.address && (
            <div className="flex items-center gap-2 text-darcare-beige">
              <MapPin size={16} className="text-darcare-gold" />
              <span>{recommendation.address}</span>
            </div>
          )}
          
          {recommendation.opening_hours && (
            <div className="flex items-center gap-2 text-darcare-beige">
              <Clock size={16} className="text-darcare-gold" />
              <span>{recommendation.opening_hours}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Tags */}
      {recommendation.tags && recommendation.tags.length > 0 && (
        <div className="mt-2 pt-4 border-t border-darcare-gold/10">
          <h3 className="text-lg font-serif text-darcare-gold mb-2">{t('explore.features')}</h3>
          <div className="flex flex-wrap gap-2">
            {recommendation.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-darcare-gold/10 text-darcare-beige border-darcare-gold/20"
              >
                <Tag size={12} className="mr-1" /> {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
