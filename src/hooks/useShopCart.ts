
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
      console.log('Adding product to cart:', product.name);
      
      // Get or create cart order (using "cart" status for active cart)
      let { data: orders, error: orderError } = await supabase
        .from('shop_orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'cart' as const)
        .order('created_at', { ascending: false });

      if (orderError) {
        console.error('Error fetching orders:', orderError);
        throw orderError;
      }

      let orderId;

      if (!orders || orders.length === 0) {
        console.log('Creating new cart order');
        const { data: newOrder, error: createError } = await supabase
          .from('shop_orders')
          .insert({ user_id: user.id, status: 'cart' as const })
          .select()
          .single();

        if (createError) {
          console.error('Error creating order:', createError);
          throw createError;
        }
        orderId = newOrder.id;
      } else {
        // Use the most recent cart order
        orderId = orders[0].id;
        console.log('Using existing cart order:', orderId);
      }
      
      // Check if item already exists in cart
      const { data: existingItem, error: existingItemError } = await supabase
        .from('shop_order_items')
        .select('id, quantity')
        .eq('order_id', orderId)
        .eq('product_id', product.id)
        .maybeSingle();

      if (existingItemError) {
        console.error('Error checking existing item:', existingItemError);
        throw existingItemError;
      }

      if (existingItem) {
        // Update quantity
        console.log('Updating existing item quantity');
        const { error: updateError } = await supabase
          .from('shop_order_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Error updating quantity:', updateError);
          throw updateError;
        }
      } else {
        // Add new item
        console.log('Adding new item to cart');
        const { error: insertError } = await supabase
          .from('shop_order_items')
          .insert({
            order_id: orderId,
            product_id: product.id,
            price_at_time: product.price,
            quantity: 1
          });

        if (insertError) {
          console.error('Error inserting item:', insertError);
          throw insertError;
        }
      }

      // Invalidate cart data queries to update UI
      await queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      await queryClient.invalidateQueries({ queryKey: ['cart-items'] });

      // Removed the "Added to Cart" toast as requested
      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add item to cart",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;

    try {
      console.log('Removing item from cart:', itemId);
      
      const { error } = await supabase
        .from('shop_order_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Invalidate cart data queries to update UI
      await queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      await queryClient.invalidateQueries({ queryKey: ['cart-items'] });

      toast({
        title: "Item Removed",
        description: "Item has been removed from your cart",
      });
      
      console.log('Item removed successfully');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Could not remove item from cart",
        variant: "destructive",
      });
    }
  };

  const updateCartItemQuantity = async (itemId: string, newQuantity: number) => {
    if (!user || newQuantity < 1) return;

    try {
      console.log('Updating cart item quantity:', itemId, newQuantity);
      
      const { error } = await supabase
        .from('shop_order_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;

      // Invalidate cart data queries to update UI
      await queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      await queryClient.invalidateQueries({ queryKey: ['cart-items'] });
      
      console.log('Quantity updated successfully');
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      toast({
        title: "Error",
        description: "Could not update quantity",
        variant: "destructive",
      });
    }
  };

  return { 
    addToCart, 
    removeFromCart, 
    updateCartItemQuantity 
  };
};
