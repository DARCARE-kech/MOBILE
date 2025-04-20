
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getStaffAssignmentsForRequest, getServiceRatingsForRequest } from "@/integrations/supabase/rpc";
import MainHeader from "@/components/MainHeader";
import { Loader2, Calendar, Clock, PenLine, Star, CheckCircle, X, AlertTriangle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { RatingStars } from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  
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
  const { data: staffAssignments, isLoading: isLoadingStaff } = useQuery({
    queryKey: ['staff-assignments', id],
    queryFn: async () => {
      if (!id) return [];
      return getStaffAssignmentsForRequest(id);
    },
    enabled: !!id
  });
  
  // Fetch service ratings
  const { data: serviceRatings, isLoading: isLoadingRatings } = useQuery({
    queryKey: ['service-ratings', id],
    queryFn: async () => {
      if (!id) return [];
      return getServiceRatingsForRequest(id);
    },
    enabled: !!id
  });
  
  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: async () => {
      if (!id || !user) throw new Error("Missing required data");
      
      const { error } = await supabase
        .from('service_ratings')
        .insert({
          request_id: id,
          user_id: user.id,
          rating,
          comment: comment.trim() ? comment : null
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
      
      setRating(0);
      setComment("");
    },
    onError: (error) => {
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
      
      setIsCancelDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error cancelling request",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    }
  });
  
  const handleSubmitRating = () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }
    
    submitRatingMutation.mutate();
  };
  
  const handleCancelRequest = () => {
    cancelRequestMutation.mutate();
  };
  
  const handleEditRequest = () => {
    // Navigate to edit page with the request id
    // For now just navigate to the service page
    if (request?.service_id) {
      navigate(`/services/${request.service_id}`);
    }
  };
  
  if (isLoadingRequest || isLoadingStaff || isLoadingRatings) {
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
  
  const serviceType = request.services?.category || 'General';
  const hasStaffAssigned = staffAssignments && staffAssignments.length > 0;
  const isCompleted = request.status === 'completed';
  const isCancelled = request.status === 'cancelled';
  const canModify = !isCompleted && !isCancelled;
  const existingRating = serviceRatings && serviceRatings.length > 0 ? serviceRatings[0] : null;
  
  return (
    <div className="bg-darcare-navy min-h-screen pb-20">
      <MainHeader title="Request Details" onBack={() => navigate(-1)} />
      
      <div className="p-4">
        {/* Service details section */}
        <div className="luxury-card">
          <div className="flex justify-between items-start mb-3">
            <h2 className="font-serif text-darcare-gold text-xl">{request.services?.name}</h2>
            <StatusBadge status={request.status} />
          </div>
          
          <div className="space-y-4">
            {/* Date and time */}
            <div className="flex items-center gap-3 text-darcare-beige/80">
              <Calendar className="h-5 w-5 text-darcare-gold" />
              <div>
                <p>Requested for: {request.preferred_time ? format(new Date(request.preferred_time), "PPP") : 'Not specified'}</p>
                <p className="text-sm text-darcare-beige/60">
                  Submitted on: {format(new Date(request.created_at || ''), "PPP")}
                </p>
              </div>
            </div>
            
            {/* Time */}
            {request.preferred_time && (
              <div className="flex items-center gap-3 text-darcare-beige/80">
                <Clock className="h-5 w-5 text-darcare-gold" />
                <p>{format(new Date(request.preferred_time), "p")}</p>
              </div>
            )}
            
            {/* Service Type */}
            <div className="flex items-center gap-3 text-darcare-beige/80">
              <CheckCircle className="h-5 w-5 text-darcare-gold" />
              <p>Service Type: {serviceType}</p>
            </div>
            
            {/* Staff assigned */}
            {hasStaffAssigned && (
              <div className="flex items-center gap-3 text-darcare-beige/80">
                <PenLine className="h-5 w-5 text-darcare-gold" />
                <p>Staff: {staffAssignments[0].staff_name || 'Assigned'}</p>
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
              <div className="mt-4">
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
        </div>
        
        {/* Action buttons for non-completed, non-cancelled requests */}
        {canModify && (
          <div className="mt-4 flex gap-3">
            <Button 
              className="flex-1 bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
              onClick={handleEditRequest}
            >
              <PenLine className="mr-2 h-4 w-4" />
              Modify
            </Button>
            
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 border-darcare-gold/50 text-darcare-gold hover:bg-darcare-gold/10"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-darcare-navy border-darcare-gold/20">
                <DialogHeader>
                  <DialogTitle className="text-darcare-gold">Cancel Service Request</DialogTitle>
                  <DialogDescription className="text-darcare-beige/80">
                    Are you sure you want to cancel this service request? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                
                <DialogFooter className="mt-4">
                  <Button 
                    variant="outline" 
                    className="border-darcare-gold/50 text-darcare-gold hover:bg-darcare-gold/10"
                    onClick={() => setIsCancelDialogOpen(false)}
                  >
                    Keep Request
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleCancelRequest}
                  >
                    Yes, Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        
        {/* Rating section for completed requests */}
        {isCompleted && (
          <div className="mt-6 luxury-card">
            <h3 className="text-darcare-gold font-serif text-lg mb-4">Service Rating</h3>
            
            {existingRating ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <RatingStars rating={existingRating.rating} size={20} />
                  <span className="text-darcare-white ml-2">{existingRating.rating}/5</span>
                </div>
                
                {existingRating.comment && (
                  <div className="mt-3">
                    <p className="text-darcare-beige/80 text-sm mb-1">Your comment:</p>
                    <p className="text-darcare-beige bg-darcare-navy/40 p-3 rounded-md">{existingRating.comment}</p>
                  </div>
                )}
                
                <p className="text-darcare-beige/60 text-sm mt-2">
                  Rated on {format(new Date(existingRating.created_at || ''), "PPP")}
                </p>
              </div>
            ) : (
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
                  />
                </div>
                
                <Button 
                  className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
                  onClick={handleSubmitRating}
                  disabled={rating === 0 || submitRatingMutation.isPending}
                >
                  {submitRatingMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Rating'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetailPage;
