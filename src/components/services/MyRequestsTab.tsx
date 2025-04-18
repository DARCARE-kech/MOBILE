
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const MyRequestsTab: React.FC = () => {
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['my-service-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*),
          staff_assignments(*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
                {new Date(request.preferred_time).toLocaleString()}
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
