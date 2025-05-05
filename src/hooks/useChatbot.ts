
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage, ChatThread } from "@/types/chat";

export const useChatbot = (initialThreadId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(initialThreadId || null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // Fonction pour extraire le contenu d'un message de l'API OpenAI
  const extractMessageContent = (message: any): string => {
    if (!message || !message.content || !message.content.length) return '';
    
    // L'API OpenAI renvoie le contenu dans un format particulier
    const textContent = message.content.find((item: any) => item.type === 'text');
    return textContent?.text?.value || '';
  };

  // Enregistrer un message dans la base de données
  const saveChatMessage = async (threadId: string, content: string, sender: string) => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          thread_id: threadId,
          user_id: user.id,
          content,
          sender
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error saving message:", error);
      return null;
    }
  };

  // Récupérer les threads de l'utilisateur
  const getUserThreads = async (userId: string): Promise<ChatThread[]> => {
    try {
      const { data, error } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting user threads:", error);
      return [];
    }
  };

  // Obtenir ou créer un thread pour un utilisateur
  const getOrCreateThread = async (userId: string): Promise<ChatThread> => {
    try {
      // D'abord, essayer de trouver le thread le plus récent de l'utilisateur
      const { data: existingThreads } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1);
        
      if (existingThreads && existingThreads.length > 0) {
        return existingThreads[0];
      }
      
      // Si aucun thread n'existe, en créer un nouveau
      const { data: newThreadData } = await supabase.functions.invoke("create-thread", {
        body: { user_id: userId, assistant_id: "asst_Yh87yZ3mNeMJS6W5TeVobQ1S" }
      });
      
      if (!newThreadData?.id) {
        throw new Error("Failed to create thread");
      }
      
      // Enregistrer le nouveau thread dans la base de données
      const { data, error } = await supabase
        .from("chat_threads")
        .insert({
          user_id: userId,
          thread_id: newThreadData.id,
          title: "New Conversation"
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error in getOrCreateThread:", error);
      throw error;
    }
  };

  // Récupérer les messages d'un thread
  const getThreadMessages = async (threadId: string): Promise<ChatMessage[]> => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
        
      if (error) throw error;
      
      // Fix: Map the database results to match the ChatMessage interface
      // Ensure sender is properly typed as "user" | "assistant" | "bot" | "admin"
      return (data || []).map(message => ({
        id: message.id,
        thread_id: message.thread_id,
        content: message.content || "",
        sender: (message.sender as "user" | "assistant" | "bot" | "admin") || "user",
        timestamp: message.created_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error getting thread messages:", error);
      return [];
    }
  };

  // Charger les threads de l'utilisateur
  const loadThreads = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const userThreads = await getUserThreads(user.id);
      setThreads(userThreads);
    } catch (error) {
      console.error("Error loading threads:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation history",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  // Initialiser le thread pour l'utilisateur actuel
  const initializeThread = useCallback(async (existingThreadId?: string) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      let thread;

      if (existingThreadId) {
        // Récupérer un thread existant
        const { data, error } = await supabase
          .from("chat_threads")
          .select("*")
          .eq("thread_id", existingThreadId)
          .single();

        if (error || !data) {
          throw new Error("Thread not found");
        }
        thread = data;
      } else {
        // Obtenir ou créer un nouveau thread
        thread = await getOrCreateThread(user.id);
      }

      setCurrentThread(thread);
      setCurrentThreadId(thread.thread_id);

      // Charger les messages pour ce thread
      const threadMessages = await getThreadMessages(thread.thread_id);
      setMessages(threadMessages);
    } catch (error) {
      console.error("Error initializing thread:", error);
      toast({
        title: "Error",
        description: "Failed to initialize chat",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  // Vérifier l'état d'exécution et obtenir la réponse de l'assistant
  const pollRunStatus = useCallback(async (threadId: string, runId: string) => {
    try {
      const { data: runData } = await supabase.functions.invoke("check-run", {
        body: { thread_id: threadId, run_id: runId }
      });

      if (runData.status === "completed") {
        // Effacer l'intervalle de polling
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }

        // Obtenir les messages du thread
        const { data: messagesData } = await supabase.functions.invoke("list-messages", {
          body: { thread_id: threadId }
        });

        // Trouver le dernier message de l'assistant
        const latestAssistantMessage = messagesData.find((msg: any) => msg.role === "assistant");

        if (latestAssistantMessage) {
          const content = extractMessageContent(latestAssistantMessage);
          
          // Enregistrer le message de l'assistant dans notre base de données
          await saveChatMessage(threadId, content, "assistant");

          // Rafraîchir les messages
          const updatedMessages = await getThreadMessages(threadId);
          setMessages(updatedMessages);
        }

        setIsLoading(false);
        return true;
      } else if (runData.status === "failed" || runData.status === "cancelled") {
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        setIsLoading(false);
        throw new Error(`Run ${runData.status}: ${runData.last_error?.message || "Unknown error"}`);
      }

      return false;
    } catch (error) {
      console.error("Error polling run status:", error);
      setIsLoading(false);
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      toast({
        title: "Error",
        description: "Failed to get assistant response",
        variant: "destructive"
      });
      return true;
    }
  }, [pollingInterval, toast]);

  // Envoyer un message à l'assistant
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !currentThreadId || !content.trim()) return;

    try {
      setIsLoading(true);

      // Enregistrer le message de l'utilisateur dans la base de données
      await saveChatMessage(currentThreadId, content, "user");

      // Rafraîchir les messages pour inclure le message de l'utilisateur
      const updatedMessages = await getThreadMessages(currentThreadId);
      setMessages(updatedMessages);

      // Envoyer le message à OpenAI via la fonction edge
      const { data: messageData } = await supabase.functions.invoke("add-message", {
        body: { 
          thread_id: currentThreadId, 
          content: content 
        }
      });

      if (!messageData || !messageData.id) {
        throw new Error("Failed to send message to OpenAI");
      }

      // Exécuter l'assistant sur le thread
      const { data: runData } = await supabase.functions.invoke("run-assistant", {
        body: { thread_id: currentThreadId }
      });

      if (!runData || !runData.id) {
        throw new Error("Failed to run assistant");
      }

      // Mettre à jour l'horodatage updated_at du thread
      await supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("thread_id", currentThreadId);

      // Configurer le polling pour vérifier l'état d'exécution
      const interval = setInterval(() => {
        pollRunStatus(currentThreadId, runData.id).then(isDone => {
          if (isDone && interval) {
            clearInterval(interval);
            setPollingInterval(null);
          }
        });
      }, 1000);

      setPollingInterval(interval);

    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  }, [user?.id, currentThreadId, pollRunStatus, toast]);

  // Changer de thread
  const switchThread = useCallback(async (threadId: string) => {
    if (!user?.id) return;
    
    try {
      // Récupérer le thread
      const { data, error } = await supabase
        .from("chat_threads")
        .select("*")
        .eq("thread_id", threadId)
        .single();

      if (error || !data) {
        throw new Error("Thread not found");
      }

      setCurrentThread(data);
      setCurrentThreadId(data.thread_id);

      // Charger les messages pour ce thread
      const threadMessages = await getThreadMessages(data.thread_id);
      setMessages(threadMessages);
    } catch (error) {
      console.error("Error switching thread:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive"
      });
    }
  }, [user?.id, toast]);

  // Gérer la mise à jour du titre du thread
  const updateThreadTitle = useCallback(async (id: string, title: string) => {
    if (!title.trim()) return false;
    
    try {
      const { error } = await supabase
        .from("chat_threads")
        .update({ title })
        .eq("thread_id", id);
        
      if (error) throw error;
      
      await loadThreads();
      
      if (currentThread?.thread_id === id) {
        setCurrentThread(prev => prev ? { ...prev, title } : null);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating thread title:", error);
      return false;
    }
  }, [loadThreads, currentThread]);

  // Gérer la suppression d'un thread
  const deleteThread = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from("chat_threads")
        .delete()
        .eq("thread_id", id);
        
      if (error) throw error;
      
      await loadThreads();
      
      if (currentThread?.thread_id === id) {
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
    
    // Nettoyer l'intervalle de polling au démontage
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [user?.id, initialThreadId, loadThreads, initializeThread, pollingInterval, currentThreadId]);

  return {
    messages,
    threads,
    currentThread,
    isLoading,
    sendMessage,
    loadThreads,
    switchThread,
    initializeThread,
    updateThreadTitle,
    deleteThread
  };
};

export default useChatbot;
