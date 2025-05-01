
import React from "react";
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

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { 
    data: currentStay, 
    isLoading: isStayLoading,
    refetch: refetchStay 
  } = useCurrentStay(user?.id);

  const { data: serviceRequests, isLoading: isRequestsLoading } = useQuery({
    queryKey: ['service-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          services (name, category),
          staff_assignments (staff_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      // Convert to Service type with correct status handling
      return (data || []).map(item => ({
        ...item,
        // Convert status to a valid enum value or default to "pending"
        status: item.status === "pending" || item.status === "active" || 
               item.status === "completed" || item.status === "cancelled" 
               ? item.status : "pending"
      }));
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
        
        <div className="p-4">
          <RecommendationsList />
        </div>
      </div>
      
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default Home;
