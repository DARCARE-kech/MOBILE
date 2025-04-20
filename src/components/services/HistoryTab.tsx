
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { getStaffAssignmentsForRequest, getServiceRatingsForRequest } from '@/integrations/supabase/rpc';
import type { StaffAssignment, ServiceRating } from '@/integrations/supabase/rpc';
import StatusBadge from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { RatingStars } from '@/components/RatingStars';

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
  
  const { data: history, isLoading, error } = useQuery({
    queryKey: ['service-history'],
    queryFn: async () => {
      // Fetch service requests with completed or cancelled status
      const { data: historyData, error: historyError } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*)
        `)
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
    }
  });

  const handleRequestClick = (requestId: string) => {
    navigate(`/services/requests/${requestId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  if (error || !history) {
    return (
      <div className="p-4 text-destructive">
        Error loading history. Please try again.
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-6 text-center text-darcare-beige/80">
        <p>You don't have any service history yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {history?.map(record => (
        <Card 
          key={record.id} 
          className="bg-darcare-navy border border-darcare-gold/20 p-4 cursor-pointer hover:border-darcare-gold/40 transition-colors"
          onClick={() => handleRequestClick(record.id)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-darcare-white font-medium">
                {record.services?.name}
              </h3>
              <p className="text-darcare-beige/70 text-sm mt-1">
                {record.preferred_time ? format(new Date(record.preferred_time), 'PPP p') : 'Time not specified'}
              </p>
              {record.staff_assignments && record.staff_assignments.length > 0 && (
                <p className="text-darcare-beige text-sm mt-2">
                  Staff: {record.staff_assignments[0].staff_name || 'Assigned'}
                </p>
              )}
            </div>
            <StatusBadge status={record.status || 'completed'} />
          </div>

          {record.status === 'completed' && record.service_ratings && record.service_ratings.length > 0 && (
            <div className="mt-3 pt-3 border-t border-darcare-gold/10 flex items-center">
              <RatingStars rating={record.service_ratings[0].rating} />
              <span className="text-darcare-beige/70 text-sm ml-2">Rated</span>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default HistoryTab;
