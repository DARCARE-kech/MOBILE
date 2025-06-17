
import React from "react";
import { Calendar, ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";
import { useTranslation } from "react-i18next";

type Stay = Tables<"stays">;

interface StayDetailsProps {
  currentStay: Stay;
}

const StayDetails: React.FC<StayDetailsProps> = ({ currentStay }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const checkIn = new Date(currentStay.check_in || "");
  const checkOut = new Date(currentStay.check_out || "");
  const guestCount = typeof currentStay.guests === 'number' ? currentStay.guests : 0;

  // Force English date formatting regardless of interface language
  const formatDateEnglish = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={cn(
      "luxury-card p-2 sm:p-3",
      isDarkMode && "bg-gradient-to-br from-darcare-navy/90 to-darcare-navy"
    )}>
      <div className="flex justify-between items-start mb-2 sm:mb-3">
        <div className="min-w-0 flex-1 mr-2">
          <h2 className="font-serif text-primary text-base sm:text-lg mb-1">Villa {currentStay.villa_number}</h2>
          <p className="text-foreground/80 text-xs sm:text-sm truncate">{currentStay.city}</p>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs rounded-full px-2 py-1 whitespace-nowrap",
          isDarkMode
            ? "bg-darcare-gold/10 text-darcare-gold"
            : "bg-primary/10 text-primary"
        )}>
          <Calendar size={12} />
          <span>
            {currentStay.status === 'current' 
              ? 'Currently Staying' 
              : 'Upcoming Stay'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-1 sm:space-y-2">
        <div className={cn(
          "flex items-center justify-between text-xs sm:text-sm border-t pt-1 sm:pt-2",
          isDarkMode ? "border-darcare-gold/10" : "border-primary/10"
        )}>
          <div className="flex items-center gap-2 text-foreground min-w-0 flex-1 mr-2">
            <Calendar size={14} className="text-primary flex-shrink-0" />
            <span className="truncate">
              {formatDateEnglish(checkIn)} - {formatDateEnglish(checkOut)}
            </span>
          </div>
          <span className="text-foreground/70 text-xs whitespace-nowrap">
            ({Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights)
          </span>
        </div>
        
        <div className={cn(
          "flex items-center justify-between text-xs sm:text-sm border-t pt-1 sm:pt-2",
          isDarkMode ? "border-darcare-gold/10" : "border-primary/10"
        )}>
          <div className="flex items-center gap-2 text-foreground min-w-0 flex-1 mr-2">
            <Users size={14} className="text-primary flex-shrink-0" />
            <span className="truncate">
              {guestCount === 0
                ? 'No guest'
                : `${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}`}
            </span>
          </div>
          <button 
            className="text-primary flex items-center gap-1 hover:text-primary/80 transition-colors text-xs whitespace-nowrap"
            onClick={() => navigate("/stays/details")}
          >
            View Details <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StayDetails;
