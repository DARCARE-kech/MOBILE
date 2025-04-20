
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { ChatSession, ChatMessage } from '@/types/chat';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useChat = (sessionId?: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);

  const { data: sessions, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['chat-sessions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat sessions:', error);
        throw error;
      }
      return data as ChatSession[];
    },
    enabled: !!user?.id,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['chat-messages', currentSessionId],
    queryFn: async () => {
      if (!currentSessionId) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
      }
      return data as ChatMessage[];
    },
    enabled: !!currentSessionId,
  });

  const createSession = useMutation({
    mutationFn: async (title: string) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          title,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as ChatSession;
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions', user?.id] });
      setCurrentSessionId(newSession.id);
    },
    onError: (error) => {
      console.error('Error creating chat session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new chat session',
        variant: 'destructive',
      });
    },
  });

  const sendMessage = useMutation({
    mutationFn: async ({ content, sender }: { content: string; sender: 'user' | 'bot' | 'admin' }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      // If no current session, create one
      let sessionId = currentSessionId;
      if (!sessionId) {
        const session = await createSession.mutateAsync('New Conversation');
        sessionId = session.id;
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          content,
          sender,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data as ChatMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', currentSessionId] });
      // Also update the sessions list since timestamps may have changed
      queryClient.invalidateQueries({ queryKey: ['chat-sessions', user?.id] });
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

  const deleteSession = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-sessions', user?.id] });
      if (currentSessionId) {
        setCurrentSessionId(null);
      }
    },
    onError: (error) => {
      console.error('Error deleting chat session:', error);
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
      queryClient.invalidateQueries({ queryKey: ['chat-sessions', user?.id] });
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
    sessions,
    messages,
    currentSessionId,
    setCurrentSessionId,
    sendMessage,
    createSession,
    deleteSession,
    updateSessionTitle,
    isLoadingSessions,
    isLoadingMessages
  };
};
