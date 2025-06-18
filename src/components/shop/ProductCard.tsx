
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import IconButton from '@/components/services/IconButton';
import { Plus } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import type { ShopProduct } from '@/integrations/supabase/rpc';
import { useTranslation } from 'react-i18next';
import { getFallbackImage } from '@/utils/imageUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductCardProps {
  product: ShopProduct;
  onAddToCart: (product: ShopProduct) => void;
  index: number;
}

const ProductCard = ({ product, onAddToCart, index }: ProductCardProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  // Handle image error fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Get a relevant fallback image based on product name and index
    target.src = getFallbackImage(product.name, index);
  };

  return (
    <Card className="bg-darcare-navy border border-darcare-gold/20 rounded-xl overflow-hidden flex flex-col h-full">
  <div className="relative w-full pb-[56.25%]"> {/* Ratio 16/9 */}
    <img
      src={product.image_url || getFallbackImage(product.name, index)}
      alt={product.name}
      className="absolute top-0 left-0 w-full h-full object-cover"
      onError={handleImageError}
      loading="lazy"
    />
  </div>
  <CardContent className="p-2 flex flex-col justify-between flex-grow">
    <div>
      <h3 className="text-darcare-white text-base font-serif font-semibold leading-snug mb-1 line-clamp-1">
        {product.name}
      </h3>
      <p className="text-darcare-beige text-xs line-clamp-2 mb-2">
        {product.description || t('shop.noDescription')}
      </p>
    </div>
    <div className="flex justify-between items-center mt-auto pt-1 border-t border-darcare-gold/10">
      <span className="text-darcare-gold text-sm font-semibold">
        {product.price.toFixed(2)} MAD
      </span>
      <IconButton
        icon={<Plus className="w-4 h-4" />}
        variant="primary"
        size="sm"
        onClick={() => onAddToCart(product)}
        className="shadow hover:bg-darcare-gold/90 transition-colors flex-shrink-0"
        aria-label={t('shop.addToCart')}
      />
    </div>
  </CardContent>
</Card>

  );
};

export default ProductCard;
