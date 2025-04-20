
import { useState } from "react";
import { Heart, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { getFallbackImage } from "@/utils/imageUtils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { RatingStars } from "./RatingStars";
import { useNavigate } from "react-router-dom";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  item: Recommendation;
  onSelect?: (id: string) => void;
}

export const RecommendationCard = ({ item, onSelect }: RecommendationCardProps) => {
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

  return (
    <div 
      className="w-[280px] rounded-xl overflow-hidden flex-shrink-0 group bg-darcare-navy border border-darcare-gold/10 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img 
            src={imageSource}
            alt={item.title} 
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </AspectRatio>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 rounded-full bg-darcare-navy/80 hover:bg-darcare-navy",
            isFavorite && "text-darcare-gold"
          )}
          onClick={toggleFavorite}
        >
          <Heart
            size={18}
            className={cn(isFavorite && "fill-current")}
          />
        </Button>
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-medium text-darcare-white line-clamp-1">{item.title}</h3>
        {item.category && (
          <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20">
            {item.category}
          </Badge>
        )}
        <div className="flex items-center justify-between text-sm">
          {item.location && (
            <div className="flex items-center gap-1 text-darcare-beige">
              <MapPin size={14} />
              <span>{item.location}</span>
            </div>
          )}
          {item.rating && item.rating > 0 && (
            <span className="text-darcare-gold">
              ★ {item.rating.toFixed(1)}
              {item.review_count ? ` • ${item.review_count} reviews` : ''}
            </span>
          )}
        </div>
      </div>
      <Button 
        variant="ghost" 
        className="w-full text-darcare-gold hover:text-darcare-gold hover:bg-darcare-gold/10"
        onClick={handleCardClick}
      >
        View Details
      </Button>
    </div>
  );
};
