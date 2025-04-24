
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationCard } from "./RecommendationCard";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const RecommendationsList = () => {
  const { data: recommendations, isLoading, refetch } = useRecommendations();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
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
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-48 bg-darcare-gold/20 animate-pulse rounded" />
          <div className="h-8 w-24 bg-darcare-gold/20 animate-pulse rounded" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] rounded-xl overflow-hidden flex-shrink-0">
              <div className="h-40 bg-darcare-gold/20 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-5 w-3/4 bg-darcare-gold/20 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-darcare-gold/20 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-serif text-darcare-gold">Marrakech Highlights</h2>
        <button 
          className="text-darcare-gold text-sm flex items-center"
          onClick={() => navigate('/explore')}
        >
          View All <ChevronRight size={16} />
        </button>
      </div>
      {/* Horizontal scroll area with flex gap and padding */}
      <ScrollArea type="auto" className="w-full">
        <div className="flex gap-4 pb-4 px-1 overflow-x-auto">
          {recommendations?.map((recommendation) => (
            <div key={recommendation.id} className="min-w-[270px] max-w-xs flex-shrink-0">
              <RecommendationCard 
                recommendation={recommendation} 
                onSelect={(id) => navigate(`/explore/recommendations/${id}`)}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecommendationsList;
