
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Calendar } from '@/components/ui/calendar';
import { TimeSelector } from '@/components/space-booking/TimeSelector';
import { FormData } from '@/components/services/form/formHelpers';

interface DateTimeSelectorProps {
  form: UseFormReturn<FormData>;
  selectedTime: Date | null;
  setSelectedTime: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  form,
  selectedTime,
  setSelectedTime
}) => {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | null>(null);
  const [timeValue, setTimeValue] = useState<string>('');
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    form.setValue('preferredDate', date.toISOString().split('T')[0]);
    // Also set date field for space booking forms
    form.setValue('date', date);
    
    // If time is also selected, update the full datetime
    if (timeValue) {
      const newDateTime = new Date(date);
      const [hours, minutes] = timeValue.split(':');
      newDateTime.setHours(parseInt(hours), parseInt(minutes));
      setSelectedTime(newDateTime);
      form.setValue('preferredTime', timeValue);
    }
  };
  
  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setTimeValue(time);
    form.setValue('preferredTime', time);
    
    // If date is also selected, update the full datetime
    if (date) {
      const newDateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      newDateTime.setHours(parseInt(hours), parseInt(minutes));
      setSelectedTime(newDateTime);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div>
        <h4 className="text-base mb-3 text-darcare-gold font-serif font-medium">{t('services.selectDate', 'Select Date')}</h4>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
          className="rounded-2xl border-0 shadow-lg bg-darcare-navy/70 pointer-events-auto"
        />
      </div>
      
      {/* Time Selector */}
      <div>
        <h4 className="text-base mb-3 text-darcare-gold font-serif font-medium">{t('services.selectTime', 'Select Time')}</h4>
        <TimeSelector
          selectedTime={timeValue}
          onTimeSelect={handleTimeSelect}
          isOpen={isTimePickerOpen}
          onOpenChange={setIsTimePickerOpen}
        />
      </div>
    </div>
  );
};
