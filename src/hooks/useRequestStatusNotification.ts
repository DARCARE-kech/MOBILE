
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useRequestStatusNotification = (requestId: string | undefined) => {
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    if (!requestId) return;

    // Track which notifications have been shown to prevent duplicates
    const shownNotifications = new Set<string>();
    
    // Initial check of the request status
    const checkInitialStatus = async () => {
      const { data } = await supabase
        .from('service_requests')
        .select('status')
        .eq('id', requestId)
        .maybeSingle();

      if (data) {
        showNotificationForStatus(data.status);
      }
    };

    // Show notification based on status
    const showNotificationForStatus = (status: string) => {
      // If we've already shown this notification, skip
      const notificationKey = `${requestId}-${status}`;
      if (shownNotifications.has(notificationKey)) return;
      
      // Mark this notification as shown
      shownNotifications.add(notificationKey);
      
      switch (status) {
        case 'pending':
          toast({
            title: t('notifications.requestSubmitted'),
            description: t('notifications.awaitingConfirmation'),
          });
          break;
        case 'inprogress':
          toast({
            title: t('notifications.requestInProgress'),
            description: t('notifications.staffHandlingRequest'),
          });
          break;
        case 'completed':
          toast({
            title: t('notifications.requestCompleted'),
            description: t('notifications.requestSuccessfullyCompleted'),
            variant: "success"
          });
          break;
        case 'cancelled':
          toast({
            title: t('notifications.requestCancelled'),
            description: t('notifications.requestHasBeenCancelled'),
            variant: "destructive"
          });
          break;
        default:
          break;
      }
    };

    // Setup realtime subscription to listen for status changes
    const channel = supabase
      .channel(`public:service_requests:id=eq.${requestId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'service_requests',
          filter: `id=eq.${requestId}`
        },
        (payload) => {
          if (payload.new && payload.new.status !== payload.old.status) {
            showNotificationForStatus(payload.new.status);
          }
        }
      )
      .subscribe();

    // Check initial status
    checkInitialStatus();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, toast, t]);

  return null;
};
