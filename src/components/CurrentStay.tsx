
import React from "react";
import { Calendar, ChevronRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Stay = Tables<"stays">;

interface CurrentStayProps {
  currentStay: Stay | null;
}

const CurrentStay: React.FC<CurrentStayProps> = ({ currentStay }) => {
  return (
    <div className="p-4">
      {currentStay ? (
        <div className="luxury-card">
          <div className="flex justify-between items-start mb-3">
            <h2 className="font-serif text-darcare-gold text-xl">{currentStay.villa_number}</h2>
            <div className="flex items-center gap-1 text-sm bg-darcare-gold/10 rounded-full px-3 py-1 text-darcare-gold">
              <Calendar size={14} />
              <span>
                {currentStay.status === 'current' 
                  ? 'Currently Staying' 
                  : 'Upcoming Stay'}
              </span>
            </div>
          </div>
          <p className="text-darcare-beige/80 text-sm mb-2">{currentStay.city}</p>
          <div className="flex justify-between text-sm text-darcare-white">
            <span>{`${new Date(currentStay.check_in || '').toLocaleDateString()} - ${new Date(currentStay.check_out || '').toLocaleDateString()}`}</span>
            <button className="text-darcare-gold flex items-center gap-1">
              View Details <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="luxury-card text-center text-darcare-beige/70">
          <p>You have no stays registered yet. Please contact administration or make a booking.</p>
        </div>
      )}
    </div>
  );
};

export default CurrentStay;
