
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ShopProduct } from '@/types/shop';

export interface ProductsGridProps {
  searchQuery?: string;
  categoryFilter?: string;
  onAddToCart: (product: ShopProduct) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  searchQuery = '',
  categoryFilter = '',
  onAddToCart 
}) => {
  const { t } = useTranslation();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products', searchQuery, categoryFilter],
    queryFn: async () => {
      let query = supabase.from('shop_products')
    .select('*')
    .eq('active', true);
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      if (categoryFilter) {
        query = query.eq('category', categoryFilter);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data || [];
    },
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
        {searchQuery || categoryFilter
          ? t('shop.noProductsFound') 
          : t('shop.noProductsAvailable')}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product as ShopProduct}
          onAddToCart={() => onAddToCart(product as ShopProduct)}
          index={index}
        />
      ))}
    </div>
  );
};
