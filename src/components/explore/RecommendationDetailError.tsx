
import { Button } from "@/components/ui/button";
import { RecommendationDetailHeader } from "./RecommendationDetailHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { useTranslation } from "react-i18next";

interface RecommendationDetailErrorProps {
  onBack: () => void;
  onRetry: () => void;
}

export const RecommendationDetailError = ({ onBack, onRetry }: RecommendationDetailErrorProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-darcare-navy">
      <RecommendationDetailHeader 
        title={t('common.error')} 
        onBack={onBack}
        isFavorite={false}
        onToggleFavorite={() => {}} // No-op function for error state
        recommendationId="error" // Placeholder for error state
      />
      <div className="flex flex-col items-center justify-center p-8 pt-20 h-[80vh]">
        <h2 className="text-2xl font-serif text-darcare-gold mb-2">{t('explore.somethingWentWrong')}</h2>
        <p className="text-darcare-beige mb-8 text-center">{t('explore.couldNotLoadRecommendation')}</p>
        <Button 
          onClick={onRetry}
          className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
        >
          {t('common.tryAgain')}
        </Button>
      </div>
      <BottomNavigation activeTab="explore" />
    </div>
  );
};
