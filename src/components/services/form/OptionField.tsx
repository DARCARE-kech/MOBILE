
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';

interface OptionFieldProps {
  form: UseFormReturn<any>;
  fieldType: 'radio' | 'checkbox' | 'number' | 'toggle' | 'slider';
  name: string;
  label: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

const OptionField: React.FC<OptionFieldProps> = ({
  form,
  fieldType,
  name,
  label,
  options = [],
  min = 1,
  max = 10,
  step = 1
}) => {
  return (
    <div className="mb-4">
      {fieldType === 'radio' && options.length > 0 && (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-darcare-gold font-serif">{label}</FormLabel>
              <div className="space-y-3">
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-col space-y-2"
                >
                  {options.map((option, index) => (
                    <div key={index} className="border border-darcare-gold/20 rounded-lg p-3 bg-darcare-navy/50 flex items-start gap-3">
                      <RadioGroupItem 
                        value={option} 
                        id={`${name}-${index}`} 
                        className="mt-1 border-darcare-gold/50" 
                      />
                      <Label htmlFor={`${name}-${index}`} className="flex-1 cursor-pointer">
                        <span className="text-darcare-gold font-medium">{option}</span>
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

      {fieldType === 'checkbox' && options.length > 0 && (
        <div className="space-y-4">
          <Label className="text-darcare-gold font-serif">{label}</Label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`${name}.${option}`}
                render={({ field }) => (
                  <FormItem className="flex items-start space-x-3 space-y-0 rounded-md p-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-darcare-gold/50 data-[state=checked]:bg-darcare-gold data-[state=checked]:text-darcare-navy"
                      />
                    </FormControl>
                    <Label className="text-darcare-beige cursor-pointer" htmlFor={`${name}-${index}`}>
                      {option}
                    </Label>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>
      )}

      {fieldType === 'number' && (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-darcare-gold font-serif">{label}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={min}
                  max={max}
                  className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {fieldType === 'toggle' && (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md p-3 border border-darcare-gold/20 bg-darcare-navy/50">
              <div className="space-y-0.5">
                <FormLabel className="text-darcare-gold">{label}</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-darcare-gold"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {fieldType === 'slider' && (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-darcare-gold font-serif">
                {label}: {field.value} kg
              </FormLabel>
              <FormControl>
                <Slider
                  min={min}
                  max={max}
                  step={step}
                  value={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                  className="py-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default OptionField;
