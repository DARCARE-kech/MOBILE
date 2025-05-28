
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import FormSectionTitle from '@/components/services/FormSectionTitle';

interface DateTimePickerSectionProps {
  form: UseFormReturn<any>;
}

const DateTimePickerSection: React.FC<DateTimePickerSectionProps> = ({ form }) => {
  const { t } = useTranslation();
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  
  // Generate time options (every 15 minutes)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();
  
  return (
    <div className="space-y-6 mb-6">
      <FormSectionTitle 
        title={t('services.schedulingInformation', 'Scheduling Information')} 
        icon={<CalendarIcon className="h-5 w-5" />}
        rawKeys={true}
      />
      
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormSectionTitle 
              title={t('services.preferredDate', 'Preferred Date')}
              className="mb-2"
              rawKeys={true}
            />
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-4 pr-4 py-3 text-left font-normal rounded-2xl shadow-sm transition-all duration-200",
                      "bg-darcare-navy/50 border-darcare-gold/30 text-darcare-beige",
                      "hover:bg-darcare-gold/10 hover:border-darcare-gold/50 hover:shadow-md",
                      "focus:border-darcare-gold/60 focus:ring-0",
                      !field.value && "text-darcare-beige/70"
                    )}
                  >
                    <CalendarIcon className="mr-3 h-4 w-4 text-darcare-gold" />
                    {field.value ? format(field.value, "PPP") : <span>{t('services.pickADate', 'Pick a date')}</span>}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-darcare-navy border-darcare-gold/20 rounded-2xl shadow-lg" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  className="p-3 pointer-events-auto rounded-2xl"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormSectionTitle
              title={t('services.preferredTime', 'Preferred Time')}
              className="mb-2"
              rawKeys={true}
            />
            <FormControl>
              <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full py-3 font-normal rounded-2xl shadow-sm transition-all duration-200",
                      "bg-darcare-navy/50 border-darcare-gold/30 text-darcare-beige",
                      "hover:bg-darcare-gold/10 hover:border-darcare-gold/50 hover:shadow-md",
                      "focus:border-darcare-gold/60 focus:ring-0 focus:shadow-lg",
                      "flex items-center justify-center gap-2",
                      !field.value && "text-darcare-beige/70"
                    )}
                  >
                    <Clock className="mr-3 h-4 w-4 text-darcare-gold" />
                    <span className="flex-1 text-center">
                      {field.value || t('services.selectTime', 'Select Time')}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-64 p-0 bg-darcare-navy border-darcare-gold/20 rounded-2xl shadow-lg" 
                  align="start"
                >
                  <ScrollArea className="h-64 p-2">
                    <div className="space-y-1">
                      {timeOptions.map((time) => (
                        <Button
                          key={time}
                          variant="ghost"
                          className={cn(
                            "w-full justify-center text-center py-2 rounded-xl transition-all duration-200",
                            "flex justify-center text-center",
                            field.value === time
                              ? "bg-darcare-gold/20 text-darcare-gold border border-darcare-gold/40"
                              : "text-darcare-beige hover:bg-darcare-gold/10 hover:text-darcare-gold"
                          )}
                          onClick={() => {
                            field.onChange(time);
                            setIsTimeOpen(false);
                          }}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateTimePickerSection;
