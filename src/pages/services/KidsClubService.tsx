
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
import { Baby, AlertCircle } from 'lucide-react';

interface KidsClubServiceProps {
  serviceData?: ServiceDetail;
  existingRequest?: any;
  editMode?: boolean;
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  number_of_children: number;
  age_range: string;
  time_slot_start: string;
  time_slot_end: string;
  activities: {
    drawing: boolean;
    games: boolean;
    storytelling: boolean;
    outdoor_play: boolean;
  };
}

const KidsClubService: React.FC<KidsClubServiceProps> = ({
  serviceData,
  existingRequest,
  editMode = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);

  const optionalFields = serviceData?.optional_fields || {};
  const ageOptions = optionalFields.age_range || ["0-3", "4-7", "8-12"];
  const activityOptions = optionalFields.activities || ["Drawing", "Games", "Storytelling", "Outdoor play"];

  const getDefaultActivities = () => {
    const defaultState = {
      drawing: false,
      games: false,
      storytelling: false,
      outdoor_play: false,
    };
    if (editMode && existingRequest?.selected_options?.activities) {
      for (const key of Object.keys(defaultState)) {
        defaultState[key as keyof typeof defaultState] =
          existingRequest.selected_options.activities.includes(key);
      }
    }
    return defaultState;
  };

  const form = useForm<FormValues>({
    defaultValues: {
      date: new Date(),
      time: '12:00',
      note: editMode && existingRequest?.note ? existingRequest.note : '',
      number_of_children: editMode && existingRequest?.selected_options?.number_of_children || 1,
      age_range: editMode && existingRequest?.selected_options?.age_range || ageOptions[0],
      time_slot_start: editMode && existingRequest?.selected_options?.time_slot_start || '09:00',
      time_slot_end: editMode && existingRequest?.selected_options?.time_slot_end || '12:00',
      activities: getDefaultActivities()
    },
    mode: 'onChange'
  });

  const validateTimeRange = (start: string, end: string): boolean => {
    if (!start || !end) return false;

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    if (startHour > endHour) {
      setTimeError(t('services.endTimeMustBeAfterStartTime', 'End time must be after start time'));
      return false;
    }

    if (startHour === endHour && startMinute >= endMinute) {
      setTimeError(t('services.endTimeMustBeAfterStartTime', 'End time must be after start time'));
      return false;
    }

    setTimeError(null);
    return true;
  };

  const isFormValid = () => {
    const values = form.getValues();
    return values.number_of_children > 0 && 
      validateTimeRange(values.time_slot_start, values.time_slot_end);
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error(t('common.error'), {
        description: t('services.loginRequired'),
      });
      return;
    }

    // Validate time range before submission
    if (!validateTimeRange(data.time_slot_start, data.time_slot_end)) {
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
          number_of_children: data.number_of_children,
          age_range: data.age_range,
          time_slot_start: data.time_slot_start,
          time_slot_end: data.time_slot_end,
          activities: Object.entries(data.activities)
            .filter(([_, selected]) => selected)
            .map(([activity]) => activity)
        }
      };

      console.log('Submitting Kids Club request:', requestData);

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
        serviceName={serviceData?.category ?? 'kids'}
        serviceDetail={serviceData}
      />

      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <OptionField
              form={form}
              fieldType="number"
              name="number_of_children"
              label={t('services.numberOfChildren')}
              min={1}
              max={10}
              step={1}
              icon={<Baby className="h-5 w-5" />}
            />
            <OptionField
              form={form}
              fieldType="select"
              name="age_range"
              label={t('services.ageRange')}
              options={ageOptions}
            />
            
            {/* Time Range Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-darcare-beige">{t('services.timeSlot')}</h3>
                {timeError && (
                  <div className="flex items-center text-red-500 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {timeError}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <OptionField
                  form={form}
                  fieldType="time"
                  name="time_slot_start"
                  label={t('services.startTime')}
                  onChange={value => {
                    const end = form.getValues('time_slot_end');
                    validateTimeRange(value as string, end);
                  }}
                />
                <OptionField
                  form={form}
                  fieldType="time"
                  name="time_slot_end"
                  label={t('services.endTime')}
                  onChange={value => {
                    const start = form.getValues('time_slot_start');
                    validateTimeRange(start, value as string);
                  }}
                />
              </div>
            </div>
            
            <OptionField
              form={form}
              fieldType="checkbox"
              name="activities"
              label={t('services.activities')}
              options={activityOptions}
              subtitle={t('services.selectActivities')}
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

export default KidsClubService;
