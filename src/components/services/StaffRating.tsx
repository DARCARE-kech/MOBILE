
import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface StaffRatingProps {
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
  existingRating?: {
    staff_rating: number;
    comment?: string | null;
    created_at?: string | null;
  } | null;
}

const StaffRating: React.FC<StaffRatingProps> = ({ 
  onSubmit,
  isSubmitting = false,
  existingRating = null 
}) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  if (existingRating) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={value <= existingRating.staff_rating 
                  ? 'fill-darcare-gold text-darcare-gold w-5 h-5' 
                  : 'text-darcare-gold/40 w-5 h-5'
                }
              />
            ))}
          </div>
          <span className={isDarkMode ? "text-darcare-white ml-2" : "text-foreground ml-2"}>
            {existingRating.staff_rating}/5
          </span>
        </div>
        
        {existingRating.comment && (
          <div className="mt-3">
            <p className={isDarkMode ? "text-darcare-beige/80 text-sm mb-1" : "text-foreground/80 text-sm mb-1"}>
              {t('services.yourComment', 'Your comment')}:
            </p>
            <p className={cn(
              "p-3 rounded-md",
              isDarkMode
                ? "text-darcare-beige bg-darcare-navy/40"
                : "text-foreground bg-gray-50"
            )}>
              {existingRating.comment}
            </p>
          </div>
        )}
        
        {existingRating.created_at && (
          <p className={cn(
            "text-sm mt-2",
            isDarkMode ? "text-darcare-beige/60" : "text-foreground/60"
          )}>
            {t('services.ratedOn', 'Rated on')} {new Date(existingRating.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className={cn(
        "mb-3",
        isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"
      )}>
        {t('services.rateStaffPerformance', 'How would you rate the staff performance?')}
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
              size={28}
              className={value <= rating ? 'fill-darcare-gold text-darcare-gold' : 'text-darcare-gold/40'}
            />
          </button>
        ))}
        <span className={cn(
          "ml-2",
          isDarkMode ? "text-darcare-white" : "text-foreground"
        )}>
          {rating > 0 ? `${rating}/5` : ''}
        </span>
      </div>
      
      <div className="mt-3">
        <Textarea
          placeholder={t('services.addStaffComments', 'Add any comments about the staff (optional)')}
          className={cn(
            "resize-none",
            isDarkMode
              ? "bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige"
              : "bg-white border-input text-foreground"
          )}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <Button 
        className={cn(
          "w-full",
          isDarkMode
            ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
            : "bg-darcare-deepGold text-white hover:bg-darcare-deepGold/90"
        )}
        onClick={() => onSubmit(rating, comment)}
        disabled={rating === 0 || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('services.submitting', 'Submitting...')}
          </>
        ) : (
          t('services.submitStaffRating', 'Submit Staff Rating')
        )}
      </Button>
    </div>
  );
};

export default StaffRating;
