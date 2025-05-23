
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './formHelpers';

interface DateTimeFieldsProps {
  form: UseFormReturn<FormData>;
}

const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ form }) => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="preferredDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-darcare-beige">
              {t('services.preferredDate')}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="date"
                  className="pl-10"
                  {...field}
                />
                <Clock size={16} className="absolute left-3 top-3 text-darcare-gold" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="preferredTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-darcare-beige">
              {t('services.preferredTime')}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="time"
                  className="pl-10 appearance-none"
                  style={{ 
                    // Override default time input appearance
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                  }}
                  {...field}
                />
                <Clock size={16} className="absolute left-3 top-3 text-darcare-gold pointer-events-none" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateTimeFields;
