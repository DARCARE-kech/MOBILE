
// This file redirects imports to the new AppHeader
// It's a compatibility layer for existing imports
import AppHeader, { AppHeaderProps } from "./AppHeader";

export interface MainHeaderProps extends AppHeaderProps {}

// MainHeader just passes all props to AppHeader
const MainHeader = (props: MainHeaderProps) => {
  return <AppHeader {...props} />;
};

export default MainHeader;
