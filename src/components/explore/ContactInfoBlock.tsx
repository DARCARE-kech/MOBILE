
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ContactInfoBlockProps {
  recommendation: Recommendation;
}

export const ContactInfoBlock = ({ recommendation }: ContactInfoBlockProps) => {
  const { t } = useTranslation();
  
  if (!recommendation.contact_phone && !recommendation.site && !recommendation.opening_hours && !recommendation.address) {
    return null;
  }

  const handleCallPhone = () => {
    if (recommendation.contact_phone) {
      window.open(`tel:${recommendation.contact_phone.replace(/\s+/g, '')}`);
    }
  };
  
  const handleOpenSite = () => {
    if (recommendation.site) {
      // Add https:// if it doesn't already have a protocol
      let url = recommendation.site;
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    }
  };
  
  // Handle map opening - now using Google Maps
  const handleOpenMap = () => {
    if (recommendation.latitude && recommendation.longitude) {
      window.open(
        `https://www.google.com/maps?q=${recommendation.latitude},${recommendation.longitude}`,
        '_blank'
      );
    } else if (recommendation.address) {
      // If no coordinates, try to search by address using Google Maps
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(recommendation.address)}`,
        '_blank'
      );
    }
  };

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-serif text-darcare-gold">{t('explore.contactInfo')}</h3>
      
      {recommendation.contact_phone && (
        <Button
          variant="link"
          className="flex items-center gap-2 text-darcare-beige hover:text-darcare-gold p-0 h-auto"
          onClick={handleCallPhone}
        >
          <Phone size={16} className="text-darcare-gold" />
          <span>{recommendation.contact_phone}</span>
        </Button>
      )}
      
      {recommendation.site && (
        <Button
          variant="link"
          className="flex items-center gap-2 text-darcare-beige hover:text-darcare-gold p-0 h-auto"
          onClick={handleOpenSite}
        >
          <Mail size={16} className="text-darcare-gold" />
          <span className="underline">{recommendation.site}</span>
        </Button>
      )}
      
      {recommendation.opening_hours && (
        <div className="flex items-center gap-2 text-darcare-beige">
          <Clock size={16} className="text-darcare-gold" />
          <span>{recommendation.opening_hours}</span>
        </div>
      )}
      
      {recommendation.address && (
        <Button
          variant="link"
          className="flex items-center gap-2 text-darcare-beige hover:text-darcare-gold p-0 h-auto"
          onClick={handleOpenMap}
        >
          <MapPin size={16} className="text-darcare-gold" />
          <span className="underline">{recommendation.address}</span>
        </Button>
      )}
    </div>
  );
};
