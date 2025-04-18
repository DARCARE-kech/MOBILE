
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import MainHeader from "@/components/MainHeader";
import { RecommendationCard } from "@/components/explore/RecommendationCard";
import type { Recommendation } from "@/types/recommendation";

const FavoritesPage = () => {
  const { user } = useAuth();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          recommendation_id,
          recommendations (
            *,
            reviews (rating)
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      return data.map((fav) => ({
        ...fav.recommendations,
        is_favorite: true
      })) as Recommendation[];
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title="Favorites" />
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-darcare-gold/20 rounded-xl h-48" />
              <div className="mt-4 h-4 bg-darcare-gold/20 rounded w-3/4" />
              <div className="mt-2 h-4 bg-darcare-gold/20 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Favorites" />
      
      <div className="p-4 pb-24">
        {!user ? (
          <div className="text-center py-8 text-darcare-beige">
            Please sign in to view your favorites
          </div>
        ) : favorites?.length === 0 ? (
          <div className="text-center py-8 text-darcare-beige">
            No favorites yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites?.map((item) => (
              <RecommendationCard 
                key={item.id} 
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
