
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import type { Recommendation } from "@/types/recommendation";

export function useRecommendationDetail(id: string | undefined) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: recommendation,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['recommendation', id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Recommendation ID is required");
      }
      
      const [recommendationResponse, favoriteResponse] = await Promise.all([
        supabase
          .from('recommendations')
          .select(`
            *,
            reviews (
              id,
              rating,
              comment,
              created_at,
              user_id
            )
          `)
          .eq('id', id)
          .single(),
        
        user ? supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('recommendation_id', id)
          .maybeSingle() : Promise.resolve({ data: null, error: null })
      ]);

      const { data, error } = recommendationResponse;
      
      if (error) throw error;
      if (!data) throw new Error("Recommendation not found");
      
      const avgRating = data.reviews?.length 
        ? data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length 
        : 0;

      return {
        ...data,
        tags: data.tags || [],
        rating: Number(avgRating.toFixed(1)),
        review_count: data.reviews?.length || 0,
        is_favorite: !!favoriteResponse.data,
        reviews: data.reviews?.map(review => ({
          ...review,
          user_profiles: {
            full_name: "Anonymous",
            avatar_url: null
          }
        }))
      } as Recommendation;
    },
    retry: 1,
    enabled: !!id
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) {
        throw new Error("User must be logged in to toggle favorites");
      }
      
      if (recommendation?.is_favorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recommendation_id', id);
          
        if (error) throw error;
        return false;
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recommendation_id: id
          });
          
        if (error) throw error;
        return true;
      }
    },
    onSuccess: (isFavorite) => {
      if (recommendation) {
        queryClient.setQueryData(['recommendation', id], {
          ...recommendation,
          is_favorite: isFavorite
        });
      }
      
      toast({
        title: isFavorite ? 'Added to favorites' : 'Removed from favorites',
      });
      
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error("Error toggling favorite:", error);
      toast({
        title: user ? 'Could not update favorites' : 'Sign in to save favorites',
        variant: "destructive"
      });
    }
  });

  return {
    recommendation,
    isLoading,
    error,
    refetch,
    toggleFavorite: toggleFavoriteMutation.mutate
  };
}
