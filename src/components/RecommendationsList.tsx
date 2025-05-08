
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationCardHome } from "./RecommendationCardHome";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const RecommendationsList = () => {
  const { data: recommendations, isLoading, refetch } = useRecommendations();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  
  const handleToggleFavorite = async (id: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    const recommendation = recommendations?.find(rec => rec.id === id);
    if (!recommendation) return;

    try {
      if (recommendation.is_favorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recommendation_id', id);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, recommendation_id: id });
      }
      
      toast({
        title: recommendation.is_favorite ? "Removed from favorites" : "Added to favorites",
        description: `${recommendation.title} has been ${recommendation.is_favorite ? 'removed from' : 'added to'} your favorites`,
      });
      
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      
      // Refetch to update the UI
      refetch();
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
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-48 bg-darcare-gold/20 animate-pulse rounded" />
          <div className="h-8 w-24 bg-darcare-gold/20 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden">
              <div className="h-[220px] bg-darcare-gold/20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif text-darcare-gold">
          {t("recommendations.title", "Marrakech Highlights")}
        </h2>
        <button 
          className="text-darcare-gold text-sm flex items-center"
          onClick={() => navigate('/explore')}
        >
          {t("recommendations.viewAll", "View All")} <ChevronRight size={16} />
        </button>
      </div>

       <div className="overflow-x-auto">
       
          <div className="flex gap-10 pb-4 pr-4 snap-x snap-mandatory overflow-x-auto">
            {recommendations?.map((item) => (
              <div key={item.id} className="snap-center min-w-[260px] w-[260px] first:ml-1">
                <RecommendationCardHome
                  item={item}
                  onSelect={() => navigate(`/explore/recommendations/${item.id}`)}
                  onToggleFavorite={() => handleToggleFavorite(item.id)}
                />
              </div>
            ))}
          </div>
        
      </div>
    </div>
  );
};

export default RecommendationsList;
