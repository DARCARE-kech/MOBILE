
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
      <RecommendationDetailHeader title="Not Found" onBack={onBack} />
      <div className="p-4 text-center text-darcare-beige">
        <p className="mb-4">Recommendation not found</p>
        <div className="space-x-4">
          <Button
            variant="outline"
            className="border-darcare-gold text-darcare-gold hover:bg-darcare-gold/10"
            onClick={onBack}
          >
            Return to Explore
          </Button>
          <Button
            variant="outline"
            className="border-darcare-gold text-darcare-gold hover:bg-darcare-gold/10"
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
