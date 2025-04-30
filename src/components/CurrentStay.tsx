
import React from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import ReservationLinkForm from "./stays/ReservationLinkForm";
import StayDetails from "./stays/StayDetails";

type Stay = Tables<"stays">;

interface CurrentStayProps {
  currentStay: Stay | null;
  userId: string | undefined;
  refetchStay: () => void;
}

const CurrentStay: React.FC<CurrentStayProps> = ({ currentStay, userId, refetchStay }) => {
  // If no stay is found, show the reservation link form
  if (!currentStay) {
    return (
      <div className="p-4">
        <ReservationLinkForm userId={userId} refetchStay={refetchStay} />
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
