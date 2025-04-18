
import React from "react";
import { Home, Search, Bell, UserCircle, MessageSquare } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: "services", label: "Services", icon: <Bell size={20} /> },
    { id: "explore", label: "Explore", icon: <Search size={20} /> },
    { id: "home", label: "Home", icon: <Home size={20} /> },
    { id: "profile", label: "Profile", icon: <UserCircle size={20} /> },
    { id: "chatbot", label: "Chatbot", icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-darcare-navy border-t border-darcare-gold/20 py-3 px-4">
      <div className="flex justify-between items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-icon ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onChangeTab(tab.id)}
          >
            {tab.icon}
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
