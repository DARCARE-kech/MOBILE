
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
  Mail,
  Star,
  HelpCircle,
  Settings
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserProfileSection from "./drawer/UserProfileSection";
import ServicesSubMenu from "./drawer/ServicesSubMenu";
import MainNavigation from "./drawer/MainNavigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EnhancedDrawerMenuProps {
  onLogout: () => void;
  onClose?: () => void;
}

const EnhancedDrawerMenu: React.FC<EnhancedDrawerMenuProps> = ({ onLogout, onClose }) => {
  const { t } = useTranslation();
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const appVersion = "v1.0.0";
  const navigate = useNavigate();

  // Fetch available services for dynamic menu
  const { data: services } = useQuery({
    queryKey: ['drawer-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, category')
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  });

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

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose();
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
                <span>{t('drawer.services')}</span>
              </div>
              {servicesExpanded ? (
                <ChevronDown size={18} className="text-darcare-beige/60" />
              ) : (
                <ChevronRight size={18} className="text-darcare-beige/60" />
              )}
            </button>
            
            {servicesExpanded && services && services.length > 0 && (
              <div className="pl-12 py-1 space-y-1">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => handleNavigate(`/services/${service.id}`)}
                    className="cursor-pointer py-2 px-2 text-sm text-darcare-beige hover:text-darcare-gold hover:bg-darcare-gold/10 rounded transition-colors"
                  >
                    {service.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/services"
            onClick={() => onClose?.()}
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><List size={20} /></span>
            <span>{t('drawer.myRequests')}</span>
          </Link>

          <Link
            to="/services"
            state={{ activeTab: 'history' }}
            onClick={() => onClose?.()}
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><History size={20} /></span>
            <span>{t('drawer.history')}</span>
          </Link>

          <Link
            to="/stays"
            onClick={() => onClose?.()}
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Hotel size={20} /></span>
            <span>{t('drawer.stayDetails')}</span>
          </Link>

          <Separator className="my-2 bg-darcare-gold/20" />

          <Button
            variant="ghost"
            className="justify-start gap-4 py-3 h-auto text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold"
            onClick={(e) => {
              e.preventDefault();
              handleWhatsAppClick();
              if (onClose) onClose();
            }}
          >
            <span className="text-darcare-gold"><MessageCircle size={20} /></span>
            <span>{t('drawer.chatWithUs')}</span>
          </Button>

          <Link
            to="/contact-admin"
            onClick={() => onClose?.()}
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Mail size={20} /></span>
            <span>{t('drawer.contactAdmin')}</span>
          </Link>

          <Link
            to="/chatbot"
            onClick={() => onClose?.()}
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Bot size={20} /></span>
            <span>{t('navigation.assistant')}</span>
          </Link>

          <Separator className="my-2 bg-darcare-gold/20" />

          <Link
            to="/notifications"
            onClick={() => onClose?.()}
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Bell size={20} /></span>
            <span>{t('drawer.notifications')}</span>
          </Link>

          <Link
            to="/explore/favorites"
            onClick={() => onClose?.()}
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Star size={20} /></span>
            <span>{t('drawer.favorites')}</span>
          </Link>

          <Link
            to="/help"
            onClick={() => onClose?.()}
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><HelpCircle size={20} /></span>
            <span>{t('drawer.helpFaq')}</span>
          </Link>

          <Link
            to="/profile"
            onClick={() => onClose?.()}
            className="flex items-center gap-4 py-3 px-4 text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold rounded-lg transition-colors"
          >
            <span className="text-darcare-gold"><Settings size={20} /></span>
            <span>{t('drawer.settings')}</span>
          </Link>

          <div className="mt-auto pt-6 pb-4">
            <Separator className="mb-4 bg-darcare-gold/20" />
            <Button
              variant="ghost" 
              onClick={() => {
                onLogout();
                if (onClose) onClose();
              }}
              className="w-full justify-start gap-4 py-3 h-auto text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold"
            >
              <span className="text-darcare-gold"><LogOut size={20} /></span>
              <span>{t('drawer.logout')}</span>
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
