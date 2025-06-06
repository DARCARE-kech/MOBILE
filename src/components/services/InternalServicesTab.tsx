
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceCard from './ServiceCard';

const InternalServicesTab: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch internal services from Supabase
  const { data: internalServices, isLoading: isLoadingInternal, error: internalError } = useQuery({
    queryKey: ['services-internal'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category', 'internal')
        .order('name');
        
      if (error) {
        console.error('Error fetching internal services:', error);
        throw error;
      }
      
      console.log('Internal services fetched:', data);
      return data || [];
    }
  });

  // Fetch external services (for on-demand services like reservation, transport)
  const { data: externalServices, isLoading: isLoadingExternal, error: externalError } = useQuery({
    queryKey: ['services-external'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category', 'external')
        .order('name');
        
      if (error) {
        console.error('Error fetching external services:', error);
        throw error;
      }
      
      console.log('External services fetched:', data);
      return data || [];
    }
  });

  // Fetch spaces
  const { data: spaces, isLoading: isLoadingSpaces } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('active', true)
        .order('name');
        
      if (error) {
        console.error('Error fetching spaces:', error);
        throw error;
      }
      
      console.log('Spaces fetched:', data);
      return data || [];
    }
  });

  // Loading state
  if (isLoadingInternal || isLoadingExternal || isLoadingSpaces) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-foreground/70">{t('common.loading')}...</p>
      </div>
    );
  }

  // Error state
  if (internalError || externalError || (!internalServices && !externalServices)) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-48">
        <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-foreground/70">{t('common.errorLoading')}</p>
      </div>
    );
  }

  // Combine all services
  const allServices = [
    ...(internalServices || []).map(service => ({ ...service, type: 'service' })),
    ...(externalServices || []).map(service => ({ ...service, type: 'service' }))
  ];

  // Add spaces
  const allSpaces = (spaces || []).map(space => ({ ...space, type: 'space' }));

  // Handle item selection - route to appropriate page
  const handleItemSelect = (item: any) => {
    console.log('Selected item:', item);
    
    if (item.type === 'space') {
      // Navigate to space reservation page
      navigate(`/spaces/${item.id}`);
    } else {
      // Navigate to service detail page
      navigate(`/services/${item.id}`);
    }
  };

  // Filter services for Villa Services (cleaning, maintenance, laundry)
  const villaServices = allServices.filter(service => {
    const serviceName = service.name.toLowerCase();
    return serviceName.includes('cleaning') || 
           serviceName.includes('maintenance') || 
           serviceName.includes('laundry');
  });

  // Filter services for On-Demand Services (reservation, transport)
  const onDemandServices = allServices.filter(service => {
    const serviceName = service.name.toLowerCase();
    return serviceName.includes('reservation') || 
           serviceName.includes('transport');
  });

  // Wellness & Activities are all the spaces
  const wellnessServices = allSpaces;

  // Empty state
  if (villaServices.length === 0 && wellnessServices.length === 0 && onDemandServices.length === 0) {
    return (
      <div className="p-4 text-center py-12">
        <p className="text-foreground/70">{t('services.noServicesAvailable')}</p>
      </div>
    );
  }

  const ServiceSection = ({ title, items }: { title: string; items: any[] }) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-serif text-primary mb-3 px-2">
          {title}
        </h3>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-2 pb-1" style={{ width: 'max-content' }}>
            {items.map(item => (
              <div key={`${item.type}-${item.id}`} className="flex-shrink-0 w-40">
                <ServiceCard 
                  service={item}
                  onSelect={() => handleItemSelect(item)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-4 space-y-2">
      <ServiceSection 
        title={t('services.villaServices', 'Villa Services')}
        items={villaServices}
      />
      
      <ServiceSection 
        title={t('services.wellnessActivities', 'Wellness & Activities')}
        items={wellnessServices}
      />
      
      <ServiceSection 
        title={t('services.onDemandServices', 'On-Demand Services')}
        items={onDemandServices}
      />
    </div>
  );
};

export default InternalServicesTab;
