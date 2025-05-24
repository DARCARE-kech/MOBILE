
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BottomNavigation from "@/components/BottomNavigation";
import { RecommendationDetailHeader } from "@/components/explore/RecommendationDetailHeader";
import { RecommendationDetailSkeleton } from "@/components/explore/RecommendationDetailSkeleton";
import { RecommendationDetailError } from "@/components/explore/RecommendationDetailError";
import { RecommendationTabs } from "@/components/explore/RecommendationTabs";
import { useRecommendationDetail } from "@/hooks/useRecommendationDetail";

import { RecommendationHeader } from "@/components/explore/RecommendationHeader";
import { supabase } from "@/integrations/supabase/client";
import ShopButton from "@/components/shop/ShopButton";
import FloatingAction from "@/components/FloatingAction";

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

  const handleReserve = async () => {
  if (!recommendation) return;

  try {
    const { data: reservationService, error } = await supabase
      .from('services')
      .select('id')
      .eq('name', 'reservation')
      .maybeSingle();

    if (error || !reservationService) {
      console.warn("Reservation service not found, redirecting to contact-admin", error);
      navigate('/contact-admin', { 
        state: { 
          preselectedCategory: 'external_request',
          subject: recommendation.title 
        }
      });
      return;
    }

    navigate(`/services/${reservationService.id}`, {
      state: {
        serviceId: reservationService.id,
        serviceType: 'reservation',
        category: recommendation.category || 'restaurant',
        option: recommendation.title,
        prefilledData: {
          reservationType: recommendation.category || 'restaurant',
          reservationName: recommendation.title,
          location: recommendation.location ?? recommendation.address,
          contact: recommendation.contact_phone ?? ''
        }
      }
    });
  } catch (err) {
    console.error("Unexpected error during reservation redirection:", err);
    navigate('/contact-admin', { 
      state: { 
        preselectedCategory: 'external_request',
        subject: recommendation.title 
      }
    });
  }
};

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
      />
  </p>
      <RecommendationHeader 
        recommendation={recommendation}
        onToggleFavorite={toggleFavorite}
        onReserve={handleReserve}
      />

      <RecommendationTabs 
        recommendation={recommendation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReserve={handleReserve}
      />
      
      <ShopButton />
      <FloatingAction />
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default RecommendationDetail;
