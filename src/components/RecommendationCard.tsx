
import { useState } from "react";
import { Info, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { RatingStars } from "./RatingStars";
import { getFallbackImage } from "@/utils/imageUtils";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  item: Recommendation;
  index: number;
}

export const RecommendationCard = ({ item, index }: RecommendationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = getFallbackImage(item.title, index);
  const imageSource = (!imageError && item.image_url) ? item.image_url : fallbackImage;

  return (
    <Dialog>
      <div className="mx-2 rounded-xl overflow-hidden flex-shrink-0 group bg-darcare-navy border border-darcare-gold/10">
        <div className="relative">
          <AspectRatio ratio={16/9}>
            <img 
              src={imageSource}
              alt={item.title} 
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </AspectRatio>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="absolute bottom-2 right-2 p-1.5 bg-darcare-gold/90 text-darcare-navy rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Info size={16} />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-darcare-navy border-darcare-gold/20">
              <div className="space-y-2">
                <p className="text-darcare-white">{item.description || `Explore the beautiful ${item.title}`}</p>
                <div className="flex items-center gap-2 text-darcare-beige">
                  <MapPin size={14} />
                  <span className="text-sm">{item.location || 'Marrakech, Morocco'}</span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="absolute top-2 right-2 bg-darcare-gold/90 text-darcare-navy rounded-full py-0.5 px-2 text-xs font-medium flex items-center gap-1">
            {item.rating && item.rating > 0 ? (
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-current" />
                <span>{item.rating.toFixed(1)}</span>
              </div>
            ) : (
              <span>New</span>
            )}
          </div>
        </div>
        <div className="p-3 bg-card">
          <h3 className="font-medium text-darcare-white">{item.title}</h3>
          <p className="text-xs text-darcare-beige/70">{item.category || 'Attraction'}</p>
          <div className="flex gap-1 mt-2">
            <RatingStars rating={item.rating || 0} />
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
