
import { useState, useEffect } from "react";
import { Heart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFallbackImage } from "@/utils/imageUtils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import type { Recommendation } from "@/types/recommendation";
import { useTheme } from "@/contexts/ThemeContext";

interface RecommendationCardHomeProps {
  item: Recommendation;
  onSelect?: (id: string) => void;
  onToggleFavorite?: (id: string) => Promise<void> | void;
}

export const RecommendationCardHome = ({ item, onSelect, onToggleFavorite }: RecommendationCardHomeProps) => {
  const [isFavorite, setIsFavorite] = useState(item.is_favorite || false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Update local state when prop changes
  useEffect(() => {
    setIsFavorite(item.is_favorite || false);
  }, [item.is_favorite]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      // Optimistically update UI immediately
      setIsFavorite(!isFavorite);
      
      if (onToggleFavorite) {
        await onToggleFavorite(item.id);
      } else {
        if (isFavorite) {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('recommendation_id', item.id);
        } else {
          await supabase
            .from('favorites')
            .insert({ user_id: user.id, recommendation_id: item.id });
        }
        
        toast({
          title: isFavorite ? "Removed from favorites" : "Added to favorites",
          description: `${item.title} has been ${isFavorite ? 'removed from' : 'added to'} your favorites`,
        });
      }
    } catch (error) {
      // Revert the optimistic update if there's an error
      setIsFavorite(isFavorite);
      toast({
        title: "Error",
        description: "Could not update favorites",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(item.id);
    } else {
      navigate(`/explore/recommendations/${item.id}`);
    }
  };

  return (
    <div 
      className={cn(
        "w-[280px] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all hover:shadow-lg border h-[220px] flex flex-col",
        "bg-darcare-navy border-darcare-gold/10 hover:border-darcare-gold/30"
      )}
      onClick={handleCardClick}
    >
      <div className="p-4 space-y-3 flex-1">
        <h3 className="font-medium text-foreground font-serif line-clamp-1">{item.title}</h3>
        
        <p className="text-sm text-foreground/70 line-clamp-3">
          {item.description || "No description available."}
        </p>
        
        <div className="flex items-center justify-between text-sm mt-auto">
          {item.rating !== undefined && (
            <div className="flex items-center gap-1 text-primary">
              <Star size={16} className="fill-darcare-gold text-darcare-gold" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:bg-transparent hover:text-darcare-gold"
            onClick={handleCardClick}
          >
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-darcare-navy/80 hover:bg-darcare-navy w-8 h-8 flex items-center justify-center p-0"
          onClick={toggleFavorite}
        >
          <Heart
            size={18}
            className={cn(isFavorite && "fill-darcare-gold text-darcare-gold")}
          />
        </Button>
      </div>
    </div>
  );
};
