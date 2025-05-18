
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface StatusNotificationProps {
  status: string | null | undefined;
  previousStatus?: string | null;
}

const StatusNotification: React.FC<StatusNotificationProps> = ({ 
  status, 
  previousStatus 
}) => {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Only show notification if status exists and is different from previous status
    // This prevents notifications on initial load and only shows them when status changes
    if (status && previousStatus && status !== previousStatus) {
      showNotificationForStatus(status);
    }
  }, [status, previousStatus]);

  const showNotificationForStatus = (currentStatus: string) => {
    switch(currentStatus.toLowerCase()) {
      case 'pending':
        toast.info(t('services.statusPending', 'Request submitted'), {
          description: t('services.statusPendingDesc', 'Awaiting confirmation from the administration.')
        });
        break;
      case 'inprogress':
        toast.info(t('services.statusInProgress', 'Request in progress'), {
          description: t('services.statusInProgressDesc', 'A staff member is currently handling your request.')
        });
        break;
      case 'completed':
        toast.success(t('services.statusCompleted', 'Request completed'), {
          description: t('services.statusCompletedDesc', 'Your request has been successfully completed.')
        });
        break;
      case 'cancelled':
        toast.error(t('services.statusCancelled', 'Request cancelled'), {
          description: t('services.statusCancelledDesc', 'This request has been cancelled.')
        });
        break;
      default:
        // No notification for unrecognized status
        break;
    }
  };

  // This component doesn't render anything, it just shows notifications
  return null;
};

export default StatusNotification;
