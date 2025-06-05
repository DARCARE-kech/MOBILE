
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

interface UnifiedRequest {
  id: string;
  type: 'service' | 'space';
  user_id: string | null;
  service_id?: string | null;
  space_id?: string | null;
  preferred_time: string | null;
  status: string | null;
  note: string | null;
  image_url?: string | null;
  created_at: string | null;
  services?: { id: string; name: string; description: string | null; category: string | null; estimated_duration: string | null; } | null;
  spaces?: { id: string; name: string; description: string | null; } | null;
  staff_assignments?: StaffAssignment[] | null;
  custom_fields?: Record<string, any> | null;
}

const MyRequestsTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [requestToDelete, setRequestToDelete] = React.useState<{ id: string; type: 'service' | 'space' } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['unified-requests', user?.id, showHistory],
    queryFn: async () => {
      if (!user?.id) throw new Error("User ID is required");
      
      console.log("Fetching unified requests for user:", user.id);
      
      const statusFilter = showHistory 
        ? ['completed', 'cancelled'] 
        : ['pending', 'in_progress', 'confirmed'];
      
      // Fetch service requests
      const { data: serviceRequests, error: serviceError } = await supabase
        .from('service_requests')
        .select(`
          *,
          services(*)
        `)
        .eq('user_id', user.id)
        .in('status', statusFilter)
        .order('created_at', { ascending: false });
      
      if (serviceError) {
        console.error('Error fetching service requests:', serviceError);
        throw serviceError;
      }
      
      // Fetch space reservations
      const { data: spaceReservations, error: spaceError } = await supabase
        .from('space_reservations')
        .select(`
          *,
          spaces(*)
        `)
        .eq('user_id', user.id)
        .in('status', statusFilter)
        .order('created_at', { ascending: false });
      
      if (spaceError) {
        console.error('Error fetching space reservations:', spaceError);
        throw spaceError;
      }
      
      console.log("Service requests data:", serviceRequests);
      console.log("Space reservations data:", spaceReservations);
      
      // Transform and combine the data
      const transformedServiceRequests: UnifiedRequest[] = await Promise.all(
        (serviceRequests || []).map(async (request) => {
          const staffAssignments = await getStaffAssignmentsForRequest(request.id);
          
          return {
            ...request,
            type: 'service' as const,
            staff_assignments: staffAssignments
          };
        })
      );
      
      const transformedSpaceReservations: UnifiedRequest[] = (spaceReservations || []).map(reservation => ({
        id: reservation.id,
        type: 'space' as const,
        user_id: reservation.user_id,
        space_id: reservation.space_id,
        preferred_time: reservation.preferred_time,
        status: reservation.status,
        note: reservation.note,
        created_at: reservation.created_at,
        spaces: reservation.spaces,
        custom_fields: reservation.custom_fields
      }));
      
      // Combine and sort by creation date
      const allRequests = [...transformedServiceRequests, ...transformedSpaceReservations];
      allRequests.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      
      return allRequests;
    },
    enabled: !!user?.id,
    retry: 1
  });

  // Mutation to delete requests/reservations
  const deleteMutation = useMutation({
    mutationFn: async ({ id, type }: { id: string; type: 'service' | 'space' }) => {
      const tableName = type === 'service' ? 'service_requests' : 'space_reservations';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: t('services.requestDeleted', "Request deleted"),
        description: t('services.requestDeletedDesc', "Your request has been successfully deleted"),
      });
      queryClient.invalidateQueries({ queryKey: ['unified-requests'] });
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

  const handleRequestClick = (request: UnifiedRequest) => {
    if (request.type === 'service') {
      navigate(`/services/requests/${request.id}`);
    } else {
      // For space reservations, we could create a similar detail page or show a simple modal
      navigate(`/services/requests/${request.id}`);
    }
  };

  const handleEditRequest = (request: UnifiedRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (request.type === 'service') {
      navigate(`/services/${request.service_id}`, {
        state: {
          editMode: true,
          requestId: request.id
        }
      });
    } else {
      navigate(`/spaces/${request.space_id}`, {
        state: {
          editMode: true,
          reservationId: request.id
        }
      });
    }
  };

  const handleDeleteRequest = (request: UnifiedRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    setRequestToDelete({ id: request.id, type: request.type });
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
          onClick={() => queryClient.invalidateQueries({ queryKey: ['unified-requests'] })}
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
        <div className={cn(
          "relative overflow-hidden rounded-xl mx-4 p-8 flex flex-col items-center justify-center text-center",
          isDarkMode 
            ? "bg-gradient-to-b from-darcare-navy/60 to-[#1A1D27] border border-darcare-gold/10" 
            : "bg-white/80 border border-darcare-deepGold/5 shadow-sm"
        )}>
          <h3 className={cn(
            "font-serif text-lg mb-2",
            isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
          )}>
            {showHistory 
              ? t('services.noHistoryRequests', "You don't have any completed requests") 
              : t('services.noActiveRequests', "You don't have any active requests")}
          </h3>
          
          <p className={cn(
            "text-sm mb-5 max-w-md",
            isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
          )}>
            {showHistory
              ? t('services.switchToActiveRequests', "Switch back to active requests")
              : t('services.emptyRequestsMessage', "Would you like to make a new service request?")}
          </p>
          
          {!showHistory && (
            <Button 
              onClick={() => navigate('/services')} 
              className={cn(
                isDarkMode
                  ? "bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
                  : "bg-darcare-deepGold text-white hover:bg-darcare-deepGold/90"
              )}
            >
              {t('services.requestService', "Request a Service")}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2 p-2">
          {requests.map(request => {
            // Get request name based on type
            let requestName = "";
            
            if (request.type === 'service' && request.services?.name) {
              requestName = t(`services.${request.services.name}`, request.services.name);
            } else if (request.type === 'space' && request.spaces?.name) {
              requestName = t(`services.${request.spaces.name}`, request.spaces.name);
            } else {
              requestName = t('services.untitled', 'Untitled Request');
            }
            
            return (
              <div 
                key={`${request.type}-${request.id}`}
                className={cn(
                  "request-card cursor-pointer transition-all duration-200 p-3 rounded-lg border",
                  isDarkMode 
                    ? "border-darcare-gold/10 hover:border-darcare-gold/20 bg-darcare-navy/60" 
                    : "border-primary/5 hover:border-primary/10 bg-card shadow-sm"
                )}
                onClick={() => handleRequestClick(request)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={cn(
                        "font-medium truncate",
                        isDarkMode ? "text-darcare-gold" : "text-primary"
                      )}>
                        {requestName}
                      </h3>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        request.type === 'service' 
                          ? isDarkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"
                          : isDarkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700"
                      )}>
                        {request.type === 'service' ? 'Service' : 'Space'}
                      </span>
                    </div>
                    
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
                  {request.type === 'service' && request.staff_assignments && request.staff_assignments.length > 0 ? (
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
                      <span className="truncate">
                        {request.type === 'space' ? t('services.spaceReservation', 'Space Reservation') : t('services.unassigned', 'Unassigned')}
                      </span>
                    </div>
                  )}
                  
                  {(!request.status || request.status === 'pending' || request.status === 'in_progress' || request.status === 'confirmed') && (
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
                        onClick={(e) => handleDeleteRequest(request, e)}
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
              {t('services.deleteWarning', 'Are you sure you want to delete this request? This action cannot be undone.')}
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
