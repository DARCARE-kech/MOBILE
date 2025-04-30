
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, User } from 'lucide-react';
import { getStaffAssignmentsForRequest, getServiceRatingsForRequest } from '@/integrations/supabase/rpc';
import type { StaffAssignment, ServiceRating } from '@/integrations/supabase/rpc';
import StatusBadge from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { RatingStars } from '@/components/RatingStars';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

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
  service_ratings: ServiceRating[] | null;
}

const HistoryTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  
  const { data: history, isLoading, error } = useQuery({
    queryKey: ['service-history', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User ID is required");
      
      // Fetch service requests with completed or cancelled status for the current user
      const { data: historyData, error: historyError } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*)
        `)
        .eq('user_id', user.id) // Filter by the current user's ID
        .in('status', ['completed', 'cancelled'])
        .order('created_at', { ascending: false });
      
      if (historyError) throw historyError;
      
      // For each request, fetch staff assignments and ratings separately using our helper functions
      const enhancedHistory = await Promise.all((historyData || []).map(async (record) => {
        // Fetch staff assignments using our helper
        const staffAssignments = await getStaffAssignmentsForRequest(record.id);
        
        // Fetch service ratings using our helper
        const serviceRatings = await getServiceRatingsForRequest(record.id);
        
        return {
          ...record,
          staff_assignments: staffAssignments,
          service_ratings: serviceRatings
        };
      }));
      
      return enhancedHistory as ServiceRequest[];
    },
    enabled: !!user?.id
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

  if (error || !history) {
    return (
      <div className="p-4 text-destructive">
        {t('common.error')} {t('common.fetchDataError')}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className={cn(
          isDarkMode ? "text-darcare-beige/80" : "text-darcare-charcoal/80"
        )}>
          {t('services.noHistoryYet')}
        </p>
        <p className={cn(
          "mt-2 mb-6",
          isDarkMode ? "text-darcare-beige/60" : "text-darcare-charcoal/60"
        )}>
          {t('services.switchToReserveTab')}
        </p>
        
        <Button 
          onClick={() => navigate('/services')} 
          className={cn(
            isDarkMode
              ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          Request a Service
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {history?.map(record => (
        <div 
          key={record.id} 
          className="request-card cursor-pointer hover:shadow-md transition-all duration-200"
          onClick={() => handleRequestClick(record.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className={cn(
                "font-serif font-medium",
                isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
              )}>
                {record.services?.name}
              </h3>
              
              <div className="flex items-center gap-2 mt-2">
                <div className={cn(
                  "flex items-center gap-1.5 text-xs",
                  isDarkMode ? "text-darcare-beige/70" : "text-darcare-charcoal/70"
                )}>
                  <Clock size={14} className={isDarkMode ? "text-darcare-beige/50" : "text-darcare-deepGold/70"} />
                  <span>
                    {record.preferred_time 
                      ? format(new Date(record.preferred_time), 'PPP p') 
                      : t('services.unscheduled')}
                  </span>
                </div>
              </div>
              
              {record.staff_assignments && record.staff_assignments.length > 0 && (
                <div className={cn(
                  "flex items-center gap-1.5 text-xs mt-1.5",
                  isDarkMode ? "text-darcare-beige/70" : "text-darcare-charcoal/70"
                )}>
                  <User size={14} className={isDarkMode ? "text-darcare-beige/50" : "text-darcare-deepGold/70"} />
                  <span>
                    {record.staff_assignments[0].staff_name || t('services.assigned')}
                  </span>
                </div>
              )}
            </div>
            
            <StatusBadge status={record.status || 'completed'} />
          </div>

          {record.status === 'completed' && record.service_ratings && record.service_ratings.length > 0 && (
            <div className={cn(
              "mt-3 pt-3 border-t flex items-center",
              isDarkMode ? "border-darcare-gold/10" : "border-darcare-deepGold/10"
            )}>
              <RatingStars rating={record.service_ratings[0].rating} />
              <span className={cn(
                "text-sm ml-2",
                isDarkMode ? "text-darcare-beige/70" : "text-darcare-charcoal/70"
              )}>
                {t('services.rated')}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HistoryTab;
