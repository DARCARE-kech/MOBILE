
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader";
import RequestDetailHeader from "@/components/services/RequestDetailHeader";
import RequestActions from "@/components/services/RequestActions";
import RequestRating from "@/components/services/RequestRating";
import { getStaffAssignmentsForRequest, getServiceRatingsForRequest } from "@/integrations/supabase/rpc";

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch request data
  const { data: request, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['service-request', id],
    queryFn: async () => {
      if (!id) throw new Error("Request ID is required");
      
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });
  
  // Fetch staff assignments
  const { data: staffAssignments } = useQuery({
    queryKey: ['staff-assignments', id],
    queryFn: async () => {
      if (!id) return [];
      return getStaffAssignmentsForRequest(id);
    },
    enabled: !!id
  });
  
  // Fetch service ratings
  const { data: serviceRatings } = useQuery({
    queryKey: ['service-ratings', id],
    queryFn: async () => {
      if (!id) return [];
      return getServiceRatingsForRequest(id);
    },
    enabled: !!id
  });
  
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
        queryKey: ['service-ratings', id],
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
  
  if (isLoadingRequest) {
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
        <div className="p-4 text-center text-darcare-beige">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-darcare-gold" />
          <h2 className="text-xl font-medium text-darcare-white mb-2">Request Not Found</h2>
          <p>The requested service request could not be found or has been deleted.</p>
          <Button 
            className="mt-8 bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
            onClick={() => navigate('/services')}
          >
            Back to Services
          </Button>
        </div>
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
  
  const hasStaffAssigned = staffAssignments && staffAssignments.length > 0;
  const isCompleted = request.status === 'completed';
  const isCancelled = request.status === 'cancelled';
  const canModify = !isCompleted && !isCancelled;
  const existingRating = serviceRatings && serviceRatings.length > 0 ? serviceRatings[0] : null;
  
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
          
          {/* Staff assigned */}
          {hasStaffAssigned && (
            <div className="mt-4 pt-4 border-t border-darcare-gold/10">
              <h3 className="text-darcare-white font-medium mb-2">Assigned Staff</h3>
              <p className="text-darcare-beige">{staffAssignments[0].staff_name || 'Assigned'}</p>
            </div>
          )}
          
          {/* Notes section */}
          {(request.note || parsedNote) && (
            <div className="mt-4 pt-4 border-t border-darcare-gold/10">
              <h3 className="text-darcare-white font-medium mb-2">Request Details</h3>
              
              {/* If note is JSON, display structured data */}
              {parsedNote && (
                <div className="space-y-2 text-darcare-beige/80">
                  {parsedNote.cleaningType && (
                    <p>Cleaning Type: <span className="text-darcare-beige">{parsedNote.cleaningType}</span></p>
                  )}
                  {parsedNote.frequency && (
                    <p>Frequency: <span className="text-darcare-beige">{parsedNote.frequency}</span></p>
                  )}
                  {parsedNote.rooms && parsedNote.rooms.length > 0 && (
                    <p>Selected Rooms: <span className="text-darcare-beige">{parsedNote.rooms.join(', ')}</span></p>
                  )}
                  {parsedNote.notes && (
                    <div>
                      <p className="mb-1">Additional Notes:</p>
                      <p className="text-darcare-beige bg-darcare-navy/40 p-2 rounded-md">{parsedNote.notes}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* If note is not JSON, display as text */}
              {!parsedNote && request.note && (
                <p className="text-darcare-beige/80 bg-darcare-navy/40 p-3 rounded-md">{request.note}</p>
              )}
            </div>
          )}
          
          {/* Image preview if available */}
          {request.image_url && (
            <div className="mt-4 pt-4 border-t border-darcare-gold/10">
              <h3 className="text-darcare-white font-medium mb-2">Image</h3>
              <div className="rounded-md overflow-hidden">
                <img 
                  src={request.image_url} 
                  alt="Request attachment" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}
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
