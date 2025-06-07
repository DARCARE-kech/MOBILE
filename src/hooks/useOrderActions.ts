
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useOrderActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const cancelOrder = async (orderId: string) => {
    if (!user) {
      toast({
        title: t('common.signInRequired'),
        description: t('auth.pleaseSignIn'),
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('Cancelling order:', orderId);
      
      const { error } = await supabase
        .from('shop_orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .eq('user_id', user.id); // Security: ensure user can only cancel their own orders

      if (error) {
        console.error('Error cancelling order:', error);
        throw error;
      }

      // Invalidate relevant queries to update UI
      await queryClient.invalidateQueries({ queryKey: ['shop-orders'] });
      await queryClient.invalidateQueries({ queryKey: ['shop-order-detail', orderId] });

      toast({
        title: t('shop.orderCancelled'),
        description: t('shop.orderCancelledDesc'),
      });
      
      console.log('Order cancelled successfully');
      return true;
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast({
        title: t('common.error'),
        description: t('shop.cancelErrorDesc'),
        variant: "destructive",
      });
      return false;
    }
  };

  return { 
    cancelOrder
  };
};
