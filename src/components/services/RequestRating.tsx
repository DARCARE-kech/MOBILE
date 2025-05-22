
import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  const [submittedRating, setSubmittedRating] = useState<{
  rating: number;
  comment?: string;
  created_at?: string;
} | null>(null);

  isSubmitting = false,
  existingRating = null 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  if (submittedRating) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={value <= submittedRating.rating 
                ? 'fill-darcare-gold text-darcare-gold w-5 h-5' 
                : 'text-darcare-gold/40 w-5 h-5'
              }
            />
          ))}
        </div>
        <span className="text-darcare-white ml-2">{submittedRating.rating}/5</span>
      </div>

      {submittedRating.comment && (
        <div className="mt-3">
          <p className="text-darcare-beige/80 text-sm mb-1">Your comment:</p>
          <p className="text-darcare-beige bg-darcare-navy/40 p-3 rounded-md">
            {submittedRating.comment}
          </p>
        </div>
      )}

      {submittedRating.created_at && (
        <p className="text-darcare-beige/60 text-sm mt-2">
          Rated on {new Date(submittedRating.created_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

  

  if (existingRating) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={value <= existingRating.rating 
                  ? 'fill-darcare-gold text-darcare-gold w-5 h-5' 
                  : 'text-darcare-gold/40 w-5 h-5'
                }
              />
            ))}
          </div>
          <span className="text-darcare-white ml-2">{existingRating.rating}/5</span>
        </div>
        
        {existingRating.comment && (
          <div className="mt-3">
            <p className="text-darcare-beige/80 text-sm mb-1">Your comment:</p>
            <p className="text-darcare-beige bg-darcare-navy/40 p-3 rounded-md">
              {existingRating.comment}
            </p>
          </div>
        )}
        
        {existingRating.created_at && (
          <p className="text-darcare-beige/60 text-sm mt-2">
            Rated on {new Date(existingRating.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-darcare-beige/80 mb-3">
        How would you rate the service provided?
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
        <span className="text-darcare-white ml-2">{rating > 0 ? `${rating}/5` : ''}</span>
      </div>
      
      <div className="mt-3">
        <Textarea
          placeholder="Add any additional comments about the service (optional)"
          className="resize-none bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      
      <Button 
        className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
        onClick={() => {
  onSubmit(rating, comment);
  setSubmittedRating({
    rating,
    comment,
    created_at: new Date().toISOString()
  });
}}

        disabled={rating === 0 || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Rating'
        )}
      </Button>
    </div>
  );
};

export default RequestRating;
