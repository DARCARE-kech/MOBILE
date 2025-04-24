
import type { ShopProduct as SupabaseShopProduct } from '@/integrations/supabase/rpc';

export interface ShopProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  in_stock?: boolean;
}

export interface ShopCartItem {
  id: string;
  quantity: number;
  price_at_time: number;
  shop_products: ShopProduct;
}
