
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";

interface ContactInfoBlockProps {
  recommendation: Recommendation;
}

export const ContactInfoBlock = ({ recommendation }: ContactInfoBlockProps) => {
  const { t } = useTranslation();
  
  if (!recommendation.contact_phone && !recommendation.site && !recommendation.opening_hours && !recommendation.address) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-serif text-darcare-gold">{t('explore.contactInfo')}</h3>
      
      {recommendation.contact_phone && (
        <div className="flex items-center gap-2 text-darcare-beige">
          <Phone size={16} className="text-darcare-gold" />
          <span>{recommendation.contact_phone}</span>
        </div>
      )}
      
      {recommendation.site && (
        <div className="flex items-center gap-2 text-darcare-beige">
          <Mail size={16} className="text-darcare-gold" />
          <span>{recommendation.site}</span>
        </div>
      )}
      
      {recommendation.opening_hours && (
        <div className="flex items-center gap-2 text-darcare-beige">
          <Clock size={16} className="text-darcare-gold" />
          <span>{recommendation.opening_hours}</span>
        </div>
      )}
      
      {recommendation.address && (
        <div className="flex items-center gap-2 text-darcare-beige">
          <MapPin size={16} className="text-darcare-gold" />
          <span>{recommendation.address}</span>
        </div>
      )}
    </div>
  );
};
