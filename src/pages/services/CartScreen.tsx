
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

const CartScreen = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart-items'],
    queryFn: async () => {
      try {
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
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('shop.cart')} onBack={() => navigate('/services/shop')} />
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
        <MainHeader title={t('shop.cart')} onBack={() => navigate('/services/shop')} />
        <div className="p-4 pt-16 pb-24">
          <CartEmpty onContinueShopping={() => navigate('/services/shop')} />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  const handlePlaceOrder = () => {
    toast({
      title: t('shop.orderSubmitted'),
      description: t('shop.orderChargedToRoom'),
    });
    navigate('/services/shop');
  };

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title={t('shop.cart')} onBack={() => navigate('/services/shop')} />
      <div className="p-4 pt-16 pb-24">
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
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default CartScreen;
