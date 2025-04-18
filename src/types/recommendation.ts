
export interface Recommendation {
  id: string;
  title: string;
  image_url: string | null;
  category: string | null;
  description: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  rating?: number;
  review_count?: number;
  is_favorite?: boolean;
}
