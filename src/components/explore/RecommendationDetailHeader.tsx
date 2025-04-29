
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart } from "lucide-react";
import Logo from "@/components/Logo";
import WeatherDisplay from "@/components/WeatherDisplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface RecommendationDetailHeaderProps {
  title: string;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  recommendationId: string;
}

export const RecommendationDetailHeader = ({ 
  title, 
  onBack,
  isFavorite,
  onToggleFavorite,
  recommendationId
}: RecommendationDetailHeaderProps) => {
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

  return (
    <header className="p-4 flex justify-between items-center border-b border-darcare-gold/20 bg-gradient-to-b from-darcare-navy/95 to-darcare-navy">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10 -ml-2"
        >
          <ChevronLeft size={24} />
        </Button>
        <Logo size="sm" color="gold" withText={false} />
      </div>
      
      <div className="font-serif text-darcare-gold text-xl hidden md:block">
        {title}
      </div>
      
      <div className="flex items-center gap-4">
        <WeatherDisplay />
        <Button
          variant="ghost"
          size="icon"
          className="relative text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
          onClick={() => window.location.href = '/notifications'}
        >
          {hasUnreadNotifications && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </div>
    </header>
  );
};
