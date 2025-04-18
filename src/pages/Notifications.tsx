
import React from "react";
import { format, isToday, isYesterday } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, ChevronLeft, Star, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const getNotificationIcon = (category: string) => {
  switch (category) {
    case 'recommendation':
      return <Star className="shrink-0" />;
    case 'service':
      return <Wrench className="shrink-0" />;
    default:
      return <Bell className="shrink-0" />;
  }
};

const formatDate = (date: string) => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
};

const Notifications = () => {
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const groupedNotifications = React.useMemo(() => {
    if (!notifications) return {};
    return notifications.reduce((groups: Record<string, typeof notifications>, notification) => {
      const date = formatDate(notification.created_at);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {});
  }, [notifications]);

  // Mark all as read when page loads
  React.useEffect(() => {
    const markAsRead = async () => {
      if (!notifications || notifications.length === 0) return;
      
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('is_read', false);
    };
    
    markAsRead();
  }, [notifications]);

  return (
    <div className="min-h-screen bg-darcare-navy">
      <header className="p-4 flex items-center justify-between border-b border-darcare-gold/20 bg-gradient-to-b from-darcare-navy/95 to-darcare-navy">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-2 text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="font-serif text-xl text-darcare-gold">Notifications</h1>
        </div>
        
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-darcare-gold/10 text-darcare-beige">
          <ChevronLeft size={0} className="opacity-0" />
        </div>
      </header>

      <div className="p-4 space-y-6 pb-24">
        {isLoading ? (
          <div className="text-center text-darcare-beige py-8">
            Loading notifications...
          </div>
        ) : Object.entries(groupedNotifications).length > 0 ? (
          Object.entries(groupedNotifications).map(([date, items]) => (
            <div key={date}>
              <h2 className="text-sm font-medium text-darcare-beige mb-2">{date}</h2>
              <div className="space-y-3">
                {items.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.is_read 
                        ? 'bg-darcare-navy border-darcare-gold/10' 
                        : 'bg-darcare-gold/5 border-darcare-gold/20'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 text-darcare-gold ${!notification.is_read && 'text-darcare-gold'}`}>
                        {getNotificationIcon(notification.category)}
                      </div>
                      <div>
                        <h3 className={`text-darcare-white ${!notification.is_read && 'font-medium'}`}>
                          {notification.title}
                        </h3>
                        {notification.body && (
                          <p className="text-sm text-darcare-beige mt-1">
                            {notification.body}
                          </p>
                        )}
                        <p className="text-xs text-darcare-beige/60 mt-2">
                          {format(new Date(notification.created_at), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-darcare-beige py-8">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
