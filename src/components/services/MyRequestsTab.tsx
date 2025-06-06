import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Clock, User, Pencil, Trash2, AlertTriangle, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import StatusBadge from '@/components/StatusBadge';
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
import { getStaffAssignmentsForRequest } from '@/integrations/supabase/rpc';
import type { StaffAssignment } from '@/integrations/supabase/rpc';

interface ServiceRequest {
  id: string;
  user_id: string | null;
  service_id: string | null;
  preferred_time: string | null;
  status: string | null;
  created_at: string | null;
  services: { name: string } | null;
  staff_assignments?: StaffAssignment[] | null;
}

interface SpaceReservation {
  id: string;
  user_id: string | null;
  space_id: string | null;
  preferred_time: string | null;
  status: string | null;
  created_at: string | null;
  spaces: { name: string } | null;
}

type UnifiedRequest = {
  id: string;
  type: 'service' | 'space';
  name: string;
  preferred_time: string | null;
  status: string | null;
  created_at: string | null;
  staff_name?: string | null;
  service_id?: string;
  space_id?: string;
};

const MyRequestsTab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [requestToDelete, setRequestToDelete] = useState<UnifiedRequest | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['unified-requests', user?.id, showHistory],
    queryFn: async (): Promise<UnifiedRequest[]> => {
      if (!user?.id) return [];

      const statusFilter = showHistory
        ? ['completed', 'cancelled']
        : ['pending', 'in_progress', 'confirmed'];

      const [services, serviceError] = await supabase
        .from('service_requests')
        .select(`*, services(name)`)
        .eq('user_id', user.id)
        .in('status', statusFilter)
        .order('created_at', { ascending: false });

      const [spaces, spaceError] = await supabase
        .from('space_reservations')
        .select(`*, spaces(name)`)
        .eq('user_id', user.id)
        .in('status', statusFilter)
        .order('created_at', { ascending: false });

      if (serviceError || spaceError) throw serviceError || spaceError;

      const transformedServices = await Promise.all(
        (services || []).map(async (s) => {
          const staff = await getStaffAssignmentsForRequest(s.id);
          return {
            id: s.id,
            type: 'service',
            name: s.services?.name || 'Service',
            preferred_time: s.preferred_time,
            status: s.status,
            created_at: s.created_at,
            service_id: s.service_id,
            staff_name: staff?.[0]?.staff_name || null,
          };
        })
      );

      const transformedSpaces = (spaces || []).map((s) => ({
        id: s.id,
        type: 'space',
        name: s.spaces?.name || 'Space',
        preferred_time: s.preferred_time,
        status: s.status,
        created_at: s.created_at,
        space_id: s.space_id,
        staff_name: null,
      }));

      return [...transformedServices, ...transformedSpaces].sort(
        (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
      );
    },
    enabled: !!user?.id,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: async (req: UnifiedRequest) => {
      const table = req.type === 'service' ? 'service_requests' : 'space_reservations';
      const { error } = await supabase.from(table).delete().eq('id', req.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: t('services.requestDeleted'), description: t('services.requestDeletedDesc') });
      queryClient.invalidateQueries({ queryKey: ['unified-requests'] });
    },
    onError: () => {
      toast({ title: t('common.error'), description: t('services.deleteErrorDesc'), variant: "destructive" });
    }
  });

  const handleEdit = (r: UnifiedRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    if (r.type === 'service') {
      navigate(`/services/${r.service_id}`, { state: { editMode: true, requestId: r.id } });
    } else {
      navigate(`/spaces/${r.space_id}`, { state: { editMode: true, reservationId: r.id } });
    }
  };

  const handleDelete = (r: UnifiedRequest, e: React.MouseEvent) => {
    e.stopPropagation();
    setRequestToDelete(r);
  };

  const handleClick = (r: UnifiedRequest) => {
    if (r.type === 'service') navigate(`/services/requests/${r.id}`);
    else navigate(`/spaces/${r.id}`);
  };

  return (
    <>
      <div className="flex justify-between items-center px-4 mb-4">
        <h2 className={cn("text-lg font-serif", isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold")}>
          {showHistory ? t('services.requestHistory') : t('services.activeRequests')}
        </h2>
        <Button onClick={() => setShowHistory(!showHistory)} variant="outline" size="sm" className="gap-2">
          <History size={16} />
          {showHistory ? t('services.hideHistory') : t('services.viewHistory')}
        </Button>
      </div>

      <div className="space-y-2 px-4">
        {isLoading ? (
          <div className="text-center py-10">
            <Loader2 className="mx-auto animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <AlertTriangle className="mx-auto mb-2" />
            <p>{t('common.fetchDataError')}</p>
          </div>
        ) : requests?.length === 0 ? (
          <div className="text-center py-10 text-foreground/70">
            {showHistory ? t('services.noHistoryRequests') : t('services.noActiveRequests')}
          </div>
        ) : (
          requests.map((r) => (
            <div
              key={r.id}
              onClick={() => handleClick(r)}
              className={cn(
                "rounded-xl p-4 border cursor-pointer",
                isDarkMode ? "bg-[#181a23] border-darcare-gold/10" : "bg-white border-gray-200"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className={cn("font-semibold", isDarkMode ? "text-darcare-gold" : "text-primary")}>
                  {r.name}
                </h3>
                <StatusBadge status={r.status || 'pending'} />
              </div>

              <div className="text-sm text-foreground/70 flex items-center gap-1 mb-1">
                <Clock size={14} className="opacity-60" />
                {r.preferred_time
                  ? format(new Date(r.preferred_time), 'MMM d, hh:mm a')
                  : t('services.unscheduled')}
              </div>

              <div className="text-sm text-foreground/60 flex items-center gap-1">
                <User size={14} className="opacity-60" />
                {r.staff_name || t('services.unassigned')}
              </div>

              {(r.status === 'pending' || r.status === 'in_progress' || r.status === 'confirmed') && (
                <div className="flex gap-1 justify-end mt-2">
                  <Button variant="ghost" size="icon-sm" onClick={(e) => handleEdit(r, e)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={(e) => handleDelete(r, e)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AlertDialog open={!!requestToDelete} onOpenChange={() => setRequestToDelete(null)}>
        <AlertDialogContent className={isDarkMode ? "bg-darcare-navy border-darcare-gold/20" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isDarkMode ? "text-darcare-gold" : ""}>
              {t('services.confirmDelete')}
            </AlertDialogTitle>
            <AlertDialogDescription className={isDarkMode ? "text-darcare-beige/70" : ""}>
              {t('services.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => requestToDelete && deleteMutation.mutate(requestToDelete)}>
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyRequestsTab;
