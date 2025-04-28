
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
      // Try to retrieve an existing thread
      const { data: existingThreads, error: fetchError } = await supabase
        .from('chat_threads')
        .select('thread_id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error retrieving thread:", fetchError);
        throw fetchError;
      }

      if (existingThreads?.thread_id) {
        setThreadId(existingThreads.thread_id);
        return;
      }

      // If no thread exists, create a new one
      const newThread = await createThread();
      await saveUserThread(user?.id, newThread.id, 'New Conversation');
      setThreadId(newThread.id);
    } catch (error) {
      console.error('Error setting up chat thread:', error);
      toast({
        title: 'Connection error',
        description: 'We couldn\'t connect you to the assistant at this time.',
        variant: 'destructive'
      });
    }
  };

  const createThread = async () => {
    const response = await supabase.functions.invoke('create-thread', {
      body: { 
        user_id: user?.id,
        assistant_id: 'asst_5KqcDXQaMYqTDLKQxbQmrSBy'
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  };

  const saveUserThread = async (userId: string | undefined, threadId: string, title: string = 'New Conversation') => {
    if (!userId) return;
    
    const response = await supabase.functions.invoke('save-user-thread', {
      body: { user_id: userId, thread_id: threadId, title }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  };

  return {
    threadId,
    setThreadId,
    createThread,
    saveUserThread
  };
};
