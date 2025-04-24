
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useShopCart } from '@/hooks/useShopCart';
import { ProductsGrid } from '@/components/shop/ProductsGrid';
import ShopFilters from '@/components/shop/ShopFilters';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';
import type { ShopProduct } from '@/integrations/supabase/rpc';

const ShopService = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useShopCart();
  const { t } = useTranslation();
  
  // Fetch all products to extract categories
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_products')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });
  
  // Extract unique categories from products
  const categories = React.useMemo(() => {
    if (!products) return [];
    const uniqueCategories = new Set<string>();
    
    products.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    
    return Array.from(uniqueCategories);
  }, [products]);

  // Create a wrapper function to adapt between different function signatures
  const handleAddToCart = (productId: string, quantity: number) => {
    // Find the product by ID
    const product = products?.find(p => p.id === productId);
    if (product) {
      addToCart(product as ShopProduct);
    }
  };

  return (
    <div className="min-h-screen bg-darcare-navy pb-20">
      <MainHeader 
        title={t('shop.title')} 
        onBack={() => navigate('/services')} 
      />
      
      <div className="pt-16 pb-24">
        <ShopFilters 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onSearchChange={setSearchQuery}
          categories={categories}
        />
        
        <ProductsGrid
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart}
        />
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ShopService;
