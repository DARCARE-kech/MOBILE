
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Recommendation } from "@/types/recommendation";

interface UseRecommendationsQueryProps {
  searchQuery?: string;
  category?: string | null;
  sortBy?: "rating" | "distance";
  onlyFavorites?: boolean;
}

export function useRecommendationsQuery({ 
  searchQuery = "", 
  category = null, 
  sortBy = "rating",
  onlyFavorites = false
}: UseRecommendationsQueryProps = {}) {
  return useQuery({
    queryKey: ['recommendations', searchQuery, category, sortBy, onlyFavorites],
    queryFn: async () => {
      let query = supabase
        .from('recommendations')
        .select(`
          *,
          reviews (rating),
          favorites!inner (user_id)
        `);

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (onlyFavorites) {
        query = query.not('favorites', 'is', null);
      }

      const { data, error } = await query;

      if (error) throw error;

      const recommendations = (data || []).map((item: any) => {
        const avgRating = item.reviews?.length 
          ? item.reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / item.reviews.length 
          : 0;

        return {
          ...item,
          rating: Number(avgRating.toFixed(1)),
          is_favorite: item.favorites?.length > 0
        } as Recommendation;
      });

      if (sortBy === "rating") {
        recommendations.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      return recommendations;
    }
  });
}
