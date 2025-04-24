
// This will create or update the file with the necessary ShopProduct type

export interface ShopProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  image_url?: string;
  category?: string;
}
