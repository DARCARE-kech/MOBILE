
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ChatSession, ChatMessage, ChatThread } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useChat = (threadId?: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(threadId || null);

  // Fetch chat threads (formerly sessions) from the database
  const { data: threads, isLoading: isLoadingThreads } = useQuery({
    queryKey: ['chat-threads', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('chat_threads')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat threads:', error);
        throw error;
      }
      return data as ChatThread[];
    },
    enabled: !!user?.id,
  });

  // We no longer fetch chat messages from a local database
  // Instead, we use the OpenAI API via the assistant hooks
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['thread-messages', currentThreadId],
    queryFn: async () => {
      if (!currentThreadId) return [];
      
      // This now uses the OpenAI API to fetch messages via our custom edge function
      const { data, error } = await supabase.functions.invoke('list-messages', {
        body: { thread_id: currentThreadId }
      });

      if (error) {
        console.error('Error fetching thread messages:', error);
        throw error;
      }
      
      // Transform the response from the API to match our expected format
      const formattedMessages = (data || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content[0]?.text?.value || '',
        id: msg.id,
        timestamp: msg.created_at
      })).reverse();
      
      return formattedMessages;
    },
    enabled: !!currentThreadId,
  });

  const createThread = useMutation({
    mutationFn: async (title: string) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // Create a thread via OpenAI API first
      const { data: threadData, error: threadError } = await supabase.functions.invoke('create-thread', {
        body: {
          user_id: user.id,
          assistant_id: 'asst_5KqcDXQaMYqTDLKQxbQmrSBy'
        }
      });
      
      if (threadError) throw threadError;
      
      // Then save the thread reference in our database
      const { data, error } = await supabase
        .from('chat_threads')
        .insert({
          thread_id: threadData.id,
          title,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as ChatThread;
    },
    onSuccess: (newThread) => {
      queryClient.invalidateQueries({ queryKey: ['chat-threads', user?.id] });
      setCurrentThreadId(newThread.thread_id);
    },
    onError: (error) => {
      console.error('Error creating chat thread:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new chat conversation',
        variant: 'destructive',
      });
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({ content, role = 'user' }: { content: string; role?: 'user' | 'assistant' | 'admin' }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // If no current thread, create one
      let threadId = currentThreadId;
      if (!threadId) {
        const thread = await createThread.mutateAsync('New Conversation');
        threadId = thread.thread_id;
      }

      // Send message to OpenAI API via our edge function
      const { data, error } = await supabase.functions.invoke('add-message', {
        body: {
          thread_id: threadId,
          content,
          role
        }
      });

      if (error) throw error;
      
      // Also update the thread's updated_at timestamp
      await supabase
        .from('chat_threads')
        .update({ updated_at: new Date().toISOString() })
        .eq('thread_id', threadId);
        
      return data;
    },
    onSuccess: () => {
      // Refetch messages after sending a new one
      queryClient.invalidateQueries({ queryKey: ['thread-messages', currentThreadId] });
      // Also update the threads list since timestamps may have changed
      queryClient.invalidateQueries({ queryKey: ['chat-threads', user?.id] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  const deleteThread = useMutation({
    mutationFn: async (threadId: string) => {
      const { error } = await supabase
        .from('chat_threads')
        .delete()
        .eq('thread_id', threadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-threads', user?.id] });
      if (currentThreadId) {
        setCurrentThreadId(null);
      }
    },
    onError: (error) => {
      console.error('Error deleting chat thread:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete chat conversation',
        variant: 'destructive',
      });
    },
  });

  const updateThreadTitle = useMutation({
    mutationFn: async ({ threadId, title }: { threadId: string; title: string }) => {
      const { error } = await supabase
        .from('chat_threads')
        .update({ title })
        .eq('thread_id', threadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-threads', user?.id] });
    },
    onError: (error) => {
      console.error('Error updating chat title:', error);
      toast({
        title: 'Error',
        description: 'Failed to update chat title',
        variant: 'destructive',
      });
    },
  });

  return {
    threads,
    messages,
    currentThreadId,
    setCurrentThreadId,
    sendMessage,
    createThread,
    deleteThread,
    updateThreadTitle,
    isLoadingThreads,
    isLoadingMessages
  };
};
