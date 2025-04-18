
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReserveServicesTab from "@/components/services/ReserveServicesTab";
import MyRequestsTab from "@/components/services/MyRequestsTab";
import HistoryTab from "@/components/services/HistoryTab";

const ServicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("reserve");

  return (
    <div className="bg-darcare-navy min-h-screen">
      <div className="p-4">
        <h1 className="text-darcare-gold text-2xl font-serif mb-4">Services</h1>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-darcare-navy/20 border border-darcare-gold/20">
            <TabsTrigger 
              value="reserve" 
              className="text-darcare-beige data-[state=active]:bg-darcare-gold data-[state=active]:text-darcare-navy"
            >
              Reserve
            </TabsTrigger>
            <TabsTrigger 
              value="requests" 
              className="text-darcare-beige data-[state=active]:bg-darcare-gold data-[state=active]:text-darcare-navy"
            >
              My Requests
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="text-darcare-beige data-[state=active]:bg-darcare-gold data-[state=active]:text-darcare-navy"
            >
              History
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
    </div>
  );
};

export default ServicesPage;
