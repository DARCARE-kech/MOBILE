
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useThreads } from "./chat/useThreads";
import { useMessages } from "./chat/useMessages";
import { useThreadOperations } from "./chat/chatState/threadOperations";
import { useMessageOperations } from "./chat/chatState/messageOperations";
import { useInitializationLogic } from "./chat/chatState/initializationLogic";

/**
 * Main hook for managing chatbot logic
 */
export const useChatbot = (initialThreadId?: string) => {
  console.log("useChatbot initialized with initialThreadId:", initialThreadId);
  const { user } = useAuth();
  console.log("Current user:", user);
  
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

  // Initialize the composed hooks
  const { initializeThreadWithMessages } = useInitializationLogic(
    user,
    initializeThread,
    loadMessages,
    setIsLoading
  );

  const { switchThread } = useThreadOperations(
    initializeThreadWithMessages,
    setIsLoading
  );

  // Wrap sendMessage to ensure we always have a valid threadId
  const sendMessage = useCallback(async (content: string) => {
    console.log("useChatbot.sendMessage called with content:", content.substring(0, 30) + "...");
    console.log("Current threadId:", currentThreadId);
    
    if (!currentThreadId) {
      console.log("No currentThreadId available, initializing thread first");
      const thread = await initializeThreadWithMessages();
      if (thread && thread.thread_id) {
        console.log("Thread initialized, now sending message with threadId:", thread.thread_id);
        await sendMessageToThread(content, thread.thread_id);
      } else {
        console.error("Failed to initialize thread, cannot send message");
      }
    } else {
      console.log("Using existing threadId for message:", currentThreadId);
      await sendMessageToThread(content, currentThreadId);
    }
  }, [currentThreadId, initializeThreadWithMessages, sendMessageToThread]);

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
