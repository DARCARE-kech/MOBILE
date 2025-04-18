
import React from "react";
import { Calendar, ChevronRight } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import StayDetailsDialog from "@/components/StayDetailsDialog";

type Stay = Tables<"stays">;

interface CurrentStayProps {
  currentStay: Stay | null;
}

const CurrentStay: React.FC<CurrentStayProps> = ({ currentStay }) => {
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

  return (
    <div className="p-4">
      <Dialog>
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
          <div className="flex justify-between items-center text-sm">
            <span className="text-darcare-white">
              {checkIn.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
              {" - "}
              {checkOut.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              <span className="text-darcare-beige/70 ml-2">
                ({Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))} nights)
              </span>
            </span>
            <DialogTrigger asChild>
              <button className="text-darcare-gold flex items-center gap-1 hover:text-darcare-gold/80 transition-colors">
                View Details <ChevronRight size={16} />
              </button>
            </DialogTrigger>
          </div>
        </div>
        <StayDetailsDialog stay={currentStay} />
      </Dialog>
    </div>
  );
};

export default CurrentStay;
