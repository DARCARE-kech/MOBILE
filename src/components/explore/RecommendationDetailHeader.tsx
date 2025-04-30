
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecommendationDetailHeaderProps {
  title: string;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  recommendationId: string;
}

export const RecommendationDetailHeader = ({ 
  title, 
  onBack
}: RecommendationDetailHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-darcare-navy/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-darcare-beige"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M15 18L9 12L15 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        
        <h1 className="font-serif text-darcare-gold text-lg font-medium truncate">
          {title}
        </h1>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/explore/favorites')}
          className="text-darcare-gold"
        >
          <Heart size={20} />
        </Button>
      </div>
    </div>
  );
};

export default RecommendationDetailHeader;
