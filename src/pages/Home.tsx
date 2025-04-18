
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "@/components/BottomNavigation";
import FloatingAction from "@/components/FloatingAction";
import { useToast } from "@/components/ui/use-toast";
import CurrentStay from "@/components/CurrentStay";
import ServicesList from "@/components/ServicesList";
import RecommendationsList from "@/components/RecommendationsList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainHeader from "@/components/MainHeader";

// Create a new query client for this page
const queryClient = new QueryClient();

const Home: React.FC = () => {
  const [currentStay, setCurrentStay] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Fetch user's stay data
        const { data: currentStayData, error: currentStayError } = await supabase
          .from('stays')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'current')
          .maybeSingle();

        if (currentStayError) {
          throw currentStayError;
        }

        if (currentStayData) {
          setCurrentStay(currentStayData);
        } else {
          // If no current stay, check for upcoming stay
          const { data: upcomingStayData, error: upcomingStayError } = await supabase
            .from('stays')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'upcoming')
            .order('check_in', { ascending: true })
            .limit(1)
            .maybeSingle();

          if (upcomingStayError) {
            throw upcomingStayError;
          }

          if (upcomingStayData) {
            setCurrentStay(upcomingStayData);
          }
        }

        // Fetch user's services
        const { data: servicesData, error: servicesError } = await supabase
          .from('service_requests')
          .select(`
            id,
            status,
            preferred_time,
            services (
              name,
              category
            )
          `)
          .eq('user_id', user.id)
          .order('preferred_time', { ascending: false });

        if (servicesError) {
          throw servicesError;
        }

        const formattedServices = servicesData.map(service => ({
          id: service.id,
          title: service.services?.name || 'Unknown Service',
          status: service.status || 'pending',
          time: service.preferred_time ? new Date(service.preferred_time).toLocaleString() : 'Unscheduled',
          staff: "Assigned Staff" // This would ideally come from the database
        }));

        setServices(formattedServices);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Unable to fetch your data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader />

      <div className="pb-24 overflow-auto">
        <CurrentStay currentStay={currentStay} />
        <ServicesList services={services} isLoading={isLoading} />
        
        {/* Wrap RecommendationsList with QueryClientProvider to ensure it has access to the query client */}
        <QueryClientProvider client={queryClient}>
          <RecommendationsList />
        </QueryClientProvider>
      </div>

      <FloatingAction />
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default Home;
