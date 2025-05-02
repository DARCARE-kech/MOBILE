
import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Mail, Clock, Star, Heart, ArrowLeft, Info, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFavorite } from '@/hooks/useFavorite';
import { Recommendation } from '@/types/recommendation';
import { supabase } from '@/integrations/supabase/client';
import { getFallbackImage } from '@/utils/imageUtils';
import { RecommendationMap } from './RecommendationMap';

const RecommendationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Try to get recommendation from location state first
  const initialRecommendation = location.state?.recommendation as Recommendation | undefined;
  
  // Query for recommendation details
  const { data: recommendation, isLoading } = useQuery({
    queryKey: ['recommendation', id],
    queryFn: async () => {
      if (initialRecommendation) return initialRecommendation;
      
      const { data, error } = await supabase
        .from('recommendations')
        .select('*, reviews(id, rating, comment, created_at, user_id), favorites(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Transform the raw data into the expected Recommendation type
      const formattedRecommendation: Recommendation = {
        ...data,
        id: data.id,
        title: data.title,
        description: data.description || null,
        category: data.category || null,
        location: data.location || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        image_url: data.image_url || null,
        contact_phone: data.contact_phone || null,
        site: data.site || null,
        email: data.email || null,
        opening_hours: data.opening_hours || null,
        address: data.address || null,
        tags: data.tags || [],
        rating: 0,
        review_count: 0,
        is_favorite: data.favorites?.length > 0,
        has_reservation: data.has_reservation || false,
        reviews: []
      };
      
      return formattedRecommendation;
    },
    initialData: initialRecommendation
  });

  const { toggleFavorite, isFavorite } = useFavorite(recommendation);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-darcare-navy">
        <div className="animate-spin text-darcare-gold">
          <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  if (!recommendation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-darcare-navy p-4">
        <h2 className="text-darcare-gold text-xl mb-2">{t('common.notFound')}</h2>
        <p className="text-darcare-beige mb-4">{t('explore.couldNotLoadRecommendation')}</p>
        <Button onClick={() => navigate('/explore')} variant="outline">
          <ArrowLeft size={16} className="mr-2" />
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy pb-24">
      {/* Header Image */}
      <div className="relative h-64 w-full">
        <img 
          src={recommendation.image_url || getFallbackImage(recommendation.title, parseInt(recommendation.id) || 0)}
          alt={recommendation.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImage(recommendation.title, parseInt(recommendation.id) || 0);
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-darcare-navy to-transparent"></div>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 left-4 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40"
          onClick={() => navigate('/explore')}
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-4 right-4 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40"
          onClick={() => toggleFavorite()}
        >
          <Heart 
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-red-500 text-red-500" : "text-white"
            )} 
          />
        </Button>
      </div>
      
      {/* Content */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="rounded-xl bg-darcare-navy/90 backdrop-blur-sm border border-darcare-gold/10 p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
            <div>
              <Badge 
                className="mb-2 bg-darcare-navy/80 text-darcare-gold border-darcare-gold/30"
              >
                {recommendation.category ? t(`explore.categories.${recommendation.category.toLowerCase()}`) : t('explore.categories.other')}
              </Badge>
              <h1 className="text-darcare-gold text-2xl font-serif">{recommendation.title}</h1>
            </div>
            
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-darcare-beige font-medium">
                {recommendation.rating?.toFixed(1) || "N/A"}
                <span className="text-darcare-beige/60 text-sm ml-1">
                  ({recommendation.review_count || 0})
                </span>
              </span>
            </div>
          </div>
          
          <p className="text-darcare-beige/80 mb-6">{recommendation.description}</p>
          
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full bg-darcare-navy/50 border border-darcare-gold/20">
              <TabsTrigger value="info" className="flex-1 data-[state=active]:text-darcare-gold">
                <Info className="h-4 w-4 mr-2" />
                {t('explore.info')}
              </TabsTrigger>
              <TabsTrigger value="map" className="flex-1 data-[state=active]:text-darcare-gold">
                <Map className="h-4 w-4 mr-2" />
                {t('explore.map')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="py-4">
              <div className="space-y-5">
                {/* Location Section */}
                <div>
                  <h3 className="text-darcare-gold font-medium mb-2">{t('explore.location')}</h3>
                  <div className="flex items-start text-darcare-beige/80">
                    <MapPin className="h-5 w-5 text-darcare-gold mr-2 mt-0.5 flex-shrink-0" />
                    <span>{recommendation.address || t('explore.locationNotAvailable')}</span>
                  </div>
                </div>
                
                {/* Contact Section */}
                <div>
                  <h3 className="text-darcare-gold font-medium mb-2">{t('explore.contactInfo')}</h3>
                  {recommendation.contact_phone && (
                    <div className="flex items-center text-darcare-beige/80 mb-2">
                      <Phone className="h-4 w-4 text-darcare-gold mr-2 flex-shrink-0" />
                      <span>{recommendation.contact_phone}</span>
                    </div>
                  )}
                  {recommendation.email && (
                    <div className="flex items-center text-darcare-beige/80">
                      <Mail className="h-4 w-4 text-darcare-gold mr-2 flex-shrink-0" />
                      <span>{recommendation.email}</span>
                    </div>
                  )}
                  {!recommendation.contact_phone && !recommendation.email && (
                    <p className="text-darcare-beige/60 text-sm">{t('common.notAvailable')}</p>
                  )}
                </div>
                
                {/* Hours Section */}
                {recommendation.opening_hours && (
                  <div>
                    <h3 className="text-darcare-gold font-medium mb-2">Opening Hours</h3>
                    <div className="flex items-start text-darcare-beige/80">
                      <Clock className="h-5 w-5 text-darcare-gold mr-2 mt-0.5 flex-shrink-0" />
                      <span>{recommendation.opening_hours}</span>
                    </div>
                  </div>
                )}
                
                {/* Tags */}
                {recommendation.tags && recommendation.tags.length > 0 && (
                  <div>
                    <h3 className="text-darcare-gold font-medium mb-2">{t('explore.features')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.tags.map((tag, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="border-darcare-gold/30 text-darcare-beige"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="map" className="py-4">
              {recommendation.latitude && recommendation.longitude ? (
                <div className="h-64 rounded-lg overflow-hidden">
                  <RecommendationMap 
                    latitude={recommendation.latitude} 
                    longitude={recommendation.longitude}
                    title={recommendation.title}
                  />
                </div>
              ) : (
                <div className="h-64 rounded-lg bg-darcare-navy/50 border border-darcare-gold/10 flex items-center justify-center">
                  <p className="text-darcare-beige/60">{t('explore.noCoordinatesProvided')}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {recommendation.has_reservation && (
            <Button 
              className="mt-6 w-full bg-darcare-gold hover:bg-darcare-gold/80 text-darcare-navy font-medium"
            >
              {t('explore.makeReservation')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationDetail;
