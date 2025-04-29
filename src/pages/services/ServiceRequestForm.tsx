
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainHeader from '@/components/MainHeader';
import BottomNavigation from '@/components/BottomNavigation';
import DynamicServiceForm from '@/components/services/DynamicServiceForm';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Define a type for the form data
interface ServiceRequestFormData {
  preferredDate: string;
  preferredTime: string;
  note: string;
  selectedCategory?: string;
  selectedOption?: string;
  [key: string]: any; // For additional dynamic fields
}

const ServiceRequestForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  
  // Get serviceType from state
  const { serviceType, serviceId, category, option, tripType } = location.state || {};
  
  // Validate we have a serviceType
  useEffect(() => {
    if (!serviceType && !serviceId) {
      navigate('/services');
    }
  }, [serviceType, serviceId, navigate]);
  
  // Fetch service details based on the service type
  const { data: service, isLoading: isLoadingService } = useQuery({
    queryKey: ['service', serviceType, serviceId],
    queryFn: async () => {
      if (serviceId) {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single();
          
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .ilike('name', `%${serviceType}%`)
          .limit(1)
          .single();
          
        if (error) throw error;
        return data;
      }
    },
    enabled: !!serviceType || !!serviceId
  });
  
  // Fetch the detailed service options
  const { data: serviceDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['service-details', service?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('service_id', service.id)
        .single();
        
      if (error) {
        console.error('Error fetching service details:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!service
  });
  
  const handleSubmitRequest = async (formData: ServiceRequestFormData) => {
    setSubmitting(true);
    
    try {
      // Convert the form data to the structure needed for the service_requests table
      const selectedOptions = {
        ...formData,
        category: category || formData.selectedCategory,
        option: option || formData.selectedOption,
        tripType: tripType
      };

      // Insert request into database
      const { error } = await supabase
        .from('service_requests')
        .insert({
          service_id: service?.id,
          preferred_time: new Date(`${formData.preferredDate}T${formData.preferredTime}`).toISOString(),
          note: formData.note,
          selected_options: selectedOptions
        });
      
      if (error) throw error;
      
      // Show success message
      toast.success(t('services.requestSubmitted'), {
        description: t('services.requestSubmittedDesc')
      });
      
      // Navigate back to services
      navigate('/services');
      
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(t('common.error'), {
        description: t('services.requestErrorDesc')
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  if (isLoadingService || isLoadingDetails) {
    return (
      <div className="min-h-screen bg-darcare-navy flex flex-col">
        <MainHeader title={t('services.newRequest')} onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center pt-16">
          <Loader2 className="w-8 h-8 animate-spin text-darcare-gold" />
        </div>
        <BottomNavigation activeTab="services" />
      </div>
    );
  }
  
  // Create a title based on the service type
  const getServiceTitle = () => {
    if (service) {
      return service.name;
    }
    
    if (serviceType) {
      return t(`services.${serviceType}Service`);
    }
    
    return t('services.newRequest');
  };
  
  // Enhance the optional fields with prefilled selected values
  const enhanceOptionalFields = () => {
    if (!serviceDetails?.optional_fields) return {};
    
    // Safely cast the optional_fields to Record<string, any> to ensure TypeScript knows it's an object
    const optionalFields = serviceDetails.optional_fields as Record<string, any>;
    
    // Create a copy of optional_fields to avoid modifying the original data
    const enhanced: Record<string, any> = { ...optionalFields };
    
    // Pre-select the category if provided
    if (category && enhanced.categories) {
      enhanced.selectedCategory = category;
    }
    
    // Pre-select the option if provided
    if (option && enhanced.options) {
      enhanced.selectedOption = option;
    }
    
    // Pre-select the trip type if provided
    if (tripType && enhanced.trip_types) {
      enhanced.selectedTripType = tripType;
    }
    
    return enhanced;
  };
  
  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title={getServiceTitle()} onBack={() => navigate(-1)} />
      <div className="pt-16 pb-20">
        <DynamicServiceForm 
          serviceId={service?.id || ''}
          serviceType={serviceType || service?.name.toLowerCase() || ''}
          serviceName={service?.name}
          serviceImageUrl={service?.image_url}
          serviceDetails={serviceDetails || undefined}
          optionalFields={enhanceOptionalFields()}
          onSubmitSuccess={handleSubmitRequest}
        />
      </div>
      <BottomNavigation activeTab="services" />
    </div>
  );
};

export default ServiceRequestForm;
