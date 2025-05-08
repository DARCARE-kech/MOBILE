
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MessageCircle, Wrench, Car,
  CalendarRange, ShoppingBag, Waves
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

interface ServicesSubMenuProps {
  expanded: boolean;
  onToggle?: () => void;
}

const ServicesSubMenu: React.FC<ServicesSubMenuProps> = ({ expanded, onToggle }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch services from Supabase
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, category');
      if (error) throw error;
      return data;
    }
  });

  const iconMap: Record<string, JSX.Element> = {
    cleaning: <MessageCircle size={18} />,
    maintenance: <Wrench size={18} />,
    transport: <Car size={18} />,
    laundry: <Waves size={18} />,
    "book-space": <CalendarRange size={18} />,
    shop: <ShoppingBag size={18} />,
  };

  const serviceSubitems = (services || []).map((service) => {
    const category = service.category?.toLowerCase() || '';
    const icon = iconMap[category] || <MessageCircle size={18} />;
    const label = t(`services.${category}`, service.name);

    const path =
      category === "book-space" ? "/services/spaces" :
      category === "shop" ? "/services/shop" :
      `/services/${service.id}`;

    return {
      icon,
      label,
      path,
      action: () => navigate(path)
    };
  });

  return (
    <div className={cn(
      "pl-12 space-y-2 mt-1 mb-1 overflow-hidden transition-all",
      expanded ? "animate-accordion-down max-h-[500px]" : "animate-accordion-up max-h-0",
      "duration-300 ease-in-out"
    )}>
      {serviceSubitems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 py-2 px-4 text-sm rounded-lg transition-all duration-200 cursor-pointer",
              "hover:bg-darcare-gold/10 hover:text-darcare-gold",
              "animate-fade-in",
              isActive
                ? "bg-darcare-gold/20 text-darcare-gold font-medium"
                : "text-darcare-beige"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => {
              item.action();
              if (onToggle) onToggle();
            }}
          >
            <span className={cn(
              "transition-colors duration-200",
              isActive ? "text-darcare-gold" : "text-darcare-gold/70"
            )}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ServicesSubMenu;
