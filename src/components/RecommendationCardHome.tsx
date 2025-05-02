
import { useState, useEffect } from "react";
import { Heart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getFallbackImage } from "@/utils/imageUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslation } from "react-i18next";
import type { Recommendation } from "@/types/recommendation";
import { isValidCategory } from "@/utils/recommendationCategories";

interface RecommendationCardHomeProps {
  item: Recommendation;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const RecommendationCardHome = ({ item, onSelect, onToggleFavorite }: RecommendationCardHomeProps) => {
  const [isFavorite, setIsFavorite] = useState(item.is_favorite || false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  
  // Update local state when prop changes
  useEffect(() => {
    setIsFavorite(item.is_favorite || false);
  }, [item.is_favorite]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite(item.id);
  };

  // Use image_url with fallback
  const imageUrl = item.image_url || getFallbackImage(item.title, 0);
  
  // Ensure category is valid and properly formatted for translation
  const displayCategory = isValidCategory(item.category) ? item.category.toLowerCase() : 'other';

  return (
    <div 
      className="w-[280px] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all hover:shadow-lg border border-darcare-gold/10 hover:border-darcare-gold/30 bg-darcare-navy"
      onClick={() => onSelect(item.id)}
    >
      <div className="w-full h-32 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImage(item.title, 0);
          }}
        />
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-darcare-navy/60 hover:bg-darcare-navy/80 w-8 h-8"
            onClick={handleToggleFavorite}
          >
            <Heart
              size={16}
              className={cn(
                "transition-colors",
                isFavorite ? "fill-darcare-gold text-darcare-gold" : "text-darcare-beige"
              )}
            />
          </Button>
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <h3 className="font-serif font-medium text-darcare-gold line-clamp-1">{item.title}</h3>
        
        {item.category && (
          <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20 font-serif">
            {t(`explore.categories.${displayCategory}`)}
          </Badge>
        )}
        
        <p className="text-sm text-darcare-beige/80 line-clamp-2">
          {item.description || "Discover this amazing place in Marrakech"}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-darcare-gold text-darcare-gold" />
            <span className="text-sm text-darcare-beige">{item.rating?.toFixed(1) || "N/A"}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:bg-transparent hover:text-darcare-gold text-darcare-beige"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item.id);
            }}
          >
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
