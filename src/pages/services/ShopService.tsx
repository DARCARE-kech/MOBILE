
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import ProductsGrid from '@/components/shop/ProductsGrid';
import { useShopCart } from '@/hooks/useShopCart';
import MainHeader from '@/components/MainHeader';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';

const ShopService = () => {
  const navigate = useNavigate();
  const { addToCart } = useShopCart();

  return (
    <div className="bg-darcare-navy min-h-screen pb-24 pt-16">
      <div className="p-4">
        <h2 className="text-darcare-gold font-serif text-2xl mb-4">Luxury Offerings</h2>
        <ProductsGrid onAddToCart={addToCart} />
      </div>
    </div>
  );
};

export default ShopService;
