
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  size?: number;
}

export const RatingStars = ({ rating, size = 14 }: RatingStarsProps) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={size}
          className={index < Math.round(rating) ? 'fill-darcare-gold text-darcare-gold' : 'text-darcare-gold/30'}
        />
      ))}
    </div>
  );
};
