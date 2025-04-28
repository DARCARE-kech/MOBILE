
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AssistantMessage } from '@/types/chat';

export const useMessageManagement = (threadId: string | null) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load messages when threadId changes
  useEffect(() => {
    if (threadId) {
      loadThreadMessages(threadId).catch(error => {
        console.error('Error loading messages:', error);
      });
    }
  }, [threadId]);

  const loadThreadMessages = async (threadId: string) => {
    try {
      setIsLoading(true);
      const response = await supabase.functions.invoke('list-messages', {
        body: { 
          thread_id: threadId,
          assistant_id: 'asst_lVVTwlHHW2pHH0gPKYcLmXXz'
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const formattedMessages = (response.data || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content[0]?.text?.value || '',
        id: msg.id,
        timestamp: msg.created_at
      })).reverse();
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading thread messages:', error);
      toast({
        title: 'Error',
        description: 'Could not load previous messages.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!threadId || !content.trim()) return;
    
    const userMessage: AssistantMessage = {
      role: 'user',
      content,
      id: `temp-${Date.now()}`,
      timestamp: Date.now().toString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      await supabase.functions.invoke('add-message', {
        body: {
          thread_id: threadId,
          content,
          role: 'user'
        }
      });
      
      const runResponse = await supabase.functions.invoke('run-assistant', {
        body: {
          thread_id: threadId,
          assistant_id: 'asst_lVVTwlHHW2pHH0gPKYcLmXXz'
        }
      });
      
      if (runResponse.error) {
        throw new Error(runResponse.error.message);
      }
      
      await pollForCompletion(threadId, runResponse.data.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Could not send your message.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const pollForCompletion = async (threadId: string, runId: string) => {
    let intervalId: number | undefined;
    let timeoutId: number | undefined;

    const poll = async () => {
      try {
        const statusResponse = await supabase.functions.invoke('check-run', {
          body: {
            thread_id: threadId,
            run_id: runId,
            assistant_id: 'asst_lVVTwlHHW2pHH0gPKYcLmXXz'
          }
        });
        
        if (statusResponse.error) {
          throw new Error(statusResponse.error.message);
        }
        
        const run = statusResponse.data;
        
        if (run.status === 'completed') {
          clearInterval(intervalId);
          if (timeoutId) clearTimeout(timeoutId);
          await loadThreadMessages(threadId);
          setIsLoading(false);
        } else if (run.status === 'failed' || run.status === 'cancelled') {
          clearInterval(intervalId);
          if (timeoutId) clearTimeout(timeoutId);
          throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
        }
      } catch (error) {
        clearInterval(intervalId);
        if (timeoutId) clearTimeout(timeoutId);
        console.error('Error checking status:', error);
        toast({
          title: 'Error',
          description: 'Could not get a response from the assistant.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    };

    intervalId = setInterval(poll, 1000) as unknown as number;

    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (isLoading) {
        toast({
          title: 'Timeout',
          description: 'The assistant is taking longer than expected to respond.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    }, 30000) as unknown as number;
  };

  return {
    messages,
    sendMessage,
    isLoading,
    loadThreadMessages
  };
};
