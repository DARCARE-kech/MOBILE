
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useTranslation } from 'react-i18next';
import { TimeSelector } from '@/components/space-booking/TimeSelector';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Clock } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface DateTimeSelectorProps {
  form: any;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
}

export const DateTimeSelector = ({
  form,
  selectedTime,
  setSelectedTime,
}: DateTimeSelectorProps) => {
  const { t } = useTranslation();
  const [isTimeOpen, setIsTimeOpen] = React.useState(false);
  const { isDarkMode } = useTheme();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between mb-1">
              <FormLabel className={isDarkMode ? "text-darcare-beige" : "text-darcare-charcoal"}>
                {t('services.selectDate', 'Select Date')}
              </FormLabel>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border",
                        isDarkMode 
                          ? "bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige" 
                          : "bg-white border-darcare-deepGold/20 text-darcare-charcoal"
                      )}
                    >
                      <CalendarIcon className={cn(
                        "mr-2 h-4 w-4",
                        isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                      )} />
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span className="opacity-50">{t('services.pickDate', 'Pick a date')}</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    disabled={date => date < new Date()}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-1">
        <FormLabel className={isDarkMode ? "text-darcare-beige" : "text-darcare-charcoal"}>
          {t('services.selectTime', 'Select Time')}
        </FormLabel>
        <TimeSelector
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
          isOpen={isTimeOpen}
          onOpenChange={setIsTimeOpen}
        />
        {!selectedTime && form.formState.isSubmitted && (
          <p className="text-sm text-red-500 mt-1">
            {t('services.timeRequired', 'Please select a time')}
          </p>
        )}
      </div>
    </div>
  );
};
