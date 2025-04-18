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
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const services = [
    {
      id: "1",
      title: "Breakfast Service",
      status: "active" as const,
      time: "8:00 AM",
      staff: "Amina",
    },
    {
      id: "2",
      title: "Pool Cleaning",
      status: "completed" as const,
      time: "Yesterday",
      staff: "Mohammed",
    },
    {
      id: "3",
      title: "Spa Treatment",
      status: "pending" as const,
      time: "Today, 4:00 PM",
      staff: "Yasmine",
    },
  ];

  const recommendations = [
    {
      id: "1",
      title: "Jardin Majorelle",
      image: "https://images.unsplash.com/photo-1539020140153-e8c8d4592cac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      type: "Attraction",
      rating: 4.8,
    },
    {
      id: "2",
      title: "La Mamounia",
      image: "https://images.unsplash.com/photo-1589384267710-7a170981ca78?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      type: "Dining",
      rating: 4.9,
    },
    {
      id: "3",
      title: "Medina Tour",
      image: "https://images.unsplash.com/photo-1539094437705-1e048cf70c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      type: "Experience",
      rating: 4.7,
    },
    {
      id: "4",
      title: "Atlas Mountains",
      image: "https://images.unsplash.com/photo-1565689478471-3174c495213f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      type: "Excursion",
      rating: 4.9,
    },
  ];

  useEffect(() => {
    const fetchUserStay = async () => {
      if (!user) return;

      try {
        const { data: currentStayData, error: currentStayError } = await supabase
          .from('stays')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'current')
          .single();

        if (currentStayError && currentStayError.code !== 'PGRST116') {
          throw currentStayError;
        }

        if (currentStayData) {
          setCurrentStay(currentStayData);
          return;
        }

        const { data: upcomingStayData, error: upcomingStayError } = await supabase
          .from('stays')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'upcoming')
          .order('check_in', { ascending: true })
          .limit(1)
          .single();

        if (upcomingStayError && upcomingStayError.code !== 'PGRST116') {
          throw upcomingStayError;
        }

        if (upcomingStayData) {
          setCurrentStay(upcomingStayData);
        }
      } catch (error) {
        console.error('Error fetching stay:', error);
        toast({
          title: "Error",
          description: "Unable to fetch stay information",
          variant: "destructive"
        });
      }
    };

    fetchUserStay();
  }, [user]);

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
        <ServicesList services={services} />
        <RecommendationsList recommendations={recommendations} />
      </div>

      <FloatingAction />
      <BottomNavigation activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
};

export default Home;
