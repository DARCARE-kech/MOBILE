
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import DrawerMenu from "@/components/DrawerMenu";
import BottomNavigation from "@/components/BottomNavigation";
import FloatingAction from "@/components/FloatingAction";
import { useToast } from "@/components/ui/use-toast";
import CurrentStay from "@/components/CurrentStay";
import ServicesList from "@/components/ServicesList";
import RecommendationsList from "@/components/RecommendationsList";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [currentStay, setCurrentStay] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const linkDemoData = async () => {
      try {
        // Call the function to link demo data to the current user
        const { data, error } = await supabase.rpc('link_demo_data_to_user', {
          user_uuid: user.id
        });

        if (error) {
          console.error('Error linking demo data:', error);
        } else {
          console.log('Demo data linked successfully:', data);
        }

        // Now fetch the user's data
        await fetchUserData();
      } catch (error) {
        console.error('Error in linkDemoData:', error);
        toast({
          title: "Error",
          description: "Unable to link demo data",
          variant: "destructive"
        });
      }
    };

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

    linkDemoData();
  }, [user, toast]);

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-darcare-navy">
      <header className="p-4 flex justify-between items-center border-b border-darcare-gold/20">
        <DrawerMenu onLogout={handleLogout} />
        <Logo size="sm" color="gold" />
        <div className="w-10 h-10 rounded-full bg-darcare-gold/10 border border-darcare-gold/30 flex items-center justify-center text-darcare-beige">
          <User size={20} />
        </div>
      </header>

      <div className="pb-24 overflow-auto">
        <CurrentStay currentStay={currentStay} />
        <ServicesList services={services} isLoading={isLoading} />
        <RecommendationsList />
      </div>

      <FloatingAction />
      <BottomNavigation activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
};

export default Home;
