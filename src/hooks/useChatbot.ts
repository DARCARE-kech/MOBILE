
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  getOrCreateThread, 
  saveChatMessage, 
  getThreadMessages,
  getUserThreads,
  updateThreadTitle,
  deleteThread,
  extractMessageContent
} from "@/utils/chatUtils";
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

  // Load user threads
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

  // Get or create thread for current user
  const initializeThread = useCallback(async (existingThreadId?: string) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      let thread;

      if (existingThreadId) {
        // Get existing thread
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
        // Get or create new thread
        thread = await getOrCreateThread(user.id);
      }

      setCurrentThread(thread);
      setCurrentThreadId(thread.thread_id);

      // Load messages for this thread
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

  // Poll for run completion and get assistant response
  const pollRunStatus = useCallback(async (threadId: string, runId: string) => {
    try {
      const { data: runData } = await supabase.functions.invoke("openai-assistant", {
        body: { action: "checkRun", threadId, runId }
      });

      if (runData.status === "completed") {
        // Clear polling interval
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }

        // Get the messages from the thread
        const { data: messagesData } = await supabase.functions.invoke("openai-assistant", {
          body: { action: "getMessages", threadId }
        });

        // Find the last assistant message
        const latestAssistantMessage = messagesData.data.find((msg: any) => msg.role === "assistant");

        if (latestAssistantMessage) {
          const content = extractMessageContent(latestAssistantMessage);
          
          // Save the assistant message to our database
          await saveChatMessage(threadId, content, "assistant");

          // Refresh the messages
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

  // Send a message to the assistant
  const sendMessage = useCallback(async (content: string) => {
    if (!user?.id || !currentThreadId || !content.trim()) return;

    try {
      setIsLoading(true);

      // Save user message to database
      await saveChatMessage(currentThreadId, content, "user");

      // Refresh messages to include the user message
      const updatedMessages = await getThreadMessages(currentThreadId);
      setMessages(updatedMessages);

      // Send message to OpenAI via edge function
      const { data: messageData } = await supabase.functions.invoke("openai-assistant", {
        body: { 
          action: "addMessage", 
          threadId: currentThreadId, 
          message: content 
        }
      });

      if (!messageData || !messageData.id) {
        throw new Error("Failed to send message to OpenAI");
      }

      // Run the assistant on the thread
      const { data: runData } = await supabase.functions.invoke("openai-assistant", {
        body: { action: "runAssistant", threadId: currentThreadId }
      });

      if (!runData || !runData.id) {
        throw new Error("Failed to run assistant");
      }

      // Update the thread's updated_at timestamp
      await supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("thread_id", currentThreadId);

      // Setup polling to check run status
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

  // Change current thread
  const switchThread = useCallback(async (threadId: string) => {
    if (!user?.id) return;
    
    try {
      // Get thread
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

      // Load messages for this thread
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

  // Handle thread title update
  const updateThreadTitleHandler = useCallback(async (id: string, title: string) => {
    if (!title.trim()) return false;
    
    try {
      const success = await updateThreadTitle(id, title);
      if (success) {
        await loadThreads();
        if (currentThread?.id === id) {
          setCurrentThread(prev => prev ? { ...prev, title } : null);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating thread title:", error);
      return false;
    }
  }, [loadThreads, currentThread]);

  // Handle thread deletion
  const deleteThreadHandler = useCallback(async (id: string) => {
    try {
      const success = await deleteThread(id);
      if (success) {
        await loadThreads();
        if (currentThread?.id === id) {
          setCurrentThread(null);
          setCurrentThreadId(null);
          setMessages([]);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting thread:", error);
      return false;
    }
  }, [loadThreads, currentThread]);

  // Initialize on component mount
  useEffect(() => {
    if (user?.id) {
      loadThreads();
      
      if (initialThreadId) {
        initializeThread(initialThreadId);
      } else if (!currentThreadId) {
        initializeThread();
      }
    }
    
    // Cleanup polling interval on unmount
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
    updateThreadTitle: updateThreadTitleHandler,
    deleteThread: deleteThreadHandler
  };
};

export default useChatbot;
