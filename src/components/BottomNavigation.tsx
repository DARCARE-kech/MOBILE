
import React, { useState, useEffect } from "react";
import { Calendar, Search, Home, UserCircle, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createNewThread } from '@/utils/chatUtils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab: propActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isVisible, setIsVisible] = useState(true);
  
  // Determine active tab from props or current path if not provided
  const currentPath = location.pathname.split('/')[1] || 'home';
  const activeTab = propActiveTab || currentPath;

  // Hide navigation on specific routes that don't require it
  useEffect(() => {
    const hiddenRoutes = ['/auth', '/onboarding', '/splash'];
    const shouldHide = hiddenRoutes.some(route => location.pathname.startsWith(route));
    setIsVisible(!shouldHide);
  }, [location.pathname]);

  // Define the handleTabChange function to navigate to different routes
  const handleTabChange = (path: string) => {
    navigate(path);
  };

  const tabs = [
    { id: "services", label: t('navigation.services'), icon: <Calendar size={20} />, path: "/services" },
    { id: "explore", label: t('navigation.explore'), icon: <Search size={20} />, path: "/explore" },
    { id: "home", label: t('navigation.home'), icon: <Home size={20} />, path: "/home" },
    { id: "profile", label: t('navigation.profile'), icon: <UserCircle size={20} />, path: "/profile" },
    { id: "chatbot", label: t('navigation.chatbot'), icon: <MessageSquare size={20} />, path: "/chatbot" },
  ];

  const handleAssistantClick = () => {
    navigate(`/chatbot`);
  };

  if (!isVisible) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 py-3 px-4 z-50 border-t border-primary/20 bg-gradient-to-b from-darcare-navy to-[#1C1F2A]">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center ${tab.id === 'home' ? 'relative -mt-6' : ''}`}
            onClick={() => {
              if (tab.id === 'chatbot') {
                handleAssistantClick();
              } else {
                handleTabChange(tab.path);
              }
            }}
          >
            {tab.id === 'home' ? (
              <div className="rounded-full p-4 border border-darcare-gold/30 bg-gradient-to-b from-darcare-gold/20 to-darcare-gold/10 shadow-lg">
                <span className="text-darcare-gold">
                  {tab.icon}
                </span>
              </div>
            ) : (
              <span className={activeTab === tab.id 
                ? "text-darcare-gold" 
                : "text-darcare-beige/70"}>
                {tab.icon}
              </span>
            )}
            <span className={`text-xs mt-1 ${
              activeTab === tab.id 
                ? "text-darcare-gold"
                : "text-darcare-beige/70"
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
