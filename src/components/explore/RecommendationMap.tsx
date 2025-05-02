
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Recommendation } from '@/types/recommendation';

// Fix for Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface RecommendationMapProps {
  lat?: number;
  lng?: number;
  title?: string;
  recommendation?: Recommendation;
}

export const RecommendationMap: React.FC<RecommendationMapProps> = ({ 
  lat, 
  lng, 
  title,
  recommendation 
}) => {
  // Handle data from either direct props or recommendation object
  const latitude = lat || recommendation?.latitude || 0;
  const longitude = lng || recommendation?.longitude || 0;
  const displayTitle = title || recommendation?.title || '';

  // Handle null coordinates
  if (!latitude || !longitude) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-600">
        No location data available
      </div>
    );
  }

  return (
    <MapContainer 
      center={[latitude, longitude]} 
      zoom={15} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{displayTitle}</Popup>
      </Marker>
    </MapContainer>
  );
};
