
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
  const { data: services, isLoading, error } = useQuery({
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

  // Loading state
  if (isLoading) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-foreground/70">{t('common.loading')}...</p>
      </div>
    );
  }

  // Error state
  if (error || !services) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-48">
        <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
        <p className="text-foreground/70">{t('common.errorLoading')}</p>
      </div>
    );
  }

  // Empty state
  if (services.length === 0) {
    return (
      <div className="p-4 text-center py-12">
        <p className="text-foreground/70">{t('services.noServicesAvailable')}</p>
      </div>
    );
  }

  // Handle service selection - simplify to always navigate to service detail page by ID
  const handleServiceSelect = (service: any) => {
    console.log('Selected service:', service);
    // Navigate to service detail page with the service ID
    navigate(`/services/${service.id}`);
  };

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {services.map(service => (
        <ServiceCard 
          key={service.id}
          service={service}
          onSelect={() => handleServiceSelect(service)}
        />
      ))}
    </div>
  );
};

export default InternalServicesTab;
