
import { useState } from "react";
import { Heart, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getFallbackImage } from "@/utils/imageUtils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  item: Recommendation;
}

export const RecommendationCard = ({ item }: RecommendationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.is_favorite || false);
  const { user } = useAuth();
  const { toast } = useToast();
  const fallbackImage = getFallbackImage(item.title, 0);
  const imageSource = (!imageError && item.image_url) ? item.image_url : fallbackImage;

  const toggleFavorite = async () => {
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

  return (
    <Dialog>
      <div className="w-[280px] rounded-xl overflow-hidden flex-shrink-0 group bg-darcare-navy border border-darcare-gold/10">
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite();
            }}
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
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full text-darcare-gold hover:text-darcare-gold hover:bg-darcare-gold/10"
          >
            View Details
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent className="bg-darcare-navy border-darcare-gold/20">
        <DialogHeader>
          <DialogTitle className="text-darcare-gold font-serif">{item.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <AspectRatio ratio={16/9} className="overflow-hidden rounded-lg">
            <img 
              src={imageSource} 
              alt={item.title} 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </AspectRatio>
          <div className="flex items-center gap-2">
            <RatingStars rating={item.rating || 0} />
            <span className="text-darcare-beige text-sm">
              {item.rating && item.rating > 0 ? `${item.rating.toFixed(1)} / 5.0` : 'Not rated yet'}
            </span>
          </div>
          <p className="text-darcare-white">{item.description || `Experience the beauty and magic of ${item.title}, one of Marrakech's most treasured locations.`}</p>
          <div className="flex items-center gap-2 text-darcare-beige">
            <MapPin size={16} />
            <span>{item.location || 'Marrakech, Morocco'}</span>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90">
              Book Now
            </Button>
            <Button variant="outline" className="flex-1 border-darcare-gold/20 text-darcare-gold hover:bg-darcare-gold/10">
              Write Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
