
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

      // Fetch service requests (excluding Shop services) for today only with LEFT JOIN
      const { data: services, error: serviceError } = await supabase
        .from('service_requests')
        .select(`
          *,
          services!inner (name, category),
          staff_assignments (
            id,
            staff_id,
            staff_services (staff_name)
          )
        `)
        .eq('user_id', user.id)
        .in('status', ['pending', 'in_progress', 'active'])
        .neq('services.name', 'Shop')
        .gte('preferred_time', startOfDay.toISOString())
        .lte('preferred_time', endOfDay.toISOString())
        .order('preferred_time', { ascending: true });

      // Fetch space reservations for today only
      const { data: spaces, error: spaceError } = await supabase
        .from('space_reservations')
        .select(`
          *,
          spaces!space_reservations_space_id_fkey (name)
        `)
        .eq('user_id', user.id)
        .in('status', ['pending'])
        .gte('preferred_time', startOfDay.toISOString())
        .lte('preferred_time', endOfDay.toISOString())
        .order('preferred_time', { ascending: true });

      if (serviceError) {
        console.error("Error fetching service requests:", serviceError);
      }
      if (spaceError) {
        console.error("Error fetching space reservations:", spaceError);
      }

      console.log("Raw service requests fetched:", services);
      console.log("Raw space reservations fetched:", spaces);

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
          status: item.status === "pending" || item.status === "active" || item.status === "in_progress" || 
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

      // Combine and sort by preferred_time, then creation date
      const allRequests = [...transformedServices, ...transformedSpaces];
      
      const sortedRequests = allRequests.sort((a, b) => {
        // Sort by preferred_time first
        if (a.preferred_time && b.preferred_time) {
          return new Date(a.preferred_time).getTime() - new Date(b.preferred_time).getTime();
        }
        
        // If one has preferred_time and other doesn't, prioritize the one with preferred_time
        if (a.preferred_time && !b.preferred_time) return -1;
        if (!a.preferred_time && b.preferred_time) return 1;
        
        // Finally sort by creation date
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      });

      // Limit to 3 items
      const limitedRequests = sortedRequests.slice(0, 3);
      
      console.log("Today's schedule data fetched for home page (today only, excluding Shop):", limitedRequests);
      console.log("Transformed services:", transformedServices);
      console.log("Transformed spaces:", transformedSpaces);
      
      return limitedRequests;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="min-h-screen bg-background mobile-safe-area">
      <MainHeader 
         renderTitle={() => (
    <div className="flex flex-col leading-tight">
      <span className="text-darcare-gold text-base font-serif font-bold tracking-wide">
        DARCARE
      </span>
      <span className="text-darcare-beige text-[11px] font-light">
        by The View
      </span>
    </div>
      />
      
      <div className="pt-16 pb-24 px-2 overflow-hidden">
        <CurrentStay 
          currentStay={currentStay} 
          userId={user?.id} 
          refetchStay={refetchStay}
          isLoading={isStayLoading}
        />
        
        <div className="px-1 py-1">
          <ServicesList 
            services={todaysSchedule || []} 
            isLoading={isScheduleLoading} 
          />
        </div>
        
        <div className="mt-2">
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
