
import React from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag, List, Book, Compass, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const MainNavigation: React.FC = () => {
  const { t } = useTranslation();
  
  const mainMenuItems = [
    { icon: <Home size={20} />, label: t('navigation.home'), path: "/home" },
    { 
      icon: <ShoppingBag size={20} />, 
      label: t('services.shop'), 
      path: "/services/shop"
    },
    { 
      icon: <List size={20} />, 
      label: t('services.requests'), 
      path: "/services/requests"
    },
    { 
      icon: <Book size={20} />, 
      label: t('services.reservations'), 
      path: "/services/spaces" 
    },
    { 
      icon: <Compass size={20} />, 
      label: t('explore.recommendations'), 
      path: "/explore" 
    },
    { 
      icon: <Heart size={20} />, 
      label: t('explore.favorites'), 
      path: "/explore/favorites"
    },
  ];

  return (
    <>
      {mainMenuItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
        >
          <span className="text-darcare-gold">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );
};

export default MainNavigation;
