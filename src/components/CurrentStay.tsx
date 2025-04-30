import React, { useState } from "react";
import { Calendar, ChevronRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Stay = Tables<"stays">;

interface CurrentStayProps {
  currentStay: Stay | null;
  userId: string | undefined;
  refetchStay: () => void;
}

const CurrentStay: React.FC<CurrentStayProps> = ({ currentStay, userId, refetchStay }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDarkMode } = useTheme();
  const [reservationNumber, setReservationNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleLinkReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !reservationNumber.trim()) return;
    
    setIsSubmitting(true);
    try {
      // First check if reservation exists
      const { data: stayData, error: fetchError } = await supabase
        .from('stays')
        .select('*')
        .eq('reservation_number', reservationNumber.trim())
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (!stayData) {
        toast({
          title: "Invalid reservation number",
          description: "Please check your reservation number and try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (stayData.user_id) {
        toast({
          title: "Reservation already linked",
          description: "This reservation is already linked to another account.",
          variant: "destructive",
        });
        return;
      }
      
      // Link reservation to user
      const { error: updateError } = await supabase
        .from('stays')
        .update({ user_id: userId })
        .eq('id', stayData.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Reservation linked successfully",
        description: "Your stay details have been updated.",
      });
      
      // Refetch stay data
      refetchStay();
      
    } catch (error: any) {
      console.error('Error linking reservation:', error);
      toast({
        title: "Error linking reservation",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentStay) {
    return (
      <div className="p-4">
        <div className={cn(
          "luxury-card",
          isDarkMode && "bg-gradient-to-br from-darcare-navy/90 to-darcare-navy"
        )}>
          <h2 className="font-serif text-primary text-xl mb-3">Link Your Reservation</h2>
          <p className="text-foreground/70 mb-4">Please enter your reservation number to access your stay details.</p>
          
          <form onSubmit={handleLinkReservation} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your reservation number"
              value={reservationNumber}
              onChange={(e) => setReservationNumber(e.target.value)}
              className={cn(
                "bg-background/50 border",
                isDarkMode ? "border-darcare-gold/30" : "border-primary/30"
              )}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              className={cn(
                "w-full",
                isDarkMode
                  ? "bg-darcare-gold hover:bg-darcare-gold/90 text-darcare-navy"
                  : "bg-primary hover:bg-primary/90"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Linking..." : "Link Reservation"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const checkIn = new Date(currentStay.check_in || "");
  const checkOut = new Date(currentStay.check_out || "");
  const guestCount = currentStay.guests || 2;

  return (
    <div className="p-4">
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
              <span>{guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}</span>
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
    </div>
  );
};

export default CurrentStay;
