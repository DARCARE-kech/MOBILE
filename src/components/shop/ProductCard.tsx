
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import IconButton from '@/components/services/IconButton';
import { Plus } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { ShopProduct } from '@/integrations/supabase/rpc';
import { useTranslation } from 'react-i18next';
import { getFallbackImage } from '@/utils/imageUtils';

interface ProductCardProps {
  product: ShopProduct;
  onAddToCart: (product: ShopProduct) => void;
  index: number;
}

const ProductCard = ({ product, onAddToCart, index }: ProductCardProps) => {
  const { t } = useTranslation();
  
  // Handle image error fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Get a relevant fallback image based on product name and index
    target.src = getFallbackImage(product.name, index);
  };

  return (
    <Card className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden h-full transition-transform hover:translate-y-[-2px] duration-200">
      <AspectRatio ratio={4/3}>
        <img 
          src={product.image_url || getFallbackImage(product.name, index)} 
          alt={product.name} 
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
      </AspectRatio>
      <CardContent className="p-3">
        <div className="flex justify-between mb-1.5">
          <h3 className="text-darcare-white text-lg font-serif font-medium line-clamp-1">
            {product.name}
          </h3>
          <span className="text-darcare-gold font-medium ml-2 whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-darcare-beige text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description || t('shop.noDescription')}
        </p>
        <div className="flex justify-end">
          <IconButton
            icon={<Plus className="w-3.5 h-3.5" />}
            variant="primary"
            size="sm"
            onClick={() => onAddToCart(product)}
            className="shadow-md hover:bg-darcare-gold/90 transition-colors"
            aria-label={t('shop.addToCart')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
