import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import ServiceHeader from '@/components/services/form/ServiceHeader';
import OptionField from '@/components/services/form/OptionField';
import DateTimePickerSection from '@/components/services/form/DateTimePickerSection';
import NoteInput from '@/components/services/form/NoteInput';
import { ServiceDetail } from '@/hooks/services/types';
import { Scissors } from 'lucide-react';

interface HairSalonServiceProps {
  serviceData?: ServiceDetail;
  existingRequest?: any;
  editMode?: boolean;
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  client_gender: string;
  service_type: string;
  stylist_gender_preference: string;
}

const HairSalonService: React.FC<HairSalonServiceProps> = ({
  serviceData,
  existingRequest,
  editMode = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('Hair Salon Service Data:', serviceData);
  console.log('Optional Fields:', serviceData?.optional_fields);
  console.log('Existing Request:', existingRequest);

  const optionalFields = serviceData?.optional_fields || {};
  const clientGenders = optionalFields.client_gender || ['Man', 'Woman'];
  const serviceTypes = optionalFields.services || ['Haircut', 'Beard trim', 'Coloring', 'Blow dry', 'Shaving', 'Hair wash'];
  const stylistPreferences = optionalFields.stylist_gender_preference || ['Any', 'Male', 'Female'];

  const form = useForm<FormValues>({
    defaultValues: {
      date: new Date(),
      time: '12:00',
      note: editMode && existingRequest?.note ? existingRequest.note : '',
      client_gender: editMode && existingRequest?.selected_options?.client_gender || clientGenders[0],
      service_type: editMode && existingRequest?.selected_options?.service_type || serviceTypes[0],
      stylist_gender_preference:
        editMode && existingRequest?.selected_options?.stylist_gender_preference || stylistPreferences[0],
    },
    mode: 'onChange',
  });

  const isFormValid = () => {
    const values = form.getValues();
    return !!values.service_type && !!values.client_gender && !!values.stylist_gender_preference;
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error(t('common.error', 'Error'), {
        description: t('services.loginRequired', 'You must be logged in to submit a request.'),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the date and time into ISO string
      const dateTime = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        parseInt(data.time.split(':')[0]),
        parseInt(data.time.split(':')[1])
      ).toISOString();

      // Properly structure the request data
      const requestData = {
        // Root level fields
        service_id: serviceData?.service_id,
        user_id: user.id,
        profile_id: user.id,
        preferred_time: dateTime,
        note: data.note || null,
        // Only form-specific data in selected_options
        selected_options: {
          client_gender: data.client_gender,
          service_type: data.service_type,
          stylist_gender_preference: data.stylist_gender_preference,
        },
      };

      console.log('Submitting Hair Salon request:', requestData);

      let error;

      if (editMode && existingRequest?.id) {
        // Update existing request
        const { error: updateError } = await supabase
          .from('service_requests')
          .update(requestData)
          .eq('id', existingRequest.id);
          
        error = updateError;

        if (!updateError) {
          toast.success(t('services.requestUpdated', 'Request Updated'), {
            description: t('services.requestUpdatedDesc', 'Your hair salon appointment has been updated successfully.'),
          });
        }
      } else {
        // Create new request
        const { error: insertError } = await supabase
          .from('service_requests')
          .insert(requestData);
          
        error = insertError;

        if (!insertError) {
          toast.success(t('services.requestSubmitted', 'Request Submitted'), {
            description: t('services.requestSubmittedDesc', 'Your hair salon appointment has been submitted successfully.'),
          });
        }
      }

      if (error) throw error;

      navigate('/services');
    } catch (err) {
      console.error('Request error:', err);
      toast.error(t('common.error', 'Error'), {
        description: t('services.requestErrorDesc', 'An error occurred while processing your request. Please try again.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 pb-24">
      <ServiceHeader
        serviceName={serviceData?.category ?? 'hair'}
        serviceDetail={serviceData}
      />

      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <OptionField
              form={form}
              fieldType="select"
              name="client_gender"
              label={t('services.clientGender', 'Client Gender')}
              options={clientGenders}
              icon={<Scissors className="h-5 w-5" />}
            />
            <OptionField
              form={form}
              fieldType="select"
              name="service_type"
              label={t('services.hairServices', 'Hair Services')}
              options={serviceTypes}
              subtitle={t('services.selectOne', 'Select one service')}
            />
            <OptionField
              form={form}
              fieldType="select"
              name="stylist_gender_preference"
              label={t('services.stylistGender', 'Stylist Gender Preference')}
              options={stylistPreferences}
            />
            <DateTimePickerSection form={form} />
            <NoteInput form={form} />
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
            >
              {isSubmitting
                ? t('common.submitting', 'Submitting...')
                : editMode
                ? t('services.updateRequest', 'Update Request')
                : t('services.sendRequest', 'Send Request')}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default HairSalonService;
