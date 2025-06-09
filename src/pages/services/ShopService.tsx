
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShopCart } from '@/hooks/useShopCart';
import { ProductsGrid } from '@/components/shop/ProductsGrid';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ShopProduct } from '@/types/shop';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CategoryFilter from '@/components/shop/CategoryFilter';
import FloatingAction from '@/components/FloatingAction';

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
      
      try {
        console.log('Fetching cart count for user:', user.id);
        
        // Get all cart orders (using "cart" status instead of "submitted")
        const { data: orders, error: orderError } = await supabase
          .from('shop_orders')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'cart' as const)
          .order('created_at', { ascending: false });
        
        if (orderError) {
          console.error('Error fetching cart orders:', orderError);
          return 0;
        }
        
        if (!orders || orders.length === 0) {
          console.log('No cart orders found');
          return 0;
        }
        
        // Get the most recent cart order
        const cartOrderId = orders[0].id;
        console.log('Using cart order:', cartOrderId);
        
        // Count items in this cart
        const { data: items, error } = await supabase
          .from('shop_order_items')
          .select('quantity')
          .eq('order_id', cartOrderId);
        
        if (error) {
          console.error('Error fetching cart count:', error);
          return 0;
        }
        
        // Calculate total quantity from all items
        const totalQuantity = items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
        console.log('Cart count:', totalQuantity);
        
        return totalQuantity;
      } catch (error) {
        console.error('Error in cart count query:', error);
        return 0;
      }
    },
    enabled: !!user?.id,
    refetchInterval: 2000, // Refetch every 2 seconds to keep cart updated
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
    console.log('Adding product to cart from shop:', product.name);
    await addToCart(product);
  };

  return (
    <div className="min-h-screen bg-darcare-navy pb-20 relative">
      <MainHeader 
        title={t('services.shop')} 
        onBack={() => navigate('/services')}
        showWeather={false}
        showFavorite={false}
        showNotifications={false}
        rightContent={
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/services/shop/orders')}
              className="text-darcare-beige hover:text-darcare-gold p-2"
            >
              <Package size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/services/cart')}
              className="relative text-darcare-beige hover:text-darcare-gold p-2"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-darcare-gold text-darcare-navy text-xs font-medium w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        }
      />
      
      <div className="pt-16 pb-24">
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-darcare-beige/50" />
            <Input
              placeholder={t('shop.searchProducts')}
              className="pl-9 bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50 h-10"
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
        <div className="fixed bottom-20 left-0 right-0 flex justify-center px-3 z-40">
          <Button 
            className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 font-medium py-3 px-6 rounded-full shadow-lg flex items-center gap-2 text-sm"
            onClick={() => navigate('/services/cart')}
          >
            Go to Cart ({cartItemsCount})
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
      
      <FloatingAction />
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ShopService;
