
import React from "react";
import { Bell, Heart, ChevronLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WeatherDisplay from "@/components/WeatherDisplay";
import DrawerMenu from "@/components/DrawerMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  onBack,
  rightContent,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fetch unread notifications
  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_read', false);
      
      if (error) throw error;
      return data;
    },
  });

  const hasUnreadNotifications = notifications && notifications.length > 0;
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center border-b border-darcare-gold/20 bg-gradient-to-b from-darcare-navy/95 to-darcare-navy">
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10 -ml-2"
          >
            <ChevronLeft size={24} />
          </Button>
        ) : (
          <DrawerMenu />
        )}
        {title && (
          <h1 className="font-serif text-darcare-gold text-xl">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-4">
        {rightContent || (
          <>
            <WeatherDisplay />
            <Button
              variant="ghost"
              size="icon"
              className="relative text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
              onClick={() => navigate('/explore/favorites')}
              aria-label="Favorites"
            >
              <Heart size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
              onClick={() => navigate('/notifications')}
              aria-label="Notifications"
            >
              <Bell size={20} />
              {hasUnreadNotifications && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-darcare-gold rounded-full" />
              )}
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
