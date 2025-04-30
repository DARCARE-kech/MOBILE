
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import IconButton from '@/components/services/IconButton';
import { Plus } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { ShopProduct } from '@/integrations/supabase/rpc';

interface ProductCardProps {
  product: ShopProduct;
  onAddToCart: (product: ShopProduct) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // Handle image error fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.svg';
  };

  return (
    <Card className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden h-full">
      <AspectRatio ratio={4/3}>
        <img 
          src={product.image_url || '/placeholder.svg'} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </AspectRatio>
      <CardContent className="p-3">
        <div className="flex justify-between mb-1.5">
          <h3 className="text-darcare-white text-lg font-serif font-medium">
            {product.name}
          </h3>
          <span className="text-darcare-gold font-medium">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-darcare-beige text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-end">
          <IconButton
            icon={<Plus className="w-3.5 h-3.5" />}
            variant="primary"
            size="xs"
            onClick={() => onAddToCart(product)}
            className="shadow-md"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
