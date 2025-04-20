
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader";
import RequestDetailHeader from "@/components/services/RequestDetailHeader";
import RequestActions from "@/components/services/RequestActions";
import RequestRating from "@/components/services/RequestRating";
import RequestDetailsContent from "@/components/services/RequestDetailsContent";
import RequestNotFound from "@/components/services/RequestNotFound";
import { useServiceRequest } from "@/hooks/useServiceRequest";

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: request, isLoading } = useServiceRequest(id);
  
  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      const { error } = await supabase
        .from('service_ratings')
        .insert({
          request_id: id,
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
        queryKey: ['service-request', id],
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
  
  // Cancel request mutation
  const cancelRequestMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("Request ID is required");
      
      const { error } = await supabase
        .from('service_requests')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Request cancelled",
        description: "Your service request has been cancelled",
      });
      
      queryClient.invalidateQueries({
        queryKey: ['service-request', id],
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
  
  const handleSubmitRating = (rating: number, comment: string) => {
    submitRatingMutation.mutate({ rating, comment });
  };
  
  const handleCancelRequest = () => {
    cancelRequestMutation.mutate();
  };
  
  const handleEditRequest = () => {
    if (request?.service_id) {
      navigate(`/services/${request.service_id}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <MainHeader title="Request Details" onBack={() => navigate(-1)} />
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
      </div>
    );
  }
  
  if (!request) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <MainHeader title="Request Details" onBack={() => navigate(-1)} />
        <RequestNotFound />
      </div>
    );
  }
  
  // Parse request note if it's in JSON format
  let parsedNote = null;
  try {
    parsedNote = request.note ? JSON.parse(request.note) : null;
  } catch (e) {
    parsedNote = null;
  }
  
  const isCompleted = request.status === 'completed';
  const isCancelled = request.status === 'cancelled';
  const canModify = !isCompleted && !isCancelled;
  const existingRating = request.service_ratings && request.service_ratings.length > 0 
    ? request.service_ratings[0] 
    : null;
  
  return (
    <div className="bg-darcare-navy min-h-screen pb-20">
      <MainHeader title="Request Details" onBack={() => navigate(-1)} />
      
      <div className="p-4 space-y-6">
        {/* Service details section */}
        <div className="luxury-card">
          <RequestDetailHeader
            serviceName={request.services?.name || ''}
            status={request.status}
            preferredTime={request.preferred_time}
            createdAt={request.created_at}
          />
          
          <RequestDetailsContent
            note={request.note}
            parsedNote={parsedNote}
            imageUrl={request.image_url}
            staffAssignments={request.staff_assignments}
          />
        </div>
        
        {/* Action buttons for non-completed, non-cancelled requests */}
        {canModify && (
          <div className="mt-4">
            <RequestActions
              onEdit={handleEditRequest}
              onCancel={handleCancelRequest}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
        
        {/* Rating section for completed requests */}
        {isCompleted && (
          <div className="luxury-card">
            <h3 className="text-darcare-gold font-serif text-lg mb-4">Service Rating</h3>
            <RequestRating
              onSubmit={handleSubmitRating}
              isSubmitting={submitRatingMutation.isPending}
              existingRating={existingRating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetailPage;
