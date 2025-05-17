
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
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { formatFieldKey } from '@/utils/formattingUtils';

interface OptionFieldProps {
  form: UseFormReturn<any>;
  fieldType: 'radio' | 'checkbox' | 'number' | 'toggle' | 'slider' | 'select' | 'time';
  name: string;
  label: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  onChange?: (value: string | number | boolean) => void;
}

const OptionField: React.FC<OptionFieldProps> = ({
  form,
  fieldType,
  name,
  label,
  options = [],
  min = 1,
  max = 10,
  step = 1,
  subtitle,
  icon,
  className,
  onChange
}) => {
  const handleChange = (value: string | number | boolean) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn("mb-6", className)}>
      {/* Section title with formatted label */}
      {fieldType !== 'time' && (
        <FormSectionTitle
          title={label}
          icon={icon}
          subtitle={subtitle}
        />
      )}

      {fieldType === 'radio' && options.length > 0 && (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <div className="space-y-3">
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleChange(value);
                  }}
                  className="flex flex-col space-y-2"
                >
                  {options.map((option, index) => (
                    <div key={index} className="border border-darcare-gold/20 rounded-lg p-3 bg-darcare-navy/50 flex items-start gap-3 transition-all hover:border-darcare-gold/40">
                      <RadioGroupItem 
                        value={option} 
                        id={`${name}-${index}`} 
                        className="mt-1 border-darcare-gold/50" 
                      />
                      <Label htmlFor={`${name}-${index}`} className="flex-1 cursor-pointer">
                        <span className="text-darcare-beige font-medium">{formatFieldKey(option)}</span>
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

      {fieldType === 'select' && options.length > 0 && (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <div className="space-y-3">
                <select
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    handleChange(e.target.value);
                  }}
                  className="w-full bg-darcare-navy/50 border border-darcare-gold/20 text-darcare-beige rounded-md p-2 focus:border-darcare-gold/50 focus:outline-none"
                >
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {formatFieldKey(option)}
                    </option>
                  ))}
                </select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {fieldType === 'checkbox' && options.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {options.map((option, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`${name}.${option.replace(/\s+/g, '_').toLowerCase()}`}
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 rounded-md p-2 border border-darcare-gold/20 bg-darcare-navy/50 hover:border-darcare-gold/40 transition-all">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleChange(checked || false);
                      }}
                      className="border-darcare-gold/50 data-[state=checked]:bg-darcare-gold data-[state=checked]:text-darcare-navy mt-0.5"
                    />
                  </FormControl>
                  <Label className="text-darcare-beige cursor-pointer font-medium">
                    {formatFieldKey(option)}
                  </Label>
                </FormItem>
              )}
            />
          ))}
        </div>
      )}

      {fieldType === 'number' && (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min={min}
                  max={max}
                  className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige focus:border-darcare-gold/50 rounded-md"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange(value);
                    handleChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {fieldType === 'time' && (
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-darcare-beige">{label}</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige focus:border-darcare-gold/50 rounded-md"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleChange(e.target.value);
                  }}
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
            <FormItem className="flex flex-row items-center justify-between rounded-md p-4 border border-darcare-gold/20 bg-darcare-navy/50 hover:border-darcare-gold/40 transition-all">
              <div className="space-y-0.5">
                <Label className="text-darcare-beige font-medium">{formatFieldKey(name.split('.').pop() || '')}</Label>
                {subtitle && <p className="text-sm text-darcare-beige/70">{formatFieldKey(subtitle)}</p>}
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    handleChange(checked);
                  }}
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
              <div className="flex justify-between items-center mb-2">
                <span className="text-darcare-beige font-medium">{field.value} kg</span>
              </div>
              <FormControl>
                <Slider
                  min={min}
                  max={max}
                  step={step}
                  value={[field.value]}
                  onValueChange={(values) => {
                    field.onChange(values[0]);
                    handleChange(values[0]);
                  }}
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
