
import { useState, useEffect } from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { getFallbackImage } from "@/utils/imageUtils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Recommendation } from "@/types/recommendation";
import { isValidCategory } from "@/utils/recommendationCategories";
import { useTheme } from "@/contexts/ThemeContext";

interface RecommendationCardProps {
  item: Recommendation;
  onSelect?: (id: string) => void;
  onToggleFavorite?: (id: string) => Promise<void> | void;
}

export const RecommendationCard = ({ item, onSelect, onToggleFavorite }: RecommendationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.is_favorite || false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const fallbackImage = getFallbackImage(item.title, 0);
  const imageSource = (!imageError && item.image_url) ? item.image_url : fallbackImage;

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

  // Use the validation function to ensure proper translation key
  const displayCategory = isValidCategory(item.category) ? item.category.toLowerCase() : 'other';

  return (
    <div 
      className={cn(
        "w-[280px] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all hover:shadow-lg border",
        isDarkMode 
          ? "bg-darcare-navy border-darcare-gold/10 hover:border-darcare-gold/30"
          : "bg-white border-darcare-deepGold/10 hover:border-darcare-deepGold/30"
      )}
      onClick={handleCardClick}
    >
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img 
            src={imageSource}
            alt={item.title} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </AspectRatio>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 rounded-full hover:bg-white/80",
            isDarkMode
              ? "bg-darcare-navy/80 hover:bg-darcare-navy"
              : "bg-white/80",
            isFavorite && "text-primary"
          )}
          onClick={toggleFavorite}
        >
          <Heart
            size={18}
            className={cn(isFavorite && "fill-current")}
          />
        </Button>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-medium text-foreground line-clamp-1 font-serif">{item.title}</h3>
        <Badge 
          variant="outline" 
          className={cn(
            "bg-transparent border-primary/20 font-serif",
            isDarkMode ? "text-darcare-beige" : "text-darcare-deepGold"
          )}
        >
          {t(`explore.categories.${displayCategory}`)}
        </Badge>
        <div className="flex items-center justify-between text-sm">
          {item.location && (
            <div className="flex items-center gap-1 text-foreground/80">
              <MapPin size={14} className="flex-shrink-0" />
              <span className="truncate max-w-[120px]">{item.location}</span>
            </div>
          )}
          {item.rating && item.rating > 0 && (
            <div className="flex items-center gap-1 text-primary">
              <Star size={14} className="fill-current flex-shrink-0" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-4">
        <Button 
          variant="outline" 
          className="w-full text-primary hover:text-primary hover:bg-primary/10 border-primary/30"
          onClick={handleCardClick}
        >
          {t('explore.viewDetails')}
        </Button>
      </div>
    </div>
  );
};
