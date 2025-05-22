
import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import MyRequestsTab from "@/components/services/MyRequestsTab";
import FloatingAction from "@/components/FloatingAction";
import ShopButton from "@/components/shop/ShopButton";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InternalServicesTab from "@/components/services/InternalServicesTab";
import ExternalServicesTab from "@/components/services/ExternalServicesTab";

const ServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("services");
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const location = useLocation();

  // Check if we have a specified active tab from navigation
  useEffect(() => {
    if (location.state && location.state.activeTab) {
      // Map the old tab names to the new ones
      const tabMapping: Record<string, string> = {
        "invilla": "services",
        "leisure": "external",
        "requests": "requests"
      };
      
      const newTabName = tabMapping[location.state.activeTab] || location.state.activeTab;
      setActiveTab(newTabName);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title={t('navigation.services')} 
      />
      
      <div className="pt-16 pb-20">
        <div className="px-2 mb-1">
          <Tabs 
            defaultValue="services" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className={cn(
              "w-full grid grid-cols-3 rounded-full p-0.5", 
              isDarkMode 
                ? "bg-white/5 backdrop-blur-sm" 
                : "bg-white/80 border border-darcare-deepGold/10 shadow-sm"
            )}>
              <TabsTrigger 
                value="services"
                className={cn(
                  "rounded-full text-xs font-medium transition-all duration-200", 
                  activeTab === "services" 
                    ? isDarkMode 
                      ? "bg-darcare-gold text-darcare-navy" 
                      : "bg-darcare-deepGold text-white"
                    : isDarkMode
                      ? "text-darcare-beige hover:text-darcare-gold" 
                      : "text-darcare-charcoal hover:text-darcare-deepGold"
                )}
              >
                {t('services.services', 'Services')}
              </TabsTrigger>
              <TabsTrigger 
                value="external"
                className={cn(
                  "rounded-full text-xs font-medium transition-all duration-200",
                  activeTab === "external" 
                    ? isDarkMode 
                      ? "bg-darcare-gold text-darcare-navy" 
                      : "bg-darcare-deepGold text-white"
                    : isDarkMode
                      ? "text-darcare-beige hover:text-darcare-gold" 
                      : "text-darcare-charcoal hover:text-darcare-deepGold"
                )}
              >
                {t('services.external', 'External')}
              </TabsTrigger>
              <TabsTrigger 
                value="requests"
                className={cn(
                  "rounded-full text-xs font-medium transition-all duration-200", 
                  activeTab === "requests" 
                    ? isDarkMode 
                      ? "bg-darcare-gold text-darcare-navy" 
                      : "bg-darcare-deepGold text-white"
                    : isDarkMode
                      ? "text-darcare-beige hover:text-darcare-gold" 
                      : "text-darcare-charcoal hover:text-darcare-deepGold"
                )}
              >
                {t('services.requests', 'Requests')}
              </TabsTrigger>
            </TabsList>

            <div className="mt-1">
              <TabsContent value="services" className="mt-0">
                <InternalServicesTab />
              </TabsContent>
              <TabsContent value="external" className="mt-0">
                <ExternalServicesTab />
              </TabsContent>
              <TabsContent value="requests" className="mt-0">
                <MyRequestsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      <ShopButton />
      <FloatingAction />
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ServicesPage;
