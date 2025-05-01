
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import ReservationLinkForm from "./stays/ReservationLinkForm";
import StayDetails from "./stays/StayDetails";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type Stay = Tables<"stays">;

interface CurrentStayProps {
  currentStay: Stay | null;
  userId: string | undefined;
  refetchStay: () => void;
  isLoading?: boolean;
}

const CurrentStay: React.FC<CurrentStayProps> = ({ 
  currentStay, 
  userId, 
  refetchStay,
  isLoading = false
}) => {
  const { toast } = useToast();
  const [isLinkingReservation, setIsLinkingReservation] = useState(false);
  
  useEffect(() => {
    // If we just got a currentStay after not having one, show a success toast
    if (currentStay && isLinkingReservation) {
      toast({
        title: "Reservation linked successfully",
        description: `Your stay at ${currentStay.villa_number} has been linked to your account.`,
      });
      setIsLinkingReservation(false);
    }
  }, [currentStay, isLinkingReservation, toast]);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="luxury-card">
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  // If no stay is found, show the reservation link form
  if (!currentStay) {
    return (
      <div className="p-4">
        <ReservationLinkForm 
          userId={userId} 
          refetchStay={() => {
            setIsLinkingReservation(true);
            refetchStay();
          }} 
        />
      </div>
    );
  }

  // If a stay is found, show the stay details
  return (
    <div className="p-4">
      <StayDetails currentStay={currentStay} />
    </div>
  );
};

export default CurrentStay;
