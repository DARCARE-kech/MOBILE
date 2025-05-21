
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServiceRequestById } from '@/hooks/services/useServiceRequestById';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import StaffRating from '@/components/services/StaffRating';
import { Button } from '@/components/ui/button';
import { useStaffRatingMutation } from '@/hooks/useStaffRatingMutation';
import RequestStatusTimeline from '@/components/services/RequestStatusTimeline';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import RequestDetailsContent from '@/components/services/RequestDetailsContent';
import RequestDetailHeader from '@/components/services/RequestDetailHeader';

const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [isSubmittingStaffRating, setIsSubmittingStaffRating] = useState(false);
  
  const { data: request, isLoading, error } = useServiceRequestById(id);
  
  const staffId = request?.staff_assignments?.[0]?.staff_id;
  const existingRating = request?.service_ratings?.find(
    (rating) => rating.staff_id === staffId
  );
  
  const { mutate: submitStaffRating } = useStaffRatingMutation(id || '', staffId);
  
  const handleStaffRatingSubmit = async (rating: number, comment: string) => {
    setIsSubmittingStaffRating(true);
    try {
      await submitStaffRating({ rating, comment });
    } finally {
      setIsSubmittingStaffRating(false);
    }
  };
  
  // Check if this request is completed and has staff assigned for showing the rating component
  const showStaffRating = request?.status === 'completed' && !!staffId;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader title={t('services.requestDetails', 'Request Details')} onBack={() => navigate('/services/requests')} />
        <div className="flex justify-center items-center py-24">
          <Loader2 className={cn(
            "h-8 w-8 animate-spin",
            isDarkMode ? "text-darcare-gold" : "text-secondary"
          )} />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  if (error || !request) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader title={t('services.requestDetails', 'Request Details')} onBack={() => navigate('/services/requests')} />
        <div className="p-4 text-center py-24">
          <AlertTriangle className="mx-auto h-10 w-10 text-red-500 mb-4" />
          <p className="text-lg font-medium mb-2">
            {t('common.error', "Error")}
          </p>
          <p className={cn(
            "mb-4",
            isDarkMode ? "text-darcare-beige/60" : "text-foreground/60"
          )}>
            {t('common.fetchDataError', "Could not fetch request details. Please try again.")}
          </p>
          <Button onClick={() => navigate('/services/requests')}>
            {t('common.backToRequests', "Back to My Requests")}
          </Button>
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }

  const serviceName = request.services?.name || '';
  
  // Convert the selected_options from Json to Record<string, any> or default to empty object
  const selectedOptions = request.selected_options 
    ? (typeof request.selected_options === 'string' 
        ? JSON.parse(request.selected_options) 
        : request.selected_options)
    : null;
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <MainHeader 
        title={t('services.requestDetails', 'Request Details')} 
        onBack={() => navigate('/services/requests')} 
      />
      
      <div className="pt-20 px-4 pb-4">
        <RequestDetailHeader
          serviceName={serviceName}
          status={request.status}
          preferredTime={request.preferred_time}
          createdAt={request.created_at}
        />
        
        {/* Request Timeline */}
        <div className="mt-6 mb-8">
          <RequestStatusTimeline 
            statusHistory={request.status_history || []} 
            currentStatus={request.status || 'pending'} 
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Request Details Content */}
          <RequestDetailsContent 
            note={request.note}
            parsedNote={typeof request.note === 'string' && request.note.startsWith('{') ? 
              JSON.parse(request.note) : null}
            imageUrl={request.image_url}
            staffAssignments={request.staff_assignments}
            selectedOptions={selectedOptions}
            preferredTime={request.preferred_time}
            createdAt={request.created_at}
            spaceId={request.space_id}
          />
          
          {/* Staff Rating Section - Only show if completed and staff assigned */}
          {showStaffRating && (
            <div className={cn(
              "mt-6 pt-4 border-t",
              isDarkMode ? "border-darcare-gold/20" : "border-primary/10"
            )}>
              <h3 className={cn(
                "text-lg mb-4 font-serif",
                isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
              )}>
                {t('services.staffRating', 'Staff Rating')}
              </h3>
              <StaffRating
                onSubmit={handleStaffRatingSubmit}
                isSubmitting={isSubmittingStaffRating}
                existingRating={existingRating ? {
                  staff_rating: existingRating.staff_rating || existingRating.rating || 0,
                  comment: existingRating.comment,
                  created_at: existingRating.created_at
                } : null}
              />
            </div>
          )}
        </div>
        
        <div className="mt-8 pb-4">
          <Button 
            onClick={() => navigate('/services/requests')}
            className={cn(
              isDarkMode 
                ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {t('common.backToRequests', 'Back to My Requests')}
          </Button>
        </div>
      </div>
      
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default RequestDetailPage;
