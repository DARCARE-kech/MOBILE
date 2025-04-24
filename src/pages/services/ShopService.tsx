
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopCart } from '@/hooks/useShopCart';
import { ProductsGrid } from '@/components/shop/ProductsGrid';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ShopProduct } from '@/types/shop';

const ShopService = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useShopCart();
  const { t } = useTranslation();

  // Create a wrapper function to adapt between different function signatures
  const handleAddToCart = (productId: string, quantity: number) => {
    // Find the product by ID from the query cache and add it to cart
    addToCart({ id: productId } as ShopProduct);
  };

  return (
    <div className="min-h-screen bg-darcare-navy pb-20">
      <MainHeader 
        title={t('shop.title')} 
        onBack={() => navigate('/services')} 
      />
      
      <div className="pt-16 pb-24">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-darcare-beige/50" />
            <Input
              placeholder={t('shop.searchProducts')}
              className="pl-9 bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <ProductsGrid
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart}
        />
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ShopService;
