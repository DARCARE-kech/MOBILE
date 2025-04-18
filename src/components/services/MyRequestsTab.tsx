
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface StaffAssignment {
  id: string;
  request_id: string;
  staff_id: string | null;
  staff_name: string | null;
  assigned_at: string;
}

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
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (requestsError) throw requestsError;
      
      // For each request, fetch staff assignments separately
      const enhancedRequests = await Promise.all((requestsData || []).map(async (request) => {
        const { data: staffData } = await supabase
          .from('staff_assignments')
          .select('*')
          .eq('request_id', request.id);
          
        return {
          ...request,
          staff_assignments: staffData || []
        };
      }));
      
      return enhancedRequests as ServiceRequest[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }

  if (error || !requests) {
    return (
      <div className="p-4 text-destructive">
        Error loading requests. Please try again.
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-6 text-center text-darcare-beige/80">
        <p>You don't have any active service requests.</p>
        <p className="mt-2">Switch to the Reserve tab to request a service.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {requests.map(request => (
        <Card 
          key={request.id} 
          className="bg-darcare-navy border border-darcare-gold/20 p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-darcare-white font-medium">
                {request.services?.name}
              </h3>
              <p className="text-darcare-beige/70 text-sm mt-1">
                {request.preferred_time ? new Date(request.preferred_time).toLocaleString() : 'Time not specified'}
              </p>
              {request.staff_assignments && request.staff_assignments.length > 0 && (
                <p className="text-darcare-beige text-sm mt-2">
                  Staff: {request.staff_assignments[0].staff_name || 'Assigned'}
                </p>
              )}
            </div>
            <Badge 
              className={
                request.status === 'active' 
                  ? 'bg-emerald-600'
                  : 'bg-amber-600'
              }
            >
              {request.status === 'active' ? 'Active' : 'Pending'}
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MyRequestsTab;
