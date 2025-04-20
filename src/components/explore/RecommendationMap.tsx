
import { useEffect, useRef } from "react";
import type { Recommendation } from "@/types/recommendation";
import { useTranslation } from "react-i18next";

interface RecommendationMapProps {
  recommendation: Recommendation;
}

export const RecommendationMap = ({ recommendation }: RecommendationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!mapRef.current || !recommendation.latitude || !recommendation.longitude) return;

    // Load Google Maps API script if it doesn't exist
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBhXbK0z5WdN-3FH6QeHXQ6WPgQkm0QWi4&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current || !recommendation.latitude || !recommendation.longitude) return;
      
      const mapOptions = {
        center: { 
          lat: recommendation.latitude, 
          lng: recommendation.longitude 
        },
        zoom: 15,
        mapId: 'DEMO_MAP_ID',
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
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#17263c" }]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#515c6d" }]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#d59563" }]
          }
        ]
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add a marker
      new window.google.maps.Marker({
        position: { lat: recommendation.latitude, lng: recommendation.longitude },
        map: map,
        title: recommendation.title
      });
    }

    return () => {
      // Clean up any Google Maps resources if needed
    };
  }, [recommendation.latitude, recommendation.longitude, recommendation.title]);

  if (!recommendation.latitude || !recommendation.longitude) {
    return (
      <div className="text-darcare-beige text-center py-8 h-[400px] flex items-center justify-center border border-darcare-gold/20 rounded-xl">
        <div>
          <p className="mb-2">{t('explore.locationNotAvailable')}</p>
          <p className="text-sm text-darcare-gold/70">{t('explore.noCoordinatesProvided')}</p>
        </div>
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
