
import { useState } from "react";
import { ChatMessage } from "@/types/chat";
import { useLoadMessages } from "./messageOperations/loadMessages";
import { useSendMessage } from "./messageOperations/sendMessage";

/**
 * Hook for managing chat messages
 */
export const useMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { loadMessages } = useLoadMessages(setMessages, setIsLoading);
  const { sendMessage } = useSendMessage(setMessages, setIsLoading);

  return {
    messages,
    isLoading,
    setIsLoading,
    loadMessages,
    sendMessage,
    setMessages
  };
};
