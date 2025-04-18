
import React from "react";
import { Menu, Bell, CloudSun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DrawerMenu from "./DrawerMenu";

const MainHeader: React.FC<{ title?: string }> = ({ title }) => {
  const navigate = useNavigate();
  
  // Query to check for unread notifications
  const { data: unreadNotifications } = useQuery({
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

  const hasUnreadNotifications = unreadNotifications && unreadNotifications.length > 0;

  return (
    <header className="p-4 flex justify-between items-center border-b border-darcare-gold/20 bg-gradient-to-b from-darcare-navy/95 to-darcare-navy">
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-10 h-10 flex items-center justify-center text-darcare-beige hover:text-darcare-gold">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-darcare-navy border-r border-darcare-gold/20 w-72">
          <DrawerMenu onLogout={() => navigate('/auth')} />
        </SheetContent>
      </Sheet>

      <div className="font-serif text-darcare-gold text-xl">
        {title || "DarCare"}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-darcare-gold/10 text-darcare-beige">
          <CloudSun size={18} className="text-darcare-gold" />
          <span className="text-sm">24°C</span>
        </div>
        
        <button
          onClick={() => navigate('/notifications')}
          className="w-10 h-10 rounded-full relative flex items-center justify-center text-darcare-beige hover:text-darcare-gold"
        >
          <Bell size={20} />
          {hasUnreadNotifications && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
