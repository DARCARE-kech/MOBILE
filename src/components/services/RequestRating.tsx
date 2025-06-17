
import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface RequestRatingProps {
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
  existingRating?: {
    rating: number;
    comment?: string | null;
    created_at?: string | null;
  } | null;
}

const RequestRating: React.FC<RequestRatingProps> = ({ 
  onSubmit,
  isSubmitting = false,
  existingRating = null 
}) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  console.log("⭐ RequestRating component props:", { existingRating, isSubmitting });

  // If there's an existing rating, show it (read-only)
  if (existingRating) {
    console.log("✅ Showing existing rating in read-only mode:", existingRating);
    return (
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`${value <= existingRating.rating 
                  ? 'fill-darcare-gold text-darcare-gold' 
                  : 'text-darcare-gold/40'
                } w-4 h-4 sm:w-5 sm:h-5`}
              />
            ))}
          </div>
          <span className="text-darcare-white ml-2 text-sm sm:text-base">
            {existingRating.rating}/5
          </span>
        </div>
        
        {existingRating.comment && (
          <div className="mt-2 sm:mt-3">
            <p className="text-darcare-beige/80 text-xs sm:text-sm mb-1">{t('services.yourComment')}:</p>
            <p className="text-darcare-beige bg-darcare-navy/40 p-2 sm:p-3 rounded-md text-xs sm:text-sm">
              {existingRating.comment}
            </p>
          </div>
        )}
        
        {existingRating.created_at && (
          <p className="text-darcare-beige/60 text-xs mt-2">
            {t('services.ratedOn')} {new Date(existingRating.created_at).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>
    );
  }

  // Show rating form if no existing rating
  console.log("📝 Showing rating form (no existing rating found)");
  return (
    <div className="space-y-3 sm:space-y-4">
      <p className="text-darcare-beige/80 mb-2 sm:mb-3 text-sm sm:text-base">
        {t('services.rateServiceQuestion')}
      </p>
      
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            className="text-darcare-gold p-1"
            onClick={() => setRating(value)}
            disabled={isSubmitting}
          >
            <Star
              className={`${value <= rating 
                ? 'fill-darcare-gold text-darcare-gold' 
                : 'text-darcare-gold/40'
              } w-6 h-6 sm:w-7 sm:h-7`}
            />
          </button>
        ))}
        <span className="text-darcare-white ml-2 text-sm sm:text-base">
          {rating > 0 ? `${rating}/5` : ''}
        </span>
      </div>
      
      <div className="mt-2 sm:mt-3">
        <Textarea
          placeholder={t('services.addCommentsPlaceholder')}
          className="resize-none bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige text-sm sm:text-base"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
          rows={3}
        />
      </div>
      
      <Button 
        className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 text-sm sm:text-base py-2 sm:py-3"
        onClick={() => onSubmit(rating, comment)}
        disabled={rating === 0 || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
            {t('common.submitting')}
          </>
        ) : (
          t('services.submitRating')
        )}
      </Button>
    </div>
  );
};

export default RequestRating;
