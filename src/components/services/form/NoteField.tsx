
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FormData } from './formHelpers';

interface NoteFieldProps {
  form: UseFormReturn<FormData>;
}

const NoteField: React.FC<NoteFieldProps> = ({ form }) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="note"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-darcare-beige">
            {t('services.additionalNotes')}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder={t('services.notesPlaceholder')}
              className="min-h-24 border-darcare-gold/30 bg-darcare-navy/50 focus:border-darcare-gold/50"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NoteField;
