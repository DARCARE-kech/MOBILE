
import React, { useEffect } from "react";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, ChevronLeft, Star, Wrench, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { LuxuryCard } from "@/components/ui/luxury-card";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  body: string | null;
  created_at: string;
  is_read: boolean;
  category: string | null;
  type: string | null;
}

const getNotificationIcon = (category: string | null) => {
  switch (category) {
    case 'recommendation':
      return <Star className="shrink-0" />;
    case 'service':
      return <Wrench className="shrink-0" />;
    default:
      return <Bell className="shrink-0" />;
  }
};

const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    // For older dates, return a relative format (e.g., "3 days ago")
    return formatDistanceToNow(date, { addSuffix: true });
  }
};

const formatGroupDate = (date: string) => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
};

const Notifications = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      
      return data as Notification[];
    },
    enabled: !!user?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      toast({
        title: t('notifications.allMarkedAsRead'),
        description: t('notifications.allMarkedAsReadDescription', 'All notifications have been marked as read'),
      });
    },
  });

  // Mark notification as read when clicked
  const handleNotificationClick = (notification: Notification) => {
    // If not already read, mark as read
    if (!notification.is_read) {
      markAsReadMutation.mutate(notification.id);
    }
    
    // Handle navigation based on notification type if needed
    if (notification.type === 'service') {
      // Navigate to service request details
      // navigate(`/services/requests/${serviceRequestId}`);
    } else if (notification.type === 'reservation') {
      // Navigate to reservation details
      // navigate(`/reservations/${reservationId}`);
    }
  };

  const handleMarkAllAsRead = () => {
    if (notifications && notifications.some(n => !n.is_read)) {
      markAllAsReadMutation.mutate();
    }
  };

  const groupedNotifications = React.useMemo(() => {
    if (!notifications) return {};
    return notifications.reduce((groups: Record<string, Notification[]>, notification) => {
      const date = formatGroupDate(notification.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {});
  }, [notifications]);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-40 bg-darcare-navy border-b border-darcare-gold/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2 text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="size-6" />
            </Button>
            <h1 className="font-serif text-xl text-darcare-gold">{t('navigation.notifications')}</h1>
          </div>
          
          {notifications && notifications.some(n => !n.is_read) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10 flex items-center gap-1"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              <Check size={16} />
              <span>{t('notifications.markAllAsRead')}</span>
            </Button>
          )}
        </div>
      </header>

      <div className="pt-16 p-4 space-y-6 pb-24">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            {t('common.loading')}
          </div>
        ) : Object.entries(groupedNotifications).length > 0 ? (
          Object.entries(groupedNotifications).map(([date, items]) => (
            <div key={date}>
              <h2 className="text-sm font-medium text-muted-foreground mb-2">{date}</h2>
              <div className="space-y-3">
                {items.map((notification) => (
                  <LuxuryCard
                    key={notification.id}
                    className={cn(
                      "p-3 transition-all",
                      notification.is_read 
                        ? 'opacity-80' 
                        : 'border-darcare-gold/30'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "mt-1 text-darcare-gold",
                        !notification.is_read && 'text-darcare-gold'
                      )}>
                        {getNotificationIcon(notification.category)}
                      </div>
                      <div className="flex-1">
                        <h3 className={cn(
                          "text-primary",
                          !notification.is_read && 'font-medium'
                        )}>
                          {notification.title}
                          {!notification.is_read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-darcare-gold rounded-full"></span>
                          )}
                        </h3>
                        {notification.body && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.body}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground/60 mt-2">
                          {formatRelativeDate(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </LuxuryCard>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Bell className="mx-auto mb-4 text-muted-foreground/40" size={40} />
            <p>{t('notifications.noNotifications', 'You have no notifications')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
