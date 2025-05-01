
import { Bell, Heart, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import WeatherDisplay from "./WeatherDisplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface AppHeaderProps {
  title?: string;
  children?: React.ReactNode;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  drawerContent?: React.ReactNode; // Added drawerContent prop
}

const AppHeader = ({ title, children, onBack, rightContent, drawerContent }: AppHeaderProps) => {
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
    <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-darcare-navy">
      <div className="flex items-center gap-3">
        {onBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
            aria-label={t('common.back')}
          >
            <ArrowLeft size={20} />
          </Button>
        ) : (
          drawerContent
        )}
        {displayTitle && (
          <h1 className={cn("font-serif text-darcare-gold", isHome ? "text-2xl" : "text-xl")}>
            {displayTitle}
          </h1>
        )}
      </div>
      
      <div className="flex items-center">
        {rightContent || children || (
          <div className="flex items-center gap-2">
            <WeatherDisplay expanded={false} />
            <Button
              variant="ghost"
              size="icon"
              className="text-darcare-beige hover:text-darcare-gold hover:bg-darcare-gold/10"
              onClick={() => navigate('/explore/favorites')}
              aria-label={t('common.favorites')}
            >
              <Heart size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-darcare-beige hover:text-darcare-gold hover:bg-darcare-gold/10"
              onClick={() => navigate('/notifications')}
              aria-label={t('common.notifications')}
            >
              <Bell size={20} />
              {hasUnreadNotifications && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-darcare-gold rounded-full" />
              )}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
