import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopCart } from '@/hooks/useShopCart';
import { ProductsGrid } from '@/components/shop/ProductsGrid';
import ShopFilters from '@/components/shop/ShopFilters';
import Header from '@/components/services/space-booking/Header';
import BottomNavigation from '@/components/BottomNavigation';

const ShopService = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addToCart } = useShopCart();

  return (
    <div className="min-h-screen bg-darcare-navy pb-20">
      <Header 
        title="Shop" 
        onBack={() => navigate('/services')} 
      />
      
      <ShopFilters 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      <ProductsGrid
        selectedCategory={selectedCategory}
        onAddToCart={addToCart}
      />
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ShopService;
