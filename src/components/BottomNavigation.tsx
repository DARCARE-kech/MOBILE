
import React from "react";
import { Home, Search, Bell, UserCircle, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab: propActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  // Determine active tab from props or current path if not provided
  const currentPath = location.pathname.split('/')[1] || 'home';
  const activeTab = propActiveTab || currentPath;

  const tabs = [
    { id: "services", label: t('navigation.services'), icon: <Bell size={20} />, path: "/services" },
    { id: "explore", label: t('navigation.explore'), icon: <Search size={20} />, path: "/explore" },
    { id: "home", label: t('navigation.home'), icon: <Home size={20} />, path: "/home" },
    { id: "profile", label: t('navigation.profile'), icon: <UserCircle size={20} />, path: "/profile" },
    { id: "chatbot", label: t('navigation.chatbot'), icon: <MessageSquare size={20} />, path: "/chatbot" },
  ];

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 py-3 px-4 z-50 border-t border-primary/20",
      isDarkMode 
        ? "bg-darcare-navy" 
        : "bg-white bottom-nav"
    )}>
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center ${tab.id === 'home' ? 'relative -mt-6' : ''}`}
            onClick={() => handleTabChange(tab.path)}
          >
            {tab.id === 'home' ? (
              <div className={cn(
                "rounded-full p-4 border shadow-lg",
                isDarkMode
                  ? "bg-gradient-to-b from-darcare-gold/20 to-darcare-gold/10 border-darcare-gold/30"
                  : "bg-[#F2E4C8] border-darcare-deepGold/30 bottom-nav-home"
              )}>
                <span className="text-primary">
                  {tab.icon}
                </span>
              </div>
            ) : (
              <span className={activeTab === tab.id ? "text-primary" : "text-foreground/70"}>
                {tab.icon}
              </span>
            )}
            <span className={`text-xs mt-1 ${activeTab === tab.id ? "text-primary" : "text-foreground/70"}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
