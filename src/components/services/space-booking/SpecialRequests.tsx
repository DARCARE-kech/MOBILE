
import React from 'react';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';
import FormSectionTitle from '@/components/services/FormSectionTitle';

interface SpecialRequestsProps {
  form: any;
}

export const SpecialRequests: React.FC<SpecialRequestsProps> = ({ form }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  return (
    <div className="mt-6">
      <FormSectionTitle 
        title={t('services.specialRequests', 'Special Requests')} 
        icon={<Pencil className="w-5 h-5" />}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem className="mt-2">
            <FormControl>
              <Textarea
                placeholder={t('services.specialRequestsPlaceholder', 'Any special requirements or requests...')}
                className={cn(
                  "min-h-[100px] border resize-none",
                  isDarkMode 
                    ? "bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50" 
                    : "bg-white border-darcare-deepGold/20 text-darcare-charcoal placeholder:text-darcare-charcoal/50"
                )}
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
