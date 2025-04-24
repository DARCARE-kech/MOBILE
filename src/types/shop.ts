
import type { ShopProduct } from '@/integrations/supabase/rpc';

export interface ShopCartItem {
  id: string;
  quantity: number;
  price_at_time: number;
  shop_products: ShopProduct;
}

// Export ShopProduct interface if not already defined
export interface ShopProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
}
