
export interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  contact_phone: string | null;
  email: string | null;
  opening_hours: string | null;
  address: string | null;
  tags: string[] | null;
  is_reservable: boolean;
  rating?: number;
  review_count?: number;
  is_favorite?: boolean;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    user_id: string;
    user_profiles?: {
      full_name: string;
      avatar_url: string | null;
    };
  }>;
}
