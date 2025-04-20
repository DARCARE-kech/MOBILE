
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { ShopCartItem } from '@/types/shop';
import { useTranslation } from 'react-i18next';

interface CartSummaryProps {
  items: ShopCartItem[];
  onPlaceOrder: () => void;
  isSubmitting?: boolean;
}

const CartSummary = ({ items, onPlaceOrder, isSubmitting = false }: CartSummaryProps) => {
  const { t } = useTranslation();
  
  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);
  };

  return (
    <div className="mt-6 border-t border-darcare-gold/20 pt-4">
      <div className="flex justify-between text-darcare-white font-medium">
        <span>{t('shop.total')}</span>
        <span>${getTotal().toFixed(2)}</span>
      </div>
      
      <Button 
        className="w-full mt-4 bg-darcare-gold text-darcare-navy"
        onClick={onPlaceOrder}
        disabled={isSubmitting || items.length === 0}
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : null}
        {t('shop.placeOrder')}
      </Button>
    </div>
  );
};

export default CartSummary;
