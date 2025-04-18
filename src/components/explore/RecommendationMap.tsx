
import { useEffect, useRef } from "react";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationMapProps {
  recommendation: Recommendation;
}

export const RecommendationMap = ({ recommendation }: RecommendationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !recommendation.latitude || !recommendation.longitude) return;

    // Initialize Google Maps (you'll need to add the Google Maps script to index.html)
    const map = new google.maps.Map(mapRef.current, {
      center: {
        lat: recommendation.latitude,
        lng: recommendation.longitude
      },
      zoom: 15,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [{ "color": "#242f3e" }]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [{ "color": "#242f3e" }]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [{ "color": "#746855" }]
        }
      ]
    });

    new google.maps.Marker({
      position: {
        lat: recommendation.latitude,
        lng: recommendation.longitude
      },
      map,
      title: recommendation.title
    });
  }, [recommendation]);

  if (!recommendation.latitude || !recommendation.longitude) {
    return (
      <div className="text-darcare-beige text-center py-8">
        Location information not available
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-xl overflow-hidden border border-darcare-gold/20"
    />
  );
};
