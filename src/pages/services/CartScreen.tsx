
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ServiceHeader from '@/components/services/ServiceHeader';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

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
      return items || [];
    },
    enabled: !!user
  });

  const getTotal = () => {
    if (!cartItems) return 0;
    return cartItems.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <ServiceHeader title="Cart" onBack={() => navigate('/services/shop')} />
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <ServiceHeader title="Cart" onBack={() => navigate('/services/shop')} />
      
      <div className="p-4">
        {(!cartItems || cartItems.length === 0) ? (
          <div className="text-center text-darcare-beige mt-8">
            <p>Your cart is empty</p>
            <Button 
              className="mt-4 bg-darcare-gold text-darcare-navy"
              onClick={() => navigate('/services/shop')}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="bg-darcare-navy border-darcare-gold/20 p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden">
                      <img 
                        src={item.shop_products.image_url || '/placeholder.svg'} 
                        alt={item.shop_products.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-darcare-white font-medium">
                        {item.shop_products.name}
                      </h3>
                      <p className="text-darcare-gold mt-1">
                        ${item.price_at_time} × {item.quantity}
                      </p>
                      <p className="text-darcare-beige/70 text-right mt-2">
                        Subtotal: ${(item.price_at_time * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 border-t border-darcare-gold/20 pt-4">
              <div className="flex justify-between text-darcare-white font-medium">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full mt-4 bg-darcare-gold text-darcare-navy"
                onClick={() => {
                  toast({
                    title: "Order Submitted",
                    description: "Your items will be charged to your room.",
                  });
                  navigate('/services/shop');
                }}
              >
                Place Order
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
