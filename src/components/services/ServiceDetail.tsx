
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CleaningService from '@/pages/services/CleaningService';
import MaintenanceService from '@/pages/services/MaintenanceService';
import TransportService from '@/pages/services/TransportService';
import BookSpaceService from '@/pages/services/BookSpaceService';
import ShopService from '@/pages/services/ShopService';
import LaundryService from '@/pages/services/LaundryService';
import { Loader2 } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';
import { ServiceDetail as ServiceDetailType } from '@/hooks/services/types';

// Base service type
type ServiceType = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  estimated_duration: string | null;
};

// Add service request type
type ServiceRequestType = {
  id: string;
  user_id: string | null;
  service_id: string | null;
  preferred_time: string | null;
  status: string | null;
  note: string | null;
  image_url: string | null;
  created_at: string | null;
  selected_options: Record<string, any> | null;
};

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Check if we're editing an existing request
  const [editMode, setEditMode] = useState(false);
  const [existingRequest, setExistingRequest] = useState<ServiceRequestType | null>(null);
  
  // Log le paramètre ID pour débogage
  console.log("Current service ID from URL:", id);
  
  // Check if we're in edit mode based on location state
  useEffect(() => {
    const state = location.state as { editMode?: boolean; requestId?: string } | undefined;
    if (state?.editMode && state.requestId) {
      setEditMode(true);
      
      // Fetch the existing request data
      const fetchRequest = async () => {
        const { data, error } = await supabase
          .from('service_requests')
          .select('*')
          .eq('id', state.requestId)
          .single();
        
        if (!error && data) {
          setExistingRequest(data as ServiceRequestType);
        }
      };
      
      fetchRequest();
    }
  }, [location]);
  
  // Fetch the base service information
  const { data: service, isLoading: isLoadingService, error: serviceError } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      if (id === 'book-space' || id === 'shop') {
        console.log("Special service ID detected, skipping fetch");
        return null;
      }
      
      console.log("Fetching service with ID:", id);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching service:", error);
        throw error;
      }
      
      console.log("Service data fetched:", data);
      return data as ServiceType;
    },
    enabled: !!id && id !== 'book-space' && id !== 'shop'
  });

  // Fetch the service-specific details based on service type
  const { data: serviceDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['service-details', id, service?.name],
    queryFn: async () => {
      if (!service) {
        console.log("No service data available, skipping details fetch");
        return null;
      }
      
      console.log("Fetching service details for service ID:", service.id);
      
      // For all standard services, we now query the unified service_details table
      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('service_id', service.id)
        .single();
      
      if (error) {
        console.error(`Error fetching service details:`, error);
        return null;
      }
      
      console.log("Service details fetched:", data);
      
      // Ajouter le service_id au serviceDetails s'il existe
      if (data && service?.id) {
        data.service_id = service.id;
      }
      
      return data as ServiceDetailType;
    },
    enabled: !!service
  });
  
  const isLoading = isLoadingService || isLoadingDetails;
  
  if (id === 'book-space') {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('services.bookSpace')} onBack={() => navigate('/services')} />
        <div className="pt-20">
          <BookSpaceService />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  if (id === 'shop') {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('services.shop')} onBack={() => navigate('/services')} />
        <div className="pt-20">
          <ShopService />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-darcare-navy">
        <MainHeader title={t('common.loading')} onBack={() => navigate('/services')} />
        <div className="pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  if (serviceError || !service) {
    navigate('/services');
    return null;
  }
  
  const serviceNameLower = service?.name.toLowerCase();
  const pageTitle = editMode ? t('services.editRequest') : service.name;

  // Log service_id avant de le passer au composant
  console.log("Service ID passing to component:", service.id);
  console.log("ServiceDetails with service_id:", serviceDetails);
  
  // Assurez-vous que serviceDetails inclut service_id avant de le passer aux composants
  const enhancedServiceDetails = serviceDetails ? {
    ...serviceDetails,
    service_id: service.id 
  } : { service_id: service.id } as ServiceDetailType;
  
  // Pass serviceDetails and existingRequest to the specific service component
  if (serviceNameLower?.includes('laundry')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={pageTitle} onBack={() => navigate('/services')} />
        <div className="pt-20">
          <LaundryService 
            serviceData={enhancedServiceDetails} 
            existingRequest={existingRequest}
            editMode={editMode}
          />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('cleaning')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={pageTitle} onBack={() => navigate('/services')} />
        <div className="pt-20">
          <CleaningService 
            serviceData={enhancedServiceDetails}
            existingRequest={existingRequest}
            editMode={editMode}
          />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('maintenance')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={pageTitle} onBack={() => navigate('/services')} />
        <div className="pt-20">
          <MaintenanceService 
            serviceData={enhancedServiceDetails}
            existingRequest={existingRequest}
            editMode={editMode}
          />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('transport')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={pageTitle} onBack={() => navigate('/services')} />
        <div className="pt-20">
          <TransportService 
            serviceData={enhancedServiceDetails}
            existingRequest={existingRequest}
            editMode={editMode}
          />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else {
    navigate('/services');
    return null;
  }
};

export default ServiceDetail;
