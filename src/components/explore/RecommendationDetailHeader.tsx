
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import AppHeader from "@/components/AppHeader";

interface RecommendationDetailHeaderProps {
  title: string;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  recommendationId: string;
}

export const RecommendationDetailHeader = ({ 
  title, 
  onBack,
  isFavorite,
  onToggleFavorite
}: RecommendationDetailHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <AppHeader title={title}>
      <button
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isFavorite ? 'text-darcare-gold' : 'text-darcare-beige/70'
        } hover:bg-darcare-gold/10`}
        onClick={onToggleFavorite}
        aria-label="Toggle favorite"
      >
        <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
      </button>
    </AppHeader>
  );
};

export default RecommendationDetailHeader;
