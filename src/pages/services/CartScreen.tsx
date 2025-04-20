
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import ServiceHeader from '@/components/services/ServiceHeader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CartItem from '@/components/shop/CartItem';
import CartSummary from '@/components/shop/CartSummary';
import CartEmpty from '@/components/shop/CartEmpty';
import type { ShopCartItem } from '@/types/shop';

const CartScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart-items'],
    queryFn: async () => {
      const { data: order, error: orderError } = await supabase
        .from('shop_orders')
        .select('id')
        .eq('user_id', user?.id)
        .eq('status', 'cart')
        .single();

      if (orderError || !order) return [];

      const { data: items, error: itemsError } = await supabase
        .from('shop_order_items')
        .select(`
          id,
          quantity,
          price_at_time,
          shop_products (
            id,
            name,
            description,
            image_url
          )
        `)
        .eq('order_id', order.id);

      if (itemsError) throw itemsError;
      return items as ShopCartItem[] || [];
    },
    enabled: !!user
  });

  const handlePlaceOrder = () => {
    toast({
      title: "Order Submitted",
      description: "Your items will be charged to your room.",
    });
    navigate('/services/shop');
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <ServiceHeader title="Cart" showBackButton={true} />
        <div className="p-4">
          <CartEmpty onContinueShopping={() => navigate('/services/shop')} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <ServiceHeader title="Cart" showBackButton={true} />
      <div className="p-4">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          <CartSummary 
            items={cartItems}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
