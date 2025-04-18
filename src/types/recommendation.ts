
export interface Recommendation {
  id: string;
  title: string;
  image_url: string | null;
  category: string | null;
  description: string | null;
  location: string | null;
  rating?: number;
}
