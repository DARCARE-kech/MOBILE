
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Recommendation } from "@/types/recommendation";

export function useRecommendations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: async () => {
      const { data: recs, error: recsError } = await supabase
        .from('recommendations')
        .select('*')
        .order('title');
      
      if (recsError) throw recsError;

      // Fetch ratings for all recommendations
      const recommendationsWithExtras = await Promise.all(
        recs.map(async (rec) => {
          const [{ data: rating }, reviewsResponse, { data: favorites }] = await Promise.all([
            supabase.rpc('get_recommendation_avg_rating', { rec_id: rec.id }),
            supabase
              .from('reviews')
              .select('id', { count: 'exact' })
              .eq('recommendation_id', rec.id),
            user ? supabase
              .from('favorites')
              .select('id')
              .eq('user_id', user.id)
              .eq('recommendation_id', rec.id)
              .maybeSingle() : Promise.resolve({ data: null })
          ]);

          return { 
            ...rec, 
            rating, 
            review_count: reviewsResponse.count || 0,
            is_favorite: !!favorites,
            // Handle is_reservable even if it doesn't exist in the database
            is_reservable: rec.is_reservable !== undefined ? rec.is_reservable : false
          } as Recommendation;
        })
      );

      return recommendationsWithExtras;
    },
  });
}
