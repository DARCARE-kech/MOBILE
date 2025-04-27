
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AssistantMessage, Thread, ChatThread } from '@/types/chat';

// This is the assistant ID we'll use for the chatbot
const ASSISTANT_ID = 'asst_Yh87yZ3mNeMJS6W5TeVobQ1S';

export const useAssistant = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load or create thread on component mount
  useEffect(() => {
    if (user) {
      const getOrCreateThread = async () => {
        try {
          setIsLoading(true);

          // Use Edge function to check for existing thread instead of direct query
          const { data: threadData, error: threadError } = await supabase.functions.invoke('get-user-thread', {
            body: { user_id: user.id }
          });

          if (threadError) {
            throw threadError;
          }

          if (threadData?.thread_id) {
            // User has an existing thread
            setThreadId(threadData.thread_id);

            // Load thread messages
            const threadMessages = await loadThreadMessages(threadData.thread_id);
            setMessages(threadMessages);
          } else {
            // Create a new thread for the user
            const newThread = await createThread();
            
            // Use Edge function to save thread ID
            const { error: saveError } = await supabase.functions.invoke('save-user-thread', {
              body: {
                user_id: user.id,
                thread_id: newThread.id
              }
            });

            if (saveError) {
              throw saveError;
            }

            setThreadId(newThread.id);
            
            // Add a welcome message
            setMessages([{
              role: 'assistant',
              content: 'Hello! I\'m your DarCare Assistant. How can I help you today?'
            }]);
          }
        } catch (error) {
          console.error('Error setting up chat thread:', error);
          toast({
            title: 'Error setting up chat',
            description: 'We couldn\'t connect you to the assistant right now.',
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      };

      getOrCreateThread();
    }
  }, [user, toast]);

  const createThread = async (): Promise<Thread> => {
    try {
      const response = await supabase.functions.invoke('create-thread', {
        body: { user_id: user?.id }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw error;
    }
  };

  const loadThreadMessages = async (threadId: string): Promise<AssistantMessage[]> => {
    try {
      const response = await supabase.functions.invoke('list-messages', {
        body: { thread_id: threadId }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Transform API response to app's message format
      return response.data.map((msg: any) => ({
        role: msg.role,
        content: msg.content[0]?.text?.value || '',
        id: msg.id,
        timestamp: msg.created_at
      })).reverse(); // Reverse to get chronological order
      
    } catch (error) {
      console.error('Error loading thread messages:', error);
      throw error;
    }
  };

  const sendMessage = async (content: string) => {
    if (!threadId || !content.trim()) return;
    
    // Optimistically add the message to the UI
    const userMessage: AssistantMessage = {
      role: 'user',
      content,
      timestamp: Date.now().toString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Send the message to the assistant
      await supabase.functions.invoke('add-message', {
        body: {
          thread_id: threadId,
          content,
          role: 'user'
        }
      });
      
      // Run the assistant on the thread
      const runResponse = await supabase.functions.invoke('run-assistant', {
        body: {
          thread_id: threadId,
          assistant_id: ASSISTANT_ID
        }
      });
      
      if (runResponse.error) {
        throw new Error(runResponse.error.message);
      }
      
      // Poll for completion of the run
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await supabase.functions.invoke('check-run', {
            body: {
              thread_id: threadId,
              run_id: runResponse.data.id
            }
          });
          
          if (statusResponse.error) {
            throw new Error(statusResponse.error.message);
          }
          
          const run = statusResponse.data;
          
          if (run.status === 'completed') {
            clearInterval(pollInterval);
            
            // Get the latest messages from the thread
            const latestMessages = await loadThreadMessages(threadId);
            setMessages(latestMessages);
            setIsLoading(false);
          } else if (run.status === 'failed' || run.status === 'cancelled') {
            clearInterval(pollInterval);
            throw new Error(`Run ${run.status}: ${run.last_error?.message || 'Unknown error'}`);
          }
          // For 'queued' and 'in_progress', we continue polling
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
      }, 1000); // Poll every second
      
      // Set a timeout to prevent indefinite polling
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
      }, 30000); // 30-second timeout
      
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

  return {
    messages,
    sendMessage,
    isLoading,
    threadId
  };
};
