import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { RecommendationCard } from "@/components/explore/RecommendationCard";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from 'react-i18next';

const FavoritesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: favorites, isLoading, refetch } = useQuery({
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

      return data.map((fav) => {
        const reviews = fav.recommendations.reviews || [];
        const avgRating = reviews.length 
          ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length 
          : 0;
          
        const recommendation: Recommendation = {
          ...fav.recommendations,
          is_favorite: true,
          tags: fav.recommendations.tags || [],
          contact_phone: fav.recommendations.contact_phone || null,
          site: fav.recommendations.site || null,
          opening_hours: fav.recommendations.opening_hours || null,
          address: fav.recommendations.address || null,
          rating: Number(avgRating.toFixed(1)),
          review_count: reviews.length,
          reviews: []
        };
        
        return recommendation;
      });
    },
    enabled: !!user,
    retry: 3,
    retryDelay: 500
  });

  const handleToggleFavorite = async (id: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to manage favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recommendation_id', id);

      // Refresh the favorites list after deletion
      refetch();

      toast({
        title: "Removed from favorites",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update favorites",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <Header title={t('common.favorites')} onBack={() => navigate('/explore')} />
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-darcare-gold/20 rounded-xl h-48" />
              <div className="mt-4 h-4 bg-darcare-gold/20 rounded w-3/4" />
              <div className="mt-2 h-4 bg-darcare-gold/20 rounded w-1/2" />
            </div>
          ))}
        </div>
        <BottomNavigation activeTab="explore" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <Header title="Favorites" onBack={() => navigate('/explore')} />
      
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
                recommendation={item}
                onToggleFavorite={handleToggleFavorite}
                onSelect={(id) => navigate(`/explore/recommendations/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

// Simplified header with only back button and title
const Header = ({ title, onBack }: { title: string; onBack: () => void }) => {
  return (
    <header className="p-4 flex justify-between items-center border-b border-darcare-gold/20 bg-gradient-to-b from-darcare-navy/95 to-darcare-navy">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onBack}
        className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
      >
        <ChevronLeft size={24} />
      </Button>
      
      <div className="font-serif text-darcare-gold text-xl">
        {title}
      </div>
      
      {/* Empty div to keep the header balanced with flexbox */}
      <div className="w-10"></div>
    </header>
  );
};

export default FavoritesPage;
