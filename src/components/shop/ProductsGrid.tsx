
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ShopProduct } from '@/types/shop';

export interface ProductsGridProps {
  searchQuery?: string;
  onAddToCart: (productId: string, quantity: number) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  searchQuery = '',
  onAddToCart 
}) => {
  const { t } = useTranslation();
  
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products', searchQuery],
    queryFn: async () => {
      let query = supabase.from('shop_products').select('*');
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
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
        {searchQuery 
          ? t('shop.noProductsFound') 
          : t('shop.noProductsAvailable')}
      </div>
    );
  }

  // Create a wrapper function to adapt between different function signatures
  const handleAddToCart = (product: ShopProduct) => {
    onAddToCart(product.id, 1);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product as ShopProduct}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
};
