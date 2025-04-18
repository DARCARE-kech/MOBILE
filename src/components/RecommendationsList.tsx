
import React, { useState } from "react";
import { ChevronRight, Star, MapPin, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Recommendation {
  id: string;
  title: string;
  image_url: string | null;
  category: string | null;
  description: string | null;
  location: string | null;
}

// Placeholder images from Unsplash for fallbacks
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1466442929976-97f336a657be",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
  "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb",
  "https://images.unsplash.com/photo-1500673922987-e212871fec22",
];

const RecommendationsList = () => {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .order('title');
      
      if (error) throw error;
      return data;
    },
  });

  // Function to get a fallback image based on the recommendation title
  const getFallbackImage = (title: string, index: number) => {
    // Use a deterministic approach to select a placeholder based on title
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return PLACEHOLDER_IMAGES[hash % PLACEHOLDER_IMAGES.length] || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
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
            <div key={i} className="min-w-[220px] rounded-xl overflow-hidden flex-shrink-0">
              <div className="h-32 bg-darcare-gold/20 animate-pulse" />
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
        <button className="text-darcare-gold text-sm flex items-center">
          View All <ChevronRight size={16} />
        </button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {recommendations?.map((item, index) => (
            <RecommendationCard 
              key={item.id} 
              item={item} 
              index={index} 
              getFallbackImage={getFallbackImage} 
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Extracted card component with improved image handling
const RecommendationCard = ({ 
  item, 
  index, 
  getFallbackImage 
}: { 
  item: Recommendation; 
  index: number;
  getFallbackImage: (title: string, index: number) => string;
}) => {
  const [imageError, setImageError] = useState(false);
  const fallbackImage = getFallbackImage(item.title, index);
  
  // Use the item's image_url if available and not errored, otherwise use fallback
  const imageSource = (!imageError && item.image_url) ? item.image_url : fallbackImage;

  return (
    <Dialog>
      <div className="min-w-[220px] rounded-xl overflow-hidden flex-shrink-0 group bg-darcare-navy border border-darcare-gold/10">
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
            <Star size={12} fill="currentColor" />
            <span>4.8</span>
          </div>
        </div>
        <div className="p-3 bg-card">
          <h3 className="font-medium text-darcare-white">{item.title}</h3>
          <p className="text-xs text-darcare-beige/70">{item.category || 'Attraction'}</p>
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
              Save for Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecommendationsList;
