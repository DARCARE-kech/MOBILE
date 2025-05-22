
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

interface RecommendationDetailHeaderProps {
  title: string;
  onBack: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  recommendationId?: string;
}

export const RecommendationDetailHeader = ({ 
  title, 
  onBack,
  isFavorite,
  onToggleFavorite
}: RecommendationDetailHeaderProps) => {
  return (
    <AppHeader
      title={title}
      showBack={true}
      onBack={onBack}
      showLogo={false}
      showNotifications={false}
      showWeather={true}
      showFavorite={true}
      isFavorite={isFavorite}
      onToggleFavorite={onToggleFavorite}
    />
  );
};

export default RecommendationDetailHeader;
