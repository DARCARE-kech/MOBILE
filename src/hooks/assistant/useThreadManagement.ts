
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ThreadResponse } from '@/types/assistant';

export const useThreadManagement = () => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getOrCreateThread();
    }
  }, [user]);

  const getOrCreateThread = async () => {
    try {
      const { data: threadData, error: threadError } = await supabase.functions.invoke<ThreadResponse>('get-user-thread', {
        body: { user_id: user?.id }
      });

      if (threadError) throw threadError;

      if (threadData?.thread_id) {
        setThreadId(threadData.thread_id);
      } else {
        const newThread = await createThread();
        await saveThread(newThread.id);
        setThreadId(newThread.id);
      }
    } catch (error) {
      console.error('Error setting up chat thread:', error);
      toast({
        title: 'Error setting up chat',
        description: 'We couldn\'t connect you to the assistant right now.',
        variant: 'destructive'
      });
    }
  };

  const createThread = async () => {
    const response = await supabase.functions.invoke('create-thread', {
      body: { user_id: user?.id }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  };

  const saveThread = async (threadId: string) => {
    const { error: saveError } = await supabase.functions.invoke('save-user-thread', {
      body: {
        user_id: user?.id,
        thread_id: threadId
      }
    });

    if (saveError) {
      throw saveError;
    }
  };

  return {
    threadId,
    setThreadId,
  };
};
