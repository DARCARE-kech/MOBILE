
import React from "react";
import { Home, Search, Bell, UserCircle, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab: propActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Determine active tab from props or current path if not provided
  const currentPath = location.pathname.split('/')[1] || 'home';
  const activeTab = propActiveTab || currentPath;

  // Reordered tabs to place Home in the center
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
    <nav className="fixed bottom-0 left-0 right-0 bg-darcare-navy border-t border-darcare-gold/20 py-3 px-4 z-50">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex flex-col items-center justify-center",
              tab.id === "home" && "relative -mt-5"
            )}
            onClick={() => handleTabChange(tab.path)}
          >
            <div
              className={cn(
                "flex items-center justify-center",
                tab.id === "home" ? 
                  "w-14 h-14 rounded-full bg-gradient-to-r from-darcare-gold/20 to-darcare-gold/40 border border-darcare-gold/30 shadow-lg" : 
                  "w-10 h-10"
              )}
            >
              <span className={cn(
                tab.id === "home" ? "text-darcare-gold" : 
                activeTab === tab.id ? "text-darcare-gold" : "text-darcare-beige/70"
              )}>
                {tab.icon}
              </span>
            </div>
            <span className={cn(
              "text-xs mt-1", 
              activeTab === tab.id ? "text-darcare-gold" : "text-darcare-beige/70"
            )}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
