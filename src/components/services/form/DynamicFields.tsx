
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FormData } from './formHelpers';

interface DynamicFieldsProps {
  form: UseFormReturn<FormData>;
  optionalFields: Record<string, any>;
}

const DynamicFields: React.FC<DynamicFieldsProps> = ({ form, optionalFields }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Select Fields */}
      {optionalFields.selectFields && optionalFields.selectFields.map((field: any, index: number) => (
        <FormField
          key={`select-${field.name}-${index}`}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{t(field.label)}</FormLabel>
              <Select
                onValueChange={formField.onChange}
                defaultValue={formField.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field.options.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {t(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      {/* Number Fields */}
      {optionalFields.numberFields && optionalFields.numberFields.map((field: any, index: number) => (
        <FormField
          key={`number-${field.name}-${index}`}
          control={form.control}
          name={field.name}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{t(field.label)}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={field.min}
                  max={field.max}
                  step="1"
                  {...formField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      {/* Multi-Select Fields (as checkboxes) */}
      {optionalFields.multiSelectFields && optionalFields.multiSelectFields.map((field: any) => (
        <div key={`multi-${field.name}`} className="space-y-2">
          <FormLabel>{t(field.label)}</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            {field.options.map((option: string) => {
              const fieldName = `${field.name}.${option.replace(/\s+/g, '_').toLowerCase()}`;
              return (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as any}
                  render={({ field: formField }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={formField.value}
                          onCheckedChange={formField.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">{t(option)}</FormLabel>
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Categories */}
      {optionalFields.categories && (
        <FormField
          control={form.control}
          name="selectedCategory"
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{t('services.category', 'Category')}</FormLabel>
              <Select
                onValueChange={formField.onChange}
                defaultValue={formField.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('services.selectCategory', 'Select Category')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {optionalFields.categories.map((category: string) => (
                    <SelectItem key={category} value={category}>
                      {t(category)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Options */}
      {optionalFields.options && (
        <FormField
          control={form.control}
          name="selectedOption"
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{t('services.option', 'Option')}</FormLabel>
              <Select
                onValueChange={formField.onChange}
                defaultValue={formField.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('services.selectOption', 'Select Option')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {optionalFields.options.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {t(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default DynamicFields;
