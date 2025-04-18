
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ServiceBannerProps {
  imageUrl: string;
  altText: string;
}

const ServiceBanner: React.FC<ServiceBannerProps> = ({ imageUrl, altText }) => {
  return (
    <div className="w-full overflow-hidden rounded-b-lg">
      <AspectRatio ratio={16/9}>
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover"
        />
      </AspectRatio>
    </div>
  );
};

export default ServiceBanner;
