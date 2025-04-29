
import React from "react";
import { Calendar, ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Stay = Tables<"stays">;

interface CurrentStayProps {
  currentStay: Stay | null;
}

const CurrentStay: React.FC<CurrentStayProps> = ({ currentStay }) => {
  const navigate = useNavigate();
  
  if (!currentStay) {
    return (
      <div className="p-4">
        <div className="luxury-card text-center text-darcare-beige/70">
          <p>You have no stays registered yet. Please contact administration or make a booking.</p>
        </div>
      </div>
    );
  }

  const checkIn = new Date(currentStay.check_in || "");
  const checkOut = new Date(currentStay.check_out || "");
  const guestCount = currentStay.guests || 2;

  return (
    <div className="p-4">
      <div className="luxury-card bg-gradient-to-br from-darcare-navy/90 to-darcare-navy">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-serif text-darcare-gold text-xl mb-1">{currentStay.villa_number}</h2>
            <p className="text-darcare-beige/80 text-sm">{currentStay.city}</p>
          </div>
          <div className="flex items-center gap-1 text-sm bg-darcare-gold/10 rounded-full px-3 py-1 text-darcare-gold">
            <Calendar size={14} />
            <span>
              {currentStay.status === 'current' 
                ? 'Currently Staying' 
                : 'Upcoming Stay'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between text-sm border-t border-darcare-gold/10 pt-3">
            <div className="flex items-center gap-2 text-darcare-beige">
              <Calendar size={16} className="text-darcare-gold" />
              <span>
                {checkIn.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                {" - "}
                {checkOut.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <span className="text-darcare-beige/70">
              ({Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights)
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm border-t border-darcare-gold/10 pt-3">
            <div className="flex items-center gap-2 text-darcare-beige">
              <Users size={16} className="text-darcare-gold" />
              <span>{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</span>
            </div>
            <button 
              className="text-darcare-gold flex items-center gap-1 hover:text-darcare-gold/80 transition-colors"
              onClick={() => navigate("/stays/details")}
            >
              View Details <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentStay;
