
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Recommendation } from "@/types/recommendation";

export function useFavorite(recommendation?: Recommendation | null) {
  const [isFavorite, setIsFavorite] = useState(recommendation?.is_favorite || false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Update local state when recommendation prop changes
  useEffect(() => {
    if (recommendation) {
      setIsFavorite(recommendation.is_favorite || false);
    }
  }, [recommendation?.is_favorite]);

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    if (!recommendation) return;

    try {
      // Optimistically update UI
      setIsFavorite(!isFavorite);
      
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recommendation_id', recommendation.id);
          
        toast({
          title: "Removed from favorites",
        });
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, recommendation_id: recommendation.id });
          
        toast({
          title: "Added to favorites",
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsFavorite(isFavorite);
      toast({
        title: "Error",
        description: "Could not update favorites",
        variant: "destructive",
      });
    }
  };

  return { isFavorite, toggleFavorite };
}
