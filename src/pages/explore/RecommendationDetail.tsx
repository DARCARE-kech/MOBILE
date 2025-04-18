
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import MainHeader from "@/components/MainHeader";
import { RecommendationInfo } from "@/components/explore/RecommendationInfo";
import { RecommendationMap } from "@/components/explore/RecommendationMap";
import { RecommendationReviews } from "@/components/explore/RecommendationReviews";
import { RecommendationReservation } from "@/components/explore/RecommendationReservation";
import type { Recommendation } from "@/types/recommendation";

const RecommendationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

  const { data: recommendation, isLoading } = useQuery({
    queryKey: ['recommendation', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select(`
          *,
          reviews (
            id,
            rating,
            comment,
            created_at,
            user_id,
            user_profiles:user_id (full_name, avatar_url)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Calculate average rating
      const avgRating = data.reviews?.length 
        ? data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length 
        : 0;

      // Map user_profiles property for each review to match our type
      const reviewsWithProfiles = data.reviews?.map(review => ({
        ...review,
        user_profiles: review.user_profiles || {
          full_name: "Anonymous",
          avatar_url: null
        }
      }));

      // Make sure all required properties are present
      return {
        ...data,
        is_reservable: data.is_reservable ?? false,
        rating: Number(avgRating.toFixed(1)),
        review_count: data.reviews?.length || 0,
        is_favorite: false, // Default value, will be updated if user has favorited
        reviews: reviewsWithProfiles
      } as Recommendation;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title="Loading..." />
        <div className="animate-pulse p-4 space-y-4">
          <div className="h-64 bg-darcare-gold/20 rounded-xl" />
          <div className="h-8 w-2/3 bg-darcare-gold/20 rounded" />
          <div className="h-4 w-1/3 bg-darcare-gold/20 rounded" />
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title="Not Found" />
        <div className="p-4 text-center text-darcare-beige">
          Recommendation not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title={recommendation.title} />
      
      <div className="relative">
        <img
          src={recommendation.image_url || '/placeholder.svg'}
          alt={recommendation.title}
          className="w-full h-64 object-cover"
        />
      </div>

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
    </div>
  );
};

export default RecommendationDetail;
