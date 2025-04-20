
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecommendationDetailHeader } from "./RecommendationDetailHeader";
import BottomNavigation from "@/components/BottomNavigation";

interface RecommendationDetailErrorProps {
  onBack: () => void;
  onRetry: () => void;
}

export const RecommendationDetailError = ({ onBack, onRetry }: RecommendationDetailErrorProps) => {
  return (
    <div className="min-h-screen bg-darcare-navy">
      <RecommendationDetailHeader 
        title="Not Found" 
        onBack={onBack} 
        isFavorite={false}
        onToggleFavorite={() => {}} // No-op function since there's no recommendation to favorite
        recommendationId="error" // Dummy ID since we don't have a real recommendation
      />
      <div className="p-4 flex flex-col items-center justify-center text-center text-darcare-beige h-[60vh]">
        <AlertTriangle size={48} className="text-darcare-gold mb-4" />
        <h2 className="text-xl font-serif text-darcare-gold mb-2">Recommendation Not Found</h2>
        <p className="mb-6">We couldn't find the recommendation you're looking for.</p>
        <div className="space-x-4">
          <Button
            variant="outline"
            className="border-darcare-gold text-darcare-gold hover:bg-darcare-gold/10"
            onClick={onBack}
          >
            Return to Explore
          </Button>
          <Button
            variant="default"
            className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      </div>
      <BottomNavigation activeTab="explore" />
    </div>
  );
};
