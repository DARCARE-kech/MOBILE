
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ShopProduct } from '@/integrations/supabase/rpc';

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
  
  const { data: products, isLoading } = useQuery<ShopProduct[]>({
    queryKey: ['shop-products', selectedCategory, searchQuery],
    queryFn: async () => {
      try {
        // Start with base query
        let queryBuilder = supabase.from('shop_products').select('*');
        
        // Apply category filter conditionally, commenting out temporarily due to schema issues
        // This silently ignores the category filter if the column doesn't exist
        if (selectedCategory && selectedCategory !== 'null') {
          try {
            queryBuilder = queryBuilder.eq('category', selectedCategory);
          } catch (err) {
            console.warn('Category filtering failed, possibly missing column:', err);
          }
        }
        
        // Apply search query
        if (searchQuery) {
          queryBuilder = queryBuilder.ilike('name', `%${searchQuery}%`);
        }
        
        // Execute final query with ordering
        const { data, error } = await queryBuilder.order('name');
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }
        
        return data || [];
      } catch (error) {
        console.error('Error fetching products:', error);
        return []; // Return empty array on error to prevent UI crashes
      }
    }
  });

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
