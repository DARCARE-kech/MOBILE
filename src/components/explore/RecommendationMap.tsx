
import { useEffect, useRef } from "react";
import type { Recommendation } from "@/types/recommendation";

interface RecommendationMapProps {
  recommendation: Recommendation;
}

export const RecommendationMap = ({ recommendation }: RecommendationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !recommendation.latitude || !recommendation.longitude) return;

    // Placeholder for Google Maps implementation
    // To properly implement Google Maps:
    // 1. Add the Google Maps script to index.html
    // 2. Use the window.google object that will be available after the script loads
    
    // Display a message to let the user know we need to add the Maps API
    const mapElement = mapRef.current;
    mapElement.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-center p-4">
          <p class="text-darcare-gold mb-2">Map will be displayed here</p>
          <p class="text-darcare-beige text-sm">Location: ${recommendation.latitude}, ${recommendation.longitude}</p>
          <p class="text-darcare-beige text-sm mt-4">Note: Add Google Maps API key to enable maps</p>
        </div>
      </div>
    `;
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
