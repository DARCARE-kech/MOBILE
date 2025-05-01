
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
  const navigate = useNavigate();

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
    <SheetContent side="left" className="bg-darcare-navy border-r border-darcare-gold/10 p-0 w-72 max-w-xs">
      <div className="flex flex-col h-full">
        <SheetHeader className="p-4 border-b border-darcare-gold/10">
          <div className="w-full flex justify-center items-center">
            <Logo size="sm" />
          </div>
        </SheetHeader>
        
        <div className="overflow-y-auto flex-1 px-2 py-4">
          <UserProfileSection getInitials={getInitials} />
          
          <nav className="space-y-1">
            <MainNavigation />
            <ServicesSubMenu 
              expanded={servicesExpanded}
              onToggle={() => setServicesExpanded(!servicesExpanded)}
            />
          </nav>
        </div>
        
        <div className="mt-auto border-t border-darcare-gold/10 p-4">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              className="text-darcare-beige hover:text-darcare-gold hover:bg-darcare-gold/10 w-full justify-start"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="mr-2" size={18} />
              {t('drawer.contactSupport')}
            </Button>
          </div>
          
          <Separator className="my-2 bg-darcare-gold/10" />
          
          <Button
            variant="ghost"
            className="text-darcare-beige hover:text-darcare-gold hover:bg-darcare-gold/10 w-full justify-start"
            onClick={onLogout}
          >
            <LogOut className="mr-2" size={18} />
            {t('auth.logout')}
          </Button>
          
          <div className="text-xs text-center mt-4 text-darcare-beige/40">
            {appVersion}
          </div>
        </div>
      </div>
    </SheetContent>
  );
};

export default EnhancedDrawerMenu;
