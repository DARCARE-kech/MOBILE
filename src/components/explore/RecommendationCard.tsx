
import React from "react";
import { Card } from "@/components/ui/card";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getFallbackImage } from "@/utils/imageUtils";
import { useAuth } from "@/contexts/AuthContext";
import { type Recommendation } from "@/types/recommendation";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onToggleFavorite?: (id: string) => void;
}

export const RecommendationCard = ({
  recommendation,
  onToggleFavorite,
}: RecommendationCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleRecommendationClick = () => {
    navigate(`/explore/recommendations/${recommendation.id}`);
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(recommendation.id);
    }
  };
  
  // Use fallback image if none provided
  const imageUrl = recommendation.image_url || getFallbackImage(recommendation.title, 0);
  
  return (
    <Card 
      className="overflow-hidden bg-darcare-navy/60 border-darcare-gold/20 cursor-pointer hover:shadow-md transition-all duration-300"
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
            className="absolute top-2 right-2 rounded-full bg-darcare-navy/80 hover:bg-darcare-navy text-darcare-gold"
            onClick={handleToggleFavorite}
          >
            <Heart
              size={18}
              className={recommendation.is_favorite ? "fill-current" : ""}
            />
          </Button>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-serif text-darcare-gold text-lg">{recommendation.title}</h3>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-transparent text-darcare-beige border-darcare-gold/20">
            {t(`explore.categories.${recommendation.category?.toLowerCase() || 'other'}`)}
          </Badge>
          
          {recommendation.rating > 0 && (
            <div className="flex items-center">
              <Star size={16} className="text-darcare-gold fill-current mr-1" />
              <span className="text-darcare-gold">{recommendation.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default RecommendationCard;
