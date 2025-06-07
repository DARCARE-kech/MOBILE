import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import FloatingAction from '@/components/FloatingAction';
import { useTranslation } from 'react-i18next';
import { Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useOrderActions } from '@/hooks/useOrderActions';

const OrderDetailScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { cancelOrder } = useOrderActions();
  const [isCancelling, setIsCancelling] = useState(false);

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

  const canCancelOrder = (status: string) => {
    return status === 'submitted' || status === 'confirmed';
  };

  const handleCancelOrder = async () => {
    if (!order?.id) return;
    
    setIsCancelling(true);
    const success = await cancelOrder(order.id);
    setIsCancelling(false);
    
    if (success) {
      // Navigate back to orders list after successful cancellation
      navigate('/services/shop/orders');
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
        <div className="flex justify-center items-center h-72 pt-20">
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
        <div className="p-4 pt-20 pb-24">
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
      
      <div className="p-4 pt-20 pb-24 space-y-4">
        {/* Order Info */}
        <Card className="bg-darcare-navy/60 border-darcare-gold/20">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-darcare-gold font-medium text-base">
                {t('shop.orderNumber', 'Order')} #{order.id.slice(-8)}
              </div>
              <Badge className={`text-xs ${getStatusBadgeVariant(order.status)}`}>
                {getStatusText(order.status)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-darcare-beige/60 text-xs">{t('shop.orderDate', 'Order Date')}</div>
                <div className="text-darcare-beige">
                  {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', {
                    locale: i18n.language === 'fr' ? fr : enUS
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-darcare-beige/60 text-xs">{t('shop.total', 'Total')}</div>
                <div className="text-darcare-gold font-medium">
                  {order.total.toFixed(2)} MAD
                </div>
              </div>
            </div>
            
            <div className="text-xs text-darcare-beige/50">
              {t('shop.lastUpdated', 'Last updated')}: {format(new Date(order.updated_at), 'dd/MM HH:mm', {
                locale: i18n.language === 'fr' ? fr : enUS
              })}
            </div>

            {/* Cancel Order Button */}
            {canCancelOrder(order.status) && (
              <div className="pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="w-full"
                      disabled={isCancelling}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {isCancelling ? t('common.processing') : t('shop.cancelOrder')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-darcare-navy border-darcare-gold/20">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-darcare-gold">
                        {t('shop.confirmCancelOrder')}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-darcare-beige/70">
                        {t('shop.cancelOrderWarning')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-darcare-gold/20 text-darcare-beige hover:bg-darcare-gold/10">
                        {t('common.cancel')}
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleCancelOrder}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {t('shop.cancelOrder')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="bg-darcare-navy/60 border-darcare-gold/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-darcare-gold text-base">{t('shop.orderItems', 'Order Items')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {order.shop_order_items?.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-darcare-navy/80 rounded-md overflow-hidden flex-shrink-0">
                    {item.shop_products?.image_url && (
                      <img
                        src={item.shop_products.image_url}
                        alt={item.shop_products.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-darcare-beige font-medium text-sm truncate">
                      {item.shop_products?.name}
                    </div>
                    <div className="text-darcare-beige/60 text-xs">
                      {t('shop.quantity', 'Qty')}: {item.quantity} × {item.price_at_time.toFixed(2)} MAD
                    </div>
                  </div>
                  <div className="text-darcare-gold font-medium text-sm">
                    {(item.quantity * item.price_at_time).toFixed(2)} MAD
                  </div>
                </div>
                {index < (order.shop_order_items?.length || 0) - 1 && (
                  <Separator className="mt-3 bg-darcare-gold/10" />
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
