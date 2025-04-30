
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import RequestDetailHeader from "@/components/services/RequestDetailHeader";
import RequestActions from "@/components/services/RequestActions";
import RequestRating from "@/components/services/RequestRating";
import RequestDetailsContent from "@/components/services/RequestDetailsContent";
import RequestNotFound from "@/components/services/RequestNotFound";
import { useServiceRequestById } from "@/hooks/useServiceRequest";
import { useRequestMutations } from "@/hooks/useRequestMutations";
import BottomNavigation from "@/components/BottomNavigation";
import { useTranslation } from "react-i18next";
import { Json } from "@/integrations/supabase/types"; 

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { data: request, isLoading } = useServiceRequestById(id);
  const { 
    submitRating, 
    isSubmittingRating, 
    cancelRequest, 
    isCancelling 
  } = useRequestMutations(id || '');
  
  if (isLoading) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <MainHeader title={t('services.requestDetails', 'Request Details')} onBack={() => navigate(-1)} />
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  if (!request) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <MainHeader title={t('services.requestDetails', 'Request Details')} onBack={() => navigate(-1)} />
        <RequestNotFound />
        <BottomNavigation activeTab="services" />
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
  
  // Convert selected_options to Record<string, any> with proper type checking
  const selectedOptions = (request.selected_options && 
    typeof request.selected_options === 'object' && 
    request.selected_options !== null) 
    ? request.selected_options as Record<string, any>
    : null;
  
  const isCompleted = request.status === 'completed';
  const isCancelled = request.status === 'cancelled';
  const canModify = !isCompleted && !isCancelled;
  const existingRating = request.service_ratings && request.service_ratings.length > 0 
    ? request.service_ratings[0] 
    : null;
  
  return (
    <div className="bg-darcare-navy min-h-screen pb-24">
      <MainHeader title={t('services.requestDetails', 'Request Details')} onBack={() => navigate(-1)} />
      
      <div className="p-4 space-y-6 pt-20"> {/* Ensures content is below the header */}
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
            selectedOptions={selectedOptions}
            preferredTime={request.preferred_time}
            createdAt={request.created_at}
          />
        </div>
        
        {canModify && (
          <div className="mt-4">
            <RequestActions
              onEdit={() => navigate(`/services/${request.service_id}`)}
              onCancel={() => cancelRequest()}
              isSubmitting={isCancelling}
            />
          </div>
        )}
        
        {isCompleted && (
          <div className="luxury-card">
            <h3 className="text-darcare-gold font-serif text-lg mb-4">{t('services.serviceRating', 'Service Rating')}</h3>
            <RequestRating
              onSubmit={submitRating}
              isSubmitting={isSubmittingRating}
              existingRating={existingRating}
            />
          </div>
        )}
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default RequestDetailPage;
