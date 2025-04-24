
import React from 'react';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface SpaceInfoCardProps {
  space: {
    name: string;
    description: string;
    image_url: string;
  };
}

const SpaceInfoCard = ({ space }: SpaceInfoCardProps) => {
  return (
    <Card className="bg-darcare-navy border-darcare-gold/20 overflow-hidden">
      <AspectRatio ratio={16/9}>
        <img 
          src={space.image_url || '/placeholder.svg'}
          alt={space.name}
          className="w-full h-full object-cover"
        />
      </AspectRatio>
      
      <div className="p-4">
        <h2 className="text-darcare-gold font-serif text-xl mb-2">
          {space.name}
        </h2>
        <p className="text-darcare-beige">
          {space.description}
        </p>
      </div>
    </Card>
  );
};

export default SpaceInfoCard;
