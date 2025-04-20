
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { getShopProducts } from '@/integrations/supabase/rpc';
import ProductCard from './ProductCard';
import type { ShopProduct } from '@/integrations/supabase/rpc';

interface ProductsGridProps {
  onAddToCart: (product: ShopProduct) => void;
}

const ProductsGrid = ({ onAddToCart }: ProductsGridProps) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: getShopProducts
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-72">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products?.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
