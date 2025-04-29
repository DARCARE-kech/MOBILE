
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
import AppHeader from "@/components/AppHeader";
import { useTranslation } from "react-i18next";

const Home: React.FC = () => {
  const [currentStay, setCurrentStay] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      setIsLoading(true);
      try {
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

        const { data: requestsData, error: requestsError } = await supabase
          .from('service_requests')
          .select(`
            id,
            status,
            preferred_time,
            services (
              name,
              category
            ),
            staff_assignments (
              staff_name
            )
          `)
          .in('status', ['pending', 'in_progress'])
          .order('created_at', { ascending: false })
          .limit(3);

        if (requestsError) {
          throw requestsError;
        }

        const formattedServices = requestsData.map(request => ({
          id: request.id,
          title: request.services?.name || t('common.unknownService'),
          status: request.status || 'pending',
          time: request.preferred_time ? new Date(request.preferred_time).toLocaleString() : t('services.unscheduled'),
          staff: request.staff_assignments && request.staff_assignments[0]
            ? request.staff_assignments[0].staff_name
            : t('services.unassigned')
        }));

        setServices(formattedServices);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: t('common.error'),
          description: t('common.fetchDataError'),
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast, t]);

  return (
    <div className="min-h-screen bg-darcare-navy">
      <AppHeader />
      <div className="pt-16 pb-24 overflow-auto">
        <CurrentStay currentStay={currentStay} />
        <ServicesList services={services} isLoading={isLoading} />
        <RecommendationsList />
      </div>
      <FloatingAction />
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default Home;
