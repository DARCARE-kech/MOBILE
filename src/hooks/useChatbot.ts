
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useThreads } from "./chat/useThreads";
import { useMessages } from "./chat/useMessages";
import { supabase } from "@/integrations/supabase/client";
import * as openaiClient from "@/utils/openaiClient";

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
   * Initialize a thread and load its messages (only for existing threads)
   */
  const initializeThreadWithMessages = useCallback(async (threadIdToUse?: string) => {
    console.log("initializeThreadWithMessages called with threadIdToUse =", threadIdToUse);
    
    if (!user?.id) {
      console.log("No user.id available, cannot initialize thread");
      return;
    }

    // Only initialize if we have a specific threadId (existing thread)
    if (!threadIdToUse) {
      console.log("No threadId provided, skipping initialization");
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

    // Create a thread only if the user sends a message and no thread exists
    if (!threadId) {
      try {
        console.log("Creating new OpenAI thread first");
        
        // Step 1: Create thread in OpenAI first
        const openaiThread = await openaiClient.createThread();
        if (!openaiThread?.id) {
          throw new Error("Failed to create OpenAI thread");
        }
        
        console.log("OpenAI thread created with ID:", openaiThread.id);
        
        // Step 2: Save thread to database using the actual OpenAI thread ID
        const { data, error } = await supabase
          .from("chat_threads")
          .insert({
            user_id: user.id,
            thread_id: openaiThread.id, // Use the actual OpenAI thread ID
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
        
        console.log("Thread created and saved successfully:", threadId);
      } catch (error) {
        console.error("Error creating thread:", error);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer une nouvelle conversation.",
          variant: "destructive"
        });
        return;
      }
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

  // Initialize only if we have a specific thread ID from URL
  useEffect(() => {
    if (user?.id && initialThreadId && !hasInitialized) {
      console.log("Initializing with specific thread ID:", initialThreadId);
      initializeThreadWithMessages(initialThreadId);
      setHasInitialized(true);
    } else if (user?.id && !initialThreadId) {
      console.log("No initial thread ID, ready for new conversation");
      setHasInitialized(true);
    }
  }, [user?.id, initialThreadId, hasInitialized, initializeThreadWithMessages]);

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
