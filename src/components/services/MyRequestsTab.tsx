
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, User } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { getStaffAssignmentsForRequest } from '@/integrations/supabase/rpc';
import type { StaffAssignment } from '@/integrations/supabase/rpc';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface Service {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  estimated_duration: string | null;
}

interface ServiceRequest {
  id: string;
  user_id: string | null;
  service_id: string | null;
  preferred_time: string | null;
  status: string | null;
  note: string | null;
  image_url: string | null;
  created_at: string | null;
  services: Service | null;
  staff_assignments: StaffAssignment[] | null;
}

const MyRequestsTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['my-service-requests'],
    queryFn: async () => {
      // Fetch service requests with pending status
      const { data: requestsData, error: requestsError } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*)
        `)
        .in('status', ['pending', 'in_progress'])
        .order('created_at', { ascending: false });
      
      if (requestsError) throw requestsError;
      
      // For each request, fetch staff assignments separately using our updated helper function
      const enhancedRequests = await Promise.all((requestsData || []).map(async (request) => {
        const staffAssignments = await getStaffAssignmentsForRequest(request.id);
        
        return {
          ...request,
          staff_assignments: staffAssignments
        };
      }));
      
      return enhancedRequests as ServiceRequest[];
    }
  });

  const handleRequestClick = (requestId: string) => {
    navigate(`/services/requests/${requestId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  if (error || !requests) {
    return (
      <div className="p-4 text-destructive">
        {t('common.error')} {t('common.fetchDataError')}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className={cn(
          isDarkMode ? "text-darcare-beige/80" : "text-darcare-charcoal/80"
        )}>
          {t('services.noActiveRequests')}
        </p>
        <p className={cn(
          "mt-2",
          isDarkMode ? "text-darcare-beige/60" : "text-darcare-charcoal/60"
        )}>
          {t('services.switchToReserveTab')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {requests?.map(request => (
        <div 
          key={request.id} 
          className="request-card cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleRequestClick(request.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className={cn(
                "font-serif font-medium",
                isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
              )}>
                {request.services?.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-2">
                <div className={cn(
                  "flex items-center gap-1.5 text-xs",
                  isDarkMode ? "text-darcare-beige/70" : "text-darcare-charcoal/70"
                )}>
                  <Clock size={14} className={isDarkMode ? "text-darcare-beige/50" : "text-darcare-deepGold/70"} />
                  <span>
                    {request.preferred_time 
                      ? format(new Date(request.preferred_time), 'PPP p') 
                      : t('services.unscheduled')}
                  </span>
                </div>
              </div>
              
              {request.staff_assignments && request.staff_assignments.length > 0 && (
                <div className={cn(
                  "flex items-center gap-1.5 text-xs mt-1.5",
                  isDarkMode ? "text-darcare-beige/70" : "text-darcare-charcoal/70"
                )}>
                  <User size={14} className={isDarkMode ? "text-darcare-beige/50" : "text-darcare-deepGold/70"} />
                  <span>
                    {request.staff_assignments[0].staff_name || t('services.assigned')}
                  </span>
                </div>
              )}
            </div>
            
            <StatusBadge status={request.status || 'pending'} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyRequestsTab;
