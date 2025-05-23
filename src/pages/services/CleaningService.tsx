import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import ServiceHeader from '@/components/services/form/ServiceHeader';
import OptionField from '@/components/services/form/OptionField';
import DateTimePickerSection from '@/components/services/form/DateTimePickerSection';
import NoteInput from '@/components/services/form/NoteInput';
import { useAuth } from '@/contexts/AuthContext';
import { ServiceDetail } from '@/hooks/services/types';
import { Home, Bed, ShowerHead } from 'lucide-react';

interface CleaningServiceProps {
  serviceData?: ServiceDetail;
  existingRequest?: any;
  editMode?: boolean;
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  cleaningType: string;
  rooms: {
    bedroom: boolean;
    kitchen: boolean;
    bathroom: boolean;
    balcony: boolean;
    all_areas: boolean;
  };
}

const CleaningService: React.FC<CleaningServiceProps> = ({ 
  serviceData, 
  existingRequest, 
  editMode = false
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const optionalFields = serviceData?.optional_fields || {};
  const cleaningTypes = optionalFields.cleaning_types || ["standard cleaning", "deep cleaning", "premium cleaning"];
  const roomOptions = optionalFields.rooms || ["bedroom", "kitchen", "bathroom", "balcony", "all areas"];
  
  // Extract date and time from existingRequest if in edit mode
  const getDefaultDate = (): Date => {
    if (editMode && existingRequest?.preferred_time) {
      return new Date(existingRequest.preferred_time);
    }
    return new Date();
  };
  
  const getDefaultTime = (): string => {
    if (editMode && existingRequest?.preferred_time) {
      const date = new Date(existingRequest.preferred_time);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    return '12:00';
  };
  
  // Extract selected rooms from existingRequest
  const getDefaultRooms = () => {
    const defaultRooms = {
      bedroom: false,
      kitchen: false,
      bathroom: false,
      balcony: false,
      all_areas: false
    };
    
    if (editMode && existingRequest?.selected_options?.selectedRooms) {
      const selectedRooms = existingRequest.selected_options.selectedRooms;
      selectedRooms.forEach((room: string) => {
        if (defaultRooms.hasOwnProperty(room)) {
          defaultRooms[room as keyof typeof defaultRooms] = true;
        }
      });
    }
    
    return defaultRooms;
  };
  
  const form = useForm<FormValues>({
    defaultValues: {
      date: getDefaultDate(),
      time: getDefaultTime(),
      note: editMode && existingRequest?.note ? existingRequest.note : '',
      cleaningType: editMode && existingRequest?.selected_options?.cleaningType 
        ? existingRequest.selected_options.cleaningType 
        : '',
      rooms: getDefaultRooms()
    },
    mode: 'onChange'
  });
  
  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    const { cleaningType, rooms } = form.getValues();
    // Check if a cleaning type is selected
    if (!cleaningType) return false;
    
    // Check if at least one room is selected
    const hasSelectedRoom = Object.values(rooms).some(value => value === true);
    if (!hasSelectedRoom) return false;
    
    return true;
  };
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error(t('common.error'), {
        description: t('services.loginRequired')
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format the date and time for the preferred time
      const isoDateTime = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        parseInt(data.time.split(':')[0]),
        parseInt(data.time.split(':')[1])
      ).toISOString();
      
      // Convert selected rooms to a more concise format
      const selectedRooms = Object.entries(data.rooms)
        .filter(([_, isSelected]) => isSelected)
        .map(([room]) => room);
      
      // Properly structure the request data with root fields
      // and form-specific fields in selected_options
      const requestData = {
        // Root level fields for the database
        service_id: serviceData?.service_id,
        user_id: user.id,
        profile_id: user.id,
        preferred_time: isoDateTime,
        note: data.note || null,
        // Only form-specific fields in selected_options
        selected_options: {
          cleaningType: data.cleaningType,
          selectedRooms
        }
      };
      
      let error;
      
      if (editMode && existingRequest?.id) {
        // Update existing request
        const { error: updateError } = await supabase
          .from('service_requests')
          .update(requestData)
          .eq('id', existingRequest.id);
        
        error = updateError;
        
        if (!updateError) {
          toast.success(t('services.requestUpdated'), {
            description: t('services.requestUpdatedDesc')
          });
        }
      } else {
        // Create new request
        const { error: insertError } = await supabase
          .from('service_requests')
          .insert(requestData);
        
        error = insertError;
        
        if (!insertError) {
          toast.success(t('services.requestSubmitted'), {
            description: t('services.requestSubmittedDesc')
          });
        }
      }
      
      if (error) throw error;
      
      navigate('/services');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(t('common.error'), {
        description: t('services.requestErrorDesc')
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-4 pb-24">
      {/* Service Header with instructions */}
      <ServiceHeader 
        serviceName={serviceData?.category 
  ? serviceData.category.charAt(0).toUpperCase() + serviceData.category.slice(1) 
  : t('services.cleaning', 'Cleaning')}

        serviceDetail={serviceData}
      />
      
      {/* Form Card */}
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Cleaning Type Option */}
            <OptionField
              form={form}
              fieldType="radio"
              name="cleaningType"
              label={t('services.cleaningType', 'Cleaning Type')}
              options={cleaningTypes}
              icon={<Home className="h-5 w-5" />}
            />
            
            {/* Rooms Selection */}
            <OptionField
              form={form}
              fieldType="checkbox"
              name="rooms"
              label={t('services.selectRooms', 'Select Rooms')}
              options={roomOptions}
              icon={<Bed className="h-5 w-5" />}
              subtitle={t('services.roomsSubtitle', 'Choose which areas need cleaning')}
            />
            
            {/* Date and Time Selection */}
            <DateTimePickerSection form={form} />
            
            {/* Notes Field */}
            <NoteInput form={form} />
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
            >
              {isSubmitting ? t('common.submitting', 'Submitting...') : 
                editMode ? t('services.updateRequest', 'Update Request') : t('services.sendRequest', 'Send Request')
              }
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CleaningService;
