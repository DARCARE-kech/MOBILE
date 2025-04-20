
import type { ShopProduct } from '@/integrations/supabase/rpc';

export interface ShopCartItem {
  id: string;
  quantity: number;
  price_at_time: number;
  shop_products: ShopProduct;
}
