import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import MainHeader from "@/components/MainHeader";
import RequestDetailHeader from "@/components/services/RequestDetailHeader";
import RequestActions from "@/components/services/RequestActions";
import RequestRating from "@/components/services/RequestRating";
import RequestDetailsContent from "@/components/services/RequestDetailsContent";
import RequestNotFound from "@/components/services/RequestNotFound";
import { useUnifiedRequestById } from "@/hooks/useUnifiedRequestById";
import { useRequestMutations } from "@/hooks/useRequestMutations";
import BottomNavigation from "@/components/BottomNavigation";
import { useTranslation } from "react-i18next";
import { useRequestStatusNotification } from "@/hooks/useRequestStatusNotification";
import { shouldShowRequestActions } from "@/utils/reservationUtils";

const RequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Initialize the status notification hook
  useRequestStatusNotification(id);
  
  const { data: request, isLoading } = useUnifiedRequestById(id);
  const { 
    submitRating, 
    isSubmittingRating, 
    cancelRequest, 
    isCancelling 
  } = useRequestMutations(id || '');
  
  // Function to get space translation key
  const getSpaceTranslationKey = (spaceName: string): string | null => {
    const spaceMapping: Record<string, string> = {
      'Kids Club': 'spaces.kidsClub',
      'Gym': 'spaces.gym',
      'Pool': 'spaces.pool',
      'Spa': 'spaces.spa',
      'Restaurant': 'spaces.restaurant',
      'Meeting Room': 'spaces.meetingRoom',
      'Fitness Suite': 'spaces.fitnessSuite',
      'Padel Court': 'spaces.padelCourt',
      'Game Room': 'spaces.gameRoom',
      'Cinema': 'spaces.cinema',
      'Library': 'spaces.library',
      'Terrace': 'spaces.terrace',
      'Garden': 'spaces.garden',
      'Conference Room': 'spaces.conferenceRoom',
      'Business Center': 'spaces.businessCenter'
    };
    
    return spaceMapping[spaceName] || null;
  };
  
  // Function to translate space name
  const translateSpaceName = (spaceName: string): string => {
    const translationKey = getSpaceTranslationKey(spaceName);
    if (translationKey) {
      const translated = t(translationKey);
      // If translation returns the key (not found), use original name
      return translated === translationKey ? spaceName : translated;
    }
    return spaceName;
  };
  
  // Function to get the appropriate page title
  const getPageTitle = () => {
    if (!request) return t('services.requestDetails', 'Request Details');
    
    if (request.type === 'space' && request.name) {
      return translateSpaceName(request.name);
    }
    
    return t('services.requestDetails', 'Request Details');
  };
  
  if (isLoading) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <MainHeader 
          title={t('services.requestDetails', 'Request Details')} 
          showBack={true}
          onBack={() => navigate('/services', { state: { activeTab: 'requests' } })} 
          rightContent={<div />}
        />
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
        <MainHeader 
          title={t('services.requestDetails', 'Request Details')} 
          showBack={true}
          onBack={() => navigate('/services', { state: { activeTab: 'requests' } })} 
          rightContent={<div />}
        />
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
  
  // Use the new utility function to determine if actions should be shown
  const canModify = shouldShowRequestActions(
    request.type,
    request.status,
    request.preferred_time
  );
  
  // New logic for canModify based on request type
  // For services: visible except if in_progress, completed, or cancelled
  // For spaces: visible only if pending
  // canModify = request.status !== 'in_progress' && 
  //             request.status !== 'completed' && 
  //             request.status !== 'cancelled';
  
  const existingRating = request.service_ratings && request.service_ratings.length > 0 
    ? request.service_ratings[0] 
    : null;
  
  // Determine service/space name
  const itemName = request.name || t('services.clubAccess', 'Club Access');
  
  // Get staff name from staff_assignments if available (only for services)
  const staffName = request.type === 'service' && request.staff_assignments && 
                    request.staff_assignments.length > 0 && 
                    request.staff_assignments[0] ? 
                    request.staff_assignments[0].staff_name : null;
  
  const handleEdit = () => {
    if (request.type === 'service') {
      navigate(`/services/${request.service_id}`, {
        state: { editMode: true, requestId: request.id }
      });
    } else {
      navigate(`/spaces/${request.space_id}`, {
        state: { editMode: true, reservationId: request.id }
      });
    }
  };
  
  return (
    <div className="bg-darcare-navy min-h-screen pb-20 sm:pb-24">
      <MainHeader 
        title={getPageTitle()} 
        showBack={true}
        onBack={() => navigate(-1)} 
        rightContent={<div />}
      />
      
      <div className="p-3 sm:p-4 space-y-4 sm:space-y-6 pt-20 sm:pt-24">
        <div className="luxury-card p-3 sm:p-4">
          <RequestDetailHeader
            serviceName={itemName}
            status={request.status}
            preferredTime={request.preferred_time}
            createdAt={request.created_at}
            staffName={staffName}
            hideStatusBar={true}
          />
          
          <RequestDetailsContent
            note={request.note}
            parsedNote={parsedNote}
            imageUrl={request.image_url}
            staffAssignments={request.staff_assignments}
            selectedOptions={selectedOptions}
            preferredTime={request.preferred_time}
            createdAt={request.created_at}
            spaceId={request.space_id}
            status={request.status}
            requestType={request.type}
          />
        </div>
        
        {canModify && (
          <div className="mt-3 sm:mt-4">
            <RequestActions
              onEdit={handleEdit}
              onCancel={() => cancelRequest()}
              isSubmitting={isCancelling}
              requestType={request.type}
              requestStatus={request.status}
              preferredTime={request.preferred_time}
            />
          </div>
        )}
        
        {isCompleted && request.type === 'service' && (
          <div className="luxury-card p-3 sm:p-4">
            <h3 className="text-darcare-gold font-serif text-base sm:text-lg mb-3 sm:mb-4">{t('services.serviceRating', 'Service Rating')}</h3>
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
