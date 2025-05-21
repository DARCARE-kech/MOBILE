
import React, { useEffect } from "react";
import MainHeader from "@/components/MainHeader";
import BottomNavigation from "@/components/BottomNavigation";
import CurrentStay from "@/components/CurrentStay";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentStay } from "@/hooks/useCurrentStay";
import RecommendationsList from "@/components/RecommendationsList";
import ServicesList from "@/components/ServicesList";
import { useTranslation } from "react-i18next";
import DrawerMenu from "@/components/DrawerMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FloatingAction from "@/components/FloatingAction";
import ShopButton from "@/components/shop/ShopButton";


const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  
  

  
  const { 
    data: currentStay, 
    isLoading: isStayLoading,
    refetch: refetchStay 
  } = useCurrentStay(user?.id);

  const { data: serviceRequests, isLoading: isRequestsLoading } = useQuery({
    queryKey: ['home-service-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      console.log("Fetching service requests for home page, user ID:", user.id);
      
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          services (name, category),
          staff_assignments (
            id,
            staff_id,
            staff_services (
              staff_name
            )
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['pending', 'in_progress', 'active'])
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) {
        console.error("Error fetching service requests for home page:", error);
        throw error;
      }
      
      console.log("Service requests data fetched for home page:", data);
      
      // Transform the data to match the Service interface expected by ServicesList
      return (data || []).map(item => {
        // Process staff assignments to extract staff_name
        const staffAssignments = item.staff_assignments?.map(assignment => ({
          staff_name: assignment.staff_services?.staff_name || null
        })) || [];

        return {
          ...item,
          status: item.status === "pending" || item.status === "active" || 
                  item.status === "completed" || item.status === "cancelled" 
                  ? item.status : "pending",
          staff_assignments: staffAssignments
        };
      });
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-background">
      <MainHeader 
        title="DarCare" 
        drawerContent={<DrawerMenu />}
      />
      
      <div className="pt-20 pb-24">
        <CurrentStay 
          currentStay={currentStay} 
          userId={user?.id} 
          refetchStay={refetchStay}
          isLoading={isStayLoading}
        />
        
        <div className="p-4">
          <ServicesList 
            services={serviceRequests || []} 
            isLoading={isRequestsLoading} 
          />
        </div>
        
        <div className="mt-8">
          <RecommendationsList />
        </div>
      </div>
      
      <ShopButton />
      <FloatingAction />
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default Home;
