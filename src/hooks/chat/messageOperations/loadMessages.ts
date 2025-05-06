
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage } from "@/types/chat";
import { getThreadMessages } from "@/utils/chat";

export const useLoadMessages = (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();
  
  const loadMessages = async (threadId: string) => {
    console.log(`Loading messages for thread ${threadId}`);
    try {
      setIsLoading(true);
      const threadMessages = await getThreadMessages(threadId);
      console.log("Loaded messages:", threadMessages);
      
      if (threadMessages && threadMessages.length > 0) {
        setMessages(threadMessages);
        return threadMessages;
      } else {
        console.log("No messages found for thread, setting empty array");
        setMessages([]);
      }
      return threadMessages;
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { loadMessages };
};
