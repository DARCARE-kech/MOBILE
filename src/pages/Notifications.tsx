
import React from "react";
import { format, isToday, isYesterday } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Star, Wrench } from "lucide-react";
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

  if (isLoading) {
    return <div className="p-4">Loading notifications...</div>;
  }

  return (
    <div className="min-h-screen bg-darcare-navy">
      <header className="p-4 flex items-center border-b border-darcare-gold/20">
        <Button 
          variant="ghost" 
          className="mr-2 text-darcare-gold hover:text-darcare-gold/80"
          onClick={() => navigate('/home')}
        >
          ←
        </Button>
        <h1 className="text-xl font-serif text-darcare-gold">Notifications</h1>
      </header>

      <div className="p-4 space-y-6">
        {Object.entries(groupedNotifications).map(([date, items]) => (
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
        ))}

        {(!notifications || notifications.length === 0) && (
          <div className="text-center text-darcare-beige py-8">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
