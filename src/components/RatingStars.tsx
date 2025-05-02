
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number | "sm" | "md" | "lg";
}

export const RatingStars = ({ rating, size = 14 }: RatingStarsProps) => {
  // Convert size string to pixels if needed
  const sizeInPixels = 
    size === "sm" ? 12 : 
    size === "md" ? 16 : 
    size === "lg" ? 20 : 
    size;
    
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={sizeInPixels}
          className={index < Math.round(Number(rating)) ? 'fill-darcare-gold text-darcare-gold' : 'text-darcare-gold/30'}
        />
      ))}
    </div>
  );
};
