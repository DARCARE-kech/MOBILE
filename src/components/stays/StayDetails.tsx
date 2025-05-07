
import React from "react";
import { Calendar, ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Stay = Tables<"stays">;

interface StayDetailsProps {
  currentStay: Stay;
}

const StayDetails: React.FC<StayDetailsProps> = ({ currentStay }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const checkIn = new Date(currentStay.check_in || "");
  const checkOut = new Date(currentStay.check_out || "");
  const guestCount = typeof currentStay.guests === 'number' ? currentStay.guests : 0;


  return (
    <div className={cn(
      "luxury-card",
      isDarkMode && "bg-gradient-to-br from-darcare-navy/90 to-darcare-navy"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-serif text-primary text-xl mb-1">{currentStay.villa_number}</h2>
          <p className="text-foreground/80 text-sm">{currentStay.city}</p>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-sm rounded-full px-3 py-1",
          isDarkMode
            ? "bg-darcare-gold/10 text-darcare-gold"
            : "bg-primary/10 text-primary"
        )}>
          <Calendar size={14} />
          <span>
            {currentStay.status === 'current' 
              ? 'Currently Staying' 
              : 'Upcoming Stay'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        <div className={cn(
          "flex items-center justify-between text-sm border-t pt-3",
          isDarkMode ? "border-darcare-gold/10" : "border-primary/10"
        )}>
          <div className="flex items-center gap-2 text-foreground">
            <Calendar size={16} className="text-primary" />
            <span>
              {checkIn.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
              {" - "}
              {checkOut.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <span className="text-foreground/70">
            ({Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights)
          </span>
        </div>
        
        <div className={cn(
          "flex items-center justify-between text-sm border-t pt-3",
          isDarkMode ? "border-darcare-gold/10" : "border-primary/10"
        )}>
          <div className="flex items-center gap-2 text-foreground">
            <Users size={16} className="text-primary" />
            <span>
  {guestCount === 0
    ? 'No guest'
    : `${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}`}
</span>
          </div>
          <button 
            className="text-primary flex items-center gap-1 hover:text-primary/80 transition-colors"
            onClick={() => navigate("/stays/details")}
          >
            View Details <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StayDetails;
