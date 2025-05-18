
import React, { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Menu, 
  MessageCircle, 
  Bot, 
  UserCircle, 
  Bell, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  List,
  History,
  Hotel,
  HelpCircle,
  Settings,
  Star
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserProfileSection from "./drawer/UserProfileSection";
import DynamicServicesMenu from "./drawer/DynamicServicesMenu";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

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
    <SheetContent 
        side="left" 
        className="bg-darcare-navy border-r border-darcare-gold/20 w-72 overflow-y-auto scrollbar-hide"
      >
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
            
            <DynamicServicesMenu expanded={servicesExpanded} />
          </div>

          <Link
            to="/services"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><List size={20} /></span>
            <span>{t('navigation.requests')}</span>
          </Link>
          
          <Link
            to="/services/history"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><History size={20} /></span>
            <span>{t('navigation.history')}</span>
          </Link>
          
          <Link
            to="/stays"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Hotel size={20} /></span>
            <span>{t('navigation.stayDetails')}</span>
          </Link>

          <Separator className="my-2 bg-darcare-gold/20" />

          <Button
            variant="ghost"
            className="justify-start gap-4 py-3 h-auto text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold"
            onClick={handleWhatsAppClick}
          >
            <span className="text-darcare-gold"><MessageCircle size={20} /></span>
            <span>{t('navigation.chatWithUs')}</span>
          </Button>

          <Link
            to="/contact-admin"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Bot size={20} /></span>
            <span>{t('navigation.contactAdmin')}</span>
          </Link>
          
          <Link
            to="/chatbot"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Bot size={20} /></span>
            <span>{t('navigation.assistant')}</span>
          </Link>

          <Separator className="my-2 bg-darcare-gold/20" />

          <Link
            to="/profile"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><UserCircle size={20} /></span>
            <span>{t('navigation.profile')}</span>
          </Link>

          <Link
            to="/notifications"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Bell size={20} /></span>
            <span>{t('navigation.notifications')}</span>
          </Link>
          
          <Link
            to="/explore/favorites"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Star size={20} /></span>
            <span>{t('navigation.favorites')}</span>
          </Link>
          
          <Link
            to="/help"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><HelpCircle size={20} /></span>
            <span>{t('navigation.helpFaq')}</span>
          </Link>
          
          <Link
            to="/settings"
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Settings size={20} /></span>
            <span>{t('navigation.settings')}</span>
          </Link>

          <div className="mt-auto pt-6 pb-4">
            <Separator className="mb-4 bg-darcare-gold/20" />
            <Button
              variant="ghost" 
              onClick={onLogout}
              className="w-full justify-start gap-4 py-3 h-auto text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold"
            >
              <span className="text-darcare-gold"><LogOut size={20} /></span>
              <span>{t('navigation.logout')}</span>
            </Button>
            <div className="text-center mt-4">
              <span className="text-xs text-darcare-beige/40">{appVersion}</span>
            </div>
          </div>
        </nav>
      </SheetContent>
  );
};

export default EnhancedDrawerMenu;
