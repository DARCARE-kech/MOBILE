
import { useUserProfile } from "@/hooks/useUserProfile";
import EnhancedDrawerMenu from "./EnhancedDrawerMenu";

interface DrawerMenuProps {
  onLogout: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ onLogout }) => {
  const { handleLogout } = useUserProfile();
  
  return <EnhancedDrawerMenu onLogout={handleLogout} />;
};

export default DrawerMenu;
