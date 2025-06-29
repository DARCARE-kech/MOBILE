
import React, { useEffect, useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useSpaceReservation } from '@/hooks/useSpaceReservation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import DynamicFormFields from './DynamicFormFields';
import { Card } from '@/components/ui/card';

interface SpaceReservationFormProps {
  spaceId: string;
  existingReservationId?: string;
  onSuccess?: () => void;
}

const SpaceReservationForm: React.FC<SpaceReservationFormProps> = ({
  spaceId,
  existingReservationId,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  const {
    space,
    formFields,
    existingReservation,
    form,
    isSubmitting,
    handleSubmit
  } = useSpaceReservation(spaceId, existingReservationId);

  useEffect(() => {
    if (existingReservation) {
      if (existingReservation.preferred_time) {
        const dt = new Date(existingReservation.preferred_time);
        setSelectedDate(dt);
        setSelectedTime(`${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`);
      }

      if (existingReservation.note) {
        form.setValue('note', existingReservation.note);
      }
      if (existingReservation.custom_fields && formFields) {
        formFields.forEach((field) => {
          const value = existingReservation.custom_fields[field.field_name];
          if (value !== undefined) {
            form.setValue(field.field_name, value);
          }
        });
      }
    }
  }, [existingReservation, formFields, form]);

  const onSubmit = async (values: any) => {
    // Combine selected date and time
    if (selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(':');
      const combinedDateTime = new Date(selectedDate);
      combinedDateTime.setHours(parseInt(hours), parseInt(minutes));
      values.preferred_time = combinedDateTime;
    }

    const success = await handleSubmit(values);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  if (!space) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg">
        <div className="mb-6">
          <h2 className={cn(
            "text-xl font-serif mb-2",
            isDarkMode ? "text-darcare-gold" : "text-primary"
          )}>
            {existingReservationId ? t('services.updateReservation', 'Update Reservation') : t('services.reserve', 'Reserve')} {space.name}
          </h2>
          {space.description && (
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
            )}>
              {space.description}
            </p>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Selection */}
            <FormItem>
              <FormLabel className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-darcare-gold" : "text-primary"
              )}>
                {t('services.date', 'Date')} *
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "mobile-form-input w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                      isDarkMode 
                        ? "border-darcare-gold/30 hover:border-darcare-gold/60 bg-darcare-navy" 
                        : "border-primary/30 hover:border-primary/60 bg-background"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : t('services.selectDate', 'Select date')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            {/* Time Selection */}
            <FormItem>
              <FormLabel className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-darcare-gold" : "text-primary"
              )}>
                {t('services.time', 'Time')} *
              </FormLabel>
              <Select onValueChange={setSelectedTime} value={selectedTime}>
                <SelectTrigger className={cn(
                  "mobile-form-input h-10",
                  isDarkMode 
                    ? "border-darcare-gold/30 focus:border-darcare-gold/60 bg-darcare-navy" 
                    : "border-primary/30 focus:border-primary/60 bg-background"
                )}>
                  <SelectValue placeholder={t('services.selectTime', 'Select time')} />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto">
                  {Array.from({ length: 14 }, (_, i) => {
                    const hour = i + 8;
                    return ['00', '30'].map(minute => {
                      const time = `${hour.toString().padStart(2, '0')}:${minute}`;
                      return (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      );
                    });
                  }).flat()}
                </SelectContent>
              </Select>
            </FormItem>

            {/* Dynamic Form Fields */}
            {formFields && formFields.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-serif text-darcare-gold mb-2">
                  {t('services.serviceDetails', 'Service Details')}
                </h3>
                <DynamicFormFields formFields={formFields} form={form} />
              </div>
            )}

            {/* Note Field */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem className="mobile-form-field">
                  <FormLabel className={cn("text-sm font-medium", isDarkMode ? "text-darcare-gold" : "text-primary")}>
                    {t('services.specialRequests', 'Special requests')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('services.specialRequestsPlaceholder', 'Any special requests or notes...')}
                      className={cn(
                        "mobile-form-textarea resize-none",
                        isDarkMode 
                          ? "border-darcare-gold/30 focus:border-darcare-gold/60 bg-darcare-navy" 
                          : "border-primary/30 focus:border-primary/60 bg-background"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedDate || !selectedTime}
                className={cn(
                  "w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90 font-serif text-base"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('services.submitting', 'Submitting...')}
                  </span>
                ) : existingReservationId ? (
                  t('services.updateReservation', 'Update Reservation')
                ) : (
                  t('services.confirmReservation', 'Confirm Reservation')
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SpaceReservationForm;
