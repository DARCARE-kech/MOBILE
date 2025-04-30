
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReservationLinkFormProps {
  userId: string | undefined;
  refetchStay: () => void;
}

const ReservationLinkForm: React.FC<ReservationLinkFormProps> = ({ userId, refetchStay }) => {
  const { toast } = useToast();
  const { isDarkMode } = useTheme();
  const [reservationNumber, setReservationNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleLinkReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError("Please log in to link your reservation");
      return;
    }
    
    if (!reservationNumber.trim()) {
      setError("Please enter a reservation number");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Search for stay with this reservation number where user_id IS NULL
      const { data: stayData, error: fetchError } = await supabase
  .from('stays')
  .select('*')
  .eq('reservation_number', reservationNumber.trim())
  .is('user_id', null)
  .maybeSingle(); // ← plus souple

      if (!stayData) {
  // Soit il n'existe pas, soit il est déjà lié
  const { count } = await supabase
    .from('stays')
    .select('*', { count: 'exact', head: true })
    .eq('reservation_number', reservationNumber.trim());

  if (count && count > 0) {
    setError("This reservation is already linked to another account");
  } else {
    setError("Invalid reservation number");
  }
  setIsSubmitting(false);
  return;
}
      
      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No reservation found with this number or it's already linked
          // Now check if it exists but is already linked
          const { count } = await supabase
            .from('stays')
            .select('*', { count: 'exact', head: true })
            .eq('reservation_number', reservationNumber.trim());
            
          if (count && count > 0) {
            setError("This reservation is already linked to an account");
          } else {
            setError("Invalid reservation number");
          }
          setIsSubmitting(false);
          return;
        } else {
          // Some other error occurred
          throw fetchError;
        }
      }
      
      // If we got here, we found a valid unlinked reservation
      // Update the user_id on the stay
      const { error: updateError } = await supabase
        .from('stays')
        .update({ user_id: userId })
        .eq('id', stayData.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Reservation linked successfully",
        description: "Your stay details have been updated.",
      });
      
      setReservationNumber("");
      
      // Refetch stay data immediately to update the UI
      refetchStay();
      
    } catch (error: any) {
      console.error('Error linking reservation:', error);
      setError(error.message || "Error linking reservation");
      toast({
        title: "Error linking reservation",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn(
      "luxury-card",
      isDarkMode 
        ? "bg-gradient-to-br from-darcare-navy/90 to-darcare-navy" 
        : "bg-white border-secondary/10"
    )}>
      <h2 className={cn(
        "font-serif text-xl mb-3",
        isDarkMode ? "text-darcare-gold" : "text-primary"
      )}>Link Your Reservation</h2>
      <p className={cn(
        isDarkMode ? "text-darcare-beige/70" : "text-foreground/70",
        "mb-4"
      )}>Please enter your reservation number to access your stay details.</p>
      
      <form onSubmit={handleLinkReservation} className="space-y-4">
        <div className="space-y-1">
          <Input
            type="text"
            placeholder="Enter your reservation number"
            value={reservationNumber}
            onChange={(e) => {
              setReservationNumber(e.target.value);
              setError(null);
            }}
            className={cn(
              "bg-background/50 border",
              isDarkMode 
                ? "border-darcare-gold/30" 
                : "border-secondary/30",
              error ? "border-red-500" : ""
            )}
            disabled={isSubmitting}
          />
          {error && (
            <div className="flex items-center gap-1 text-red-500 text-sm">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          className={cn(
            "w-full",
            isDarkMode
              ? "bg-darcare-gold hover:bg-darcare-gold/90 text-darcare-navy"
              : "bg-secondary hover:bg-secondary/90 text-white"
          )}
          disabled={isSubmitting || !reservationNumber.trim()}
        >
          {isSubmitting ? "Linking..." : "Link Reservation"}
        </Button>
      </form>
    </div>
  );
};

export default ReservationLinkForm;
