
// This file redirects imports to the new AppHeader
// It's a compatibility layer for existing imports
import AppHeader, { AppHeaderProps } from "./AppHeader";

// MainHeader just passes all props to AppHeader
const MainHeader = (props: AppHeaderProps) => {
  return <AppHeader {...props} />;
};

export default MainHeader;
