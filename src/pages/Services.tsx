
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import ReserveServicesTab from "@/components/services/ReserveServicesTab";
import MyRequestsTab from "@/components/services/MyRequestsTab";
import HistoryTab from "@/components/services/HistoryTab";
import FloatingAction from "@/components/FloatingAction";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

const ServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("reserve");
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title={t('navigation.services')} />
      
      <div className="pt-20 pb-24"> {/* Increased top padding to prevent header overlap */}
        <div className="px-4 mb-4">
          <div className={cn(
            "flex justify-between rounded-full p-1",
            isDarkMode 
              ? "bg-white/5 backdrop-blur-sm" 
              : "bg-white border border-darcare-deepGold/20 shadow-sm"
          )}>
            <TabButton 
              active={activeTab === "reserve"}
              onClick={() => setActiveTab("reserve")}
              label={t('services.reserve')}
            />
            <TabButton 
              active={activeTab === "requests"}
              onClick={() => setActiveTab("requests")}
              label={t('services.requests')}
            />
            <TabButton 
              active={activeTab === "history"}
              onClick={() => setActiveTab("history")}
              label={t('services.history')}
            />
          </div>
        </div>
        
        <div className="px-2">
          {activeTab === "reserve" && <ReserveServicesTab />}
          {activeTab === "requests" && <MyRequestsTab />}
          {activeTab === "history" && <HistoryTab />}
        </div>
      </div>
      
      <FloatingAction />
      <BottomNavigation activeTab="services" />
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200",
        active 
          ? isDarkMode 
            ? "bg-darcare-gold text-darcare-navy" 
            : "bg-darcare-deepGold text-white"
          : isDarkMode
            ? "text-darcare-beige hover:text-darcare-gold"
            : "text-darcare-charcoal hover:text-darcare-deepGold"
      )}
    >
      {label}
    </button>
  );
};

export default ServicesPage;
