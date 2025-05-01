
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
    <Sheet>
      <SheetTrigger asChild>
        <button className="w-10 h-10 flex items-center justify-center text-darcare-beige hover:text-darcare-gold">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      
    </Sheet>
  );
};

export default EnhancedDrawerMenu;
