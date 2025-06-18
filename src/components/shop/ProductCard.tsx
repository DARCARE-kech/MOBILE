
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import IconButton from '@/components/services/IconButton';
import { Plus } from 'lucide-react';
import type { ShopProduct } from '@/integrations/supabase/rpc';
import { useTranslation } from 'react-i18next';
import { getFallbackImage } from '@/utils/imageUtils';
import { optimizeImageForMobile } from '@/utils/imageOptimization';

interface ProductCardProps {
  product: ShopProduct;
  onAddToCart: (product: ShopProduct) => void;
  index: number;
}

const ProductCard = ({ product, onAddToCart, index }: ProductCardProps) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Optimiser l'image principale et le fallback pour mobile
  const optimizedImageUrl = optimizeImageForMobile(product.image_url, {
    width: 300,
    height: 300,
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
      <div className="relative w-full aspect-square">
        {/* Placeholder pendant le chargement */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-darcare-navy/50 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-darcare-gold/30 border-t-darcare-gold rounded-full animate-spin"></div>
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
      
      <CardContent className="p-2 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-darcare-white text-xs font-serif font-semibold leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-darcare-beige text-[10px] line-clamp-2 mb-2">
            {product.description || t('shop.noDescription')}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-1 border-t border-darcare-gold/10">
          <span className="text-darcare-gold text-xs font-semibold">
            {product.price.toFixed(2)} MAD
          </span>
          <IconButton
            icon={<Plus className="w-3 h-3" />}
            variant="primary"
            size="sm"
            onClick={() => onAddToCart(product)}
            className="shadow hover:bg-darcare-gold/90 transition-colors flex-shrink-0 h-6 w-6"
            aria-label={t('shop.addToCart')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
