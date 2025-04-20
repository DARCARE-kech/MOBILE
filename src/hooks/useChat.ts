
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ChatSession, ChatMessage } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';

export const useChat = (sessionId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);

  const { data: sessions } = useQuery({
    queryKey: ['chat-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as ChatSession[];
    },
  });

  const { data: messages } = useQuery({
    queryKey: ['chat-messages', currentSessionId],
    queryFn: async () => {
      if (!currentSessionId) return [];
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!currentSessionId,
  });

  const createSession = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{ title }])
        .select()
        .single();

      if (error) throw error;
      return data as ChatSession;
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      setCurrentSessionId(newSession.id);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create new chat session',
        variant: 'destructive',
      });
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({ content, sender }: { content: string; sender: 'user' | 'bot' }) => {
      if (!currentSessionId) {
        const session = await createSession.mutateAsync('New Conversation');
        setCurrentSessionId(session.id);
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: currentSessionId,
          content,
          sender,
        }])
        .select()
        .single();

      if (error) throw error;
      return data as ChatMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', currentSessionId] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
      if (currentSessionId) {
        setCurrentSessionId(null);
      }
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete chat session',
        variant: 'destructive',
      });
    },
  });

  const updateSessionTitle = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update chat title',
        variant: 'destructive',
      });
    },
  });

  return {
    sessions,
    messages,
    currentSessionId,
    setCurrentSessionId,
    sendMessage,
    createSession,
    deleteSession,
    updateSessionTitle,
  };
};
