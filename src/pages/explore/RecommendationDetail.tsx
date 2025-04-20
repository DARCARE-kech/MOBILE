
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { RecommendationHeader } from "@/components/explore/RecommendationHeader";
import { RecommendationInfo } from "@/components/explore/RecommendationInfo";
import { ContactInfoBlock } from "@/components/explore/ContactInfoBlock";
import { TagsList } from "@/components/explore/TagsList";
import { RecommendationMap } from "@/components/explore/RecommendationMap";
import { RecommendationReviews } from "@/components/explore/RecommendationReviews";
import { RecommendationDetailHeader } from "@/components/explore/RecommendationDetailHeader";
import { RecommendationDetailSkeleton } from "@/components/explore/RecommendationDetailSkeleton";
import { RecommendationDetailError } from "@/components/explore/RecommendationDetailError";
import { useTranslation } from "react-i18next";
import type { Recommendation } from "@/types/recommendation";

const RecommendationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("info");

  const handleBack = () => navigate(-1);

  useEffect(() => {
    if (!id) {
      console.error("No ID in URL params, redirecting back");
      navigate(-1);
    }
  }, [id, navigate]);

  const { data: recommendation, isLoading, error, refetch } = useQuery({
    queryKey: ['recommendation', id],
    queryFn: async () => {
      if (!id) {
        console.error("No recommendation ID provided");
        throw new Error("Recommendation ID is required");
      }
      
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
                user_id
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
        
        const avgRating = data.reviews?.length 
          ? data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length 
          : 0;

        return {
          ...data,
          tags: data.tags || [],
          rating: Number(avgRating.toFixed(1)),
          review_count: data.reviews?.length || 0,
          is_favorite: !!favoriteResponse.data,
          reviews: data.reviews?.map(review => ({
            ...review,
            user_profiles: {
              full_name: "Anonymous",
              avatar_url: null
            }
          }))
        } as Recommendation;
      } catch (err) {
        console.error("Error in recommendation query function:", err);
        throw err;
      }
    },
    retry: 1,
    enabled: !!id
  });

  // Add toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !id) {
        throw new Error("User must be logged in to toggle favorites");
      }
      
      if (recommendation?.is_favorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recommendation_id', id);
          
        if (error) throw error;
        return false;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recommendation_id: id
          });
          
        if (error) throw error;
        return true;
      }
    },
    onSuccess: (isFavorite) => {
      // Update the recommendation cache
      if (recommendation) {
        queryClient.setQueryData(['recommendation', id], {
          ...recommendation,
          is_favorite: isFavorite
        });
      }
      
      // Show toast notification
      toast({
        title: isFavorite ? 
          t('explore.addedToFavorites') : 
          t('explore.removedFromFavorites'),
      });
      
      // Also invalidate any favorites list queries
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error("Error toggling favorite:", error);
      
      toast({
        title: user ? 
          t('explore.couldNotUpdateFavorites') : 
          t('explore.signInToSaveFavorites'),
        variant: "destructive"
      });
    }
  });

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate();
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
        isFavorite={recommendation.is_favorite || false}
        onToggleFavorite={handleToggleFavorite}
        recommendationId={id}
      />
      
      <RecommendationHeader 
        recommendation={recommendation}
        onToggleFavorite={handleToggleFavorite}
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
            <ContactInfoBlock recommendation={recommendation} />
            <TagsList tags={recommendation.tags || []} />
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
