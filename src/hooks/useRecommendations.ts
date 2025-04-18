
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Recommendation } from "@/types/recommendation";

export function useRecommendations() {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data: recs, error: recsError } = await supabase
        .from('recommendations')
        .select('*')
        .order('title');
      
      if (recsError) throw recsError;

      // Fetch ratings for all recommendations
      const recommendationsWithRatings = await Promise.all(
        recs.map(async (rec) => {
          const { data: rating } = await supabase
            .rpc('get_recommendation_avg_rating', { rec_id: rec.id });
          return { ...rec, rating };
        })
      );

      return recommendationsWithRatings;
    },
  });
}
