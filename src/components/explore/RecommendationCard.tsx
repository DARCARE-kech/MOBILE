
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getFallbackImage } from "@/utils/imageUtils";
import { useAuth } from "@/contexts/AuthContext";
import { type Recommendation } from "@/types/recommendation";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onToggleFavorite?: (id: string) => void;
  onSelect?: (id: string) => void;
}

export const RecommendationCard = ({
  recommendation,
  onToggleFavorite,
  onSelect,
}: RecommendationCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // Local state for immediate UI updates
  const [isFavorite, setIsFavorite] = useState(recommendation.is_favorite || false);
  
  // Update local state when prop changes
  useEffect(() => {
    setIsFavorite(recommendation.is_favorite || false);
  }, [recommendation.is_favorite]);
  
  const handleRecommendationClick = () => {
    if (onSelect) {
      onSelect(recommendation.id);
    } else {
      navigate(`/explore/recommendations/${recommendation.id}`);
    }
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Update UI immediately for responsive feel
    setIsFavorite(!isFavorite);
    
    if (onToggleFavorite) {
      onToggleFavorite(recommendation.id);
    }
  };
  
  // Use fallback image if none provided
  const imageUrl = recommendation.image_url || getFallbackImage(recommendation.title, 0);
  
  return (
    <Card 
      className={cn(
        "overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300",
        isDarkMode
          ? "bg-darcare-navy/60 border-darcare-gold/20"
          : "bg-white border-darcare-deepGold/20"
      )}
      onClick={handleRecommendationClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={recommendation.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImage(recommendation.title, 0);
          }}
        />
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-2 right-2 rounded-full",
              isDarkMode
                ? "bg-darcare-navy/80 hover:bg-darcare-navy text-darcare-gold"
                : "bg-white/80 hover:bg-white text-darcare-deepGold"
            )}
            onClick={handleToggleFavorite}
          >
            <Heart
              size={18}
              className={isFavorite ? "fill-current" : ""}
            />
          </Button>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-serif text-primary text-lg">{recommendation.title}</h3>
        
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn(
              "bg-transparent border-primary/20",
              isDarkMode ? "text-darcare-beige" : "text-darcare-deepGold"
            )}
          >
            {t(`explore.categories.${recommendation.category?.toLowerCase() || 'other'}`)}
          </Badge>
          
          {recommendation.rating > 0 && (
            <div className="flex items-center">
              <Star size={16} className="text-primary fill-current mr-1" />
              <span className="text-primary">{recommendation.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RecommendationCard;
