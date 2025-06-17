
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRequestMutations = (requestId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitRatingMutation = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      // Ensure user_id is set automatically by the trigger, but we can also set it explicitly
      const { error } = await supabase
        .from('service_ratings')
        .insert({
          request_id: requestId,
          rating,
          comment: comment.trim() || null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });
      
      if (error) {
        // Handle unique constraint violation specifically
        if (error.code === '23505' && error.message.includes('unique_user_request_rating')) {
          throw new Error('Vous avez déjà soumis une note pour cette demande');
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Note soumise",
        description: "Merci pour votre retour",
      });
      
      // Invalidate both unified queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['unified-request', requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ['service-request', requestId],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de la soumission",
        description: error.message || "Veuillez réessayer plus tard",
        variant: "destructive",
      });
    }
  });
  
  const cancelRequestMutation = useMutation({
    mutationFn: async () => {
      // First, determine if this is a service request or space reservation
      // Try service_requests first
      const { data: serviceRequest } = await supabase
        .from('service_requests')
        .select('id')
        .eq('id', requestId)
        .single();
      
      if (serviceRequest) {
        // It's a service request
        const { error } = await supabase
          .from('service_requests')
          .update({ status: 'cancelled' })
          .eq('id', requestId);
        
        if (error) throw error;
        return { type: 'service' };
      } else {
        // It's a space reservation
        const { error } = await supabase
          .from('space_reservations')
          .update({ status: 'cancelled' })
          .eq('id', requestId);
        
        if (error) throw error;
        return { type: 'space' };
      }
    },
    onSuccess: (result) => {
      const message = result?.type === 'space' 
        ? "Réservation d'espace annulée"
        : "Demande de service annulée";
      
      const description = result?.type === 'space'
        ? "Votre réservation d'espace a été annulée"
        : "Votre demande de service a été annulée";
      
      toast({
        title: message,
        description: description,
      });
      
      // Invalidate unified queries instead of specific ones
      queryClient.invalidateQueries({
        queryKey: ['unified-request', requestId],
      });
      queryClient.invalidateQueries({
        queryKey: ['unified-requests'],
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur lors de l'annulation",
        description: error.message || "Veuillez réessayer plus tard",
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
