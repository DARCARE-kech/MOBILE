import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
import type { Recommendation } from "@/types/recommendation";

const RecommendationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("info");

  const { data: recommendation, isLoading, error } = useQuery({
    queryKey: ['recommendation', id],
    queryFn: async () => {
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

      if (error) throw error;
      
      if (!data) {
        throw new Error("Recommendation not found");
      }
      
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
    },
    retry: 3,
    retryDelay: 500
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <RecommendationDetailHeader title="Loading..." onBack={() => navigate(-1)} />
        <div className="animate-pulse p-4 space-y-4">
          <div className="h-64 bg-darcare-gold/20 rounded-xl" />
          <div className="h-8 w-2/3 bg-darcare-gold/20 rounded" />
          <div className="h-4 w-1/3 bg-darcare-gold/20 rounded" />
        </div>
        <BottomNavigation activeTab="explore" />
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <RecommendationDetailHeader title="Not Found" onBack={() => navigate(-1)} />
        <div className="p-4 text-center text-darcare-beige">
          <p className="mb-4">Recommendation not found</p>
          <Button
            variant="outline"
            className="border-darcare-gold text-darcare-gold hover:bg-darcare-gold/10"
            onClick={() => navigate('/explore')}
          >
            Return to Explore
          </Button>
        </div>
        <BottomNavigation activeTab="explore" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <RecommendationDetailHeader title={recommendation.title} onBack={() => navigate(-1)} />
      
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
