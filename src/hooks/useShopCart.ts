
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ShopProduct } from '@/types/shop';
import { useQueryClient } from '@tanstack/react-query';

export const useShopCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addToCart = async (product: ShopProduct) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get or create cart (using "submitted" status for cart items)
      const { data: order, error: orderError } = await supabase
        .from('shop_orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'submitted')
        .single();

      let orderId;

      if (orderError || !order) {
        console.log('Creating new cart order');
        const { data: newOrder, error: createError } = await supabase
          .from('shop_orders')
          .insert({ user_id: user.id, status: 'submitted' })
          .select()
          .single();

        if (createError) throw createError;
        orderId = newOrder.id;
      } else {
        orderId = order.id;
      }
      
      // Check if item already exists in cart
      const { data: existingItem, error: existingItemError } = await supabase
        .from('shop_order_items')
        .select('id, quantity')
        .eq('order_id', orderId)
        .eq('product_id', product.id)
        .single();

      if (existingItemError && !existingItem) {
        // Add new item
        await supabase
          .from('shop_order_items')
          .insert({
            order_id: orderId,
            product_id: product.id,
            price_at_time: product.price,
            quantity: 1
          });
      } else if (existingItem) {
        // Update quantity
        await supabase
          .from('shop_order_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
      }

      // Invalidate cart data queries to update UI
      queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      queryClient.invalidateQueries({ queryKey: ['cart-items'] });

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
