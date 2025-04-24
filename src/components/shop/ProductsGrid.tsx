
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ShopProduct } from '@/integrations/supabase/rpc';

// Update the Product interface to match the data from Supabase
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  in_stock?: boolean; // Make this optional since it's not in the database
}

export interface ProductsGridProps {
  selectedCategory: string | null;
  searchQuery?: string;
  onAddToCart: (productId: string, quantity: number) => void;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  selectedCategory,
  searchQuery = '',
  onAddToCart 
}) => {
  const { t } = useTranslation();
  
  // Fix the type declaration for the query
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['shop-products', selectedCategory, searchQuery],
    queryFn: async () => {
      try {
        let query = supabase.from('shop_products').select('*');
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        const { data, error } = await query.order('name');
        
        if (error) throw error;
        
        // Map the database products to our Product interface
        return (data || []).map(product => ({
          ...product,
          in_stock: true // Default to true since we don't have this field in the DB
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
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
