
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AdminMessage } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import type { Enums } from '@/integrations/supabase/types';

export const useAdminContact = () => {
  const { toast } = useToast();

  const sendAdminMessage = useMutation({
    mutationFn: async ({ category, message, image_url }: Omit<AdminMessage, 'id' | 'user_id' | 'status' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('admin_messages')
        .insert({
          category,
          message,
          image_url,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Message Sent',
        description: 'Your message has been sent to the admin',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message to admin',
        variant: 'destructive',
      });
    },
  });

  return { sendAdminMessage };
};
