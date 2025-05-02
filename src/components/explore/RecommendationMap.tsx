
import { useEffect, useRef } from "react";
import type { Recommendation } from "@/types/recommendation";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from "react-i18next";

interface RecommendationMapProps {
  recommendation: Recommendation;
}

export const RecommendationMap = ({ recommendation }: RecommendationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!mapRef.current || !recommendation.latitude || !recommendation.longitude) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView(
      [recommendation.latitude, recommendation.longitude],
      15
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add a marker at the recommendation location
    L.marker([recommendation.latitude, recommendation.longitude])
      .addTo(map)
      .bindPopup(recommendation.title);

    // Add zoom controls
    map.zoomControl.setPosition('topright');

    // Cleanup
    return () => {
      map.remove();
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
