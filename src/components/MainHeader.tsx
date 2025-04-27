
import { Menu, ChevronLeft, Bell } from "lucide-react";
import Logo from "./Logo";
import WeatherDisplay from "./WeatherDisplay";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";

interface MainHeaderProps {
  title?: string;
  onBack?: () => void;
  showDrawer?: boolean;
  children?: React.ReactNode;
  rightContent?: React.ReactNode;
}

const MainHeader = ({ 
  title, 
  onBack, 
  showDrawer = false,
  children,
  rightContent
}: MainHeaderProps) => {
  const navigate = useNavigate();
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center border-b border-darcare-gold/20 bg-gradient-to-b from-darcare-navy/95 to-darcare-navy">
      <div className="flex items-center gap-3">
        {showDrawer ? (
          <DrawerMenu />
        ) : onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10 -ml-2"
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        {title ? (
          <h1 className="font-serif text-darcare-gold text-xl">{title}</h1>
        ) : (
          <Logo size="sm" color="gold" />
        )}
      </div>
      <div className="flex items-center gap-4">
        {rightContent ? (
          rightContent
        ) : children ? (
          children
        ) : (
          <>
            <WeatherDisplay />
            <Button
              variant="ghost"
              size="icon"
              className="relative text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
              onClick={() => navigate('/notifications')}
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

export default MainHeader;
