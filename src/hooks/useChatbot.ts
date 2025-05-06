import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useThreads } from "./chat/useThreads";
import { useMessages } from "./chat/useMessages";

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
        console.log("Thread initialized, loading messages for thread:", thread.thread_id);
        // Load messages for this thread
        await loadMessages(thread.thread_id);
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
      setIsLoading(true);
      await initializeThreadWithMessages(threadId);
    } catch (error) {
      console.error("Error switching thread:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger cette conversation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, initializeThreadWithMessages, toast, setIsLoading]);

  /**
   * Send a message in the current thread
   */
  const sendMessage = useCallback(async (content: string) => {
    console.log("sendMessage called with content:", content.substring(0, 30) + "...");
    if (!currentThreadId) {
      console.error("No currentThreadId available");
      return;
    }
    
    await sendMessageToThread(content, currentThreadId);
  }, [currentThreadId, sendMessageToThread]);

  // Initialize on component mount
  useEffect(() => {
    console.log("useChatbot effect running");
    console.log("user?.id =", user?.id);
    console.log("initialThreadId =", initialThreadId);
    console.log("currentThreadId =", currentThreadId);
    console.log("hasInitialized =", hasInitialized);
    
    if (user?.id && !hasInitialized) {
      console.log("Initializing only once");
      loadThreads();

      if (initialThreadId) {
        console.log("Initializing with provided threadId:", initialThreadId);
        initializeThreadWithMessages(initialThreadId);
      } else if (!currentThreadId) {
        console.log("No currentThreadId, initializing with no threadId");
        initializeThreadWithMessages();
      }

      setHasInitialized(true);
    }
  }, [user?.id, hasInitialized, initialThreadId, currentThreadId, loadThreads, initializeThreadWithMessages]);

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
    deleteThread
  };
};

export default useChatbot;
