
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
    <div className="p-0">
      {/* Section 1: Description */}
      {recommendation.description && (
        <section className={isMobile ? "px-2 pt-0 pb-1" : "px-6 pt-2 pb-4"}>
          <p className={`font-serif text-darcare-beige leading-relaxed mb-0 ${isMobile ? "text-xs" : "text-lg"}`} style={{ wordBreak: 'break-word' }}>
            {recommendation.description}
          </p>
        </section>
      )}

      {/* Subtle divider */}
      {hasContactOrLocation && <div className={`h-[1px] bg-darcare-gold/10 ${isMobile ? "mx-2 mb-1" : "mx-6 mb-3"}`} />}

      {/* Section 3: Contact & Location */}
      {hasContactOrLocation && (
        <section className={`pb-1 ${isMobile ? "px-2 space-y-1" : "px-6 space-y-4"}`}>
          {recommendation.contact_phone && (
            <button 
              className="flex items-center gap-2 w-full text-left" 
              onClick={handlePhoneClick}
            >
              <Phone size={isMobile ? 12 : 18} className="text-darcare-gold flex-shrink-0" />
              <span className={`text-darcare-beige break-all underline underline-offset-2 ${isMobile ? "text-xs" : ""}`}>
                {recommendation.contact_phone}
              </span>
            </button>
          )}
          
          {recommendation.site && (
            <button 
              className="flex items-center gap-2 w-full text-left" 
              onClick={handleSiteClick}
            >
              <Globe size={isMobile ? 12 : 18} className="text-darcare-gold flex-shrink-0" />
              <span className={`text-darcare-beige break-all underline underline-offset-2 ${isMobile ? "text-xs" : ""}`}>
                {recommendation.site}
              </span>
            </button>
          )}
          
          {recommendation.address && (
            <button 
              className="flex items-center gap-2 w-full text-left"
              onClick={handleAddressClick}
              disabled={!recommendation.latitude || !recommendation.longitude}
            >
              <MapPin size={isMobile ? 12 : 18} className="text-darcare-gold flex-shrink-0" />
              <span className={`text-darcare-beige break-words ${(recommendation.latitude && recommendation.longitude) ? "underline underline-offset-2" : ""} ${isMobile ? "text-xs" : ""}`}>
                {recommendation.address}
              </span>
            </button>
          )}
          
          {recommendation.opening_hours && (
            <div className="flex items-center gap-2">
              <Clock size={isMobile ? 12 : 18} className="text-darcare-gold flex-shrink-0" />
              <span className={`text-darcare-beige break-words ${isMobile ? "text-xs" : ""}`}>
                {recommendation.opening_hours}
              </span>
            </div>
          )}
        </section>
      )}

      {/* Section 4: Tags */}
      {recommendation.tags && Array.isArray(recommendation.tags) && recommendation.tags.length > 0 && (
        <section className={isMobile ? "px-2 pb-2 pt-1" : "px-6 pb-6 pt-3"}>
          <TagsList tags={recommendation.tags} />
        </section>
      )}

    </div>
  );
};
