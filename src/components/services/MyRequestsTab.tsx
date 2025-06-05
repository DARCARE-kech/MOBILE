
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertTriangle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr, en, ar } from 'date-fns/locale';

interface ServiceRequest {
  id: string;
  service_id: string;
  user_id: string;
  preferred_time: string;
  status: string;
  note: string;
  created_at: string;
  services: {
    name: string;
    description: string;
    image_url: string;
  } | null;
}

interface SpaceReservation {
  id: string;
  space_id: string;
  user_id: string;
  preferred_time: string;
  status: string;
  note: string;
  created_at: string;
  custom_fields: any;
  spaces: {
    name: string;
    description: string;
    image_url: string;
  } | null;
}

interface UnifiedRequest {
  id: string;
  type: 'service' | 'space';
  name: string;
  description: string;
  image_url: string;
  preferred_time: string;
  status: string;
  note: string;
  created_at: string;
  custom_fields?: any;
}

const MyRequestsTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Fetch service requests
  const { data: serviceRequests, isLoading: loadingServices } = useQuery({
    queryKey: ['user-service-requests'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          services (
            name,
            description,
            image_url
          )
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ServiceRequest[];
    }
  });

  // Fetch space reservations
  const { data: spaceReservations, isLoading: loadingSpaces } = useQuery({
    queryKey: ['user-space-reservations'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('space_reservations')
        .select(`
          *,
          spaces (
            name,
            description,
            image_url
          )
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SpaceReservation[];
    }
  });

  const isLoading = loadingServices || loadingSpaces;

  // Combine and transform data
  const unifiedRequests: UnifiedRequest[] = React.useMemo(() => {
    const serviceReqs: UnifiedRequest[] = (serviceRequests || []).map(req => ({
      id: req.id,
      type: 'service' as const,
      name: req.services?.name || 'Service',
      description: req.services?.description || '',
      image_url: req.services?.image_url || '',
      preferred_time: req.preferred_time,
      status: req.status,
      note: req.note || '',
      created_at: req.created_at
    }));

    const spaceReqs: UnifiedRequest[] = (spaceReservations || []).map(res => ({
      id: res.id,
      type: 'space' as const,
      name: res.spaces?.name || 'Space',
      description: res.spaces?.description || '',
      image_url: res.spaces?.image_url || '',
      preferred_time: res.preferred_time,
      status: res.status,
      note: res.note || '',
      created_at: res.created_at,
      custom_fields: res.custom_fields
    }));

    return [...serviceReqs, ...spaceReqs].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [serviceRequests, spaceReservations]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
      case 'in_progress':
        return 'default';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'confirmed':
        return 'text-blue-600';
      case 'in_progress':
        return 'text-orange-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDateLocale = () => {
    switch (i18n.language) {
      case 'fr':
        return fr;
      case 'ar':
        return ar;
      default:
        return en;
    }
  };

  const handleRequestClick = (request: UnifiedRequest) => {
    if (request.type === 'service') {
      navigate(`/services/requests/${request.id}`);
    } else {
      // For space reservations, we can navigate to edit or view
      navigate(`/spaces/${request.id}`, { 
        state: { 
          editMode: true, 
          reservationId: request.id 
        } 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-foreground/70">{t('common.loading')}...</p>
      </div>
    );
  }

  if (unifiedRequests.length === 0) {
    return (
      <div className="p-4 text-center py-12">
        <p className="text-foreground/70 mb-4">{t('services.noRequestsYet')}</p>
        <p className="text-sm text-foreground/50">{t('services.requestsWillAppear')}</p>
      </div>
    );
  }

  return (
    <div className="mobile-content-padding mobile-form-container">
      <div className="space-y-3 p-2">
        {unifiedRequests.map((request) => (
          <div
            key={`${request.type}-${request.id}`}
            className="request-card cursor-pointer transition-all hover:shadow-md"
            onClick={() => handleRequestClick(request)}
          >
            <div className="flex items-start space-x-3">
              {request.image_url && (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={request.image_url} 
                    alt={request.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground text-sm">
                      {request.name}
                    </h3>
                    <p className="text-xs text-foreground/60 mt-1">
                      {request.type === 'space' ? t('services.spaceReservation') : t('services.serviceRequest')}
                    </p>
                  </div>
                  <Badge 
                    variant={getStatusBadgeVariant(request.status)}
                    className="text-xs"
                  >
                    {t(`services.status.${request.status}`, request.status)}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-foreground/70">
                    <span className="font-medium">{t('services.preferredTime')}:</span>{' '}
                    {new Date(request.preferred_time).toLocaleDateString(i18n.language, {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  
                  {request.note && (
                    <p className="text-xs text-foreground/60 line-clamp-2">
                      <span className="font-medium">{t('services.note')}:</span> {request.note}
                    </p>
                  )}
                  
                  <p className="text-xs text-foreground/50">
                    {formatDistanceToNow(new Date(request.created_at), {
                      addSuffix: true,
                      locale: getDateLocale()
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequestsTab;
