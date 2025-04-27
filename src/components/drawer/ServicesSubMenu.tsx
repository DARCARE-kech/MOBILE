
import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Wrench, Car, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ServicesSubMenuProps {
  expanded: boolean;
}

const ServicesSubMenu: React.FC<ServicesSubMenuProps> = ({ expanded }) => {
  const { t } = useTranslation();
  
  const serviceSubitems = [
    { 
      icon: <MessageCircle size={18} />, 
      label: t('services.cleaning'), 
      path: "/services/cleaning" 
    },
    { 
      icon: <Wrench size={18} />, 
      label: t('services.maintenance'), 
      path: "/services/maintenance" 
    },
    { 
      icon: <Car size={18} />, 
      label: t('services.transport'), 
      path: "/services/transport" 
    },
    { 
      icon: <CalendarRange size={18} />, 
      label: t('services.bookSpace'), 
      path: "/services/spaces" 
    },
  ];

  return (
    <div className={cn(
      "pl-12 space-y-2 mt-1 mb-1 overflow-hidden transition-all", 
      expanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
    )}>
      {serviceSubitems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="flex items-center gap-3 py-2 px-4 text-sm text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
        >
          <span className="text-darcare-gold/70">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default ServicesSubMenu;
