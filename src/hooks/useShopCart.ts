
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ShopProduct } from '@/integrations/supabase/rpc';

export const useShopCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const addToCart = async (product: ShopProduct) => {
    if (!user) return;

    try {
      // Get or create cart
      const { data: order, error: orderError } = await supabase
        .from('shop_orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'cart')
        .single();

      if (orderError && !order) {
        const { data: newOrder, error: createError } = await supabase
          .from('shop_orders')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) throw createError;
        
        // Add item to new cart
        await supabase
          .from('shop_order_items')
          .insert({
            order_id: newOrder.id,
            product_id: product.id,
            price_at_time: product.price
          });
      } else if (order) {
        // Check if item already exists in cart
        const { data: existingItem } = await supabase
          .from('shop_order_items')
          .select('id, quantity')
          .eq('order_id', order.id)
          .eq('product_id', product.id)
          .single();

        if (existingItem) {
          // Update quantity
          await supabase
            .from('shop_order_items')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('id', existingItem.id);
        } else {
          // Add new item
          await supabase
            .from('shop_order_items')
            .insert({
              order_id: order.id,
              product_id: product.id,
              price_at_time: product.price
            });
        }
      }

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add item to cart",
        variant: "destructive",
      });
    }
  };

  return { addToCart };
};
