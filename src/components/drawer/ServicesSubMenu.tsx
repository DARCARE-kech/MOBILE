
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MessageCircle, Wrench, Car,
  CalendarRange, ShoppingBag, Waves,
  Scissors, Baby, Book, List
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

  // Define our grouped services structure
  const serviceGroups = [
    {
      label: t('services.household'),
      items: [
        { title: t('services.cleaning'), category: 'cleaning', icon: <Scissors size={18} />, path: '/services/cleaning' },
        { title: t('services.maintenance'), category: 'maintenance', icon: <Wrench size={18} />, path: '/services/maintenance' },
        { title: t('services.laundry'), category: 'laundry', icon: <Waves size={18} />, path: '/services/laundry' },
        { title: t('services.transport'), category: 'transport', icon: <Car size={18} />, path: '/services/transport' },
      ]
    },
    {
      label: t('services.lifestyle'),
      items: [
        { title: t('services.hairSalon'), category: 'hair', icon: <Scissors size={18} />, path: '/services/hair' },
        { title: t('services.kidsClub'), category: 'kids', icon: <Baby size={18} />, path: '/services/kids' },
        { title: t('services.bookSpace'), category: 'book-space', icon: <Book size={18} />, path: '/services/spaces' },
      ]
    },
    {
      label: t('services.myRequests'),
      items: [
        { title: t('services.myRequests'), category: 'requests', icon: <List size={18} />, path: '/services' },
      ]
    }
  ];

  // Function to handle navigation
  const handleNavigation = (path: string, category: string) => {
    if (category === 'requests') {
      // For requests tab, navigate to services page with requests tab active
      navigate('/services', { state: { activeTab: 'requests' } });
    } else if (category === 'cleaning' || category === 'maintenance' || 
              category === 'laundry' || category === 'transport' ||
              category === 'hair' || category === 'kids') {
        
      // Try to find the service with this category
      supabase
        .from('services')
        .select('id')
        .eq('category', category)
        .limit(1)
        .single()
        .then(({ data, error }) => {
          if (!error && data?.id) {
            navigate(`/services/${data.id}`);
          } else {
            // Fallback to the path
            navigate(path);
          }
        });
    } else {
      // For other services, use the provided path
      navigate(path);
    }
    
    // Call the toggle function if provided
    if (onToggle) onToggle();
  };

  return (
    <div className={cn(
      "pl-12 space-y-4 mt-1 mb-1 overflow-hidden transition-all",
      expanded ? "animate-accordion-down max-h-[800px]" : "animate-accordion-up max-h-0",
      "duration-300 ease-in-out"
    )}>
      {serviceGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-3">
          <h3 className="text-xs uppercase text-darcare-beige/50 mb-1 pl-4">
            {group.label}
          </h3>
          <div className="space-y-1">
            {group.items.map((item, index) => {
              const isActive = location.pathname.includes(item.path);
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
                  style={{ animationDelay: `${(groupIndex * group.items.length + index) * 50}ms` }}
                  onClick={() => handleNavigation(item.path, item.category)}
                >
                  <span className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-darcare-gold" : "text-darcare-gold/70"
                  )}>
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesSubMenu;
