
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { getFallbackImage } from '@/utils/imageUtils';
import type { ShopCartItem } from '@/types/shop';
import { useShopCart } from '@/hooks/useShopCart';

interface CartItemProps {
  item: ShopCartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const { removeFromCart, updateCartItemQuantity } = useShopCart();

  // Handle image error fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.svg';
  };

  // Safely access shop_products data
  const productName = item.shop_products?.name || 'Product Unavailable';
  const productImage = item.shop_products?.image_url || '/placeholder.svg';
  
  // If product data is missing, use fallback image based on index or id
  const fallbackImage = item.id ? getFallbackImage(productName, 0) : '/placeholder.svg';

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    console.log('Updating quantity for item:', item.id, 'to:', newQuantity);
    await updateCartItemQuantity(item.id, newQuantity);
  };

  const removeItem = async () => {
    console.log('Removing item:', item.id);
    await removeFromCart(item.id);
  };

  return (
    <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-md overflow-hidden bg-darcare-beige/10">
          <img 
            src={productImage || fallbackImage} 
            alt={productName}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="text-darcare-white font-medium">
              {productName}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-darcare-gold hover:text-red-500 hover:bg-red-500/10 -mt-1 -mr-1"
              onClick={removeItem}
            >
              <Trash2 size={18} />
            </Button>
          </div>
          <p className="text-darcare-gold mt-1">
            ${item.price_at_time}
          </p>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 border-darcare-gold/30 text-darcare-gold"
                onClick={() => updateQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus size={14} />
              </Button>
              <span className="text-darcare-beige w-6 text-center">{item.quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-7 w-7 border-darcare-gold/30 text-darcare-gold"
                onClick={() => updateQuantity(item.quantity + 1)}
              >
                <Plus size={14} />
              </Button>
            </div>
            <p className="text-darcare-beige/70">
              Subtotal: ${(item.price_at_time * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
