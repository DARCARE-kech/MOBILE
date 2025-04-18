
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Wrench, 
  CalendarClock, 
  Send, 
  ImageIcon,
  PenLine,
  CirclePlus
} from 'lucide-react';
import { format } from 'date-fns';

import ServiceHeader from '@/components/services/ServiceHeader';
import ServiceBanner from '@/components/services/ServiceBanner';
import FormSectionTitle from '@/components/services/FormSectionTitle';
import IconButton from '@/components/services/IconButton';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';

const MaintenanceService = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const form = useForm({
    defaultValues: {
      issueType: 'plumbing',
      description: '',
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
  
  const issueTypes = [
    { id: 'plumbing', label: 'Plumbing' },
    { id: 'electrical', label: 'Electrical' },
    { id: 'appliance', label: 'Appliance' },
    { id: 'furniture', label: 'Furniture' },
    { id: 'other', label: 'Other' },
  ];
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // In a real app, you would upload the image to Supabase Storage here
    // For now, just simulate the upload
    setUploadingImage(true);
    setTimeout(() => {
      setUploadingImage(false);
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    }, 1500);
  };
  
  const onSubmit = async (values: any) => {
    if (!selectedTime) {
      toast({
        title: "Time Required",
        description: "Please select a preferred time for your maintenance service",
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
            hasImage: !!imagePreview
          }),
          preferred_time: new Date(
            values.date.getFullYear(),
            values.date.getMonth(),
            values.date.getDate(),
            parseInt(selectedTime.split(':')[0]),
            0, 0
          ).toISOString(),
          image_url: imagePreview,
          status: 'pending'
        });
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your maintenance request has been submitted",
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
      <ServiceHeader title="Maintenance Service" />
      
      <ServiceBanner 
        imageUrl={service.image_url || '/placeholder.svg'} 
        altText="Maintenance Service" 
      />
      
      <div className="p-4">
        <h2 className="text-darcare-gold font-serif text-2xl mt-2 mb-1">{service.name}</h2>
        <p className="text-darcare-beige mb-4">{service.description}</p>
        
        <Card className="bg-darcare-navy border-darcare-gold/20 p-4 mb-6">
          <FormSectionTitle title="How to report a problem" icon={<Wrench className="w-5 h-5" />} />
          
          <ol className="list-decimal list-inside text-darcare-beige space-y-2 ml-2">
            <li>Select the type of issue you're experiencing</li>
            <li>Provide a detailed description of the problem</li>
            <li>Upload images if available to help diagnose the issue</li>
            <li>Select your preferred date and time for the service</li>
          </ol>
        </Card>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Issue Type" />
              
              <FormField
                control={form.control}
                name="issueType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-2"
                      >
                        {issueTypes.map((issue) => (
                          <div key={issue.id} className="flex items-center space-x-2 p-3 rounded-md bg-darcare-navy/60">
                            <RadioGroupItem value={issue.id} id={issue.id} className="text-darcare-gold" />
                            <FormLabel htmlFor={issue.id} className="text-darcare-white font-medium cursor-pointer">
                              {issue.label}
                            </FormLabel>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
            
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Problem Description" icon={<PenLine className="w-5 h-5" />} />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the issue in detail..."
                        className="resize-none bg-darcare-navy/60 border-darcare-gold/20 text-darcare-beige min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </Card>
            
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Upload Image" icon={<ImageIcon className="w-5 h-5" />} />
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-darcare-gold/30 rounded-lg p-6 bg-darcare-navy/60">
                <input 
                  type="file" 
                  id="image-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                
                {imagePreview ? (
                  <div className="relative w-full">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-auto rounded-lg mb-2" 
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-darcare-navy/80 text-white p-1 rounded-full"
                      onClick={() => setImagePreview(null)}
                    >
                      <CirclePlus className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                ) : (
                  <label 
                    htmlFor="image-upload" 
                    className="flex flex-col items-center cursor-pointer"
                  >
                    {uploadingImage ? (
                      <div className="animate-spin w-8 h-8 border-4 border-darcare-gold border-t-transparent rounded-full mb-2"></div>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-darcare-gold mb-2" />
                    )}
                    <span className="text-darcare-beige text-center">
                      Tap to upload an image of the issue
                    </span>
                  </label>
                )}
              </div>
            </Card>
            
            <Card className="bg-darcare-navy border-darcare-gold/20 p-4">
              <FormSectionTitle title="Preferred Date & Time" icon={<CalendarClock className="w-5 h-5" />} />
              
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

export default MaintenanceService;
