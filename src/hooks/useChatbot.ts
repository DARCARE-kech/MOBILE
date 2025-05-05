
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage, ChatThread } from "@/types/chat";
import * as openaiClient from "@/utils/openaiClient";
import { extractMessageContent, getThreadMessages, getUserThreads, getOrCreateUserThread, updateThreadTitle } from "@/utils/chatUtils";

/**
 * Hook principal pour gérer la logique du chatbot
 */
export const useChatbot = (initialThreadId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(initialThreadId || null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Charge les threads de l'utilisateur
   */
  const loadThreads = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const userThreads = await getUserThreads(user.id);
      setThreads(userThreads);
    } catch (error) {
      console.error("Error loading threads:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des conversations",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  /**
   * Initialise un thread pour l'utilisateur courant
   */
  const initializeThread = useCallback(async (threadIdToUse?: string) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      let thread;

      if (threadIdToUse) {
        // Récupérer un thread existant
        const { data, error } = await supabase
          .from("chat_threads")
          .select("*")
          .eq("thread_id", threadIdToUse)
          .single();

        if (error || !data) {
          throw new Error("Thread not found");
        }
        thread = data;
      } else {
        // Obtenir ou créer un nouveau thread
        thread = await getOrCreateUserThread(user.id);
      }

      setCurrentThread(thread);
      setCurrentThreadId(thread.thread_id);

      // Charger les messages pour ce thread
      const threadMessages = await getThreadMessages(thread.thread_id);
      setMessages(threadMessages);
    } catch (error) {
      console.error("Error initializing thread:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la conversation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  /**
   * Envoie un message à l'assistant et traite la réponse
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !currentThreadId || !content.trim()) return;

    try {
      setIsLoading(true);

      // Étape 1: Ajouter le message utilisateur à l'API OpenAI
      const messageResponse = await openaiClient.addMessage(currentThreadId, content);
      
      if (!messageResponse) {
        throw new Error("Failed to send message to OpenAI");
      }

      // Étape 2: Exécuter l'assistant sur le thread
      const runResponse = await openaiClient.runAssistant(currentThreadId);
      
      if (!runResponse || !runResponse.id) {
        throw new Error("Failed to run assistant");
      }

      // Étape 3: Attendre la réponse de l'assistant
      let runStatus = await openaiClient.checkRunStatus(currentThreadId, runResponse.id);
      
      while (runStatus.status !== "completed" && 
             runStatus.status !== "failed" && 
             runStatus.status !== "cancelled") {
        // Attendre 1 seconde avant de vérifier à nouveau
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openaiClient.checkRunStatus(currentThreadId, runResponse.id);
        
        if (runStatus.status === "failed" || runStatus.status === "cancelled") {
          throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || "Unknown error"}`);
        }
      }

      // Étape 4: Récupérer les messages du thread
      const threadMessagesResponse = await openaiClient.getThreadMessages(currentThreadId);
      
      if (!threadMessagesResponse || !threadMessagesResponse.data) {
        throw new Error("Failed to retrieve messages");
      }

      // Étape 5: Extraire et traiter les messages de l'API
      const userMessage = threadMessagesResponse.data.find(
        (msg: any) => msg.role === "user" && 
        msg.created_at === messageResponse.created_at
      );
      
      const assistantMessage = threadMessagesResponse.data.find(
        (msg: any) => msg.role === "assistant" && 
        msg.run_id === runResponse.id
      );

      // Étape 6: Enregistrer les messages dans Supabase
      if (userMessage) {
        const userContent = extractMessageContent(userMessage);
        await supabase.from("chat_messages").insert({
          thread_id: currentThreadId,
          content: userContent,
          sender: "user"
        });
      }

      if (assistantMessage) {
        const assistantContent = extractMessageContent(assistantMessage);
        await supabase.from("chat_messages").insert({
          thread_id: currentThreadId,
          content: assistantContent,
          sender: "assistant"
        });
      }

      // Étape 7: Mettre à jour la date du thread
      await supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("thread_id", currentThreadId);

      // Étape 8: Recharger les messages depuis Supabase
      const updatedMessages = await getThreadMessages(currentThreadId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentThreadId, user?.id, toast]);

  /**
   * Change de thread
   */
  const switchThread = useCallback(async (threadId: string) => {
    if (!user?.id) return;
    
    try {
      await initializeThread(threadId);
    } catch (error) {
      console.error("Error switching thread:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger cette conversation",
        variant: "destructive"
      });
    }
  }, [user?.id, initializeThread, toast]);

  /**
   * Met à jour le titre d'un thread
   */
  const updateThreadTitleHandler = useCallback(async (threadId: string, title: string) => {
    if (!title.trim()) return false;
    
    try {
      const success = await updateThreadTitle(threadId, title);
      
      if (success) {
        await loadThreads();
        
        if (currentThread?.thread_id === threadId) {
          setCurrentThread(prev => prev ? { ...prev, title } : null);
        }
      }
      
      return success;
    } catch (error) {
      console.error("Error updating thread title:", error);
      return false;
    }
  }, [loadThreads, currentThread]);

  /**
   * Supprime un thread
   */
  const deleteThread = useCallback(async (threadId: string) => {
    try {
      const { error } = await supabase
        .from("chat_threads")
        .delete()
        .eq("thread_id", threadId);
        
      if (error) throw error;
      
      await loadThreads();
      
      if (currentThread?.thread_id === threadId) {
        setCurrentThread(null);
        setCurrentThreadId(null);
        setMessages([]);
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting thread:", error);
      return false;
    }
  }, [loadThreads, currentThread]);

  // Initialiser au montage du composant
  useEffect(() => {
    if (user?.id) {
      loadThreads();
      
      if (initialThreadId) {
        initializeThread(initialThreadId);
      } else if (!currentThreadId) {
        initializeThread();
      }
    }
  }, [user?.id, initialThreadId, loadThreads, initializeThread, currentThreadId]);

  return {
    messages,
    threads,
    currentThread,
    isLoading,
    sendMessage,
    loadThreads,
    switchThread,
    initializeThread,
    updateThreadTitle: updateThreadTitleHandler,
    deleteThread
  };
};

export default useChatbot;
