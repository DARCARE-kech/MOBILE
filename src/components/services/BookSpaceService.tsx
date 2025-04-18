
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CalendarClock, PenLine, Send } from 'lucide-react';
import ServiceHeader from '@/components/services/ServiceHeader';
import IconButton from '@/components/services/IconButton';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { TimeSelector } from '../space-booking/TimeSelector';
import { PeopleCounter } from '../space-booking/PeopleCounter';
import { useSpaceBooking } from '@/hooks/useSpaceBooking';
import FormSectionTitle from './FormSectionTitle';

const BookSpaceService = () => {
  const navigate = useNavigate();
  const { id: spaceId } = useParams();
  
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  
  const {
    form,
    isSubmitting,
    selectedTime,
    setSelectedTime,
    peopleCount,
    setPeopleCount,
    handleSubmit
  } = useSpaceBooking();
  
  const { data: spaces } = useQuery({
    queryKey: ['spaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spaces')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const selectedSpace = spaces?.find(space => space.id === spaceId) || spaces?.[0];
  
  if (!selectedSpace) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <ServiceHeader title="Book a Space" />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  const onSubmit = async (values: any) => {
    const success = await handleSubmit(values, selectedSpace.id);
    if (success) {
      navigate('/services');
    }
  };
  
  return (
    <div className="bg-darcare-navy min-h-screen pb-20">
      <ServiceHeader title={selectedSpace.name} />
      
      <div className="p-4 space-y-4">
        <Card className="bg-darcare-navy border-darcare-gold/20 overflow-hidden">
          <AspectRatio ratio={16/9}>
            <img 
              src={selectedSpace.image_url || '/placeholder.svg'}
              alt={selectedSpace.name}
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          
          <div className="p-4">
            <h2 className="text-darcare-gold font-serif text-xl mb-2">
              {selectedSpace.name}
            </h2>
            <p className="text-darcare-beige">
              {selectedSpace.description}
            </p>
          </div>
        </Card>

        {selectedSpace.rules && (
          <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
            <FormSectionTitle title="Rules & Guidelines" icon={<Info className="w-5 h-5" />} />
            <p className="text-darcare-beige whitespace-pre-line">
              {selectedSpace.rules}
            </p>
          </Card>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            className="p-3"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                
                <TimeSelector
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                  isOpen={isTimeOpen}
                  onOpenChange={setIsTimeOpen}
                />
              </div>
            </Card>
            
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <PeopleCounter
                count={peopleCount}
                maxCapacity={selectedSpace.capacity}
                onIncrement={() => setPeopleCount(Math.min(selectedSpace.capacity || 10, peopleCount + 1))}
                onDecrement={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              />
            </Card>
            
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Special Requests" icon={<PenLine className="w-5 h-5" />} />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requirements or arrangements..."
                        className="resize-none bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
            
            <div className="fixed bottom-4 right-4 z-10">
              <IconButton
                type="submit"
                icon={<Send className="w-5 h-5" />}
                variant="primary"
                size="lg"
                className={cn(
                  "shadow-lg",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
                disabled={isSubmitting}
              />
              {isSubmitting && (
                <div className="absolute -left-12 top-1/2 -translate-y-1/2">
                  <div className="animate-spin w-5 h-5 border-2 border-darcare-gold border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookSpaceService;
