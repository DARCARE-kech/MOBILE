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
   * Initialize a thread and load its messages if a threadId is provided
   * Otherwise, don't create a thread until the user sends a message
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
      
      // Only initialize thread if threadId is provided (existing thread)
      // Otherwise, we'll create a thread when the user sends their first message
      if (threadIdToUse) {
        // Initialize thread
        const thread = await initializeThread(threadIdToUse);
        
        if (thread) {
          // Load messages for this thread
          const loadedMessages = await loadMessages(thread.thread_id);
          console.log("Loaded messages in initializeThreadWithMessages:", loadedMessages ? loadedMessages.length : 0, "messages");
        }
      } else {
        console.log("No threadId provided, will create thread when user sends first message");
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
   * Send a message in the current thread or create a new thread if needed
   */
  const sendMessage = useCallback(async (content: string) => {
    if (currentThreadId) {
      await sendMessageToThread(content, currentThreadId);
    } else {
      try {
        // Create a new thread only when user sends their first message
        if (!user?.id) {
          console.log("No user.id available, cannot create thread");
          return;
        }
        
        console.log("Creating new thread for first message");
        const { createNewThread } = await import('@/utils/chatUtils');
        const newThread = await createNewThread(user.id);
        
        if (newThread) {
          setCurrentThread(newThread);
          setCurrentThreadId(newThread.thread_id);
          await sendMessageToThread(content, newThread.thread_id);
        }
      } catch (error) {
        console.error("Error creating thread for first message:", error);
        toast({
          title: "Error",
          description: "Failed to start conversation. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [currentThreadId, sendMessageToThread, user?.id, setCurrentThread, setCurrentThreadId, toast]);

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
      }
      // If no initialThreadId, we don't create a thread until user sends message

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
