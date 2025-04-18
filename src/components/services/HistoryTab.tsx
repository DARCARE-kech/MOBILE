
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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

interface ServiceRating {
  id: string;
  request_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string | null;
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
  const { data: history, isLoading, error, refetch } = useQuery({
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
      
      // For each request, fetch staff assignments and ratings separately
      const enhancedHistory = await Promise.all((historyData || []).map(async (record) => {
        const { data: staffData } = await supabase
          .from('staff_assignments')
          .select('*')
          .eq('request_id', record.id);
          
        const { data: ratingsData } = await supabase
          .from('service_ratings')
          .select('*')
          .eq('request_id', record.id);
        
        return {
          ...record,
          staff_assignments: staffData || [],
          service_ratings: ratingsData || []
        };
      }));
      
      return enhancedHistory as ServiceRequest[];
    }
  });

  const handleRate = async (requestId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('service_ratings')
        .insert({
          request_id: requestId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          rating
        });

      if (error) throw error;
      
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback",
      });
      
      refetch();
    } catch (err) {
      toast({
        title: "Error submitting rating",
        description: "Please try again later",
        variant: "destructive",
      });
    }
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
      {history.map(record => (
        <Card 
          key={record.id} 
          className="bg-darcare-navy border border-darcare-gold/20 p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-darcare-white font-medium">
                {record.services?.name}
              </h3>
              <p className="text-darcare-beige/70 text-sm mt-1">
                {record.preferred_time ? new Date(record.preferred_time).toLocaleString() : 'Time not specified'}
              </p>
              {record.staff_assignments && record.staff_assignments.length > 0 && (
                <p className="text-darcare-beige text-sm mt-2">
                  Staff: {record.staff_assignments[0].staff_name || 'Assigned'}
                </p>
              )}
            </div>
            <Badge 
              className={
                record.status === 'completed' 
                  ? 'bg-emerald-600'
                  : 'bg-red-600'
              }
            >
              {record.status === 'completed' ? 'Completed' : 'Cancelled'}
            </Badge>
          </div>

          {record.status === 'completed' && 
           (!record.service_ratings || record.service_ratings.length === 0) && (
            <div className="mt-3 flex justify-end">
              <Button 
                size="sm" 
                className="bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
                onClick={() => handleRate(record.id, 5)}
              >
                <Star className="mr-1 h-4 w-4" />
                Rate
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default HistoryTab;
