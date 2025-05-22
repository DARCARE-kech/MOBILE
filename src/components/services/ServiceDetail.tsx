
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CleaningService from '@/pages/services/CleaningService';
import MaintenanceService from '@/pages/services/MaintenanceService';
import TransportService from '@/pages/services/TransportService';
import ShopService from '@/pages/services/ShopService';
import LaundryService from '@/pages/services/LaundryService';
import HairSalonService from '@/pages/services/HairSalonService';
import KidsClubService from '@/pages/services/KidsClubService';
import ReservationService from '@/pages/services/ReservationService';
import { Loader2 } from 'lucide-react';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { useTranslation } from 'react-i18next';
import { ServiceDetail as ServiceDetailType } from '@/hooks/services/types';
import { toast } from '@/components/ui/use-toast';

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
  
  console.log("Current service ID from URL:", id);
  console.log("Location state:", location.state);
  
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
  
  // Setup real-time subscription when component mounts
  useEffect(() => {
    // No need to call enable_realtime RPC function
    // Directly subscribe to the changes using .channel()
    const channel = supabase
      .channel('service-updates')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'service_requests' 
        },
        (payload) => {
          console.log('Service request updated:', payload);
        }
      )
      .subscribe();
    
    return () => {
      // Clean up subscription
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Fetch the base service information
  const { data: service, isLoading: isLoadingService, error: serviceError } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      // Only handle shop as a special case
      if (id === 'shop') {
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
        toast({
          title: "Error fetching service",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      console.log("Service data fetched:", data);
      return data as ServiceType;
    },
    enabled: !!id && id !== 'shop'
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
        .maybeSingle();
      
      if (error) {
        console.error(`Error fetching service details:`, error);
        // Return minimal details with category derived from service name
        const serviceNameLower = service.name.toLowerCase();
        if (serviceNameLower.includes('hair')) {
          return { category: 'hair', service_id: service.id } as ServiceDetailType;
        } else if (serviceNameLower.includes('kids')) {
          return { category: 'kids', service_id: service.id } as ServiceDetailType;
        } else if (serviceNameLower.includes('club') && serviceNameLower.includes('access')) {
          return { category: 'club-access', service_id: service.id } as ServiceDetailType;
        } else if (serviceNameLower.includes('reservation')) {
          return { category: 'reservation', service_id: service.id } as ServiceDetailType;
        }
        return null;
      }
      
      // If no data but we have specific services, provide default details
      if (!data) {
        const serviceNameLower = service.name.toLowerCase();
        if (serviceNameLower.includes('hair')) {
          return { category: 'hair', service_id: service.id } as ServiceDetailType;
        } else if (serviceNameLower.includes('kids')) {
          return { category: 'kids', service_id: service.id } as ServiceDetailType;
        } else if (serviceNameLower.includes('club') && serviceNameLower.includes('access')) {
          return { category: 'club-access', service_id: service.id } as ServiceDetailType;
        } else if (serviceNameLower.includes('reservation')) {
          return { category: 'reservation', service_id: service.id } as ServiceDetailType;
        }
        
        // For other services without data, return a basic structure
        return { service_id: service.id } as ServiceDetailType;
      }
      
      console.log("Service details fetched:", data);
      
      // Add the service_id to serviceDetails if it exists
      if (data && service?.id) {
        data.service_id = service.id;
      }
      
      return data as ServiceDetailType;
    },
    enabled: !!service
  });
  
  const isLoading = isLoadingService || isLoadingDetails;
  
  // Special case for shop
  if (id === 'shop') {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={t('services.shop')} showBack={true} onBack={() => navigate('/services')} />
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
        <MainHeader title={t('common.loading')} showBack={true} onBack={() => navigate('/services')} />
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

  // Log service_id before passing to component
  console.log("Service ID passing to component:", service.id);
  console.log("ServiceDetails with service_id:", serviceDetails);
  
  // Ensure serviceDetails includes service_id before passing to components
  const enhancedServiceDetails = serviceDetails ? {
    ...serviceDetails,
    service_id: service.id 
  } : { service_id: service.id } as ServiceDetailType;
  
  // Special handling for Club Access - redirect to spaces list
  if (serviceNameLower?.includes('club') && serviceNameLower?.includes('access')) {
    // Navigate to spaces list
    navigate('/services/spaces', { state: { serviceId: service.id } });
    return null;
  }
  
  // Pass serviceDetails and existingRequest to the specific service component
  if (serviceNameLower?.includes('laundry')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={pageTitle} showBack={true} onBack={() => navigate('/services')} />
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
        <MainHeader title={pageTitle} showBack={true} onBack={() => navigate('/services')} />
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
        <MainHeader title={pageTitle} showBack={true}  onBack={() => navigate('/services')} />
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
        <MainHeader title={pageTitle} showBack={true} onBack={() => navigate('/services')} />
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
  } else if (serviceNameLower?.includes('hair') || serviceNameLower?.includes('salon')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={pageTitle} showBack={true} onBack={() => navigate('/services')} />
        <div className="pt-20">
          <HairSalonService 
            serviceData={enhancedServiceDetails}
            existingRequest={existingRequest}
            editMode={editMode}
          />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('kids') || serviceNameLower?.includes('club')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={pageTitle} showBack={true} onBack={() => navigate('/services')} />
        <div className="pt-20">
          <KidsClubService 
            serviceData={enhancedServiceDetails}
            existingRequest={existingRequest}
            editMode={editMode}
          />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  } else if (serviceNameLower?.includes('reservation')) {
    return (
      <div className="min-h-screen bg-darcare-navy">
        <MainHeader title={pageTitle} showBack={true}  onBack={() => navigate(-1)} />
        <div className="pt-20">
          <ReservationService
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
