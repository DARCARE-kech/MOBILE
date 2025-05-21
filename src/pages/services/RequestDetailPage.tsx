import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useServiceRequestById } from '@/hooks/useServiceRequest';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import StaffRating from '@/components/services/StaffRating';
import { Button } from '@/components/ui/button';
import { useStaffRatingMutation } from '@/hooks/useStaffRatingMutation';
import RequestStatusTimeline from '@/components/services/RequestStatusTimeline';

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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className={cn(
          "h-8 w-8 animate-spin",
          isDarkMode ? "text-darcare-gold" : "text-secondary"
        )} />
      </div>
    );
  }
  
  if (error || !request) {
    return (
      <div className="p-4 text-center">
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
    );
  }
  
  return (
    <div className="container py-8">
      <h2 className={cn(
        "text-3xl font-serif mb-6",
        isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
      )}>
        {t('services.requestDetails', 'Request Details')}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Request Details */}
        <div>
          <div className="mb-4">
            <h3 className={cn(
              "text-xl font-medium mb-2",
              isDarkMode ? "text-darcare-beige" : "text-foreground"
            )}>
              {t('services.serviceDetails', 'Service Details')}
            </h3>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"
            )}>
              {t('services.serviceName', 'Service Name')}: {request.services?.name}
            </p>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"
            )}>
              {t('services.preferredTime', 'Preferred Time')}: {request.preferred_time}
            </p>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"
            )}>
              {t('services.status', 'Status')}: {request.status}
            </p>
            {request.note && (
              <p className={cn(
                "text-sm",
                isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"
              )}>
                {t('services.note', 'Note')}: {request.note}
              </p>
            )}
          </div>
          
          {/* Staff Rating Section */}
          <div className="mb-6">
            <h3 className={cn(
              "text-xl font-medium mb-2",
              isDarkMode ? "text-darcare-beige" : "text-foreground"
            )}>
              {t('services.staffRating', 'Staff Rating')}
            </h3>
            {staffId && (
              <StaffRating
                onSubmit={handleStaffRatingSubmit}
                isSubmitting={isSubmittingStaffRating}
                existingRating={existingRating ? {
                  staff_rating: existingRating.staff_rating || existingRating.rating || 0,
                  comment: existingRating.comment,
                  created_at: existingRating.created_at
                } : null}
              />
            )}
          </div>
        </div>
        
        {/* Request Timeline */}
        <div>
          <RequestStatusTimeline statusHistory={request.status_history || []} currentStatus={request.status || 'pending'} />
        </div>
      </div>
      
      <Button onClick={() => navigate('/services/requests')}>
        {t('common.backToRequests', 'Back to My Requests')}
      </Button>
    </div>
  );
};

export default RequestDetailPage;
