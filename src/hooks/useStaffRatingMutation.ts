
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useStaffRatingMutation = (requestId: string, staffId: string | undefined) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      if (!staffId) {
        throw new Error("Staff ID is required to submit a rating");
      }
      
      // Check if a rating already exists
      const { data: existingRating, error: checkError } = await supabase
        .from('service_ratings')
        .select('id')
        .eq('request_id', requestId)
        .eq('staff_id', staffId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      // If rating exists, update it
      if (existingRating) {
        const { error } = await supabase
          .from('service_ratings')
          .update({
            staff_rating: rating,
            rating: rating, // Include both fields to satisfy type constraints
            comment: comment.trim() || null
          })
          .eq('id', existingRating.id);
          
        if (error) throw error;
      } else {
        // Otherwise insert a new rating
        const { error } = await supabase
          .from('service_ratings')
          .insert({
            request_id: requestId,
            staff_id: staffId,
            staff_rating: rating,
            rating: rating, // Include both fields to satisfy type constraints
            comment: comment.trim() || null
          });
          
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: t('services.ratingSubmitted', 'Staff Rating Submitted'),
        description: t('services.thankYouFeedback', 'Thank you for your feedback'),
      });
      
      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['service-request', requestId],
      });
    },
    onError: (error: any) => {
      toast({
        title: t('services.ratingError', 'Error Submitting Rating'),
        description: error.message || t('services.tryAgainLater', 'Please try again later'),
        variant: "destructive",
      });
    }
  });
};

export default useStaffRatingMutation;
