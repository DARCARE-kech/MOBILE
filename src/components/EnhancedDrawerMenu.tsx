import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Menu, 
  Home, 
  MessageCircle, 
  Tool as Settings, 
  Car, 
  CalendarRange, 
  ShoppingBag, 
  List, 
  Compass, 
  Heart, 
  Bot, 
  UserCircle, 
  Bell, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Book 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface EnhancedDrawerMenuProps {
  onLogout: () => void;
}

const EnhancedDrawerMenu: React.FC<EnhancedDrawerMenuProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, currentStay, isLoading } = useUserProfile();
  const [servicesExpanded, setServicesExpanded] = useState(false);
  
  const appVersion = "v1.0.0";

  const handleWhatsAppClick = () => {
    const phoneNumber = "+212612345678";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
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
  
  const serviceSubitems = [
    { 
      icon: <MessageCircle size={18} />, 
      label: t('services.cleaning'), 
      path: "/services/cleaning" 
    },
    { 
      icon: <Settings size={18} />, 
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
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-10 h-10 flex items-center justify-center text-darcare-beige hover:text-darcare-gold">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-darcare-navy border-r border-darcare-gold/20 w-72 overflow-y-auto">
        <SheetHeader className="text-left mb-6 mt-2">
          <Logo size="sm" color="gold" />
        </SheetHeader>

        <div className="mb-6 p-4 bg-darcare-navy/50 border border-darcare-gold/10 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-14 w-14 bg-darcare-gold/10 border border-darcare-gold/25">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} />
              ) : (
                <AvatarFallback className="bg-darcare-gold/10 text-darcare-gold">
                  {isLoading ? "..." : getInitials(profile?.full_name || "")}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-serif text-darcare-gold text-lg">{isLoading ? "..." : profile?.full_name}</h3>
              {currentStay && (
                <p className="text-darcare-beige/70 text-sm">
                  {t('villa')} {currentStay.villa_number}
                </p>
              )}
            </div>
          </div>
          
          {currentStay && (
            <div className="text-xs text-darcare-beige/60 flex justify-between">
              <span>{new Date(currentStay.check_in).toLocaleDateString()} - {new Date(currentStay.check_out).toLocaleDateString()}</span>
              <span>{t('nights', { count: Math.round((new Date(currentStay.check_out).getTime() - new Date(currentStay.check_in).getTime()) / (1000 * 60 * 60 * 24)) })}</span>
            </div>
          )}
        </div>

        <nav className="flex flex-col space-y-2">
          <div>
            <button 
              onClick={() => setServicesExpanded(!servicesExpanded)} 
              className="w-full flex items-center justify-between gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-darcare-gold"><List size={20} /></span>
                <span>{t('navigation.services')}</span>
              </div>
              {servicesExpanded ? (
                <ChevronDown size={18} className="text-darcare-beige/60" />
              ) : (
                <ChevronRight size={18} className="text-darcare-beige/60" />
              )}
            </button>
            
            <div className={cn(
              "pl-12 space-y-2 mt-1 mb-1 overflow-hidden transition-all", 
              servicesExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
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
          </div>

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

          <Separator className="my-2 bg-darcare-gold/20" />

          <Button
            variant="ghost"
            className="justify-start gap-4 py-3 h-auto text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold"
            onClick={handleWhatsAppClick}
          >
            <span className="text-darcare-gold"><MessageCircle size={20} /></span>
            <span>{t('common.chatWithUs')}</span>
          </Button>

          <Link
            to="/chatbot"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Bot size={20} /></span>
            <span>{t('common.darCareAssistant')}</span>
          </Link>

          <Separator className="my-2 bg-darcare-gold/20" />

          <Link
            to="/profile"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><UserCircle size={20} /></span>
            <span>{t('navigation.profileSettings')}</span>
          </Link>

          <Link
            to="/notifications"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Bell size={20} /></span>
            <span>{t('navigation.notifications')}</span>
          </Link>
        </nav>

        <div className="mt-auto pt-6 pb-4">
          <Separator className="mb-4 bg-darcare-gold/20" />
          <Button
            variant="ghost" 
            onClick={onLogout}
            className="w-full justify-start gap-4 py-3 h-auto text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold"
          >
            <span className="text-darcare-gold"><LogOut size={20} /></span>
            <span>{t('common.logout')}</span>
          </Button>
          <div className="text-center mt-4">
            <span className="text-xs text-darcare-beige/40">{appVersion}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EnhancedDrawerMenu;
