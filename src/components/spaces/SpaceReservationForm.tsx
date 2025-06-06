import React, { useEffect } from 'react';
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
        form.setValue('preferred_time', new Date(existingReservation.preferred_time));
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
            {/* Date and Time Selection */}
            <FormField
              control={form.control}
              name="preferred_time"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem className="mobile-form-field">
                  <FormLabel className={cn("text-sm font-medium", isDarkMode ? "text-darcare-gold" : "text-primary")}>
                    {t('services.dateAndTime', 'Date & Time')} *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "mobile-form-input w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            isDarkMode 
                              ? "border-darcare-gold/30 hover:border-darcare-gold/60 bg-darcare-navy" 
                              : "border-primary/30 hover:border-primary/60 bg-background"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP 'à' HH:mm") : t('services.selectDateTime', 'Select date and time')}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              const newDate = new Date(date);
                              if (field.value) {
                                newDate.setHours(field.value.getHours());
                                newDate.setMinutes(field.value.getMinutes());
                              }
                              field.onChange(newDate);
                            }
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={isSubmitting}
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
