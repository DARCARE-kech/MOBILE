import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage, ChatThread } from "@/types/chat";
import * as openaiClient from "@/utils/openaiClient";
import { extractAssistantOutput, getThreadMessages, getUserThreads, getOrCreateUserThread, updateThreadTitle } from "@/utils/chatUtils";

/**
 * Hook principal pour gérer la logique du chatbot
 */
export const useChatbot = (initialThreadId?: string) => {
  console.log("useChatbot initialized with initialThreadId:", initialThreadId);
  const { user } = useAuth();
  console.log("Current user:", user);
  
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(initialThreadId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  /**
   * Charge les threads de l'utilisateur
   */
  const loadThreads = useCallback(async () => {
    console.log("loadThreads called, user?.id =", user?.id);
    if (!user?.id) {
      console.log("No user.id available, cannot load threads");
      return;
    }
    
    try {
      const userThreads = await getUserThreads(user.id);
      console.log("Loaded user threads:", userThreads);
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
    console.log("initializeThread called with threadIdToUse =", threadIdToUse);
    console.log("Current user?.id =", user?.id);
    
    if (!user?.id) {
      console.log("No user.id available, cannot initialize thread");
      return;
    }

    try {
      setIsLoading(true);
      let thread;

      if (threadIdToUse) {
        console.log(`Looking for existing thread with ID ${threadIdToUse}`);
        // Récupérer un thread existant
        const { data, error } = await supabase
          .from("chat_threads")
          .select("*")
          .eq("thread_id", threadIdToUse)
          .single();

        if (error || !data) {
          console.error("Error finding thread:", error);
          throw new Error("Thread not found");
        }
        console.log("Found existing thread:", data);
        thread = data;
      } else {
        console.log("No threadId provided, getting or creating thread");
        // Obtenir ou créer un nouveau thread
        thread = await getOrCreateUserThread(user.id);
        console.log("Got or created thread:", thread);
      }

      setCurrentThread(thread);
      setCurrentThreadId(thread.thread_id);
      console.log("Current thread set to:", thread);

      // Charger les messages pour ce thread
      console.log(`Loading messages for thread ${thread.thread_id}`);
      const threadMessages = await getThreadMessages(thread.thread_id);
      console.log("Loaded messages:", threadMessages);
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
    console.log(`sendMessage called with content: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);
    console.log("Current user?.id =", user?.id);
    console.log("Current threadId =", currentThreadId);
    
    if (!user?.id) {
      console.error("No user ID available");
      return;
    }
    
    if (!currentThreadId) {
      console.error("No currentThreadId available");
      return;
    }
    
    if (!content.trim()) {
      console.error("Content is empty");
      return;
    }

    try {
      setIsLoading(true);

      // Étape 1: Enregistrer le message de l'utilisateur dans Supabase
      console.log("Saving user message to Supabase");
      const userMessageResult = await supabase.from("chat_messages").insert({
        thread_id: currentThreadId,
        content: content.trim(),
        sender: "user"
      });
      
      if (userMessageResult.error) {
        console.error("Error saving user message to Supabase:", userMessageResult.error);
        throw userMessageResult.error;
      }
      
      console.log("User message saved to Supabase");
      
      // Ajouter immédiatement le message utilisateur à l'état pour affichage instantané
      const optimisticUserMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        thread_id: currentThreadId,
        content: content.trim(),
        sender: "user",
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, optimisticUserMessage]);

      // Étape 2: Ajouter le message utilisateur à l'API OpenAI
      console.log(`Adding message to OpenAI thread ${currentThreadId}`);
      const messageResponse = await openaiClient.addMessage(currentThreadId, content);
      
      if (!messageResponse) {
        console.error("messageResponse is undefined or null");
        throw new Error("Failed to send message to OpenAI");
      }
      
      console.log("Message added to OpenAI, response:", messageResponse);

      // Étape 3: Exécuter l'assistant sur le thread
      console.log(`Running assistant on thread ${currentThreadId}`);
      const runResponse = await openaiClient.runAssistant(currentThreadId);
      
      if (!runResponse || !runResponse.id) {
        console.error("runResponse is missing or has no id:", runResponse);
        throw new Error("Failed to run assistant");
      }
      
      console.log("Assistant run started, runId:", runResponse.id);

      // Étape 4: Attendre la réponse de l'assistant
      let runStatus = await openaiClient.checkRunStatus(currentThreadId, runResponse.id);
      console.log("Initial run status:", runStatus.status);
      
      let attempts = 0;
      const maxAttempts = 60; // Maximum attempts (60 seconds)
      
      while (runStatus.status !== "completed" && 
             runStatus.status !== "failed" && 
             runStatus.status !== "cancelled" &&
             attempts < maxAttempts) {
        attempts++;
        // Attendre 1 seconde avant de vérifier à nouveau
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openaiClient.checkRunStatus(currentThreadId, runResponse.id);
        console.log(`Run status check #${attempts}: ${runStatus.status}`);
        
        if (runStatus.status === "failed" || runStatus.status === "cancelled") {
          console.error("Run failed or cancelled:", runStatus);
          throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || "Unknown error"}`);
        }
      }
      
      if (attempts >= maxAttempts) {
        console.error("Run timed out after", maxAttempts, "attempts");
        throw new Error("Assistant response timed out");
      }

      // Étape 5: Récupérer les étapes du run pour obtenir le message de l'assistant
      console.log(`Getting run steps to find assistant message`);
      const runStepsResponse = await openaiClient.getRunOutput(currentThreadId, runResponse.id);
      console.log("Run steps response:", runStepsResponse);
      
      const assistantContent = extractAssistantOutput(runStepsResponse);
      console.log("Extracted assistant content:", assistantContent);

      if (assistantContent) {
        // Étape 6: Enregistrer la réponse de l'assistant dans Supabase
        console.log("Saving assistant message to Supabase");
        const assistantMessageResult = await supabase.from("chat_messages").insert({
          thread_id: currentThreadId,
          content: assistantContent,
          sender: "assistant"
        });
        
        if (assistantMessageResult.error) {
          console.error("Error saving assistant message to Supabase:", assistantMessageResult.error);
          throw assistantMessageResult.error;
        }
        
        console.log("Assistant message saved to Supabase");
      } else {
        console.error("No assistant content found");
        throw new Error("No assistant content found");
      }

      // Étape 7: Mettre à jour la date du thread
      console.log("Updating thread timestamp");
      await supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("thread_id", currentThreadId);
      console.log("Thread timestamp updated");

      // Étape 8: Recharger les messages depuis Supabase
      console.log("Reloading messages from Supabase");
      const updatedMessages = await getThreadMessages(currentThreadId);
      console.log("Messages reloaded:", updatedMessages);
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
    console.log("switchThread called with threadId:", threadId);
    if (!user?.id) {
      console.log("No user.id available, cannot switch thread");
      return;
    }
    
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
    console.log(`updateThreadTitle called with threadId: ${threadId}, title: ${title}`);
    if (!title.trim()) {
      console.log("Title is empty, not updating");
      return false;
    }
    
    try {
      const success = await updateThreadTitle(threadId, title);
      
      if (success) {
        console.log("Title updated successfully, reloading threads");
        await loadThreads();
        
        if (currentThread?.thread_id === threadId) {
          console.log("Updating current thread title in state");
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
    console.log("deleteThread called with threadId:", threadId);
    try {
      console.log("Deleting thread from Supabase");
      const { error } = await supabase
        .from("chat_threads")
        .delete()
        .eq("thread_id", threadId);
        
      if (error) {
        console.error("Error deleting thread:", error);
        throw error;
      }
      
      console.log("Thread deleted, reloading threads");
      await loadThreads();
      
      if (currentThread?.thread_id === threadId) {
        console.log("Deleted the current thread, resetting state");
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
    console.log("useChatbot effect running");
    console.log("user?.id =", user?.id);
    console.log("initialThreadId =", initialThreadId);
    console.log("currentThreadId =", currentThreadId);
    
    if (user?.id && !hasInitialized) {
  console.log("Initializing only once");
  loadThreads();

  if (initialThreadId) {
    initializeThread(initialThreadId);
  } else {
    initializeThread();
  }

  setHasInitialized(true);
}

  return {
    messages,
    threads,
    currentThread,
    isLoading,
    sendMessage,
    loadThreads,
    switchThread: useCallback(async (threadId: string) => {
      console.log("switchThread called with threadId:", threadId);
      if (!user?.id) {
        console.log("No user.id available, cannot switch thread");
        return;
      }
      
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
    }, [user?.id, initializeThread, toast]),
    initializeThread,
    updateThreadTitle: useCallback(async (threadId: string, title: string) => {
      console.log(`updateThreadTitle called with threadId: ${threadId}, title: ${title}`);
      if (!title.trim()) {
        console.log("Title is empty, not updating");
        return false;
      }
      
      try {
        const success = await updateThreadTitle(threadId, title);
        
        if (success) {
          console.log("Title updated successfully, reloading threads");
          await loadThreads();
          
          if (currentThread?.thread_id === threadId) {
            console.log("Updating current thread title in state");
            setCurrentThread(prev => prev ? { ...prev, title } : null);
          }
        }
        
        return success;
      } catch (error) {
        console.error("Error updating thread title:", error);
        return false;
      }
    }, [loadThreads, currentThread]),
    deleteThread: useCallback(async (threadId: string) => {
      console.log("deleteThread called with threadId:", threadId);
      try {
        console.log("Deleting thread from Supabase");
        const { error } = await supabase
          .from("chat_threads")
          .delete()
          .eq("thread_id", threadId);
          
        if (error) {
          console.error("Error deleting thread:", error);
          throw error;
        }
        
        console.log("Thread deleted, reloading threads");
        await loadThreads();
        
        if (currentThread?.thread_id === threadId) {
          console.log("Deleted the current thread, resetting state");
          setCurrentThread(null);
          setCurrentThreadId(null);
          setMessages([]);
        }
        
        return true;
      } catch (error) {
        console.error("Error deleting thread:", error);
        return false;
      }
    }, [loadThreads, currentThread])
  };
};

export default useChatbot;
