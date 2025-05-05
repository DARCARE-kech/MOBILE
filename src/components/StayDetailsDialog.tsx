
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Users, MapPin, Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Stay = Tables<"stays">;

interface StayDetailsDialogProps {
  stay: Stay;
}

const StayDetailsDialog: React.FC<StayDetailsDialogProps> = ({ stay }) => {
  const checkIn = new Date(stay.check_in || "");
  const checkOut = new Date(stay.check_out || "");
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <DialogContent className="bg-darcare-navy border-darcare-gold/20">
      <DialogHeader>
        <DialogTitle className="text-darcare-gold font-serif">{stay.villa_number}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 mt-4">
        <div className="flex items-start gap-3">
          <Calendar className="text-darcare-gold shrink-0 mt-1" size={18} />
          <div>
            <p className="text-darcare-white">
              {checkIn.toLocaleDateString(undefined, { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {" - "}
              {checkOut.toLocaleDateString(undefined, { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-sm text-darcare-beige/70">{nights} nights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="text-darcare-gold" size={18} />
          <p className="text-darcare-white">{stay.guests} Guests</p>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="text-darcare-gold" size={18} />
          <p className="text-darcare-white">{stay.city}</p>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="text-darcare-gold" size={18} />
          <div>
            <p className="text-darcare-white">Check-in: 3:00 PM</p>
            <p className="text-darcare-white">Check-out: 11:00 AM</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default StayDetailsDialog;
