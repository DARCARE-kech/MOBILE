
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import type { Recommendation } from "@/types/recommendation";

interface ContactInfoBlockProps {
  recommendation: Recommendation;
}

export const ContactInfoBlock = ({ recommendation }: ContactInfoBlockProps) => {
  if (!recommendation.contact_phone && !recommendation.email && !recommendation.opening_hours && !recommendation.address) {
    return null;
  }

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-serif text-darcare-gold">Contact & Hours</h3>
      
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
