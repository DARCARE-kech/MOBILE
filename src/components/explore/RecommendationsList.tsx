import { useAuth } from "@/contexts/AuthContext";
import { useRecommendationsQuery } from "@/hooks/useRecommendationsQuery";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RecommendationCard } from "./RecommendationCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isValidCategory, type RecommendationCategory } from "@/utils/recommendationCategories";
import { useState } from "react";

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
  const { t } = useTranslation();
  
  // Keep track of favorites locally for optimistic updates
  const [localFavorites, setLocalFavorites] = useState<Record<string, boolean>>({});
  
  // Validate the category before passing it to the query
  const validCategory = selectedCategory && isValidCategory(selectedCategory) 
    ? selectedCategory as RecommendationCategory 
    : null;

  const { data: recommendations, isLoading, refetch } = useRecommendationsQuery({
    searchQuery,
    category: validCategory,
    sortBy
  });

  const handleToggleFavorite = async (recommendationId: string) => {
    if (!user) {
      toast({
        title: t('common.signInRequired'),
        description: t('explore.signInToSaveFavorites'),
        variant: "destructive",
      });
      return;
    }

    try {
      // Update local state optimistically for immediate UI feedback
      setLocalFavorites(prev => ({
        ...prev,
        [recommendationId]: !prev[recommendationId]
      }));
      
      const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recommendation_id', recommendationId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);
          
        toast({
          title: t('explore.removedFromFavorites'),
        });
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, recommendation_id: recommendationId });
          
        toast({
          title: t('explore.addedToFavorites'),
        });
      }
      
      // Refetch after successful DB operation to keep UI in sync
      refetch();
    } catch (error) {
      // Revert optimistic update on error
      setLocalFavorites(prev => ({
        ...prev,
        [recommendationId]: !prev[recommendationId]
      }));
      
      toast({
        title: t('common.error'),
        description: t('explore.couldNotUpdateFavorites'),
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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
      <div className="text-center py-8 text-darcare-beige p-4">
        {t('explore.noRecommendationsFound')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {recommendations?.map((item) => {
        // Apply any local favorite state if it exists
        const isFavorite = localFavorites[item.id] !== undefined 
          ? localFavorites[item.id] 
          : item.is_favorite;
        
        return (
          <RecommendationCard
            key={item.id}
            recommendation={{
              ...item,
              is_favorite: isFavorite
            }}
            onToggleFavorite={handleToggleFavorite}
            onSelect={(id) => navigate(`/explore/recommendations/${id}`)}
          />
        );
      })}
    </div>
  );
};
