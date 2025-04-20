
import { useState } from "react";
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
import type { Recommendation } from "@/types/recommendation";
import { RECOMMENDATION_CATEGORIES } from "@/utils/recommendationCategories";

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
  const fallbackImage = getFallbackImage(item.title, 0);
  const imageSource = (!imageError && item.image_url) ? item.image_url : fallbackImage;

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
        setIsFavorite(!isFavorite);
        toast({
          title: isFavorite ? "Removed from favorites" : "Added to favorites",
          description: `${item.title} has been ${isFavorite ? 'removed from' : 'added to'} your favorites`,
        });
      }
    } catch (error) {
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

  // Ensure the category is one of the valid categories
  const displayCategory = item.category && 
    (typeof item.category === 'string') && 
    RECOMMENDATION_CATEGORIES.includes(item.category as any)
      ? item.category
      : 'other';

  return (
    <div 
      className="w-[280px] rounded-xl overflow-hidden flex-shrink-0 group bg-darcare-navy border border-darcare-gold/10 cursor-pointer transition-all hover:shadow-lg hover:border-darcare-gold/30"
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
            "absolute top-2 right-2 rounded-full bg-darcare-navy/80 hover:bg-darcare-navy",
            (isFavorite || item.is_favorite) && "text-darcare-gold"
          )}
          onClick={toggleFavorite}
        >
          <Heart
            size={18}
            className={cn((isFavorite || item.is_favorite) && "fill-current")}
          />
        </Button>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-medium text-darcare-white line-clamp-1 font-serif">{item.title}</h3>
        <Badge 
          variant="outline" 
          className="bg-transparent text-darcare-beige border-darcare-gold/20 font-serif"
        >
          {typeof displayCategory === 'string' ? displayCategory : 'other'}
        </Badge>
        <div className="flex items-center justify-between text-sm">
          {item.location && (
            <div className="flex items-center gap-1 text-darcare-beige/80">
              <MapPin size={14} className="flex-shrink-0" />
              <span className="truncate max-w-[120px]">{item.location}</span>
            </div>
          )}
          {item.rating && item.rating > 0 && (
            <div className="flex items-center gap-1 text-darcare-gold">
              <Star size={14} className="fill-current flex-shrink-0" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 pb-4">
        <Button 
          variant="outline" 
          className="w-full text-darcare-gold hover:text-darcare-gold hover:bg-darcare-gold/10 border-darcare-gold/30"
          onClick={handleCardClick}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
