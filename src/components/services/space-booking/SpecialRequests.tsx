
import React from 'react';
import { PenLine } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { UseFormReturn } from 'react-hook-form';

interface SpecialRequestsProps {
  form: UseFormReturn<any>;
}

export const SpecialRequests: React.FC<SpecialRequestsProps> = ({ form }) => {
  return (
    <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
      <FormSectionTitle title="Special Requests" icon={<PenLine className="w-5 h-5" />} />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                placeholder="Any special requirements or arrangements..."
                className="resize-none bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </Card>
  );
};
