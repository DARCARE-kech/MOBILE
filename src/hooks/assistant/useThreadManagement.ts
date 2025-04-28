
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
      // Tentative de récupération d'un thread existant
      const { data: existingThreads, error: fetchError } = await supabase
        .from('chat_threads')
        .select('thread_id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Erreur de récupération du thread:", fetchError);
        throw fetchError;
      }

      if (existingThreads?.thread_id) {
        setThreadId(existingThreads.thread_id);
        return;
      }

      // Si aucun thread n'existe, en créer un nouveau
      const newThread = await createThread();
      await saveThread(newThread.id);
      setThreadId(newThread.id);
    } catch (error) {
      console.error('Erreur lors de la configuration du thread de chat:', error);
      toast({
        title: 'Erreur de connexion',
        description: 'Nous n\'avons pas pu vous connecter à l\'assistant pour le moment.',
        variant: 'destructive'
      });
    }
  };

  const createThread = async () => {
    const response = await supabase.functions.invoke('create-thread', {
      body: { 
        user_id: user?.id,
        assistant_id: 'asst_lVVTwlHHW2pHH0gPKYcLmXXz'
      }
    });
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    return response.data;
  };

  const saveThread = async (threadId: string) => {
    const { error: saveError } = await supabase
      .from('chat_threads')
      .insert([
        { user_id: user?.id, thread_id: threadId }
      ]);

    if (saveError) {
      throw saveError;
    }
  };

  return {
    threadId,
    setThreadId,
  };
};
