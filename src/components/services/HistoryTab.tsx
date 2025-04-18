
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const HistoryTab: React.FC = () => {
  const { data: history, isLoading, error, refetch } = useQuery({
    queryKey: ['service-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*),
          staff_assignments(*),
          service_ratings(*)
        `)
        .in('status', ['completed', 'cancelled'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
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
                {new Date(record.preferred_time).toLocaleString()}
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
