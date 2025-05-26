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

  const { data: cartItems, isLoading, error } = useQuery({
    queryKey: ['cart-items'],
    queryFn: async () => {
      try {
        if (!user?.id) {
          console.log('No user ID available');
          return [];
        }
        
        console.log('Fetching cart items for user:', user.id);
        
        // Get cart orders (using "submitted" status)
        const { data: orders, error: orderError } = await supabase
          .from('shop_orders')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'submitted')
          .order('created_at', { ascending: false });

        if (orderError) {
          console.error('Error fetching cart orders:', orderError);
          return [];
        }

        if (!orders || orders.length === 0) {
          console.log('No cart orders found');
          return [];
        }

        // Use the most recent cart order
        const cartOrderId = orders[0].id;
        console.log('Found cart order:', cartOrderId);

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
              image_url,
              price
            )
          `)
          .eq('order_id', cartOrderId);

        if (itemsError) {
          console.error('Error fetching cart items:', itemsError);
          throw itemsError;
        }
        
        console.log('Cart items fetched:', items);
        
        // Filter out any items with missing product data
        const validItems = (items as ShopCartItem[] || []).filter(item => item && item.shop_products);
        console.log('Valid cart items:', validItems);
        
        return validItems;
      } catch (err) {
        console.error('Error in cart data fetching:', err);
        throw err;
      }
    },
    enabled: !!user?.id,
    refetchInterval: 2000, // Refetch every 2 seconds to keep cart updated
  });

  const handlePlaceOrder = async () => {
    if (!user?.id || !cartItems || cartItems.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Placing order for cart items:', cartItems.length);
      
      // Get the current cart orders (using "submitted" status)
      const { data: orders } = await supabase
        .from('shop_orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });
      
      if (orders && orders.length > 0) {
        const cartOrderId = orders[0].id;
        console.log('Finalizing order:', cartOrderId);
        
        // Update the order status to 'confirmed' (finalizing the order)
        await supabase
          .from('shop_orders')
          .update({ status: 'confirmed' })
          .eq('id', cartOrderId);
        
        // Invalidate cart queries to update UI immediately
        await queryClient.invalidateQueries({ queryKey: ['cart-items'] });
        await queryClient.invalidateQueries({ queryKey: ['cart-count'] });
        
        console.log('Order placed successfully and cart cleared');
      }
      
      toast({
        title: t('shop.orderSubmitted'),
        description: t('shop.orderChargedToRoom'),
      });
      
      // Navigate after successful submission
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
        <MainHeader title={t('shop.cart')}  showBack={true} onBack={() => navigate(-1)} />
        <div className="flex justify-center items-center h-72 pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  if (error) {
    console.error('Cart query error:', error);
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('shop.cart')} showBack={true} onBack={() => navigate(-1)} />
        <div className="p-4 pt-16 pb-24">
          <div className="text-center text-darcare-beige">
            <p>Error loading cart</p>
            <p className="text-sm text-darcare-beige/60">{error.message}</p>
          </div>
        </div>
        <FloatingAction />
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('shop.cart')} showBack={true} onBack={() => navigate(-1)} />
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
      <MainHeader title={t('shop.cart')} showBack={true} onBack={() => navigate(-1)} />
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
