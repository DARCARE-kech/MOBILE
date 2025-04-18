import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Phone, Mail, Clock, MapPin, Star, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import { RecommendationInfo } from "@/components/explore/RecommendationInfo";
import { RecommendationMap } from "@/components/explore/RecommendationMap";
import { RecommendationReviews } from "@/components/explore/RecommendationReviews";
import { RecommendationReservation } from "@/components/explore/RecommendationReservation";
import WeatherDisplay from "@/components/WeatherDisplay";
import Logo from "@/components/Logo";
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
        <Header title="Loading..." onBack={() => navigate(-1)} />
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
        <Header title="Not Found" onBack={() => navigate(-1)} />
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
      <Header title={recommendation.title} onBack={() => navigate(-1)} />
      
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
            
            {(recommendation.contact_phone || recommendation.email || recommendation.opening_hours) && (
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-serif text-darcare-gold">Contact & Hours</h3>
                
                {recommendation.contact_phone && (
                  <div className="flex items-center gap-2 text-darcare-beige">
                    <Phone size={16} className="text-darcare-gold" />
                    <span>{recommendation.contact_phone}</span>
                  </div>
                )}
                
                {recommendation.email && (
                  <div className="flex items-center gap-2 text-darcare-beige">
                    <Mail size={16} className="text-darcare-gold" />
                    <span>{recommendation.email}</span>
                  </div>
                )}
                
                {recommendation.opening_hours && (
                  <div className="flex items-center gap-2 text-darcare-beige">
                    <Clock size={16} className="text-darcare-gold" />
                    <span>{recommendation.opening_hours}</span>
                  </div>
                )}
              </div>
            )}
            
            {recommendation.tags && recommendation.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-serif text-darcare-gold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {recommendation.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="bg-darcare-gold/10 text-darcare-beige border-darcare-gold/20">
                      <Tag size={12} className="mr-1" /> {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <RecommendationMap recommendation={recommendation} />
            
            {recommendation.address && (
              <div className="mt-4 flex items-center gap-2 text-darcare-beige p-3 border border-darcare-gold/20 rounded-lg">
                <MapPin size={16} className="text-darcare-gold flex-shrink-0" />
                <span>{recommendation.address}</span>
              </div>
            )}
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

const Header = ({ title, onBack }: { title: string; onBack: () => void }) => {
  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_read', false);
      
      if (error) throw error;
      return data;
    },
  });

  const hasUnreadNotifications = notifications && notifications.length > 0;

  return (
    <header className="p-4 flex justify-between items-center border-b border-darcare-gold/20 bg-gradient-to-b from-darcare-navy/95 to-darcare-navy">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10 -ml-2"
        >
          <ChevronLeft size={24} />
        </Button>
        <Logo size="sm" color="gold" withText={false} />
      </div>
      
      <div className="font-serif text-darcare-gold text-xl hidden md:block">
        {title}
      </div>
      
      <div className="flex items-center gap-4">
        <WeatherDisplay />
        <Button
          variant="ghost"
          size="icon"
          className="relative text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
          onClick={() => window.location.href = '/notifications'}
        >
          {hasUnreadNotifications && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default RecommendationDetail;
