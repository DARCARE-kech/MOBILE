import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CartItem from '@/components/shop/CartItem';
import CartSummary from '@/components/shop/CartSummary';
import CartEmpty from '@/components/shop/CartEmpty';
import type { ShopCartItem } from '@/types/shop';
import { Loader2 } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';
import FloatingAction from '@/components/FloatingAction';

const CartScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart-items'],
    queryFn: async () => {
      try {
        if (!user?.id) return [];
        
        // Get cart order using "submitted" status
        const { data: order, error: orderError } = await supabase
          .from('shop_orders')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'submitted')
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

        if (itemsError) {
          console.error('Error fetching cart items:', itemsError);
          return [];
        }
        
        // Filter out any items with missing product data
        return (items as ShopCartItem[] || []).filter(item => item && item.shop_products);
      } catch (err) {
        console.error('Error in cart data fetching:', err);
        return [];
      }
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Refetch every 5 seconds to keep cart updated
  });

  const handlePlaceOrder = async () => {
    if (!user?.id || !cartItems || cartItems.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the current cart order ID (using "submitted" status)
      const { data: order } = await supabase
        .from('shop_orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'submitted')
        .single();
      
      if (order) {
        // Update the order status to 'confirmed' (finalizing the order)
        await supabase
          .from('shop_orders')
          .update({ status: 'confirmed' })
          .eq('id', order.id);
        
        // Invalidate cart queries to update UI
        queryClient.invalidateQueries({ queryKey: ['cart-items'] });
        queryClient.invalidateQueries({ queryKey: ['cart-count'] });
      }
      
      toast({
        title: t('shop.orderSubmitted'),
        description: t('shop.orderChargedToRoom'),
      });
      
      // Navigate after successful submission, ensuring we don't unmount before state updates
      setTimeout(() => {
        navigate('/services');
      }, 100);
      
    } catch (err) {
      console.error('Error placing order:', err);
      toast({
        title: 'Error',
        description: 'Could not place your order',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('shop.cart')} onBack={() => navigate('/services')} />
        <div className="flex justify-center items-center h-72 pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('shop.cart')} onBack={() => navigate('/services')} />
        <div className="p-4 pt-16 pb-24">
          <CartEmpty onContinueShopping={() => navigate('/services')} />
        </div>
        <FloatingAction />
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title={t('shop.cart')} onBack={() => navigate('/services')} />
      <div className="p-4 pt-16 pb-24">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          <CartSummary 
            items={cartItems}
            onPlaceOrder={handlePlaceOrder}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
      <FloatingAction />
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default CartScreen;
