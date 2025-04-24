
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from './ProductCard';
import { ShopProduct } from '@/types/shop';

interface ProductsGridProps {
  selectedCategory: string | null;
  onAddToCart: (product: ShopProduct) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  selectedCategory,
  onAddToCart
}) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_products')
        .select('*');
      
      if (error) throw error;
      return data as ShopProduct[];
    }
  });

  const filteredProducts = selectedCategory
    ? products?.filter(product => product.category === selectedCategory)
    : products;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="h-48 bg-darcare-navy/60 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {filteredProducts?.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => onAddToCart(product)}
        />
      ))}
    </div>
  );
};
