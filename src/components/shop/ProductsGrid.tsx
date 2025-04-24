
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ShopProduct } from '@/integrations/supabase/rpc';
import { toast } from '@/components/ui/use-toast';

export interface ProductsGridProps {
  selectedCategory: string | null;
  searchQuery?: string;
  onAddToCart: (product: ShopProduct) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  selectedCategory,
  searchQuery = '',
  onAddToCart 
}) => {
  const { t } = useTranslation();
  
  const { data: products, isLoading, error } = useQuery<ShopProduct[]>({
    queryKey: ['shop-products', selectedCategory, searchQuery],
    queryFn: async () => {
      try {
        let query = supabase.from('shop_products').select('*');
        
        // Only apply category filter if it exists and is not null
        if (selectedCategory && selectedCategory !== 'null' && selectedCategory !== '') {
          query = query.eq('category', selectedCategory);
        }
        
        // Apply search filter if search query exists
        if (searchQuery && searchQuery.trim() !== '') {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        const { data, error } = await query.order('name');
        
        if (error) {
          console.error('Error fetching products:', error);
          throw error;
        }
        
        return (data || []) as ShopProduct[];
      } catch (err) {
        console.error('Failed to fetch products:', err);
        toast({
          title: t('shop.errorFetching', 'Error fetching products'),
          description: t('shop.tryAgain', 'Please try again later'),
          variant: 'destructive',
        });
        return [];
      }
    },
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-40 p-4 text-red-500">
        {t('shop.errorOccurred', 'An error occurred')}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center h-40 p-4 text-darcare-beige text-lg">
        {searchQuery || selectedCategory 
          ? t('shop.noProductsFound') 
          : t('shop.noProductsAvailable')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};
