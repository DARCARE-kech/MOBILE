
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
        .select('*, reviews(rating)')
        .order('title');
      
      if (recsError) throw recsError;

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

          // Create a properly formed recommendation object
          const recommendationWithExtras: Recommendation = {
            ...rec,
            rating: rating || 0,
            review_count: reviewsResponse.count || 0,
            is_favorite: !!favorites,
            tags: rec.tags || [],
            contact_phone: rec.contact_phone || null,
            email: rec.email || null,
            opening_hours: rec.opening_hours || null,
            address: rec.address || null,
            // Add a properly structured empty reviews array
            reviews: []
          };

          return recommendationWithExtras;
        })
      );

      return recommendationsWithExtras;
    },
  });
}
