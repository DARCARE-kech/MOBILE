
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReserveServicesTab from "@/components/services/ReserveServicesTab";
import MyRequestsTab from "@/components/services/MyRequestsTab";
import HistoryTab from "@/components/services/HistoryTab";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { useTranslation } from "react-i18next";
import FloatingAction from "@/components/FloatingAction";

const ServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("reserve");
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title={t('navigation.services')} />
      <div className="pt-16 pb-24">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-gradient-to-b from-darcare-navy to-[#1C1F2A] border border-darcare-gold/20">
            <TabsTrigger 
              value="reserve" 
              className="text-darcare-beige data-[state=active]:bg-darcare-gold data-[state=active]:text-darcare-navy"
            >
              {t('services.reserve')}
            </TabsTrigger>
            <TabsTrigger 
              value="requests" 
              className="text-darcare-beige data-[state=active]:bg-darcare-gold data-[state=active]:text-darcare-navy"
            >
              {t('services.requests')}
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="text-darcare-beige data-[state=active]:bg-darcare-gold data-[state=active]:text-darcare-navy"
            >
              {t('services.history')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reserve">
            <ReserveServicesTab />
          </TabsContent>
          
          <TabsContent value="requests">
            <MyRequestsTab />
          </TabsContent>
          
          <TabsContent value="history">
            <HistoryTab />
          </TabsContent>
        </Tabs>
      </div>
      <FloatingAction />
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ServicesPage;
