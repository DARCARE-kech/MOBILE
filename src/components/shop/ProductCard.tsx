
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
  return (
    <Card className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden">
      <AspectRatio ratio={4/3}>
        <img 
          src={product.image_url || '/placeholder.svg'} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      <CardContent className="p-4">
        <div className="flex justify-between mb-2">
          <h3 className="text-darcare-white text-lg font-semibold">
            {product.name}
          </h3>
          <span className="text-darcare-gold font-medium">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-darcare-beige text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-end">
          <IconButton
            icon={<Plus className="w-4 h-4" />}
            variant="primary"
            size="sm"
            onClick={() => onAddToCart(product)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
