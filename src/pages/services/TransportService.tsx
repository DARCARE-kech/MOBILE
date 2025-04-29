
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransportServiceProps {
  serviceData?: any;
}

interface FormValues {
  date: Date;
  time: string;
  note: string;
  [key: string]: any;
}

const TransportService: React.FC<TransportServiceProps> = ({ serviceData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const form = useForm<FormValues>({
    defaultValues: {
      date: new Date(),
      time: '12:00',
      note: '',
    }
  });
  
  const optionalFields = serviceData?.optional_fields || {};
  
  // Dynamically add form fields based on optionalFields structure
  React.useEffect(() => {
    // Reset form with new default values including dynamic fields
    const defaultValues: any = {
      date: new Date(),
      time: '12:00',
      note: '',
    };
    
    // Add dynamic fields based on optional_fields structure
    Object.entries(optionalFields).forEach(([key, value]: [string, any]) => {
      if (Array.isArray(value)) {
        // If it's an array, it's likely a select option
        defaultValues[key] = '';
      } else if (typeof value === 'boolean') {
        // If it's a boolean, it's likely a checkbox or toggle
        defaultValues[key] = false;
      }
    });
    
    form.reset(defaultValues);
  }, [optionalFields, form]);
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const isoDateTime = new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        parseInt(data.time.split(':')[0]),
        parseInt(data.time.split(':')[1])
      ).toISOString();
      
      const { error } = await supabase.from('service_requests').insert({
        service_id: serviceData.service_id,
        preferred_time: isoDateTime,
        note: data.note,
        selected_options: data
      });
      
      if (error) throw error;
      
      toast.success(t('services.requestSubmitted'), {
        description: t('services.requestSubmittedDesc')
      });
      
      navigate('/services');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error(t('common.error'), {
        description: t('services.requestErrorDesc')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 pb-24">
      {/* Service Details Card */}
      <Card className="bg-darcare-navy border-darcare-gold/20 p-5 rounded-lg mb-6">
        <h2 className="text-darcare-gold font-serif text-xl mb-2">
          {serviceData?.instructions && (
            <div className="text-darcare-beige text-sm mt-2 mb-4">{serviceData.instructions}</div>
          )}
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dynamic Form Fields based on optional_fields */}
            {Object.entries(optionalFields).map(([key, value]: [string, any]) => {
              // Skip non-form field properties
              if (key === 'instructions' || key === 'price_range' || key === 'default_duration') {
                return null;
              }
              
              // Special handling for transport-specific fields (destinations, trip types)
              if (key === 'destinations' || key === 'trip_types') {
                return (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key === 'destinations' ? 'destination' : 'trip_type'}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-darcare-gold font-serif">
                          {key === 'destinations' ? t('services.destination') : t('services.tripType')}
                        </FormLabel>
                        <div className="space-y-3">
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex flex-col space-y-2"
                          >
                            {value.map((option: string, index: number) => (
                              <div key={index} className="border border-darcare-gold/20 rounded-lg p-3 bg-darcare-navy/50 flex items-start gap-3">
                                <RadioGroupItem 
                                  value={option} 
                                  id={`${key}-${index}`} 
                                  className="mt-1 border-darcare-gold/50" 
                                />
                                <Label htmlFor={`${key}-${index}`} className="flex-1 cursor-pointer">
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
                );
              }
              
              // Render different input types based on the field value type
              else if (Array.isArray(value)) {
                return (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-darcare-gold font-serif">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </FormLabel>
                        <div className="space-y-3">
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex flex-col space-y-2"
                          >
                            {value.map((option: string, index: number) => (
                              <div key={index} className="border border-darcare-gold/20 rounded-lg p-3 bg-darcare-navy/50 flex items-start gap-3">
                                <RadioGroupItem 
                                  value={option} 
                                  id={`${key}-${index}`} 
                                  className="mt-1 border-darcare-gold/50" 
                                />
                                <Label htmlFor={`${key}-${index}`} className="flex-1 cursor-pointer">
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
                );
              } else if (typeof value === 'boolean') {
                // Render checkbox/toggle
                return (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-darcare-gold/50 data-[state=checked]:bg-darcare-gold data-[state=checked]:text-darcare-navy"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-darcare-beige">
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                );
              }
              
              // For passenger count, use a number input
              else if (key === 'passenger_count') {
                return (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-darcare-gold font-serif">
                          {t('services.passengers')}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            max="10"
                            className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
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
            
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-darcare-gold font-serif">
                    {t('services.preferredDate')}
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-darcare-gold" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-darcare-navy border-darcare-gold/20" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                            setSelectedDate(date);
                          }
                        }}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Time Picker */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-darcare-gold font-serif">
                    {t('services.preferredTime')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="time"
                        className="pl-10 bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige"
                        {...field}
                      />
                      <Clock size={16} className="absolute left-3 top-3 text-darcare-gold" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Note Field */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
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
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
            >
              {isSubmitting ? t('common.submitting') : t('services.requestService')}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default TransportService;
