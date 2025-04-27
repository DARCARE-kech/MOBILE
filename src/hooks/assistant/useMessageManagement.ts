
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AssistantMessage } from '@/types/chat';
import { MessageResponse } from '@/types/assistant';

export const useMessageManagement = (threadId: string | null) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadThreadMessages = async (threadId: string) => {
    try {
      const response = await supabase.functions.invoke('list-messages', {
        body: { thread_id: threadId }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const formattedMessages = response.data.map((msg: any) => ({
        role: msg.role,
        content: msg.content[0]?.text?.value || '',
        id: msg.id,
        timestamp: msg.created_at
      })).reverse();
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading thread messages:', error);
      throw error;
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
          assistant_id: 'asst_Yh87yZ3mNeMJS6W5TeVobQ1S'
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
        description: 'Failed to send your message.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const pollForCompletion = async (threadId: string, runId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await supabase.functions.invoke('check-run', {
          body: {
            thread_id: threadId,
            run_id: runId
          }
        });
        
        if (statusResponse.error) {
          throw new Error(statusResponse.error.message);
        }
        
        const run = statusResponse.data;
        
        if (run.status === 'completed') {
          clearInterval(pollInterval);
          await loadThreadMessages(threadId);
          setIsLoading(false);
        } else if (run.status === 'failed' || run.status === 'cancelled') {
          clearInterval(pollInterval);
          throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
        }
      } catch (error) {
        clearInterval(pollInterval);
        console.error('Error polling run status:', error);
        toast({
          title: 'Error',
          description: 'Failed to get a response from the assistant.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(pollInterval);
      if (isLoading) {
        toast({
          title: 'Taking too long',
          description: 'The assistant is taking longer than expected to respond.',
          variant: 'destructive'
        });
        setIsLoading(false);
      }
    }, 30000);
  };

  return {
    messages,
    sendMessage,
    isLoading,
    loadThreadMessages
  };
};
