
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage } from "@/types/chat";
import * as openaiClient from "@/utils/openaiClient";
import { extractAssistantOutput, getThreadMessages } from "@/utils/chatUtils";

/**
 * Hook for managing chat messages
 */
export const useMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Loads messages for a specific thread
   */
  const loadMessages = useCallback(async (threadId: string) => {
    console.log(`Loading messages for thread ${threadId}`);
    try {
      const threadMessages = await getThreadMessages(threadId);
      console.log("Loaded messages:", threadMessages);
      setMessages(threadMessages);
      return threadMessages;
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive"
      });
      return [];
    }
  }, [toast]);

  /**
   * Sends a message to the assistant and processes the response
   */
  const sendMessage = useCallback(async (content: string, threadId: string) => {
    console.log(`sendMessage called with content: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);
    console.log("Current user?.id =", user?.id);
    console.log("ThreadId =", threadId);
    
    if (!user?.id) {
      console.error("No user ID available");
      return;
    }
    
    if (!threadId) {
      console.error("No threadId available");
      return;
    }
    
    if (!content.trim()) {
      console.error("Content is empty");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Save user message to Supabase
      console.log("Saving user message to Supabase");
      const userMessageResult = await supabase.from("chat_messages").insert({
        thread_id: threadId,
        content: content.trim(),
        sender: "user"
      });
      
      if (userMessageResult.error) {
        console.error("Error saving user message to Supabase:", userMessageResult.error);
        throw userMessageResult.error;
      }
      
      console.log("User message saved to Supabase");
      
      // Add user message immediately to state for instant display
      const optimisticUserMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        thread_id: threadId,
        content: content.trim(),
        sender: "user",
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, optimisticUserMessage]);

      // Step 2: Add user message to OpenAI API
      console.log(`Adding message to OpenAI thread ${threadId}`);
      const messageResponse = await openaiClient.addMessage(threadId, content);
      
      if (!messageResponse) {
        console.error("messageResponse is undefined or null");
        throw new Error("Failed to send message to OpenAI");
      }
      
      console.log("Message added to OpenAI, response:", messageResponse);

      // Step 3: Run assistant on thread
      console.log(`Running assistant on thread ${threadId}`);
      const runResponse = await openaiClient.runAssistant(threadId);
      
      if (!runResponse || !runResponse.id) {
        console.error("runResponse is missing or has no id:", runResponse);
        throw new Error("Failed to run assistant");
      }
      
      console.log("Assistant run started, runId:", runResponse.id);

      // Step 4: Wait for assistant's response
      let runStatus = await openaiClient.checkRunStatus(threadId, runResponse.id);
      console.log("Initial run status:", runStatus.status);
      
      let attempts = 0;
      const maxAttempts = 60; // Maximum attempts (60 seconds)
      
      while (runStatus.status !== "completed" && 
             runStatus.status !== "failed" && 
             runStatus.status !== "cancelled" &&
             attempts < maxAttempts) {
        attempts++;
        // Wait 1 second before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openaiClient.checkRunStatus(threadId, runResponse.id);
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

      // Step 5: Get run steps to obtain assistant's message
      console.log(`Getting run steps to find assistant message`);
      const runStepsResponse = await openaiClient.getRunOutput(threadId, runResponse.id);
      console.log("Run steps response:", runStepsResponse);
      
      const assistantContent = extractAssistantOutput(runStepsResponse);
      console.log("Extracted assistant content:", assistantContent);

      if (assistantContent) {
        // Step 6: Save assistant's response to Supabase
        console.log("Saving assistant message to Supabase");
        const assistantMessageResult = await supabase.from("chat_messages").insert({
          thread_id: threadId,
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

      // Step 7: Update thread timestamp
      console.log("Updating thread timestamp");
      await supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("thread_id", threadId);
      console.log("Thread timestamp updated");

      // Step 8: Reload messages from Supabase
      console.log("Reloading messages from Supabase");
      const updatedMessages = await getThreadMessages(threadId);
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
  }, [user?.id, toast]);

  return {
    messages,
    isLoading,
    setIsLoading,
    loadMessages,
    sendMessage,
    setMessages
  };
};
