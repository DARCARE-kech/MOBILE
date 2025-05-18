
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Clock, User, Pencil, Trash2, AlertTriangle, History } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';
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
  space_id?: string | null;
}

const MyRequestsTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [requestToDelete, setRequestToDelete] = React.useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['my-service-requests', user?.id, showHistory],
    queryFn: async () => {
      if (!user?.id) throw new Error("User ID is required");
      
      console.log("Fetching service requests for user:", user.id);
      
      // Filter requests based on showHistory flag
      const statusFilter = showHistory 
        ? ['completed', 'cancelled'] // History view: only completed and cancelled
        : ['pending', 'in_progress']; // Active view: only pending and in_progress
      
      const { data: requestsData, error: requestsError } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*)
        `)
        .eq('user_id', user.id) // Filter by the current user's ID
        .in('status', statusFilter)
        .order('created_at', { ascending: false });
      
      if (requestsError) {
        console.error('Error fetching service requests:', requestsError);
        throw requestsError;
      }
      
      console.log("Service requests data:", requestsData);
      
      // For each request, fetch staff assignments separately using our helper function
      const enhancedRequests = await Promise.all((requestsData || []).map(async (request) => {
        const staffAssignments = await getStaffAssignmentsForRequest(request.id);
        
        return {
          ...request,
          staff_assignments: staffAssignments
        };
      }));
      
      return enhancedRequests as ServiceRequest[];
    },
    enabled: !!user?.id,
    retry: 1
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
        title: t('services.requestDeleted', "Request deleted"),
        description: t('services.requestDeletedDesc', "Your service request has been successfully deleted"),
      });
      queryClient.invalidateQueries({ queryKey: ['my-service-requests'] });
      setRequestToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting request:', error);
      toast({
        title: t('common.error', "Error"),
        description: t('services.deleteErrorDesc', "Could not delete the request. Please try again."),
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
    
    // Handle navigation based on service type or space_id
    if (request.space_id) {
      // If it's a space booking request
      navigate(`/services/space/${request.space_id}`, {
        state: {
          editMode: true,
          requestId: request.id
        }
      });
    } else if (request.service_id) {
      // For regular service requests
      navigate(`/services/${request.service_id}`, {
        state: {
          editMode: true,
          requestId: request.id
        }
      });
    }
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

  const toggleHistory = () => {
    setShowHistory(!showHistory);
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

  if (error) {
    console.error("Error in MyRequestsTab:", error);
    return (
      <div className="p-4 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-red-500 mb-4" />
        <p className="text-lg font-medium mb-2">
          {t('common.error', "Error")}
        </p>
        <p className={cn(
          "mb-4",
          isDarkMode ? "text-darcare-beige/60" : "text-foreground/60"
        )}>
          {t('common.fetchDataError', "Could not fetch your data. Please try again.")}
        </p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['my-service-requests'] })}
          className={cn(
            isDarkMode
              ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
              : "bg-secondary text-white hover:bg-secondary/90"
          )}
        >
          {t('common.retry', "Retry")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center px-4 mb-3">
        <h2 className={cn(
          "text-lg font-serif",
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {showHistory 
            ? t('services.requestHistory', "Request History") 
            : t('services.activeRequests', "Active Requests")}
        </h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleHistory}
          className={cn(
            "flex items-center gap-1 border",
            isDarkMode 
              ? "text-darcare-beige border-darcare-gold/30 hover:bg-darcare-gold/10" 
              : "text-darcare-charcoal border-darcare-deepGold/30 hover:bg-darcare-deepGold/10"
          )}
        >
          <History size={14} /> 
          {showHistory 
            ? t('services.hideHistory', "Hide History") 
            : t('services.viewHistory', "View History")}
        </Button>
      </div>
      
      {!requests || requests.length === 0 ? (
        <div className="p-6 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-darcare-gold/70 mb-4" />
          <p className={cn(
            isDarkMode ? "text-darcare-beige/80" : "text-foreground/80"
          )}>
            {showHistory 
              ? t('services.noHistoryRequests', "You don't have any completed requests") 
              : t('services.noActiveRequests', "You don't have any active requests")}
          </p>
          <p className={cn(
            "mt-2 mb-6",
            isDarkMode ? "text-darcare-beige/60" : "text-foreground/60"
          )}>
            {showHistory
              ? t('services.switchToActiveRequests', "Switch back to active requests")
              : t('services.switchToReserveTab', "Switch to the Reserve tab to request a new service")}
          </p>
          
          {!showHistory && (
            <Button 
              onClick={() => navigate('/services')} 
              className={cn(
                isDarkMode
                  ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
                  : "bg-secondary text-white hover:bg-secondary/90"
              )}
            >
              {t('services.requestService', "Request a Service")}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2 p-2">
          {requests.map(request => {
            // Get service name based on context (service or space)
            let serviceName = "";
            
            if (request.space_id) {
              // For space reservations
              serviceName = request.services.name;
            } else if (request.services && request.services.name) {
              // For standard services with a valid name
              serviceName = request.services.name;
            } else {
              // Fallback for services without a name
              serviceName = t('services.untitled', 'Untitled Service');
            }
            
            return (
              <div 
                key={request.id} 
                className={cn(
                  "request-card cursor-pointer transition-all duration-200 p-3 rounded-lg border",
                  isDarkMode 
                    ? "border-darcare-gold/10 hover:border-darcare-gold/20 bg-darcare-navy/60" 
                    : "border-primary/5 hover:border-primary/10 bg-card shadow-sm"
                )}
                onClick={() => handleRequestClick(request.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      "font-medium truncate",
                      isDarkMode ? "text-darcare-gold" : "text-primary"
                    )}>
                      {serviceName}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                      )}>
                        <Clock size={12} className={isDarkMode ? "text-darcare-beige/50" : "text-secondary/70"} />
                        <span className="truncate">
                          {request.preferred_time 
                            ? format(new Date(request.preferred_time), 'MMM d, p') 
                            : t('services.unscheduled', 'Unscheduled')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <StatusBadge status={request.status || 'pending'} />
                </div>
                
                <div className={cn(
                  "mt-2 pt-2 border-t flex justify-between items-center",
                  isDarkMode ? "border-darcare-gold/10" : "border-primary/10"
                )}>
                  {request.staff_assignments && request.staff_assignments.length > 0 ? (
                    <div className={cn(
                      "flex items-center gap-1 text-xs",
                      isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                    )}>
                      <User size={12} className={isDarkMode ? "text-darcare-beige/50" : "text-secondary/70"} />
                      <span className="truncate">
                        {request.staff_assignments[0].staff_name || t('services.unassigned', 'Unassigned')}
                      </span>
                    </div>
                  ) : (
                    <div className={cn(
                      "flex items-center gap-1 text-xs",
                      isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
                    )}>
                      <User size={12} className={isDarkMode ? "text-darcare-beige/50" : "text-secondary/70"} />
                      <span className="truncate">{t('services.unassigned', 'Unassigned')}</span>
                    </div>
                  )}
                  
                  {/* Only show edit/delete buttons for pending or in_progress requests */}
                  {(!request.status || request.status === 'pending' || request.status === 'in_progress') && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost" 
                        size="sm"
                        className={cn(
                          "h-7 w-7 p-0",
                          isDarkMode 
                            ? "text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold" 
                            : "text-secondary hover:bg-secondary/10"
                        )}
                        onClick={(e) => handleEditRequest(request, e)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
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
                        onClick={(e) => handleDeleteRequest(request.id, e)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
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
