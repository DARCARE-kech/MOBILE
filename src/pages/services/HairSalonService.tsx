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

  const optionalFields = serviceData?.optional_fields || {};
  const clientGenders = optionalFields.client_gender || ['Man', 'Woman'];
  const serviceTypes = optionalFields.services || ['Haircut', 'Blow dry', 'Coloring'];
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
    return !!values.service_type;
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error(t('common.error'), {
        description: t('services.loginRequired'),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const dateTime = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        parseInt(data.time.split(':')[0]),
        parseInt(data.time.split(':')[1])
      ).toISOString();

      const requestData = {
        service_id: serviceData?.service_id,
        user_id: user.id,
        profile_id: user.id,
        preferred_time: dateTime,
        note: data.note || null,
        selected_options: {
          client_gender: data.client_gender,
          service_type: data.service_type,
          stylist_gender_preference: data.stylist_gender_preference,
        },
      };

      let error;

      if (editMode && existingRequest?.id) {
        const { error: updateError } = await supabase
          .from('service_requests')
          .update(requestData)
          .eq('id', existingRequest.id);
        error = updateError;

        if (!updateError) {
          toast.success(t('services.requestUpdated'), {
            description: t('services.requestUpdatedDesc'),
          });
        }
      } else {
        const { error: insertError } = await supabase
          .from('service_requests')
          .insert(requestData);
        error = insertError;

        if (!insertError) {
          toast.success(t('services.requestSubmitted'), {
            description: t('services.requestSubmittedDesc'),
          });
        }
      }

      if (error) throw error;

      navigate('/services');
    } catch (err) {
      console.error('Request error:', err);
      toast.error(t('common.error'), {
        description: t('services.requestErrorDesc'),
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
              label={t('services.clientGender')}
              options={clientGenders}
              icon={<Scissors className="h-5 w-5" />}
            />
            <OptionField
              form={form}
              fieldType="select"
              name="service_type"
              label={t('services.hairServices')}
              options={serviceTypes}
              subtitle={t('services.selectOne')}
            />
            <OptionField
              form={form}
              fieldType="select"
              name="stylist_gender_preference"
              label={t('services.stylistGender')}
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
                ? t('common.submitting')
                : editMode
                ? t('services.updateRequest')
                : t('services.sendRequest')}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default HairSalonService;
