
// This file redirects imports to the new AppHeader
// It's a compatibility layer for existing imports
import AppHeader from "./AppHeader";
import { AppHeaderProps } from "./AppHeader";

interface MainHeaderProps extends AppHeaderProps {
  onBack?: () => void;
}

const MainHeader = (props: MainHeaderProps) => {
  // Just forwarding props to AppHeader
  return <AppHeader {...props} />;
};

export default MainHeader;
