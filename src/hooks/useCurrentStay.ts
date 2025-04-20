
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CurrentStay {
  villa_number: string;
  check_in: string;
  check_out: string;
  status: string;
}

export const useCurrentStay = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['currentStay', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user logged in');
      const { data, error } = await supabase
        .rpc('get_current_stay', { user_id: userId });

      if (error) throw error;
      return data[0] as CurrentStay | null;
    },
    enabled: !!userId,
  });
};
