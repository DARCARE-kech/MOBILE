
import React from 'react';
import { Button } from '@/components/ui/button';

interface CartEmptyProps {
  onContinueShopping: () => void;
}

const CartEmpty = ({ onContinueShopping }: CartEmptyProps) => {
  return (
    <div className="text-center text-darcare-beige mt-8">
      <p>Your cart is empty</p>
      <Button 
        className="mt-4 bg-darcare-gold text-darcare-navy"
        onClick={onContinueShopping}
      >
        Continue Shopping
      </Button>
    </div>
  );
};

export default CartEmpty;
