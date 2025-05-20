
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export const useRequestStatusNotification = (requestId: string | undefined) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Use a ref to track whether initial notification has been shown
  // This prevents showing the notification when the component first mounts
  const initialNotificationShownRef = useRef(false);
  
  // Track which notifications have been shown to prevent duplicates
  const shownNotificationsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!requestId) return;
    
    // Show notification based on status
    const showNotificationForStatus = (status: string, isInitialLoad: boolean) => {
      // If this is the initial load and we've already shown a notification, skip
      if (isInitialLoad && initialNotificationShownRef.current) return;
      
      // Create a unique notification key for this status
      const notificationKey = `${requestId}-${status}`;
      
      // If we've already shown this notification, skip
      if (shownNotificationsRef.current.has(notificationKey)) return;
      
      // Mark this notification as shown
      shownNotificationsRef.current.add(notificationKey);
      
      // For initial load, mark that we've shown the initial notification
      if (isInitialLoad) {
        initialNotificationShownRef.current = true;
      }
      
      // Only show toasts for status updates, not for initial load
      if (!isInitialLoad) {
        switch (status) {
          case 'pending':
            toast({
              title: t('notifications.requestSubmitted', 'Request Submitted'),
              description: t('notifications.awaitingConfirmation', 'Your request is awaiting confirmation'),
            });
            break;
          case 'inprogress':
            toast({
              title: t('notifications.requestInProgress', 'Request In Progress'),
              description: t('notifications.staffHandlingRequest', 'Staff is now handling your request'),
            });
            break;
          case 'completed':
            toast({
              title: t('notifications.requestCompleted', 'Request Completed'),
              description: t('notifications.requestSuccessfullyCompleted', 'Your request has been successfully completed'),
              variant: "success"
            });
            break;
          case 'cancelled':
            toast({
              title: t('notifications.requestCancelled', 'Request Cancelled'),
              description: t('notifications.requestHasBeenCancelled', 'Your request has been cancelled'),
              variant: "destructive"
            });
            break;
          default:
            break;
        }
      }
    };
    
    // Initial check of the request status
    const checkInitialStatus = async () => {
      const { data } = await supabase
        .from('service_requests')
        .select('status')
        .eq('id', requestId)
        .maybeSingle();

      if (data) {
        // For initial status check, pass true to indicate it's the initial load
        showNotificationForStatus(data.status, true);
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
            // For realtime updates, pass false since it's not the initial load
            showNotificationForStatus(payload.new.status, false);
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
