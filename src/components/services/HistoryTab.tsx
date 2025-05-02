
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, User, Eye, Trash2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  space_id?: string | null;
}

const HistoryTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [requestToDelete, setRequestToDelete] = React.useState<string | null>(null);
  
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

  // Mutation to delete a service request
  const deleteMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('service_requests')
        .delete()
        .eq('id', requestId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Request deleted",
        description: "The service request has been removed from your history",
      });
      queryClient.invalidateQueries({ queryKey: ['service-history'] });
      setRequestToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: "Could not delete the request. Please try again.",
        variant: "destructive",
      });
      setRequestToDelete(null);
    }
  });

  const handleRequestClick = (requestId: string) => {
    navigate(`/services/requests/${requestId}`);
  };

  const handleDeleteRequest = (requestId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRequestToDelete(requestId);
  };

  const confirmDelete = () => {
    if (requestToDelete) {
      deleteMutation.mutate(requestToDelete);
    }
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
    <>
      <div className="space-y-2 p-2">
        {history?.map(record => (
          <div 
            key={record.id} 
            className={cn(
              "request-card cursor-pointer transition-all duration-200 p-3 rounded-lg border",
              isDarkMode 
                ? "border-darcare-gold/10 hover:border-darcare-gold/20 bg-darcare-navy/60" 
                : "border-primary/5 hover:border-primary/10 bg-card shadow-sm"
            )}
            onClick={() => handleRequestClick(record.id)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-medium truncate",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {record.services?.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    isDarkMode ? "text-darcare-beige/70" : "text-darcare-charcoal/70"
                  )}>
                    <Clock size={12} className={isDarkMode ? "text-darcare-beige/50" : "text-darcare-deepGold/70"} />
                    <span className="truncate">
                      {record.preferred_time 
                        ? format(new Date(record.preferred_time), 'MMM d, p') 
                        : t('services.unscheduled')}
                    </span>
                  </div>
                </div>
              </div>
              
              <StatusBadge status={record.status || 'completed'} />
            </div>

            {record.status === 'completed' && record.service_ratings && record.service_ratings.length > 0 && (
              <div className="mt-1.5 flex items-center">
                <RatingStars rating={record.service_ratings[0].rating} size="sm" />
              </div>
            )}
            
            <div className={cn(
              "mt-2 pt-2 border-t flex justify-between items-center",
              isDarkMode ? "border-darcare-gold/10" : "border-darcare-deepGold/10"
            )}>
              {record.staff_assignments && record.staff_assignments.length > 0 ? (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isDarkMode ? "text-darcare-beige/70" : "text-darcare-charcoal/70"
                )}>
                  <User size={12} className={isDarkMode ? "text-darcare-beige/50" : "text-darcare-deepGold/70"} />
                  <span className="truncate">
                    {record.staff_assignments[0].staff_name || t('services.assigned')}
                  </span>
                </div>
              ) : (
                <div className="flex-1"></div>
              )}
              
              <div className="flex gap-1">
                <Button
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0",
                    isDarkMode 
                      ? "text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold" 
                      : "text-darcare-deepGold hover:bg-darcare-deepGold/10"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequestClick(record.id);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="sr-only">View</span>
                </Button>
                
                <Button
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "h-7 w-7 p-0",
                    isDarkMode 
                      ? "text-red-400 hover:bg-red-500/10 hover:text-red-500" 
                      : "text-red-500 hover:bg-red-500/10"
                  )}
                  onClick={(e) => handleDeleteRequest(record.id, e)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <AlertDialog open={!!requestToDelete} onOpenChange={() => setRequestToDelete(null)}>
        <AlertDialogContent className={isDarkMode ? "bg-darcare-navy border-darcare-gold/20" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isDarkMode ? "text-darcare-gold" : ""}>
              {t('services.confirmDelete', 'Confirm Deletion')}
            </AlertDialogTitle>
            <AlertDialogDescription className={isDarkMode ? "text-darcare-beige/70" : ""}>
              {t('services.deleteHistoryWarning', 'Are you sure you want to delete this service request from your history? This action cannot be undone.')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isDarkMode ? "text-darcare-beige bg-darcare-navy/50 border-darcare-gold/20 hover:bg-darcare-navy/70" : ""}>
              {t('common.cancel', 'Cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={confirmDelete}
            >
              {t('common.delete', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HistoryTab;
