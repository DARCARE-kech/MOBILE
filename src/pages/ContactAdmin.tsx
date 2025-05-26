
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from '@/components/MainHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAdminContact } from '@/hooks/useAdminContact';
import BottomNavigation from '@/components/BottomNavigation';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { Enums } from '@/integrations/supabase/types';

interface FormData {
  category: Enums<'admin_message_category'>;
  message: string;
}

interface LocationState {
  preselectedCategory?: Enums<'admin_message_category'>;
  subject?: string;
}

const ContactAdmin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormData>({
    defaultValues: {
      category: state?.preselectedCategory || 'issue',
    }
  });
  
  const { sendAdminMessage } = useAdminContact();
  const selectedCategory = watch('category');

  useEffect(() => {
    // Set preselected category from navigation state if available
    if (state?.preselectedCategory) {
      setValue('category', state.preselectedCategory);
    }
    
    // If we have a subject, prefill the message with it
    if (state?.subject) {
      setValue('message', `Regarding: ${state.subject}\n\n`);
    }
  }, [state, setValue]);

  const onSubmit = async (data: FormData) => {
    await sendAdminMessage.mutateAsync(data);
    navigate('/chatbot');
  };

  const handleCategoryChange = (value: Enums<'admin_message_category'>) => {
    setValue('category', value);
  };

  return (
    <div className="min-h-screen bg-darcare-navy">
      <MainHeader title="Contact Admin" onBack={() => navigate('/chatbot')} />
      
      <div className="p-4 pt-20 pb-24">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Select 
              defaultValue="issue" 
              onValueChange={handleCategoryChange}
              value={selectedCategory}
            >
              <SelectTrigger className="bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="issue">Issue</SelectItem>
                <SelectItem value="report">Report</SelectItem>
                <SelectItem value="external_request">External Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Textarea
              {...register('message', { required: 'Message is required' })}
              placeholder="Your message"
              className="min-h-[150px] bg-darcare-navy/50 border-darcare-gold/20 text-darcare-beige placeholder:text-darcare-beige/50"
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-darcare-gold text-darcare-navy hover:bg-darcare-gold/90"
          >
            Send Message
          </Button>
        </form>
      </div>
      
      <BottomNavigation activeTab="home" />
    </div>
  );
};

export default ContactAdmin;
