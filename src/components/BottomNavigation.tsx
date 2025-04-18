
import React from "react";
import { Home, Search, Bell, UserCircle, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface BottomNavigationProps {
  activeTab?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab: propActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from props or current path if not provided
  const currentPath = location.pathname.split('/')[1] || 'home';
  const activeTab = propActiveTab || currentPath;

  const tabs = [
    { id: "services", label: "Services", icon: <Bell size={20} />, path: "/services" },
    { id: "explore", label: "Explore", icon: <Search size={20} />, path: "/explore" },
    { id: "home", label: "Home", icon: <Home size={20} />, path: "/home" },
    { id: "profile", label: "Profile", icon: <UserCircle size={20} />, path: "/profile" },
    { id: "chatbot", label: "Chatbot", icon: <MessageSquare size={20} />, path: "/chatbot" },
  ];

  const handleTabChange = (path: string) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-darcare-navy border-t border-darcare-gold/20 py-3 px-4 z-50">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-icon ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => handleTabChange(tab.path)}
          >
            <span className={activeTab === tab.id ? "text-darcare-gold" : "text-darcare-beige/70"}>
              {tab.icon}
            </span>
            <span className={`text-xs mt-1 ${activeTab === tab.id ? "text-darcare-gold" : "text-darcare-beige/70"}`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
