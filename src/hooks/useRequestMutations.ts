
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRequestMutations = (requestId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitRatingMutation = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      const { error } = await supabase
        .from('service_ratings')
        .insert({
          request_id: requestId,
          rating,
          comment: comment.trim() || null
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback",
      });
      
      queryClient.invalidateQueries({
        queryKey: ['service-request', requestId],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting rating",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  });
  
  const cancelRequestMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: 'cancelled' })
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Request cancelled",
        description: "Your service request has been cancelled",
      });
      
      queryClient.invalidateQueries({
        queryKey: ['service-request', requestId],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error cancelling request",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  });

  return {
    // Wrap the mutation function to match the expected signature
    submitRating: (rating: number, comment: string) => 
      submitRatingMutation.mutate({ rating, comment }),
    isSubmittingRating: submitRatingMutation.isPending,
    cancelRequest: cancelRequestMutation.mutate,
    isCancelling: cancelRequestMutation.isPending
  };
};
