
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CleaningService from '@/pages/services/CleaningService';
import MaintenanceService from '@/pages/services/MaintenanceService';
import TransportService from '@/pages/services/TransportService';
import BookSpaceService from '@/pages/services/BookSpaceService';
import ShopService from '@/pages/services/ShopService';
import { Loader2 } from 'lucide-react';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && id !== 'book-space' && id !== 'shop'
  });
  
  if (id === 'book-space') {
    return <BookSpaceService />;
  }
  
  if (id === 'shop') {
    return <ShopService />;
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-darcare-navy">
        <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
      </div>
    );
  }
  
  if (error || !service) {
    navigate('/services');
    return null;
  }
  
  // Check service category and render appropriate component
  const serviceNameLower = service.name.toLowerCase();
  
  if (serviceNameLower.includes('cleaning')) {
    return <CleaningService />;
  } else if (serviceNameLower.includes('maintenance')) {
    return <MaintenanceService />;
  } else if (serviceNameLower.includes('transport')) {
    return <TransportService />;
  } else {
    // Default generic service view
    navigate('/services');
    return null;
  }
};

export default ServiceDetail;
