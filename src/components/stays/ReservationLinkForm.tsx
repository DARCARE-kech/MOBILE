
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
      // First check if reservation exists and is not linked yet
      const { data: stayData, error: fetchError } = await supabase
        .from('stays')
        .select('*')
        .eq('reservation_number', reservationNumber.trim())
        .is('user_id', null) // Specifically check for null user_id
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      if (!stayData) {
        // No stay found with this reservation number OR it's already linked
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
      }
      
      // Link reservation to user since we found a valid unlinked reservation
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
      isDarkMode && "bg-gradient-to-br from-darcare-navy/90 to-darcare-navy"
    )}>
      <h2 className="font-serif text-primary text-xl mb-3">Link Your Reservation</h2>
      <p className="text-foreground/70 mb-4">Please enter your reservation number to access your stay details.</p>
      
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
              isDarkMode ? "border-darcare-gold/30" : "border-primary/30",
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
              : "bg-primary hover:bg-primary/90"
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
