
// Add global window type for Google Maps initialization
interface Window {
  google?: {
    maps: typeof google.maps;
  };
  initMap?: () => void;
}
