
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

// Update the interface to match the stays table structure
export type CurrentStayType = Tables<"stays">;

export const useCurrentStay = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['currentStay', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No user logged in');
      
      // Look for a stay with this user_id directly
      const { data: directData, error: directError } = await supabase
        .from('stays')
        .select('*')
        .eq('user_id', userId)
        .order('check_in', { ascending: true })
        .maybeSingle();
        
      if (directError) throw directError;
      
      // If we found a stay linked to this user, return it
      if (directData) {
        return directData as CurrentStayType;
      }
      
      // If no direct stay found, try to use the RPC function as a fallback
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_current_stay', { user_id: userId });

      if (rpcError) throw rpcError;
      
      if (!rpcData || rpcData.length === 0) {
        // No stay found through either method
        return null;
      }
      
      // Convert RPC data to match stays table structure
      return {
        id: '',
        villa_number: rpcData[0].villa_number,
        check_in: rpcData[0].check_in,
        check_out: rpcData[0].check_out,
        status: rpcData[0].status,
        user_id: userId,
        city: 'Marrakech',
        guests: 2,
        reservation_number: null,
        created_at: null
      } as CurrentStayType;
    },
    enabled: !!userId,
    // Prevent caching to always get fresh data when refetching
    staleTime: 0,
  });
  
  return query;
};
