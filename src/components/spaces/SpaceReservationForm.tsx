
import React, { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useSpaceReservation } from '@/hooks/useSpaceReservation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

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
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  const {
    space,
    formFields,
    form,
    isSubmitting,
    handleSubmit
  } = useSpaceReservation(spaceId, existingReservationId);

  const onSubmit = async (values: any) => {
    // Combine date and time
    const selectedDate = values.preferred_time;
    if (selectedTime && selectedDate) {
      const [hours, minutes] = selectedTime.split(':');
      const datetime = new Date(selectedDate);
      datetime.setHours(parseInt(hours), parseInt(minutes));
      values.preferred_time = datetime;
    }

    const success = await handleSubmit(values);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  const renderFormField = (field: any) => {
    const fieldName = field.field_name;
    
    switch (field.input_type) {
      case 'text':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem className="mb-3">
                <FormLabel className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    className={cn(
                      "h-10 bg-background border",
                      isDarkMode 
                        ? "border-darcare-gold/30 focus:border-darcare-gold/60" 
                        : "border-darcare-deepGold/30 focus:border-darcare-deepGold/60"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'number':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem className="mb-3">
                <FormLabel className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="number"
                    min={field.options?.min || 0}
                    max={field.options?.max || 100}
                    className={cn(
                      "h-10 bg-background border",
                      isDarkMode 
                        ? "border-darcare-gold/30 focus:border-darcare-gold/60" 
                        : "border-darcare-deepGold/30 focus:border-darcare-deepGold/60"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem className="mb-3">
                <FormLabel className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger className={cn(
                      "h-10 bg-background border",
                      isDarkMode 
                        ? "border-darcare-gold/30 focus:border-darcare-gold/60" 
                        : "border-darcare-deepGold/30 focus:border-darcare-deepGold/60"
                    )}>
                      <SelectValue placeholder={`${t('common.select')} ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.choices?.map((choice: string) => (
                      <SelectItem key={choice} value={choice}>
                        {choice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  if (!space) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 max-h-[calc(100vh-140px)] overflow-y-auto">
      <div className="mb-4">
        <h2 className={cn(
          "text-xl font-serif",
          isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
        )}>
          {t('services.reserve')} {space.name}
        </h2>
        {space.description && (
          <p className={cn(
            "text-sm mt-1",
            isDarkMode ? "text-darcare-beige/70" : "text-foreground/70"
          )}>
            {space.description}
          </p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {/* Date and Time Selection */}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="preferred_time"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                  )}>
                    {t('services.date')} *
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-10 w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                            isDarkMode 
                              ? "border-darcare-gold/30 hover:border-darcare-gold/60" 
                              : "border-darcare-deepGold/30 hover:border-darcare-deepGold/60"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : t('services.selectDate')}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className={cn(
                "text-sm font-medium",
                isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
              )}>
                {t('services.time')} *
              </FormLabel>
              <Select onValueChange={setSelectedTime} value={selectedTime}>
                <SelectTrigger className={cn(
                  "h-10 bg-background border",
                  isDarkMode 
                    ? "border-darcare-gold/30 focus:border-darcare-gold/60" 
                    : "border-darcare-deepGold/30 focus:border-darcare-deepGold/60"
                )}>
                  <SelectValue placeholder={t('services.selectTime')} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 14 }, (_, i) => {
                    const hour = i + 8; // 8 AM to 9 PM
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
          </div>

          {/* Dynamic Form Fields */}
          {formFields?.map(renderFormField)}

          {/* Note Field */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {t('services.specialRequests')}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('services.specialRequestsPlaceholder')}
                    className={cn(
                      "min-h-[80px] bg-background border resize-none",
                      isDarkMode 
                        ? "border-darcare-gold/30 focus:border-darcare-gold/60" 
                        : "border-darcare-deepGold/30 focus:border-darcare-deepGold/60"
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "w-full h-12 font-serif text-base mt-6",
              isDarkMode 
                ? "bg-darcare-gold hover:bg-darcare-gold/90 text-darcare-navy" 
                : "bg-darcare-deepGold hover:bg-darcare-deepGold/90 text-white"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('services.submitting')}
              </span>
            ) : existingReservationId ? (
              t('services.updateReservation', 'Update Reservation')
            ) : (
              t('services.confirmReservation', 'Confirm Reservation')
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SpaceReservationForm;
