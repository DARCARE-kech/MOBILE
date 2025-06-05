
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceCard from './ServiceCard';

// Liste des services qui sont maintenant des espaces
const SPACE_SERVICE_NAMES = [
  'Kids Club',
  'Hair Salon', 
  'Piscine',
  'Salle de sport',
  'Padel',
  'Club Access'
];

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
  if (isLoading || isLoadingSpaces) {
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

  // Filter services to exclude those that are now spaces
  const actualServices = services.filter(service => 
    !SPACE_SERVICE_NAMES.includes(service.name)
  );

  // Combine spaces and services for display
  const allItems = [
    ...(spaces || []).map(space => ({ ...space, type: 'space' })),
    ...actualServices.map(service => ({ ...service, type: 'service' }))
  ];

  // Empty state
  if (allItems.length === 0) {
    return (
      <div className="p-4 text-center py-12">
        <p className="text-foreground/70">{t('services.noServicesAvailable')}</p>
      </div>
    );
  }

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

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {allItems.map(item => (
        <ServiceCard 
          key={`${item.type}-${item.id}`}
          service={item}
          onSelect={() => handleItemSelect(item)}
        />
      ))}
    </div>
  );
};

export default InternalServicesTab;
