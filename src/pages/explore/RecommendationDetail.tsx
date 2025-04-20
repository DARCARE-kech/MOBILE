
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import BottomNavigation from "@/components/BottomNavigation";
import { RecommendationHeader } from "@/components/explore/RecommendationHeader";
import { RecommendationInfo } from "@/components/explore/RecommendationInfo";
import { RecommendationMap } from "@/components/explore/RecommendationMap";
import { RecommendationReviews } from "@/components/explore/RecommendationReviews";
import { RecommendationDetailHeader } from "@/components/explore/RecommendationDetailHeader";
import { RecommendationDetailSkeleton } from "@/components/explore/RecommendationDetailSkeleton";
import { RecommendationDetailError } from "@/components/explore/RecommendationDetailError";
import { useRecommendationDetail } from "@/hooks/useRecommendationDetail";

const RecommendationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("info");

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
      <RecommendationDetailHeader 
        title={recommendation.title} 
        onBack={handleBack}
        isFavorite={recommendation.is_favorite || false}
        onToggleFavorite={toggleFavorite}
        recommendationId={id}
      />
      
      <RecommendationHeader 
        recommendation={recommendation}
        onToggleFavorite={toggleFavorite}
      />

      <div className="p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-darcare-navy border border-darcare-gold/20">
            <TabsTrigger value="info" className="text-darcare-beige data-[state=active]:text-darcare-gold">
              {t('explore.info')}
            </TabsTrigger>
            <TabsTrigger value="map" className="text-darcare-beige data-[state=active]:text-darcare-gold">
              {t('explore.map')}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-darcare-beige data-[state=active]:text-darcare-gold">
              {t('explore.reviews')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <RecommendationInfo recommendation={recommendation} />
          </TabsContent>

          <TabsContent value="map">
            <RecommendationMap recommendation={recommendation} />
          </TabsContent>

          <TabsContent value="reviews">
            <RecommendationReviews recommendation={recommendation} />
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default RecommendationDetail;
