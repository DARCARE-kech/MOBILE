
import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu, MessageCircle, Bot, UserCircle, Bell, LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserProfileSection from "./drawer/UserProfileSection";
import ServicesSubMenu from "./drawer/ServicesSubMenu";
import MainNavigation from "./drawer/MainNavigation";
import { useUserProfile } from "@/hooks/useUserProfile";

interface EnhancedDrawerMenuProps {
  onLogout: () => void;
}

const EnhancedDrawerMenu: React.FC<EnhancedDrawerMenuProps> = ({ onLogout }) => {
  const { t } = useTranslation();
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const appVersion = "v1.0.0";

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "+212612345678";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

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

        <UserProfileSection getInitials={getInitials} />

        <nav className="flex flex-col space-y-2">
          <div>
            <button 
              onClick={() => setServicesExpanded(!servicesExpanded)} 
              className="w-full flex items-center justify-between gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-darcare-gold"><Menu size={20} /></span>
                <span>{t('navigation.services')}</span>
              </div>
              {servicesExpanded ? (
                <ChevronDown size={18} className="text-darcare-beige/60" />
              ) : (
                <ChevronRight size={18} className="text-darcare-beige/60" />
              )}
            </button>
            
            <ServicesSubMenu expanded={servicesExpanded} />
          </div>

          <MainNavigation />

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
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default EnhancedDrawerMenu;
