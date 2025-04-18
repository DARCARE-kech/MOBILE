
import { useAuth } from "@/contexts/AuthContext";
import { useRecommendationsQuery } from "@/hooks/useRecommendationsQuery";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RecommendationCard } from "./RecommendationCard";
import { useNavigate } from "react-router-dom";

interface RecommendationsListProps {
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: "rating" | "distance";
}

export const RecommendationsList = ({ 
  searchQuery,  
  selectedCategory,
  sortBy
}: RecommendationsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: recommendations, isLoading } = useRecommendationsQuery({
    searchQuery,
    category: selectedCategory,
    sortBy
  });

  const handleToggleFavorite = async (recommendationId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recommendation_id', recommendationId)
        .single();

      if (existing) {
        await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, recommendation_id: recommendationId });
      }

      toast({
        title: existing ? "Removed from favorites" : "Added to favorites",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-darcare-gold/20 rounded-xl h-48" />
            <div className="mt-4 h-4 bg-darcare-gold/20 rounded w-3/4" />
            <div className="mt-2 h-4 bg-darcare-gold/20 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!recommendations?.length) {
    return (
      <div className="text-center py-8 text-darcare-beige">
        No recommendations found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((item) => (
        <RecommendationCard
          key={item.id}
          item={item}
          onToggleFavorite={handleToggleFavorite}
          onSelect={(id) => navigate(`/explore/recommendations/${id}`)}
        />
      ))}
    </div>
  );
};
