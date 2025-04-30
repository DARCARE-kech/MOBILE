
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';

interface NoteInputProps {
  form: UseFormReturn<any>;
}

const NoteInput: React.FC<NoteInputProps> = ({ form }) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="note"
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel className="text-darcare-gold font-serif">
            {t('services.additionalNotes')}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={t('services.notesPlaceholder')}
              className="min-h-24 bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NoteInput;
