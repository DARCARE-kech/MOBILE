
import React, { useEffect } from "react";
import MainHeader from "@/components/MainHeader";
import BottomNavigation from "@/components/BottomNavigation";
import CurrentStay from "@/components/CurrentStay";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentStay } from "@/hooks/useCurrentStay";
import RecommendationsList from "@/components/RecommendationsList";
import ServicesList from "@/components/ServicesList";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FloatingAction from "@/components/FloatingAction";
import ShopButton from "@/components/shop/ShopButton";

// Unified request type for today's schedule
type UnifiedRequest = {
  id: string;
  type: 'service' | 'space';
  name: string;
  preferred_time: string | null;
  status: string;
  created_at: string | null;
  staff_assignments?: { 
    staff_id?: string | null;
    staff_name?: string | null;
  }[] | null;
  services?: {
    name?: string;
    category?: string;
  } | null;
  service_id?: string | null;
  space_id?: string | null;
};

const Home: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { 
    data: currentStay, 
    isLoading: isStayLoading,
    refetch: refetchStay 
  } = useCurrentStay(user?.id);

  // Unified query for today's schedule (services + spaces)
  const { data: todaysSchedule, isLoading: isScheduleLoading } = useQuery({
    queryKey: ['todays-schedule', user?.id],
    queryFn: async (): Promise<UnifiedRequest[]> => {
      if (!user?.id) return [];
      
      console.log("Fetching unified schedule for home page, user ID:", user.id);
      
      // Get today's date range
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      // Fetch service requests (excluding Shop services)
      const { data: services, error: serviceError } = await supabase
        .from('service_requests')
        .select(`
          *,
          services!inner (name, category),
          staff_assignments!inner (
            id,
            staff_id,
            staff_services (staff_name)
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['pending', 'in_progress', 'active'])
        .neq('services.name', 'Shop')
        .order('created_at', { ascending: false });

      // Fetch space reservations with proper column hinting
      const { data: spaces, error: spaceError } = await supabase
        .from('space_reservations')
        .select(`
          *,
          spaces!space_reservations_space_id_fkey (name)
        `)
        .eq('user_id', user.id)
        .in('status', ['pending'])
        .order('created_at', { ascending: false });

      if (serviceError || spaceError) {
        console.error("Error fetching schedule:", serviceError || spaceError);
        throw serviceError || spaceError;
      }

      // Transform services
      const transformedServices: UnifiedRequest[] = (services || []).map(item => {
        const transformedStaffAssignments = item.staff_assignments?.map(assignment => ({
          ...assignment,
          staff_name: assignment.staff_services?.staff_name || null
        })) || [];
        
        return {
          id: item.id,
          type: 'service' as const,
          name: item.services?.name || 'Service',
          preferred_time: item.preferred_time,
          status: item.status === "pending" || item.status === "active" || 
                 item.status === "completed" || item.status === "cancelled" 
                 ? item.status : "pending",
          created_at: item.created_at,
          staff_assignments: transformedStaffAssignments,
          services: item.services,
          service_id: item.service_id
        };
      });

      // Transform spaces
      const transformedSpaces: UnifiedRequest[] = (spaces || []).map(item => ({
        id: item.id,
        type: 'space' as const,
        name: item.spaces?.name || 'Space',
        preferred_time: item.preferred_time,
        status: item.status || 'pending',
        created_at: item.created_at,
        space_id: item.space_id
      }));

      // Combine and sort: prioritize today's schedule, then by creation date
      const allRequests = [...transformedServices, ...transformedSpaces];
      
      const sortedRequests = allRequests.sort((a, b) => {
        // Check if preferred_time is today
        const aIsToday = a.preferred_time && 
          new Date(a.preferred_time) >= startOfDay && 
          new Date(a.preferred_time) <= endOfDay;
        const bIsToday = b.preferred_time && 
          new Date(b.preferred_time) >= startOfDay && 
          new Date(b.preferred_time) <= endOfDay;

        // Prioritize today's schedule
        if (aIsToday && !bIsToday) return -1;
        if (!aIsToday && bIsToday) return 1;

        // If both are today or both are not today, sort by preferred_time then creation date
        if (a.preferred_time && b.preferred_time) {
          return new Date(a.preferred_time).getTime() - new Date(b.preferred_time).getTime();
        }
        
        // Finally sort by creation date
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });

      // Limit to 3 items
      const limitedRequests = sortedRequests.slice(0, 3);
      
      console.log("Unified schedule data fetched for home page (excluding Shop):", limitedRequests);
      return limitedRequests;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-background mobile-safe-area">
      <MainHeader 
        title="The View"
        showWeather={true}
        showNotifications={true}
        showFavorite={true}
      />
      
      <div className="mobile-content-padding overflow-hidden">
        <CurrentStay 
          currentStay={currentStay} 
          userId={user?.id} 
          refetchStay={refetchStay}
          isLoading={isStayLoading}
        />
        
        <div className="px-4 py-2">
          <ServicesList 
            services={todaysSchedule || []} 
            isLoading={isScheduleLoading} 
          />
        </div>
        
        <div className="mt-4">
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
