
import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
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
        .single();
        
      if (fetchError) {
        // Check if it's a "not found" error or another type of error
        if (fetchError.code === 'PGRST116') {
          // Let's check if the reservation exists but is already linked
          const { count } = await supabase
            .from('stays')
            .select('*', { count: 'exact', head: true })
            .eq('reservation_number', reservationNumber.trim());
            
          if (count && count > 0) {
            setError("This reservation is already linked to another account");
          } else {
            setError("Invalid reservation number");
          }
        } else {
          // Some other error occurred
          console.error('Error checking reservation:', fetchError);
          setError("Error checking reservation");
        }
        setIsSubmitting(false);
        return;
      }
      
      // If we got here, we found a valid unlinked reservation
      // Update the user_id on the stay
      const { error: updateError } = await supabase
        .from('stays')
        .update({ user_id: userId })
        .eq('id', stayData.id);
      
      if (updateError) {
        console.error('Error updating stay:', updateError);
        setError("Error linking reservation");
        setIsSubmitting(false);
        return;
      }
      
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="luxury-card bg-gradient-to-br from-darcare-navy/90 to-darcare-navy">
      <h2 className="font-serif text-xl mb-3 text-darcare-gold">Link Your Reservation</h2>
      <p className="text-darcare-beige/70 mb-4">Please enter your reservation number to access your stay details.</p>
      
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
              "bg-background/50 border border-darcare-gold/30",
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
          className="w-full bg-darcare-gold hover:bg-darcare-gold/90 text-darcare-navy"
          disabled={isSubmitting || !reservationNumber.trim()}
        >
          {isSubmitting ? "Linking..." : "Link Reservation"}
        </Button>
      </form>
    </div>
  );
};

export default ReservationLinkForm;
