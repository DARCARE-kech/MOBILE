import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import FloatingAction from '@/components/FloatingAction';
import { useTranslation } from 'react-i18next';
import { Loader2, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const OrdersListScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['shop-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('shop_orders')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          shop_order_items (
            quantity,
            price_at_time
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['submitted', 'confirmed', 'preparing', 'delivered', 'cancelled'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate total for each order
      return data?.map(order => ({
        ...order,
        total: order.shop_order_items?.reduce((sum, item) => 
          sum + (item.quantity * item.price_at_time), 0) || 0
      })) || [];
    },
    enabled: !!user?.id,
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'preparing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return t('shop.orderStatus.submitted', 'Submitted');
      case 'confirmed':
        return t('shop.orderStatus.confirmed', 'Confirmed');
      case 'preparing':
        return t('shop.orderStatus.preparing', 'Preparing');
      case 'delivered':
        return t('shop.orderStatus.delivered', 'Delivered');
      case 'cancelled':
        return t('shop.orderStatus.cancelled', 'Cancelled');
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader 
          title={t('shop.myOrders', 'My Orders')} 
          showBack={true} 
          onBack={() => navigate('/services/shop')} 
        />
        <div className="flex justify-center items-center h-72 pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader 
          title={t('shop.myOrders', 'My Orders')} 
          showBack={true} 
          onBack={() => navigate('/services/shop')} 
        />
        <div className="p-4 pt-20 pb-24">
          <div className="text-center text-darcare-beige">
            <p>{t('common.error', 'Error loading orders')}</p>
          </div>
        </div>
        <FloatingAction />
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader 
          title={t('shop.myOrders', 'My Orders')} 
          showBack={true} 
          onBack={() => navigate('/services/shop')} 
        />
        <div className="p-4 pt-20 pb-24">
          <div className="text-center text-darcare-beige">
            <p className="text-lg font-medium mb-2">{t('shop.noOrders', 'No orders yet')}</p>
            <p className="text-darcare-beige/60">{t('shop.noOrdersDescription', 'Start shopping to see your orders here')}</p>
          </div>
        </div>
        <FloatingAction />
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader 
        title={t('shop.myOrders', 'My Orders')} 
        showBack={true} 
        onBack={() => navigate('/services/shop')} 
      />
      
      <div className="p-4 pt-20 pb-24 space-y-3">
        {orders.map((order) => (
          <Card 
            key={order.id} 
            className="bg-darcare-navy/60 border-darcare-gold/20 cursor-pointer hover:border-darcare-gold/40 transition-colors"
            onClick={() => navigate(`/services/shop/orders/${order.id}`)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-darcare-beige font-medium text-sm">
                    #{order.id.slice(-8)}
                  </div>
                  <Badge className={`text-xs px-2 py-0.5 ${getStatusBadgeVariant(order.status)}`}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
                <ChevronRight size={16} className="text-darcare-beige/50" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-darcare-beige/70 text-xs">
                  {formatDistanceToNow(new Date(order.created_at), {
                    addSuffix: true,
                    locale: i18n.language === 'fr' ? fr : enUS
                  })}
                </div>
                <div className="text-darcare-gold font-medium text-sm">
                  {order.total.toFixed(2)} MAD
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <FloatingAction />
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default OrdersListScreen;
