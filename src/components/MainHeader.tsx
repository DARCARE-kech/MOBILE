
import { Bell, ChevronLeft } from "lucide-react";
import Logo from "./Logo";
import WeatherDisplay from "./WeatherDisplay";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface MainHeaderProps {
  title?: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

const MainHeader = ({ title, onBack, children }: MainHeaderProps) => {
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
    <header className="p-4 flex justify-between items-center border-b border-darcare-gold/20 bg-gradient-to-b from-darcare-navy/95 to-darcare-navy">
      <div className="flex items-center gap-3">
        {onBack && (
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
        {children ? (
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
