
import { MapPin, Star, Clock, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";
import { TagsList } from "./TagsList";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecommendationInfoProps {
  recommendation: Recommendation;
  onReserve: () => void;
}

export const RecommendationInfo = ({ recommendation, onReserve }: RecommendationInfoProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // Section visibility checks
  const hasContactOrLocation =
    recommendation.contact_phone ||
    recommendation.site ||
    recommendation.opening_hours ||
    recommendation.address;

  // Handle phone dialer
  const handlePhoneClick = () => {
    if (recommendation.contact_phone) {
      window.open(`tel:${recommendation.contact_phone}`);
    }
  };

  // Handle website opening
  const handleSiteClick = () => {
    if (recommendation.site) {
      // Check if URL has http/https prefix, if not add it
      let url = recommendation.site;
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    }
  };

  // Handle map opening
  const handleAddressClick = () => {
    if (recommendation.latitude && recommendation.longitude) {
      window.open(`https://www.openstreetmap.org/?mlat=${recommendation.latitude}&mlon=${recommendation.longitude}`, '_blank');
    }
  };

  return (
  <div className="px-4 pb-6 space-y-6 max-w-screen-sm mx-auto">

    {/* Section 1: Description */}
    {recommendation.description && (
      <section>
        <p className="font-serif text-darcare-beige leading-relaxed text-sm sm:text-base break-words">
          {recommendation.description}
        </p>
      </section>
    )}

    {/* Divider */}
    {hasContactOrLocation && (
      <div className="h-[1px] bg-darcare-gold/10" />
    )}

    {/* Section 2: Contact & Localisation */}
    {hasContactOrLocation && (
      <section className="space-y-3">
        {recommendation.contact_phone && (
          <button onClick={handlePhoneClick} className="flex items-center gap-3 text-left w-full">
            <Phone size={16} className="text-darcare-gold" />
            <span className="text-darcare-beige underline underline-offset-2 break-all text-sm">
              {recommendation.contact_phone}
            </span>
          </button>
        )}

        {recommendation.site && (
          <button onClick={handleSiteClick} className="flex items-center gap-3 text-left w-full">
            <Globe size={16} className="text-darcare-gold" />
            <span className="text-darcare-beige underline underline-offset-2 break-all text-sm">
              {recommendation.site}
            </span>
          </button>
        )}

        {recommendation.address && (
          <button
            onClick={handleAddressClick}
            disabled={!recommendation.latitude || !recommendation.longitude}
            className="flex items-center gap-3 text-left w-full"
          >
            <MapPin size={16} className="text-darcare-gold" />
            <span className={`text-darcare-beige break-words text-sm ${recommendation.latitude && recommendation.longitude ? "underline underline-offset-2" : ""}`}>
              {recommendation.address}
            </span>
          </button>
        )}

        {recommendation.opening_hours && (
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-darcare-gold" />
            <span className="text-darcare-beige text-sm">
              {recommendation.opening_hours}
            </span>
          </div>
        )}
      </section>
    )}

    {/* Section 3: Tags */}
    {recommendation.tags && recommendation.tags.length > 0 && (
      <section>
        <TagsList tags={recommendation.tags} />
      </section>
    )}
  </div>
);

};
