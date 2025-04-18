import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Calendar, Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import DrawerMenu from "@/components/DrawerMenu";
import BottomNavigation from "@/components/BottomNavigation";
import FloatingAction from "@/components/FloatingAction";
import StatusBadge from "@/components/StatusBadge";
import { useToast } from "@/components/ui/use-toast";

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
        <div className="p-4">
          {currentStay ? (
            <div className="luxury-card">
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-serif text-darcare-gold text-xl">{currentStay.villa_number}</h2>
                <div className="flex items-center gap-1 text-sm bg-darcare-gold/10 rounded-full px-3 py-1 text-darcare-gold">
                  <Calendar size={14} />
                  <span>
                    {currentStay.status === 'current' 
                      ? 'Currently Staying' 
                      : 'Upcoming Stay'}
                  </span>
                </div>
              </div>
              <p className="text-darcare-beige/80 text-sm mb-2">{currentStay.city}</p>
              <div className="flex justify-between text-sm text-darcare-white">
                <span>{`${new Date(currentStay.check_in).toLocaleDateString()} - ${new Date(currentStay.check_out).toLocaleDateString()}`}</span>
                <button className="text-darcare-gold flex items-center gap-1">
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="luxury-card text-center text-darcare-beige/70">
              <p>You have no stays registered yet. Please contact administration or make a booking.</p>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Your Services</h2>
            <button className="text-darcare-gold text-sm flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="luxury-card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-darcare-white mb-1">{service.title}</h3>
                    <p className="text-sm text-darcare-beige/70">{service.time}</p>
                  </div>
                  <StatusBadge status={service.status} />
                </div>
                <div className="mt-3 pt-3 border-t border-darcare-gold/10 flex items-center gap-2 text-sm text-darcare-beige/70">
                  <User size={14} className="text-darcare-gold" />
                  <span>Staff: {service.staff}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Marrakech Highlights</h2>
            <button className="text-darcare-gold text-sm flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {recommendations.map((item) => (
              <div key={item.id} className="min-w-[220px] rounded-xl overflow-hidden flex-shrink-0">
                <div className="h-32 relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-darcare-gold/90 text-darcare-navy rounded-full py-0.5 px-2 text-xs font-medium flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <div className="p-3 bg-card">
                  <h3 className="font-medium text-darcare-white">{item.title}</h3>
                  <p className="text-xs text-darcare-beige/70">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <FloatingAction />

      <BottomNavigation activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
};

export default Home;
