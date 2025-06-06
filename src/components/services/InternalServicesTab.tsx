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

// Catégories de services organisées par section
const SERVICE_CATEGORIES = {
  villa: ['cleaning', 'maintenance', 'laundry'],
  wellness: ['padel', 'gym', 'kids-club', 'hair-salon'],
  ondemand: ['reservation', 'transport']
};

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

  // Organiser les items par sections
  const getItemsForSection = (sectionType: keyof typeof SERVICE_CATEGORIES) => {
    const categories = SERVICE_CATEGORIES[sectionType];
    return allItems.filter(item => {
      if (item.type === 'space') {
        // Mapper les espaces vers les catégories
        const spaceName = item.name.toLowerCase();
        if (sectionType === 'wellness') {
          return spaceName.includes('padel') || 
                 spaceName.includes('gym') || 
                 spaceName.includes('sport') ||
                 spaceName.includes('kids') ||
                 spaceName.includes('hair') ||
                 spaceName.includes('salon');
        }
        return false;
      } else {
        return categories.includes(item.category);
      }
    });
  };

  const villaServices = getItemsForSection('villa');
  const wellnessServices = getItemsForSection('wellness');
  const onDemandServices = getItemsForSection('ondemand');

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
