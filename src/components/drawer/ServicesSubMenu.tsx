
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageCircle, Wrench, Car, CalendarRange, ShoppingBag, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ServicesSubMenuProps {
  expanded: boolean;
  onToggle?: () => void;
}

const ServicesSubMenu: React.FC<ServicesSubMenuProps> = ({ expanded, onToggle }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const serviceSubitems = [
    { 
      icon: <MessageCircle size={18} />, 
      label: t('services.cleaning'), 
      path: "/services/cleaning",
      action: () => navigate('/services/cleaning')
    },
    { 
      icon: <Wrench size={18} />, 
      label: t('services.maintenance'), 
      path: "/services/maintenance",
      action: () => navigate('/services/maintenance')
    },
    { 
      icon: <Car size={18} />, 
      label: t('services.transport'), 
      path: "/services/transport",
      action: () => navigate('/services/transport')
    },
    { 
      icon: <Waves size={18} />, 
      label: t('services.laundry'), 
      path: "/services/laundry",
      action: () => navigate('/services/laundry')
    },
    { 
      icon: <CalendarRange size={18} />, 
      label: t('services.bookSpace'), 
      path: "/services/spaces",
      action: () => navigate('/services/book-space')
    },
    { 
      icon: <ShoppingBag size={18} />, 
      label: t('services.shop'), 
      path: "/services/shop",
      action: () => navigate('/services/shop')
    },
  ];

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
              if (onToggle) {
                onToggle();
              }
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