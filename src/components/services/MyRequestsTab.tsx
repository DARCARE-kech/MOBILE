
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, User, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { getStaffAssignmentsForRequest } from '@/integrations/supabase/rpc';
import type { StaffAssignment } from '@/integrations/supabase/rpc';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
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
}

const MyRequestsTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [requestToDelete, setRequestToDelete] = React.useState<string | null>(null);
  
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['my-service-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User ID is required");
      
      // Fetch service requests with pending status for the current user
      const { data: requestsData, error: requestsError } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*)
        `)
        .eq('user_id', user.id) // Filter by the current user's ID
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
        description: "Your service request has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['my-service-requests'] });
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

  const handleEditRequest = (request: ServiceRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!request.service_id) return;
    
    navigate(`/services/${request.service_id}`, { 
      state: { 
        editMode: true,
        requestId: request.id
      }
    });
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
        <Loader2 className={cn(
          "h-8 w-8 animate-spin",
          isDarkMode ? "text-darcare-gold" : "text-secondary"
        )} />
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
        <AlertTriangle className="mx-auto h-10 w-10 text-darcare-gold/70 mb-4" />
        <p className={cn(
          isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"
        )}>
          {t('services.noActiveRequests')}
        </p>
        <p className={cn(
          "mt-2 mb-6",
          isDarkMode ? "text-darcare-beige/60" : "text-foreground/60"
        )}>
          {t('services.switchToReserveTab')}
        </p>
        
        <Button 
          onClick={() => navigate('/services')} 
          className={cn(
            isDarkMode
              ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
              : "bg-secondary text-white hover:bg-secondary/90"
          )}
        >
          Request a Service
        </Button>
      </div>
    );
  }

  return (
    <>
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
                  isDarkMode ? "text-darcare-gold" : "text-primary"
                )}>
                  {request.services?.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className={cn(
                    "flex items-center gap-1.5 text-xs",
                    isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                  )}>
                    <Clock size={14} className={isDarkMode ? "text-darcare-beige/50" : "text-secondary/70"} />
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
                    isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                  )}>
                    <User size={14} className={isDarkMode ? "text-darcare-beige/50" : "text-secondary/70"} />
                    <span>
                      {request.staff_assignments[0].staff_name || t('services.assigned')}
                    </span>
                  </div>
                )}
              </div>
              
              <StatusBadge status={request.status || 'pending'} />
            </div>
            
            <div className={cn(
              "mt-3 pt-3 border-t flex justify-end gap-2",
              isDarkMode ? "border-darcare-gold/10" : "border-primary/10"
            )}>
              <Button
                variant="ghost" 
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  isDarkMode 
                    ? "text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold" 
                    : "text-secondary hover:bg-secondary/10"
                )}
                onClick={(e) => handleEditRequest(request, e)}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              
              <Button
                variant="ghost" 
                size="sm"
                className={cn(
                  "h-8 w-8 p-0",
                  isDarkMode 
                    ? "text-red-400 hover:bg-red-500/10 hover:text-red-500" 
                    : "text-red-500 hover:bg-red-500/10"
                )}
                onClick={(e) => handleDeleteRequest(request.id, e)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
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
              {t('services.deleteWarning', 'Are you sure you want to delete this service request? This action cannot be undone.')}
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

export default MyRequestsTab;
