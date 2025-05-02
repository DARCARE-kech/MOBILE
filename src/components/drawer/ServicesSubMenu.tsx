
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

  const handleServiceClick = (name: string) => {
    const nameLower = name.toLowerCase();

    if (nameLower.includes('shop')) {
      navigate('/services/shop'); // logique fixe inchangée
    } else if (nameLower.includes('book space')) {
      navigate('/services/spaces');
    } else {
      navigate(`/services/${nameLower}`);
    }

    if (onToggle) {
      onToggle();
    }
  };

  const serviceSubitems = [
    { icon: <MessageCircle size={18} />, label: t('services.cleaning'), name: 'Cleaning' },
    { icon: <Wrench size={18} />, label: t('services.maintenance'), name: 'Maintenance' },
    { icon: <Car size={18} />, label: t('services.transport'), name: 'Transport' },
    { icon: <Waves size={18} />, label: t('services.laundry'), name: 'Laundry' },
    { icon: <CalendarRange size={18} />, label: t('services.bookSpace'), name: 'Book Space' },
    { icon: <ShoppingBag size={18} />, label: t('services.shop'), name: 'Shop' } // logique fixe conservée
  ];

  return (
    <div className={cn(
      "pl-12 space-y-2 mt-1 mb-1 overflow-hidden transition-all",
      expanded ? "animate-accordion-down max-h-[500px]" : "animate-accordion-up max-h-0",
      "duration-300 ease-in-out"
    )}>
      {serviceSubitems.map((item, index) => {
        const isActive =
          location.pathname.includes(item.name.toLowerCase()) ||
          (item.name.toLowerCase().includes('shop') && location.pathname === '/services/shop');

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
            onClick={() => handleServiceClick(item.name)}
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