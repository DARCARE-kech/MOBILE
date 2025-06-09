
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Recommendation } from "@/types/recommendation";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecommendationReviewsProps {
  recommendation: Recommendation;
}

export const RecommendationReviews = ({ recommendation }: RecommendationReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          recommendation_id: recommendation.id,
          user_id: user.id,
          rating,
          comment
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      // Reset form
      setRating(5);
      setComment("");
      
      // Refresh recommendation data
      queryClient.invalidateQueries({
        queryKey: ['recommendation', recommendation.id]
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not submit review",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={isMobile ? "space-y-2" : "space-y-6"}>
      {/* Review Form */}
      <div className={`bg-darcare-navy border border-darcare-gold/20 rounded-xl ${isMobile ? "p-2 space-y-1" : "p-4 space-y-4"}`}>
        <h3 className={`text-darcare-gold font-medium ${isMobile ? "text-xs" : ""}`}>Leave a Review</h3>
        
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="text-darcare-gold"
            >
              <Star
                size={isMobile ? 14 : 24}
                className={rating >= star ? "fill-current" : ""}
              />
            </button>
          ))}
        </div>

        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className={`bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50 ${isMobile ? "text-xs h-16" : ""}`}
        />

        <Button 
          onClick={handleSubmitReview}
          disabled={isSubmitting}
          className={`w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 ${isMobile ? "text-xs h-6" : ""}`}
        >
          Submit Review
        </Button>
      </div>

      {/* Reviews List */}
      <div className={isMobile ? "space-y-1" : "space-y-4"}>
        {recommendation.reviews?.map((review) => (
          <div 
            key={review.id}
            className={`bg-darcare-navy border border-darcare-gold/20 rounded-xl ${isMobile ? "p-2 space-y-1" : "p-4 space-y-2"}`}
          >
            <div className="flex items-center gap-2">
              <Avatar className={isMobile ? "h-5 w-5" : ""}>
                <AvatarImage src={review.user_profiles?.avatar_url || undefined} />
                <AvatarFallback className={isMobile ? "text-xs" : ""}>{review.user_profiles?.full_name?.[0] || '?'}</AvatarFallback>
              </Avatar>
              <div>
                <div className={`font-medium text-darcare-white ${isMobile ? "text-xs" : ""}`}>
                  {review.user_profiles?.full_name || 'Anonymous'}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-darcare-gold">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={isMobile ? 8 : 14} className="fill-current" />
                    ))}
                  </div>
                  <span className={`text-darcare-beige ${isMobile ? "text-xs" : "text-sm"}`}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            {review.comment && (
              <p className={`text-darcare-white ${isMobile ? "text-xs" : ""}`}>{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
