
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface FormField {
  id: string;
  field_name: string;
  label: string;
  input_type: string;
  required: boolean;
  options?: {
    choices?: string[];
    min?: number;
    max?: number;
    placeholder?: string;
  };
}

interface DynamicFormFieldsProps {
  formFields: FormField[];
  form: UseFormReturn<any>;
}

const DynamicFormFields: React.FC<DynamicFormFieldsProps> = ({
  formFields,
  form
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const renderField = (field: FormField) => {
    const fieldName = field.field_name;
    
    switch (field.input_type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem className="mb-3">
                <FormLabel className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type={field.input_type}
                    placeholder={field.options?.placeholder}
                    className={cn(
                      "h-10 bg-background border",
                      isDarkMode 
                        ? "border-darcare-gold/30 focus:border-darcare-gold/60" 
                        : "border-darcare-deepGold/30 focus:border-darcare-deepGold/60"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'number':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            rules={{ 
              required: field.required,
              min: field.options?.min,
              max: field.options?.max
            }}
            render={({ field: formField }) => (
              <FormItem className="mb-3">
                <FormLabel className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type="number"
                    min={field.options?.min || 0}
                    max={field.options?.max || 100}
                    placeholder={field.options?.placeholder}
                    className={cn(
                      "h-10 bg-background border",
                      isDarkMode 
                        ? "border-darcare-gold/30 focus:border-darcare-gold/60" 
                        : "border-darcare-deepGold/30 focus:border-darcare-deepGold/60"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'select':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem className="mb-3">
                <FormLabel className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger className={cn(
                      "h-10 bg-background border",
                      isDarkMode 
                        ? "border-darcare-gold/30 focus:border-darcare-gold/60" 
                        : "border-darcare-deepGold/30 focus:border-darcare-deepGold/60"
                    )}>
                      <SelectValue placeholder={field.options?.placeholder || `${t('common.select')} ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.choices?.map((choice: string) => (
                      <SelectItem key={choice} value={choice}>
                        {choice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'textarea':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            rules={{ required: field.required }}
            render={({ field: formField }) => (
              <FormItem className="mb-3">
                <FormLabel className={cn(
                  "text-sm font-medium",
                  isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                )}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...formField}
                    placeholder={field.options?.placeholder}
                    className={cn(
                      "min-h-[80px] bg-background border resize-none",
                      isDarkMode 
                        ? "border-darcare-gold/30 focus:border-darcare-gold/60" 
                        : "border-darcare-deepGold/30 focus:border-darcare-deepGold/60"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'checkbox':
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem className="mb-3 flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                    className={cn(
                      isDarkMode 
                        ? "border-darcare-gold/30 data-[state=checked]:bg-darcare-gold data-[state=checked]:text-darcare-navy" 
                        : "border-darcare-deepGold/30 data-[state=checked]:bg-darcare-deepGold"
                    )}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className={cn(
                    "text-sm font-medium",
                    isDarkMode ? "text-darcare-gold" : "text-darcare-deepGold"
                  )}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      {formFields.map(renderField)}
    </div>
  );
};

export default DynamicFormFields;
