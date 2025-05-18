
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import EnhancedDrawerMenu from "./EnhancedDrawerMenu";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";

interface DrawerMenuProps {
  onLogout?: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ onLogout }) => {
  const { handleLogout } = useUserProfile();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  
  // Use the provided onLogout or fallback to the default logout functions
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      handleLogout();
      signOut();
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-darcare-gold hover:text-darcare-gold/80 hover:bg-darcare-gold/10"
          aria-label={t('common.menu')}
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <EnhancedDrawerMenu onLogout={handleLogoutClick} onClose={() => setOpen(false)} />
    </Sheet>
  );
};

export default DrawerMenu;
