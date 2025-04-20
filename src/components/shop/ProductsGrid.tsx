
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
  const { data: products, isLoading, error } = useQuery({
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

  if (error || !products || products.length === 0) {
    return (
      <div className="text-center py-10 text-darcare-beige">
        <p>No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

export default ProductsGrid;

