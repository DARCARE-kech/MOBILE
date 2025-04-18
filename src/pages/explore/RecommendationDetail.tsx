
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import { RecommendationHeader } from "@/components/explore/RecommendationHeader";
import { RecommendationInfo } from "@/components/explore/RecommendationInfo";
import { ContactInfoBlock } from "@/components/explore/ContactInfoBlock";
import { TagsList } from "@/components/explore/TagsList";
import { RecommendationMap } from "@/components/explore/RecommendationMap";
import { RecommendationReviews } from "@/components/explore/RecommendationReviews";
import { RecommendationReservation } from "@/components/explore/RecommendationReservation";
import { RecommendationDetailHeader } from "@/components/explore/RecommendationDetailHeader";
import { RecommendationDetailSkeleton } from "@/components/explore/RecommendationDetailSkeleton";
import { RecommendationDetailError } from "@/components/explore/RecommendationDetailError";
import type { Recommendation } from "@/types/recommendation";

const RecommendationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  console.log("RecommendationDetail - Received ID:", id);

  const { data: recommendation, isLoading, error, refetch } = useQuery({
    queryKey: ['recommendation', id],
    queryFn: async () => {
      if (!id) {
        console.error("No recommendation ID provided");
        throw new Error("Recommendation ID is required");
      }
      
      console.log("Fetching recommendation with ID:", id);
      
      try {
        const [recommendationResponse, favoriteResponse] = await Promise.all([
          supabase
            .from('recommendations')
            .select(`
              *,
              reviews (
                id,
                rating,
                comment,
                created_at,
                user_id,
                user_profiles:profiles(full_name, avatar_url)
              )
            `)
            .eq('id', id)
            .single(),
          
          user ? supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('recommendation_id', id)
            .maybeSingle() : Promise.resolve({ data: null, error: null })
        ]);

        const { data, error } = recommendationResponse;
        
        if (error) {
          console.error("Supabase error fetching recommendation:", error);
          throw error;
        }
        
        if (!data) {
          console.error("No recommendation found with ID:", id);
          throw new Error("Recommendation not found");
        }
        
        console.log("Recommendation data received:", data);
        
        const avgRating = data.reviews?.length 
          ? data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length 
          : 0;

        const reviewsWithProfiles = data.reviews?.map(review => ({
          ...review,
          user_profiles: review.user_profiles || {
            full_name: "Anonymous",
            avatar_url: null
          }
        }));

        return {
          ...data,
          is_reservable: data.is_reservable || false,
          tags: data.tags || [],
          rating: Number(avgRating.toFixed(1)),
          review_count: data.reviews?.length || 0,
          is_favorite: !!favoriteResponse.data,
          reviews: reviewsWithProfiles
        } as Recommendation;
      } catch (err) {
        console.error("Error in recommendation query function:", err);
        throw err;
      }
    },
    retry: 1,
    enabled: !!id
  });

  useEffect(() => {
    if (!id) {
      console.error("No ID in URL params, redirecting back");
      navigate(-1);
    }
  }, [id, navigate]);

  if (!id) {
    return <RecommendationDetailSkeleton onBack={handleBack} />;
  }

  const handleBack = () => navigate(-1);

  if (isLoading) {
    return <RecommendationDetailSkeleton onBack={handleBack} />;
  }

  if (error || !recommendation) {
    console.error("Error or no recommendation:", error);
    return <RecommendationDetailError onBack={handleBack} onRetry={refetch} />;
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <RecommendationDetailHeader title={recommendation.title} onBack={handleBack} />
      
      <RecommendationHeader recommendation={recommendation} />

      <div className="p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-darcare-navy border border-darcare-gold/20">
            <TabsTrigger value="info" className="text-darcare-beige data-[state=active]:text-darcare-gold">
              Info
            </TabsTrigger>
            <TabsTrigger value="map" className="text-darcare-beige data-[state=active]:text-darcare-gold">
              Map
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-darcare-beige data-[state=active]:text-darcare-gold">
              Reviews
            </TabsTrigger>
            {recommendation.is_reservable && (
              <TabsTrigger value="reserve" className="text-darcare-beige data-[state=active]:text-darcare-gold">
                Reserve
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="info">
            <RecommendationInfo recommendation={recommendation} />
            <ContactInfoBlock recommendation={recommendation} />
            <TagsList tags={recommendation.tags || []} />
          </TabsContent>

          <TabsContent value="map">
            <RecommendationMap recommendation={recommendation} />
          </TabsContent>

          <TabsContent value="reviews">
            <RecommendationReviews recommendation={recommendation} />
          </TabsContent>

          {recommendation.is_reservable && (
            <TabsContent value="reserve">
              <RecommendationReservation recommendation={recommendation} />
            </TabsContent>
          )}
        </Tabs>
      </div>
      
      <BottomNavigation activeTab="explore" />
    </div>
  );
};

export default RecommendationDetail;
