
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import MyRequestsTab from "@/components/services/MyRequestsTab";
import FloatingAction from "@/components/FloatingAction";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import DrawerMenu from "@/components/DrawerMenu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HouseholdTab from "@/components/services/HouseholdTab";
import LifestyleTab from "@/components/services/LifestyleTab";

const ServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("household");
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title={t('navigation.services')} 
        drawerContent={<DrawerMenu />}
      />
      
      <div className="pt-20 pb-24"> {/* Padding to prevent header overlap */}
        <div className="px-4 mb-4">
          <Tabs 
            defaultValue="household" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className={cn(
              "w-full grid grid-cols-3 rounded-full p-1",
              isDarkMode 
                ? "bg-white/5 backdrop-blur-sm" 
                : "bg-white/80 border border-darcare-deepGold/10 shadow-sm"
            )}>
              <TabsTrigger 
                value="household"
                className={cn(
                  "rounded-full text-sm font-medium transition-all duration-200",
                  activeTab === "household" 
                    ? isDarkMode 
                      ? "bg-darcare-gold text-darcare-navy" 
                      : "bg-darcare-deepGold text-white"
                    : isDarkMode
                      ? "text-darcare-beige hover:text-darcare-gold" 
                      : "text-darcare-charcoal hover:text-darcare-deepGold"
                )}
              >
                {t('services.household')}
              </TabsTrigger>
              <TabsTrigger 
                value="lifestyle"
                className={cn(
                  "rounded-full text-sm font-medium transition-all duration-200",
                  activeTab === "lifestyle" 
                    ? isDarkMode 
                      ? "bg-darcare-gold text-darcare-navy" 
                      : "bg-darcare-deepGold text-white"
                    : isDarkMode
                      ? "text-darcare-beige hover:text-darcare-gold" 
                      : "text-darcare-charcoal hover:text-darcare-deepGold"
                )}
              >
                {t('services.lifestyle')}
              </TabsTrigger>
              <TabsTrigger 
                value="requests"
                className={cn(
                  "rounded-full text-sm font-medium transition-all duration-200",
                  activeTab === "requests" 
                    ? isDarkMode 
                      ? "bg-darcare-gold text-darcare-navy" 
                      : "bg-darcare-deepGold text-white"
                    : isDarkMode
                      ? "text-darcare-beige hover:text-darcare-gold" 
                      : "text-darcare-charcoal hover:text-darcare-deepGold"
                )}
              >
                {t('services.requests')}
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="household" className="mt-0">
                <HouseholdTab />
              </TabsContent>
              <TabsContent value="lifestyle" className="mt-0">
                <LifestyleTab />
              </TabsContent>
              <TabsContent value="requests" className="mt-0">
                <MyRequestsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      
      <FloatingAction />
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ServicesPage;
