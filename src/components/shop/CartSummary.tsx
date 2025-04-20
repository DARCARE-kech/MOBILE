
import React from 'react';
import { Button } from '@/components/ui/button';
import type { ShopCartItem } from '@/types/shop';

interface CartSummaryProps {
  items: ShopCartItem[];
  onPlaceOrder: () => void;
}

const CartSummary = ({ items, onPlaceOrder }: CartSummaryProps) => {
  const getTotal = () => {
    return items.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);
  };

  return (
    <div className="mt-6 border-t border-darcare-gold/20 pt-4">
      <div className="flex justify-between text-darcare-white font-medium">
        <span>Total</span>
        <span>${getTotal().toFixed(2)}</span>
      </div>
      
      <Button 
        className="w-full mt-4 bg-darcare-gold text-darcare-navy"
        onClick={onPlaceOrder}
      >
        Place Order
      </Button>
    </div>
  );
};

export default CartSummary;
