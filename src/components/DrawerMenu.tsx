
import React from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import EnhancedDrawerMenu from "./EnhancedDrawerMenu";
import { useAuth } from "@/contexts/AuthContext";

interface DrawerMenuProps {
  onLogout?: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ onLogout }) => {
  const { handleLogout } = useUserProfile();
  const { signOut } = useAuth();
  
  // Use the provided onLogout or fallback to the default logout functions
  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      handleLogout();
      signOut();
    }
  };
  
  return <EnhancedDrawerMenu onLogout={handleLogoutClick} />;
};

export default DrawerMenu;
