
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CurrentStay {
  villa_number: string;
  check_in: string;
  check_out: string;
  status: string;
}

export const useCurrentStay = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['currentStay', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .rpc('get_current_stay', { user_id: userId });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        // If no stay is found via RPC, try to fetch from stays table directly
        const { data: stayData, error: stayError } = await supabase
          .from('stays')
          .select('*')
          .eq('user_id', userId)
          .order('check_in', { ascending: true })
          .maybeSingle();
          
        if (stayError) throw stayError;
        return stayData;
      }
      
      return data[0] as CurrentStay | null;
    },
    enabled: !!userId,
  });
  
  return {
    ...query,
    data: query.data,
    refetch: query.refetch
  };
};
