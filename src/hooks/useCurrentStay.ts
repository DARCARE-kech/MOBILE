
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
        return stayData as CurrentStayType | null;
      }
      
      // Convert RPC data to match stays table structure
      if (data[0]) {
        // The RPC function returns only some fields, we need to ensure it matches the expected structure
        return {
          id: '',
          villa_number: data[0].villa_number,
          check_in: data[0].check_in,
          check_out: data[0].check_out,
          status: data[0].status,
          // Default values for required fields
          user_id: userId,
          // Other fields can be null/undefined as they are optional in the interface
          city: 'Marrakech',
          guests: 2,
          reservation_number: null,
          created_at: null
        } as CurrentStayType;
      }
      
      return null;
    },
    enabled: !!userId,
    // Add staleTime: 0 to prevent caching in this specific case
    // so we can always get fresh data when refetching
    staleTime: 0,
  });
  
  return {
    ...query,
    data: query.data as CurrentStayType | null,
    refetch: query.refetch
  };
};
