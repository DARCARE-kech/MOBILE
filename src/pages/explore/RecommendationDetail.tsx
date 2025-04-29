
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BottomNavigation from "@/components/BottomNavigation";
import { RecommendationHeader } from "@/components/RecommendationHeader";
import AppHeader from "@/components/AppHeader";
import { RecommendationDetailSkeleton } from "@/components/explore/RecommendationDetailSkeleton";
import { RecommendationDetailError } from "@/components/explore/RecommendationDetailError";
import { RecommendationTabs } from "@/components/explore/RecommendationTabs";
import { useRecommendationDetail } from "@/hooks/useRecommendationDetail";

const RecommendationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const { t } = useTranslation();
  
  const {
    recommendation,
    isLoading,
    error,
    refetch,
    toggleFavorite
  } = useRecommendationDetail(id);

  useEffect(() => {
    if (!id) {
      console.error("No ID in URL params, redirecting back");
      navigate(-1);
    }
  }, [id, navigate]);

  const handleBack = () => navigate(-1);

  if (!id) {
    return <RecommendationDetailSkeleton onBack={handleBack} />;
  }

  if (isLoading) {
    return <RecommendationDetailSkeleton onBack={handleBack} />;
  }

  if (error || !recommendation) {
    console.error("Error or no recommendation:", error);
    return <RecommendationDetailError onBack={handleBack} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <AppHeader 
        title={recommendation.title}
        showBackButton
        onBack={handleBack}
      />
      
      <RecommendationHeader 
        recommendation={recommendation}
        onToggleFavorite={toggleFavorite}
      />

      <RecommendationTabs 
        recommendation={recommendation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default RecommendationDetail;
