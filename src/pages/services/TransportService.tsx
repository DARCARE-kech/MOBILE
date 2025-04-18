
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  CalendarClock, 
  Send, 
  PenLine,
  MapPin,
  Users,
  Clock,
  CarFront
} from 'lucide-react';
import { format } from 'date-fns';

import ServiceHeader from '@/components/services/ServiceHeader';
import ServiceBanner from '@/components/services/ServiceBanner';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import IconButton from '@/components/services/IconButton';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';

const TransportService = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  
  const form = useForm({
    defaultValues: {
      pickup: '',
      destination: '',
      notes: '',
      date: new Date(),
    },
  });
  
  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });
  
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  const onSubmit = async (values: any) => {
    if (!selectedTime) {
      toast({
        title: "Time Required",
        description: "Please select a preferred time for your transport service",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('service_requests')
        .insert({
          service_id: id,
          note: JSON.stringify({
            ...values,
            time: selectedTime,
            passengers: passengerCount
          }),
          preferred_time: new Date(
            values.date.getFullYear(),
            values.date.getMonth(),
            values.date.getDate(),
            parseInt(selectedTime.split(':')[0]),
            0, 0
          ).toISOString(),
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your transport request has been submitted",
      });
      
      navigate('/services');
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <ServiceHeader title="Loading..." />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (!service) {
    navigate('/services');
    return null;
  }
  
  return (
    <div className="bg-darcare-navy min-h-screen">
      <ServiceHeader title="Transport Service" showWeather />
      
      <ServiceBanner 
        imageUrl={service.image_url || '/placeholder.svg'} 
        altText="Transport Service" 
      />
      
      <div className="p-4">
        <h2 className="text-darcare-gold font-serif text-2xl mt-2 mb-1">{service.name}</h2>
        <p className="text-darcare-beige mb-4">{service.description}</p>
        
        <Card className="bg-darcare-navy border-darcare-gold/20 p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <CarFront className="text-darcare-gold w-5 h-5" />
            <h3 className="text-darcare-white font-medium">Service Details</h3>
          </div>
          
          <ul className="text-darcare-beige space-y-2 ml-2">
            <li>• Luxury vehicles with professional drivers</li>
            <li>• 24/7 availability with prior booking</li>
            <li>• Airport transfers and local transportation</li>
            <li>• Child seats available upon request</li>
          </ul>
        </Card>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Pickup Location" icon={<MapPin className="w-5 h-5" />} />
              
              <FormField
                control={form.control}
                name="pickup"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter pickup location"
                        className="bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
            
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Destination" icon={<MapPin className="w-5 h-5" />} />
              
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter destination"
                        className="bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
            
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Number of Passengers" icon={<Users className="w-5 h-5" />} />
              
              <div className="flex items-center justify-between bg-darcare-navy/60 border border-darcare-gold/20 rounded-md p-2">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-darcare-navy border border-darcare-gold/30 text-darcare-gold"
                  onClick={() => setPassengerCount(Math.max(1, passengerCount - 1))}
                >
                  -
                </button>
                
                <div className="text-darcare-beige text-lg font-medium">
                  {passengerCount} {passengerCount === 1 ? 'Passenger' : 'Passengers'}
                </div>
                
                <button
                  type="button"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-darcare-navy border border-darcare-gold/30 text-darcare-gold"
                  onClick={() => setPassengerCount(Math.min(10, passengerCount + 1))}
                >
                  +
                </button>
              </div>
            </Card>
            
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Date & Time" icon={<CalendarClock className="w-5 h-5" />} />
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-between bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige",
                            )}
                          >
                            <div className="flex items-center">
                              <CalendarClock className="mr-2 h-4 w-4 text-darcare-gold" />
                              {format(field.value, "PPP")}
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-darcare-navy border-darcare-gold/20" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setIsDatePickerOpen(false);
                              }
                            }}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                
                <Collapsible
                  open={isTimeOpen}
                  onOpenChange={setIsTimeOpen}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige"
                    >
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-darcare-gold" />
                        {selectedTime ? selectedTime : "Select Time"}
                      </div>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <div
                          key={time}
                          className={`
                            p-2 rounded-md text-center cursor-pointer transition-all
                            ${selectedTime === time 
                              ? 'bg-darcare-gold/20 border border-darcare-gold/40 text-darcare-gold' 
                              : 'bg-darcare-navy/60 text-darcare-beige border border-darcare-gold/10'}
                          `}
                          onClick={() => {
                            setSelectedTime(time);
                            setIsTimeOpen(false);
                          }}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </Card>
            
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Additional Notes" icon={<PenLine className="w-5 h-5" />} />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requirements or instructions..."
                        className="resize-none bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
            
            <div className="flex justify-center pt-4 pb-20">
              <IconButton
                type="submit"
                icon={<Send className="w-5 h-5" />}
                variant="primary"
                size="lg"
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TransportService;
