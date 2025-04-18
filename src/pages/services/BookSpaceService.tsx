
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  CalendarClock, 
  Users,
  Info,
  Send,
  PenLine,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

import ServiceHeader from '@/components/services/ServiceHeader';
import IconButton from '@/components/services/IconButton';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getAvailableSpaces, type Space } from '@/integrations/supabase/rpc';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const BookSpaceService = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [peopleCount, setPeopleCount] = useState(1);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      date: new Date(),
      notes: '',
    },
  });
  
  const { data: spaces, isLoading } = useQuery({
    queryKey: ['spaces'],
    queryFn: getAvailableSpaces
  });
  
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  
  const onSubmit = async (values: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit a booking",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedSpace) {
      toast({
        title: "No Space Selected",
        description: "Please select a space to book",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedTime) {
      toast({
        title: "Time Required",
        description: "Please select a time slot for your booking",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First get the service_id for "Book Space" service
      const { data: bookSpaceService, error: serviceError } = await supabase
        .from('services')
        .select('id')
        .ilike('name', '%space%')
        .single();
      
      if (serviceError || !bookSpaceService) {
        console.error("Error finding Book Space service:", serviceError);
        throw new Error("Book Space service not found");
      }
      
      // Prepare the preferred time as a Date object
      const preferredTime = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        parseInt(selectedTime.split(':')[0]),
        0, 0
      );
      
      console.log("Submitting space booking with data:", {
        service_id: bookSpaceService.id,
        user_id: user.id,
        note: JSON.stringify({
          space_id: selectedSpace.id,
          space_name: selectedSpace.name,
          time: selectedTime,
          people: peopleCount,
          notes: values.notes
        }),
        preferred_time: preferredTime.toISOString(),
      });
      
      const { data, error } = await supabase
        .from('service_requests')
        .insert({
          service_id: bookSpaceService.id,
          user_id: user.id,
          note: JSON.stringify({
            space_id: selectedSpace.id,
            space_name: selectedSpace.name,
            time: selectedTime,
            people: peopleCount,
            notes: values.notes
          }),
          preferred_time: preferredTime.toISOString(),
          status: 'pending'
        });
        
      if (error) {
        console.error("Error submitting booking:", error);
        throw error;
      }
      
      console.log("Space booking submitted successfully:", data);
      
      toast({
        title: "Success",
        description: `Your booking for ${selectedSpace.name} has been submitted`,
      });
      
      setSheetOpen(false);
      setSelectedSpace(null);
      navigate('/services');
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-darcare-navy min-h-screen">
        <ServiceHeader title="Book a Space" />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-darcare-navy min-h-screen">
      <ServiceHeader title="Book a Space" />
      
      <div className="p-4">
        <h2 className="text-darcare-gold font-serif text-2xl mb-4">Available Spaces</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spaces?.map((space) => (
            <Card 
              key={space.id} 
              className="bg-darcare-navy border border-darcare-gold/20 overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedSpace(space);
                setSheetOpen(true);
              }}
            >
              <AspectRatio ratio={16/9}>
                <img 
                  src={space.image_url || '/placeholder.svg'} 
                  alt={space.name} 
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
              <CardContent className="p-4">
                <h3 className="text-darcare-white text-lg font-semibold mb-2">
                  {space.name}
                </h3>
                <p className="text-darcare-beige text-sm mb-3 line-clamp-2">
                  {space.description}
                </p>
                <div className="flex items-center justify-between">
                  {space.capacity && (
                    <span className="text-darcare-beige/70 text-sm flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Max Capacity: {space.capacity}
                    </span>
                  )}
                  <IconButton
                    icon={<Info className="w-4 h-4" />}
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSpace(space);
                      setSheetOpen(true);
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="bg-darcare-navy border-l border-darcare-gold/20 overflow-y-auto pb-20">
          {selectedSpace && (
            <>
              <SheetHeader>
                <SheetTitle className="text-darcare-gold font-serif">
                  {selectedSpace.name}
                </SheetTitle>
                <SheetDescription className="text-darcare-beige">
                  {selectedSpace.description}
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-4">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={selectedSpace.image_url || '/placeholder.svg'} 
                    alt={selectedSpace.name} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </AspectRatio>
              </div>
              
              {selectedSpace.rules && (
                <Card className="bg-darcare-navy border-darcare-gold/20 p-4 mt-4">
                  <FormSectionTitle title="Rules & Guidelines" icon={<Info className="w-5 h-5" />} />
                  <p className="text-darcare-beige whitespace-pre-line">
                    {selectedSpace.rules}
                  </p>
                </Card>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                    <FormSectionTitle title="Number of People" icon={<Users className="w-5 h-5" />} />
                    
                    <div className="flex items-center justify-between bg-darcare-navy/60 border border-darcare-gold/20 rounded-md p-2">
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-darcare-navy border border-darcare-gold/30 text-darcare-gold"
                        onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                      >
                        -
                      </button>
                      
                      <div className="text-darcare-beige text-lg font-medium">
                        {peopleCount} {peopleCount === 1 ? 'Person' : 'People'}
                      </div>
                      
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-darcare-navy border border-darcare-gold/30 text-darcare-gold"
                        onClick={() => setPeopleCount(
                          Math.min(selectedSpace.capacity || 10, peopleCount + 1)
                        )}
                      >
                        +
                      </button>
                    </div>
                    
                    {selectedSpace.capacity && peopleCount > selectedSpace.capacity && (
                      <p className="text-red-400 text-sm mt-2">
                        This exceeds the maximum capacity of {selectedSpace.capacity} people.
                      </p>
                    )}
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
                  
                  <div className="flex justify-center pt-4">
                    <IconButton
                      type="submit"
                      icon={<Send className="w-5 h-5" />}
                      variant="primary"
                      size="lg"
                      className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
                      disabled={isSubmitting}
                    />
                    {isSubmitting && (
                      <div className="absolute ml-16 flex items-center">
                        <div className="animate-spin w-5 h-5 border-2 border-darcare-gold border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </form>
              </Form>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BookSpaceService;
