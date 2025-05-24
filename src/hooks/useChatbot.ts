
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useThreads } from "./chat/useThreads";
import { useMessages } from "./chat/useMessages";
import { supabase } from "@/integrations/supabase/client";

/**
 * Main hook for managing chatbot logic
 */
export const useChatbot = (initialThreadId?: string) => {
  console.log("useChatbot initialized with initialThreadId:", initialThreadId);
  const { user } = useAuth();
  console.log("Current user:", user);
  
  const { toast } = useToast();
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Get threads and messages functionality from separate hooks
  const {
    threads,
    currentThread,
    currentThreadId,
    loadThreads,
    initializeThread,
    updateThreadTitle,
    deleteThread,
    setCurrentThread,
    setCurrentThreadId
  } = useThreads();

  const {
    messages,
    isLoading,
    loadMessages,
    sendMessage: sendMessageToThread,
    setMessages,
    setIsLoading
  } = useMessages();

  /**
   * Initialize a thread and load its messages
   */
  const initializeThreadWithMessages = useCallback(async (threadIdToUse?: string) => {
    console.log("initializeThreadWithMessages called with threadIdToUse =", threadIdToUse);
    
    if (!user?.id) {
      console.log("No user.id available, cannot initialize thread");
      return;
    }

    try {
      // Set loading state
      setIsLoading(true);
      
      // Initialize thread
      const thread = await initializeThread(threadIdToUse);
      
      if (thread) {
        // Load messages for this thread
        const loadedMessages = await loadMessages(thread.thread_id);
        console.log("Loaded messages in initializeThreadWithMessages:", loadedMessages ? loadedMessages.length : 0, "messages");
      }
    } catch (error) {
      console.error("Error initializing thread with messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser la conversation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, initializeThread, loadMessages, toast, setIsLoading]);

  /**
   * Switch to another thread
   */
  const switchThread = useCallback(async (threadId: string) => {
    console.log("switchThread called with threadId:", threadId);
    if (!user?.id) {
      console.log("No user.id available, cannot switch thread");
      return;
    }
    
    try {
      await initializeThreadWithMessages(threadId);
    } catch (error) {
      console.error("Error switching thread:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger cette conversation",
        variant: "destructive"
      });
    }
  }, [user?.id, initializeThreadWithMessages, toast]);

  /**
   * Send a message in the current thread
   */
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !content.trim()) return;

    let threadId = currentThreadId;

    // Create a thread only if the user sends a message
    if (!threadId) {
      const newThreadId = `thread_${crypto.randomUUID()}`;
      const { data, error } = await supabase
        .from("chat_threads")
        .insert({
          user_id: user.id,
          thread_id: newThreadId,
          title: "New conversation",
        })
        .select();

      if (error || !data?.[0]?.thread_id) {
        console.error("Thread creation failed:", error, data);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer une nouvelle conversation.",
          variant: "destructive"
        });
        return;
      }

      const inserted = data[0];
      threadId = inserted.thread_id;
      setCurrentThread(inserted);
      setCurrentThreadId(threadId);
    }

    try {
      await sendMessageToThread(content, threadId);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    }
  }, [currentThreadId, user?.id, sendMessageToThread, setCurrentThread, setCurrentThreadId, toast]);

  return {
    messages,
    threads,
    currentThread,
    isLoading,
    sendMessage,
    loadThreads,
    switchThread,
    initializeThread: initializeThreadWithMessages,
    updateThreadTitle,
    setMessages,
    deleteThread
  };
};

export default useChatbot;
