
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
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products', selectedCategory, searchQuery],
    queryFn: async () => {
      let { data, error } = await supabase
        .from('shop_products')
        .select('*')
        .then(query => {
          // Apply filters conditionally after the initial query
          if (selectedCategory && selectedCategory !== 'null') {
            query = query.eq('category', selectedCategory);
          }
          
          if (searchQuery) {
            query = query.ilike('name', `%${searchQuery}%`);
          }
          
          return query.order('name');
        });
      
      if (error) throw error;
      return (data || []) as ShopProduct[];
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
