
import { MapPin, Star, Clock, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";
import { TagsList } from "./TagsList";

interface RecommendationInfoProps {
  recommendation: Recommendation;
}

export const RecommendationInfo = ({ recommendation }: RecommendationInfoProps) => {
  const { t } = useTranslation();

  // Compute display category
  const displayCategory = recommendation.category
    ? recommendation.category
    : "other";

  // Section visibility checks
  const hasContactOrLocation =
    recommendation.contact_phone ||
    recommendation.email ||
    recommendation.opening_hours ||
    recommendation.address;

  return (
    <div className="p-0">
      {/* Section 1: Category & Rating */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-2">
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

      {/* Section 2: Description */}
      {recommendation.description && (
        <section className="px-6 pt-2 pb-4">
          <p className="text-lg font-serif text-darcare-beige leading-relaxed mb-0" style={{ wordBreak: 'break-word' }}>
            {recommendation.description}
          </p>
        </section>
      )}

      {/* Subtle divider */}
      {hasContactOrLocation && <div className="h-[1px] bg-darcare-gold/10 mx-6 mb-3" />}

      {/* Section 3: Contact & Location */}
      {hasContactOrLocation && (
        <section className="px-6 pb-2 space-y-4">
          {recommendation.contact_phone && (
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-darcare-gold flex-shrink-0" />
              <span className="text-darcare-beige break-all">{recommendation.contact_phone}</span>
            </div>
          )}
          {recommendation.email && (
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-darcare-gold flex-shrink-0" />
              <span className="text-darcare-beige break-all">{recommendation.email}</span>
            </div>
          )}
          {recommendation.address && (
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-darcare-gold flex-shrink-0" />
              <span className="text-darcare-beige break-words">{recommendation.address}</span>
            </div>
          )}
          {recommendation.opening_hours && (
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-darcare-gold flex-shrink-0" />
              <span className="text-darcare-beige break-words">{recommendation.opening_hours}</span>
            </div>
          )}
        </section>
      )}

      {/* Section 4: Tags */}
      {recommendation.tags && Array.isArray(recommendation.tags) && recommendation.tags.length > 0 && (
        <section className="px-6 pb-6 pt-3">
          <TagsList tags={recommendation.tags} />
        </section>
      )}
    </div>
  );
};
