
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
  
  return (
    <div className="space-y-6 mb-6">
      <FormSectionTitle 
        title={t('services.schedulingInformation')} 
        icon={<CalendarIcon className="h-5 w-5" />}
        rawKeys={true}
      />
      
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormSectionTitle 
              title={t('services.preferredDate')}
              className="mb-2"
              rawKeys={true}
            />
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-darcare-gold" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-darcare-navy border-darcare-gold/20" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
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
              title={t('services.preferredTime')}
              className="mb-2"
              rawKeys={true}
            />
            <FormControl>
              <div className="relative">
                <Input
                  type="time"
                  className="pl-10 bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige focus:border-darcare-gold/50 rounded-md"
                  {...field}
                />
                <Clock size={16} className="absolute left-3 top-3 text-darcare-gold" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateTimePickerSection;
