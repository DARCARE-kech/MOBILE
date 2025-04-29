
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from './formHelpers';

interface DynamicFieldsProps {
  form: UseFormReturn<FormData>;
  optionalFields: Record<string, any>;
}

const DynamicFields: React.FC<DynamicFieldsProps> = ({ form, optionalFields }) => {
  if (!optionalFields) return null;
  
  return (
    <div className="space-y-4">
      {/* Render options as radio buttons if present */}
      {optionalFields.options && (
        <FormField
          control={form.control}
          name="selectedOption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-darcare-gold font-serif">
                {optionalFields.optionsLabel || 'Select an option'}
              </FormLabel>
              <div className="space-y-3">
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-2"
                >
                  {optionalFields.options.map((option: any, index: number) => {
                    const optionName = typeof option === 'string' ? option : option.name;
                    const optionDesc = typeof option === 'string' ? '' : option.description;
                    
                    return (
                      <div key={index} className="border border-darcare-gold/20 rounded-lg p-3 bg-darcare-navy/50 flex items-start gap-3">
                        <RadioGroupItem value={optionName} id={`option-${index}`} className="mt-1 border-darcare-gold/50" />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          <span className="text-darcare-gold font-medium block mb-1">{optionName}</span>
                          {optionDesc && (
                            <span className="text-darcare-beige/70 text-sm">{optionDesc}</span>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* Render categories as radio buttons if present */}
      {optionalFields.categories && (
        <FormField
          control={form.control}
          name="selectedCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-darcare-gold font-serif">
                {optionalFields.categoriesLabel || 'Select a category'}
              </FormLabel>
              <div className="space-y-3">
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-2"
                >
                  {optionalFields.categories.map((category: string, index: number) => (
                    <div key={index} className="border border-darcare-gold/20 rounded-lg p-3 bg-darcare-navy/50 flex items-start gap-3">
                      <RadioGroupItem value={category} id={`category-${index}`} className="mt-1 border-darcare-gold/50" />
                      <Label htmlFor={`category-${index}`} className="flex-1 cursor-pointer">
                        <span className="text-darcare-gold font-medium">{category}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* Render checkbox options if present */}
      {optionalFields.checkOptions && (
        <div className="space-y-3">
          <h3 className="text-darcare-gold font-serif text-base">
            {optionalFields.checkOptionsLabel || 'Additional Options'}
          </h3>
          {optionalFields.checkOptions.map((option: string, index: number) => {
            const fieldName = `checkOptions.check_${option.replace(/\s+/g, '_').toLowerCase()}`;
            
            return (
              <FormField
                key={index}
                control={form.control}
                name={fieldName}
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id={`check-${index}`}
                      className="border-darcare-gold/50 data-[state=checked]:bg-darcare-gold data-[state=checked]:text-darcare-navy"
                    />
                    <Label htmlFor={`check-${index}`} className="text-darcare-beige">
                      {option}
                    </Label>
                  </div>
                )}
              />
            );
          })}
        </div>
      )}
      
      {/* Render custom fields if present */}
      {optionalFields.customFields && optionalFields.customFields.map((customField: any, index: number) => {
        if (customField.type === 'text' || customField.type === 'number') {
          return (
            <FormField
              key={index}
              control={form.control}
              name={customField.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darcare-beige">{customField.label}</FormLabel>
                  <FormControl>
                    <Input 
                      type={customField.type} 
                      placeholder={customField.placeholder}
                      className="border-darcare-gold/30 bg-darcare-navy/50 focus:border-darcare-gold/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }
        
        if (customField.type === 'textarea') {
          return (
            <FormField
              key={index}
              control={form.control}
              name={customField.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darcare-beige">{customField.label}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={customField.placeholder}
                      className="border-darcare-gold/30 bg-darcare-navy/50 focus:border-darcare-gold/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }
        
        return null;
      })}
    </div>
  );
};

export default DynamicFields;
