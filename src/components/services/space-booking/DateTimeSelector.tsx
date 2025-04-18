
import React, { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FormField, FormItem } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { TimeSelector } from '@/components/space-booking/TimeSelector';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface DateTimeSelectorProps {
  form: UseFormReturn<any>;
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ 
  form, 
  selectedTime, 
  setSelectedTime 
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  return (
    <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
      <FormSectionTitle title="Date & Time" icon={<CalendarClock className="w-5 h-5" />} />
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige",
                    )}
                  >
                    <div className="flex items-center">
                      <CalendarClock className="mr-2 h-4 w-4 text-darcare-gold" />
                      {format(field.value, "PPP")}
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-darcare-navy border-darcare-gold/20" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      if (date) {
                        field.onChange(date);
                        setIsDatePickerOpen(false);
                      }
                    }}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        
        <TimeSelector
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
          isOpen={isTimeOpen}
          onOpenChange={setIsTimeOpen}
        />
      </div>
    </Card>
  );
};
