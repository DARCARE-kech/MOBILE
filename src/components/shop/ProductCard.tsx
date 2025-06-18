
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import IconButton from '@/components/services/IconButton';
import { Plus } from 'lucide-react';
import type { ShopProduct } from '@/integrations/supabase/rpc';
import { useTranslation } from 'react-i18next';
import { getFallbackImage, optimizeImageForMobile } from '@/utils/imageUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductCardProps {
  product: ShopProduct;
  onAddToCart: (product: ShopProduct) => void;
  index: number;
}

const ProductCard = ({ product, onAddToCart, index }: ProductCardProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Optimiser l'image principale et le fallback pour mobile
  const optimizedImageUrl = optimizeImageForMobile(product.image_url, {
    width: 300,
    fit: 'cover',
    quality: 75,
    format: 'webp'
  });
  
  const fallbackImageUrl = getFallbackImage(product.name, index);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Card className="bg-darcare-navy border border-darcare-gold/20 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="relative w-full aspect-[16/9]">
        {/* Placeholder pendant le chargement */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-darcare-navy/50 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-darcare-gold/30 border-t-darcare-gold rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          src={imageError ? fallbackImageUrl : optimizedImageUrl || fallbackImageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
          fetchPriority={index < 4 ? "high" : "auto"}
        />
      </div>
      
      <CardContent className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-darcare-white text-sm font-serif font-semibold leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-darcare-beige text-xs line-clamp-2 mb-2">
            {product.description || t('shop.noDescription')}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-darcare-gold/10">
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
