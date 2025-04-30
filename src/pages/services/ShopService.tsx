
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopCart } from '@/hooks/useShopCart';
import { ProductsGrid } from '@/components/shop/ProductsGrid';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, ArrowRight } from 'lucide-react';
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

  // Query to get cart items count - Fixed to count total number of items
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
      const { data: items, error } = await supabase
        .from('shop_order_items')
        .select('quantity')
        .eq('order_id', order.id);
      
      if (error) {
        console.error('Error fetching cart count:', error);
        return 0;
      }
      
      // Calculate total quantity from all items
      const totalQuantity = items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      
      return totalQuantity;
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

  const handleAddToCart = async (product: ShopProduct) => {
    await addToCart(product);
  };

  return (
    <div className="min-h-screen bg-darcare-navy pb-20 relative">
      <MainHeader 
        title={t('services.shop')} 
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
      
      {cartItemsCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4 z-40">
          <Button 
            className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 font-medium py-6 px-8 rounded-full shadow-lg flex items-center gap-2"
            onClick={() => navigate('/services/cart')}
          >
            Go to Cart
            <ArrowRight size={18} />
          </Button>
        </div>
      )}
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ShopService;
