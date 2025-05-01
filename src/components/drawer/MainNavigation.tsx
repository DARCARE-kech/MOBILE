
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, List, Book, Compass, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const MainNavigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  
  const mainMenuItems = [
    { icon: <Home size={20} />, label: t('navigation.home'), path: "/home" },
    { 
      icon: <ShoppingBag size={20} />, 
      label: t('navigation.shop'), 
      path: "/services/shop"
    },
    { 
      icon: <List size={20} />, 
      label: t('navigation.requests'), 
      path: "/services"  // Redirect to main services page with requests tab
    },
    { 
      icon: <Book size={20} />, 
      label: t('navigation.spaces'), 
      path: "/services/spaces" 
    },
    { 
      icon: <Compass size={20} />, 
      label: t('navigation.explore'), 
      path: "/explore" 
    },
    { 
      icon: <Heart size={20} />, 
      label: t('navigation.favorites'), 
      path: "/explore/favorites"
    },
  ];

  return (
    <>
      {mainMenuItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={index}
            to={item.path}
            className={cn(
              "flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors",
              isActive ? "bg-darcare-gold/20 text-darcare-gold" : ""
            )}
          >
            <span className="text-darcare-gold">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )}
      )}
    </>
  );
};

export default MainNavigation;
