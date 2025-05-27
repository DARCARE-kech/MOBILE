
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import FloatingAction from '@/components/FloatingAction';
import { useTranslation } from 'react-i18next';
import { Loader2, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

const OrderDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['shop-order-detail', id],
    queryFn: async () => {
      if (!id || !user?.id) return null;

      const { data, error } = await supabase
        .from('shop_orders')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          shop_order_items (
            id,
            quantity,
            price_at_time,
            shop_products (
              id,
              name,
              description,
              image_url
            )
          )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      // Calculate total
      const total = data?.shop_order_items?.reduce((sum, item) => 
        sum + (item.quantity * item.price_at_time), 0) || 0;

      return { ...data, total };
    },
    enabled: !!id && !!user?.id,
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={20} className="text-blue-400" />;
      case 'preparing':
        return <Clock size={20} className="text-yellow-400" />;
      case 'delivered':
        return <Package size={20} className="text-green-400" />;
      case 'cancelled':
        return <XCircle size={20} className="text-red-400" />;
      default:
        return <Clock size={20} className="text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader 
          title={t('shop.orderDetails', 'Order Details')} 
          showBack={true} 
          onBack={() => navigate('/services/shop/orders')} 
        />
        <div className="flex justify-center items-center h-72 pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader 
          title={t('shop.orderDetails', 'Order Details')} 
          showBack={true} 
          onBack={() => navigate('/services/shop/orders')} 
        />
        <div className="p-4 pt-16 pb-24">
          <div className="text-center text-darcare-beige">
            <p>{t('shop.orderNotFound', 'Order not found')}</p>
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
        title={t('shop.orderDetails', 'Order Details')} 
        showBack={true} 
        onBack={() => navigate('/services/shop/orders')} 
      />
      
      <div className="p-4 pt-16 pb-24 space-y-4">
        {/* Order Info */}
        <Card className="bg-darcare-navy/60 border-darcare-gold/20">
          <CardHeader>
            <CardTitle className="text-darcare-gold flex items-center justify-between">
              <span>{t('shop.orderNumber', 'Order')} #{order.id.slice(-8)}</span>
              <Badge className={getStatusBadgeVariant(order.status)}>
                {getStatusText(order.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-darcare-beige">
              <span>{t('shop.orderDate', 'Order Date')}</span>
              <span>
                {format(new Date(order.created_at), 'PPp', {
                  locale: i18n.language === 'fr' ? fr : enUS
                })}
              </span>
            </div>
            <div className="flex items-center justify-between text-darcare-beige">
              <span>{t('shop.total', 'Total')}</span>
              <span className="text-darcare-gold font-medium">
                {order.total.toFixed(2)} MAD
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card className="bg-darcare-navy/60 border-darcare-gold/20">
          <CardHeader>
            <CardTitle className="text-darcare-gold">{t('shop.orderStatus.title', 'Order Status')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {getStatusIcon(order.status)}
              <div>
                <div className="text-darcare-beige font-medium">
                  {getStatusText(order.status)}
                </div>
                <div className="text-darcare-beige/60 text-sm">
                  {t('shop.lastUpdated', 'Last updated')}: {format(new Date(order.updated_at), 'PPp', {
                    locale: i18n.language === 'fr' ? fr : enUS
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="bg-darcare-navy/60 border-darcare-gold/20">
          <CardHeader>
            <CardTitle className="text-darcare-gold">{t('shop.orderItems', 'Order Items')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.shop_order_items?.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-darcare-navy/80 rounded-lg overflow-hidden flex-shrink-0">
                    {item.shop_products?.image_url && (
                      <img
                        src={item.shop_products.image_url}
                        alt={item.shop_products.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-darcare-beige font-medium">
                      {item.shop_products?.name}
                    </div>
                    <div className="text-darcare-beige/60 text-sm">
                      {t('shop.quantity', 'Qty')}: {item.quantity}
                    </div>
                  </div>
                  <div className="text-darcare-gold font-medium">
                    {(item.quantity * item.price_at_time).toFixed(2)} MAD
                  </div>
                </div>
                {index < (order.shop_order_items?.length || 0) - 1 && (
                  <Separator className="mt-4 bg-darcare-gold/10" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <FloatingAction />
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default OrderDetailScreen;
