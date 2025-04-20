
import React from 'react';
import { Card } from '@/components/ui/card';
import type { ShopCartItem } from '@/types/shop';

interface CartItemProps {
  item: ShopCartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  // Handle image error fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.svg';
  };

  return (
    <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-md overflow-hidden bg-darcare-beige/10">
          <img 
            src={item.shop_products.image_url || '/placeholder.svg'} 
            alt={item.shop_products.name}
            className="w-full h-full object-cover"
            onError={handleImageError}
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
  );
};

export default CartItem;
