
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { getFallbackImage } from '@/utils/imageUtils';

interface ServiceBannerProps {
  imageUrl: string;
  altText: string;
  withGradient?: boolean;
}

const ServiceBanner: React.FC<ServiceBannerProps> = ({ 
  imageUrl, 
  altText,
  withGradient = false 
}) => {
  return (
    <div className="w-full overflow-hidden rounded-lg relative">
      <AspectRatio ratio={16/9}>
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackImage(altText, 0);
          }}
        />
        {withGradient && (
          <div 
            className="absolute inset-0 bg-gradient-to-t from-darcare-navy/90 to-transparent"
            aria-hidden="true"
          />
        )}
      </AspectRatio>
    </div>
  );
};

export default ServiceBanner;
