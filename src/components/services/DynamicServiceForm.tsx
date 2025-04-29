
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Clock, Wallet } from 'lucide-react';
import { 
  LuxuryCard, 
  LuxuryCardContent, 
  LuxuryCardHeader, 
  LuxuryCardTitle,
  LuxuryCardDescription 
} from '@/components/ui/luxury-card';
import ServiceBanner from '@/components/services/ServiceBanner';

// Define interfaces for the component props and form data
interface FormData {
  preferredDate: string;
  preferredTime: string;
  note: string;
  selectedCategory?: string;
  selectedOption?: string;
  [key: string]: any; // For additional dynamic fields
}

interface ServiceDetail {
  id?: string;
  service_id?: string;
  category?: string;
  instructions?: string | null;
  optional_fields?: Record<string, any> | null;
  price_range?: string | null;
  default_duration?: string | null;
}

interface DynamicServiceFormProps {
  serviceId: string;
  serviceType: string;
  serviceName?: string;
  serviceImageUrl?: string | null;
  serviceDetails?: ServiceDetail;
  optionalFields: Record<string, any>;
  onSubmitSuccess?: (formData: FormData) => void;
}

const DynamicServiceForm: React.FC<DynamicServiceFormProps> = ({
  serviceId,
  serviceType,
  serviceName,
  serviceImageUrl,
  serviceDetails,
  optionalFields,
  onSubmitSuccess
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      preferredDate: '',
      preferredTime: '',
      note: '',
      ...generateDefaultValues(optionalFields)
    }
  });
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Process form data
      console.log('Form data:', data);
      
      // Call the callback function if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(data);
      } else {
        navigate('/services/requests/success');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 pb-24">
      {/* Service Banner (if image is available) */}
      {serviceImageUrl && (
        <ServiceBanner 
          imageUrl={serviceImageUrl} 
          altText={serviceName || serviceType} 
          withGradient={true} 
        />
      )}
      
      {/* Service Details Card */}
      {serviceDetails && (
        <LuxuryCard className="mb-6 -mt-4 relative z-10">
          <LuxuryCardHeader>
            <LuxuryCardTitle className="text-darcare-gold">
              {serviceName || t(`services.${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}`)}
            </LuxuryCardTitle>
            
            {/* Display service details like price and duration */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-darcare-beige/80">
              {serviceDetails.default_duration && (
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-darcare-gold" />
                  <span>{serviceDetails.default_duration}</span>
                </div>
              )}
              {serviceDetails.price_range && (
                <div className="flex items-center gap-1.5">
                  <Wallet size={16} className="text-darcare-gold" />
                  <span>{serviceDetails.price_range}</span>
                </div>
              )}
            </div>
          </LuxuryCardHeader>
          
          <LuxuryCardContent>
            {/* Service Instructions */}
            {serviceDetails.instructions && (
              <div className="mb-4 text-darcare-beige/90 text-sm">
                {serviceDetails.instructions}
              </div>
            )}
          </LuxuryCardContent>
        </LuxuryCard>
      )}
      
      {/* Form Container */}
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <h2 className="text-darcare-gold font-serif text-xl mb-4">
          {t(`services.request${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}`)}
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            </div>
            
            {/* Dynamically generated form fields based on optionalFields */}
            {renderDynamicFields(form, optionalFields)}
            
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
            
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
                className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
              >
                {isSubmitting ? t('common.submitting') : t('services.requestService')}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

// Helper function to generate default values based on optional fields
function generateDefaultValues(optionalFields: Record<string, any>): Record<string, any> {
  const defaults: Record<string, any> = {};
  
  if (!optionalFields) return defaults;
  
  // Handle options (single selection fields)
  if (optionalFields.options) {
    defaults.selectedOption = '';
  }
  
  // Handle categories (single selection fields)
  if (optionalFields.categories) {
    defaults.selectedCategory = '';
  }
  
  // Handle checkboxes (multiple selection)
  if (optionalFields.checkOptions) {
    const checkDefaults: Record<string, boolean> = {};
    optionalFields.checkOptions.forEach((opt: string) => {
      checkDefaults[`check_${opt.replace(/\s+/g, '_').toLowerCase()}`] = false;
    });
    defaults.checkOptions = checkDefaults;
  }
  
  // Handle custom fields
  if (optionalFields.customFields) {
    optionalFields.customFields.forEach((field: any) => {
      if (field.type === 'checkbox') {
        defaults[field.name] = false;
      } else if (field.type === 'radio') {
        defaults[field.name] = '';
      } else {
        defaults[field.name] = '';
      }
    });
  }
  
  return defaults;
}

// Helper function to render dynamic form fields based on optional fields data structure
function renderDynamicFields(form: any, optionalFields: Record<string, any>) {
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
}

export default DynamicServiceForm;
