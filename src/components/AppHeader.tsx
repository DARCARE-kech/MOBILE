
import { Bell, Heart, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import WeatherDisplay from "./WeatherDisplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import DrawerMenu from "./DrawerMenu";
import { useTranslation } from "react-i18next";

export interface AppHeaderProps {
  title?: string;
  children?: React.ReactNode;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

const AppHeader = ({ title, children, onBack, rightContent }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
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

  // Custom title for home page
  const isHome = window.location.pathname === "/" || window.location.pathname === "/home";
  const displayTitle = isHome ? "DarCare" : title;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center border-b border-primary/20 bg-gradient-to-b from-background/95 to-background backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {onBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary hover:text-primary/80 hover:bg-primary/10"
            aria-label={t('common.back')}
          >
            <ArrowLeft size={20} />
          </Button>
        ) : (
          <DrawerMenu />
        )}
        {displayTitle && (
          <h1 className={`font-serif text-primary ${isHome ? "text-2xl" : "text-xl"}`}>
            {displayTitle}
          </h1>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {rightContent || children || (
          <>
            <WeatherDisplay expanded={false} />
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:text-primary/80 hover:bg-primary/10"
              onClick={() => navigate('/explore/favorites')}
              aria-label={t('common.favorites')}
            >
              <Heart size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary hover:text-primary/80 hover:bg-primary/10"
              onClick={() => navigate('/notifications')}
              aria-label={t('common.notifications')}
            >
              <Bell size={20} />
              {hasUnreadNotifications && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
