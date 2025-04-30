
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopCart } from '@/hooks/useShopCart';
import { ProductsGrid } from '@/components/shop/ProductsGrid';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ShopProduct } from '@/types/shop';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CategoryFilter from '@/components/shop/CategoryFilter';

const ShopService = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useShopCart();
  const { user } = useAuth();
  const { t } = useTranslation();

  // Query to get cart items count
  const { data: cartItemsCount = 0 } = useQuery({
    queryKey: ['cart-count'],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      // First get the cart order
      const { data: order } = await supabase
        .from('shop_orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'cart')
        .single();
      
      if (!order) return 0;
      
      // Then count the items in the cart
      const { count, error } = await supabase
        .from('shop_order_items')
        .select('*', { count: 'exact', head: true })
        .eq('order_id', order.id);
      
      if (error) {
        console.error('Error fetching cart count:', error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Refetch every 5 seconds to keep cart updated
  });

  // Query to get unique categories
  const { data: categories = [] } = useQuery({
    queryKey: ['shop-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_products')
        .select('category')
        .not('category', 'is', null)
        .order('category');
      
      if (error) throw error;
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data
        .map(item => item.category)
        .filter(Boolean))] as string[];
        
      return uniqueCategories;
    },
  });

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
        rightContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/services/cart')}
            className="relative text-darcare-beige hover:text-darcare-gold"
          >
            <ShoppingCart size={22} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-darcare-gold text-darcare-navy text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
                {cartItemsCount}
              </span>
            )}
          </Button>
        }
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
        
        <CategoryFilter 
          categories={categories} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <ProductsGrid
          searchQuery={searchQuery}
          categoryFilter={selectedCategory}
          onAddToCart={handleAddToCart}
        />
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ShopService;
